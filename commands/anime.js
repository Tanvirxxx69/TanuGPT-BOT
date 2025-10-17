const axios = require("axios");

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: "stream" });
  return response.data;
}

async function fetchTikTokVideos(query) {
  try {
    const response = await axios.get(
      `https://lyric-search-neon.vercel.app/kshitiz?keyword=${query}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "ani",
    aliases: ["anime", "rm"],
    author: "Tanvir",
    version: "1.0",
    shortDescription: "অ্যানিমে এডিট ভিডিও সার্চ 🎥",
    longDescription:
      "তুমি যা সার্চ করবে, সেই অনুযায়ী TikTok থেকে অ্যানিমে এডিট ভিডিও নিয়ে আসবে।",
    category: "fun",
  },

  onStart: async function ({ api, event, args }) {
    try {
      const query = args.join(" ");
      if (!query)
        return api.sendMessage(
          "🔍 ভাই, একটা নাম লিখো যেমন:\n/ani itachi edit",
          event.threadID,
          event.messageID
        );

      api.sendMessage(
        `🎬 অ্যানিমে এডিট ভিডিও খোঁজা হচ্ছে... ⏳\n👉 কীওয়ার্ড: ${query}`,
        event.threadID
      );

      const videos = await fetchTikTokVideos(`${query} anime edit`);

      if (!videos || videos.length === 0)
        return api.sendMessage(
          "😔 দুঃখিত ভাই, কিছুই পাওয়া যায়নি। অন্য নাম ট্রাই করো!",
          event.threadID,
          event.messageID
        );

      const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoUrl = selectedVideo.videoUrl;

      if (!videoUrl)
        return api.sendMessage(
          "⚠️ ভিডিও লিংক পাওয়া যায়নি ভাই!",
          event.threadID,
          event.messageID
        );

      const stream = await getStreamFromURL(videoUrl);

      api.sendMessage(
        {
          body: `✅ ভাই, তোমার ${query} অ্যানিমে এডিট রেডি! 🌸`,
          attachment: stream,
        },
        event.threadID,
        event.messageID
      );
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "❌ কিছু একটা সমস্যা হয়েছে ভাই। একটু পরে আবার চেষ্টা করো।",
        event.threadID,
        event.messageID
      );
    }
  },
};
