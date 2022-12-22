const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const getCoordinatesByAddress = require("../util/location");
const Place = require("../models/place");
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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Could not find place", 500));
  }
  if (!place) {
    return next(new HttpError("Could not find a place for the provided id", 404));
  }
  res.json({ place });
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userPlaces = [];
  try {
    userPlaces = await Place.find({ creator: userId });
  } catch (error) {
    return next(new HttpError("Something went wrong, could not find places.", 500));
  }

  if (!userPlaces || userPlaces.length === 0) {
    return next(new HttpError("Could not find a place for the provided user id", 404));
  }
  res.json(userPlaces);
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalild inputs, please check the data you provided", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesByAddress(address);
  } catch (error) {
    return next(error);
  }

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/640px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    creator
  })
  try {
    await newPlace.save();
  } catch (error) {
    return next(new HttpError("Could not create place. Please try again", 500));
  }
  res.status(201).json({ place: newPlace });
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalild inputs, please check the data you provided", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let result;
  try {
    result = await Place.findByIdAndUpdate(placeId, { title, description });
  } catch (error) {
    return next(new HttpError("Cannot update place, Please try again later.", 500));
  }
  res.status(200).json({ message: "Place updated" });
}

const deletePlace = async (req, res, next) => {
  let result;
  try {
    result = await Place.findByIdAndDelete(req.params.pid);
  } catch (error) {
    return next(new HttpError("Could not deleted place.", 500));
  }
  if (!result) {
    return next(new HttpError("Error: Could not find a place with the given id", 422));
  }
  res.status(200).json({ result });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;