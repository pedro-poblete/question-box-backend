const questionModel = require('../models/questions')


exports.listAnsweredQuestions = (req, res, next) => {
  try {
    filteredQuestions = questionModel.getQuestionSet({
      filterNull: true,
      publicFields: true
    })

    return res.status(200).json(
      filteredQuestions
    )
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.sendNewQuestion = (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({
        error: "No question sent to the server. Please try again."
      })

    } else if (req.body.text.en || req.body.text.de) {
      let created_question = questionModel.addQuestion({
        text: req.body.text,
        additional_details: req.body.additional_details,
        related_question: req.body.related_question,
        asker_age: req.body.asker_age
      })

      return res.status(201).json(
        created_question
      )
    } else {
      return res.status(400).json({
        error: "The question sent is not in a valid language."
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


// NOTE: BE MINDFUL, THIS MEANS ANY QUESTION CAN GET THEIR DETAILS EDITED, MAYBE ADD TOKEN AUTHENTICATION? MAYBE CHECK TIME DIFFERENCE AND FAIL MODIFICATION IN MORE THAN 12 HOURS?
exports.addAdditionalDetails = (req, res, next) => {
  try {
    let updated_question = questionModel.updateQuestion({
      id: req.params.questionId,
      additional_details: req.body.additional_details,
      related_question: req.body.related_question,
      asker_age: req.body.asker_age
    })

    if (updated_question) {
      return res.status(200).json(
        updated_question
      )
    } else {
      return res.status(400).json({
        error: "Bad input, please review question id and payload"
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.updateNumberOfViews = (req, res, next) => {
  try {

    let question = questionModel.increaseViews(req.params.questionId)

    if (question) {
      return res.status(200).json(
        question
      )
    } else {
      return res.status(404).json({
        error: "Question not found."
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


// exports.subscribeEmail = (req, res, next) => {
//   try {
//
//     const question = db.get('questions')
//     .find({ id : req.params.questionId }).cloneDeep()
//     .value()
//
//     if (question) {
//       let notification_id = shortid.generate()
//
//       db.get('email_notifications')
//       .push({
//         id : notification_id,
//         question_id : question.id,
//         email : req.body.email
//       })
//       .write()
//
//       const email_notification = db.get('email_notifications')
//       .find({ id : notification_id })
//       .value()
//
//       return res.status(201).json({
//         question_id : email_notification.question_id,
//         email : cryptr.decrypt(email_notification.email)
//       })
//     }
//
//     else {
//       return res.status(404).json({
//         error: "Question not found."
//       })
//     }
//   }
//   catch (err) {
//     return res.status(500).json({
//       error: err.toString()
//     })
//   }
// }


exports.listAllQuestions = (req, res, next) => {
  try {
    allQuestions = questionModel.getQuestionSet({
      filterNull: false,
      publicFields: false
    })

    return res.status(200).json(
      allQuestions
    )
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.getSpecificQuestion = (req, res, next) => {
  try {
    const question = questionModel.getQuestionById(req.params.questionId)

    if (question) {
      return res.status(200).json(
        question
      )
    } else {
      return res.status(404).json({
        error: "Question not found."
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.modifyQuestion = (req, res, next) => {
  try {
    let text = {}
    if (req.body.text) {
      text = req.body.text
    }
    let updated_question = questionModel.updateQuestion({
      id: req.params.questionId,
      text_en: text.en,
      text_de: text.de,
      additional_details: req.body.additional_details,
      related_question: req.body.related_question,
      date_asked: req.body.date_asked,
      number_of_views: req.body.number_of_views,
      asker_age: req.body.asker_age,
    })

    if (updated_question) {
      return res.status(200).json(
        updated_question
      )
    } else {
      return res.status(400).json({
        error: "Bad input, please review question id and payload"
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

exports.deleteQuestion = (req, res, next) => {
  try {
    let question = questionModel.deleteQuestion(req.params.questionId)

    if (question === 'Ok') {
      return res.status(200).json({
        message: "Question Deleted."
      })
    } else {
      return res.status(404).json({
        message: "Question does not exists."
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

// exports.submitOrUpdateAnswer = (req, res, next) => {
//   try {
//     const question = db.get('questions')
//     .find({ id : req.params.questionId })
//     .value()
//
//     // TODO: REVIEW WHEN FINAL MODEL FOR ANSWER IS DEFINED
//     if (question) {
//       db.get('questions')
//       .find( {id : req.params.questionId} )
//       .set('answer', req.body.answer)
//       .write()
//
//       emailNotification = db.get('email_notifications')
//       .find( {question_id : question.id} )
//       .value()
//
//       // TODO: NEED TO REVIEW WHAT'S THE BEST WAY OF CONTROLLING FOR LANGUAGE. DO I ADD IT TO THE NOTIFICATIONS MODEL? DO I CALCULATE IT FROM THE LANGUAGE OF THE QUESTION OR THE LANGUAGE OF THE ANSWER?
//       // TODO: SHOULD I CREATE A DIFFERENT CONTROLLER FOR THE NOTIFICATIONS? IS IT OK TO DO IT AS A MIDDLEWARE?
//       if (emailNotification) {
//         let receiver = cryptr.decrypt(emailNotification.email)
//         let questionText
//         let lang
//         if (question.text.en) {
//           questionText = question.text.en
//           lang = 'en'
//         } else if (question.text.de) {
//           questionText = question.text.de
//           lang = 'de'
//         } else {
//           return res.status(500).json({
//             error: "Question Text Invalid. Please contact administrator."
//           })
//         }
//         try {
//           transporter.sendEmail(receiver, questionText, lang)
//           db.get('email_notifications')
//           .remove( {question_id : question.id} )
//           .write()
//           return res.status(200).json(question)
//         }
//         catch (err) {
//           return res.status(500).json({
//             error: err.toString()
//           })
//         }
//
//       } else {
//         return res.status(200).json(question)
//       }
//
//     } else {
//       return res.status(404).json({
//         error : "Question does not exists."
//       })
//     }
//   }
//   catch (err) {
//     return res.status(500).json({
//       error: err.toString()
//     })
//   }
// }
//
// exports.deleteAnswer = (req, res, next) => {
//   try {
//     const question = db.get('questions')
//     .find({ id : req.params.questionId })
//     .value()
//
//     // TODO: REVIEW WHEN FINAL MODEL FOR ANSWER IS DEFINED
//     if (question) {
//       if (question.answer) {
//         db.get('questions')
//         .find( {id : req.params.questionId} )
//         .unset('answer')
//         .write()
//
//         return res.status(200).json(
//           question
//         )
//       } else {
//         return res.status(404).json({
//           error: "Answer does not exists."
//         })
//       }
//     } else {
//       return res.status(404).json({
//         error : "Question does not exists."
//       })
//     }
//   }
//   catch (err) {
//     return res.status(500).json({
//       error: err.toString()
//     })
//   }
// }
