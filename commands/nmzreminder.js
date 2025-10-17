const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "namaz",
    aliases: ["prayer", "namaztime"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "নামাজ রিমাইন্ডার ও আজান নোটিফিকেশন",
    longDescription: "বাংলাদেশ সময় অনুযায়ী নামাজের সময় জানায় ও মনে করিয়ে দেয়",
    category: "islamic",
  },

  onStart: async function ({ api, event, args }) {
    try {
      // ব্যবহারকারীর জিজ্ঞেস করা জায়গা
      const location = args.join(" ") || "Dhaka";
      const country = "Bangladesh";

      // সময় আনো
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?city=${location}&country=${country}&method=2`
      );

      const timings = response.data.data.timings;

      const msg = `
🕌 *${location}, ${country}* এর নামাজের সময়সূচি 🕒

🌅 ফজরঃ ${timings.Fajr}
🌞 যোহরঃ ${timings.Dhuhr}
🌇 আসরঃ ${timings.Asr}
🌆 মাগরিবঃ ${timings.Maghrib}
🌙 এশাঃ ${timings.Isha}

⏰ সময় অনুযায়ী নামাজ আদায় করুন ভাই, আল্লাহ বরকত দিন 🤲
`;

      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "দুঃখিত ভাই 😢 নামাজের সময় আনা যায়নি। একটু পর আবার চেষ্টা করুন।",
        event.threadID,
        event.messageID
      );
    }
  },
};
