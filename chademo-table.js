const { table } = require('table');
const dayjs = require('dayjs');
const data = require('./stations.json');

const types = new Set();

const stations = data.fuel_stations.filter(station => (station.ev_connector_types || []).includes('CHADEMO'));

const yearCounts = {};
const monthCounts = {};

let lastDate;

for (const station of stations) {
  const date = station.open_date || '';
  if ((!lastDate) || (date > lastDate)) {
    lastDate = date;
  }
  const month = (station.open_date || '').substring(0, 7);
  if (month) {
    monthCounts[month] = monthCounts[month] || 0;
    monthCounts[month]++;
  }

  const year = (station.open_date || '').substring(0, 4);
  if (year) {
    yearCounts[year] = yearCounts[year] || 0;
    yearCounts[year]++;
  }
}

let unknown = stations.reduce((a, station) => a + station.open_date ? 0 : 1, 0);
const years = Object.keys(yearCounts);
years.sort();
const months = Object.keys(monthCounts);
months.sort();
let results = [
  [
    'Year',
    'Opened',
    'Annualized'
  ]
];

const now = (new Date()).getFullYear();
const days = dayjs(new Date()).diff(dayjs(`${now}-01-01`), 'day');
const daysInYear = dayjs(`${now + 1}-01-01`).diff(dayjs(`${now}-01-01`), 'day');
const scale = daysInYear / days;
for (const year of years) {
  results.push([ year, yearCounts[year], year < now ? yearCounts[year] : Math.floor(yearCounts[year] * scale) ]);
}
results.push([ 'Unknown', unknown, '' ]);

console.log(table(results));

console.log('\nBy Month\n');
results = [
  [
    'Month',
    'Opened'
  ]
];
for (const month of months) {
  results.push([ month, monthCounts[month] ]);
}

console.log(table(results));
