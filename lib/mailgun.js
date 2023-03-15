require('dotenv').config();

const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAIL_GUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAIL_GUN_KEY, domain: DOMAIN });

const sendEmail = function (subject, text) {

  const data = {
    from: process.env.MAIL_GUN_FROM_EMAIL,
    to: process.env.MAIL_GUN_TO_EMAIL,
    subject,
    text
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });

}

module.exports = sendEmail
