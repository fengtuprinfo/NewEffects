# 塗哥水電王子爆紅

- [使用者提供的 Suno 分享頁](https://suno.com/s/uZxdMktxJvB7S99t)，曲目 ID `0b6562bf-af84-4e0b-b023-42ea731d0ce8`，原分享頁標題「028_塗哥水電王子爆紅_中文」。
- PV 編號 `38`（清單第 39 首），第二版 ID `suno-0b6562bf`。兩版播放器與人物 PV 沿用幸運八人，塗哥為歌曲預設主唱，鋒兄、塗哥並列中央。
- 完整音源約 225.97 秒，轉為 192 kbps MP3，音訊及同步 SRT 隨 repo 部署。
- `lyrics-original.txt` 保存使用者的完整故事；`lyrics-zh.txt` 拆成 83 個短句，保留「塗三傑」、「塗偉傑」、「青木瓜四木飲」等原文與標點，不以辨識結果改寫。
- `timings-zh.json` 以音訊詞級時間戳比對原文，人物與品牌名稱、片頭日期及結尾金額依演唱段落核對邊界。`node tools/build-prince-subtitles.mjs` 可重建 SRT，並驗證分段全文與原文相同、所有句子都有時間且沒有重疊。

## 英文版與日文版

| 版本 | 使用者提供的來源 | Suno 曲目 ID | PV 編號 | 第二版 ID | 時長（秒） |
| --- | --- | --- | --- | --- | --- |
| 英文 | [分享頁](https://suno.com/s/tG9spJ1bvDawuZNy) | `e9b18cf3-36ee-4a8c-a488-b192fb400a14` | 39 | `suno-e9b18cf3` | 278.69 |
| 日文 | [分享頁](https://suno.com/s/nmOz7hu6hFsVj238) | `d1fe6b53-23d6-4543-a113-9f42a3a1ac0f` | 40 | `suno-d1fe6b53` | 311.57 |

英文全文保存於 `lyrics-en.txt`（97 行），日文全文保存於 `lyrics-ja.txt`（110 行）。保留使用者提供的日期、姓名、作品名稱、金額、假名及標點，不以語音辨識結果改寫。各版音源分別轉為完整 192 kbps MP3，字幕以各自的演唱時間獨立對齊，儲存於 `timings-en.json` 與 `timings-ja.json`；辨識只用於尋找時間，數字及日文讀音的正規化不影響原文。

三版均沿用幸運八人、塗哥預設主唱及鋒兄／塗哥雙中央站位，同曲依中文、英文、日文排列，原歌曲編號不變。執行 `node tools/build-prince-subtitles.mjs` 可重建三版字幕，亦可加上 `zh`、`en`、`ja` 選擇重建語言；會檢查完整來源覆蓋、字幕時間順序、重疊及音訊長度。
