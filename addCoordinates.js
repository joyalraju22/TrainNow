const axios = require("axios");
const fs = require("fs");

const stations = require("./stations.json");

const API_KEY = "e6fbb8cca02f47adbbd11b43499e155f"; // <-- paste your key

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCoordinates(place) {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: place,
          key: API_KEY,
          limit: 1
        }
      }
    );

    if (response.data.results.length > 0) {
      return {
        lat: response.data.results[0].geometry.lat,
        lng: response.data.results[0].geometry.lng
      };
    }
  } catch (error) {
    console.log("Error:", place);
  }

  return { lat: null, lng: null };
}

async function updateStations() {
  for (let station of stations) {
    const query = `${station.name} railway station ${station.city} India`;

    console.log("Fetching:", query);

    const coords = await getCoordinates(query);

    station.lat = coords.lat;
    station.lng = coords.lng;

    console.log("Saved:", station.name, coords);

    await delay(500); // small delay
  }

  fs.writeFileSync(
    "stations_with_coords.json",
    JSON.stringify(stations, null, 2)
  );

  console.log("All stations updated successfully!");
}

updateStations();