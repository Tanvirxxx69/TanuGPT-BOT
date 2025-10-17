const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "namazAuto",
    version: "1.0",
    author: "Tanvir",
    description: "বাংলাদেশ সময় অনুযায়ী অটো নামাজ রিমাইন্ডার (সব গ্রুপে পাঠায়)",
    category: "islamic",
  },

  onStart: async function ({ api }) {
    const location = "Dhaka";
    const country = "Bangladesh";

    // নামাজের সময় বের করো
    async function getPrayerTimes() {
      try {
        const res = await axios.get(
          `https://api.aladhan.com/v1/timingsByCity?city=${location}&country=${country}&method=2`
        );
        return res.data.data.timings;
      } catch (e) {
        console.error("নামাজের সময় আনা যায়নি:", e.message);
        return null;
      }
    }

    // মেসেজ পাঠানোর ফাংশন
    async function sendToAll(msg) {
      if (global.data && global.data.allThreadID) {
        for (const threadID of global.data.allThreadID) {
          try {
            await api.sendMessage(msg, threadID);
          } catch (err) {
            console.error("মেসেজ পাঠানো ব্যর্থ:", err.message);
          }
        }
      }
    }

    // রিমাইন্ডার সিস্টেম
    async function scheduleNamazReminders() {
      const times = await getPrayerTimes();
      if (!times) return;

      const namazList = [
        { name: "ফজর", time: times.Fajr },
        { name: "যোহর", time: times.Dhuhr },
        { name: "আসর", time: times.Asr },
        { name: "মাগরিব", time: times.Maghrib },
        { name: "এশা", time: times.Isha },
      ];

      for (const namaz of namazList) {
        const now = moment().tz("Asia/Dhaka");
        const namazTime = moment.tz(namaz.time, "HH:mm", "Asia/Dhaka");

        if (namazTime.isBefore(now)) namazTime.add(1, "day"); // পরের দিনের জন্য সেট

        const msUntilNamaz = namazTime.diff(now);

        setTimeout(() => {
          const msg = `🕌 *${namaz.name} নামাজের সময় হয়েছে ভাই!* ⏰\nআসুন সবাই নামাজে যোগ দেই 🤲`;
          sendToAll(msg);
        }, msUntilNamaz);

        console.log(`${namaz.name} নামাজ রিমাইন্ডার সেট হয়েছে ${namazTime.format("h:mm A")} এ`);
      }
    }

    // প্রতি ১২ ঘণ্টা পর আপডেট
    await scheduleNamazReminders();
    setInterval(scheduleNamazReminders, 12 * 60 * 60 * 1000);
  },
};
