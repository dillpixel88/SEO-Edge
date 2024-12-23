console.log("Server script started...");
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

console.log("Express initialized...");

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());
console.log("Middleware configured...");

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '../public')));

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Test route for checking server functionality
app.post('/test', (req, res) => {
    console.log("POST request received at /test");
    res.send("Test route is working!");
});

// Route to generate AI content
app.post('/generate', async (req, res) => {
    console.log("POST request received at /generate");
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API Key is missing. Check .env configuration." });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: `Write a blog post about: ${topic}` },
                ],
                max_tokens: 1000,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Send the correct response back to the client
        const generatedText = response.data.choices[0].message.content; // Ensure correct path
        console.log(`Generated Content: ${generatedText}`);
        res.json({ text: generatedText }); // Match the key expected in the client
    } catch (error) {
        console.error("Error while calling OpenAI API:");
        if (error.response) {
            console.error(`Status Code: ${error.response.status}`);
            console.error(`Response Data: ${JSON.stringify(error.response.data)}`);
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            console.error(`Error Message: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
});

// Route to generate citations
app.post('/generate-citation', (req, res) => {
    console.log("POST request received at /generate-citation");

    const { author, title, website, date, url, style } = req.body;
    if (!author || !title || !website || !date || !url || !style) {
        console.log("Missing required fields");
        return res.status(400).send("Missing required fields: author, title, website, date, url, or style.");
    }

    let citation;
    switch (style.toLowerCase()) {
        case 'apa':
            citation = `${author}. (${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}). ${title}. ${website}. Retrieved from ${url}`;
            break;
        case 'mla':
            citation = `${author}. "${title}." ${website}, ${new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}, ${url}.`;
            break;
        case 'chicago':
            citation = `${author}. "${title}." ${website}. ${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. ${url}.`;
            break;
        default:
            return res.status(400).send("Unsupported style. Please use 'APA', 'MLA', or 'Chicago'.");
    }

    res.json({ citation });
});

// Catch-all route for unknown endpoints
app.use((req, res) => {
    res.status(404).send("Endpoint not found");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});