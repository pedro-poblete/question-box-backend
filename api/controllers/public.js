const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json',
// {
//   serialize: (email) => encrypt(JSON.strinfigy(email))
//   deserialize: (email) => JSON.parse(decrypt(email))
// }
)
const db = low(adapter)
const shortid = require('shortid')

exports.listAnsweredQuestions = (req, res, next) => {
  try {
    const answered_questions = db.get('questions').filter('answer', null).value()
    res.status(200).json(
      answered_questions
    )
  }
  catch (err) {
    res.status(500).json({
      error: err.toString()
    })
  }
}

exports.sendNewQuestion = (req, res, next) => {
  try {
    if (!req.body.text) {
      res.status(400).json({
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
          asker_age: req.body.asker_age,
        })
        .write()

        let created_question = db.get('questions').find({ id: question_id }).value()
        res.status(201).json(
          created_question
        )

    } else {
      res.status(400).json({
        error: "The question sent is not in a valid language."
      })
    }
  }

  catch (err) {
    res.status(500).json({
      error: err.toString()
    })
  }
}

exports.getSpecificQuestion = (req, res, next) => {
  try {
    const question = db.get('questions')
      .find({ id : req.params.questionId })
      .value()

    if (question) {
      res.status(200).json(
        question
      )
    }
    else {
      res.status(404).json({
        error: "Question not found."
      })
    }
  }
  catch (err) {
    res.status(500).json({
      error: err.toString()
    })
  }
}

// NOTE: BE MINDFUL, THIS MEANS ANY QUESTION CAN GET THEIR DETAILS EDITED, MAYBE ADD TOKEN AUTHENTICATION? MAYBE CHECK TIME DIFFERENCE AND FAIL MODIFICATION IN MORE THAN 12 HOURS?
exports.addAdditionalDetails = (req, res, next) => {
  try {
    let payload = {
    }

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

    const question = db.get('questions')
      .find({ id : req.params.questionId })
      .assign(payload)
      .write()

      res.status(200).json(
        question
      )
  }
  catch (err) {
    res.status(500).json({
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

      res.status(200).json(
        question
      )

    } else {
      res.status(404).json({
        error: "Question not found."
      })
    }
  }
  catch (err) {
    res.status(500).json({
      error: err.toString()
    })
  }
}
