const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Router } = require("./Routes/Basic.Routes");
const OpenAI = require("openai");
require("dotenv").config();
const fs = require("fs");
const pdf = require("pdf-parse");
const multer = require("multer");
const app = express();
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());
app.use("/basic", Router);

app.post("/text", async (req, res) => {
  const { messages } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 1,
    max_tokens: 300,
    top_p: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
  });

  res.json({ message: response.choices[0].message });
});
app.post("/emotion", async (req, res) => {
  try {
    const { prompt, language } = req.body;
    const messages = [
      { role: "system", content: "You are a Emotion teller" },
      {
        role: "user",
        content: `convert ${prompt} which is write in this ${language} into the feelings in such feel as cool , hot , angry , tired etc in one word only`,
      },
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
      max_tokens: 200,
      // frequency_penalty: 0,
      // presence_penalty: 0,
    });
    const result = response.choices[0];
    res.send({ result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.get("/", (req, res) => {
  return res.json({ message: "You are at home" });
});
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const data = await pdf(pdfBuffer);
    const text = data.text;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      prompt: `Summarize the content of the uploaded PDF: "${text}"`,
      max_tokens: 50,
    });

    const summary = response.choices[0].text;
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.post("/text", async (req, res) => {
  const { messages } = req.body;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 1,
    n: 1,
    max_tokens: 100,
  });
  res.json({ message: response.choices[0].message.content });
});

app.post("/summarization", upload.array("files", 10), async (req, res) => {
  try {
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res
        .status(400)
        .json({ error: "Please upload at least one valid file." });
    }

    const fileContents = [];

    for (const file of uploadedFiles) {
      let content = "";
      if (file.mimetype === "text/plain") {
        content = file.buffer.toString("utf-8");
      } else if (file.mimetype === "application/pdf") {
        const pdfData = await pdf(file.buffer);
        content = pdfData.text;
      }

      fileContents.push(content);
    }
    const summaryRequest = req.body.summaryRequest;
    const messages = [
      { role: "system", content: "You are a summarization assistant." },
      {
        role: "user",
        content: "please make the summary of the content from below files",
      },
      ...fileContents.map((content) => ({ role: "user", content })),
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    res.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in /summarization route:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
