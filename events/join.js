module.exports = {
  config: {
    name: "join",
    version: "1.0",
    author: "Tanvir",
    description: "নতুন মেম্বার গ্রুপে আসলে ওয়েলকাম মেসেজ দেয় 🌸"
  },

  onJoin: async function ({ api, event, Threads, Users }) {
    try {
      const { threadID, logMessageData } = event;
      const addedParticipants = logMessageData?.addedParticipants || [];

      if (addedParticipants.length === 0) return;

      const threadInfo = await api.getThreadInfo(threadID);
      const memberCount = threadInfo.participantIDs.length;
      const threadName = threadInfo.threadName || "এই গ্রুপ";

      for (const user of addedParticipants) {
        const userName = user.fullName || "নতুন বন্ধু";
        const welcomeMessages = [
          `🌟 স্বাগতম ${userName}! তুমি এখন ${threadName}-এর ${memberCount} তম সদস্য 🎉`,
          `👋 হেই ${userName}! পরিবারে তোমাকে স্বাগতম 💖 আশা করি সবাইকে চিনে বন্ধুত্ব করবে 😊`,
          `🎊 ${userName}, তুমি এখন ${threadName}-এর একজন সদস্য! সবাইকে হাই দাও 😄`,
          `💫 ${userName}, ওয়েলকাম টু ${threadName}! সবার সাথে মিলেমিশে থাকো ❤️`,
          `🔥 ${userName}, প্রবেশ করেছে! এখন গ্রুপ হবে আরও মজার 😎`
        ];

        const randomMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

        api.sendMessage(
          {
            body: randomMsg + `\n\n✨ মোট মেম্বার: ${memberCount}`,
          },
          threadID
        );
      }
    } catch (err) {
      console.error("Join event error:", err);
    }
  }
};
