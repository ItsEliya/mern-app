const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user, please try again later.", 500));
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });
  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Could not Sign up, Please try again later."), 500);
  }
  let token;
  try {
    token = jwt.sign({ userId: newUser.id, email: newUser.email}, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    return next(new HttpError("Could not Sign up, Please try again later."), 500);
  }

  res.status(201).json({ userId: newUser.id, email: newUser.email, token });
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

  if (!existingUser) {
    return next(new HttpError("Login failed: Wrong email or password.", 403));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Could not login, please try again later.", 500));
  }
  if (!isValidPassword) {
    return next(new HttpError("Login failed: Wrong email or password.", 403));
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email}, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    return next(new HttpError("Could not Sign up, Please try again later."), 500);
  }
  res.json({ userId: existingUser.id, email: existingUser.email, token });
}

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;