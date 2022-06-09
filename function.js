// map function

// basemap switch
// https://leaflet-extras.github.io/leaflet-providers/preview/
// viewport
window.LRM = {
	tileLayerUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
	osmServiceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1',
	orsServiceUrl: 'https://api.openrouteservice.org/geocode/',
	apiToken: '5b3ce3597851110001cf6248ff41dc332def43858dff1ecccdd19bbc'
};

var map = L.map('map').setView([1.3521, 103.8198], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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
// Create click event handler
map.on('click', onMapClick);


// The function to create marker on click
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}


map.on('click', onMapClick);


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

    marker = L.marker([lat, long], { icon }).bindPopup('You are here.')
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

//routing
function button(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

var control = L.Routing.control({
        router: L.routing.osrmv1({
			serviceUrl: LRM.osmServiceUrl
		}),
        routeWhileDragging: true,
        plan: new (L.Routing.Plan.extend({
            createGeocoders: function() {
                var container = L.Routing.Plan.prototype.createGeocoders.call(this),
                    reverseButton = button('&#8593;&#8595;', container);

                L.DomEvent.on(reverseButton, 'click', function() {
                    var waypoints = this.getWaypoints();
                    this.setWaypoints(waypoints.reverse());
                }, this);

                return container;
            }
        }))([
            L.latLng(0, 0),
            L.latLng(0, 0)
        ], {
            geocoder: L.Control.Geocoder.nominatim(),
            routeWhileDragging: true
        })
    })
    .on('routingerror', function(e) {
        try {
            map.getCenter();
        } catch (e) {
            map.fitBounds(L.latLngBounds(control.getWaypoints().map(function(wp) { return wp.latLng; })));
        }

        handleError(e);
    })
    .addTo(map);



  
