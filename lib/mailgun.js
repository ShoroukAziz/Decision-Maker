require('dotenv').config();

const { generateNewPollEmail, generateNewVoteEmail } = require('./email-creators');

const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAIL_GUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAIL_GUN_KEY, domain: DOMAIN });



const sendEmail = function (type, pollTitle, pollId, voterName) {


  if (type === 'poll') {
    email = generateNewPollEmail(pollTitle, pollId);
  }
  else {
    email = generateNewVoteEmail(pollTitle, pollId, voterName);
  }

  const data = {
    from: process.env.MAIL_GUN_FROM_EMAIL,
    to: process.env.MAIL_GUN_TO_EMAIL,
    subject: email.subject,
    html: email.text
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });

}



module.exports = sendEmail
