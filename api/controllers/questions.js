const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTRKEY)

const adapter = new FileSync(process.env.LOWDBFILE)
const db = low(adapter)
const shortid = require('shortid')

function publicFields(questionSet) {
  let output = questionSet.map(el => {
    return {
      id: el.id,
      text : el.text,
      date_asked : el.date_asked,
      number_of_views : el.number_of_views,
      answer : el.answer
    }
  })
  return output
}

exports.listAnsweredQuestions = (req, res, next) => {
  try {
    const answered_questions = db.get('questions').cloneDeep()
    .filter('answer', null)
    .value()

    const filteredQuestions = publicFields(answered_questions)

    return res.status(200).json(
      filteredQuestions
    )
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

// TODO: MOVE VALIDATION LOGIC TO ../models/validation.js
exports.sendNewQuestion = (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({
        error: "No question sent to the server. Please try again."
      })

    } else if (req.body.text.en || req.body.text.de) {
      let question_id = shortid.generate()

      const createdQuestion = db
      .get('questions')
      .push({
        id: question_id,
        text: req.body.text,
        number_of_views: 0,
        additional_details: req.body.additional_details,
        related_question: req.body.related_question,
        date: Date.now(),
        asker_age: req.body.asker_age
      })
      .write()

      let created_question = db.get('questions').find({ id: question_id }).value()

      return res.status(201).json(
        created_question
      )

    } else {
      return res.status(400).json({
        error: "The question sent is not in a valid language."
      })
    }
  }

  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

exports.getSpecificQuestion = (req, res, next) => {
  try {
    const question = db.get('questions')
    .find({ id : req.params.questionId }).cloneDeep()
    .value()

    if (question) {
      return res.status(200).json({
        id : question.id,
        text : question.text,
        date_asked : question.date_asked,
        number_of_views : question.number_of_views,
        answer : question.answer,
        media : question.media
      }
      )
    }
    else {
      return res.status(404).json({
        error: "Question not found."
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

// NOTE: BE MINDFUL, THIS MEANS ANY QUESTION CAN GET THEIR DETAILS EDITED, MAYBE ADD TOKEN AUTHENTICATION? MAYBE CHECK TIME DIFFERENCE AND FAIL MODIFICATION IN MORE THAN 12 HOURS?
exports.addAdditionalDetails = (req, res, next) => {
  try {
    let payload = {}

    if (req.body.additional_details) {
      payload["additional_details"] = req.body.additional_details
    }
    // NOTE: MORE INFORMATION IS NEEDED HERE TO THINK OF THE BEST WAY TO RELATE QUESTIONS. HOW ARE THEY CONNECTED IN USE? FATHER-CHILD STRUCTURE? IS THE RELATIONSHIP COMMUTATIVE? IS THE NAIVE REPRESENTATION IMPLEMENTED HERE THE BEST ONE?
    if (req.body.related_question) {
      payload["related_question"] = req.body.related_question
    }
    if (req.body.asker_age) {
      payload["asker_age"] = req.body.asker_age
    }

    if (Object.keys(payload).length) {

      const question = db.get('questions')
      .find({ id : req.params.questionId })
      .assign(payload)
      .write()

      return res.status(200).json(
        question
      )
    } else {
      return res.status(400).json({
        error : "Empty payload. No changes submitted."
      })
    }
  }

  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

exports.updateNumberOfViews = (req, res, next) => {
  try {
    const question = db.get('questions')
    .find({ id : req.params.questionId })
    .value()

    if (question) {
      question.number_of_views += 1
      db.write()

      return res.status(200).json(
        publicFields(question)
      )

    } else {
      return res.status(404).json({
        error: "Question not found."
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

exports.subscribeEmail = (req, res, next) => {
  try {

    const question = db.get('questions')
    .find({ id : req.params.questionId }).cloneDeep()
    .value()

    if (question) {
      let notification_id = shortid.generate()

      db.get('email_notifications')
      .push({
        id : notification_id,
        question_id : question.id,
        email : req.body.email
      })
      .write()

      const email_notification = db.get('email_notifications')
      .find({ id : notification_id })
      .value()

      return res.status(201).json({
        question_id : email_notification.question_id,
        email : cryptr.decrypt(email_notification.email)
      })
    }

    else {
      return res.status(404).json({
        error: "Question not found."
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}
