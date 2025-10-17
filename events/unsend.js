module.exports = {
  config: {
    name: "unsendAutoRemove",
    version: "1.0",
    author: "Tanvir",
    description: "যে ইউজার তার মেসেজ আনসেন্ট করবে, বটও সেই মেসেজের রিপ্লাই আনসেন্ট করবে।",
  },

  onStart: async function () {},

  onEvent: async function ({ api, event }) {
    const { messageID, threadID, senderID, type } = event;

    // বটের আইডি
    const botID = api.getCurrentUserID();

    // শুধু আনসেন্ট ইভেন্টে কাজ করবে
    if (type === "message_unsend") {
      // এই থ্রেডে আগের বটের রিপ্লাই আইডি আছে কিনা দেখবে
      if (!global.recentBotReplies) global.recentBotReplies = {};

      const lastReply = global.recentBotReplies[threadID]?.[senderID];
      if (lastReply) {
        // বটের রিপ্লাই আনসেন্ট করো
        try {
          await api.unsendMessage(lastReply);
          delete global.recentBotReplies[threadID][senderID];
        } catch (e) {
          console.log("❌ আনসেন্টে সমস্যা:", e.message);
        }
      }
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    // যদি বট রিপ্লাই দেয়, সেটার ট্র্যাক রাখো
    if (senderID !== api.getCurrentUserID()) {
      // পরবর্তী বট রিপ্লাই ধরার জন্য লিসেনার
      const send = api.sendMessage;
      api.sendMessage = async (msg, tID, cb, mid) => {
        const sent = await send(msg, tID, cb, mid);

        if (!global.recentBotReplies) global.recentBotReplies = {};
        if (!global.recentBotReplies[threadID]) global.recentBotReplies[threadID] = {};

        global.recentBotReplies[threadID][senderID] = sent.messageID;

        api.sendMessage = send; // restore
        return sent;
      };
    }
  },
};
