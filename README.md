# Kalkaska Deer Camp — v1.1 / cache dc-v2

Static, local-first PWA for Brandon's deer camp, served by GitHub Pages. No backend,
accounts, cloud sync, tracking, or paid services. Works offline once opened.

- **Camp**: camp facts, crew, the Kodiak 12x16 tent decision, and planning notes.
- **Gear**: packing checklist with check-offs, add/edit/delete, and "Uncheck all" for the next trip.
- **Buy**: shopping list with store links, In plan / Bought toggles, and running totals.
  Seeded with the Kodiak plan (tent + 1672 front room = $1,899.98) plus the stove options and
  dream-camp gear for reference. Prices checked Nov 16, 2026; before tax and shipping.
- **Photos**: reference albums for the Kodiak 12x16 and front room, stove options (for later),
  the blind / stand, and dream-camp items. Each photo has a caption and a link to its product
  page. Shopping-list and gear items that have a photo also have a Photo button. You can add
  your own shots; they stay on this phone only (IndexedDB, never uploaded) and are included
  in a backup file.
- **Log**: the 2026 hunt log by day, editable, plus the final tally.
- **More**: dream camp goals, notes, light/dark/auto look, backup and restore (JSON file).

Data lives in this phone's localStorage (`dc.data.v1`). Photos you add live in this phone's
IndexedDB (`dc.photos.v1`). Each phone has its own copy; back up before switching phones.
Install: open in Safari → Share → Add to Home Screen.

Left out on purpose because the site is public: family members' names, addresses, and GPS points.
