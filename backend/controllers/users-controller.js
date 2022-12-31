const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const User = require("../models/user");


const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Failed to fetch users, please try again later.", 500));
  }
  res.json({ users });
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalild inputs, please check the data you provided", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Could not Sign up, Please try again later.", 500));
  }

  if (existingUser) {
    return next(new HttpError("A user with the given email address is already exist!", 422));
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: []
  });
  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Could not Sign up, Please try again later."), 500);
  }
  res.status(201).json({ user: newUser });
}

const login = async (req, res, next) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Could not login, Please try again later.", 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Login failed: Wrong email or password.", 401));
  }
  res.json({ user: existingUser });
}

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;