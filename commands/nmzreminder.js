const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "autonamaz",
    aliases: ["prayertime", "namazauto"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "অটো নামাজ রিমাইন্ডার + প্রতি ঘন্টায় ইসলামিক দোয়া বা হাদিস পাঠায়",
    longDescription: "বাংলাদেশ সময় অনুযায়ী নামাজের সময় মনে করিয়ে দেয় এবং প্রতি ঘন্টায় ইসলামিক বার্তা পাঠায়",
    category: "islamic",
  },

  onStart: async function ({ api }) {
    const timezone = "Asia/Dhaka";

    // 📖 ইসলামিক বার্তাগুলো
    const hadiths = [
      "রাসূল ﷺ বলেছেন: 'তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি, যে কুরআন শিক্ষা করে এবং শিক্ষা দেয়।' (সহিহ বুখারি)",
      "রাসূল ﷺ বলেছেন: 'যে ব্যক্তি মিথ্যা কথা ত্যাগ করে, আল্লাহ তার জন্য জান্নাতে একটি প্রাসাদ তৈরি করবেন।' (তিরমিজি)",
      "আল্লাহ বলেন: 'তুমি আমাকে স্মরণ কর, আমিও তোমাকে স্মরণ করব।' (সূরা বাকারা ২:১৫২)",
      "রাসূল ﷺ বলেছেন: 'তোমার মুখ থেকে একটি হাসি বের হওয়াও সদকা।' (তিরমিজি)",
      "রাসূল ﷺ বলেছেন: 'নিশ্চয়ই আমলগুলো নিয়তের উপর নির্ভর করে।' (সহিহ বুখারি)",
      "রাসূল ﷺ বলেছেন: 'যে ব্যক্তি অন্যদের জন্য দোয়া করে, ফেরেশতারা বলে — আমিন, তোমার জন্যও একই দোয়া।' (মুসলিম)",
      "আল্লাহ বলেন: 'নিশ্চয়ই ধৈর্যশীলদের সাথেই আল্লাহ আছেন।' (সূরা বাকারা ২:১৫৩)",
    ];

    // 🕐 প্রতি ঘন্টায় ইসলামিক বার্তা পাঠাবে
    setInterval(() => {
      const random = hadiths[Math.floor(Math.random() * hadiths.length)];
      sendToAllThreads(api, `🕌 *ইসলামিক বার্তা*\n\n${random}\n\n🤲 আল্লাহ আমাদের সবাইকে আমল করার তাওফিক দিন।`);
    }, 60 * 60 * 1000); // প্রতি ঘন্টায়

    // 🕌 নামাজ রিমাইন্ডার সময়সূচি
    const prayerTimes = {
      Fajr: "04:45",
      Dhuhr: "12:05",
      Asr: "15:30",
      Maghrib: "17:45",
      Isha: "19:15",
    };

    // 🔁 প্রতি মিনিটে চেক করবে
    setInterval(async () => {
      const now = moment().tz(timezone).format("HH:mm");
      const currentPrayer = Object.keys(prayerTimes).find((key) => prayerTimes[key] === now);
      if (currentPrayer) {
        const msg = `🕌 এখন ${currentPrayer} নামাজের সময়!\n\n⏰ সময়ঃ ${now}\n\nআল্লাহর সন্তুষ্টির জন্য নামাজ আদায় করুন 🤲`;
        sendToAllThreads(api, msg);
      }
    }, 60 * 1000);
  },
};

// 🔄 সব গ্রুপে পাঠানোর হেল্পার ফাংশন
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
    console.error("বার্তা পাঠানোর সময় ত্রুটি:", err);
  }
}
