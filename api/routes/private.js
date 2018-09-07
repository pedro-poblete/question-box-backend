const express = require('express')
const router = express.Router()

// GET, POST, PUT, PATCH, DELETE FOR SPECIFIC ANSWER
router.get('/:questionId/answer', (req, res, next) => {
  let response_body = {message: "Route for getting the specific details of the answer to that question" }
  res.status(200).json(response_body)
})

router.post('/:questionId/answer', (req, res, next) => {
  let response_body = {message: "Create a new answer to the specific question" }
  res.status(200).json(response_body)
})

router.put('/:questionId/answer', (req, res, next) => {
  let response_body = {message: "For creating and/or replacing an answer" }
  res.status(200).json(response_body)
})

router.patch('/:questionId/answer', (req, res, next) => {
  let response_body = {message: "For updating a previous answer" }
  res.status(200).json(response_body)
})

router.delete('/:questionId/answer', (req, res, next) => {
  let response_body = {message: "For deleting a previous answer" }
  res.status(200).json(response_body)
})

// PATHS FOR MEDIA ASSOCIATED WITH EACH ANSWER

router.get('/:questionId/answer/media', (req, res, next) => {
  let response_body = {message: "List all media associated with that answer" }
  res.status(200).json(response_body)
})

router.post('/:questionId/answer/media', (req, res, next) => {
  let response_body = {message: "Create new media for that answer" }
  res.status(200).json(response_body)
})

// PATHS FOR DEALING WITH SPECIFIC MEDIA

router.get('/:questionId/answer/media/:mediaId', (req, res, next) => {
  let response_body = {message: "See the specific media details" }
  res.status(200).json(response_body)
})

router.patch('/:questionId/answer/media/:mediaId', (req, res, next) => {
  let response_body = {message: "change that specific media details" }
  res.status(200).json(response_body)
})

router.delete('/:questionId/answer/media/:mediaId', (req, res, next) => {
  let response_body = {message: "delete that media" }
  res.status(200).json(response_body)
})


module.exports = router