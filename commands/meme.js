const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "memes",
    aliases: ["meme", "funny"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "র‍্যান্ডম মজার মিম পাঠায় 😂",
    longDescription:
      "এই কমান্ড ব্যবহার করলে ইউজার র‍্যান্ডম মজার মিম বা নির্দিষ্ট টপিক অনুযায়ী মিম পাবে।",
    category: "fun",
    guide: {
      bn: "{p}meme\n{p}meme cat\n{p}meme programming",
    },
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");

    try {
      api.sendMessage("⏳ একটু অপেক্ষা করো ভাই, মজার মিম আনছি 😂...", event.threadID);

      let url;

      // 🔹 যদি নির্দিষ্ট টপিক দেয়া হয় তাহলে Reddit API থেকে আনবে
      if (query) {
        url = `https://meme-api.com/gimme/${encodeURIComponent(query)}`;
      } else {
        // 🔹 না দিলে সাধারণ random মিম দেবে
        url = "https://meme-api.com/gimme";
      }

      const res = await axios.get(url);

      if (!res.data || !res.data.url) {
        return api.sendMessage("😅 ভাই, এই বিষয়ে কোনো মিম খুঁজে পেলাম না!", event.threadID);
      }

      const memeUrl = res.data.url;
      const memeTitle = res.data.title || "Funny Meme 😂";
      const memeFile = path.join(__dirname, "meme.jpg");

      const response = await axios.get(memeUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(memeFile, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: `🤣 *${memeTitle}*`,
          attachment: fs.createReadStream(memeFile),
        },
        event.threadID,
        () => fs.unlinkSync(memeFile)
      );
    } catch (error) {
      console.error(error);
      api.sendMessage("😔 দুঃখিত ভাই, মিম আনতে সমস্যা হয়েছে!", event.threadID);
    }
  },
};
