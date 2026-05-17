# Change Log

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
