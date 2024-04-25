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
  sights: L.featureGroup(),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup().addTo(map),
  zones: L.featureGroup(),
  hotels: L.featureGroup()
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
  let response = await fetch(url);
  let sights = await response.json();

  L.geoJson(sights, {
    pointToLayer: function (feature, latlng) {
      let icon = L.icon({
        iconUrl: "sight.png",
        iconAnchor: [12, 24],
        popupAnchor: [12, -24],

      });
      let marker = L.marker(latlng, {
        icon: icon
      });
      return marker;
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
      <img src="${feature.properties.THUMBNAIL}" style="width:200px" />
      <h4><a href="${feature.properties
          .WEITERE_INF}" target="wien">${feature.properties.NAME}</h4></a>
      <address>${feature.properties.ADRESSE}</address>
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
      } else if (lineName == "Grey Line") {
        lineColor = "#AAAAAA";
      }

      return {
        color: lineColor
      };
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
        <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
        <p><i class="fa-solid fa-circle-stop"></i> ${feature.properties.FROM_NAME}</p>
        <p><i class="fa-solid fa-down-long"></i></p>
        <p><i class="fa-solid fa-circle-stop"></i> ${feature.properties.TO_NAME}</p>
      `);
    }
  }).addTo(themaLayer.lines);
}

async function loadStops(url) {
  let response = await fetch(url);
  let stops = await response.json();

  L.geoJson(stops, {
    pointToLayer: function (feature, latlng) {


      let lineName = feature.properties.LINE_NAME;
      console.log(lineName);

      url = "bus.png";

      if (lineName == "Blue Line") {
        url = "bus_3.png"
      } else if (lineName == "Yellow Line") {
        url = "bus_2.png"
      } else if (lineName == "Green Line") {
        url = "bus_4.png"
      } else if (lineName == "Red Line") {
        url = "bus_1.png"
      } else if (lineName == "Grey Line") {
        url = "bus_5.png"
      } else if (lineName == "Orange Line") {
        url = "bus_6.png"
      }



      let icon = L.icon({
        iconUrl: url,
        iconAnchor: [12, 24],
        popupAnchor: [12, -24],

      });
      let marker = L.marker(latlng, {
        icon: icon
      });
      return marker;
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
        <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
        <p>${feature.properties.STAT_ID} ${feature.properties.STAT_NAME}</p>
      `);
    }
  }).addTo(themaLayer.stops);
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
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
      <h4>Fußgängerzone ${feature.properties.ADRESSE}</h4>
      <p><i class="fa-solid fa-clock"></i> ${feature.properties.ZEITRAUM}</p>
      <p><i class="fa-solid fa-circle-info"></i> ${feature.properties.AUSN_TEXT}</p>

      
      `);
      layer.setStyle({ color: 'red' });
    }
  }
  ).addTo(themaLayer.zones);
}

async function loadHotels(url) {
  let response = await fetch(url);
  let hotels = await response.json();

  L.geoJson(hotels, {
    pointToLayer: function (feature, latlng) {
      let icon = L.icon({
        iconUrl: "hotel.png",
        iconAnchor: [12, 24],
        popupAnchor: [12, -24],

      });
      let marker = L.marker(latlng, {
        icon: icon
      });
      return marker;
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
        <h3>${feature.properties.BETRIEB}</h3>
        <p><strong>${feature.properties.BETRIEBSART_TXT} ${feature.properties.KATEGORIE_TXT}</strong></p>
        <hr>
        <p>
          Addr.: ${feature.properties.ADRESSE}<br>
          Tel.: <a href="tel:${feature.properties.KONTAKT_TEL}">${feature.properties.KONTAKT_TEL}</a><br>
          <a href="mailto:${feature.properties.KONTAKT_EMAIL}">${feature.properties.KONTAKT_EMAIL}</a><br>
          <a href="${feature.properties.WEBLINK1}" target="wien">Homepage</a>
        </p>
      `);
    }
  }).addTo(themaLayer.hotels);
}

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")

loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")
