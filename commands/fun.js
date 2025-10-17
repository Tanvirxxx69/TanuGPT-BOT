const replies = [
  { trigger: "tanvir", reply: "হ্যা বলো রে 😎 তানভীর ভাই হাজির! এখন আবার কে প্রেমে পড়লো?" },
  { trigger: "তানভীর", reply: "এই যে নাম নিলি 😏 কি খবর ভাই? মিস করছিলে নাকি?" },
  { trigger: "ভাই", reply: "বলো ভাই ❤️ কিছু কষ্টে আছো নাকি? আমি শুনবো!" },
  { trigger: "প্রেম", reply: "প্রেম? 😏 আজকাল প্রেমে বিশ্বাস নাই ভাই, কোডই আসল প্রেম 💻💔" },
  { trigger: "ভালোবাসি", reply: "ওহো 😳 আমিও তোকে ভালোবাসি রে ভাই 🥰 কিন্তু গোপন রাখিস 😉" },
  { trigger: "ঘুমাসনি", reply: "ঘুম আসে না রে ভাই 😴 চিন্তা বেশি তাই!" },
  { trigger: "সুন্দর", reply: "তুই আয়নায় তাকাস একবার! 🤭 তোর মতো সুন্দর মানুষ কয়জন আছে রে?" },
  { trigger: "কি খবর", reply: "বেশ ভালো ভাই 😍 তুই কেমন? মন খারাপ নাকি?" },
  { trigger: "ধন্যবাদ", reply: "আলহামদুলিল্লাহ ❤️ সবই আল্লাহর রহমতে ভাই!" },
  { trigger: "😂", reply: "হাসবি না রে 🤣 হেসে ফুসে পরে যাবি আবার!" },
  { trigger: "😅", reply: "হাহা বুঝছি 😅 একটু লজ্জা লাগছে তাই না?" },
  { trigger: "😒", reply: "এইভাবে তাকাস কেনো রে! কিছু বলবি নাকি? 😏" },
  { trigger: "🙂", reply: "এই হাসিটা কেমন সন্দেহজনক লাগছে 😏" },
  { trigger: "😢", reply: "আরে কাঁদিস না রে 😔 আল্লাহ আছেন, আমি আছি 💙" },
  { trigger: "😭", reply: "কি হইছে রে ভাই 😭 কাঁদিস না, সব ঠিক হয়ে যাবে ইনশাআল্লাহ 🤲" },
  { trigger: "😡", reply: "রাগ কইরা লাভ নাই ভাই 😤 একটু ঠান্ডা পানি খা, দোয়া কর শান্তি পাবি 🕊️" },
  { trigger: "😎", reply: "এই যে কুল ভাই 😎 চল একসাথে চা খাই ☕" },
  { trigger: "😳", reply: "ইশশ 😳 এমন তাকাইস না রে, লজ্জা পাই!" },
  { trigger: "💋", reply: "এইএই! 😳 চুমু দিচ্ছিস নাকি? আগে পারমিশন দে বেহায়া!" },
  { trigger: "😜", reply: "আহারে দুষ্টু 😜 আবার কি খেলা শুরু করলি?" },
  { trigger: "😏", reply: "এই হাসিটা কিছু তো লুকায় 🤨 বল কি ঘটছে!" },
  { trigger: "🤔", reply: "চিন্তা করিস না ভাই, আল্লাহ চায়লে সব ঠিক হবে 🤲" },
  { trigger: "❤️", reply: "ভালোবাসা সুন্দর জিনিস ভাই ❤️ শুধু সঠিক মানুষ পেলে!" },
  { trigger: "💔", reply: "ভাঙা মনও একদিন সুস্থ হবে ভাই 💔 ধৈর্য ধর!" },
  { trigger: "🥰", reply: "ইশশ 🥰 এমন আদর দিলে তো আমি গলে যাবো!" },
  { trigger: "🤭", reply: "কি রে 😳 কিছু লুকাচ্ছিস নাকি?" },
  { trigger: "🤨", reply: "এই দৃষ্টি কেমন ভাই 😅 সন্দেহ হচ্ছে কিছু একটা!" },
  { trigger: "😇", reply: "মাশাআল্লাহ ভাই 😇 এমন হাসি দেখলে মন ভালো হয়ে যায়!" },
  { trigger: "🤪", reply: "তুই একদম পাগল ভাই 🤪 কিন্তু কিউট!" },
  { trigger: "💀", reply: "ওফফ 💀 ভয় পেয়ে গেলাম ভাই, মজা কইরা মারলি নাকি!" },
];

module.exports = {
  config: {
    name: "fun",
    aliases: ["auto", "mojar"],
    description: "Auto fun replies with emojis and mood-based responses",
    usage: "/fun",
  },

  onStart: async function ({ event, api }) {
    const msg = event.body ? event.body.toLowerCase() : "";

    // Matching triggers
    for (const item of replies) {
      if (msg.includes(item.trigger)) {
        api.sendMessage(item.reply, event.threadID, event.messageID);
        break;
      }
    }
  },
};
