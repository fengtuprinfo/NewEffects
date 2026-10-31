# 制服／便服十二人重製

使用者提供的原始合圖保存為 `source.png`。使用內建 imagegen 逐位分離並重製，保留原臉型、髮色、眼睛、服裝、姿勢與隨身物品；移除色條背景、地面倒影、鄰近人物殘片，補齊被遮擋的輪廓。因此這些是依原圖重建的獨立人物，不是只用垂直分割裁出原圖像素。

## 索引與來源

| 索引 | 人物 | 保存的透明原圖 | 使用中的切圖 |
| --- | --- | --- | --- |
| 0 | 前原純華 | transparent-0.png | ../cast/casual-0.png |
| 1 | 葉山陽和 | transparent-1.png | ../cast/casual-1.png |
| 2 | 小鷹咲希 | transparent-2.png | ../cast/casual-2.png |
| 3 | 橘雪乃 | transparent-3.png | ../cast/casual-3.png |
| 4 | 小日向理瀬 | transparent-4.png | ../cast/casual-4.png |
| 5 | ミシェル・イェーガー | transparent-5.png | ../cast/casual-5.png |
| 6 | アシュリー・ヴァンクロフト | transparent-6.png | ../cast/casual-6.png |
| 7 | 桜井羽月 | transparent-7.png | ../cast/casual-7.png |
| 8 | 御社智 | transparent-8.png | ../cast/casual-8.png |
| 9 | 末宗祐里子 | transparent-9.png | ../cast/casual-9.png |
| 10 | 本田千尋 | transparent-10.png | ../cast/casual-10.png |
| 11 | ティーナ・メルキース | transparent-11.png | ../cast/casual-11.png |

人物名稱核對 [Extreme Hearts 官方卡司資料](https://exhearts.com/staffcast/)。尤其 [御社智的官方人物圖](https://exhearts.com/character/tomo.html) 對應紅色高馬尾的索引 8；金髮人物索引 11 是ティーナ・メルキース。原專案錯把索引 11 標成智，本次同步修正播放器 BEST 4U 組與 SUNRISE、HELLO HERO 的相關映射。

## 重建與使用

執行 `node tools/build-casual-remade.mjs`：保留十二張透明原圖的 alpha，裁去外側透明空白並加上 8 像素透明邊距，替換共用 `cast/casual-0.png`～`casual-11.png` 與 `cast.json` 的 casual 群組，再輸出 1920×1080 的 6×2 群像 `group.png`。其他群組不變。完整重建入口 `node tools/cutout.mjs` 會略過 casual 舊色條切割，在最後使用這組重製素材。

所有引用 casual 的歌曲、第二版播放器與人物圖庫直接使用新素材。人物 PV 的 casual 段落改為 6×2 站位，不再把新人物當成原合圖上的裁切座標。原姿勢包含抱臂、合掌、提袋與交叉站姿，因此設定 `armScale: 0.08`、`legScale: 0.15`，以小幅擺動、跳躍與側傾保持身體與衣服連接。

## 內建 imagegen 最終提示模板

每位人物各呼叫一次工具；輸入皆為 source.png，Selected character 代入下一節對應敘述，並設定 transparent_background=true。

```text
Use case: identity-preserve.
Asset type: exactly ONE isolated transparent full-body anime character sprite for a browser dance rig.
Input image: reference sheet contains twelve characters left-to-right, on vertical colored stripes.
Selected character: <insert the indexed character description below>.
Primary request: isolate ONLY this selected character and reconstruct a clean, independent sprite. Keep her exact recognizable face, hairstyle, eye color, expression, original pose, body proportions, costume details and original soft anime cel drawing style. Remove the other eleven people, ALL colored stripe backgrounds, ALL floor reflections and floor shadows, and every tiny neighboring-person fragment. Where her outer silhouette is hidden by a neighboring character, reconstruct ONLY the missing garment/hair/body edge consistently with her own original design. Do not retain neighbor body parts. Preserve her own instrument case or accessories if specified.
Composition: a single complete figure from hair/prop top to both shoe soles or bare feet, with generous transparent padding on all four sides. No clipping, no stretching. Keep the original pose; do not invent a T-pose or new costume.
Alpha requirements: actual transparent background including true gaps between legs, hair, arms and body. All interiors of skin, clothing, white socks and white shoes must be fully opaque; no cloudy transparent holes. Clean antialiased outline with no white or colored halo. Preserve complete hands, all fingers, soles and shoe tips. No scenery, ground, shadows, glow, painted checkerboard, captions, extra characters, duplicated limbs or extraneous objects.
Output: portrait RGBA PNG containing just the one selected full-body character.
```

## 各人物的 Selected character 敘述

### 0 · 前原純華

far-left character, number 1 of 12: short brown bob, blue eyes, dark brown school blazer, blue bow, gray plaid pleated skirt, black knee socks, brown loafers, and black instrument case behind her. One hand on her chest and the other holding the case strap

### 1 · 葉山陽和

second from left, number 2 of 12: brown high side ponytail with small pink hair accessory, purple eyes, pink sweater vest over white school blouse, large pink bow, gray plaid pleated skirt, white knee socks and brown loafers. One hand making a small V sign near her shoulder

### 2 · 小鷹咲希

third from left, number 3 of 12: long brown hair, green eyes, pale cream sailor school blouse with navy collar and dark red ribbon, navy pleated skirt, black knee socks and brown loafers. Both hands clasped down in front

### 3 · 橘雪乃

fourth from left, number 4 of 12: long dark navy hair, blue eyes behind rectangular glasses, navy school blazer, purple ribbon, blue-gray plaid skirt, black tights and black loafers. One hand raised near her glasses; large black sword/instrument case behind her shoulder

### 4 · 小日向理瀬

fifth from left, number 5 of 12: light brown high ponytail with pale yellow tie, blue eyes, orange hoodie under navy jacket, green neck bow, gray school plaid skirt, white knee socks and white/orange athletic shoes. Cheerful open-mouth smile, original hand gesture near chest

### 5 · ミシェル・イェーガー

sixth from left, number 6 of 12: short silver-white hair, reddish eyes, black neck ribbon, white zip-up sporty jacket with black markings, black fitted long trousers with straps, and complete white/black high-top boots. Keep original outstretched open-hand gesture

### 6 · アシュリー・ヴァンクロフト

seventh from left, number 7 of 12: long swept black hair tied in high ponytail, golden eyes, warm confident smile, fitted white sporty zip jacket with black trim and black symbol, navy fitted long pants, dark black/white sneakers. One hand on hip, the other arm raised with hand behind head

### 7 · 桜井羽月

eighth from left, number 8 of 12: straight long dark brown hair and bangs, red eyes, white karate gi, black belt, white cropped karate trousers and both bare feet. Arms crossed in front

### 8 · 御社智

ninth from left, number 9 of 12: reddish-pink high ponytail, golden eyes, black jacket with gold studs, purple crop top, pendant necklaces, black shorts and black long legwear with straps, black lace-up boots. Original playful hand pose near collar

### 9 · 末宗祐里子

tenth from left, number 10 of 12: light ash-brown bob haircut, blue eyes, fluffy pale pink jacket over white ruffled blouse and dark navy dress, black neck bow, white thigh-high socks and black Mary Jane shoes. Original small hand sign near shoulder

### 10 · 本田千尋

eleventh from left, number 11 of 12: short black hair, amber eyes, cheerful open-mouth smile, white hoodie with black Wing-style lettering, black athletic shorts with white trim and complete blue/white high-top athletic shoes. Original raised fist

### 11 · ティーナ・メルキース

far-right character, number 12 of 12: long blonde hair, green eyes, calm gentle expression, cream/gray-green striped loose long-sleeved top, blue denim shorts, and pale pink strappy sandals. Preserve original standing pose and both complete feet
