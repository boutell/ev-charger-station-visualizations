const stations = require('./stations.json').fuel_stations.filter(station => !!station.open_date);

const types = new Set();

for (const station of stations) {
  for (const type of station.ev_connector_types || []) {
    types.add(type);
  }
}
console.log(types);
