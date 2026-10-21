#!/usr/bin/env python3
"""把已知歌詞對到 faster-whisper 的詞級時間戳，產生逐句時間軸。

ASR 對唱歌的辨識本來就不準（音譯、漏字很常見），所以不是直接採用它的斷句，
而是把「歌詞的每個字」與「ASR 的每個字」做一次 Levenshtein 對齊：
對上的字沿用 ASR 的時間，整句的起訖時間就取這句第一個／最後一個對上的字。
"""
import json
import re
import sys
import unicodedata

KANA = re.compile(r'[ぁ-ゖァ-ヺー]')


def norm_char(c):
    c = unicodedata.normalize('NFKC', c)
    if 'ァ' <= c <= 'ヺ':          # 片假名 → 平假名
        c = chr(ord(c) - 0x60)
    return c


def norm(text):
    out = []
    for c in text:
        c = norm_char(c)
        if re.match(r'[\s、。,.!?！？☆★…「」『』()（）\-—~〜♪]', c):
            continue
        out.append(c)
    return out


def main():
    lyrics_path, asr_path, out_path = sys.argv[1:4]
    lines = [l.rstrip('\n') for l in open(lyrics_path) if l.strip()]
    asr = json.load(open(asr_path))

    # ASR 逐字時間
    a_chars, a_times = [], []
    for seg in asr:
        for w in seg.get('words') or []:
            cs = norm(w['w'])
            if not cs:
                continue
            span = max(1e-3, w['e'] - w['s'])
            for i, c in enumerate(cs):
                a_chars.append(c)
                a_times.append(w['s'] + span * (i + 0.5) / len(cs))
    # 歌詞逐字（記錄每個字屬於哪一行）
    l_chars, l_line = [], []
    for li, line in enumerate(lines):
        for c in norm(line):
            l_chars.append(c)
            l_line.append(li)

    n, m = len(a_chars), len(l_chars)
    print(f'ASR {n} 字 / 歌詞 {m} 字', file=sys.stderr)
    INF = 1 << 30
    # dp[i][j]：前 i 個 ASR 字對前 j 個歌詞字的最小成本
    prev = list(range(m + 1))
    back = []
    for i in range(1, n + 1):
        cur = [INF] * (m + 1)
        cur[0] = i
        row = bytearray(m + 1)
        ac = a_chars[i - 1]
        for j in range(1, m + 1):
            cost = 0 if ac == l_chars[j - 1] else 1
            d = prev[j - 1] + cost          # 對上
            u = prev[j] + 1                 # 略過 ASR 字
            l = cur[j - 1] + 1              # 略過歌詞字
            best, mv = d, 0
            if u < best: best, mv = u, 1
            if l < best: best, mv = l, 2
            cur[j] = best
            row[j] = mv
        back.append(row)
        prev = cur

    # 回溯
    times = [None] * m
    i, j = n, m
    while i > 0 and j > 0:
        mv = back[i - 1][j]
        if mv == 0:
            times[j - 1] = a_times[i - 1]
            i -= 1; j -= 1
        elif mv == 1:
            i -= 1
        else:
            j -= 1

    # 每行的起訖
    per = []
    for li in range(len(lines)):
        ts = [times[k] for k in range(m) if l_line[k] == li and times[k] is not None]
        per.append((min(ts), max(ts), len(ts)) if ts else None)
    # 補漏：沒對上的行用前後行內插
    for li in range(len(lines)):
        if per[li] is None:
            a = next((per[k][1] for k in range(li - 1, -1, -1) if per[k]), 0.0)
            b = next((per[k][0] for k in range(li + 1, len(per)) if per[k]), a + 3.0)
            per[li] = (a, max(a + 1.2, b), 0)
    json.dump([{'i': i, 'jp': lines[i], 'start': per[i][0], 'end': per[i][1], 'hits': per[i][2]}
               for i in range(len(lines))], open(out_path, 'w'), ensure_ascii=False, indent=1)
    for i, p in enumerate(per):
        print(f'{i + 1:3d} {p[0]:7.2f} {p[1]:7.2f} hits={p[2]:3d}  {lines[i]}')


if __name__ == '__main__':
    main()
