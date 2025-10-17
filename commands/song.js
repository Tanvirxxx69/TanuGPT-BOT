const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "song",
    aliases: ["music", "audio"],
    author: "Tanvir",
    version: "1.0",
    category: "music",
    shortDescription: "🎵 ইউটিউব থেকে গান শুনুন",
    longDescription: "গানের নাম দিলে ইউটিউব থেকে সার্চ করে পছন্দমতো গান অডিও আকারে শোনাবে।",
    guide: {
      en: "{p}song [গানের নাম]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query)
      return api.sendMessage(
        "🎶 কোন গান শুনতে চান? যেমন:\n/song Labonno",
        event.threadID,
        event.messageID
      );

    api.sendMessage(`🔍 সার্চ করা হচ্ছে: ${query}...`, event.threadID, event.messageID);

    try {
      // ইউটিউব সার্চ API (৩য় পক্ষ)
      const searchUrl = `https://yt-api.eu.org/api/search?q=${encodeURIComponent(query)}`;
      const res = await axios.get(searchUrl);

      if (!res.data || !res.data.data || res.data.data.length === 0)
        return api.sendMessage("❌ কোনো রেজাল্ট পাওয়া যায়নি!", event.threadID);

      const results = res.data.data.slice(0, 5); // প্রথম ৫টা রেজাল্ট

      let msg = "🎧 নিচের তালিকা থেকে গান বেছে নিন:\n\n";
      results.forEach((song, i) => {
        msg += `${i + 1}. ${song.title}\n`;
      });
      msg += "\n👉 আপনার পছন্দের গানের নাম্বার রিপ্লাই দিন (১–৫)";

      api.sendMessage(msg, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          results,
        });
      });
    } catch (error) {
      console.error(error);
      api.sendMessage("⚠️ ইউটিউব সার্চ করতে সমস্যা হয়েছে!", event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { author, results } = Reply;
    if (event.senderID !== author)
      return api.sendMessage("❌ তুমি এই কমান্ডের মালিক না!", event.threadID);

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > results.length)
      return api.sendMessage("❗ বৈধ নাম্বার দিন (১–৫)", event.threadID);

    const selected = results[choice - 1];
    const videoUrl = `https://www.youtube.com/watch?v=${selected.id}`;

    api.sendMessage(`🎵 "${selected.title}" লোড হচ্ছে... অপেক্ষা করুন ⏳`, event.threadID);

    try {
      const filePath = path.join(__dirname, `temp_${Date.now()}.mp3`);
      const stream = ytdl(videoUrl, { filter: "audioonly", quality: "highestaudio" });
      const writer = fs.createWriteStream(filePath);
      stream.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `🎶 এখন বাজছে: ${selected.title}`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ গান প্লে করতে সমস্যা হয়েছে!", event.threadID);
    }
  },
};
