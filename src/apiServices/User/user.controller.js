/** Dto */
const userDto = require("./user.dto");
const { DecryptPassword, EncryptPassword } = require("../../utils/cryptojs");
const { GenerateToken } = require("../../utils/jwt");

exports.login = (req, res, next) => {
  userDto.login({ username: req.body.username }, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    if (!data.length) {
      return res.status(404).json({
        error: "username or password are incorrect",
      });
    }

    let pass = DecryptPassword(data[0].password);

    if (req.body.password !== pass) {
      return res.status(400).json({
        info: "username or password are incorrect",
      });
    }

    let token = GenerateToken(data[0]);
    res.status(200).json({
      auth: true,
      token: token,
    });
  });
};

exports.getAll = (req, res, next) => {
  userDto.getAll({}, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.status(200).json({
      info: data,
    });
  });
};

exports.deleteUser = () => {
  userDto.delete({ _id: req.body.id }, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.status(204).json();
  });
};

exports.createAdmin = (req, res, next) => {
  const { name, lastname, username, password } = req.body;
  if (!password) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }
  const user = {
    name,
    lastname,
    username,
    password: EncryptPassword(password),
    role: 3,
  };

  userDto.create(user, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    res.status(201).json({
      message: "admin user created",
      info: {
        username: data.username,
      },
    });
  });
};
