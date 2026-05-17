# Handoff: Shizhuzhai Letter Site

Last updated: 2026-05-17

## Latest Checkpoint For Next Chat

The latest dirty-tree implementation is the `centered-spread` update on top of `paper-axis`. Start the next conversation by reading this section and then continue from the current uncommitted files.

Current dirty files:

- `HANDOFF.md`
- `app.js`
- `index.html`
- `styles.css`

Current local state:

- Main dev server is running at `http://127.0.0.1:43194/index.html`.
- Temporary seeded-test server on port `43196` is stopped.
- No `.tmp-seed-server.py` file should remain.
- `node --check app.js` passes.
- `git diff --check` only reports existing CRLF warnings.

Most recent behavior verified:

- Vertical immersive mode now uses centered spread alignment for expanded text.
- Short vertical immersive paper is centered horizontally and vertically.
- Long vertical immersive paper scrolls to the horizontal center of the spread (`scrollRatio` measured `0.5`), so the paper expands visually to both sides instead of anchoring to the far right.
- Long vertical immersive background uses centered `repeat-x` tiling (`background-position: 50% 0%`) so the letter-paper image reads as a horizontal spread.
- Setup/workbench vertical long text still keeps the right/original page visible first (`scrollRatio` measured `1`) and does not overlap the right editor panel.
- Vertical long text no longer expands into or overlaps the right-side tool/settings panel.
- Workbench vertical long text uses `.paper-stage` as a horizontal scroll viewport and scrolls to the right edge so the original/rightmost page is visible first.
- Immersive vertical long text stays vertically centered and uses horizontal scrolling from the center of the expanded spread.
- Horizontal mode uses a wider display ratio, measured around `0.78` versus vertical around `0.635`.
- Grid distribution and text line-height remain tied to actual grid cell size.

Recommended next step:

- Do a human visual pass at `http://127.0.0.1:43194/index.html`, especially vertical long text in immersive mode after the centered-spread change and horizontal mode proportions. If acceptable, update `CHANGELOG.md` and commit this version.

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
