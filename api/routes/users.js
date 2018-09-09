const express = require('express')
const router = express.Router()

const controller = require('../controllers/users')
const emailChecks = require('../middleware/email')
const checkAuth = require('../middleware/check-auth')

// Public Route: Login. Request Body: EMAIL, PASSWORD
router.post('/login', emailChecks.encryptEmail, controller.userLogin)

// Private Route: Register Users. Request Header: TOKEN. Body: EMAIL, ROLE, PASSWORD
router.post('/register', checkAuth, emailChecks.encryptEmail, controller.userRegister)

// Private Route: Change user Data. Request Header: TOKEN. Body: EMAIL, NEW_EMAIL, NEW_PASSWORD, ROLE
router.patch('/update', checkAuth, emailChecks.encryptEmail, controller.userUpdate)

// Private Route: Delete user. Request Header: TOKEN. Body: EMAIL
router.delete('/delete', checkAuth, emailChecks.encryptEmail, controller.userDelete)

module.exports = router
