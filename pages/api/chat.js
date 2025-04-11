import { Pinecone } from '@pinecone-database/pinecone';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Missing required field: query' });
    }

    // 1. Generate embedding for the query
    const embeddingResponse = await fetch('https://api.upstage.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UPSTAGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: query,
        model: 'embedding-passage'
      }),
    });

    if (!embeddingResponse.ok) {
      const errorData = await embeddingResponse.json();
      throw new Error(errorData.message || 'Failed to generate query embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // 2. Query Pinecone for similar documents
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pc.index(process.env.PINECONE_INDEX_NAME);
    
    const queryResult = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true
    });

    // 3. Extract and concatenate the text from the retrieved chunks
    const contextChunks = queryResult.matches.map(match => match.metadata.text);
    const context = contextChunks.join('\n\n');

    // 4. Prepare prompt with context and query
    const prompt = `Please provide the most accurate answer based only on the following context. If the answer isn't found in the context, respond with: "The information is not present in the context."

Context: ${context}

Question: ${query}`;

    // 5. Send to Upstage LLM
    const completionResponse = await fetch('https://api.upstage.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UPSTAGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'solar-1-mini-chat',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!completionResponse.ok) {
      const errorData = await completionResponse.json();
      throw new Error(errorData.message || 'Failed to generate completion');
    }

    const completionData = await completionResponse.json();
    const answer = completionData.choices[0].message.content;

    // 6. Return the answer
    return res.status(200).json({ answer });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process chat request' 
    });
  }
} 