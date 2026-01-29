import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateAIResponse } from './ai.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORY_PATH = path.join(__dirname, 'data', 'story.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    console.log('Incoming chat request:', req.body.message);
    try {
        const { message, selectedCar, currentScene, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await generateAIResponse({
            message,
            selectedCar,
            currentScene,
            history
        });

        res.json({ response });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// Story endpoints
app.get('/api/story', async (req, res) => {
    try {
        const data = await fs.readFile(STORY_PATH, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading story:', error);
        res.status(500).json({ error: 'Failed to load story' });
    }
});

app.put('/api/story', async (req, res) => {
    try {
        const storyData = req.body;
        await fs.writeFile(STORY_PATH, JSON.stringify(storyData, null, 4));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving story:', error);
        res.status(500).json({ error: 'Failed to save story' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
