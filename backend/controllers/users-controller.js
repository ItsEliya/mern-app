const {v4: uuid} = require("uuid");
const HttpError = require("../models/http-error");
const DUMMY_USERS = [
  {
    id: "u1",
    name: "Eliya Noah",
    email: "eliyanoah70@gmail.com",
    password: "Aa123456"
  }
]

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
}

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  if (DUMMY_USERS.find(user => user.email === email)) {
    throw new HttpError("Error: A user with the given email is already exist", 422);
  }
  const newUser = {
    id: uuid(),
    name,
    email,
    password
  };
  DUMMY_USERS.push(newUser);
  res.status(201).json({ user: newUser });
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find(user => user.email === email);
  if (!user || user.password !== password) {
    throw new HttpError("Error: Email or password are wrong.", 401);
  }
  
  res.json({ message: "Logged In" });
}

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;