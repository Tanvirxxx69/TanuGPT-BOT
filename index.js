import express from "express";
import axios from "axios";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import moment from "moment-timezone";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const botName = process.env.BOT_NAME || "TanuGPT";
const prefix = process.env.PREFIX || "/";
const timezone = process.env.TIMEZONE || "Asia/Dhaka";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(chalk.green.bold(`✅ ${botName} Bot is now running on port ${PORT}...`));

app.get("/", (req, res) => {
  res.send(`🤖 ${botName} is running successfully!`);
});

app.get("/chat", async (req, res) => {
  const msg = req.query.msg || "Hello";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: msg }],
    });
    const reply = completion.choices[0].message.content;
    res.send(`💬 ${reply}`);
  } catch (error) {
    console.error(chalk.red("❌ Error:"), error.message);
    res.send("❌ API Error");
  }
});

app.get("/time", (req, res) => {
  const time = moment().tz(timezone).format("hh:mm A, dddd, DD MMMM YYYY");
  res.send(`🕒 Current time in ${timezone}: ${time}`);
});

app.listen(PORT, () => {
  console.log(chalk.blueBright(`🌐 Server is live on port ${PORT}`));
});
