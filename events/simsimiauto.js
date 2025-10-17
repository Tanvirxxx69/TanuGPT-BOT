const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "simiMemory.json");

// প্রথমবার ফাইল না থাকলে তৈরি করা
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));

module.exports = {
  config: {
    name: "simi",
    aliases: ["simsimi", "chat"],
    version: "2.0",
    author: "Tanvir",
    shortDescription: "SimSimi টাইপ রিপ্লাই বট 😎",
    longDescription: "যেকোনো নাম দিলে তার মজার রিপ্লাই দিবে, আর নতুন নাম মনে রাখবে 😏",
    category: "fun",
    guide: {
      bn: "{p}simi [নাম]\nযেমন: /simi তানভীর",
    },
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const name = args.join(" ").trim().toLowerCase();

    if (!name) {
      return api.sendMessage(
        "😺 দয়া করে একটা নাম দিন ভাই!\nউদাহরণ: /simi তানভীর",
        threadID,
        messageID
      );
    }

    try {
      let memory = JSON.parse(fs.readFileSync(dbPath));

      // যদি নাম আগে থেকে থাকে
      if (memory[name]) {
        const replies = memory[name];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        api.sendMessage(randomReply, threadID, messageID);
      } else {
        // নতুন নাম সেভ করা
        memory[name] = [
          `${name} কে আগে চিনতাম না ভাই 😅 এখন থেকে চিনে রাখলাম।`,
          `${name}? শুনছি ভালো মানুষ নাকি 😉`,
          `${name} ভাই/আপু, কেমন আছেন আজকাল 😎`,
        ];
        fs.writeFileSync(dbPath, JSON.stringify(memory, null, 2));
        api.sendMessage(`নতুন নাম (${name}) মনে রাখলাম ভাই 😺`, threadID, messageID);
      }
    } catch (err) {
      console.error(err);
      api.sendMessage("ভাই, সিমসিমি একটু ঘুমাচ্ছে 😴 পরে চেষ্টা করেন!", threadID, messageID);
    }
  },
};
