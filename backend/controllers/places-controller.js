const { validationResult } = require("express-validator");
const {v4: uuid} = require("uuid");
const HttpError = require("../models/http-error");
const getCoordinatesByAddress = require("../util/location");
let DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }
  res.json({ place });
}

const getPlacesByUserId = (req, res, next) => {
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
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalild inputs, please check the data you provided", 422)); 
  }
  const { title, description, address, creator} = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesByAddress(address);
  } catch(error) {  
    return next(error);
  }
  const newPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };
  DUMMY_PLACES.push(newPlace);
  res.status(201).json({place: newPlace});
}

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalild inputs, please check the data you provided", 422); 
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)};
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
}

const deletePlace = (req, res, next) => {
  if (!DUMMY_PLACES.find(place => place.id === req.params.id)) {
    throw new HttpError("Could not find a place with the given id", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== req.params.pid);
  res.status(200).json({ message: "Place Deleted."});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;