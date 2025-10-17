module.exports = {
  config: {
    name: "antibad",
    aliases: ["nogali", "antigali"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "গালাগালি ডিটেক্ট করে রিপ্লাই দেয়",
    longDescription: "কেউ গালি দিলে বট রিপ্লাই দেবে গালাগালি বন্ধ করার জন্য",
    category: "moderation",
  },

  onChat: async function ({ api, event }) {
    const badWords = [
      "madarchod",
      "chod",
      "fuck",
      "gandu",
      "randi",
      "kutta",
      "haraam",
      "bitch",
      "bastard",
      "গাধা",
      "চোদ",
      "হারামি",
      "রান্দি",
      "মাগি",
      "চুতমারানি",
      "বেশ্যা",
      "চুদি",
      "চুদি",
      "চুদের",
      "চুদ",
    ];

    const message = event.body?.toLowerCase();
    if (!message) return;

    // গালি চেক করা
    for (const word of badWords) {
      if (message.includes(word)) {
        api.sendMessage(
          "🚫 গালাগালি করোনা ভাই 😇\nএটা গালির জায়গা নয়!\nগালি দিয়ে নিজের বস্তির পরিচয় দিয়ো না 💭",
          event.threadID,
          event.messageID
        );
        break;
      }
    }
  },
};
