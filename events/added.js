const axios = require("axios");
const fs = require("fs");
const path = require("path");

// config.json থেকে ব্যবহার করতে চাইলে index.js থেকে config পাঠাতে পারো,
// বা require() করে নিতে পারো (যদি same folder)
// const config = require("../config.json");

module.exports = async function ({ api, event, config }) {
  try {
    // Facebook chat-api / fca-unofficial এ গ্রুপে অ্যাড ইভেন্ট সাধারণত log:subscribe
    const logType = event.logMessageType || event.type || "";

    // addedParticipants থাকতে হবে
    const added = (event.addedParticipants || event.logMessageData?.addedParticipants || []);
    if (!added || added.length === 0) return;

    // বট নিজেই অ্যাড হয়েছে কি না চেক করো
    const myID = api.getCurrentUserID ? api.getCurrentUserID() : (api.getCurrentUserID && api.getCurrentUserID());
    let botWasAdded = false;
    for (const p of added) {
      // বিভিন্ন লাইব্রেরি ভিন্ন ফরম্যাটে দেয় — userFbId / userId / id ইত্যাদি
      const pid = p.userFbId || p.userID || p.id || p;
      if (!pid) continue;
      if (String(pid) === String(myID)) {
        botWasAdded = true;
        break;
      }
    }
    if (!botWasAdded) return; // যদি বট না হয়, কিছু না করো

    // এখন Welcome মেসেজ তৈরির অংশ
    const ownerName = (config && config.ownerName) || "তানভীর ভাই";
    const helpPrefix = (config && config.prefix) || "/";

    const welcomeText = `সালাম সবাই! 👋\nআমি *${ownerName}* এর অফিসিয়াল বট — তানভীর ভাইয়ের বট 🤖\n\nযদি আমাকে ব্যবহার করতে চাও, টাইপ করো:\n${helpPrefix}help\n\n➡️ বটের প্রধান কাজ: নামাজ রিমাইন্ডার, ইসলামিক বার্তা, ভিডিও/ইমেজ টুলস ও মজা!\n\n*নোট:* এই গ্রুপে এড করলে আমি অটোমেটিক কিছু মেসেজ পাঠাতে পারি।`;

    // প্রথমে টেক্সট পাঠাও
    await api.sendMessage(welcomeText, event.threadID);

    // তারপর config.ownerPics থেকে ১–২টি ছবি অ্যাটাচ করে দাও (যদি থাকে)
    try {
      const pics = (config && config.ownerPics) || [];
      if (pics.length > 0) {
        // আমরা কপি করে লোকাল ফাইলে নিয়ে তারপর পাঠাবো
        const attachments = [];
        for (let i = 0; i < Math.min(3, pics.length); i++) {
          const url = pics[i];
          try {
            const res = await axios.get(url, { responseType: "arraybuffer", timeout: 20000 });
            const filePath = path.join(__dirname, `tmp_owner_${i}_${Date.now()}.jpg`);
            fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));
            attachments.push(fs.createReadStream(filePath));
          } catch (err) {
            console.error("Owner pic download failed:", err.message || err);
          }
        }
        if (attachments.length > 0) {
          // ছবি সহ আরেকটি মেসেজ
          await api.sendMessage({ body: `🖼️ Owner এর ছবি —`, attachment: attachments }, event.threadID);
          // ক্লিন আপ
          for (const a of attachments) {
            try { fs.unlinkSync(a.path); } catch (e) {}
          }
        }
      }
    } catch (err) {
      console.error("Owner pics error:", err);
    }

    // অপশনাল: গ্রুপে স্বাগত শুনশ্রুতি (voice) চালাতে চাইলে এখানে termux-tts / gtts থেকে mp3 বানিয়ে পাঠাতে পারো
    // উদাহরণ (commented):
    // const ttsMsg = `আমি ${ownerName} এর বট, আমাকে ব্যবহার করতে ${helpPrefix}help লিখো`;
    // create mp3 and send as attachment...

  } catch (err) {
    console.error("subscribe event error:", err);
  }
};
