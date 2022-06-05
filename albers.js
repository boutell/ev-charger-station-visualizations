// Borrowed from: https://gist.github.com/RandomEtc/476238

(() => {
  window.albers = (lat0, lng0, phi1, phi2) => {

    if (lat0 == undefined) lat0 = 23.0;  // Latitude_Of_Origin
    if (lng0 == undefined) lng0 = -96.0; // Central_Meridian
    if (phi1 == undefined) phi1 = 29.5;  // Standard_Parallel_1
    if (phi2 == undefined) phi2 = 45.5;  // Standard_Parallel_2

    lat0 = radians(lat0);
    lng0 = radians(lng0);
    phi1 = radians(phi1);
    phi2 = radians(phi2);

    let n = 0.5 * (Math.sin(phi1) + Math.sin(phi2)),
        c = Math.cos(phi1),
        C = c*c + 2*n*Math.sin(phi1),
        p0 = Math.sqrt(C - 2*n*Math.sin(lat0)) / n;

    return {
        project: function(longitude, latitude) {
            const theta = n * (radians(longitude) - lng0),
                p = Math.sqrt(C - 2*n*Math.sin(radians(latitude))) / n;
            return {
                x: p * Math.sin(theta),
                y: p0 - p * Math.cos(theta)
            };
        },
        invert: function(xy) {
            const theta = Math.atan(xy.x / (p0 - xy.y)),
                p = Math.sqrt(xy.x*xy.y + Math.pow(p0 - xy.y, 2));
            return {
                lng: degrees(lon0 + theta/n),
                lat: degrees(Math.asin( (C - p*p*n*n) / (2*n)))
            };
        }
    };
  };
  function radians(d) {
    return d * 0.0174533;
  }
  function degrees(r) {
    return r * 57.2958;
  }
})();

