# EV Charger Station Visualizations

## Install

```bash
npm install
```

## Get the latest data

1. Go to the [U.S. Department of Energy Alternative Fuels Data Center data download page](https://afdc.energy.gov/data_download).
2. Download the data for EV stations only, **in JSON format.**
3. Move the file to this folder and rename it `stations.json`.

## Building the EV charger rollout movie

```bash
npm run movie
```

This will end by opening `movie.html` in your browser. If your environment doesn't support the `open` command, you can open `movie.html` directly after running this command.

In supported browsers a `.webm` video file will download itself at the end of the visualization.

## Colophon

This is a simple visualization of the U.S. Department of Energy Alternative Fuels Data Center data for all major types of EV stations in the continental U.S., based on the `open_date` field. Only stations with an `open_date` are plotted. The display begins on January 1st, 2010. The data and the outline map are plotted according to the Albers Equal Area Conic projection familiar to most Americans (thanks to [Tom Carden](https://gist.github.com/RandomEtc) for the code snippet). The United States outline map data is from the United States Census Cartographic Boundary Files, formatted in GeoJSON by [Eric Celeste](https://eric.clst.org/tech/usgeojson/). Data is rendered into an HTML5 `canvas` element. The video is captured within the browser using the HTML5 `MediaRecorder` interface. Thanks to [Jim Fisher](https://jameshfisher.com/2020/03/13/how-to-record-a-canvas-to-video/) for sharing the `MediaRecorder` logic to capture a canvas visualization.

## Building the CHAdeMO table

As an aside, Leaf owners like myself may be interested in seeing that new CHAdeMO stations specifically are still rolling out. To generate simple table of CHAdeMO station rollouts by year at the terminal prompt, run:

```bash
npm run chademo-table
```
