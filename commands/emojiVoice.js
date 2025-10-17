import axios from "axios";
import fs from "fs";
import path from "path";

export const config = {
  name: "emojiVoice",
  version: "1.0",
  author: "Tanvir Ankhon",
  description: "Responds to emojis with voice (Bangla & English)"
};

// 👇 বাংলা এবং ইংরেজি ভয়েস মেসেজ সেট
const replies = {
  "😒": {
    bn: "কি হলো এভাবে তাকাচ্ছো কেনো ভাই?",
    en: "Why are you looking like that, bro?"
  },
  "🙂": {
    bn: "কি জান সেন্টি খাচ্ছো কেনো?",
    en: "Why so emotional today?"
  },
  "💋": {
    bn: "ইশ! চুমু দিচ্ছো কি বেহায়া!",
    en: "Oh! Are you trying to kiss me?"
  },
  "😢": {
    bn: "কেনো কাঁদছো ভাই? আল্লাহ ভরসা রাখো 🤲",
    en: "Why crying? Trust Allah, everything will be okay."
  },
  "😂": {
    bn: "হাসতে হাসতে পেট ব্যাথা হয়ে যাবে ভাই!",
    en: "You’ll laugh till your stomach hurts!"
  }
};

// 🌍 ফাংশন
export async function onMessage({ api, event }) {
  const emoji = event.body.trim();
  if (!replies[emoji]) return;

  const randomLang = Math.random() > 0.5 ? "bn" : "en";
  const text = replies[emoji][randomLang];

  // Google Translate TTS (voice generator)
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${randomLang === "bn" ? "bn" : "en"}&client=tw-ob`;

  const filePath = path.join(process.cwd(), `voice_${Date.now()}.mp3`);
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, Buffer.from(response.data));

  api.sendMessage(
    {
      body: text,
      attachment: fs.createReadStream(filePath)
    },
    event.threadID,
    () => fs.unlinkSync(filePath
