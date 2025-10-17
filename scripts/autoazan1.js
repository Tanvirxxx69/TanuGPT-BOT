import fs from "fs";
import schedule from "node-schedule";

export function autoAzan(client) {
  const azanPath = "./azan.mp3";

  if (!fs.existsSync(azanPath)) {
    console.error("❌ azan.mp3 ফাইল পাওয়া যায়নি!");
    return;
  }

  console.log("🕌 অটো আজান সিস্টেম চালু হয়েছে...");

  // নামাজের ওয়াক্ত (বাংলাদেশ টাইম অনুযায়ী)
  const prayerTimes = {
    Fajr: "5:00",
    Dhuhr: "12:30",
    Asr: "3:45",
    Maghrib: "5:50",
    Isha: "7:15",
  };

  // প্রতিটি ওয়াক্তে আজান বাজানোর ফাংশন
  const playAzan = async (name) => {
    try {
      console.log(`📢 ${name} আজান বাজানো হচ্ছে...`);
      const groups = await client.groupFetchAllParticipating();

      for (const id in groups) {
        const chatId = groups[id].id;
        await client.sendMessage(chatId, {
          text: `🕌 ${name} নামাজের ওয়াক্ত হয়েছে, সবাই নামাজের প্রস্তুতি নাও। 🤲`,
        });
        await client.sendMessage(chatId, {
          audio: { url: azanPath },
          mimetype: "audio/mpeg",
          ptt: false,
        });
      }
    } catch (err) {
      console.error(`❌ ${name} আজান পাঠাতে সমস্যা:`, err);
    }
  };

  // শিডিউল সেট করা
  for (const [name, time] of Object.entries(prayerTimes)) {
    const [hour, minute] = time.split(":");
    const rule = new schedule.RecurrenceRule();
    rule.tz = "Asia/Dhaka";
    rule.hour = parseInt(hour);
    rule.minute = parseInt(minute);

    schedule.scheduleJob(rule, () => playAzan(name));
  }
}
