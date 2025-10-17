const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "eid",
    aliases: ["eidulfitr", "eidcount"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "জানাও ঈদুল ফিতর পর্যন্ত আর কত দিন বাকি",
    longDescription: "বাংলাদেশ সময় অনুযায়ী ঈদুল ফিতর পর্যন্ত কত দিন বাকি তা জানাবে",
    category: "islamic",
    guide: {
      bn: "{p}eid — ঈদুল ফিতর পর্যন্ত সময় জানো"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const today = moment().tz("Asia/Dhaka");

      // প্রতি বছর ঈদুল ফিতরের আনুমানিক তারিখ (পরবর্তী রমজান শেষে)
      // এখানে তুমি চাইলে প্রতি বছর আপডেট করতে পারবে
      const eidDate = moment.tz("2025-03-30", "Asia/Dhaka"); 

      const diffDays = eidDate.diff(today, "days");

      let message = "";

      if (diffDays > 0) {
        message = `🌙 আলহামদুলিল্লাহ!  
ঈদুল ফিতর পর্যন্ত বাকি আছে ${diffDays} দিন 💫  
🕋 ইনশাআল্লাহ এই ঈদে আল্লাহ যেন আমাদের সবাইকে ক্ষমা করেন 🤲`;
      } else if (diffDays === 0) {
        message = `🎉 আজ ঈদুল ফিতর! 🌙  
💖 সবাইকে ঈদ মোবারক!  
🕌 আল্লাহ আমাদের রোজা ও ইবাদত কবুল করুন 🤲`;
      } else {
        message = `🌙 ঈদুল ফিতর ইতিমধ্যেই চলে গেছে এই বছর 💫  
ইনশাআল্লাহ আবার দেখা হবে পরের ঈদে 🕌`;
      }

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("দুঃখিত ভাই 😢 কিছু সমস্যা হয়েছে, একটু পরে চেষ্টা করুন।", event.threadID, event.messageID);
    }
  }
};
