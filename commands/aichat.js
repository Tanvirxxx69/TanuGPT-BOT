const axios = require("axios");

module.exports = {
  config: {
    name: "chat",
    aliases: ["c", "auto", "bot"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "বাংলা ও ইংরেজিতে অটো রিপ্লাই",
    longDescription: "ইউজার যে ভাষায় মেসেজ করবে, সেই ভাষায় উত্তর দিবে",
    category: "ai",
    guide: {
      en: "{p}chat [message]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("💬 বলো ভাই, কি জানতে চাও?", event.threadID, event.messageID);
    }

    const userName = event.senderName || "বন্ধু";
    const lang = /[অ-হ]/.test(prompt) ? "bn" : "en"; // বাংলা নাকি ইংরেজি চেক করবে

    api.setMessageReaction("💭", event.messageID, () => {}, true);

    try {
      // 🔹 তোমার ফ্রি সার্ভার (OpenAI ছাড়া)
      const response = await axios.get(
        `https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(prompt)}&botname=TanvirBot&ownername=Tanvir&user=${userName}&language=${lang}`
      );

      const reply = response.data.message;
      api.sendMessage(reply, event.threadID, event.messageID);
    } catch (e) {
      api.sendMessage("😔 ভাই, একটু সমস্যা হলো! পরে আবার চেষ্টা করো।", event.threadID, event.messageID);
    }
  },
};
