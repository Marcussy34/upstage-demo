import { parse } from 'node-html-parser';
import { Pinecone } from '@pinecone-database/pinecone';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentId, htmlContent } = req.body;

    if (!documentId || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields: documentId and htmlContent' });
    }

    // Parse HTML and extract text chunks
    const root = parse(htmlContent);
    const elements = root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, pre, blockquote, table, tr');
    
    // Extract text from elements and filter out empty strings
    const chunks = elements
      .map(el => {
        // Special handling for table elements
        if (el.tagName.toLowerCase() === 'table') {
          // Get all rows including headers
          const rows = el.querySelectorAll('tr');
          const tableText = rows.map(row => {
            const cells = row.querySelectorAll('td, th');
            return cells.map(cell => cell.text.trim()).join('\t');
          }).join('\n');
          return {
            text: tableText,
            tag: 'table'
          };
        }
        
        return {
          text: el.text.trim(),
          tag: el.tagName.toLowerCase()
        };
      })
      .filter(chunk => chunk.text.length > 0);

    if (chunks.length === 0) {
      return res.status(400).json({ error: 'No text content found in HTML' });
    }

    // Generate embeddings in batches of 100
    const batchSize = 100;
    const allEmbeddings = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchChunks = chunks.slice(i, i + batchSize).map(chunk => chunk.text);
      
      const response = await fetch('https://api.upstage.ai/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.UPSTAGE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: batchChunks,
          model: 'embedding-passage'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate embeddings');
      }

      const data = await response.json();
      allEmbeddings.push(...data.data);
    }

    // Initialize Pinecone with the correct configuration
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Get the index instance
    const index = pc.index(process.env.PINECONE_INDEX_NAME);

    // Prepare vectors with improved metadata
    const vectors = allEmbeddings.map((embedding, idx) => ({
      id: `${documentId}_${idx}`,
      values: embedding.embedding,
      metadata: {
        text: chunks[idx].text,
        tag: chunks[idx].tag,
        documentId,
        chunkIndex: idx,
        timestamp: new Date().toISOString()
      }
    }));

    // Upsert vectors to Pinecone in batches
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batchVectors = vectors.slice(i, i + batchSize);
      await index.upsert(batchVectors);
    }

    // Wait briefly for eventual consistency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get index stats to confirm upsert
    const stats = await index.describeIndexStats();

    return res.status(200).json({ 
      success: true, 
      chunksProcessed: chunks.length,
      indexStats: stats
    });
  } catch (error) {
    console.error('Error ingesting document:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to ingest document' 
    });
  }
} 