export const config = {
  name: "info",
  version: "1.0",
  author: "Tanvir Ankhon",
  description: "Shows Tanvir Ankhon's full personal info beautifully"
};

export async function onStart({ event }) {
  const infoMessage = `
╔════❰ 𝗧𝗔𝗡𝗩𝗜𝗥 𝗔𝗡𝗞𝗛𝗢𝗡 ❱════╗

🧠 নামঃ তানভীর আনখন  
🏠 বাসাঃ কুমিল্লা, বাংলাদেশ 🇧🇩  
🌍 বর্তমানে অবস্থানঃ সৌদি আরব 🇸🇦  
💼 পেশাঃ টোটো কোম্পানির মালিক  
💘 রিলেশন স্ট্যাটাসঃ সিঙ্গেল 😅  
📘 ফেসবুকঃ https://facebook.com/Tanubruh41  
📱 টেলিগ্রামঃ t.me/Tanubruh  
📸 ইনস্টাগ্রামঃ https://instagram.com/Tanubruh  

☎️ যোগাযোগের জন্য ইনবক্সে মেসেজ করো 💬  
🕋 ইসলাম প্রচার, জ্ঞান ভাগাভাগি করো 🌙  

╚════❰ 𝙏𝙃𝘼𝙉𝙆 𝙔𝙊𝙐 ❱════╝
  `;

  const images = [
    "https://i.postimg.cc/mgcKfwsn/Photo-Studio-1669021964995.jpg",
    "https://i.postimg.cc/q73hW9g4/Pics-Art-10-09-10-50-18.jpg",
    "https://i.postimg.cc/T1RKL19F/Pics-Art-10-09-10-50-44.jpg",
    "https://i.postimg.cc/Pf4pGbf5/Pics-Art-10-09-10-51-06.jpg",
    "https://i.postimg.cc/QC3jVzXr/IMG-20250923-190030.jpg"
  ];

  const randomImage = images[Math.floor(Math.random() * images.length)];

  return {
    body: infoMessage,
    attachment: randomImage
  };
}
