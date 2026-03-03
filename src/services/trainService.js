import axios from "axios";
import stations from "../data/stations.json";
import routeData from "../data/trains.js";

// Mathematical Helpers
const deg2rad = (deg) => deg * (Math.PI / 180);
const rad2deg = (rad) => rad * (180 / Math.PI);

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBearing = (lat1, lon1, lat2, lon2) => {
  const y = Math.sin(deg2rad(lon2 - lon1)) * Math.cos(deg2rad(lat2));
  const x = Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) -
    Math.sin(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(lon2 - lon1));
  return (rad2deg(Math.atan2(y, x)) + 360) % 360;
};

const timeToSeconds = (time) => {
  if (!time || time === "None" || time === "--") return null;
  const parts = time.split(":").map(Number);
  if (parts.length === 2) return (parts[0] * 3600) + (parts[1] * 60);
  if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  return null;
};

// Basic in-memory cache for API calls to save budget
const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const trainService = {
  planJourney: async (fromStation, toStation) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const matches = [];
        const queryFrom = fromStation?.toLowerCase().trim() || "";
        const queryTo = toStation?.toLowerCase().trim() || "";

        if (!queryFrom || !queryTo) return resolve([]);

        const routes = typeof routeData === 'object' && routeData.default ? routeData.default : routeData;
        Object.entries(routes).forEach(([number, train]) => {
          const fromIndex = train.route.findIndex((s) =>
            s.code.toLowerCase() === queryFrom || s.station.toLowerCase().includes(queryFrom)
          );

          const toIndex = train.route.findIndex((s) =>
            s.code.toLowerCase() === queryTo || s.station.toLowerCase().includes(queryTo)
          );

          if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
            matches.push({
              number,
              name: train.name,
              departureTime: train.route[fromIndex].dep === "None" ? train.route[fromIndex].arr : train.route[fromIndex].dep,
              arrivalTime: train.route[toIndex].arr === "None" ? train.route[toIndex].dep : train.route[toIndex].arr,
              from: train.route[fromIndex].station,
              to: train.route[toIndex].station
            });
          }
        });

        resolve(matches);
      }, 300);
    });
  },

  getTrainRoute: async (trainNumber) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const routes = typeof routeData === 'object' && routeData.default ? routeData.default : routeData;
        routes[trainNumber]
          ? resolve(routes[trainNumber])
          : reject(new Error("Route not found"));
      }, 300);
    });
  },

  getTrainLiveStatus: async (trainNumber) => {
    try {
      // Check cache first
      const cached = apiCache.get(trainNumber);
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`Using cached status for train ${trainNumber}`);
        return cached.data;
      }

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      let response;
      let isFree = true;

      try {
        // Try Free Robust Scraper First
        response = await axios.get(`${API_URL}/api/train/status/free/${trainNumber}`);
      } catch (freeErr) {
        console.warn("Free Tracking failed, trying Paid API...");
        isFree = false;
        response = await axios.get(`${API_URL}/api/train/status/${trainNumber}`);
      }

      const apiData = response.data;

      if (apiData.ResponseCode === "200") {
        const current = apiData.CurrentStatus || apiData.CurrentStation || {};

        const result = {
          trainNumber: apiData.TrainNumber || trainNumber,
          trainName: apiData.TrainName || "Unknown Train",
          currentStation: current.StationName || "In Transit",
          nextStation: apiData.NextStation?.StationName || "N/A",
          status: current.Status || apiData.Status || "Running",
          delay: current.DelayInArrival || "No Delay",
          lastUpdated: new Date().toLocaleTimeString(),
          latitude: current.Latitude || 0,
          longitude: current.Longitude || 0,
          speedKmh: apiData.CurrentSpeed || 0,
          progressPercentage: apiData.Progress || 0,
          distanceRemaining: apiData.DistanceToDestination || 0,
          isLive: true,
          source: isFree ? "Live (Free)" : "Live (Premium)",
          stations: apiData.Stations || []
        };

        // Update cache
        apiCache.set(trainNumber, {
          timestamp: Date.now(),
          data: result
        });

        return result;
      }

      throw new Error("Failed to fetch live status from API");
    } catch (err) {
      console.warn("API Fetch failed, falling back to simulation:", err.message);
      // Fallback to the existing simulation logic if API fails
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const routes = typeof routeData === 'object' && routeData.default ? routeData.default : routeData;
          const route = routes[trainNumber];
          if (!route) return reject(new Error("Train not found"));

          const now = new Date();
          const currentSeconds = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();

          for (let i = 0; i < route.route.length - 1; i++) {
            const start = route.route[i];
            const end = route.route[i + 1];

            const startDepTime = start.dep === "None" ? start.arr : start.dep;
            const endArrTime = end.arr === "None" ? end.dep : end.arr;

            const startSec = timeToSeconds(startDepTime);
            const endSec = timeToSeconds(endArrTime);

            if (startSec === null || endSec === null) continue;

            if (currentSeconds >= startSec && currentSeconds < endSec) {
              const startStation = stations.find((s) => s.code === start.code);
              const endStation = stations.find((s) => s.code === end.code);

              const sLat = startStation?.lat || 20.5937;
              const sLng = startStation?.lng || 78.9629;
              const eLat = endStation?.lat || 20.5937;
              const eLng = endStation?.lng || 78.9629;

              const progress = (currentSeconds - startSec) / (endSec - startSec);
              const lat = sLat + (eLat - sLat) * progress;
              const lng = sLng + (eLng - sLng) * progress;

              const totalKm = getDistance(sLat, sLng, eLat, eLng);
              const totalHours = (endSec - startSec) / 3600;
              const avgSpeed = totalHours > 0 ? (totalKm / totalHours) : 0;

              const distanceCovered = progress * totalKm;
              const distanceRemaining = (1 - progress) * totalKm;
              const bearing = getBearing(sLat, sLng, eLat, eLng);

              return resolve({
                trainNumber,
                trainName: route.name,
                currentStation: start.station,
                nextStation: end.station,
                latitude: lat,
                longitude: lng,
                speedKmh: Math.round(avgSpeed),
                bearing: Math.round(bearing),
                distanceCovered: distanceCovered.toFixed(2),
                distanceRemaining: distanceRemaining.toFixed(2),
                progressPercentage: (progress * 100).toFixed(1),
                lastUpdated: new Date().toLocaleTimeString(),
                status: "Running (Simulated)"
              });
            }
          }

          const lastStop = route.route[route.route.length - 1];
          const lastArrSec = timeToSeconds(lastStop.arr === "None" ? lastStop.dep : lastStop.arr);

          if (lastArrSec !== null && currentSeconds >= lastArrSec) {
            return resolve({
              trainNumber,
              trainName: route.name,
              status: "Arrived at final station",
              currentStation: lastStop.station,
              lastUpdated: new Date().toLocaleTimeString(),
            });
          }

          const firstStop = route.route[0];
          const firstDepSec = timeToSeconds(firstStop.dep === "None" ? firstStop.arr : firstStop.dep);

          if (firstDepSec !== null && currentSeconds < firstDepSec) {
            return resolve({
              trainNumber,
              trainName: route.name,
              status: "Scheduled to depart",
              departureTime: firstStop.dep === "None" ? firstStop.arr : firstStop.dep,
              currentStation: firstStop.station,
              nextStation: route.route[1]?.station || "-",
              lastUpdated: new Date().toLocaleTimeString(),
            });
          }

          resolve({
            trainNumber,
            trainName: route.name,
            status: "Running",
            lastUpdated: new Date().toLocaleTimeString(),
          });
        }, 300);
      });
    }
  },
  searchTrains: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const matches = [];
        const routes = typeof routeData === 'object' && routeData.default ? routeData.default : routeData;
        const lowerQuery = query.toLowerCase().trim();

        Object.entries(routes).forEach(([number, train]) => {
          // Check train number or name
          const matchNumber = number.includes(lowerQuery);
          const matchName = train.name.toLowerCase().includes(lowerQuery);

          // Check if any station in the route matches the query
          const matchStation = train.route.some(s =>
            s.station.toLowerCase().includes(lowerQuery) ||
            s.code.toLowerCase().includes(lowerQuery)
          );

          if (matchNumber || matchName || matchStation) {
            matches.push({
              number,
              name: train.name,
              departureTime: train.route[0].dep === "None" ? train.route[0].arr : train.route[0].dep,
              arrivalTime: train.route[train.route.length - 1].arr === "None" ? train.route[train.route.length - 1].dep : train.route[train.route.length - 1].arr,
              from: train.route[0].station,
              to: train.route[train.route.length - 1].station
            });
          }
        });

        resolve(matches);
      }, 300);
    });
  },
};

export default trainService;