const webpush = require('web-push')

webpush.setVapidDetails('http://www.betnana.de', process.env.VAPIDKEY_PUBLIC, process.env.VAPIDKEY_PRIVATE)

exports.sendPushNotification = function (subscription, payload) {
  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack)
  })
}
