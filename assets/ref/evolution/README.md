# 鋒兄進化 Show！🔥

歌曲名稱與各語言完整歌詞由使用者提供。兩版播放器與人物 PV 都沿用幸運八人，鋒兄、塗哥預設並列中央；歌詞 PV 使用日出主題色。各版音訊獨立保存為 192 kbps MP3，音訊及 SRT 均隨 repo 部署。

| 版本 | 來源 | Suno 曲目 ID | PV 編號 | 播放器 ID |
| --- | --- | --- | --- | --- |
| 中文 | [Suno](https://suno.com/s/VHXwLvzEvPCsUUxf) | `7de58b39-b7a9-48ad-af82-7080cdb5a113` | 18 | `suno-7de58b39` |
| 英文 | [Suno](https://suno.com/s/JXbqVQsFPpXT4X6U) | `a0ea92df-4947-4e44-b57f-466d70cbcef2` | 19 | `suno-a0ea92df` |
| 粵文 | [Suno](https://suno.com/s/mGY2nJfUqfj3OWN2) | `65f9a881-e968-4c3a-8470-fd48f8575a6e` | 20 | `suno-65f9a881` |
| 日文 | [Suno](https://suno.com/s/H1ApXr8H52IVJVvh) | `a470ebe2-e02e-427a-8526-4c966f140d6c` | 21 | `suno-a470ebe2` |

中文原分享頁標題為「062_鋒兄進化 Show！🔥_中文」，其他三版加上各自語言前綴。介面使用使用者指定名稱。中文音源約 101.01 秒，英文約 131.97 秒，粵文約 117.81 秒，日文約 176.53 秒，全部保留全曲。

`lyrics-zh.txt`、`lyrics-en.txt`、`lyrics-yue.txt`、`lyrics-ja.txt` 保存使用者原文，包括括號和聲、全形空格、日文假名與空格、標點、英文與 emoji。`timings-*.json` 是依各自音訊的 faster-whisper 詞級時間戳核對斷句後的時間軸；`line` 指向原文行號，允許歌曲實際重唱的句子再次引用同一行。中文尾聲重唱的「不——這是鋒兄進化 Show 🔥」依音訊分成四次顯示，粵文尾聲的「Evolution Show！🔥」重唱兩次，不把原文改成辨識結果，也不把一行攤到整段重唱時間。

執行 `node tools/build-evolution-subtitles.mjs` 可重建各版 SRT，檢查每行都有時間、句子無重疊且未超過音源長度。
