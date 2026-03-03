# Richmond Sanborn Historical Buildings

An interactive web map built with MapLibre GL JS showing digitized building footprints from Sanborn fire insurance maps for downtown Richmond, VA.

## Features
- Street and satellite basemap toggle
- Layer visibility toggle
- Click-to-popup with building attributes
- Lightweight, no frameworks

## Stack
- MapLibre GL JS 4.x
- Vanilla HTML/CSS/JavaScript
- GitHub Pages hosting

## Data
- `data/structures.geojson` — building footprints digitized from Sanborn maps
- Source: QGIS digitization from Sanborn Fire Insurance Maps (Library of Congress)

## Local Development
Just open `index.html` in a browser — no build step required.

## Updating Data
1. Edit buildings in QGIS
2. Export layer as GeoJSON to `data/structures.geojson`
3. `git add data/structures.geojson && git commit -m "update buildings" && git push`
