# DotA Allstars Hero Guides

Static, mobile-first web app: browse 111 DotA Allstars heroes with their portraits and ability icons. A hero shows a guide only if it comes from a named source, with a link to that source.

Run: `python3 -m http.server 8000` in this folder, then open http://localhost:8000.

- `tools/heroes.txt`: hero id, name, attribute and ability icon prefix.
- `tools/guides.json`: sourced guides only (currently Abaddon, from Dota683.net via the repo Eldor99/Dota_6.83). Each entry needs a `source` URL.
- Build with `node tools/build.js` (writes `data/data.js`).
- `img/` holds the hero, ability and item icons from the DotA Allstars 6.83 map, from the repo Eldor99/Dota_6.83. All artwork belongs to Blizzard Entertainment / the DotA community.
- Hero names were matched to portraits by hand, so a few may be wrong. "Arc" is not included because that portrait could not be identified.
