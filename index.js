import "dotenv/config";
import axios from "axios";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import moment from "moment-timezone";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(chalk.greenBright("[✅] TanuGPT-BOT is starting..."));

async function chatWithGPT(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(chalk.red("[❌] Error:"), error.message);
    return "Sorry, something went wrong.";
  }
}

(async () => {
  const reply = await chatWithGPT("Hello, TanuGPT!");
  console.log(chalk.cyanBright("🤖 Reply:"), reply);
})();

// 🕒 Keep alive
setInterval(() => {
  console.log(chalk.yellow("⏳ Bot is still running..."));
}, 60000); // প্রতি ১ মিনিটে প্রিন্ট করবে
