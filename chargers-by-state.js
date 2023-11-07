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
  filterByType(station.ev_connector_types || []) &&
  (station.open_date >= argv.start) &&
  (station.open_date <= argv.end) &&
  // 1000 bogus re-reported stations on this date
  (station.open_date !== '2022-09-21')
);
const byState = new Map();

const networks = {};

for (const station of stations) {
  if (!networks[station.ev_network]) {
    networks[station.ev_network] = 0;
  }
  networks[station.ev_network]++;
  station.sortAddress =`${station.state} ${station.city} ${station.zip} ${station.street_address}`;
  let localStations = byState.get(station.state);
  if (!localStations) {
    localStations = [];
  }
  localStations.push(station);
  byState.set(station.state, localStations);
}

const stateNames = [...byState.keys()];

stateNames.sort();

let total = 0;
let totalChargePoints = 0;

for (const state of stateNames) {
  const stations = byState.get(state);
  console.log(`➡ ${state}\n`);
  stations.sort((a, b) => {
    a = a.sortAddress;
    b = b.sortAddress;
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });
  let lastAddress = null;
  let lastName = null;
  let count = 0;
  for (const station of stations) {
    const address = `${station.street_address}\n${station.city}, ${station.state} ${station.zip}`;
    if (lastAddress && (address !== lastAddress)) {
      emit();
      count = 0;
    }
    lastAddress = address;    
    lastName = station.station_name;
    if (type === 'CHADEMO') {
      count++;
    } else {
      count += station.ev_dc_fast_num || 1;
    }
    total++;
    totalChargePoints += count;
  }
  if (count) {
    emit();
  }  

  function emit() {
    console.log(`(${count}) ${lastName}`);
    console.log(lastAddress);
    console.log('');
  }
}

console.log('');
console.log(`Total Stations: ${total}`);
console.log(`Total Chargepoints: ${totalChargePoints}`);
// console.log(networks);

function filterByType(types) {
  const requireTypes = type.includes('+') ? type.split('+') : [ type ];
  return !requireTypes.find(type => !types.includes(type));
}
