const express = require('express')
const router = express.Router()

const controller = require('../controllers/questions')
const emailChecks = require('../middleware/email')

// Public Route: Lists all answered questions
router.get('/', controller.listAnsweredQuestions)

// Public Route: Send New Question
router.post('/', controller.sendNewQuestion)

// Public Route: Get details by Question Id
router.get('/:questionId', controller.getSpecificQuestion)

// Public Route: Add additional details to question
router.patch('/:questionId', controller.addAdditionalDetails)

// Public Route: Update Question Number of Views
router.patch('/:questionId/update_views', controller.updateNumberOfViews)

// Subscribe email for notifications
router.post('/:questionId/subscribe_email', emailChecks.encryptEmail, controller.subscribeEmail)

module.exports = router
