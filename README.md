# Document Parser Demo

A Next.js application that demonstrates document parsing using the Upstage Document Parsing API and Pinecone vector database for semantic search. This project allows users to upload documents (PDF, PNG, JPG), view the parsed content in multiple formats, and stores the content as embeddings for future semantic search.

## Features

- Upload and parse documents (PDF, PNG, JPG)
- View parsed results in three formats:
  - Rendered HTML output
  - Raw HTML with syntax highlighting
  - Plain text output
- Automatic embedding generation using Upstage API
- Vector storage in Pinecone for semantic search
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
│   │   └── ingest.js       # API route for embedding and Pinecone storage
│   ├── document-parser.js  # Document parser page
│   └── index.js            # Landing page
├── .env.example            # Example environment variables template
└── .env.local             # Local environment variables (not in repo)
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

## Environment Variables

The following environment variables are required:

- `UPSTAGE_API_KEY`: Your Upstage API key for document parsing and embeddings
- `PINECONE_API_KEY`: Your Pinecone API key for vector storage
- `PINECONE_INDEX_NAME`: Name of your Pinecone index (must be 4096 dimensions)

You can find an example configuration in `.env.example`. Copy this file to `.env.local` and update the values with your actual API keys.

## API Integration

The application integrates with two APIs:

1. Upstage Document Parsing API:
   - Endpoint: `https://api.upstage.ai/v1/document-digitization`
   - Supported file types: PDF, PNG, JPG
   - Maximum file size: 50MB

2. Upstage Embedding API:
   - Endpoint: `https://api.upstage.ai/v1/embeddings`
   - Model: embedding-passage
   - Output dimension: 4096

3. Pinecone Vector Database:
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
