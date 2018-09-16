express = require('express')
const router = express.Router({mergeParams : true})

const controller = require('../controllers/notifications')
const emailChecks = require('../middleware/email')


// Public Route: Subscribe email for notifications
router.post('/', emailChecks.encryptEmail, controller.subscribeEmail)

module.exports = router
