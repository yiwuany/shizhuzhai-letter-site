import argparse
import base64
import json
import re
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


BOX_SIZE = 300
PADDING = 8


SAMPLE_TEXTS = [
    "张三之印",
    "清风明月",
    "国华宁乐",
    "无为而治",
    "龍馬精神",
    "雅楚之印",
    "李白印",
    "王羲之印",
    "十竹齋",
    "山中寄友",
]


def text_elements(text):
    # Python iterates Unicode code points, which is enough for the CJK seal corpus.
    return [char for char in str(text or "") if re.match(r"[\w]", char, re.UNICODE)]


def unique_push(items, value):
    if value and value not in items:
      items.append(value)


def parse_app_data(app_text):
    alias_match = re.search(r"const SEAL_CHAR_ALIASES = \{(?P<body>.*?)\n\s*\};", app_text, re.S)
    if not alias_match:
        raise RuntimeError("Unable to locate SEAL_CHAR_ALIASES in app.js.")

    aliases = {}
    for match in re.finditer(r'(?m)^\s*(?P<key>[^:\s,{}]+):\s*"(?P<value>[^"]*)"\s*,?', alias_match.group("body")):
        aliases[match.group("key")] = match.group("value")

    suffixes = []
    suffix_match = re.search(r"const SEAL_INSCRIPTION_SUFFIXES = \[(?P<body>.*?)\];", app_text, re.S)
    if suffix_match:
        suffixes = [match.group("value") for match in re.finditer(r'"(?P<value>[^"]*)"', suffix_match.group("body"))]

    return aliases, suffixes


def build_seed_chars(aliases, suffixes, sample_only, extra_seed):
    texts = list(SAMPLE_TEXTS) + list(suffixes)
    if not sample_only:
        texts.extend(aliases.keys())
        texts.extend(aliases.values())
    texts.extend(extra_seed or [])

    chars = []
    for text in texts:
        for char in text_elements(text):
            unique_push(chars, char)
    return chars


def cmap_for_font(font):
    cmap = {}
    for table in font["cmap"].tables:
        cmap.update(table.cmap)
    return cmap


def glyph_path(font, cmap, char):
    codepoint = ord(char)
    glyph_name = cmap.get(codepoint)
    if not glyph_name:
        return None

    glyph_set = font.getGlyphSet()
    glyph = glyph_set[glyph_name]
    bounds_pen = BoundsPen(glyph_set)
    glyph.draw(bounds_pen)
    if not bounds_pen.bounds:
        return None

    x_min, y_min, x_max, y_max = bounds_pen.bounds
    width = x_max - x_min
    height = y_max - y_min
    if width <= 0 or height <= 0:
        return None

    scale = min((BOX_SIZE - PADDING * 2) / width, (BOX_SIZE - PADDING * 2) / height)
    offset_x = (BOX_SIZE - width * scale) / 2 - x_min * scale
    offset_y = (BOX_SIZE - height * scale) / 2 + y_max * scale

    svg_pen = SVGPathPen(glyph_set)
    transform_pen = TransformPen(svg_pen, (scale, 0, 0, -scale, offset_x, offset_y))
    glyph.draw(transform_pen)
    d = svg_pen.getCommands()
    if not d:
        return None

    return {
        "viewBox": f"0 0 {BOX_SIZE} {BOX_SIZE}",
        "content": f'<path d="{d}" fill="currentColor" stroke="currentColor" stroke-width="8" stroke-linejoin="round" paint-order="stroke fill"></path>',
        "canonical": char,
        "source": "font-cache",
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-root", default=str(Path(__file__).resolve().parents[1]))
    parser.add_argument("--sample-only", action="store_true")
    parser.add_argument("--seed-text", action="append", default=[])
    args = parser.parse_args()

    site_root = Path(args.site_root).resolve()
    app_path = site_root / "app.js"
    font_path = site_root / "assets" / "fonts" / "ebas927.ttf"
    manifest_path = site_root / "assets" / "seal-glyphs" / "generated-manifest.js"
    font_data_path = site_root / "assets" / "fonts" / "seal-font-data.js"

    app_text = app_path.read_text(encoding="utf-8")
    aliases, suffixes = parse_app_data(app_text)
    seed_chars = build_seed_chars(aliases, suffixes, args.sample_only, args.seed_text)

    font = TTFont(font_path)
    cmap = cmap_for_font(font)

    candidate_by_char = {}
    all_candidates = []
    for char in seed_chars:
        candidates = []
        unique_push(candidates, char)
        unique_push(candidates, aliases.get(char))
        candidate_by_char[char] = candidates
        for candidate in candidates:
            unique_push(all_candidates, candidate)

    manifest_aliases = {}
    missing = []
    for char, candidates in candidate_by_char.items():
        resolved = next((candidate for candidate in candidates if ord(candidate) in cmap), "")
        if resolved:
            if resolved != char:
                manifest_aliases[char] = resolved
        else:
            missing.append(char)

    manifest = {
        "generatedAt": "build-time",
        "source": "CNS11643 Shuowen Jiezi embedded font",
        "glyphs": {},
        "aliases": manifest_aliases,
        "cacheMissing": sorted(missing),
        "downloadFailed": [],
    }

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        "window.SHIZHUZHAI_SEAL_GLYPHS = "
        + json.dumps(manifest, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )

    font_data_path.parent.mkdir(parents=True, exist_ok=True)
    font_base64 = base64.b64encode(font_path.read_bytes()).decode("ascii")
    font_data_path.write_text(
        "window.SHIZHUZHAI_SEAL_FONT_BASE64="
        + json.dumps(font_base64, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )

    print(
        f"Seal font glyph cache: {len(seed_chars)} seed chars, "
        f"embedded font {font_path.stat().st_size} bytes, {len(manifest_aliases)} aliases, {len(missing)} misses."
    )
    if missing:
        print("Cache misses: " + "".join(sorted(missing)))


if __name__ == "__main__":
    main()
