module.exports = {
  config: {
    name: "userKick",
    eventType: ["log:unsubscribe"],
    version: "1.1",
    author: "Tanvir",
    description: "যখন কোনো এডমিন কাউকে রিমুভ করে, তখন মজার মেসেজ পাঠায় 😆",
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageData, author } = event;
    const leftUserID = logMessageData.leftParticipantFbId;

    // বট নিজে রিমুভ হলে কিছু করবে না
    if (leftUserID === api.getCurrentUserID()) return;

    try {
      // রিমুভ হওয়া ইউজার এবং রিমুভ করা এডমিনের নাম বের করা
      const userInfo = await api.getUserInfo(leftUserID);
      const removerInfo = await api.getUserInfo(author);

      const userName = userInfo[leftUserID]?.name || "Unknown User";
      const removerName = removerInfo[author]?.name || "Unknown Admin";

      // শুধু তখনই পাঠাবে যখন অন্য কেউ রিমুভ করেছে
      if (author !== leftUserID) {
        const messages = [
          `😆 ${removerName} আজ ${userName} কে রিমুভ করে দিলো! 🤭`,
          `😅 ${userName} কে ${removerName} এমন এক ধাক্কা দিলো যে গ্রুপের বাইরে চলে গেলো! 🚪`,
          `😔 ${userName} এর বিদায় ঘণ্টা বাজিয়ে দিলো ${removerName}! 🔔`,
          `😂 ${removerName} রাগে ${userName} কে গ্রুপ থেকে উড়িয়ে দিলো! 💨`,
          `👋 ${userName}, ${removerName} এর রিমুভ মিসাইল থেকে তুমি রক্ষা পেলে না! 🎯`
        ];

        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        api.sendMessage(randomMsg, threadID);
      }
    } catch (err) {
      console.error("❌ userKick event error:", err);
    }
  }
};
