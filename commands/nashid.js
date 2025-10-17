const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nashid",
    aliases: ["nasheed", "song"],
    author: "Tanvir",
    version: "2.1",
    category: "islamic",
    shortDescription: "🎵 ইসলামিক নাশিদ শোনার কমান্ড",
    longDescription:
      "এই কমান্ডে আপনি জনপ্রিয় ইসলামিক নাশিদগুলোর তালিকা থেকে যেকোনো একটি বেছে শুনতে পারবেন।",
  },

  onStart: async function ({ api, event }) {
    const options = [
      { title: "Hasbi Rabbi Jallallah", url: "https://youtu.be/qk1ZJt2rQ_E" },
      { title: "Ya Ilahi Anta Maqsudi", url: "https://youtu.be/kK1zls8eThQ" },
      { title: "Allahu Allahu", url: "https://youtu.be/1uwYH8pQXQY" },
      { title: "Tala’al Badru Alayna", url: "https://youtu.be/DdI5pFfScno" },
      { title: "Mawlaya Salli wa Sallim", url: "https://youtu.be/wFwzJ6QzN0o" },
    ];

    let msg = "🎧 কোন ইসলামিক নাশিদ শুনতে চান?\n\n";
    options.forEach((item, i) => {
      msg += `${i + 1}. ${item.title}\n`;
    });
    msg += `\n👉 যেটা চান সেটার নাম্বার রিপ্লাই দিন (১–৫)`;

    api.sendMessage(msg, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        options,
      });
    });
  },

  onReply: async function ({ api, event, Reply }) {
    const { options, author } = Reply;
    if (event.senderID != author) return;

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > options.length) {
      return api.sendMessage("❌ বৈধ নাম্বার দিন (১–৫)।", event.threadID);
    }

    const selected = options[choice - 1];
    api.sendMessage(`🎵 আপনি বেছে নিয়েছেন: ${selected.title}\n⏳ লোড হচ্ছে...`, event.threadID);

    try {
      const filePath = path.join(__dirname, `temp_${Date.now()}.mp3`);
      const stream = ytdl(selected.url, { filter: "audioonly", quality: "highestaudio" });
      const writer = fs.createWriteStream(filePath);
      stream.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `🎶 এখন বাজছে: ${selected.title}`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ অডিও ডাউনলোডে সমস্যা হয়েছে!", event.threadID);
    }
  },
};
