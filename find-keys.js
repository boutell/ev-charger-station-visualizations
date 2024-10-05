const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./stations.json'));
const keys = new Set();
for (const station of data.fuel_stations) {
  for (const key of Object.keys(station)) {
    keys.add(key);
  }
  console.log(station);
}
console.log([...keys]);

