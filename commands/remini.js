const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "remini",
    aliases: ["hd", "enhance", "fixphoto"],
    version: "2.0",
    author: "Tanvir",
    shortDescription: "ছবি HD তে রূপান্তর করে ✨",
    longDescription:
      "Remini এর মতো কাজ করে। তুমি যে ছবি পাঠাবে বা লিংক দিবে, সেটাকে ঝকঝকে করে দিবে।",
    category: "tools",
  },

  onStart: async function ({ api, event, args }) {
    try {
      let imageUrl;

      // যদি ছবি অ্যাটাচ করা থাকে
      if (event.messageReply && event.messageReply.attachments.length > 0) {
        imageUrl = event.messageReply.attachments[0].url;
      } else if (args[0] && args[0].startsWith("http")) {
        imageUrl = args[0];
      } else {
        return api.sendMessage(
          "📸 ভাই, ছবির রিপ্লাই দিন বা ছবির লিংক দিন।\nউদাহরণ:\nremini [image link]",
          event.threadID,
          event.messageID
        );
      }

      api.sendMessage("🪄 ছবিটা HD করা হচ্ছে, একটু অপেক্ষা করো ভাই...", event.threadID);

      // Remini-style API
      const apiUrl = `https://api.popcat.xyz/enhance?image=${encodeURIComponent(imageUrl)}`;

      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      const outputPath = path.join(__dirname, `remini_${event.senderID}.png`);
      fs.writeFileSync(outputPath, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: "✅ HD ছবি তৈরি সম্পন্ন ভাই! এখন দ্যাখো মজাটা 😎",
          attachment: fs.createReadStream(outputPath),
        },
        event.threadID,
        () => fs.unlinkSync(outputPath)
      );
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "❌ ভাই, ছবিটা HD করতে পারিনি। অন্য ছবি ট্রাই করো।",
        event.threadID,
        event.messageID
      );
    }
  },
};
