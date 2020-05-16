// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



d3.json(queryUrl, function(data) {
  
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  
  
  var earthquakes = L.geoJSON(earthquakeData, {

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: colorRange(feature.properties.mag),
        color: "black",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 0.8
      });
    },

    
    onEachFeature: onEachFeature
  });

  
  createMap(earthquakes);
}


function createMap(earthquakes) {

  
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  
  

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);



var legend = L.control({
  position: "bottomright"
});


legend.onAdd = function(myMap) {
  var legend_loc = L.DomUtil.create("div", "info legend"),
  levels = [0, 1, 2, 3, 4, 5]

  
  for (var i = 0; i < levels.length; i++) {
    legend_loc.innerHTML += '<i style="background:' + colorRange(levels[i]) + '"></i> ' + [i] + (levels[i + 1] ? '&ndash;' + 
      levels[i + 1] + '<br>' : '+');
  }
  return legend_loc;
};


legend.addTo(myMap);
}


function colorRange(magnituge) {

switch (true) {
  case magnituge >= 5.0:
    return 'red';
    break;

  case magnituge >= 4.0:
    return 'orangered';
    break;
  
  case magnituge >= 3.0:
    return 'orange';
    break;

  case magnituge >= 2.0:
    return 'gold';
    break;

  case magnituge >= 1.0:
    return 'yellow';
    break;

  default:
    return 'greenyellow';
};
};




function markerSize(magnituge) {
  return magnituge*6;
};