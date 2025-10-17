const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "ramadan",
    aliases: ["romjan", "ramzan", "roja"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "রমজান মাস পর্যন্ত কত দিন বাকি জানাও",
    longDescription: "বাংলাদেশ সময় অনুযায়ী রমজান মাস শুরু হতে আর কত দিন বাকি তা জানায়",
    category: "islamic",
    guide: {
      bn: "{p}ramadan — রমজান পর্যন্ত সময় জানো"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const today = moment().tz("Asia/Dhaka");

      // 🌙 2025 সালের রমজানের সম্ভাব্য শুরু তারিখ (ফেব্রুয়ারির শেষের দিকে)
      const ramadanStart = moment.tz("2025-02-28", "Asia/Dhaka");

      const diffDays = ramadanStart.diff(today, "days");

      let message = "";

      if (diffDays > 0) {
        message = `🌙 আলহামদুলিল্লাহ!  
পবিত্র রমজান মাস শুরু হতে বাকি আছে ${diffDays} দিন 🕌  
🤲 ইনশাআল্লাহ আমাদের সিয়াম ও ইবাদত কবুল করবেন আল্লাহ।`;
      } else if (diffDays === 0) {
        message = `🌙 আজ থেকে শুরু হলো পবিত্র রমজান মাস!  
🕌 রমজান মোবারক ভাই 💫  
🤲 আল্লাহ আমাদের রোজা ও দোয়া কবুল করুন।`;
      } else {
        message = `🌙 রমজান মাস এই বছর শেষ হয়ে গেছে 💫  
ইনশাআল্লাহ পরের বছর আবার দেখা হবে রমজানে 🕌`;
      }

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "দুঃখিত ভাই 😢 কিছু সমস্যা হয়েছে, একটু পর আবার চেষ্টা করুন।",
        event.threadID,
        event.messageID
      );
    }
  }
};
