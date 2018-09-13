const nodemailer = require('nodemailer')

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
exports.sendEmail = function (receiver, question, lang) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'y4onn4ismvvrjizg@ethereal.email', // generated ethereal user
      pass: 'xsvuG1M5WcJkMvenN1' // generated ethereal password
    }
  })

  let mailOptions
  if (lang === 'de') {
    mailOptions = {
      from: '"Diese Fragen" <foo@example.com>',
      to: receiver,
      subject: "Ihre Frage wurde beantwortet",
      html: `<h1> Diese Fragen </h1> <p> Grüße! </p> <p> Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Frage <em> $ {question} </ em> von unseren Botschaftern beantwortet wurde </p> <p> Sie finden es zusammen mit anderen Fragen auf unserer Website <a href="http://142.93.99.60/answers"> im Bereich Antworten </a>. </p> <p> Bitte zögern Sie nicht, eine andere Frage im System zu stellen, oder wenn Sie irgendwelche Probleme mit der Website haben, schreiben Sie uns an <a href="mailto:y4onn4ismvvrjizg@ethereal.email"> unseren E-Mail-Account </a> und wir wird glücklich sein zu helfen </p> <p> Wir wünschen Ihnen einen schönen Tag und hoffen, Sie bald zu sehen! </p> `
    }
  } else {
    mailOptions = {
      from: '"Those Questions" <foo@example.com>', // sender address
      to: receiver, // list of receivers
      subject: 'Your question has been answered', // Subject line
      html: `<h1>Those Questions</h1> <p>Greetings!</p><p>We are happy to let you know that your question <em>${question}</em> has been answered by our ambassadors</p> <p>You can find it along with other questions by visiting our website <a href="http://142.93.99.60/answers">in the answers section</a>.</p> <p>Please feel free to ask any other question in the system or if you have any problem with the website, write us at <a href="mailto:y4onn4ismvvrjizg@ethereal.email">our email account</a> and we will be happy to help</p> <p>Have a wonderful day, and we hope to see you soon!</p>`  // html body
    }
  }

  // transporter.verify(function(error, success) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Server is ready to take our messages');
  //   }
  // })

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  })
}
