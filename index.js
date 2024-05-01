import express from 'express';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Route for sentiment analysis
app.post('/analyze', async (req, res) => {
  const text = req.body.text;
  try {
    const { stdout } = await execAsync(`python analyzer.py "${text.replace(/"/g, '\\"')}"`);
    res.send({ sentiment: stdout.trim() });
  } catch (error) {
    console.error(`exec error: ${error}`);
    res.status(500).send('Error processing sentiment analysis');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
