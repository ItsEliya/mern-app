const express = require("express");
const HttpError = require("../models/http-error");
const router = express.Router();


const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire state building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://newyorkyimby.com/wp-content/uploads/2020/09/DSCN0762-260x347.jpg',
    address: '20 W 34th St., New York, NY 10001, United States',
    location: {
      lat: 40.7484405,
      lng: -73.9878531
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire state building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://newyorkyimby.com/wp-content/uploads/2020/09/DSCN0762-260x347.jpg',
    address: '20 W 34th St., New York, NY 10001, United States',
    location: {
      lat: 40.7484405,
      lng: -73.9878531
    },
    creator: 'u2'
  }
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }
  res.json({ place });
})
router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const userPlaces = [];
  DUMMY_PLACES.forEach(place => {
    if (place.creator === userId) {
      userPlaces.push(place);
    }
  });
  if (userPlaces.length === 0) {
    return next(new HttpError("Could not find a place for the provided user id", 404));
  }
  res.json(userPlaces);
})
module.exports = router;