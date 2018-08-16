const Database = require('better-sqlite3')
const db = new Database('db.sqlite3')

exports.createSchema = function() {
  return db.exec(`
    CREATE TABLE IF NOT EXISTS "Questions" (
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
      "text_en"	TEXT,
      "text_de"	TEXT,
      "additional_details"	TEXT,
      "age_of_asker"	INTEGER,
      "date_asked"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "number_of_views"	INTEGER NOT NULL DEFAULT 0,
      "related_question"	INTEGER,
      FOREIGN KEY("related_question") REFERENCES "Questions"("id")
    );
    CREATE TABLE IF NOT EXISTS "Answers" (
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
      "question_id"	INTEGER,
      "date_answered"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "short_answer_en"	TEXT,
      "short_answer_de"	TEXT,
      "long_answer_en"	TEXT,
      "long_answer_de"	TEXT
    );
    CREATE TABLE IF NOT EXISTS "Media" (
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
      "answer_id"	INTEGER,
      "is_media_nsfw"	INTEGER,
      "media_html_embed"	INTEGER,
      FOREIGN KEY("answer_id") REFERENCES "Answers"("id")
    );
    CREATE TABLE IF NOT EXISTS "Notifications" (
      "question_id"	INTEGER NOT NULL,
      "notify_email"	TEXT NOT NULL,
      "notification_language"	TEXT NOT NULL,
      FOREIGN KEY("question_id") REFERENCES "Questions"("id")
    );
  `)
}
