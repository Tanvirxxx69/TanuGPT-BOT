module.exports = {
  config: {
    name: "unsendLogger",
    eventType: ["message", "message_unsend"],
    version: "1.0",
    author: "Tanvir",
    description: "কেউ আনসেন্ট করলে মেসেজ জানিয়ে দেয়",
  },

  onStart: async function ({ api, event }) {
    // মেসেজ সংরক্ষণ
    if (event.type === "message" && event.messageID && event.body) {
      global.unsentMessages = global.unsentMessages || {};
      global.unsentMessages[event.messageID] = {
        senderID: event.senderID,
        body: event.body,
      };
    }

    // আনসেন্ট ধরা
    if (event.type === "message_unsend") {
      global.unsentMessages = global.unsentMessages || {};
      const unsent = global.unsentMessages[event.messageID];
      if (!unsent) return;

      const senderInfo = await api.getUserInfo(unsent.senderID);
      const name = senderInfo[unsent.senderID]?.name || "অজানা ব্যবহারকারী";

      const msg = `😏 ${name}刚刚 আনসেন্ট করেছে একটা মেসেজ!\n\n💬 মেসেজ ছিল:\n“${unsent.body}”`;

      api.sendMessage(msg, event.threadID);
      delete global.unsentMessages[event.messageID];
    }
  },
};
