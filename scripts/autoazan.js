const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "azan",
    aliases: ["adhaan", "autoazan"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "৫ ওয়াক্ত আজান অটো রিমাইন্ডার",
    longDescription:
      "বাংলাদেশ সময় অনুযায়ী ৫ ওয়াক্ত নামাজের সময় হলে অটোভাবে আজানের সাউন্ড পাঠায় ও ইসলামিক বার্তা দেয়।",
    category: "islamic",
  },

  onStart: async function ({ api }) {
    const timezone = "Asia/Dhaka";

    // নামাজের সময়
    const prayerTimes = {
      Fajr: "04:45",
      Dhuhr: "12:05",
      Asr: "15:30",
      Maghrib: "17:45",
      Isha: "19:15",
    };

    // ইসলামিক বার্তা
    const msgList = {
      Fajr: "🌅 ফজরের আজান হয়েছে ভাই 🌙\nওযু করুন, নামাজে দাঁড়ান 🤲",
      Dhuhr: "🌞 যোহরের আজান হয়েছে!\nদুনিয়ার কাজ কিছুক্ষণের জন্য থামিয়ে নামাজে আসুন 🕌",
      Asr: "🌇 আসরের আজান হয়েছে!\nআল্লাহর সন্তুষ্টির জন্য নামাজ আদায় করুন 💚",
      Maghrib: "🌆 মাগরিবের আজান হয়েছে!\nসন্ধ্যার এই বরকতময় সময়ে নামাজে দাঁড়ান 🕌",
      Isha: "🌙 এশার আজান হয়েছে!\nদিনের শেষে নামাজে শান্তি খুঁজুন 🌌",
    };

    // প্রতি মিনিটে চেক করবে
    setInterval(() => {
      const now = moment().tz(timezone).format("HH:mm");
      const current = Object.keys(prayerTimes).find(
        (key) => prayerTimes[key] === now
      );
      if (current) {
        const azanPath = path.join(__dirname, "azan.mp3");
        const message = `🕌 ${msgList[current]}\n\n📢 আজানের সময় হয়েছে ভাই, নামাজে আসুন 🤲`;

        if (fs.existsSync(azanPath)) {
          sendToAllGroups(api, { body: message, attachment: fs.createReadStream(azanPath) });
        } else {
          sendToAllGroups(api, { body: `${message}\n\n⚠️ আজানের সাউন্ড ফাইল পাওয়া যায়নি। (azan.mp3)` });
        }
      }
    }, 60 * 1000);

    console.log("🕋 Auto Azaan Reminder সক্রিয়...");
  },
};

// সব গ্রুপে পাঠানো
function sendToAllGroups(api, msg) {
  if (global.allThreadIDs && global.allThreadIDs.length > 0) {
    for (const threadID of global.allThreadIDs) {
      api.sendMessage(msg, threadID);
    }
  } else {
    console.log("⚠️ কোনো গ্রুপ আইডি পাওয়া যায়নি।");
  }
}
