# 幸運八人：七位人物重製

使用者提供七張原始 T-pose 圖，依既有人物身分替換 lucky 索引 1–7。使用內建 imagegen 逐張去背，保留原臉型、服裝、T-pose、完整鞋面與尾巴。保存工具輸出的 RGBA 原始透明圖，建置時只裁空白及加透明邊距，不再以白色當背景填除。

| lucky 索引 | 人物 | 使用者來源檔 | 透明原圖 | 使用中的切圖 |
| --- | --- | --- | --- | --- |
| 1 | 咕咕嘎嘎 | ChatGPT Image 2026年9月22日 上午12_07_22.png | lucky-1.png | ../cast/lucky-1.png |
| 2 | 鋒兄 | ChatGPT Image 2026年9月22日 上午12_13_00.png | lucky-2.png | ../cast/lucky-2.png |
| 3 | 塗哥 | ChatGPT Image 2026年9月22日 上午12_13_57.png | lucky-3.png | ../cast/lucky-3.png |
| 4 | 喵布布 | ChatGPT Image 2026年9月22日 上午12_14_54.png | lucky-4.png | ../cast/lucky-4.png |
| 5 | 喵白白 | ChatGPT Image 2026年9月22日 上午12_15_54.png | lucky-5.png | ../cast/lucky-5.png |
| 6 | 牙妹 | ChatGPT Image 2026年9月22日 上午12_16_57.png | lucky-6.png | ../cast/lucky-6.png |
| 7 | 魚妹 | ChatGPT Image 2026年9月22日 上午12_18_04.png | lucky-7.png | ../cast/lucky-7.png |

索引 0 的鯨魚娘沿用既有透明素材。原歌曲的八人編制與主唱鋒兄不變；歌詞 PV、人物 PV、第二版播放器及人物圖庫均透過同一份 cast.json 載入替換後素材。

## 重建

`node tools/rebuild-lucky.mjs` 裁切此資料夾的七張圖，更新 `assets/ref/cast/cast.json` 與 `lucky-1.png`～`lucky-7.png`，再重建 `assets/ref/lucky8.png`。舊入口 `node tools/cutout-solo.mjs` 偵測到這組素材後也會走此流程，避免重新把白鞋挖空。建置後會印出群像的臉部座標，對應 pv.js 的 ARTS.lucky8.faces。

## 內建 imagegen 最終提示（七張各使用相同提示）

```text
Use case: background-extraction.
Asset type: one transparent full-body T-pose character sprite for an existing browser dance rig.
Edit target: the single full-body character in the supplied image.
Primary request: Remove ONLY the background, floor and cast shadow to actual alpha transparency. Preserve the exact original character's face, identity, expression, hair or fur, clothing, skin colors, textures, rendering style, proportions, full T pose, position and scale. This is a faithful cutout, NOT a redesign. Keep every part of both outstretched hands or paws, every finger, shoes and their white panels, all hair, ears, and any tail, accessories or backpack straps. Include both complete soles. Keep the original portrait framing with a small clear alpha margin around the complete figure; do not clip fingertips or hair. Make the gaps between the legs, under the arms, and around the tail transparent.
Constraints: exactly the one original character, no new objects or characters, no redraw, no altered anatomy, no altered clothing, no new text, no change of pose. No background color, no scenery, no floor, no cast shadow, no glow, no painted checkerboard. Output a genuinely transparent RGBA PNG.
```
