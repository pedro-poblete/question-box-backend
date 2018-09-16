const shortid = require('shortid')
const cryptr = require('../models/DBcontroller').cryptr
const db = require('../models/DBcontroller').db

exports.registerEmailNotification = ({question_id, email}) => {
  let notification_id = shortid.generate()

  db.get('email_notifications')
  .push({
    id : notification_id,
    question_id : question_id,
    email : email
  })
  .write()

  let email_notification = db.get('email_notifications')
  .find({ id : notification_id }).cloneDeep()
  .value()

  return {
    question_id : email_notification.question_id,
    email : cryptr.decrypt(email_notification.email)
  }

}


exports.getEmailNotificationByQuestion = (question_id) => {
  const notification = db.get('email_notifications')
  .find({question_id : question_id})
  .value()


  return notification
}


exports.deleteEmailNotification = (id) => {
  db.get('email_notifications')
  .remove( {id : id} )
  .write()

    return "Ok"
}
