const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fbinfo",
    aliases: ["uid", "fb", "fbuser"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "Facebook User Info Finder",
    longDescription:
      "কোনো ফেসবুক প্রোফাইল লিংক দিলে UID, নাম, প্রোফাইল পিকচার, কাভার পিকচার বের করে দেয়।",
    category: "tools",
    usage: "/fbinfo [Facebook Profile Link]",
  },

  onStart: async function ({ api, event, args }) {
    const link = args[0];
    if (!link)
      return api.sendMessage(
        "📎 অনুগ্রহ করে একটি ফেসবুক প্রোফাইল লিংক দিন!\n\nউদাহরণ:\n/fbinfo https://facebook.com/username",
        event.threadID,
        event.messageID
      );

    api.sendMessage("🔍 ইউজার ইনফো বের করা হচ্ছে ভাই, একটু অপেক্ষা করো...", event.threadID);

    try {
      const response = await axios.get(
        `https://api.ryzendesu.vip/api/tools/fbuid?url=${encodeURIComponent(link)}`
      );

      const data = response.data.data;

      if (!data || !data.uid)
        return api.sendMessage(
          "❌ ভাই, এই লিংক থেকে UID পাওয়া যায়নি।",
          event.threadID,
          event.messageID
        );

      const msg = `
👤 *Facebook User Information*

🪪 নামঃ ${data.name || "Unknown"}
🆔 UIDঃ ${data.uid}
🔗 প্রোফাইলঃ ${link}
🕓 জেনারেটেডঃ ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}

📸 নিচে প্রোফাইল ও কাভার পিক দেওয়া হলো 👇
`;

      // ছবি ডাউনলোড
      const profilePic = data.profile || null;
      const coverPic = data.cover || null;

      const attachments = [];

      if (profilePic) {
        const prof = (await axios.get(profilePic, { responseType: "arraybuffer" })).data;
        const profPath = path.join(__dirname, "profile.jpg");
        fs.writeFileSync(profPath, Buffer.from(prof));
        attachments.push(fs.createReadStream(profPath));
      }

      if (coverPic) {
        const cov = (await axios.get(coverPic, { responseType: "arraybuffer" })).data;
        const covPath = path.join(__dirname, "cover.jpg");
        fs.writeFileSync(covPath, Buffer.from(cov));
        attachments.push(fs.createReadStream(covPath));
      }

      api.sendMessage(
        { body: msg, attachment: attachments },
        event.threadID,
        () => {
          if (fs.existsSync("profile.jpg")) fs.unlinkSync("profile.jpg");
          if (fs.existsSync("cover.jpg")) fs.unlinkSync("cover.jpg");
        }
      );
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "😔 দুঃখিত ভাই, ইউজার ইনফো আনা যায়নি। আবার চেষ্টা করো।",
        event.threadID,
        event.messageID
      );
    }
  },
};
