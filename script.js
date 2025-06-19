var map = L.map('map').setView([5.5600, -0.2250], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.control.scale().addTo(map);

// Icon definitions
var generalIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/12351/12351495.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

var privateIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4979/4979287.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

var pediatricIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3495/3495647.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

var specialistIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4979/4979315.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

var northArrowUrl = 'https://cdn-icons-png.flaticon.com/512/9709/9709650.png';

function plotHospitals() {
  var markers = L.markerClusterGroup();

  fetch('hospitals.geojson')
    .then(res => res.json()).then(data=>{
      L.geoJSON(data, {
        pointToLayer: (f,latlng) => {
          var icon = { 'General':generalIcon, 'Private':privateIcon, 'Pediatric':pediatricIcon, 'Specialist':specialistIcon }[f.properties.type] || generalIcon;
          var m = L.marker(latlng,{icon});
          m.bindPopup(`<b>${f.properties.name}</b><br>Type: ${f.properties.type}`);
          markers.addLayer(m);
          return m;
        }
      }).addTo(markers);

      map.addLayer(markers);
    }).catch(e => console.error('GeoJSON load error', e));
}

plotHospitals();

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML = `
    <h4>Type of Hospital</h4>
    <i style="background:url('https://cdn-icons-png.flaticon.com/512/12351/12351495.png') no-repeat center/contain;"></i> General<br>
    <i style="background:url('https://cdn-icons-png.flaticon.com/512/4979/4979287.png') no-repeat center/contain;"></i> Private<br>
    <i style="background:url('https://cdn-icons-png.flaticon.com/512/3495/3495647.png') no-repeat center/contain;"></i> Pediatric<br>
    <i style="background:url('https://cdn-icons-png.flaticon.com/512/4979/4979315.png') no-repeat center/contain;"></i> Specialist<br>
  `;
  return div;
};
legend.addTo(map);
