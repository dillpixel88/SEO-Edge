console.log("Server script started...");
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path'); // Add path module
const app = express();
const PORT = 3000;

console.log("Express initialized...");

// Middleware to parse JSON
app.use(express.json());

console.log("Middleware configured...");

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Default route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Correct path to index.html
});

// Test route for verification
app.post('/test', (req, res) => {
    console.log("POST request received at /test");
    res.send("Test route is working!");
});

// Define the /generate POST endpoint
app.post('/generate', async (req, res) => {
    console.log("POST request received at /generate");
    const { topic } = req.body; // Extract 'topic' from the request body
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).send("API Key is missing. Check .env configuration.");
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: `Write a blog post about: ${topic}` }
                ],
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(`OpenAI API response: ${JSON.stringify(response.data)}`);
        res.json(response.data.choices[0].text);
    } catch (error) {
        console.error("Error while calling OpenAI API:");
        if (error.response) {
            console.error(`Status Code: ${error.response.status}`);
            console.error(`Response Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Error Message: ${error.message}`);
        }
        res.status(500).send({ error: error.response?.data || error.message });
    }
});

// Define the /generate-citation POST endpoint
app.post('/generate-citation', (req, res) => {
    console.log("POST request received at /generate-citation");

    const { author, title, website, date, url, style } = req.body;
    console.log(`Request body: ${JSON.stringify(req.body)}`);

    if (!author || !title || !website || !date || !url || !style) {
        console.log("Missing required fields");
        return res.status(400).send("Missing required fields: author, title, website, date, url, or style.");
    }

    let citation;
    console.log(`Received style: ${style}`);
    console.log(`Author: ${author}, Title: ${title}, Website: ${website}, Date: ${date}, URL: ${url}`);

    switch (style.toLowerCase()) {
        case 'apa':
            citation = `${author}. (${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}). ${title}. ${website}. Retrieved from ${url}`;
            console.log(`APA citation: ${citation}`);
            break;
        case 'mla':
            citation = `${author}. "${title}." ${website}, ${new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}, ${url}.`;
            console.log(`MLA citation: ${citation}`);
            break;
        case 'chicago':
            citation = `${author}. "${title}." ${website}. ${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. ${url}.`;
            console.log(`Chicago citation: ${citation}`);
            break;
        default:
            console.log(`Unsupported style: ${style}`);
            return res.status(400).send("Unsupported style. Please use 'APA', 'MLA', or 'Chicago'.");
    }

    res.json({ citation });
});

console.log("About to start the server...");
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting the server:", err);
    } else {
        console.log(`Server running at http://localhost:${PORT}`);
    }
});

// Handle 404 errors (after all routes)
app.use((req, res) => {
    res.status(404).send("Endpoint not found");
});