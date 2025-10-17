module.exports = {
  config: {
    name: "emoji",
    aliases: ["emojireact", "emojireply"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "ইমোজি অনুযায়ী রিপ্লাই",
    longDescription: "যে কোনো ইমোজির মানে বুঝে সুন্দর রিপ্লাই দেয়",
    category: "fun",
  },

  onStart: async function ({ api, event }) {
    const msg = event.body || "";

    const emojiReplies = {
      "😒": "কি হলো ভাই 😒 এভাবে তাকাচ্ছো কেনো?",
      "🙂": "কি জান ভাই, মনে হয় কেউ সেন্টি খাচ্ছে 🙂",
      "😢": "কেঁদো না ভাই 😢 আল্লাহর উপর ভরসা রাখো!",
      "😂": "ওহহ ভাই! হাসতে হাসতে পেট ব্যথা 😂",
      "😡": "রাগ করো না ভাই 😡 শান্ত হও, দোয়া করো!",
      "❤️": "আহা! কারে ভালোবাসো ভাই ❤️",
      "💋": "ইশ চুমু দিচ্ছো কেনো 😳 একটু লজ্জা করো ভাই 💋",
      "😎": "বাহ! ভাই একদম হ্যান্ডসাম লাগতেছে 😎",
      "😴": "ঘুমাও ভাই 😴 স্বপ্নে হয়তো বিয়ে হবে 😅",
      "🥺": "এইভাবে তাকাইও না ভাই 🥺 মন গলে যায়!",
      "🤔": "ভাবতেছো ভাই 🤔 নাকি প্রেমের চিন্তা?",
      "😇": "মাশাআল্লাহ ভাই 😇 ফেরেশতা হইলা নাকি!",
      "😈": "আরে ভাই 😈 এই দুষ্টুমি ছাড়ো!",
      "😭": "আল্লাহু আকবর ভাই 😭 কষ্ট দিও না নিজেকে!",
      "🤗": "একটা হাগ দিলে মনটা ভালো লাগে 🤗",
      "🥰": "ইশ! কারে ভালোবাসো ভাই 🥰",
    };

    let reply = null;

    // ইউজার মেসেজে কোন ইমোজি আছে তা চেক করো
    for (const emoji in emojiReplies) {
      if (msg.includes(emoji)) {
        reply = emojiReplies[emoji];
        break;
      }
    }

    if (reply) {
      api.sendMessage(reply, event.threadID, event.messageID);
    }
  },
};
