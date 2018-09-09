const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTRKEY)

let adapter
if (process.env.NODE_ENV !== 'test') {
  adapter = new FileSync(process.env.LOWDBFILE)
} else {
  adapter = new FileSync('db_test.json')
}

const db = low(adapter)
const shortid = require('shortid')

exports.db = db
exports.cryptr = cryptr

exports.initialize = function() {
  if ( db.has('questions').value() ) {
    console.log("Database has data, no need to initialize it.")
  } else {
    let emptyState = require('../../db_schema.json')
    db.setState(emptyState).write()
    console.log("Database Initialized.")
  }
}

exports.checkAdmins = function() {
  if (db.get('users').filter({role : "administrator"}).value().length < 1) {
    console.log("No administrator found.")
    let hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
    db.get('users')
    .push({
      id : shortid.generate(),
      role : "administrator",
      email: cryptr.encrypt(process.env.ADMIN_EMAIL),
      password: hash
    })
    .write()
    console.log("Default administrator created using enviroment variables.")
  } else {
    console.log("Administrator present. No default admin created.")
  }
}
