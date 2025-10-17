const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nashid",
    aliases: ["nasheed", "song", "islamicsong"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "ইসলামিক নাশিদ শুনুন 🎵",
    longDescription: "বিভিন্ন ইসলামিক নাশিদ (nasheed) প্লে করতে পারবেন এই কমান্ড দিয়ে।",
    category: "islamic",
  },

  onStart: async function ({ api, event, args }) {
    const baseUrl = "https://raw.githubusercontent.com/Tanvirxxx69/Islamic-Nashid-Pack/main/";
    const nashidName = args[0]?.toLowerCase();

    if (!nashidName) {
      return api.sendMessage(
        `🎶 *ইসলামিক নাশিদ লিস্ট:*\n\n` +
          `1️⃣ ya_ilahi\n2️⃣ hasbi_rabbi\n3️⃣ labbaik_allahumma\n4️⃣ ya_adheeman\n5️⃣ tal_al_badru\n6️⃣ rahman_ya_rahman\n7️⃣ ya_habibi\n\n` +
          `💡 ব্যবহার: /nashid ya_ilahi`,
        event.threadID,
        event.messageID
      );
    }

    const nashids = {
      ya_ilahi: "ya-ilahi.mp3",
      hasbi_rabbi: "hasbi-rabbi.mp3",
      labbaik_allahumma: "labbaik-allahumma.mp3",
      ya_adheeman: "ya-adheeman.mp3",
      tal_al_badru: "tal-al-badru.mp3",
      rahman_ya_rahman: "rahman-ya-rahman.mp3",
      ya_habibi: "ya-habibi.mp3",
    };

    const selectedFile = nashids[nashidName];
    if (!selectedFile) {
      return api.sendMessage(
        `⚠️ এই নামে কোনো নাশিদ পাওয়া যায়নি!\n\n✅ ব্যবহারযোগ্য নাম:\n${Object.keys(nashids).join(", ")}`,
        event.threadID,
        event.messageID
      );
    }

    const fileUrl = `${baseUrl}${selectedFile}`;
    const filePath = path.join(__dirname, "temp.mp3");

    try {
      const response = await axios({ url: fileUrl, responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `🎧 এখন বাজছে: ${nashidName.replaceAll("_", " ")}`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ নাশিদ লোড করতে সমস্যা হয়েছে।", event.threadID);
    }
  },
};
