import { IncomingForm } from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming form data
    const form = new IncomingForm();
    
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // Get the uploaded file - formidable structure changed in newer versions
    const file = Array.isArray(files.document) 
      ? files.document[0] 
      : files.document;
    
    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'No file uploaded or invalid file' });
    }
    
    // Create server-side FormData
    const formData = new FormData();
    formData.append('document', fs.createReadStream(file.filepath), {
      filename: file.originalFilename || 'document.pdf',
      contentType: file.mimetype || 'application/octet-stream',
    });
    formData.append('output_formats', JSON.stringify(['html', 'text']));
    formData.append('model', 'document-parse');
    
    // Call Upstage API
    const response = await fetch('https://api.upstage.ai/v1/document-digitization', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UPSTAGE_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message || 'Failed to parse document' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error processing document:', error);
    return res.status(500).json({ error: error.message || 'Failed to process document' });
  }
} 