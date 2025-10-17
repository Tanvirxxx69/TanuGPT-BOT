const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "islamic",
    aliases: ["sura", "zikir", "dua", "ayat"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "সূরা, দোয়া, যিকর ও আয়াত শুনুন এক কমান্ডেই",
    longDescription:
      "এই কমান্ডের মাধ্যমে আপনি ইসলামিক সূরা, দোয়া, যিকর ও আয়াত শুনতে পারবেন।",
    category: "islamic",
  },

  onStart: async function ({ api, event, args }) {
    const baseUrl = "https://raw.githubusercontent.com/Tanvirxxx69/Islamic-Audio-Pack/main/";

    // কোন ক্যাটাগরি: sura / dua / zikir / ayat
    const type = args[0]?.toLowerCase();
    const name = args.slice(1).join(" ");

    if (!type) {
      return api.sendMessage(
        `🕌 ইসলামিক কমান্ড ব্যবহার করুন:\n\n` +
          `🌿 /islamic sura [নাম]\n` +
          `🌿 /islamic dua [নাম]\n` +
          `🌿 /islamic zikir [নাম]\n` +
          `🌿 /islamic ayat [নাম]\n\n` +
          `উদাহরণ:\n/islamic sura fatiha\n/islamic dua astaghfirullah\n/islamic zikir subhanallah\n/islamic ayat rahman`,
        event.threadID,
        event.messageID
      );
    }

    const data = {
      sura: {
        fatiha: "surah-fatiha.mp3",
        ikhlas: "surah-ikhlas.mp3",
        nas: "surah-nas.mp3",
        falaq: "surah-falaq.mp3",
        rahman: "surah-rahman.mp3",
        yaseen: "surah-yaseen.mp3",
        mulk: "surah-mulk.mp3",
        kawthar: "surah-kawthar.mp3",
      },
      dua: {
        bismillah: "dua-bismillah.mp3",
        astaghfirullah: "dua-astaghfirullah.mp3",
        allahumma: "dua-allahumma.mp3",
        rabbi: "dua-rabbi-ghfirli.mp3",
        subhanallah: "dua-subhanallah.mp3",
      },
      zikir: {
        lailaha: "zikr-la-ilaha.mp3",
        subhanallah: "zikr-subhanallah.mp3",
        alhamdulillah: "zikr-alhamdulillah.mp3",
        allahuakbar: "zikr-allahu-akbar.mp3",
        astaghfirullah: "zikr-astaghfirullah.mp3",
      },
      ayat: {
        rahman: "ayat-rahman.mp3",
        taqwa: "ayat-taqwa.mp3",
        sabr: "ayat-sabr.mp3",
        iman: "ayat-iman.mp3",
        nur: "ayat-nur.mp3",
      },
    };

    const selectedType = data[type];
    if (!selectedType) {
      return api.sendMessage(
        "⚠️ সঠিক টাইপ লিখো: sura / dua / zikir / ayat",
        event.threadID
      );
    }

    const file = selectedType[name?.toLowerCase()];
    if (!file) {
      return api.sendMessage(
        `❌ নাম পাওয়া যায়নি!\n\n🔹 ব্যবহারযোগ্য নাম:\n${Object.keys(selectedType).join(", ")}`,
        event.threadID
      );
    }

    const url = `${baseUrl}${file}`;
    const filePath = path.join(__dirname, "temp.mp3");

    try {
      const response = await axios({ url, responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `🕋 চলছে: ${type} - ${name}`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ অডিও লোড করতে সমস্যা হয়েছে।", event.threadID);
    }
  },
};
