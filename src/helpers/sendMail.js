'use strict';
const nodemailer = require('nodemailer');
const debug = require('debug')('node-server:index');

// config
const config = require('../config');

// Gmail transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.email.address,
    pass: config.email.pwd,
  },
});

// Mailtrap transporter
// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "9c3a5b316c31bb",
//     pass: "3052b2a873062c"
//   }
// });

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    return console.log(error);
  }
  debug("Server is ready for sending mails!");
});

async function sendMail({ toEmail = '', subject = '', text = '', template = '' }) {
  const mailConfig = {
    from: `"${config.email.name}" <${config.email.address}>`,
    to: toEmail,
    subject: subject,
    text: text,
    html: template,
  }

  transporter.sendMail(mailConfig, function(err, info) {
    if (err) {
      return console.log(err);
    }
    console.log('Email sent:', info.response);
  });
}

module.exports = sendMail;
