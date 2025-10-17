import axios from "axios";
import fs from "fs";
import path from "path";

export const config = {
  name: "namaz",
  version: "1.0",
  author: "Tanvir Ankhon",
  description: "Auto Azan & Namaz Reminder (Bangladesh Time)"
};

const azanAudio = "https://server6.mp3quran.net/thubti/001.mp3"; // সুন্দর আজানের ভয়েস 🎧

export async function onStart({ api }) {
  const times = [
    { name: "ফজর", hour: 5, minute: 0 },
    { name: "যোহর", hour: 12, minute: 30 },
    { name: "আসর", hour: 4, minute: 0 },
    { name: "মাগরিব", hour: 5, minute: 30 },
    { name: "ইশা", hour: 7, minute: 30 }
  ];

  const interval = setInterval(async () => {
    const now = new Date();
    const bdTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));

    const hour = bdTime.getHours();
    const minute = bdTime.getMinutes();

    for (const t of times) {
      if (hour === t.hour && minute === t.minute) {
        try {
          const response = await axios.get(azanAudio, { responseType: "stream" });
          api.sendMessage({
            body: `🕌 এখন ${t.name} নামাজের সময় হয়েছে!\n\nচল নামাজ পড়ি 🤲 আল্লাহ আমাদের কবুল করুন।`,
            attachment: response.data
          }, global.config.mainGroup || "0");
        } catch (err) {
          console.error("Azan play failed:", err);
        }
      }
    }
  }, 60000); // প্রতি মিনিটে চেক করবে

  console.log("🕋 Auto Namaz Reminder system started (BD Time).");
}
