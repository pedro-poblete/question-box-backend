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

describe('Users', () => {
  describe('/login tests', () => {
    it('it should return a token', (done) => {
      chai.request(url)
      .post('users/login/')
      .send({
        email : process.env.ADMIN_EMAIL,
        password : process.env.ADMIN_PASSWORD
      })
      .end( (err, res) => {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.have.keys('token')
        done()
      })
    })
    it('it should return an error if password is wrong', (done) => {
      chai.request(url)
      .post('users/login')
      .send({
        email : process.env.ADMIN_EMAIL,
        password : "FakePassword123"
      })
      .end( (err, res) => {
        res.should.have.status(401)
        res.should.not.have.keys('token')
        done()
      })
    })
  })
  describe('/register, /update & /delete tests', () => {
    let tokenAdmin
    let tokenAmbassador
    before( (done) => {
      chai.request(url)
      .post('users/login/')
      .send({
        email : process.env.ADMIN_EMAIL,
        password : process.env.ADMIN_PASSWORD
      })
      .end( (err, res) => {
        tokenAdmin = "Bearer " + res.body.token
        chai.request(url)
        .post('users/register')
        .set('Authorization', tokenAdmin)
        .send({
          email: "test@ambassador.com",
          password: "ambassador",
          role: "ambassador"
        })
        .end( (err, res) => {
          chai.request(url)
          .post('users/login/')
          .send({
            email : 'test@ambassador.com',
            password : 'ambassador'
          })
          .end( (err, res) => {
            tokenAmbassador = "Bearer " + res.body.token
            done()
          })
        })
      })
    })
    describe('/register tests', () => {
      it('it should create an user', (done) => {
        chai.request(url)
        .post('users/register')
        .set('Authorization', tokenAdmin)
        .send({
          email: "test@test.com",
          password: "pass123",
          role: "ambassador",
        })
        .end( (err, res) => {
          res.should.have.status(201)
          done()
        })
      })
      it('it should prevent duplicate and return a 409 error', (done) => {
        chai.request(url)
        .post('users/register')
        .set('Authorization', tokenAdmin)
        .send({
          email: "test@test.com",
          password: "pass123",
          role: "ambassador"
        })
        .end( (err, res) => {
          res.should.have.status(409)
          done()
        })
      })
      it('it should not create an user and return a 403', (done) => {
        chai.request(url)
        .post('users/register')
        .set('Authorization', tokenAmbassador)
        .send({
          email: "test1@test.com",
          password: "pass123",
          role: "ambassador"
        })
        .end( (err, res) => {
          res.should.have.status(403)
          done()
        })
      })
    })
    describe('/update tests', () => {
      it('it should update user', (done) => {
        chai.request(url)
        .patch('users/update')
        .set('Authorization', tokenAdmin)
        .send({
          email: "test@test.com",
          password: "newPassword",
          role: "ambassador"
        })
        .end( (err, res) => {
          res.should.have.status(200)
          done()
        })
      })
      it('it should refuse to change role', (done) => {
        chai.request(url)
        .patch('users/update')
        .set('Authorization', tokenAdmin)
        .send({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: "ambassador"
        })
        .end( (err, res) => {
          res.should.have.status(403)
          done()
        })
      })
      it('it should not find the user', (done) => {
        chai.request(url)
        .patch('users/update')
        .set('Authorization', tokenAdmin)
        .send({
          email: "email@notlisted.com",
          role: "ambassador"
        })
        .end( (err, res) => {
          res.should.have.status(404)
          done()
        })
      })
      it('it should refuse to make changes due to lack of permissions', (done) => {
        chai.request(url)
        .patch('users/update')
        .set('Authorization', tokenAmbassador)
        .send({
          email: process.env.ADMIN_EMAIL,
          password: "passwordChange"
        })
        .end( (err, res) => {
          res.should.have.status(403)
          done()
        })
      })
    })
    describe('/delete tests', () => {
      it('it should delete user', (done) => {
        chai.request(url)
        .delete('users/delete')
        .set('Authorization', tokenAdmin)
        .send({
          email: "test@test.com",
        })
        .end( (err, res) => {
          res.should.have.status(200)
          done()
        })
      })
      it('it should return 404', (done) => {
        chai.request(url)
        .delete('users/delete')
        .set('Authorization', tokenAdmin)
        .send({
          email: "user@dontexists.com",
        })
        .end( (err, res) => {
          res.should.have.status(404)
          done()
        })
      })
      it('it should return 403 and specify it\'s because of lack of admins', (done) => {
        chai.request(url)
        .delete('users/delete')
        .set('Authorization', tokenAdmin)
        .send({
          email: process.env.ADMIN_EMAIL,
        })
        .end( (err, res) => {
          res.should.have.status(403)
          res.body.error.should.equal("Cannot delete user. At least one administrator must remain in the system.")
          done()
        })
      })
      it('it should return 403 and specify it\'s because of permissions', (done) => {
        chai.request(url)
        .delete('users/delete')
        .set('Authorization', tokenAmbassador)
        .send({
          email: process.env.ADMIN_EMAIL,
        })
        .end( (err, res) => {
          res.should.have.status(403)
          res.body.error.should.equal("User does not have the right permissions.")
          done()
        })
      })
    })
  })
})
