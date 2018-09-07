const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// EMAIL VALIDATOR
var validator = require('validator')

// ENCRYPTION - PASSWORD AND EMAIL
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTRKEY)

// JWT
const jwt = require('jsonwebtoken')

// DB
const adapter = new FileSync('db.json')
const db = low(adapter)
const shortid = require('shortid')

// FUNCTIONS
function getUser(userSet, email) {
  return userSet.forEach ( (user) => {
    user.email = cryptr.decrypt(user.email)
  })
  .find({ email : cryptr.decrypt(email)})
  .value()
}

exports.userSignup = (req, res, next) => {
  try {
    if ( !(req.userData.role==='administrator') ) {
      return res.status(403).json({
        error: "User does not have the right permissions."
      })
    }

    if (!req.body.password) {
      return res.status(400).json({
        error: "Bad input, please send both email and password."
      })
    }

    const users = db.get('users').cloneDeep()

    if ( getUser(users, req.body.email) ) {
      return res.status(409).json({
        error: "User already exists."
      })
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          })
        } else {
          db.get('users')
          .push({
            id : shortid.generate(),
            email: req.body.email,
            password: hash,
            role: req.body.role
          })
          .write()

          return res.status(201).json({
            message: "User created."
          })
        }
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

exports.userLogin = (req, res, next) => {
  try {
    if (!req.body.password) {
      return res.status(401).json({
        error: "Bad input, please correct the information and try again."
      })
    }

    const users = db.get('users').cloneDeep()
    const user = getUser(users, req.body.email)

    if ( user ) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            error: "Authentication Failed."
          })
        }

        if (result) {
          const token = jwt.sign(
            { email : user.email,
              role : user.role
            },
            process.env.JWT_KEY,
            {
              expiresIn: "12h"
            }
          )
          return res.status(200).json({
            token : token
          })
        } else {
          return res.status(401).json({
            error: "Authentication Failed."
          })
        }
      })
    } else {
      return res.status(401).json({
        error: "Authentication Failed."
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.userDelete = (req, res, next) => {
  try {

    if (!( req.userData.email === cryptr.decrypt(req.body.email) || req.userData.role==='administrator' )) {
      return res.status(403).json({
        error: "User does not have the right permissions."
      })
    }

    const users = db.get('users').cloneDeep()
    var user = getUser(users, req.body.email)

    if (user) {

      // TODO: MOVE TO A FUNCTION?
      if (user.role === 'administrator' && db.get('users').filter({role : "administrator"}).value().length <= 1) {
        return res.status(403).json({
          error : "Cannot delete user. At least one administrator must remain in the system."
        })
      }

      db.get('users').remove({ id : user.id }).write()

      return res.status(200).json({
        message: "User deleted."
      })
    } else {
      return res.status(404).json({
        message: "User does not exists."
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.userUpdate = (req, res, next) => {
  try {

    // TODO: MOVE TO A FUNCTION?
    if (!( req.userData.email === cryptr.decrypt(req.body.email) || req.userData.role==='administrator' )) {
      return res.status(403).json({
        error: "User does not have the right permissions."
      })
    }

    const users = db.get('users').cloneDeep()
    const user = getUser(users, req.body.email)

    if ( user ) {
      let payload = {}

      if (req.body.password) {
        bcrypt.hash(req.body.new_password, 10, (err, hash) => {
          console.log(err)
          console.log(hash)
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            payload["password"] = hash
          }
        })
      }

      if (req.body.new_email) {
        payload["email"] = cryptr.encrypt(req.body.new_email)
      }

      if (req.body.role) {
        if ( !(req.body.role === 'administrator') && user.role === 'administrator' ) {
          if (db.get('users').filter({role : "administrator"}).value().length <= 1) {
            return res.status(403).json({
              error : "Cannot change role. At least one administrator must remain in the system."
            })
          }
        }
        payload["role"] = req.body.role
      }

      if (Object.keys(payload).length) {
        db.get('users')
        .find({ id : user.id })
        .assign(payload)
        .write()

        return res.status(200).json({
          message: "User updated."
        })
      } else {
        return res.status(400).json({
          error : "Empty payload. No changes submitted."
        })
      }
    } else {
      return res.status(404).json({
        error: "User does not exists."
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}
