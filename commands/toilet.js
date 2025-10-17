const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "toilet",
    version: "1.0",
    author: "Tanvir",
    shortDescription: "কাউকে কমোডে বসাও 🤣",
    longDescription: "যাকে mention করবে, তার প্রোফাইল পিকচার কমোডে বসানো ফানি ইমেজ বানায়!",
    category: "fun",
    guide: "{p}toilet @user",
  },

  onStart: async function ({ api, event }) {
    const mention = Object.keys(event.mentions || {})[0];
    const userID = mention || event.senderID;
    const name = event.mentions?.[userID] || "তুমি";

    api.setMessageReaction("💩", event.messageID, () => {}, true);

    try {
      // প্রোফাইল পিকচার ডাউনলোড
      const profilePicURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512`;
      const profilePic = await Jimp.read(profilePicURL);
      const toilet = await Jimp.read("https://i.ibb.co/fMxBq6X/toilet-base.png"); // তোমার কমোড ব্যাকগ্রাউন্ড
      profilePic.resize(180, 180);

      // মুখ বসানো
      toilet.composite(profilePic, 150, 220); // পজিশন ঠিক করে নিও

      const outputPath = path.join(__dirname, "toilet_result.png");
      await toilet.writeAsync(outputPath);

      api.sendMessage(
        {
          body: `🚽 ${name} এখন কমোডে বসে আছে! 😂`,
          attachment: fs.createReadStream(outputPath),
        },
        event.threadID,
        () => fs.unlinkSync(outputPath)
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("💩 ভাই, কিছু সমস্যা হলো। আবার চেষ্টা করো!", event.threadID);
    }
  },
};
