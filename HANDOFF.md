# Handoff: Shizhuzhai Letter Site

Last updated: 2026-05-18

## Latest Checkpoint For Next Chat

V2 final is committed as `4c8f3c1` and tagged `v2.2.0`.

The latest dirty-tree implementation is the first V3 checkpoint: image preview/export plus a generated Zhu/Bai carved-seal renderer with real seal-glyph lookup. Start the next conversation by reading this section and then continue from the current uncommitted files.

Current dirty files:

- `CHANGELOG.md`
- `HANDOFF.md`
- `app.js`
- `index.html`
- `styles.css`
- `assets/seal-glyphs/雅.svg`
- `assets/seal-glyphs/楚.svg`
- `assets/fonts/ebas927.ttf`
- `assets/fonts/README.md`
- `assets/vendor/opentype.min.js`
- `assets/vendor/README.md`

Current local state:

- Main dev server is running at `http://127.0.0.1:43194/index.html`.
- Clean-origin verification server is also running at `http://127.0.0.1:43195/index.html`.
- Temporary seeded-test server on port `43196` is stopped.
- No `.tmp-seed-server.py` file should remain.
- `node --check app.js` passes.
- `git diff --check` only reports existing CRLF warnings.

Most recent behavior verified:

- V3 adds `成圖預覽` and `導出圖片` buttons in both the preview header and editor action row.
- Image preview uses a Canvas renderer and opens a modal with a blob PNG plus a download link.
- Preview generation was verified in browser: modal opened, preview image was a blob, and generated PNGs measured `4518 × 1562` for long vertical test content, `1022 × 1610` for short content after the first seal update, and `992 × 1562` after the real glyph-composite update.
- Direct export uses the same Canvas renderer and then programmatically clicks a download link. Codex in-app browser does not support download events, so the final native download prompt could not be verified there.
- Seal rendering is now an SVG-generated seal face, not normal text in a box.
- Seal text is now treated as inscription text before rendering: punctuation/spacing is removed and common simplified characters are normalized. The `印文格式` selector controls whether the user gets literal text, `印`, `之印`, or the earlier smart suffix behavior.
- Seal glyphs now try to load real per-character `*-seal.svg` art from Wikimedia Commons at runtime through the Commons API, with an 8-second timeout. This means supported characters render as actual 篆刻-style vector glyphs, not CSS text.
- Glyph source priority is now `assets/fonts/ebas927.ttf` first, then curated local SVG fallback, then manual composites, then remote Commons lookup. `assets/vendor/opentype.min.js` converts font outlines into normalized, bolder `300 × 300` SVG paths at runtime, and sanitized SVG glyphs are measured with `getBBox()` before being normalized into the same `300 × 300` glyph box.
- Browser verification after this normalization change showed `楚` in literal, `印`, `之印`, and smart formats using only `viewBox 0 0 300 300` glyphs, with no `<text>` fallback and no missing glyphs.
- Latest seal rewrite changes priority to font first, local SVG fallback second, composite third, remote fourth. Current local overrides for `楚` and `雅` are preserved on disk but no longer win over the font unless a source is explicitly marked `preferLocal`.
- Seal layout now uses rectangular optical fill cells instead of square `size` slots. Glyphs render with `preserveAspectRatio="none"` so each cell is evenly filled, and Canvas export uses the same `glyphWidth` / `glyphHeight` values.
- Rendered seals expose `data-seal-sources` such as `李:font, 白:font, 之:font, 印:font`; the editor shows `未找到小篆：...` when all glyph sources fail.
- Local full-character glyph assets are checked only after the font unless a future source is marked `preferLocal`. Current local fallback assets: `雅` and `楚` in `assets/seal-glyphs/`.
- Missing whole-character glyphs can be composed from real seal components for specific cases. Current manual composites: `雅 = 牙 + 隹`, `雷 = 雨 + 田`.
- Earlier local-override verification showed `雅` loading from SVG; this is now superseded by the font-first source priority for visual consistency.
- Browser verification after the seal-rules rewrite showed default `李白` staying literal, `加之印` rendering as `李白之印`, square `viewBox 0 0 108 108`, 4 glyph SVGs, 0 `<text>` fallbacks, and 0 missing-glyph marks in both Zhu and Bai styles. Generated PNG preview also loaded as a blob image (`992 × 1562` in the final check).
- Browser verification after the optical-fill rewrite showed `楚`, `雅`, `楚印`, `雅之印`, and `李白之印` all resolving to `font` sources with `viewBox 0 0 300 300`, no `<text>` fallback, and no missing glyphs. A missing-character check with `𠮷` produced `𠮷:missing` and the visible warning `未找到小篆：𠮷`.
- HTTP verification passed for both local glyph files: `/assets/seal-glyphs/雅.svg` and `/assets/seal-glyphs/楚.svg` return `200`.
- Seal layout now follows traditional reading order: characters go top-to-bottom within a column, and columns go right-to-left. Four-character verification with `山雷雅書` produced positions right-top, right-bottom, left-top, left-bottom.
- Seal frame shape now varies by character count: 1字 tall, 2字 vertical, 3字 high-square, 4字 square, 5-6字 tall-grid, 7-9字 large-grid.
- Visible regular-font fallback has been removed from both DOM SVG and Canvas export. Missing glyphs render as subtle carved missing-glyph marks, not Kai/Song text.
- Editor now has an `印章樣式` / `印章样式` selector with `朱文` and `白文`.
- Zhu style was verified as a tall single-character SVG seal (`viewBox 0 0 82 132`, red broken border and red stroke glyph).
- Bai style was verified as a square SVG seal (`viewBox 0 0 96 96`, red field, pale carved glyph, wear marks).
- Important limitation: the built-in Shuowen Jiezi font covers 6721 glyphs, which is much broader and consistent, but not every possible Unicode character. Unsupported characters still need SVG overrides or component composites.
- Canvas export now draws the stationery image tiling, paper wash, grid, text, and carved seal.
- `requestAnimationFrame` in export preview has a timeout fallback because background browser tabs can throttle rAF.
- `node --check app.js` passes.
- Browser health check found no console errors after the V3 changes.

Recommended next step:

- Do a human visual pass at `http://127.0.0.1:43194/index.html`, especially the generated PNG preview and the carved seal shape. If acceptable, commit this V3 checkpoint.

## Uncommitted In-Progress Update: Grid, Flow, Paper Axis

The working tree is intentionally dirty with edits in:

- `app.js`
- `styles.css`
- `index.html`

Continue from the dirty tree, not from `v2.1.0`.

### User Feedback Being Addressed

After `v2.1.0`, the user reported:

1. The guide/grid should cover the letter paper, not only a small middle writing area.
2. Grid lines must be evenly distributed; no last narrow/wide cell.
3. Text must sit centered between two grid lines, and changing font size must keep text parallel/aligned to the grid.
4. Horizontal long text should extend at the end downward, not push the whole text frame down.
5. Vertical long text should extend leftward, not downward.
6. Immersive editing is not centered, and vertical long text in immersive mode appears to overlap/float over the first page.
7. Vertical long text was visually pulling to the right and overlapping the tool/editor column.
8. Horizontal mode looked too tall and narrow.

### Changes Already Made In Dirty Tree

- `styles.css`
  - Added `--writing-top/right/bottom/left` writing-area variables.
  - Changed `.letter-zone` to use shared inset variables for both vertical and horizontal writing.
  - Added `.paper-positioner` wrapper styles. It now represents the full paper strip width.
  - `.paper-stage` is now the bounded scroll viewport (`overflow: auto`) so long vertical paper cannot overlap library/editor panels.
  - Changed `.paper-frame` width to `100%`; `.paper-positioner` now owns the actual paper-strip width.
  - Changed paper background from `repeat-y`/`100%` to `repeat`/`--paper-page-width` with `background-position: top right`, so extra vertical pages can tile left from the original right edge.
  - Background tiling now also uses `--paper-page-height`.
  - Removed `.paper-editor` padding and made editor/contenteditable inherit `line-height`.
  - Changed title/body/signature spacing to whole-grid units via `--grid-col` and `--grid-row`.
  - In immersive mode, `.preview-shell` now uses grid centering and `.paper-positioner` gets the viewport-height-based paper width.
  - Horizontal mode uses a wider display ratio (`0.78` minimum) so it reads less like a narrow vertical strip.

- `app.js`
  - Added `paper-positioner` wrapper in `renderPreviewShell()` and cached it as `els.paperPositioner`.
  - Cached `.paper-stage` as `els.paperStage`.
  - Added `fitTimer` fallback in `requestFitPaper()` because background/inactive browser tabs can throttle `requestAnimationFrame`.
  - `updatePaper()` now calls `fitPaperToContent()` synchronously once, then schedules a follow-up fit.
  - `fitPaperToContent()` now branches long-text growth by writing mode:
    - Horizontal overflow increases paper height only.
    - Vertical overflow increases paper width only.
  - Added `applyPaperGeometry()` to write fixed pixel insets based on the original page size.
  - Added `updateStageScroll()`:
    - For vertical overflow, scrolls `.paper-stage` to the far right so the first/original page stays visible and extra pages extend left.
    - For normal/short content, resets horizontal scroll to zero.
  - Added `paperDisplayRatio()`:
    - Vertical uses the source paper ratio.
    - Horizontal uses `max(sourceRatio, 0.78)` for a wider display.
  - Added `updateGridDistribution()`:
    - Calculates integer grid column/row counts from actual `.letter-zone` size.
    - Sets `--grid-col` and `--grid-row` so cells divide the zone exactly.
    - Sets `--letter-line-height` to match the actual grid advance (`--grid-col` for vertical, `--grid-row` for horizontal).
  - Earlier version used negative `margin-left` to keep the vertical right edge fixed. That approach was removed. The current approach uses `.paper-stage` as a scroll viewport plus a full-width `.paper-positioner` paper strip.

- `index.html`
  - CSS/JS cache busting query strings currently use `20260517-paper-axis`.

### Verification Already Done During Dirty Work

Before the latest `.paper-positioner` restructure, these checks passed:

- `node --check app.js`
- Even grid distribution: measured `columns * --grid-col === letter-zone width` and `rows * --grid-row === letter-zone height`.
- Text/grid sync:
  - Vertical font size 20: `line-height` matched grid column width.
  - Vertical font size 28: `line-height` matched grid column width.
  - Horizontal font size 28: `line-height` matched grid row height.
- Long text flow before latest restructure:
  - Horizontal long text: width unchanged, height increased, top inset unchanged.
  - Vertical long text: height unchanged, right edge unchanged, width increased leftward.

After the latest paper-axis restructure:

- `node --check app.js` passed.
- `git diff --check` had only CRLF warnings.
- Browser verification with seeded localStorage test pages passed:
  - Vertical long workbench: `.paper-stage` stayed inside preview column; no overlap with editor panel.
  - Vertical long workbench: `.paper-stage.scrollLeft` was at the right edge, showing the original/home page first.
  - Vertical long immersive: paper height stayed centered; frame width exceeded viewport and stage scrolled to the right edge.
  - Short vertical immersive: centered within the viewport, with only a small scrollbar-related horizontal delta.
  - Horizontal mode display ratio measured `0.78`; vertical measured `0.635`.

### Temporary Test Artifacts

- A temporary `.tmp-seed-server.py` file was created for seeded localStorage tests, then deleted.
- Temporary server on port `43196` was stopped.
- Existing dev server on `43194` may still be running from earlier work.

### Immediate Next Steps

1. Start or reuse a local server:

```powershell
cd E:\Users\y\Desktop\s3\letter-site
python -m http.server 43194 --bind 127.0.0.1
```

2. Do a final visual pass in browser:

- Short vertical immersive:
  - Enter immersive mode.
  - Confirm the visible one-page paper is centered horizontally and vertically in the viewport.
- Short horizontal immersive:
  - Same centering check.
- Long vertical immersive:
  - Seed or type enough text to exceed one page.
  - Expected: original first page/right edge remains the anchor; extra pages extend left.
  - Expected: no visual overlap where a wider paper floats over the original page; background/page tiling should read as continuous pages extending left.
- Long horizontal immersive:
  - Expected: paper extends downward from the top; the text frame does not shift down.

3. If vertical immersive still visually overlaps:

- Inspect `.paper-stage`, `.paper-positioner`, and `.paper-frame` rects.
- The intended geometry is:
  - `.paper-stage` is the scroll viewport and must stay inside the preview/viewport bounds.
  - `.paper-positioner` width equals the full paper strip width.
  - `.paper-frame` width equals `.paper-positioner` width.
  - For vertical overflow, `.paper-stage.scrollLeft` should be at its max so the original/rightmost page is visible.
  - No negative margin should be used.

4. Clean up and then update `CHANGELOG.md` or commit only after browser verification passes.

## Current State

- Project root: `E:\Users\y\Desktop\s3\letter-site`
- Main entry: `index.html`
- Legacy entry: `layout-a-workbench.html`, redirects to `index.html`
- Original source images: `E:\Users\y\Desktop\s3\shizhuzhai-png`
- Current git branch: `master`
- Current version tag: `v2.1.0`
- Clean baseline commits:
  - `v1.0.0`: first static prototype
  - `v2.0.0`: immersive on-paper editing
  - `v2.1.0`: traditional vertical grid and immersive single-screen fit

## What Exists

- `index.html`: active app shell.
- `app.js`: all app state, UI rendering, autosave, writing mode switching, paper fit logic.
- `styles.css`: workbench layout, paper rendering, guide lines, immersive mode.
- `assets-manifest.js`: generated list of 79 papers across 18 categories.
- `assets/thumbs`: generated thumbnails.
- `assets/previews`: generated preview images.
- `tools/build-assets.ps1`: regenerates thumbnails, previews, and manifest from `..\shizhuzhai-png`.
- `CHANGELOG.md`: version history.

## Product Decisions So Far

- Only the workbench layout remains.
- The app is static and offline-first: no npm, no CDN, no React, no backend.
- Users choose paper and parameters in workbench mode, then enter immersive editing.
- Immersive mode hides toolbars and side panels.
- Text can be edited directly on the paper via `contenteditable`.
- Side fields and on-paper editing stay synchronized through local state.
- Autosave uses `localStorage` key `shizhuzhai-letter-v2`.
- UI supports Traditional/Simplified labels, but does not convert user-entered text.

## Current Writing Behavior

- Vertical mode:
  - Uses `writing-mode: vertical-rl`.
  - Guide style is intended to resemble traditional letter paper: one outer writing-area frame plus vertical column separators.
  - Long text expands the paper downward; there is no internal scrollbar inside the writing area.
- Horizontal mode:
  - Uses `writing-mode: horizontal-tb`.
  - Guide style intentionally stays closer to `x.html`: soft horizontal ruled lines.
  - Long text also expands the paper downward.
- Immersive mode:
  - Normal short vertical and horizontal letters should fit in one viewport.
  - Long text is allowed to make the page scroll.
  - Background was warmed to be closer to `x.html`; paper has a floating shadow.

## Recent User Feedback Already Addressed

The user said:

1. The previous grid was wrong. It should reference traditional Chinese letter paper: an outer frame with vertical separators between columns. Horizontal mode can follow `x.html`.
2. Immersive mode was too large and required scrolling. Short letters should fit one screen; only long text should scroll. Surrounding color should be more coordinated, like `x.html`, and the paper should feel floating.

Implemented in `v2.1.0`:

- Vertical guide changed from practice-grid-like lines to outer frame plus vertical column separators.
- Horizontal guide changed back toward soft horizontal lines.
- Immersive paper width now depends on viewport height, so short letters fit a normal desktop viewport.
- Immersive background and shadow were softened.

## Verification Already Run

Used local Python HTTP server and Playwright CLI with Edge.

Checks passed:

- `node --check app.js`
- `node --check assets-manifest.js`
- `index.html` loads.
- 79 paper cards render.
- Vertical mode uses `vertical-rl`.
- Horizontal mode uses `horizontal-tb`.
- Vertical guide has border plus vertical separators.
- Horizontal guide has ruled-line background.
- Immersive mode hides topbar/library/editor.
- Short vertical/horizontal immersive pages fit in `1366x900`.
- Long vertical/horizontal text expands the paper and avoids internal scrollbars.
- No document horizontal overflow.
- Git working tree was clean after `v2.1.0`.

## Useful Commands

Start a temporary local server:

```powershell
cd E:\Users\y\Desktop\s3\letter-site
python -m http.server 43194 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:43194/index.html
```

Regenerate image assets after changing `..\shizhuzhai-png`:

```powershell
cd E:\Users\y\Desktop\s3\letter-site
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\tools\build-assets.ps1
```

Check versions:

```powershell
git log --oneline --decorate -5
git tag --list --sort=creatordate
git status --short
```

## Likely Next Work

- Visually inspect the vertical grid in the browser against actual traditional letter-paper references; adjust column width, line color, and frame opacity.
- Fine-tune the writing-area position per paper category or per individual paper. Current V2.1 still uses one shared safe area.
- Consider adding manual writing-area controls later: right/top/width/height sliders or presets.
- Consider a preview-only/export path later, but the user explicitly postponed export in V1.
- If the user asks for more historical accuracy, search for references such as `八行箋`, `紅格信箋`, `竪格信箋`, and compare against existing CSS in `.paper-grid`.

## Notes for Next Conversation

- Preserve git history. Make a commit for each meaningful version or checkpoint.
- Do not modify original `..\shizhuzhai-png` images.
- Prefer editing `app.js` and `styles.css`; generated image assets should only change when source image assets change.
- If reading Chinese docs through PowerShell shows mojibake, use UTF-8-aware viewing or inspect files in an editor.
