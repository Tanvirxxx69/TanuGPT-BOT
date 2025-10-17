import axios from "axios";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import moment from "moment-timezone";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log(chalk.greenBright("[✅] TanuGPT-BOT is starting..."));

async function chatWithGPT(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error(chalk.red("[❌] Error:"), err.message);
    return "Sorry, something went wrong.";
  }
}

// Example test
(async () => {
  const response = await chatWithGPT("Hello TanuGPT!");
  console.log(chalk.cyanBright("🤖 Reply:"), response);
})();
