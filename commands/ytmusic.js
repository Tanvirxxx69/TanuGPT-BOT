const axios = require("axios");
const fs = require("fs");
const ytdl = require("@distube/ytdl-core");

module.exports = {
  config: {
    name: "ytmusic",
    aliases: ["yt", "song", "youtube"],
    author: "Tanvir",
    version: "1.0",
    shortDescription: "🎵 ইউটিউব থেকে গান বা ভিডিও ডাউনলোড",
    longDescription:
      "তুমি যেটা সার্চ করবে, সেটার ইউটিউব ভিডিও বা অডিও নামিয়ে পাঠাবে 🎧",
    category: "media",
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query)
      return api.sendMessage(
        "🔍 ভাই, একটা গান বা ভিডিওর নাম দাও। যেমন:\n/ytmusic Maher Zain Medina",
        event.threadID,
        event.messageID
      );

    api.sendMessage(
      `🎧 সার্চ করা হচ্ছে: ${query} ... একটু অপেক্ষা করো ⏳`,
      event.threadID
    );

    try {
      // 🔎 Search video
      const searchUrl = `https://yt-search-phi.vercel.app/api/search?q=${encodeURIComponent(
        query
      )}`;
      const { data } = await axios.get(searchUrl);

      if (!data || !data.videos || data.videos.length === 0)
        return api.sendMessage(
          "😞 দুঃখিত ভাই, কিছু পাওয়া যায়নি।",
          event.threadID,
          event.messageID
        );

      const video = data.videos[0];
      const videoUrl = video.url;
      const title = video.title;

      const filePath = `${__dirname}/${event.senderID}.mp3`;

      // 🎶 Download audio
      const stream = ytdl(videoUrl, {
        filter: "audioonly",
        quality: "highestaudio",
      });

      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);

      writeStream.on("finish", () => {
        api.sendMessage(
          {
            body: `🎵 *${title}*`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "❌ ভাই, গান ডাউনলোডে সমস্যা হয়েছে। আবার চেষ্টা করো।",
        event.threadID,
        event.messageID
      );
    }
  },
};
