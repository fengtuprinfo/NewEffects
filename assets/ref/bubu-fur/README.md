# 喵布布本喵掉的毛

- 名稱、[Suno 分享頁](https://suno.com/s/Ss2KV8wTFNJDngor)與完整歌詞由使用者提供。Suno 曲目 ID：`97dbe1cd-25e1-46ad-b6bf-e54d59b22018`，原分享頁標題「026_喵布布本喵掉的毛_中文」。
- PV 編號 `22`，第二版播放器 ID `suno-97dbe1cd`。兩版使用現有幸運八人，喵布布（索引 4）為預設主唱與中央人物；其他歌曲仍沿用自己的中央人物設定，手動選主唱時可覆寫。
- 公開分享頁播放音源轉為 192 kbps MP3，約 169.97 秒，保留全曲。音訊及同步 SRT 隨 repo 部署。
- `lyrics-zh.txt` 保存使用者的 48 行原文，保留喵聲、括號和聲、888／88 與標點；字幕依本機 faster-whisper medium 的詞級時間戳核對原文斷句，辨識結果不取代歌詞。
- `timings-zh.json` 保存時間軸，可執行 `node tools/build-bubu-fur-subtitles.mjs` 重建 SRT，檢查句數、重疊與起訖時間。

## 英文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/WcUf9f4S9wdFbQ4L)，曲目 ID `ed4509a7-6b60-42ae-a666-8ab7cfde0310`，模型 `v6-mini`。原分享頁標題「英文歌詞 026_喵布布本喵掉的毛_中文」，介面名稱為「喵布布本喵掉的毛(英文歌詞)」。
- PV 編號 `23`，第二版 ID `suno-ed4509a7`。同樣使用幸運八人，由喵布布擔任預設主唱及中央人物，與中文版分開保存音源及時間軸。
- 完整音訊約 169.21 秒，轉為 192 kbps MP3。`lyrics-en.txt` 保存使用者的 48 行英文歌詞，保留引號、喵聲及括號和聲；`timings-en.json` 依此版音訊的 faster-whisper medium 詞級時間戳核對斷句，片頭另切段並以 small 模型複核。
- 英文不沿用中文版時間軸，也不以辨識結果改寫原文。

## 日文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/NbyKlqFaXHtpC3e6)，曲目 ID `76d45ad5-7ce7-4485-adb1-0f25e5047c0e`，模型 `v6-mini`。原分享頁標題「日文歌詞 026_喵布布本喵掉的毛_中文」，介面名稱為「喵布布本喵掉的毛(日文歌詞)」。
- PV 編號 `24`，第二版 ID `suno-76d45ad5`。同樣使用幸運八人與喵布布中央站位，完整音訊約 175.97 秒，轉為 192 kbps MP3。
- `lyrics-ja.txt` 保存使用者的 48 行日文原文，保留假名、空格及括號和聲。時間軸另存 `timings-ja.json`，依日文音訊的 faster-whisper 詞級時間戳核對斷句；不套用中英文版時間。
- 日文版亦由同一字幕重建工具處理。

## 粵文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/lPvPbo2E2Rc4dlR3)，曲目 ID `1d7ad0c1-5a5c-4761-9916-85655f85f15b`，模型 `v6-mini`。原分享頁標題「粵文歌詞 026_喵布布本喵掉的毛_中文」，介面名稱為「喵布布本喵掉的毛(粵文歌詞)」。
- PV 編號 `25`，第二版 ID `suno-1d7ad0c1`。同樣使用幸運八人與喵布布中央站位，完整音訊約 179.53 秒，轉為 192 kbps MP3。
- `lyrics-yue.txt` 保存使用者的 48 行粵文原文，包括「甩嘅毛」、「唔」、「喺」等用字與和聲。`timings-yue.json` 依粵語音訊獨立核對時間軸，不以語音辨識結果改寫歌詞。
- `node tools/build-bubu-fur-subtitles.mjs` 可重建中、英、日、粵四份字幕。
