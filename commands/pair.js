const fs = require("fs");

module.exports = {
  config: {
    name: "pair",
    aliases: ["couple", "love"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "Pair system — দুজনের ভালোবাসার ℅ দেখাবে",
    longDescription: "গ্রুপে /pair দিলে এলোমেলোভাবে একজনের সাথে আরেকজনকে জোড়া বানাবে ও ভালোবাসার ℅ দেখাবে",
    category: "fun",
    guide: {
      en: "{p}pair — কারো সাথে pair করো 😍",
    },
  },

  onStart: async function ({ api, event, Users }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());

      if (members.length < 2) {
        return api.sendMessage("💔 Pair করার মতো সদস্য কম আছে!", event.threadID);
      }

      // র‍্যান্ডম দুইজন ইউজার
      const person1 = members[Math.floor(Math.random() * members.length)];
      let person2 = members[Math.floor(Math.random() * members.length)];
      while (person1 === person2) {
        person2 = members[Math.floor(Math.random() * members.length)];
      }

      const name1 = (await api.getUserInfo(person1))[person1].name;
      const name2 = (await api.getUserInfo(person2))[person2].name;

      // ভালোবাসার হার (random %)
      const lovePercent = Math.floor(Math.random() * 100) + 1;

      // সুন্দর মেসেজ
      const loveText = [
        "❤️ স্বর্গে বানানো জুটি!",
        "💞 আল্লাহর রহমতে চিরস্থায়ী হোক তোমাদের বন্ধন!",
        "🥰 একে অপরের চোখে স্বপ্ন দেখো!",
        "💘 তোমাদের জন্য শুভ কামনা!",
        "🌹 তোমরা সত্যিই কিউট কাপল!"
      ];
      const randomText = loveText[Math.floor(Math.random() * loveText.length)];

      const message = `💑 *আজকের Pair Result*\n\n💖 ${name1} 💞 ${name2}\n\n❤️ ভালোবাসার হারঃ ${lovePercent}%\n\n${randomText}`;
      api.sendMessage(message, event.threadID);
    } catch (e) {
      console.error(e);
      api.sendMessage("❌ কিছু সমস্যা হয়েছে, আবার চেষ্টা করো!", event.threadID);
    }
  },
};
