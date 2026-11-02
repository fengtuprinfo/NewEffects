# 鋒塗力百年夢

- 歌名、[Suno 分享頁](https://suno.com/s/5o2um6OlqInk7VlG)及完整歌詞由使用者提供。曲目 ID `eba8ff1a-26eb-461a-923f-f02c364347be`，原分享頁標題「023_鋒塗力百年夢_中文」。
- PV 編號 `30`（歌曲清單第 31 首），第二版 ID `suno-eba8ff1a`。兩版播放器與人物 PV 使用現有幸運八人，鋒兄、塗哥預設並列中央；歌詞 PV 使用日出配色。
- 公開分享頁播放音源轉為 192 kbps MP3，保留完整歌曲。音訊與同步 SRT 隨 repo 部署。
- `lyrics-zh.txt` 保存使用者的 32 行原文及重複段落，保留「從這里」、「拚」、「作伙」等用字及和聲，不以辨識結果改寫。
- `timings-zh.json` 依此音訊 faster-whisper medium 的詞級時間戳核對斷句，時間軸不套用其他歌曲。`line` 指向原文行號，允許實際演唱時重唱。
- 執行 `node tools/build-fengtuli-subtitles.mjs` 可重建 SRT，並檢查原文行完整、時間無重疊且位於音源範圍內。

## 英文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/SAgRIzUp0di05PHv)，曲目 ID `db86dddf-f0cb-48f3-8fb9-88181e8f805b`，模型 `v6-mini`。PV 編號 `31`，第二版 ID `suno-db86dddf`。
- 介面名稱「鋒塗力百年夢(英文歌詞)」，完整音訊約 146.53 秒，沿用幸運八人與鋒兄、塗哥雙中央站位。音源與時間軸和中文版分開保存。
- `lyrics-en.txt` 保存使用者的 32 行英文原文及重複段落，`timings-en.json` 依英文音源獨立對時。`node tools/build-fengtuli-subtitles.mjs` 可重建中英字幕。

## 日文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/U64YrXmhKzmwp8GP)，曲目 ID `ba267a2c-f825-4b1e-9705-f27d72c802a0`，模型 `v6-mini`。PV 編號 `32`，第二版 ID `suno-ba267a2c`。
- 介面名稱「鋒塗力百年夢(日文歌詞)」，完整音源約 142.41 秒，與其他語言版獨立保存。`lyrics-ja.txt` 保留使用者的 32 行假名歌詞、全形空格及和聲。
- `timings-ja.json` 依日文音源的 faster-whisper 詞級時間戳獨立核對，不套用其他語言版的時間軸；人物沿用同一八人卡司與鋒兄、塗哥中央站位。

## 粵文版

- [使用者提供的 Suno 分享頁](https://suno.com/s/gAmqCBsWTMlx75QH)，曲目 ID `2a090234-b9ba-44ae-8f0b-286df109f867`，模型 `v6-mini`。PV 編號 `33`，第二版 ID `suno-2a090234`。
- 介面名稱「鋒塗力百年夢(粵文歌詞)」，完整音源約 126.41 秒。`lyrics-yue.txt` 保留使用者的 32 行原文及粵文用字，`timings-yue.json` 依粵語音源獨立對時。
- `node tools/build-fengtuli-subtitles.mjs` 可重建中、英、日、粵四份字幕。
