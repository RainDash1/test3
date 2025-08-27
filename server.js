import express from "express";
import fetch from "node-fetch"; // Node 18+ can use global fetch
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Allow all origins (for testing/proxy use)
app.use(cors());
app.use(express.json());

// Proxy endpoint
app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send("No URL provided");
    }

    try {
        const response = await fetch(targetUrl);
        let contentType = response.headers.get("content-type");
        res.setHeader("Content-Type", contentType);

        const body = await response.text();
        res.send(body);
    } catch (err) {
        res.status(500).send("Error fetching target URL: " + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send(`
        <h2>Web Proxy is Running!</h2>
        <p>Use <code>/proxy?url=YOUR_URL</code> to load a website.</p>
        <p>Example: <a href="/proxy?url=https://example.com">/proxy?url=https://example.com</a></p>
    `);
});

