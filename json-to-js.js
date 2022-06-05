const fs = require('fs');
fs.writeFileSync('./stations.js', `window.data = ${fs.readFileSync('./stations.json')}`);
fs.writeFileSync('./usa.js', `window.usa = ${fs.readFileSync('./gz_2010_us_outline_500k.json')}`);
