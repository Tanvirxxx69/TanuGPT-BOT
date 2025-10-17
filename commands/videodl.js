const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "videodl",
    aliases: ["video", "download", "yt", "fb", "tiktok", "insta"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "ভিডিও ডাউনলোড",
    longDescription:
      "TikTok, Facebook, YouTube, Instagram ইত্যাদি সোর্স থেকে ভিডিও ডাউনলোড করে দেয়।",
    category: "media",
    usage: "/video [লিংক]",
  },

  onStart: async function ({ api, event, args }) {
    const link = args[0];
    if (!link)
      return api.sendMessage(
        "🎬 অনুগ্রহ করে একটি ভিডিও লিংক দিন ভাই!\n\nউদাহরণ:\n/video https://www.youtube.com/watch?v=xxxxx",
        event.threadID,
        event.messageID
      );

    api.sendMessage("⏳ ভিডিও লোড হচ্ছে ভাই, একটু অপেক্ষা করো...", event.threadID);

    try {
      let apiUrl;

      if (link.includes("tiktok.com")) {
        apiUrl = `https://api.ryzendesu.vip/api/download/tiktok?url=${encodeURIComponent(link)}`;
      } else if (link.includes("facebook.com") || link.includes("fb.watch")) {
        apiUrl = `https://api.ryzendesu.vip/api/download/facebook?url=${encodeURIComponent(link)}`;
      } else if (link.includes("youtube.com") || link.includes("youtu.be")) {
        apiUrl = `https://api.ryzendesu.vip/api/download/ytdl?url=${encodeURIComponent(link)}`;
      } else if (link.includes("instagram.com")) {
        apiUrl = `https://api.ryzendesu.vip/api/download/instagram?url=${encodeURIComponent(link)}`;
      } else {
        return api.sendMessage(
          "😕 ভাই এই লিংকটা চিনতে পারলাম না!\nTikTok, YouTube, Facebook বা Instagram লিংক দিন।",
          event.threadID,
          event.messageID
        );
      }

      const res = await axios.get(apiUrl);
      const videoUrl =
        res.data.data?.url ||
        res.data.data?.hd ||
        res.data.data?.result ||
        res.data.result ||
        null;

      if (!videoUrl)
        return api.sendMessage(
          "😔 দুঃখিত ভাই, ভিডিও লিংক ঠিকমতো পাওয়া যায়নি।",
          event.threadID,
          event.messageID
        );

      const videoPath = path.join(__dirname, "video.mp4");
      const writer = fs.createWriteStream(videoPath);

      const videoStream = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
      });

      videoStream.data.pipe(writer);

      writer.on("finish", async () => {
        await api.sendMessage(
          {
            body: "🎥 ভিডিও ডাউনলোড সম্পন্ন ✅",
            attachment: fs.createReadStream(videoPath),
          },
          event.threadID,
          () => fs.unlinkSync(videoPath)
        );
      });

      writer.on("error", (err) => {
        console.error(err);
        api.sendMessage("❌ ভিডিও ডাউনলোডে সমস্যা হয়েছে ভাই।", event.threadID);
      });
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "😢 সার্ভারে সমস্যা ভাই, একটু পরে চেষ্টা করো।",
        event.threadID,
        event.messageID
      );
    }
  },
};
