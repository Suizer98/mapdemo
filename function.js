// map function

// basemap switch
// https://leaflet-extras.github.io/leaflet-providers/preview/
// viewport

var map = L.map('map').setView([1.3521, 103.8198], 12);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var baselayers = {
    "CartoDB Positron": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'),
    "ESRI Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    "ESRI Terrain": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'),
    "ESRI Topo": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'),
    "Standard tiles": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
};

var overlays = {};

L.control.layers(baselayers, overlays).addTo(map);

//mouse


//geolocation

if (!navigator.geolocation) {
    console.log("Your browser doesn't support geolocation feature!")
} else {
    setInterval(() => {
        navigator.geolocation.getCurrentPosition(getPosition)
    }, 5000);
};
var marker, circle, lat, long, accuracy;

function getPosition(position) {
    // console.log(position)
    lat = position.coords.latitude
    long = position.coords.longitude
    accuracy = position.coords.accuracy

    if (marker) {
        map_init.removeLayer(marker)
    }

    if (circle) {
        map_init.removeLayer(circle)
    }

    marker = L.marker([lat, long], { icon })
    circle = L.circle([lat, long], { radius: accuracy })

    var featureGroup = L.featureGroup([marker, circle]).addTo(map)

    // map.fitBounds(featureGroup.getBounds())

    // console.log("Your coordinate is: Lat: " + lat + " Long: " + long + " Accuracy: " + accuracy)
}

//icon color
const icon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

//address locator
var marker2
var _geocoderType = L.Control.Geocoder.nominatim();
var geocoder = L.Control.geocoder({
   geocoder: _geocoderType
}).addTo(map);

geocoder.on('markgeocode', function(event) {
    if (marker2) {
        map.removeLayer(marker2)
    }


     var center = event.geocode.center;
     L.marker2(center).addTo(map);
     map.setView(center, map.getZoom());
});