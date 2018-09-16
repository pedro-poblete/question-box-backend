const questionModel = require('../models/questions')
const notificationsModel = require('../models/notifications')

exports.subscribeEmail = (req, res, next) => {
  try {
    const question = questionModel.getQuestionById(req.params.questionId)

    if (question) {
      const notification = notificationsModel.registerEmailNotification({
        question_id : req.params.questionId,
        email : req.body.email
      })

      return res.status(201).json({
        question_id : notification.question_id,
        email : notification.email
      })

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
