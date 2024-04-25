/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("OpenTopoMap");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup().addTo(map),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup().addTo(map),
  zones: L.featureGroup().addTo(map),
  hotels: L.featureGroup().addTo(map)
}

// Hintergrundlayer
L.control
  .layers({
    "OpenTopoMap": startLayer,
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau"),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
  }, {
    "Sehenwürdigkeiten": themaLayer.sights,
    "Linien": themaLayer.lines,
    "Haltestellen": themaLayer.stops,
    "Fußgängerzonen": themaLayer.zones,
    "Hotels": themaLayer.hotels

  })
  .addTo(map);

// Marker Stephansdom
L.marker([stephansdom.lat, stephansdom.lng])
  .addTo(map)
  .bindPopup(stephansdom.title)
  .openPopup();

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);


L.control.fullscreen().addTo(map);


async function loadSights(url) {
  console.log("loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4><a href="${feature.properties.WEITERE_INF}" target="wien">${feature.properties.NAME}</a></h4>
        <adress>${feature.properties.ADRESSE}</adress>
      `)
    }
  }).addTo(themaLayer.sights);
}

async function loadLines(url) {
  console.log("loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  L.geoJson(geojson, {
    style: function (feature) {
      let lineName = feature.properties.LINE_NAME;

      let lineColor = "black";

      if (lineName == "Red Line") {
        lineColor = "#FF4136";
      } else if (lineName == "Yellow Line") {
        lineColor = "#FFDC00";
      } else if (lineName == "Orange Line") {
        lineColor = "#FF851B0";
      } else if (lineName == "Blue Line") {
        lineColor = "#0074D9";
      } else if (lineName == "Green Line") {
        lineColor = "#2ECC40";
      } else if (lineName == "Gray Line") {
        lineColor = "#AAAAAA";
      }

      return {
        color: lineColor
      };
    }
  }).addTo(themaLayer.lines);
}

async function loadStops(url) {
  console.log("loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson);
  L.geoJson(geojson).addTo(themaLayer.stops);
}


async function loadZones(url) {
  console.log("loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson);
  L.geoJson(geojson, {
    style: function (feature) {
      return {
        color: "#F012BE",
        weight: 1,
        opacity: 0.4,
        fillOpacity: 0.1,
      };
    }
  }
  ).addTo(themaLayer.zones);
}

async function loadHotels(url) {
  console.log("loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson);
  L.geoJson(geojson).addTo(themaLayer.hotels);
}


loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")





/* 
Suche Sightseeing 

loadLines
layer: lines


loadStops 
layer: stops
Touristische Kraftfahrlinien Haltestellen Viennea.... 






Suche Fußgängerzonen 

loadZones
layer: zones
Fußgängerzonen Wien 



Suche Hotels 

LoadHotels
layer: hotels
Hotels und Unterkünfte





*/ 