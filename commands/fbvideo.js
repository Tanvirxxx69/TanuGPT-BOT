const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "fbvideo",
    aliases: ["fb", "facebook"],
    author: "Tanvir",
    version: "1.0",
    shortDescription: "📹 ফেসবুক ভিডিও ডাউনলোড",
    longDescription:
      "যে কেউ ফেসবুক ভিডিও লিংক দিলে, বট সেই ভিডিও ডাউনলোড করে পাঠাবে।",
    category: "media",
  },

  onStart: async function ({ api, event, args }) {
    const link = args.join(" ");
    if (!link)
      return api.sendMessage(
        "📎 ভাই, একটা ফেসবুক ভিডিও লিংক দাও।\nউদাহরণ: /fbvideo https://fb.watch/abc123",
        event.threadID,
        event.messageID
      );

    api.sendMessage(
      "⏳ ভিডিও ডাউনলোড হচ্ছে ভাই... একটু অপেক্ষা করো!",
      event.threadID
    );

    try {
      // External API (safe & public)
      const response = await axios.get(
        `https://api.vihangayt.com/downloader/facebook?url=${encodeURIComponent(
          link
        )}`
      );

      const videoUrl = response.data.data?.hd || response.data.data?.sd;

      if (!videoUrl)
        return api.sendMessage(
          "❌ ভিডিও পাওয়া যায়নি ভাই। লিংকটা ঠিক আছে কিনা চেক করো।",
          event.threadID,
          event.messageID
        );

      const path = `${__dirname}/fb_${event.senderID}.mp4`;
      const video = await axios.get(videoUrl, { responseType: "stream" });

      const writer = fs.createWriteStream(path);
      video.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: "✅ তোমার ফেসবুক ভিডিও রেডি ভাই 🎬",
            attachment: fs.createReadStream(path),
          },
          event.threadID,
          () => fs.unlinkSync(path)
        );
      });
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "⚠️ ভাই, ভিডিও ডাউনলোডে সমস্যা হয়েছে। আবার চেষ্টা করো।",
        event.threadID,
        event.messageID
      );
    }
  },
};
