import express from 'express';
import cors from 'cors';
import axios from 'axios';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8010;

// Create an agent that ignores SSL errors
const httpsAgent = new https.Agent({  
  rejectUnauthorized: false 
});

app.use(cors());

// Proxy endpoint
app.use('/proxy', async (req, res) => {
  try {
    // req.url contains the rest of the path including query string
    let targetUrl = req.url.substring(1);
    
    if (!targetUrl) {
      return res.status(400).send('No URL provided');
    }

    console.log(`Proxying request to: ${targetUrl}`);

    // Prepare headers to forward
    const headers = { ...req.headers };
    // Remove headers that cause issues
    delete headers.host;
    delete headers.connection;
    delete headers['content-length'];
    
    // Add custom User-Agent if not present (though browser sends one)
    if (!headers['user-agent']) {
        headers['user-agent'] = 'Mozilla/5.0 (compatible; JSONTool/1.0)';
    }

    const response = await axios.get(targetUrl, {
      headers: headers,
      // Disable SSL verification to ensure we can proxy to anything ("bells and whistles")
      httpsAgent: httpsAgent,
      validateStatus: () => true,
      transformResponse: [data => data] // Keep raw data
    });

    // Set CORS headers for the client
    res.header('Access-Control-Allow-Origin', '*');
    
    // Forward content type
    res.header('Content-Type', response.headers['content-type']);
    
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).send(error.message);
  }
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, '../dist')));

// SPA Fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/proxy')) return; // Don't intercept proxy
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
