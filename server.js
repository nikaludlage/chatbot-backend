import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

// Laad de .env variabelen
dotenv.config();

// Debug: checkt of de API key is gevonden
console.log("API key gevonden?", !!process.env.OPENAI_API_KEY);

// Pak de API key uit de .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ Geen OPENAI_API_KEY gevonden in .env bestand!");
  process.exit(1); // stop de server als er geen key is
}

const app = express();
app.use(cors());            // Sta frontend requests toe
app.use(bodyParser.json()); // Parse JSON requests

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini", 
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenAI API error:", errorText);
      return res.status(500).send("Error calling OpenAI API");
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).send("Error calling OpenAI");
  }
});

// Start de server
app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));
