/**
 * commands/ai.js
 * Smart AI Q/A command:
 * - Uses OpenAI if OPENAI_API_KEY present
 * - Fallback: local QA database + similarity matching
 * - Optional TTS with gtts when user requests "ভয়েস" or "voice"
 *
 * Compatible with the project structure we've been building.
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// local knowledge base (can be extended later)
const kbPath = path.join(__dirname, "..", "includes", "knowledge.json");

// helper: load KB (if exists), otherwise small default QA
function loadKnowledge() {
  try {
    if (fs.existsSync(kbPath)) {
      const raw = fs.readFileSync(kbPath, "utf8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("KB load error", e);
  }
  // minimal default fallback Q/A (Bangla + English examples)
  return [
    { q: "নামাজ কখন পড়ে", a: "নামাজ পাঁচ ওয়াক্তঃ ফজর, যোহর, আসর, মাগরিব ও এশা — স্থানীয় সময় অনুযায়ী। /namaz দিয়ে আজকের সময় দেখতে পারো।" },
    { q: "ফজরের সময়", a: "ফজরের সঠিক সময় প্রতিদিন আলাদা হয় — তোমার শহরের টাইমিং পেতে /namaz লিখো।" },
    { q: "ইসলাম কি", a: "ইসলাম হলো আল্লাহর ওয়াদা মেনে চলার জীবনপদ্ধতি — এটি মন, আচরণ আর ইবাদত তিন প্রসঙ্গে নির্দেশ দেয়।" },
    { q: "hi", a: "Hello! How can I help you?" },
    { q: "who made you", a: "This bot was prepared by Tanvir Ankhon to help people with Islamic knowledge and general questions." }
  ];
}

// very simple text similarity (bag-of-words Jaccard-like)
function textSimilarity(a = "", b = "") {
  const norm = (s) => s.toString().toLowerCase().replace(/[^\w\sঅ-হ]/g, " ").split(/\s+/).filter(Boolean);
  const A = new Set(norm(a));
  const B = new Set(norm(b));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  const uni = new Set([...A, ...B]).size;
  return inter / uni; // 0..1
}

// choose best local KB answer
function bestLocalAnswer(question, kb) {
  let bestScore = 0;
  let best = null;
  for (const item of kb) {
    const score = textSimilarity(question, item.q);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  // threshold: if good match return, else null
  if (bestScore >= 0.25) return { answer: best.a, score: bestScore };
  return null;
}

// detect if user asked for voice
function wantsVoice(question) {
  if (!question) return false;
  const s = question.toLowerCase();
  return s.includes("ভয়েস") || s.includes("ভয়েস") || s.includes("voice") || s.includes("/voice");
}

// send TTS using gtts (if available)
async function makeTTSAndAttach(text, lang = "bn") {
  // lazy require so repo doesn't crash if gtts not installed
  try {
    // prefer 'gtts' npm package if installed
    // (the environment must have internet for Google TTS endpoint or gtts package)
    // We'll try to use gtts package; fallback to Google translate TTS url stream
    let filePath = path.join(__dirname, `../tmp/ai_tts_${Date.now()}.mp3`);
    // ensure tmp folder exists
    fs.mkdirSync(path.join(__dirname, "../tmp"), { recursive: true });

    try {
      // try gtts package
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Gtts = (await import("gtts")).default || (await import("gtts"));
      const tts = new Gtts(text, lang);
      await new Promise((resolve, reject) => {
        tts.save(filePath, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      return filePath;
    } catch (gerr) {
      // fallback: Google translate TTS endpoint (simple)
      const tl = lang === "bn" ? "bn" : "en";
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${tl}&client=tw-ob`;
      const resp = await axios.get(ttsUrl, { responseType: "arraybuffer", headers: { "User-Agent": "Mozilla/5.0" } });
      fs.writeFileSync(filePath, Buffer.from(resp.data));
      return filePath;
    }
  } catch (err) {
    console.error("TTS error", err);
    return null;
  }
}

// Main exported command
export const config = {
  name: "ai",
  aliases: ["ask", "chat"],
  version: "1.0",
  author: "Tanu-Bruh",
  description: "Smart AI Q/A — text reply by default, optional voice when requested"
};

export async function onStart({ api, event, args }) {
  const threadID = event.threadID;
  const userQuery = (args || []).join(" ").trim();
  if (!userQuery) {
    return api.sendMessage("❓ প্রশ্ন লিখো, উদাহরণ: `/ai নামাজ কীভাবে পড়তে হয়` অথবা `/ai Islam কী voice`", threadID);
  }

  // If voice requested, remove the keyword from prompt for better reply
  const isVoice = wantsVoice(userQuery);
  const prompt = userQuery.replace(/\b(ভয়েস|ভয়েস|voice|\/voice)\b/gi, "").trim();

  // Try OpenAI if API key present
  const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_LOCAL || null;

  if (openaiKey) {
    try {
      // Use OpenAI ChatCompletions
      const payload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      };
      const res = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 20000
      });
      const reply = res.data?.choices?.[0]?.message?.content?.trim() || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";
      // send text (and optional voice)
      if (isVoice) {
        const lang = /[অ-হ]/.test(reply) ? "bn" : "en";
        const file = await makeTTSAndAttach(reply, lang);
        if (file) {
          await api.sendMessage({ body: reply, attachment: fs.createReadStream(file) }, threadID, () => {
            try { fs.unlinkSync(file); } catch (e) {}
          });
        } else {
          await api.sendMessage(reply, threadID);
        }
      } else {
        await api.sendMessage(reply, threadID);
      }
      return;
    } catch (err) {
      console.error("OpenAI error:", err?.response?.data || err.message);
      // continue to fallback
    }
  }

  // FALLBACK: local knowledge + simple matching
  const kb = loadKnowledge();
  const best = bestLocalAnswer(prompt, kb);
  if (best) {
    const answer = best.answer;
    if (isVoice) {
      const lang = /[অ-হ]/.test(answer) ? "bn" : "en";
      const file = await makeTTSAndAttach(answer, lang);
      if (file) {
        await api.sendMessage({ body: answer, attachment: fs.createReadStream(file) }, threadID, () => {
          try { fs.unlinkSync(file); } catch (e) {}
        });
      } else {
        await api.sendMessage(answer, threadID);
      }
    } else {
      await api.sendMessage(answer, threadID);
    }
    return;
  }

  // LAST RESORT: polite generic fallback reply (friendly tone)
  const generic = "দুঃখিত ভাই—আমি ঠিক উত্তরটা বুঝতে পারিনি। তুমি একটু সহজভাবে বা ভিন্নভাবে লিখে দেখো।\n\n(তোমার প্রশ্নের মতো ব্যাপারে সাহায্য করতে চাই; উদাহরণ: `/ai নামাজের সময় কী`)";
  if (isVoice) {
    const file = await makeTTSAndAttach(generic, "bn");
    if (file) {
      await api.sendMessage({ body: generic, attachment: fs.createReadStream(file) }, threadID, () => {
        try { fs.unlinkSync(file); } catch (e) {}
      });
    } else {
      await api.sendMessage(generic, threadID);
    }
  } else {
    await api.sendMessage(generic, threadID);
  }
}
