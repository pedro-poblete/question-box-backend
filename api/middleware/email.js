const validator = require('validator');

const cryptr = require('../models/DBcontroller').cryptr

exports.encryptEmail = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({
      error: "Email not included."
    })
  }
  else if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({
      error: "Invalid email."
    })
  }
  req.body.email = cryptr.encrypt(req.body.email)
  next()
}
