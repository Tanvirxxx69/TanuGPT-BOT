module.exports = {
  config: {
    name: "birthdayEvent",
    version: "1.0",
    author: "Tanvir",
    shortDescription: "তানভীর ভাইয়ের জন্মদিনে অটো উইশ পাঠাবে",
    category: "event"
  },

  onStart: async function ({ api }) {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // October = 10

    // 🎂 জন্মদিনের তারিখ চেক করো
    if (day === 30 && month === 10) {
      const message = `
🎉 আজ ৩০ অক্টোবর 🎉  
💖 আমাদের প্রিয় তানভীর ভাইয়ের জন্মদিন 💖

🌼 এই দিনে পৃথিবী পেয়েছিল এক হাসিখুশি মানুষকে 😄  
✨ তানভীর ভাই, আপনার জীবন হোক আনন্দে ও সাফল্যে ভরা!  
🌈 আপনার হাসি যেন কখনো মলিন না হয় 💫  
🎂 শুভ জন্মদিন ভাই ❤️  
— আপনার বট ও বন্ধুর পক্ষ থেকে অনেক ভালোবাসা 🥰
`;

      // সব গ্রুপে পাঠানো
      api.getThreadList(100, null, ["INBOX"], (err, list) => {
        if (err) return console.error(err);
        list.forEach(thread => {
          if (thread.isGroup) {
            api.sendMessage(message, thread.threadID);
          }
        });
      });
    }
  }
};
