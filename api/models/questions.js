const shortid = require('shortid')

const cryptr = require('../models/DBcontroller').cryptr
const db = require('../models/DBcontroller').db

exports.getQuestionSet = ({filterNull, publicFields}) => {
  let questions = db.get('questions').cloneDeep()

  if (filterNull) {
    questions = questions.filter('answer', null)
    .value()
  } else {
    questions = questions.value()
  }


  if (publicFields) {
    questions = questions.map(el => {
      return {
        id: el.id,
        text : el.text,
        date_asked : el.date_asked,
        number_of_views : el.number_of_views,
        answer : el.answer
      }
    })
  }
  return questions
}

exports.getQuestionById = (id) => {
  let question = db.get('questions')
  .find({id : id})
  .cloneDeep()
  .value()

  return question
}

exports.addQuestion = ({text, additional_details, related_question, asker_age}) => {
  let questionId = shortid.generate()

  db.get('questions')
  .push({
    id: questionId,
    text: text,
    number_of_views : 0,
    additional_details : additional_details,
    related_question : related_question,
    date_asked : Date.now(),
    asker_age : asker_age,
  })
  .write()

  let question = db.get('questions').find({ id: questionId }).value()

  return question
}

exports.increaseViews = (id) => {
  let question = db.get('questions')
  .find({id : id})
  .value()

  if (question) {
    question.number_of_views += 1
    db.write()

    return {
      id: question.id,
      text : question.text,
      date_asked : question.date_asked,
      number_of_views : question.number_of_views,
      answer : question.answer
    }
  } else {
    return null
  }
}


// THIS IS NOT GREAT FOR MULTILANGUAGE
exports.updateQuestion = ({id, text_en, text_de, additional_details, related_question, date_asked, number_of_views, asker_age}) => {
  let question = db.get('questions')
  .find( {id : id } )

  if ( question.value() ) {
    // NOTE: THIS MAY NOT BE THE BEST WAY FORWARD
    let payload = {}
    if (text_en || text_de) {
      payload["text"] = {}
      if (text_en) {
        payload["text"]["en"] = text_en
      } else if (question.value().text.en) {
        payload["text"]["en"] = question.value().text.en
      }
      if (text_de) {
        payload["text"]["de"] = text_de
      } else if (question.value().text.de) {
        payload["text"]["de"] = question.value().text.de
      }
    }
    if (additional_details) {
      payload['additional_details'] = additional_details
    }
    if (related_question) {
      payload['related_question'] = related_question
    }
    if (date_asked) {
      payload["date_asked"] = date_asked
    }
    if (number_of_views) {
      payload["number_of_views"] = number_of_views
    }
    if (asker_age) {
      payload["asker_age"] = asker_age
    }

    if (Object.keys(payload).length) {
      question.assign(payload).write()
      return question

    } else {
      return question
    }

  } else {
    return null
  }
}

exports.deleteQuestion = (id) => {
  let question = db.get('questions')
  .find({ id : id })
  .cloneDeep()
  .value()

  if (question) {
    db.get('questions')
    .remove({ id : id })
    .write()

    return "Ok"
  } else {
    return null
  }
}
