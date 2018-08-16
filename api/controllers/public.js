const Database = require('better-sqlite3')
const db = new Database('../db.sqlite3')

// exports.listAnsweredQuestions = function (lang) {
//   db.prepare(`
//     SELECT (
//       Questions.id as id,
//       Questions.text_${lang} AS text,
//       Questions.number_of_views,
//
//     )
//     FROM Questions, Answers
//     WHERE answer_id
//   `)
// }
