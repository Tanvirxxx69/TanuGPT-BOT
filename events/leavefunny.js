module.exports = {
  config: {
    name: "leaveFunny",
    eventType: ["log:unsubscribe"],
    version: "1.0",
    author: "Tanvir",
    description: "কেউ গ্রুপ থেকে চলে গেলে ফানি মেসেজ পাঠাবে 😂",
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageData } = event;
    const leftUserID = logMessageData.leftParticipantFbId;

    // বট যদি নিজে চলে যায়, কিছু করবে না
    if (leftUserID === api.getCurrentUserID()) return;

    try {
      const userInfo = await api.getUserInfo(leftUserID);
      const userName = userInfo[leftUserID].name;

      const funnyMessages = [
        `😢 ${userName} ভাই পালাইছে! আর সহ্য করতে পারলো না 😭`,
        `🤣 ${userName} গোপনে পালায়, Tanvir ভাইয়ের বট দেখে ফেললো!`,
        `🤡 ${userName} চলে গেল... নাটকের শেষ দৃশ্যটা দেখে যেতে পারলো না 😂`,
        `🫢 ${userName} গেলো, কিন্তু বট এখনো কাঁদছে 😭`,
        `😂 ${userName} এই গ্রুপ ছাড়লো — চলো সবাই মিলে দোয়া করি ও যেনো আবার না আসে 😆`,
        `😎 ${userName} কে গ্রুপে আর পাওয়া যাবে না... কিন্তু Tanvir Bot আছে 😉`,
        `👋 ${userName} বিদায় নিলো, মনে হয় নেট শেষ 😅`
      ];

      const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
      api.sendMessage(msg, threadID);

    } catch (error) {
      console.error("Error in leaveFunny:", error);
    }
  }
};
