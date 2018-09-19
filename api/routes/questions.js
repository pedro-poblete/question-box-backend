const express = require('express')
const router = express.Router()

const controller = require('../controllers/questions')
const emailChecks = require('../middleware/email')
const checkAuth = require('../middleware/check-auth')

const notificationsRoutes =  require('./notifications')
const answersRoutes = require('./answers')


// Public Route: Lists all answered questions
router.get('/', controller.listAnsweredQuestions)

// Public Route: Send New Question
router.post('/', controller.sendNewQuestion)

// Public Route: Add additional details to question
router.patch('/:questionId', controller.addAdditionalDetails)

// Public Route: Update Question Number of Views
router.patch('/:questionId/update_views', controller.updateNumberOfViews)

// Private Route: Get all questions (even unanswered ones) with all their associated information
router.get('/all', checkAuth, controller.listAllQuestions)

// Private Route: Get details by Question Id
router.get('/:questionId', checkAuth, controller.getSpecificQuestion)

// Private Route: Modify question details REVIEW: MAYBE CHANGE PATH, ITS A BIT CONFUSING
router.patch('/:questionId/modify', checkAuth, controller.modifyQuestion)

// Private Route: Delete Question
router.delete('/:questionId/', checkAuth, controller.deleteQuestion)

// Private Route: Submit additional information / modify answer
router.use('/:questionId/answer', answersRoutes)

// Public Route: Subscribe email for notifications
router.use('/:questionId/subscribe', notificationsRoutes)

module.exports = router
