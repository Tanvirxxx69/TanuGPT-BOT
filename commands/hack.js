const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "hack",
    aliases: ["hackuser", "prankhack"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "প্র্যাংক: কাউকে hack করা মতো দেখায় (মজা করার জন্য)",
    longDescription: "কেউ /hack @user দিলে মজারভাবে বলে দেয় 'account hacked' এবং একটি মিম-স্টাইল ছবি পাঠায়।",
    category: "fun",
    guide: "{p}hack @user — মজার প্র্যাংক",
  },

  onStart: async function ({ api, event }) {
    try {
      const threadID = event.threadID;
      const mentions = event.mentions || {};
      const mentionedIDs = Object.keys(mentions);

      if (mentionedIDs.length === 0) {
        return api.sendMessage("⚠️ ইউজারকে mention করে বলো — উদাহরণ: /hack @Rahim", threadID);
      }

      const targetID = mentionedIDs[0];

      // ডిఫল্ট টেমপ্লেট (যদি প্রোফাইল পিক পাওয়া না যায়)
      const templateUrl = "https://i.ibb.co/9rQvYqf/hacked-template.png"; // তোমার নিজের টেমপ্লেট আপলোড করে এখানে URL বদলাও

      // চেষ্টা করে প্রোফাইল পিক নেওয়া
      const profilePicUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;

      // লোকাল ফাইল নাম
      const outPath = path.join(__dirname, `hack_${Date.now()}.png`);

      // লোড ইমেজস
      let avatar;
      try {
        const avatarImage = await Jimp.read(profilePicUrl);
        avatar = avatarImage.resize(350, 350);
      } catch (err) {
        // প্রোফাইল পিক না পাওয়া গেলে null রেখে দিবে
        avatar = null;
      }

      // টেমপ্লেট লোড করা
      const template = await Jimp.read(templateUrl);

      // কনসেপ্ট: template-এ avatar বসাবে মাঝখানে, তারপর RED "HACKED" স্ট্যাম্প
      if (avatar) {
        // avatar কে template-এ composite করো (পজিশন template অনুযায়ী ঠিক করতে পারো)
        // ধরলাম template এ avatar বসানোর জায়গা x=120,y=120 (template বদলে adjust করো)
        avatar.resize(300, 300);
        template.composite(avatar, 120, 120);
      }

      // স্ট্যাম্প লেখা যোগ করা
      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
      // লাল প্যাঁচ দিলে দেখতে ভালো হয় — আমরা প্রথমে সাদা বর্ডার, পরে লাল টেক্সট:
      const stampText = "HACKED";
      // সাদা outline
      const stampX = 40;
      const stampY = template.getHeight() - 160;
      // draw thick outline by drawing text offset a few times
      const fontWhite = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
      template.print(fontWhite, stampX-2, stampY-2, stampText);
      template.print(fontWhite, stampX+2, stampY-2, stampText);
      template.print(fontWhite, stampX-2, stampY+2, stampText);
      template.print(fontWhite, stampX+2, stampY+2, stampText);
      // main red text
      const fontRed = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK); // black font, then colorize
      template.print(fontRed, stampX, stampY, stampText);
      // colorize that area red-ish
      // simpler: draw a semi-transparent red rectangle behind text
      template.scan(stampX-10, stampY-10, 420, 90, function(x, y, idx) {
        // add red tint
        this.bitmap.data[idx + 0] = Math.min(255, this.bitmap.data[idx + 0] + 120); // R
        // G,B unchanged to create red effect
      });

      // Save
      await template.writeAsync(outPath);

      // Send prank message + image
      const targetName = (mentions[targetID] && mentions[targetID].replace(/@/g, "")) || "Friend";
      const prankMsg = `⚠️ Attention! ${targetName} — account hacked! 🔒\n(প্র্যাংক: hack command চালানো হয়েছে। কোনো প্রাতিষ্ঠানিক ক্ষতি নেই।)`;

      await api.sendMessage({ body: prankMsg, attachment: fs.createReadStream(outPath) }, threadID);

      // ক্লিন আপ
      setTimeout(() => {
        try { fs.unlinkSync(outPath); } catch (e) {}
      }, 30 * 1000);
    } catch (err) {
      console.error("Hack command error:", err);
      api.sendMessage("❌ কোনো সমস্যা হয়েছে; পরে আবার ট্রাই করো!", event.threadID);
    }
  },
};
