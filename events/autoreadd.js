module.exports = {
  config: {
    name: "autoReAdd",
    eventType: ["log:unsubscribe"],
    version: "1.0",
    author: "Tanvir",
    description: "কেউ গ্রুপ থেকে লিভ নিলে অটোভাবে আবার এ্যাড করে দেয় 😎",
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageData } = event;
    const leftUserID = logMessageData.leftParticipantFbId;

    // যদি বট নিজে লিভ নেয় তাহলে কিছু করবে না
    if (leftUserID === api.getCurrentUserID()) return;

    try {
      // ইউজারের ইনফো আনো
      const userInfo = await api.getUserInfo(leftUserID);
      const userName = userInfo[leftUserID].name;

      // ইউজারকে আবার গ্রুপে যোগ করো
      await api.addUserToGroup(leftUserID, threadID);

      // মজার মেসেজ পাঠাও 😁
      const msgList = [
        `😂 কোথায় পালাচ্ছো ${userName}? ফিরে আসো, এই গ্রুপ ছাড়তে নাই!`,
        `😎 ${userName} কে আবার ধরে আনা হলো — পালানো নিষেধ!`,
        `🕵️‍♂️ ${userName} পালাতে গিয়েছিলো, কিন্তু Tanvir Bot তাকে ফেরত এনেছে!`,
        `🤖 ${userName} কে অটো এ্যাড করা হলো — Tanvir ভাইয়ের বটকে কেউ ফাঁকি দিতে পারে না 😏`
      ];

      const msg = msgList[Math.floor(Math.random() * msgList.length)];
      api.sendMessage(msg, threadID);

    } catch (error) {
      console.error("Error in auto re-add:", error);
      api.sendMessage("😔 তাকে আবার এ্যাড করতে পারিনি ভাই!", threadID);
    }
  }
};
