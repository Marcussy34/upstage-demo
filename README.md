# Document Parser Demo

A Next.js application that demonstrates document parsing using the Upstage Document Parsing API. This project allows users to upload documents (PDF, PNG, JPG) and view the parsed content in multiple formats.

## Features

- Upload and parse documents (PDF, PNG, JPG)
- View parsed results in three formats:
  - Rendered HTML output
  - Raw HTML with syntax highlighting
  - Plain text output
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
│   │   └── parse.js        # API route for Upstage integration
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
   Then replace `your_api_key_here` with your actual Upstage API key.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the landing page.
6. Navigate to [http://localhost:3000/document-parser](http://localhost:3000/document-parser) to use the document parser.

## Environment Variables

The following environment variables are required:

- `UPSTAGE_API_KEY`: Your Upstage API key for document parsing

You can find an example configuration in `.env.example`. Copy this file to `.env.local` and update the values with your actual API key.

## API Integration

The application uses Upstage's Document Parsing API:
- Endpoint: `https://api.upstage.ai/v1/document-digitization`
- Supported file types: PDF, PNG, JPG
- Maximum file size: 50MB

## Component Structure

- **DocumentParser**: Main component that manages state and coordinates other components
- **FileUpload**: Handles file selection and upload form
- **OutputSection**: Displays parsed results in multiple formats
- **LoadingIndicator**: Shows loading state during parsing

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Upstage Document Parsing API](https://api.upstage.ai/v1/document-digitization)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Remember to set up your environment variables in your Vercel project settings.
