const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  config: {
    name: "gf",
    aliases: ["girlfriend", "mygf"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "র‍্যান্ডম গার্লফ্রেন্ড জেনারেটর 😅",
    longDescription: "একটা সুন্দর র‍্যান্ডম মেয়ের নাম, ছবি, বয়স ও ইনফো দেখায় – মজা করার জন্য!",
    category: "fun",
    guide: "{p}gf",
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const messageID = event.messageID;

    api.setMessageReaction("💞", messageID, () => {}, true);

    try {
      // মজার র‍্যান্ডম নাম
      const names = [
        "Sadia Akter", "Mim Rahman", "Jannat Juthi", "Anika Sultana",
        "Nusrat Hossain", "Mahi Akhi", "Priya Ahmed", "Toma Rahman",
        "Moushumi Islam", "Rafia Noor"
      ];

      // শহর
      const cities = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Barisal", "Rangpur", "Comilla"];
      
      // পছন্দ/ব্যক্তিত্ব
      const personalities = [
        "হাসিখুশি মেয়ে 💫",
        "খুব আবেগপ্রবণ 💖",
        "মিষ্টি স্বভাবের 😇",
        "চুপচাপ কিন্তু ভালোবাসায় ভরা 💌",
        "অল্পতেই রাগ হয় 😅",
        "গান ভালোবাসে 🎶",
        "বেশি কেয়ার করে 💕",
        "অফেন্ড হয় কিন্তু পরে আবার হাসে 😜"
      ];

      const name = names[Math.floor(Math.random() * names.length)];
      const age = Math.floor(Math.random() * 6) + 18; // 18–23
      const city = cities[Math.floor(Math.random() * cities.length)];
      const personality = personalities[Math.floor(Math.random() * personalities.length)];

      // র‍্যান্ডম ছবি আনবো (random user API থেকে)
      const res = await axios.get("https://randomuser.me/api/?gender=female");
      const imgUrl = res.data.results[0].picture.large;

      // ডাউনলোড করে পাঠানো
      const imgData = await axios.get(imgUrl, { responseType: "arraybuffer" });
      const imgPath = path.join(__dirname, `${uuidv4()}.jpg`);
      fs.writeFileSync(imgPath, Buffer.from(imgData.data, "binary"));

      const msg = `
💞 *তোমার র‍্যান্ডম গার্লফ্রেন্ড তথ্য* 💞

👩 নাম: ${name}
🎂 বয়স: ${age}
🏙️ শহর: ${city}
✨ ব্যক্তিত্ব: ${personality}

😅 সে এখন শুধু তোমার জন্য Available! 😉
`;

      api.sendMessage({ body: msg, attachment: fs.createReadStream(imgPath) }, threadID, () => {
        fs.unlinkSync(imgPath);
      }, messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ কিছু সমস্যা হয়েছে ভাই, আবার চেষ্টা করো!", event.threadID, event.messageID);
    }
  }
};
