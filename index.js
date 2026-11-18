import express from 'express';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// execFile runs the analyzer directly, with the text as one argument: no shell parses it.
const execFileAsync = promisify(execFile);
const MAX_TEXT_LENGTH = 5000;

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
  if (typeof text !== 'string' || text.length === 0 || text.length > MAX_TEXT_LENGTH) {
    return res.status(400).send(`text must be a string of 1 to ${MAX_TEXT_LENGTH} characters`);
  }
  try {
    const { stdout } = await execFileAsync('python', [path.join(__dirname, 'analyzer.py'), text],
                                           { timeout: 10000, maxBuffer: 64 * 1024 });
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
