const stations = require('./stations.json').fuel_stations.filter(station => !!station.open_date);
stations.sort((a, b) => {
  if (a.open_date < b.open_date) {
    return -1;
  } else if (a.open_date > b.open_date) {
    return 1;
  } else {
    return 0;
  }
});

for (const station of stations) {
  console.log(`>${station.open_date}<`);
}
