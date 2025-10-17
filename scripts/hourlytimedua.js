const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

const duas = [
  "🤲 আল্লাহুম্মা ইন্নি আসআলুকা ইলমান নাফিয়াআ, ওয়া রিযকান তইয়্যিবাআ, ওয়া আমালান মুতাকাব্বালাআ।",
  "💫 আল্লাহ যাকে চান তাকে অল্প দিয়েও তুষ্ট রাখেন, আর যাকে চান তাকে বেশি দিয়েও অশান্ত রাখেন।",
  "🌿 দুনিয়ার ঝামেলায় নয়, আখিরাতের প্রস্তুতিতে মনোযোগ দাও।",
  "🕊️ আল্লাহর স্মরণই হৃদয়ের প্রশান্তি দেয় — ‘অলা বিঝিকরিল্লাহি তাতমাইন্নুল কুলুব’।",
  "🌸 নামাজের মাধ্যমে আল্লাহর কাছে দোয়া করো, তিনিই সর্বশ্রেষ্ঠ শ্রোতা।",
  "💖 আল্লাহ তোমার প্রতি যতটা দয়ালু, পৃথিবীর কেউই ততটা নয়।",
  "🕌 আল্লাহর ওপর ভরসা রাখো — তিনি তোমার জন্য যথেষ্ট।",
  "🌙 রাতের নিস্তব্ধতায় আল্লাহর সামনে মাথা নত করো, তিনিই তোমার অশ্রু দেখেন।",
  "🌾 রিজিক আল্লাহর হাতে, শুধু চেষ্টা করো — নিরাশ হয়ো না।",
  "✨ আল্লাহর পথে চললে কখনো হারবে না।",
];

module.exports = {
  config: {
    name: "hourlyupdateweatherdua",
    version: "4.0",
    author: "Tanvir",
    shortDescription: "বাংলাদেশ সময়, আবহাওয়া ও ইসলামিক দোয়া পাঠায় প্রতি ঘন্টায়",
    longDescription: "প্রতি ঘন্টায় সময়, তারিখ, আবহাওয়া ও সুন্দর ইসলামিক দোয়া পাঠায় গ্রুপে",
    category: "auto",
  },

  onLoad: async function ({ api }) {
    console.log("🌤️ প্রতি ঘন্টায় সময়, আবহাওয়া ও দোয়া (বাংলাদেশ ভার্সন) চালু হয়েছে!");

    setInterval(async () => {
      const now = moment().tz("Asia/Dhaka");
      const time = now.format("hh:mm A");
      const date = now.format("dddd, DD MMMM YYYY");
      const dua = duas[Math.floor(Math.random() * duas.length)];

      const city = "Dhaka"; // চাইলে কুমিল্লা দিতে পারো
      const weatherApi = `https://wttr.in/${city}?format=j1`;

      try {
        const weatherRes = await axios.get(weatherApi);
        const current = weatherRes.data.current_condition[0];
        const temp = current.temp_C;
        const weather = current.weatherDesc[0].value;
        const feelsLike = current.FeelsLikeC;

        const msg = `
🕒 *${time} | ${date}*
🌤️ ${city}: ${weather}, ${temp}°C (অনুভূত ${feelsLike}°C)

${dua}
━━━━━━━━━━━━━━
🤖 *Tanvir Bot — ইসলাম প্রচারে তোমার সাথী*
`;

        const threads = await api.getThreadList(100, null, ["INBOX"]);
        for (const thread of threads) {
          if (thread.isGroup && thread.name) {
            api.sendMessage(msg, thread.threadID);
          }
        }
      } catch (err) {
        console.error("❌ সময়/আবহাওয়া পাঠাতে সমস্যা:", err);
      }
    }, 60 * 60 * 1000); // প্রতি ঘন্টায় একবার
  },
};
