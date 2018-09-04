const assert = require('assert')

exports.validateAskedQuestion = function(question) {
  try {
    assert(question.id)
    assert(question.text.en || question.text.de)
  }
  catch(err) {
    return false
  }
}

exports.validateRegisteredQuestion = function(question) {
  try {

  }
}
