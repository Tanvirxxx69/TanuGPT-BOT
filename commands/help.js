module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "Tanvir",
    description: "বটের সব কমান্ডের তালিকা দেখাবে 💫",
    usage: "/help অথবা /help [command name]"
  },

  run: async ({ api, event, args, commands }) => {
    const { threadID, messageID } = event;
    const commandList = Array.from(commands.values());

    if (args.length > 0) {
      const cmdName = args[0].toLowerCase();
      const cmd = commands.get(cmdName);
      if (!cmd)
        return api.sendMessage(`❌ কমান্ড "${cmdName}" পাওয়া যায়নি!`, threadID, messageID);

      const { name, version, description, usage, author } = cmd.config;
      return api.sendMessage(
        `🔍 কমান্ড: ${name}\n🧩 ভার্সন: ${version}\n📖 বর্ণনা: ${description}\n⚙️ ব্যবহার: ${usage}\n👤 নির্মাতা: ${author}`,
        threadID,
        messageID
      );
    }

    let msg = "🤖 𝐓𝐚𝐧𝐯𝐢𝐫𝐁𝐨𝐭 এর সকল কমান্ড 🔥\n━━━━━━━━━━━━━━━━━━━\n";

    for (const cmd of commandList) {
      msg += `🧩 ${cmd.config.name} — ${cmd.config.description}\n`;
    }

    msg += "\n💡 নির্দিষ্ট কমান্ড জানতে লিখুন: /help [command name]";
    api.sendMessage(msg, threadID, messageID);
  }
};
