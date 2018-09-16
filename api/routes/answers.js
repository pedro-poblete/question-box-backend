const express = require('express')
const router = express.Router({mergeParams : true})

const controller = require('../controllers/answers')
const checkAuth = require('../middleware/check-auth')

// Private Route: Submit additional information / modify answer
router.put('/', checkAuth, controller.submitOrUpdateAnswer)

// Private Route: Delete Answer
router.delete('/', checkAuth, controller.deleteAnswer)

module.exports = router
