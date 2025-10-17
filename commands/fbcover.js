const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fbcover",
    aliases: ["cover", "কভার"],
    version: "2.0",
    author: "Tanvir",
    shortDescription: "স্টাইলিশ ফেসবুক কভার তৈরি করে 💫",
    longDescription:
      "ব্যবহারকারীর দেওয়া নাম দিয়ে র‍্যান্ডম ব্যাকগ্রাউন্ড ও ফন্ট সহ সুন্দর কভার ফটো তৈরি করে।",
    category: "fun",
  },

  onStart: async function ({ api, event, args }) {
    const name = args.join(" ");
    if (!name)
      return api.sendMessage(
        "💡 উদাহরণ: fbcover Tanvir Bruh",
        event.threadID,
        event.messageID
      );

    try {
      api.sendMessage("🎨 সুন্দর কভার বানানো হচ্ছে, একটু অপেক্ষা করো...", event.threadID);

      // র‍্যান্ডম ব্যাকগ্রাউন্ড (কিছু সুন্দর Unsplash লিংক)
      const backgrounds = [
        "https://images.unsplash.com/photo-1503264116251-35a269479413",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        "https://images.unsplash.com/photo-1522204501871-98c32d1a7a27",
        "https://images.unsplash.com/photo-1506765515384-028b60a970df",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1485217988980-11786ced9454",
      ];
      const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      // র‍্যান্ডম ফন্ট স্টাইল
      const fonts = ["Brush Script MT", "Poppins", "Lobster", "Montserrat", "Pacifico"];
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)];

      // API URL (Popcat + dynamic bg + font)
      const url = `https://api.popcat.xyz/canvas/cover?text=${encodeURIComponent(
        name
      )}&background=${encodeURIComponent(randomBg)}&font=${encodeURIComponent(randomFont)}`;

      const filePath = path.join(__dirname, `fbcover_${event.senderID}.png`);
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: `✅ কভার তৈরি সম্পন্ন!\n✨ নামঃ ${name}\n🎨 ফন্টঃ ${randomFont}`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ কভার বানাতে সমস্যা হয়েছে ভাই। পরে আবার চেষ্টা করো।", event.threadID);
    }
  },
};
