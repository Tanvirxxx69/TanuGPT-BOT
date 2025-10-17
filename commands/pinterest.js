// commands/pinterest.js
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin", "pins"],
    version: "1.0",
    author: "Tanvir",
    shortDescription: "Pinterest/Images search - returns top 10 pictures",
    longDescription: "Searches Pinterest for pictures (best-effort). Falls back to DuckDuckGo images if needed.",
    category: "media",
    guide: "{p}pinterest [search term]\nExample: /pinterest nature"
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;
    const query = args.join(" ").trim();
    if (!query) return api.sendMessage("🔍 দয়া করে সার্চ টার্ম দাও। উদাহরণ: /pinterest nature", threadID);

    const replyMsg = await api.sendMessage(`🔎 "${query}" - সার্চ করা হচ্ছে (Pinterest দেখছে, না হলে fallback) ...`, threadID);

    try {
      // প্রথমে Pinterest পেজকে চেষ্টা করব (best-effort)
      const pinterestUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
      const pinterestRes = await axios.get(pinterestUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)",
          Accept: "text/html"
        },
        timeout: 10000
      });

      const $ = cheerio.load(pinterestRes.data);
      let imgs = [];

      // চেষ্টা: Pinterest পেজে থাকা img ট্যাগের src/srcset/data-src সংগ্রহ করা
      $("img").each((i, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-image-url");
        if (src && src.startsWith("http")) imgs.push(src);
        // srcset handle
        const srcset = $(el).attr("srcset");
        if (srcset) {
          const first = srcset.split(",")[0].split(" ")[0];
          if (first && first.startsWith("http")) imgs.push(first);
        }
      });

      // অনন্য এবং http(s) ফিল্টার
      imgs = Array.from(new Set(imgs)).filter(u => /^https?:\/\//.test(u));

      // যদি pinterest-এ পর্যাপ্ত ছবি না পাওয়া যায়, fallback to DuckDuckGo
      if (imgs.length < 6) {
        imgs = await duckDuckGoImages(query, 10);
      } else {
        imgs = imgs.slice(0, 10);
      }

      if (!imgs || imgs.length === 0) {
        return api.sendMessage("⚠️ কোনো ছবি পাওয়া যায় নাই (Pinterest ও fallback উভয়েই)।", threadID);
      }

      // ডাউনলোড ও পাঠানো
      const tempFiles = await downloadImages(imgs, __dirname, 10);
      const attachments = tempFiles.map(f => fs.createReadStream(f));

      await api.sendMessage({ body: `🖼️ "${query}" জন্য টপ ${attachments.length} পিকস — Enjoy!`, attachment: attachments }, threadID);

      // ক্লিনআপ
      for (const f of tempFiles) {
        try { fs.unlinkSync(f); } catch (e) {}
      }
    } catch (err) {
      console.error("Pinterest command error:", err);
      // চেষ্টা করে DuckDuckGo দিয়ে পাঠিয়ে দেখানো
      try {
        const imgs = await duckDuckGoImages(query, 10);
        if (!imgs || imgs.length === 0) return api.sendMessage("⚠️ কোনো ছবি পাওয়া যায় নাই।", threadID);

        const tempFiles = await downloadImages(imgs, __dirname, 10);
        const attachments = tempFiles.map(f => fs.createReadStream(f));
        await api.sendMessage({ body: `🖼️ (fallback) "${query}" জন্য টপ ${attachments.length} পিকস`, attachment: attachments }, threadID);
        for (const f of tempFiles) { try { fs.unlinkSync(f); } catch(e){} }
      } catch (e) {
        console.error("Fallback also failed:", e);
        api.sendMessage("❌ ছবি আনতে সমস্যা হয়েছে, পরে চেষ্টা করুন।", threadID);
      }
    } finally {
      // reply message reaction or delete
      try { api.unsendMessage(replyMsg.messageID); } catch(e){}
    }
  }
};

// ==== Helper functions ====

async function duckDuckGoImages(query, limit = 10) {
  try {
    const url = `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&l=us-en&o=json`;
    let imgs = [];
    let next = url;
    while (next && imgs.length < limit) {
      const res = await axios.get(next, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 10000 });
      const data = res.data;
      if (!data || !data.results) break;
      for (const r of data.results) {
        if (r.image && /^https?:\/\//.test(r.image)) imgs.push(r.image);
        if (imgs.length >= limit) break;
      }
      // pagination
      next = data.next || null;
    }
    return Array.from(new Set(imgs)).slice(0, limit);
  } catch (err) {
    console.error("DuckDuckGo image error:", err);
    return [];
  }
}

async function downloadImages(urls, destDir, limit = 10) {
  const files = [];
  const max = Math.min(urls.length, limit);
  for (let i = 0; i < max; i++) {
    const url = urls[i];
    try {
      const resp = await axios.get(url, { responseType: "arraybuffer", timeout: 20000, headers: { "User-Agent": "Mozilla/5.0" } });
      const ext = getExtFromUrl(url) || "jpg";
      const filename = path.join(destDir, `${Date.now()}_${uuidv4()}.${ext}`);
      fs.writeFileSync(filename, Buffer.from(resp.data, "binary"));
      files.push(filename);
    } catch (e) {
      console.warn("Download failed for:", url);
    }
  }
  return files;
}

function getExtFromUrl(url) {
  try {
    const p = url.split("?")[0];
    const ext = p.split(".").pop().toLowerCase();
    if (["jpg","jpeg","png","webp","gif"].includes(ext)) return ext;
    return null;
  } catch (e) { return null; }
      }
