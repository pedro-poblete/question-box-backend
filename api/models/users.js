const bcrypt = require('bcrypt')

const shortid = require('shortid')
const cryptr = require('../models/DBcontroller').cryptr
const db = require('../models/DBcontroller').db

exports.getUser = (user_email) => {
  let userSet = db.get('users').cloneDeep()

  userSet = userSet.forEach ( (user) => {
    user.email = cryptr.decrypt(user.email)
  })
  return userSet.find( { email : cryptr.decrypt(user_email) } ).value()
}

exports.getAdministrators = () => {
  const administrators = db.get('users')
  .filter( { role : "administrator" } )
  .value()

  return administrators
}

exports.createUser = ({user_email, hash, role}) => {
  try {
    db.get('users')
    .push({
      id : shortid.generate(),
      email : user_email,
      password : hash,
      role : role
    })
    .write()

    return "Ok"
  }
  catch (err) {
    return null
  }
}

exports.userUpdate = ({id, user_email, hash, role}) => {
  try {
    let payload = {}

    if (user_email) {
      payload["email"] = cryptr.encrypt(user_email)
    }
    if (hash) {
      payload["password"] = hash
    }
    if (role) {
      payload["role"] = role
    }

    db.get("users")
    .find( { id : id } )
    .assign(payload)
    .write()

    return "Ok"
  }

  catch (err) {
    return null
  }
}

exports.deleteUser = (id) => {
  try {
    db.get("users")
    .remove( { id : id } )
    .write()

    return "Ok"
  }
  catch (err) {
    return null
  }
}
