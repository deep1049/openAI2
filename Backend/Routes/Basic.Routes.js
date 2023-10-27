// const express = require("express");
require("dotenv").config();

// const axios = require("axios");

// const apiKey = process.env.OPENAI_API_KEY;

// const multer = require("multer");
// const fs = require("fs");
// const PdfParse = require("pdf-parse");

// const Router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Define the upload directory
//   },
//   filename: function (req, file, cb) {
//     const date = new Date();
//     cb(null, file.originalname + date.getTime());
//   },
// });

// const upload = multer({ storage: storage });
// Router.get("/", (req, res) => {
//   return res.json({ message: "You are at home" });
// });
// Router.post("/upload", upload.array("pdfFiles", 3), async (req, res) => {
//   const { files } = req;
//   const textContents = [];
//   for (const file of files) {
//     try {
//       const dataBuffer = fs.readFileSync(file.path);
//       const data = await PdfParse(dataBuffer);
//       textContents.push(data.text);
//     } catch (error) {
//       console.error("Error extracting text from PDF:", error);
//     }
//   }
//   res.json({ textContents });
// });

// module.exports = { Router };
const express = require("express");
const cors = require("cors");
// const openai = require('openai');
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const multer = require("multer");
const upload = multer();
// const app = express();
const Router = express.Router();

// Configure CORS to allow requests from your React frontend
// app.use(express.json());

// Set up your OpenAI API key
// const openaiApiKey = process.env.OPENAI_API_KEY; // Replace with your OpenAI API key
// openai.config({ apiKey : process.env.OPENAI_API_KEY });

// Define an API endpoint for file upload
Router.post("/upload", upload.single("document"), (req, res) => {
  const documentText = req.file.buffer.toString();
  res.json({ documentText });
});

// Define an API endpoint for summarization
Router.post("/summarize", async (req, res) => {
  const { documents } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: documents,
      temperature: 0,
      max_tokens: 400,
      // frequency_penalty: 0,
      // presence_penalty: 0,
    });

    res.json({ summary: response.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { Router };
