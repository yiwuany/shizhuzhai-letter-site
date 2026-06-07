# Change Log

## V3 In Progress - 2026-05-18

- Added PNG image generation for the current stationery composition.
- Added a generated-image preview dialog with a downloadable PNG link.
- Added direct image export using the same Canvas renderer as preview.
- Reworked the seal into a generated SVG seal face with selectable `朱文` and `白文` styles, rough broken borders, wear marks, and seal-oriented fallback.
- Added online seal-glyph lookup for real per-character 篆刻 SVGs through the Commons API, with timeout handling and component composition for missing demo glyphs such as `雅 = 牙 + 隹` and `雷 = 雨 + 田`.
- Added local full-character seal glyph overrides for `雅` and `楚`, so these no longer rely on approximate component composition.
- Added the CNS11643 Shuowen Jiezi seal-script TrueType font as the primary glyph source and OpenType.js as a local path extractor.
- Reworked seal text rules: input is cleaned and normalized for seal use, common simplified characters are converted before glyph lookup, and the new `印文格式` selector controls whether text stays literal or adds `印` / `之印` / smart suffixes.
- Reordered glyph lookup so the local Shuowen font wins first, curated local seal SVGs are fallbacks, component composites are next, and remote Commons lookup is the final fallback.
- Tightened seal glyph extraction and layout so small-seal paths are bolder, fill more of each seal cell, and produce more balanced Zhu/Bai name seals.
- Reworked seal glyph generation to normalize both font outlines and SVG glyphs into `300 × 300` paths before layout, fixing undersized local glyphs such as `楚`.
- Added explicit `preferLocal` support for future curated SVG overrides while keeping current `楚` and `雅` visually consistent with `之` and `印` through the font source.
- Replaced square glyph slots with optical rectangular fill cells, using non-uniform SVG scaling so seal text distributes more evenly across each印面 grid cell.
- Added seal glyph diagnostics: the rendered seal records per-character sources in `data-seal-sources`, and the editor warns when a character cannot be resolved to small-seal art.
- Reworked seal layout rules: characters now read top-to-bottom by column, with columns ordered from right to left.
- Added variable seal frames for 1, 2, 3, 4, 5-6, and 7-9 character seals instead of forcing every seal into one square.
- Removed visible regular-font fallback from seals; missing glyphs now use a subtle carved missing-glyph mark instead of Kai/Song text.
- Added Canvas export drawing for the stationery background, wash, grid, letter text, and seal.

## V2.2 Final - 2026-05-17

- Finalized the V2 paper-axis behavior for long letters.
- Expanded vertical long text horizontally instead of downward, while keeping workbench overflow inside the preview column.
- Centered vertical immersive editing so expanded stationery opens from the middle and can scroll both directions.
- Retiled vertical expanded stationery as a horizontal spread so the background image remains continuous.
- Made grid cells distribute evenly across the actual writing area and kept line-height aligned to the grid.
- Widened horizontal writing proportions so horizontal letters no longer read as a narrow vertical sheet.

## V2.1 - 2026-05-17

- Reworked vertical stationery guides into a traditional letter-paper frame: one outer writing-area border with vertical column separators.
- Kept horizontal writing close to the V1/x.html style with soft horizontal guide lines.
- Resized immersive mode so normal vertical and horizontal letters fit in one viewport without scrolling.
- Warmed the immersive background and strengthened the floating paper shadow to better match the x.html atmosphere.
- Preserved long-text behavior: the page extends only when the letter content is too long.

## V2 - 2026-05-17

- Kept the workbench as the only active layout and removed the failed immersive/classic alternatives.
- Added a setup-to-immersive editing flow: choose paper and parameters, then edit directly on the stationery without surrounding tool panels.
- Added vertical/horizontal writing mode switching.
- Added traditional stationery grid lines that follow the selected writing direction.
- Removed internal text scrolling; long text expands the paper surface instead of showing a scrollbar inside the stationery.
- Added direct contenteditable editing on the paper while keeping the side text fields in sync.

## V1 - 2026-05-16

- Built the first static prototype with 79 generated paper previews and thumbnails.
- Added category switching, random paper selection, text fields, style controls, and local autosave.
- Added three comparison layouts: workbench, immersive, and classic.
