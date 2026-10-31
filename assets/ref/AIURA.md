# あいうら三人素材

使用者提供的〈カニ☆Do-Luck!〉封面保存為 `aiura-cover.png`。使用內建 imagegen，依原圖中的三人臉型、髮色、制服與畫風重建可獨立舞動的全身透明圖集 `aiura-sprites.png`。被遮住及裁切的身體屬於補畫，不是直接取出原圖像素。

圖集由左至右：天谷奏香、岩沢彩生、上原歩子。角色名稱參照[東京電視台官方角色頁](https://www.tv-tokyo.co.jp/anime/aiura/chara/)。

`node tools/build-aiura.mjs` 保留圖集的 alpha，依角色間的空隙裁成 `cast/aiura-0.png`～`cast/aiura-2.png`，新增 `cast.json` 的 `aiura` 組，再拼成 `aiura-group.png`（1920×1080，奏香居中）。其他組的切圖不變。此組制服袖子較窄，`armScale: 0.12` 會降低手臂轉角以免接縫裂開，保留腿部踏步、跳躍與側擺；未指定此值的其他組維持原擺幅。

## 內建工具的最終提示

```text
Use case: identity-preserve.
Asset type: transparent character sprite atlas for the existing song カニ☆Do-Luck! browser dance stage.
Input image: the attached AIURA cover is the identity, face, hair, uniform and drawing-style reference for exactly THREE characters.
Primary request: Separate and reconstruct the three pictured girls into three independent full-body anime sprites, arranged horizontally in exactly three equal columns. Left column: the cheerful orange-brown-haired girl in the foreground, brown eyes, side ponytail with pale yellow tie, dark brown school blazer, white shirt and large red/pink bow. Middle column: the short blonde/light olive-haired girl at upper left, olive eyes, reserved expression, dark brown school blazer and white shirt with school neckwear matching the reference. Right column: the short straight dark charcoal bob-haired girl at right, blue-gray eyes, gentle smile, pale cream/yellow cardigan over white shirt and red/pink neckwear. Preserve each girl's recognizable face, hair silhouette, color palette and the original soft clean anime cel drawing style.
Composition: exactly one person per column, equal heights, standing upright and facing viewer, natural relaxed standing poses with both arms angled slightly outward/down from the torso and hands clearly separate from the waist so a 2D dance rig can animate them. Each has two arms, two hands, two legs and two shoes. Reconstruct the obscured lower uniforms consistently as dark muted school pleated skirts, dark school socks and brown loafers. Show every complete figure from top of hair to soles, ample transparent margins around all sides, no overlap, nothing crosses a column boundary. Keep reference age-appropriate school outfit and modest framing. These are full-height anime proportions, not chibi.
Background: actual alpha transparency including spaces between arms, hair, body and legs.
Remove all cover text, ribbon banner, logo, crabs, background and all other decorative items.
Constraints: exactly three people, no duplicates, no extra characters, no props, no captions, no shadows, no glow, no scenery, no checkerboard painted as background. Wide landscape PNG atlas, ideally 1536x1024.
```
