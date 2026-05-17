# Handoff: Shizhuzhai Letter Site

Last updated: 2026-05-17

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
