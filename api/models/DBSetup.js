const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

exports.initialize = function() {
  if ( db.has('questions').value() ) {
    console.log("Database has data, no need to initialize it")
  } else {
    let testState = require('../../demoData.json')
    db.setState(testState).write()
    console.log("Database Initialized with Demo Data")
  }
}
