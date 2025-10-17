const axios = require("axios");

module.exports = {
  config: {
    name: "kiss",
    aliases: ["mua", "muah"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "গ্রুপে কাউকে কিস দাও 😘",
    longDescription: "কেউ /kiss দিলে বট এলোমেলোভাবে কারো নাম নিয়ে বলবে যে তুমি তাকে কিস করলে 💋",
    category: "fun",
    guide: {
      en: "{p}kiss — কাউকে মিষ্টি কিস দাও 😘",
    },
  },

  onStart: async function ({ api, event }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());

      if (members.length < 2) {
        return api.sendMessage("😅 Pair করার মতো সদস্য কম আছে!", event.threadID);
      }

      const senderID = event.senderID;
      let receiverID = members[Math.floor(Math.random() * members.length)];
      while (receiverID === senderID) {
        receiverID = members[Math.floor(Math.random() * members.length)];
      }

      const userInfo = await api.getUserInfo(senderID, receiverID);
      const senderName = userInfo[senderID].name;
      const receiverName = userInfo[receiverID].name;

      // র‍্যান্ডম কিস GIF
      const gifs = [
        "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif",
        "https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif",
        "https://media.giphy.com/media/11rWoZNpAKw8w/giphy.gif",
        "https://media.giphy.com/media/zkppEMFvRX5FC/giphy.gif",
        "https://media.giphy.com/media/nyGFcsP0kAobm/giphy.gif"
      ];
      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

      const msg = `💋 ${senderName} কিস করলো ${receiverName}-কে!\n\n😘 আহা, কি মিষ্টি মুহূর্ত! ❤️`;

      const gifStream = (await axios.get(randomGif, { responseType: "stream" })).data;
      api.sendMessage({ body: msg, attachment: gifStream }, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ কিছু সমস্যা হয়েছে, পরে আবার চেষ্টা করো!", event.threadID);
    }
  },
};
