module.exports = {
  config: {
    name: "userLeave",
    eventType: ["log:unsubscribe"],
    version: "1.0",
    author: "Tanvir",
    description: "কেউ গ্রুপ থেকে রিমুভ হলে অটো রিপ্লাই পাঠাবে 😢",
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageData } = event;
    const leftUserID = logMessageData.leftParticipantFbId;

    // বট নিজে রিমুভ হলে কিছু করবে না
    if (leftUserID === api.getCurrentUserID()) return;

    const userInfo = await api.getUserInfo(leftUserID);
    const userName = userInfo[leftUserID].name;

    // মজার বা কাস্টম রিপ্লাই মেসেজ
    const messages = [
      `😢 ${userName} কে গ্রুপ থেকে রিমুভ করা হয়েছে... হয়তো বেশি কথা বলছিল 😅`,
      `😔 ${userName} আমাদের মাঝে আর নেই... হয়তো অন্য গ্রুপে চলে গেলো 🌪️`,
      `👋 ${userName} কে বিদায় জানাও সবাই... আল্লাহ হাফেজ 🤲`,
      `😆 ${userName} কে গ্রুপ থেকে বের করে দিলো! কারো মন খারাপ করবেনা 😜`
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    api.sendMessage(randomMsg, threadID);
  }
};
