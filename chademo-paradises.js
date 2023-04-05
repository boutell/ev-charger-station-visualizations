const { table } = require('table');
const dayjs = require('dayjs');
const argv = require('boring')();
const data = require('./stations.json');

const stations = data.fuel_stations.filter(station =>
  ((station.ev_connector_types || []).includes('CHADEMO'))
);

for (const station of stations) {
  console.log(JSON.stringify(station, null, '  '));
}

const byAddress = new Map();

for (const station of stations) {
  const address = `${station.street_address} ${station.city} ${station.state}, ${station.zip}`;
  byAddress.set(address, [...(byAddress.get(address) || []), station]);
}

const addresses = [...byAddress.keys()];

addresses.sort((a, b) => {
  a = count(a);
  b = count(b);
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  } else {
    return 0;
  }
});

for (const address of addresses) {
  console.log(`${count(address)}: ${address}`);
}

function count(address) {
  return byAddress.get(address).reduce((a, station) => a + station.ev_dc_fast_num, 0);
}
