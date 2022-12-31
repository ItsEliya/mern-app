const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordinatesByAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

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
    userPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(new HttpError("Something went wrong, could not find places.", 500));
  }

  if (!userPlaces || userPlaces.places.length === 0) {
    return next(new HttpError("Could not find a place for the provided user id", 404));
  }
  res.json({places: userPlaces.places});
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalild inputs, please check the data you provided", 422));
  }
  const { title, description, address } = req.body;
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
    image: req.file.path,
    creator: req.userData.userId
  })

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Could not create place. Please try again", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find a user with the provided id.", 404));
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newPlace.save({ session });
    user.places.push(newPlace);
    await user.save({ session });
    await session.commitTransaction(); 
  } catch (error) {
    return next(new HttpError("Could not create place. Please try again", 500));
  }
  res.status(201).json({ place: newPlace });
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalild inputs, please check the data you provided", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Could not update place, please try again later.", 500));
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place.", 401));
  }

  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("Could not update place, please try again later.", 500));
  }
  res.status(200).json({ message: "Place updated" });
}

const deletePlace = async (req, res, next) => {
  let place;
  try {
    place = await Place.findById(req.params.pid).populate("creator");
  } catch (error) {
    return next(new HttpError("Could not deleted place.", 500));
  }
  if (!place) {
    return next(new HttpError("Could not find a place with the provided id.", 404));
  }

  if (req.userData.userId !== place.creator.id) {
    return next(new HttpError("You are not allowed to delete this place.", 401));
  }
  const imagePath = place.image;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError("Could not deleted place.", 500));
  }
  fs.unlink(imagePath, err => {
    console.log(err);
  });
  res.status(200).json({ message: "Deleted Place" });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;