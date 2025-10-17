import axios from "axios";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import moment from "moment-timezone";
import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";

dotenv.config();

// 🔰 ENV Variables
const botName = process.env.BOT_NAME || "TanuGPT";
const ownerName = process.env.OWNER_NAME || "Tanvir Ankhon";
const prefix = process.env.PREFIX || "/";
const timezone = process.env.TIMEZONE || "Asia/Dhaka";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Bot Started
console.log(chalk.greenBright(`[✅] ${botName} Bot is starting...`));

// 🕌 Azan voice file
const azanFile =
  "https://cdn.pixabay.com/download/audio/2022/03/29/audio_5cfad2b6e4.mp3?filename=azan-110997.mp3";

// 🧠 Commands List
const commands = {
  help: "List all available commands",
  time: "Show current time",
  azan: "Play azan sound",
  about: "Show bot info",
  ai: "Talk with GPT AI",
};

// 📢 Message sender (console simulate)
function sendMessage(user, message) {
  console.log(chalk.cyan(`[${user}] ➤ ${message}`));
}

// 🥸 Emoji Reactions
function emojiReact(emoji) {
  const reactions = {
    "😒": "কি হলো এভাবে তাকাচ্ছো কেনো?",
    "🙂": "কি জান, সেন্টি খাচ্ছো নাকি?",
    "💋": "ইশ! চুমু দিচ্ছো নাকি!",
  };
  return reactions[emoji] || null;
}

// 🤖 ChatGPT handler
async function chatWithGPT(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error(chalk.red("[❌] GPT Error:"), err.message);
    return "দুঃখিত ভাই, এখন GPT উত্তর দিতে পারছে না।";
  }
}

// 🎯 Command Handler
async function handleMessage(user, text) {
  if (!text.startsWith(prefix)) {
    const reply = emojiReact(text.trim());
    if (reply) sendMessage(botName, reply);
    return;
  }

  const cmdBody = text.slice(1).trim();
  const [cmd, ...args] = cmdBody.split(" ");

  switch (cmd.toLowerCase()) {
    case "help":
      sendMessage(
        botName,
        `🧠 Available commands:\n${Object.keys(commands)
          .map((c) => "/" + c)
          .join(", ")}`
      );
      break;

    case "time":
      const time = moment().tz(timezone).format("hh:mm A, dddd, DD MMMM YYYY");
      sendMessage(botName, `🕒 ${timezone} সময় অনুযায়ী এখন ${time}`);
      break;

    case "azan":
      sendMessage(botName, "🕌 আজান শুরু হচ্ছে...");
      sendMessage(botName, `🔊 Audio: ${azanFile}`);
      break;

    case "about":
      sendMessage(botName, `🤖 ${botName} — তৈরি করেছেন ${ownerName}`);
      break;

    case "ai":
      if (!args.length)
        return sendMessage(botName, "✍️ কিছু লিখো যেমনঃ /ai কেমন আছো?");
      const userMsg = args.join(" ");
      sendMessage(botName, "⌛ ভাবছি একটু...");
      const gptReply = await chatWithGPT(userMsg);
      sendMessage(botName, `💬 GPT: ${gptReply}`);
      break;

    default:
      sendMessage(botName, "❌ অজানা কমান্ড! /help লিখে দেখো।");
      break;
  }
}

// 🧪 Test (demo)
handleMessage("User", "/help");
handleMessage("User", "🙂");
handleMessage("User", "/time");
handleMessage("User", "/azan");
handleMessage("User", "/ai কেমন আছো?");
handleMessage("User", "/about");

// 🌐 Express Keep-Alive Server for UptimeRobot
const app = express();
app.get("/", (req, res) => {
  res.send("✅ TanuGPT Bot is running and alive!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(chalk.yellowBright(`🚀 Server running on port ${PORT}`))
);
