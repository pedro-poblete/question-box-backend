const assert = require('assert')


// TODO: THIS CAN BE USED TO CHECK WHETHER THE REQUEST IS GOOD OR NOT. RIGHT NOW NOT BEING USED
// exports.validateAskedQuestion = (req, res, next) => {
//   if (!req.body.text) {
//     res.status(400).json({
//       error: "No question sent to the server. Please try again."
//     })
//   }
//   else if (!req.body.text.en || !req.body.text.de) {
//     res.status(400).json({
//       error: "The question sent is not in a valid language."
//     })
//   }
//   else {
//     try {
//       next()
//     }
//   }
// }



// TODO: SHOULD I WRITE TESTS?
