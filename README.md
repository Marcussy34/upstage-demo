# Document Parser Demo with RAG Chatbot

A Next.js application that demonstrates document parsing and RAG (Retrieval-Augmented Generation) chatbot capabilities using Upstage APIs and Pinecone vector database. This project allows users to upload documents, parse them, and interact with the content through a semantic search-powered chatbot.

## Features

- Upload and parse documents (PDF, PNG, JPG)
- View parsed results in three formats:
  - Rendered HTML output
  - Raw HTML with syntax highlighting
  - Plain text output
- Automatic embedding generation using Upstage API
- Vector storage in Pinecone for semantic search
- RAG Chatbot interface for document interaction
- Dark theme UI for better readability
- Real-time error handling and validation
- Secure API key handling through environment variables

## Project Structure

```
├── components/
│   └── DocumentParser/
│       ├── DocumentParserComponent.js  # Main component with state management
│       ├── FileUpload.js              # File input and form handling
│       ├── OutputSection.js           # Parsed content display
│       └── LoadingIndicator.js
├── pages/
│   ├── api/
│   │   ├── parse.js        # API route for Upstage document parsing
│   │   ├── ingest.js       # API route for embedding and Pinecone storage
│   │   └── chat.js         # API route for RAG chatbot
│   ├── document-parser.js  # Document parser page
│   ├── chatbot.js         # RAG chatbot interface
│   └── index.js           # Landing page
├── .env.example           # Example environment variables template
└── .env.local            # Local environment variables (not in repo)
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Then add your API keys and configuration:
   ```
   UPSTAGE_API_KEY=your_upstage_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_index_name
   ```

4. Create a Pinecone index:
   - Sign up for a Pinecone account
   - Create a new index with:
     - Dimension: 4096 (matches Upstage's embedding-passage model)
     - Metric: Cosine
     - Type: Dense

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the landing page.
7. Navigate to [http://localhost:3000/document-parser](http://localhost:3000/document-parser) to use the document parser.
8. Navigate to [http://localhost:3000/chatbot](http://localhost:3000/chatbot) to interact with the RAG chatbot.

## How It Works

### Document Processing Pipeline

1. **Document Upload & Parsing**
   - User uploads a document through the interface
   - Document is sent to Upstage Document Parsing API
   - API returns parsed HTML content

2. **Content Embedding**
   - Parsed HTML is split into meaningful chunks
   - Each chunk is embedded using Upstage Embedding API
   - Embeddings are stored in Pinecone with metadata

### RAG Chatbot Pipeline

1. **Query Processing**
   - User submits a question
   - Question is embedded using Upstage Embedding API
   - Embedding is used to search Pinecone for relevant chunks

2. **Context Retrieval**
   - Top 5 most similar chunks are retrieved from Pinecone
   - Chunks are combined to form context

3. **Answer Generation**
   - Context and question are sent to Upstage LLM
   - LLM generates answer based solely on provided context
   - If answer isn't in context, system indicates this

## Environment Variables

The following environment variables are required:

- `UPSTAGE_API_KEY`: Your Upstage API key for document parsing, embeddings, and chat
- `PINECONE_API_KEY`: Your Pinecone API key for vector storage
- `PINECONE_INDEX_NAME`: Name of your Pinecone index (must be 4096 dimensions)

## API Integration

The application integrates with three Upstage APIs:

1. Document Parsing API:
   - Endpoint: `https://api.upstage.ai/v1/document-digitization`
   - Supported file types: PDF, PNG, JPG
   - Maximum file size: 50MB

2. Embedding API:
   - Endpoint: `https://api.upstage.ai/v1/embeddings`
   - Model: embedding-passage
   - Output dimension: 4096

3. Chat Completions API:
   - Endpoint: `https://api.upstage.ai/v1/chat/completions`
   - Model: solar-1-mini-chat
   - Used for RAG responses

4. Pinecone Vector Database:
   - Index type: Dense vectors
   - Dimension: 4096
   - Distance metric: Cosine similarity

## Component Structure

- **DocumentParser**: Main component that manages state and coordinates other components
- **FileUpload**: Handles file selection and upload form
- **OutputSection**: Displays parsed results in multiple formats
- **LoadingIndicator**: Shows loading state during parsing

## Data Flow

1. User uploads a document
2. Document is parsed using Upstage Document Parsing API
3. Parsed HTML content is split into chunks
4. Chunks are embedded using Upstage Embedding API
5. Embeddings are stored in Pinecone with metadata
6. Results are displayed to the user

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Upstage Document Parsing API](https://api.upstage.ai/v1/document-digitization)
- [Upstage Embedding API](https://api.upstage.ai/v1/embeddings)
- [Pinecone Documentation](https://docs.pinecone.io)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Remember to set up your environment variables in your Vercel project settings.
