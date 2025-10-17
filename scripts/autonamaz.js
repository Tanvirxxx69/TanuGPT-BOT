const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "autonamaz",
    aliases: ["prayertime", "namazauto"],
    version: "2.0",
    author: "Tanvir",
    shortDescription: "অটো নামাজ রিমাইন্ডার (৫ ওয়াক্ত নামাজের সময় ঘোষণা দেয়)",
    longDescription: "বাংলাদেশ সময় অনুযায়ী ৫ ওয়াক্ত নামাজের সময় মনে করিয়ে দেয় এবং সব গ্রুপে অটো বার্তা পাঠায়",
    category: "islamic",
  },

  onStart: async function ({ api }) {
    const timezone = "Asia/Dhaka";

    // 📅 নামাজের সময়সূচি (তুমি চাইলে এগুলো বদলাতে পারো)
    const prayerTimes = {
      Fajr: "04:45",
      Dhuhr: "12:05",
      Asr: "15:30",
      Maghrib: "17:45",
      Isha: "19:15",
    };

    // 🌙 প্রতিটি নামাজের জন্য আলাদা মেসেজ
    const prayerMessages = {
      Fajr: [
        "🌅 ফজরের সময় হয়েছে ভাই 🌙\n\n🕌 উঠুন, ওযু করুন, নামাজ আদায় করুন।\nআল্লাহ যেন আজকের দিনটা বরকতময় করেন 🤲",
        "🕌 *ফজরের সময়!* আল্লাহর ডাকে সাড়া দিন 🌄\nআজকের দিন শুরু হোক নামাজ দিয়ে।",
      ],
      Dhuhr: [
        "🌞 যোহরের সময় হয়েছে!\nদুনিয়ার কাজ একটু থামিয়ে নামাজে আসুন 🤲",
        "🕌 *যোহর নামাজের সময়!*\nকাজের ব্যস্ততা বাদ দিন, আল্লাহর স্মরণে আসুন।",
      ],
      Asr: [
        "🌇 আসরের সময় হয়েছে!\nআল্লাহর সন্তুষ্টির জন্য নামাজ আদায় করুন 💚",
        "🕌 *আসরের সময়!* দিনশেষে আমল দিয়ে বরকত নিন ☀️",
      ],
      Maghrib: [
        "🌆 মাগরিবের সময় হয়েছে!\nসন্ধ্যার এই বরকতময় সময়ে নামাজে দাড়ান 🕌",
        "🕌 *মাগরিবের নামাজের সময়!*\nআল্লাহর রহমতের জন্য দোয়া করুন 🤲",
      ],
      Isha: [
        "🌙 এশার সময় হয়েছে!\nদিনের ক্লান্তি ঝেড়ে নামাজে শান্তি খুঁজুন 🕌",
        "🕌 *এশার সময়!*\nনামাজ শেষে দোয়া করুন, শান্তিতে ঘুমান 🌌",
      ],
    };

    // 🔁 প্রতি মিনিটে সময় চেক করবে
    setInterval(() => {
      const now = moment().tz(timezone).format("HH:mm");
      const currentPrayer = Object.keys(prayerTimes).find((key) => prayerTimes[key] === now);

      if (currentPrayer) {
        const msgList = prayerMessages[currentPrayer];
        const message = msgList[Math.floor(Math.random() * msgList.length)];
        sendToAllThreads(api, message);
      }
    }, 60 * 1000); // প্রতি ১ মিনিটে চেক করবে

    console.log("🕌 Auto Namaz Reminder চলছে...");
  },
};

// 🔄 সব গ্রুপে বার্তা পাঠানোর ফাংশন
function sendToAllThreads(api, message) {
  try {
    if (global.allThreadIDs && global.allThreadIDs.length > 0) {
      for (const threadID of global.allThreadIDs) {
        api.sendMessage(message, threadID);
      }
    } else {
      console.log("⚠️ কোনো গ্রুপ আইডি পাওয়া যায়নি।");
    }
  } catch (err) {
    console.error("❌ বার্তা পাঠানোর সময় ত্রুটি:", err);
  }
}
