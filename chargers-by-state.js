const { table } = require('table');
const dayjs = require('dayjs');
const argv = require('boring')();
const data = require('./stations.json');

const type = argv.type;
if (!type) {
  console.error('--type required: CHADEMO, J1772, J1772COMBO');
  process.exit(1);
}

const stations = data.fuel_stations.filter(station =>
  ((station.ev_connector_types || []).includes(type)) &&
  (station.open_date >= argv.start) &&
  (station.open_date <= argv.end) &&
  // 1000 bogus re-reported stations on this date
  (station.open_date !== '2022-09-21')
);

const byState = new Map();

for (const station of stations) {
  let localStations = byState.get(station.state);
  if (!localStations) {
    localStations = [];
  }
  localStations.push(station);
  byState.set(station.state, localStations);
}

const stateNames = [...byState.keys()];

stateNames.sort();

let n = 0;

for (const state of stateNames) {
  const stations = byState.get(state);
  console.log(`➡ ${state}\n`);
  stations.sort((a, b) => {
    a = `${a.city} ${a.zip}`;
    b = `${b.city} ${b.zip}`;
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });
  for (const station of stations) {
    console.log(station.station_name);
    console.log(station.street_address);
    console.log(`${station.city}, ${station.state} ${station.zip}\n`);
    n++;
  }
}

console.log('');
console.log(`Total: ${n}`);
