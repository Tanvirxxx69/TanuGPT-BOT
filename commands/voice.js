import axios from "axios";
import fs from "fs-extra";
import play from "play-dl";

export const config = {
  name: "voice",
  version: "1.0",
  author: "Tanvir Ankhon",
  description: "Send voice reply or audio response"
};

export async function onStart({ event, args }) {
  const text = args.join(" ");
  const voiceList = {
    hello: "https://cdn.pixabay.com/download/audio/2022/03/30/audio_1a5b7f21e3.mp3",
    sad: "https://cdn.pixabay.com/download/audio/2021/11/09/audio_4d733cc0.mp3",
    happy: "https://cdn.pixabay.com/download/audio/2021/10/20/audio_ba5a5d3a.mp3"
  };

  const selected = voiceList[text.toLowerCase()] || voiceList.hello;

  return {
    body: `🎙️ Voice message for: ${text}`,
    attachment: await play.stream(selected)
  };
}
