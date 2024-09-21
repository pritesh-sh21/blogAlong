const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = userDoc && bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({ id: userDoc._id, username });
    });
  } else {
    res.status(404).json("wrong credentials");
  }
};

exports.profile = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, decodedInfo) => {
    if (err) throw err;
    res.json(decodedInfo);
  });
};

exports.logout = (req, res) => {
  res.cookie("token", "").json("ok");
};
