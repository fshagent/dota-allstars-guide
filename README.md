# DotA Allstars Hero Guides

Static, mobile-first web app: browse 111 DotA Allstars heroes, then open one for its abilities, a 16-level skill order and 2 item builds (starting / core / late game).

Run: `python3 -m http.server 8000` in this folder, then open http://localhost:8000 (or host the folder on any static host).

- `data/data.js` is generated from `tools/heroes-*.txt` with `node tools/build.js`. Edit the txt files to change guides.
- `img/` holds the hero portraits, ability icons and item icons from the DotA Allstars 6.83 map. They come from the public GitHub repo Eldor99/Dota_6.83 and are re-encoded as real PNGs. All artwork belongs to Blizzard Entertainment / the DotA community.
- "Arc" is not included, because I could not identify which hero that portrait is.
