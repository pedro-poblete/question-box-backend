const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const cryptr = require('../models/DBcontroller').cryptr

const usersModel = require('../models/users')

exports.userLogin = (req, res, next) => {
  try {
    if (!req.body.password) {
      return res.status(401).json({
        error: "Bad input, please correct the information and try again."
      })
    }

    const user = usersModel.getUser(req.body.email)

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


exports.userRegister = (req, res, next) => {
  try {
    if ( !(req.userData.role==='administrator') ) {
      return res.status(403).json({
        error: "User does not have the right permissions."
      })
    }

    if (!req.body.password || !req.body.email) {
      return res.status(400).json({
        error: "Bad input, please send both email and password."
      })
    }

    const user = usersModel.getUser(req.body.email)

    if ( user ) {
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
          createdUser = usersModel.createUser({
            user_email : req.body.email,
            hash : hash,
            role : req.body.role
          })

          if (createdUser) {
            return res.status(201).json({
              message: "User created."
            })
          } else {
            return res.status(500).json({
              error: "Couldn't create user, please try again later or contact the administrator"
            })
          }
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


exports.userUpdate = (req, res, next) => {
  try {

    // TODO: MOVE TO A FUNCTION?
    if (!( req.userData.email === cryptr.decrypt(req.body.email) || req.userData.role==='administrator' )) {
      return res.status(403).json({
        error: "User does not have the right permissions."
      })
    }

    const user = usersModel.getUser(req.body.email)

    if ( user ) {

      if (req.body.role) {
        if ( !(req.body.role === 'administrator') && user.role === 'administrator' ) {
          if (usersModel.getAdministrators().length <= 1) {
            return res.status(403).json({
              error : "Cannot change role. At least one administrator must remain in the system."
            })
          }
        }
      }

      let hash
      if (req.body.password) {
        hash = bcrypt.hashSync(req.body.password, 10)
      }

      let userModified = usersModel.userUpdate({
        id : user.id,
        user_email: req.body.new_email,
        hash : hash,
        role : req.body.role
      })

      if (userModified) {
        return res.status(200).json({
          message: "User updated."
        })
      } else {
        return res.status(500).json({
          error : "Couldn't update user. Please check with administrator"
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


exports.userDelete = (req, res, next) => {
  try {

    if (!( req.userData.email === cryptr.decrypt(req.body.email) || req.userData.role==='administrator' )) {
      return res.status(403).json({
        error: "User does not have the right permissions."
      })
    }

    const user = usersModel.getUser(req.body.email)

    if (user) {

      // TODO: MOVE TO A FUNCTION?
      if (user.role === 'administrator' && usersModel.getAdministrators().length <= 1) {
        return res.status(403).json({
          error : "Cannot delete user. At least one administrator must remain in the system."
        })
      }

      let deleteUser = usersModel.deleteUser(user.id)

      if (deleteUser) {
        return res.status(200).json({
          message: "User deleted."
        })
      } else {
        return res.status(500).json({
          error: "Couldn't delete user, please contact administrator"
        })
      }
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
