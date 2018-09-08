const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTRKEY)

// if (config.util.getEnv('NODE_ENV') !== 'test') {
  const adapter = new FileSync(process.env.LOWDBFILE)
// } else {
//   const adapter = new FileSync('db_test.json')
// }

const db = low(adapter)
const shortid = require('shortid')

exports.initialize = function() {
  if ( db.has('questions').value() ) {
    console.log("Database has data, no need to initialize it.")
  } else {
    let emptyState = require('../../db_schema.json')
    db.setState(emptyState).write()
    console.log("Database Initialized.")
  }
  if (db.get('users').filter({role : "administrator"}).value().length < 0) {
    console.log("No administrator found. Default administrator created using enviroment variables.")
    bcrypt.hash(process.env.ADMIN_PASSWORD, 10, (err, hash) => {
      if (err) {
        throw err
      } else {
        db.get('users')
        .push({
          id : shortid.generate(),
          role : "administrator",
          email: cryptr.encrypt(process.env.ADMIN_EMAIL),
          password: hash
        })
        .write()
      }
    })
  }
}
