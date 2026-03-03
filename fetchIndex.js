const axios = require('axios');
const fs = require('fs');
const path = require('path');

const STATIONS_URL = 'https://raw.githubusercontent.com/datameet/railways/master/stations.json';
const TRAINS_URL = 'https://raw.githubusercontent.com/datameet/railways/master/trains.json';

async function downloadData() {
    try {
        console.log("Fetching full station list...");
        const stationsResponse = await axios.get(STATIONS_URL);

        console.log("Processing stations...");
        const stationsData = stationsResponse.data;
        if (!stationsData.features) {
            console.error("Stations data format mismatch (no features)");
            return;
        }

        const stations = stationsData.features
            .filter(f => f.geometry && f.geometry.coordinates) // Filter out null geometries
            .map(f => ({
                name: f.properties.name,
                code: f.properties.code,
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
                state: f.properties.state
            }));

        const stationsPath = path.join('src', 'data', 'stations_full.json');
        fs.writeFileSync(stationsPath, JSON.stringify(stations, null, 2));
        console.log(`Saved ${stations.length} valid stations to ${stationsPath}`);

        console.log("Fetching full train index...");
        const trainsResponse = await axios.get(TRAINS_URL);

        console.log("Processing trains...");
        const trainsData = trainsResponse.data;
        if (!trainsData.features) {
            console.error("Trains data format mismatch (no features)");
            return;
        }

        const trainIndex = trainsData.features.map(f => ({
            number: f.properties.number,
            name: f.properties.name,
            from: f.properties.from_station_code,
            to: f.properties.to_station_code
        }));

        const trainsPath = path.join('src', 'data', 'trains_index.json');
        fs.writeFileSync(trainsPath, JSON.stringify(trainIndex, null, 2));
        console.log(`Saved ${trainIndex.length} trains to ${trainsPath}`);

    } catch (err) {
        console.error("Error downloading data:", err.message);
    }
}

downloadData();
