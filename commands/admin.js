// commands/admin.js

module.exports = {
  config: {
    name: "admin",
    aliases: ["owner", "tanvir"],
    description: "Shows the bot owner's information with photo",
    usage: "/admin",
  },

  onStart: async function ({ event, api }) {
    const ownerInfo = `👑 *Owner Information*
━━━━━━━━━━━━━━
👤 নাম: Tanvir Ankhon
🌍 অবস্থান: কুমিল্লা, বাংলাদেশ
💬 Messenger: https://m.me/Tanubruh41
💻 GitHub: লাগবেনা ভাই
📸 Instagram: https://instagram.com/tanubruh
🎮 Facebook: https://www.facebook.com/Tanubruh41
━━━━━━━━━━━━━━
⚙️ বট নাম: TanuGPT-BOT
🧠 Created by: Tanvir Vai 💙`;

    // নিচে তোর ছবি URL দে (যেটা বট পাঠাবে)
    const ownerPhoto =
      "https://i.postimg.cc/mgcKfwsn/Photo-Studio-1669021964995.jpg"; // এখানে তোর নিজের ছবির লিংক বসা

    api.sendMessage(
      {
        body: ownerInfo,
        attachment: await global.utils.getStreamFromURL(ownerPhoto),
      },
      event.threadID
    );
  },
};
