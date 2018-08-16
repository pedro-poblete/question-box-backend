const express = require('express')
const router = express.Router()

// Public Routes
router.get('/', (req, res, next) => {
  let acceptedLanguage = req.headers["accept-language"]

  if (req.query.search) {
    let search = req.query.search
  }

  let response_body = {message: "Route for getting Questions and Answers, with Search and Language filters" }
  res.status(200).json(response_body)
})

// MAY NOT EVEN BE NECESSARY
router.get('/:questionId', (req, res, next) => {
  let acceptedLanguage = req.headers["accept-language"]

  res.status(200).json({
    message: `Received question id #${req.params.questionId}`
  })
})


module.exports = router
