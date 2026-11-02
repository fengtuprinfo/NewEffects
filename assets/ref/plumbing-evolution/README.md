# 水電進化 Show

- 歌名、[Suno 分享頁](https://suno.com/s/WigduHsMpK8SyhWI)與完整歌詞由使用者提供，曲目 ID `f6f5d51c-66b8-41ac-998f-51058b4a4a6c`。原分享頁標題「024_水電進化 Show_中文」。
- PV 編號 `26`（歌曲清單第 27 首），第二版播放器 ID `suno-f6f5d51c`。兩版播放器、人物 PV 沿用現有幸運八人，預設鋒兄、塗哥並列中央，歌詞 PV 使用日出配色。
- 公開分享頁播放來源轉為 192 kbps MP3，約 163.61 秒，保留全曲；音訊及同步 SRT 隨 repo 部署。
- `lyrics-zh.txt` 保存使用者的 27 行原文，僅整理多餘空白行，保留文字、空格、括號及和聲；「水電」、「樂團」、「團長」等用字不替換成其他進化 Show 版本的歌詞。
- `timings-zh.json` 依此曲 faster-whisper medium 的詞級時間戳核對斷句；不套用〈鋒兄進化 Show！🔥〉的時間軸。`line` 指向原文行號，供實際重唱時再次引用同一行。
- 中文最後副歌的第一句實際唱兩遍，字幕分別引用原文第 23 行，不修改原始歌詞。
- 執行 `node tools/build-plumbing-subtitles.mjs` 可重建 SRT，並檢查所有原文行都有時間、未重疊且在音訊長度內。

## 英文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/oCXxUVk5b5qg5lpW)，曲目 ID `3ff3b89a-e378-4ba9-9669-b6d846be8e5d`，模型 `v6-mini`。PV 編號 `27`，第二版 ID `suno-3ff3b89a`。
- 介面名稱「水電進化 Show(英文歌詞)」，使用自己的完整 MP3 與同步 SRT；沿用同一八人卡司。`lyrics-en.txt` 保存 28 行原文（含使用者獨立標示的 Final Chorus），`timings-en.json` 依英文音源獨立對時。
- `node tools/build-plumbing-subtitles.mjs` 可重建中英字幕。
- 英文片頭實際重唱前兩句，依音訊順序以第 1、2、1、2 行顯示，片頭另切段複核；原文不加字、不刪句。

## 日文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/4c76h11DcL4ZxL7k)，曲目 ID `8fd67acc-baec-4a3b-9e65-c7df55ea3922`，模型 `v6-mini`。PV 編號 `28`，第二版 ID `suno-8fd67acc`。
- 介面名稱「水電進化 Show(日文歌詞)」，完整音訊約 165.97 秒。`lyrics-ja.txt` 保存 28 行日文原文，保留假名、空格與獨立的「ラストサビ」標記，時間軸另存 `timings-ja.json`，由日文音源獨立對齊。
- 日文版亦由同一字幕重建工具處理。

## 粵文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/ASdd0bCWhgisDEIk)，曲目 ID `8d63d0a5-3903-4fad-8661-0d645c522129`，模型 `v6-mini`。PV 編號 `29`，第二版 ID `suno-8d63d0a5`。
- 介面名稱「水電進化 Show(粵文歌詞)」，完整音訊約 169.49 秒。`lyrics-yue.txt` 保存 28 行粵文原文，保留全形空格、High／Fans、粵文用字、和聲與「最後副歌」標記。
- `timings-yue.json` 依粵語音源獨立對齊，不套用其他語言時間軸。`node tools/build-plumbing-subtitles.mjs` 可重建中、英、日、粵四份字幕。
