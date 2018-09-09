//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Clean DB
let fs = require('fs')
fs.truncateSync('db_test.json', 0)

// APP
let app = require('../app')

// DEV DEPS
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()

let url=`localhost:${process.env.PORT}/`
chai.use(chaiHttp)

describe('Questions', () => {
  let tokenAdmin
  let answer1 = {
    short_answer : {
      en : "English answer short",
      de : "German answer short"
    },
    long_answer : {
      en : "English long answer",
      de : "German long answer"
    },
    media : {
      is_media_nsfw : false,
      media_html_embed : "<iframe> YouTube embed"
    }
  }
  let answer2 = {
    short_answer : {
      en : "Different English answer short",
      de : "Different German answer short"
    },
    long_answer : {
      en : "Different English long answer",
      de : "Different German long answer"
    }
  }
  let askingQuestion = {
    text: {
      en: "Question in English",
    },
    additional_details : "Additional Details",
    asker_age : "23"
  }
  let questionId
  let number_of_views
  before( (done) => {
    chai.request(url)
    .post('users/login/')
    .send({
      email : process.env.ADMIN_EMAIL,
      password : process.env.ADMIN_PASSWORD
    })
    .end( (err, res) => {
      tokenAdmin = "Bearer " + res.body.token
      done()
    })
  })
  describe('/ get tests', () => {
    it('it should return 200 with empty response', (done) => {
      chai.request(url)
      .get('questions/')
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('array')
        res.body.should.deep.equal([])
        done()
      })
    })
  })
  describe('/ post tests', () => {
    it('it should post a question, return it in 201 code', (done) => {
      chai.request(url)
      .post('questions/')
      .send(askingQuestion)
      .end( (err, res) => {
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.should.have.keys("text", "id", "number_of_views", "date_asked", "asker_age", "additional_details")
        res.body.text.should.have.keys("en")
        questionId = res.body.id
        done()
      })
    })
    it('it should be rejected if no text', (done) => {
      chai.request(url)
      .post('questions/')
      .send({additional_details : "Lipsum"})
      .end( (err, res) => {
        res.should.have.status(400)
        done()
      })
    })
  })
  describe('/questionId patch tests', () => {
    it('it should change question details, return it in 200 code', (done) => {
      chai.request(url)
      .patch('questions/' + questionId)
      .send({asker_age : "55"})
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.have.keys("text", "id", "number_of_views", "date_asked", "asker_age", "additional_details")
        res.body.asker_age.should.equal("55")
        number_of_views = res.body.number_of_views
        done()
      })
    })
    it('it should be rejected if no additional details', (done) => {
      chai.request(url)
      .patch('questions/' + questionId)
      .send({ })
      .end( (err, res) => {
        res.should.have.status(400)
        done()
      })
    })
  })
  describe('/questionId/update_views patch tests', () => {
    it('it should increase number of views', (done) => {
      chai.request(url)
      .patch('questions/' + questionId + '/update_views')
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.have.keys("text", "id", "number_of_views", "date_asked")
        res.body.number_of_views.should.equal(number_of_views+1)
        done()
      })
    })
  })
  describe('/questionId/subscribe_email post tests', () => {
    it('it should register email and return 201', (done) => {
      chai.request(url)
      .post('questions/' + questionId + '/subscribe_email')
      .send({
        email: "test@test.com",
      })
      .end( (err, res) => {
        res.should.have.status(201)
        res.body.should.have.keys("question_id", "email")
        res.body.email.should.equal("test@test.com")
        res.body.question_id.should.equal(questionId)
        done()
      })
    })
    it('it should return 404', (done) => {
      chai.request(url)
      .post('questions/' + "134FG_3123151512a1" + '/subscribe_email')
      .send({
        email: "test@test.com",
      })
      .end( (err, res) => {
        res.should.have.status(404)
        done()
      })
    })
  })
  describe('/all get test', () => {
    it('it should return 200 with a single question', (done) => {
      chai.request(url)
      .get('questions/all')
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("array")
        res.body.length.should.equal(1)
        done()
      })
    })
  })
  describe('/questionId get test', () => {
    it('it should return 200 with question details', (done) => {
      chai.request(url)
      .get('questions/' + questionId)
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("object")
        res.body.should.include.keys("text", "id", "number_of_views", "date_asked", "additional_details", "asker_age")
        done()
      })
    })
  })
  describe('/questionId patch tests', () => {
    it('it should commit changes and return 200 ', (done) => {
      chai.request(url)
      .patch('questions/' + questionId + '/modify')
      .send({
        text: {
          de: "adding German"
        },
        date_asked: Date.now(),
        asker_age: "99"
      })
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("object")
        res.body.should.include.keys("text", "id", "number_of_views", "date_asked", "additional_details", "asker_age")
        res.body.text.should.include.keys("en", "de")
        res.body.text.en.should.equal(askingQuestion["text"]["en"])
        res.body.text.de.should.equal("adding German")
        res.body.asker_age.should.equal("99")
        res.body.date_asked.should.not.equal(askingQuestion["date_asked"])
        done()
      })
    })
    it('it should return 400 if empty payload ', (done) => {
      chai.request(url)
      .patch('questions/' + questionId + '/modify')
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(400)
        done()
      })
    })
  })
  describe('/questionId/answer put tests', () => {
    it('it should commit changes and return 200 ', (done) => {
      chai.request(url)
      .put('questions/' + questionId + '/answer')
      .send({answer : answer1})
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("object")
        res.body.should.include.keys("answer")
        res.body.answer.should.deep.equal(answer1)
        done()
      })
    })
    it('it should commit changes and return 200 ', (done) => {
      chai.request(url)
      .put('questions/' + questionId + '/answer')
      .send({answer : answer2})
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("object")
        res.body.should.include.keys("answer")
        res.body.answer.should.not.deep.equal(answer1)
        done()
      })
    })
  })
  describe('/questionId/answer delete tests', () => {
    it('it should commit changes and delete the answer ', (done) => {
      chai.request(url)
      .delete('questions/' + questionId + '/answer')
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.should.not.include.keys("answer")
        done()
      })
    })
    it('it should return 404 if no answer is found ', (done) => {
      chai.request(url)
      .delete('questions/' + questionId + '/answer')
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(404)
        done()
      })
    })
    it('it should return 404 if no question is found ', (done) => {
      chai.request(url)
      .delete('questions/' + "134FG_3123151512a1" + '/answer')
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(404)
        done()
      })
    })
  })
  describe('/questionId/ delete tests', () => {
    it('it should delete the question, return message, and a list of all questions should be empty', (done) => {
      chai.request(url)
      .delete('questions/' + questionId)
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(200)
        res.body.message.should.equal("Question Deleted.")
        chai.request(url)
        .get('questions/all')
        .set('Authorization', tokenAdmin)
        .end( (err, res) => {
          res.should.have.status(200)
          res.body.should.be.an("array")
          res.body.length.should.equal(0)
          done()
        })
      })
    })
    it('it should return 404 if no quesiton is found ', (done) => {
      chai.request(url)
      .delete('questions/' + questionId)
      .set('Authorization', tokenAdmin)
      .end( (err, res) => {
        res.should.have.status(404)
        done()
      })
    })
  })
})
