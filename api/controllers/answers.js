const cryptr = require('../models/DBcontroller').cryptr

const notificationsModel = require('../models/notifications')
const answerModel = require('../models/answers')

transporter = require('../../notifications/email')
pusher = require('../../notifications/push')

exports.submitOrUpdateAnswer = (req, res, next) => {
  try {
    const questionAnswered = answerModel.submitOrUpdateAnswer({
      question_id : req.params.questionId,
      answer : req.body.answer
    })

    // TODO: REVIEW WHEN FINAL MODEL FOR ANSWER IS DEFINED
    if (questionAnswered) {

      let emailNotification = notificationsModel.getEmailNotificationByQuestion(questionAnswered.id)

      let pushNotification = notificationsModel.getPushNotificationByQuestion(questionAnswered.id)

      if (emailNotification) {
        let receiver = cryptr.decrypt(emailNotification.email)
        let questionText
        let lang
        if (questionAnswered.text.en) {
          questionText = questionAnswered.text.en
          lang = 'en'
        } else if (questionAnswered.text.de) {
          questionText = questionAnswered.text.de
          lang = 'de'
        } else {
          return res.status(500).json({
            error: "Question Text Invalid. Please contact administrator."
          })
        }
        try {
          transporter.sendEmail(receiver, questionText, lang)
          let deleteNotification = notificationsModel.deleteEmailNotification(emailNotification.id)
          if (deleteNotification) {
            return res.status(200).json(questionAnswered)
          } else {
            return res.status(500).json({
              err : "Something went wrong when deleting the notification"
            })
          }
        }
        catch (err) {
          return res.status(500).json({
            error: err.toString()
          })
        }

      }

      if (pushNotification) {
        const subscription = pushNotification.subscription
        let payload = {}

        if (questionAnswered.text.en) {
          payload["title"] = "Your question has been answered"
          payload["body"] = "Click here to see the answer"
        } else if (questionAnswered.text.de) {
          payload["title"] = "Ihre Frage wurde beantwortet"
          payload["body"] = "Klicken Sie hier, um die Antwort zu sehen"
        }

        payload = JSON.stringify(payload)

        try {
          pusher.sendPushNotification(subscription, payload)
          let deletePushNotification = notificationsModel.deletePushNotification(pushNotification.id)
          if (deletePushNotification) {
            return res.status(200).json(questionAnswered)
          } else {
            return res.status(500).json({
              err : "Something went wrong when deleting the notification"
            })
          }
        }
        catch (err) {
          return res.status(500).json({
            error: err.toString()
          })
        }
      }

      if (!(pushNotification) && !(emailNotification)) {
        return res.status(200).json(questionAnswered)
      }

    } else {
      return res.status(404).json({
        error : "Question does not exists."
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

exports.deleteAnswer = (req, res, next) => {
  try {
    const question = answerModel.deleteAnswer(req.params.questionId)

    if (question) {
      return res.status(200).json(
        question
      )
    } else {
      return res.status(404).json({
        error: "Answer or question does not exists"
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}
