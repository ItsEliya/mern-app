const axios = require("axios");
const HttpError = require("../models/http-error");
const API_KEY = "AIzaSyAoS1LpaZtctrRxSzUZLELxNJpxiFSmo8g";

async function getCoordinatesByAddress(address) {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError("Could not find location for the given address", 422);
  }

  return data.results[0].geometry.location; //return the coordinates found.
}

module.exports = getCoordinatesByAddress;