const shortid = require('shortid')
const cryptr = require('../models/DBcontroller').cryptr
const db = require('../models/DBcontroller').db


exports.submitOrUpdateAnswer = ({question_id, answer}) => {
  const question = db.get('questions')
  .find( {id : question_id} )

  if (question.value()) {
    question.set('answer', answer)
    .write()

    return question.value()
  } else {
    return null
  }
}

exports.deleteAnswer = (question_id) => {
  const question = db.get('questions')
  .find({ id : question_id })
  .value()

  if (question) {
    if (question.answer) {
      db.get('questions')
      .find( {id : question_id} )
      .unset('answer')
      .write()

      return question

    } else {
      return null
    }
  } else {
    return null
  }
}
