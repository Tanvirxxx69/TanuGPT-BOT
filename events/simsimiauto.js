const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "nameMemory.json");

// মেমোরি ফাইল না থাকলে তৈরি করো
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));

module.exports = {
  config: {
    name: "simsimiAutoReply",
    eventType: ["message"],
    version: "2.0",
    author: "Tanvir",
    description: "SimSimi স্টাইল অটো নাম/চ্যাট রিপ্লাই, অটো শিখবে 🧠",
  },

  onEvent: async function ({ api, event }) {
    try {
      const { body, senderID, threadID } = event;
      if (!body) return;
      const text = body.toLowerCase();

      if (senderID === api.getCurrentUserID()) return;

      // ডেটা লোড
      let memory = JSON.parse(fs.readFileSync(dbPath));

      // নামগুলো চেক করা
      const found = Object.keys(memory).find(name => text.includes(name.toLowerCase()));

      if (found) {
        const replies = memory[found];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        api.sendMessage(randomReply, threadID);
      } else {
        // যদি নতুন নাম হয়, তাহলে সংরক্ষণ
        memory[text] = [
          `${text} কে চিনি না ভাই, কিন্তু এখন থেকে চিনে রাখলাম 😅`,
          `${text}? ওরে ভাই, এই নামটা নতুন মনে হচ্ছে 😏`,
          `${text} ভাই আজ ভালো আছেন তো? 😉`,
        ];
        fs.writeFileSync(dbPath, JSON.stringify(memory, null, 2));
        api.sendMessage(`এই নামটা (${text}) মনে রাখলাম ভাই 😎`, threadID);
      }
    } catch (e) {
      console.error(e);
    }
  },
};
