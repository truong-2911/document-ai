import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const file = req.files.file; // Assuming you're using 'formidable' for file uploads
      const filePath = path.join(__dirname, file.name);
      fs.writeFileSync(filePath, file.data);

      // Initialize Google Cloud Document AI client
      const client = new google.documentai_v1.DocumentUnderstandingServiceClient();

      // Your Google Cloud Document AI processor ID
      const processorId = '97b4eea3b1683e97';

      const request = {
        name: `projects/document-ai-431800/locations/us/processors/${processorId}`,
        rawDocument: {
          content: fs.readFileSync(filePath).toString('base64'),
          mimeType: 'application/pdf',
        },
      };

      const [result] = await client.processDocument(request);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
