import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/upload', async (req, res) => {
  const { filename, content } = req.body;

  if (!filename || !content) {
    return res.status(400).json({ success: false, message: 'Arquivo inválido.' });
  }

  const url = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/${process.env.UPLOAD_PATH}/${filename}`;

  const payload = {
    message: `Upload via TomDownload`,
    content: content,
    committer: {
      name: "TomUploader",
      email: "tom@thomasdevsite.github.io"
    }
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      res.json({ success: true, url: data.content.download_url });
    } else {
      res.status(500).json({ success: false, message: data.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro interno.' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Backend TomDownload rodando na porta 3000');
});
