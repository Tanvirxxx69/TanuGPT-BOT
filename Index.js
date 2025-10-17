import axios from "axios";
import fs from "fs-extra";
import path from "path";
import moment from "moment-timezone";
import chalk from "chalk";
import play from "play-dl";
import dotenv from "dotenv";
dotenv.config();

const botName = process.env.BOT_NAME || "TanuGPT";
const prefix = process.env.PREFIX || "/";
const timezone = process.env.TIMEZONE || "Asia/Dhaka";

console.log(chalk.green.bold(`✅ ${botName} Bot is now running...`));

const commands = {
  help: "List all available commands",
  time: "Show current time",
  azan: "Play azan sound",
  about: "Show info about the bot",
};

// ইসলামিক আজান ভয়েস ফাইল
const azanFile = "https://cdn.pixabay.com/download/audio/2022/03/29/audio_5cfad2b6e4.mp3?filename=azan-110997.mp3";

function sendMessage(user, message) {
  console.log(chalk.cyan(`[${user}] ➤ ${message}`));
}

// ইমোজি রিঅ্যাকশন সিমুলেশন
function emojiReact(emoji) {
  const reactions = {
    "😒": "কি হলো এভাবে তাকাচ্ছো কেনো?",
    "🙂": "কি জান, সেন্টি খাচ্ছো নাকি?",
    "💋": "ইশ! চুমু দিচ্ছো কি বেহায়া!",
  };
  return reactions[emoji] || null;
}

// মূল হ্যান্ডলার
async function handleMessage(user, text) {
  if (!text.startsWith(prefix)) {
    const reply = emojiReact(text.trim());
    if (reply) sendMessage(botName, reply);
    return;
  }

  const cmd = text.slice(1).toLowerCase();

  switch (cmd) {
    case "help":
      sendMessage(botName, `🧠 Available commands:\n${Object.keys(commands).join(", ")}`);
      break;

    case "time":
      const time = moment().tz(timezone).format("hh:mm A, dddd, DD MMMM YYYY");
      sendMessage(botName, `🕒 Current time in ${timezone}: ${time}`);
      break;

    case "azan":
      sendMessage(botName, "🕌 আজান শুরু হচ্ছে...");
      sendMessage(botName, `🔊 Audio: ${azanFile}`);
      break;

    case "about":
      sendMessage(botName, `🤖 ${botName} — Created by ${process.env.OWNER_NAME}`);
      break;

    default:
      sendMessage(botName, "❌ অজানা কমান্ড! /help লিখে দেখো।");
      break;
  }
}

// সিমুলেশন টেস্ট
handleMessage("User", "/help");
handleMessage("User", "🙂");
handleMessage("User", "/time");
handleMessage("User", "/azan");
handleMessage("User", "/about");
