#!/usr/bin/env python3
"""從《超かぐや姫！》歌詞影片抽出的畫面切出卡司，並拼成群像主視覺。

來源畫面（assets/ref/kaguya-*.jpg）是從 MP4 取出的定格，背景先用 macOS Vision 的
前景遮罩（tools/matte-vision.py）產生灰階 alpha：

  python3 tools/matte-vision.py assets/ref/kaguya-casual.jpg assets/ref/kaguya-casual-matte.png
  …

這支工具再做三件事：
  1. 同一張畫面有多位角色時，先侵蝕遮罩斷開相觸的手臂，再用連通區塊分配像素。
  2. 逐位裁切、保留遮罩的柔邊，輸出 assets/ref/cast/kaguya-N.png 並併入 cast.json。
  3. 把切圖拼成 1920×1080 的群像主視覺 assets/ref/kaguya-group.png，並印出 ARTS 用的臉部座標。

用法：python3 tools/cutout-kaguya.py
"""
import json
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(ROOT, 'assets', 'ref')
OUT = os.path.join(REF, 'cast')
GROUP = 'kaguya'

# 一張畫面幾位角色（count 由左至右），keep 指定要留哪幾位；erase 是燒進畫面的字幕帶
SCENES = [
    {'src': 'kaguya-casual.jpg', 'count': 1, 'keep': [0]},              # かぐや · 黑色連身裙
    {'src': 'kaguya-beach.jpg', 'count': 2, 'keep': [1],                # 彩葉 · 沙灘
     'erase': [(0, 985, 1000, 1080)]},                                  # 左下角歌詞
    {'src': 'kaguya-fox.jpg', 'count': 2, 'keep': [1],                  # ツキ · 鍵盤
     'erase': [(0, 985, 1920, 1080)]},                                  # 底部歌詞
]


def load_matte(path):
    m = np.asarray(Image.open(path).convert('L'), dtype=np.uint8).copy()
    return m


def split_subjects(matte, count):
    """回傳 count 張同尺寸的 bool 遮罩；侵蝕斷開相連的手臂後再長回原大小。"""
    fg = matte > 40
    if count == 1:
        return [fg]
    # 侵蝕到只剩軀幹，讓相觸的手臂斷開；半徑隨角色數放大
    r = 8 + 4 * count
    er = ndimage.binary_erosion(fg, iterations=r)
    lab, n = ndimage.label(er)
    if n < count:
        er = ndimage.binary_erosion(fg, iterations=max(2, r // 2))
        lab, n = ndimage.label(er)
    sizes = ndimage.sum(er, lab, range(1, n + 1))
    order = [i + 1 for i in np.argsort(sizes)[::-1][:count]]
    # 以最近的區塊為種子，把整張前景長回去（保留角色之間的縫）
    seeds = np.zeros_like(lab)
    for k, v in enumerate(sorted(order, key=lambda v: np.where(lab == v)[1].mean())):
        seeds[lab == v] = k + 1
    dist, (iy, ix) = ndimage.distance_transform_edt(seeds == 0, return_indices=True)
    grown = seeds[iy, ix]
    grown[~fg] = 0
    return [(grown == k + 1) & fg for k in range(count)]


def cut_one(img, matte, mask, pad=8):
    ys, xs = np.where(mask)
    if len(xs) < 3000:
        raise RuntimeError('前景太小，切圖失敗')
    x0, x1 = max(0, xs.min() - pad), min(img.width - 1, xs.max() + pad)
    y0, y1 = max(0, ys.min() - pad), min(img.height - 1, ys.max() + pad)
    sub = img.crop((x0, y0, x1 + 1, y1 + 1)).convert('RGBA')
    alpha = np.asarray(matte.crop((x0, y0, x1 + 1, y1 + 1)), dtype=np.float32) / 255.0
    alpha[~mask[y0:y1 + 1, x0:x1 + 1]] = 0
    # 遮罩邊緣本來就有 1～2 px 的過渡，稍微拉高對比可去掉背景殘色
    alpha = np.clip((alpha - 0.06) / 0.94, 0, 1) ** 0.9
    arr = np.array(sub)
    arr[..., 3] = (alpha * 255).astype(np.uint8)
    out = Image.fromarray(arr, 'RGBA')
    # 頭部座標：取最上方 12% 的像素平均 x，供 PV 的 Ken Burns 對臉
    top = arr[:max(1, int(arr.shape[0] * 0.12))]
    ty, tx = np.where(top[..., 3] > 128)
    head_x = int(tx.mean()) if len(tx) else arr.shape[1] // 2
    head_y = int(arr.shape[0] * 0.09)
    return out, (x0, y0), head_x, head_y


def build_group(sprites, faces, dst):
    """把切圖拼成 1920×1080 群像：夜空祭典漸層＋燈籠光暈，主唱站前排中央。"""
    W, H = 1920, 1080
    bg = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(bg)
    top = np.array([18, 14, 52], dtype=np.float32)
    mid = np.array([104, 38, 108], dtype=np.float32)
    bot = np.array([255, 172, 96], dtype=np.float32)
    for y in range(H):
        u = y / (H - 1)
        c = top + (mid - top) * (u / .62) if u < .62 else mid + (bot - mid) * ((u - .62) / .38)
        d.line([(0, y), (W, y)], fill=tuple(int(v) for v in c))
    # 月亮
    moon = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    md = ImageDraw.Draw(moon)
    md.ellipse([250, 110, 550, 410], fill=(255, 244, 214, 205))
    moon = moon.filter(ImageFilter.GaussianBlur(5))
    bg = Image.alpha_composite(bg.convert('RGBA'), moon).convert('RGB')
    # 燈籠：幾盞暖色光暈
    glow = Image.new('RGB', (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for cx, cy, r, col in [(300, 250, 200, (255, 186, 100)), (760, 170, 150, (255, 140, 120)),
                           (1120, 300, 170, (255, 210, 140)), (1700, 420, 190, (255, 130, 150)),
                           (520, 760, 260, (255, 150, 90))]:
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    bg = Image.blend(bg, glow, .3)

    # 三位角色：主唱站前排中央、左右各一位稍後稍小
    if len(sprites) >= 3:
        order = [1, 2, 0]
        slots = [(430, 1010, 640), (1500, 1010, 620), (960, 1075, 880)]
    else:
        order = list(range(len(sprites)))
        slots = [(430, 1010, 640), (960, 1075, 880), (1500, 1010, 620)]
    canvas = bg.convert('RGBA')
    for k, idx in enumerate(order):
        sp = sprites[idx]
        x, base, hgt = slots[k % len(slots)]
        scale = hgt / sp.height
        w = int(sp.width * scale)
        sp2 = sp.resize((w, int(sp.height * scale)), Image.LANCZOS)
        shadow = Image.new('RGBA', (w, sp2.height), (0, 0, 0, 0))
        shadow.paste((20, 8, 30, 90), (0, 0), sp2.split()[3])
        canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(18)), (x - w // 2 + 14, base - sp2.height + 18))
        canvas.alpha_composite(sp2, (x - w // 2, base - sp2.height))
    # 底部壓暗，讓歌詞／標題有落點
    shade = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for y in range(H - 320, H):
        a = int(150 * ((y - (H - 320)) / 320) ** 1.4)
        sd.line([(0, y), (W, y)], fill=(12, 6, 26, a))
    canvas.alpha_composite(shade)
    # 四角壓暗，讓中間的人物跳出來
    yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    vig = np.clip((r - .55) / .75, 0, 1) ** 1.6 * 150
    arr = np.array(canvas.convert('RGB'), dtype=np.float32)
    arr *= (1 - vig[..., None] / 255)
    Image.fromarray(arr.clip(0, 255).astype(np.uint8)).save(dst, quality=92)
    print(f'  -> {dst} (1920x1080)')
    for k, idx in enumerate(order):
        x, base, hgt = slots[k % len(slots)]
        sp = sprites[idx]
        w = int(sp.width * hgt / sp.height)
        print(f'  faces[{idx}] = [{x - w // 2 + int(sp.width * hgt / sp.height) // 2}, {base - hgt + int(hgt * .12)}]')


def main():
    os.makedirs(OUT, exist_ok=True)
    manifest_path = os.path.join(OUT, 'cast.json')
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
    entries, sprites, faces = [], [], []
    for scene in SCENES:
        img = Image.open(os.path.join(REF, scene['src'])).convert('RGB')
        m = load_matte(os.path.join(REF, scene['src'].replace('.jpg', '-matte.png')))
        if m.shape[1::-1] != img.size:
            raise RuntimeError(f"{scene['src']}: 遮罩尺寸不符")
        for x0, y0, x1, y1 in scene.get('erase', []):
            m[y0:y1, x0:x1] = 0
        matte = Image.fromarray(m)
        masks = split_subjects(m, scene['count'])
        masks.sort(key=lambda mk: np.where(mk)[1].mean())
        for k in scene['keep']:
            cut, src, hx, hy = cut_one(img, matte, masks[k])
            i = len(entries)
            file = f'{GROUP}-{i}.png'
            cut.save(os.path.join(OUT, file))
            entries.append({'file': file, 'w': cut.width, 'h': cut.height,
                            'headX': hx, 'headY': hy, 'source': [int(src[0]), int(src[1])], 'sheet': scene['src']})
            sprites.append(cut)
            faces.append((hx + src[0], hy + src[1]))
            print(f'  {scene["src"]} #{i}: {cut.width}x{cut.height} head({hx},{hy})')
    manifest[GROUP] = entries
    json.dump(manifest, open(manifest_path, 'w'), ensure_ascii=False, indent=1)
    print(f'cast.json 已更新（{GROUP} {len(entries)} 位）')
    build_group(sprites, faces, os.path.join(REF, 'kaguya-group.png'))


if __name__ == '__main__':
    main()
