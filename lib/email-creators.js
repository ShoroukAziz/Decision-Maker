const generateNewPollEmail = function (pollTitle, pollId) {
  const subject = `Your New poll is ready to share! - ${pollTitle}`;

  const text = `<!DOCTYPE html>
<html lang="en">

<head>
  <style>
    a {
      color: #ffffff !important;
      background-color: #C97B84;
      border: none;
      border-radius: 3px;
      padding: 5px 30px;
      cursor: pointer;
      align-self: flex-end;
      text-decoration: none;
    }

    .container {
      text-align: center;
      flex-flow: column;
      background-color: #FEEFDD;
      padding: 25px 25px 50px 25px;
      border: 3px solid #201E1F;
    }
  </style>
</head>

<body>
  <div class="container">

    <img width="150" src="https://i.imgur.com/ON9qPJd.png" />
    <h3>Your new poll</h3>
    <h2>${pollTitle}</h2>
    <h3>is ready to share!</h3>
    <div>
      <a href="http://localhost:8080/polls/${pollId}"> Share URL</a>
      <a href="http://localhost:8080/polls/${pollId}/results">Poll Results</a>
    </div>

  </div>

</body>

</html>`

  return { subject, text };
}
const generateNewVoteEmail = function (pollTitle, pollId, voterName) {
  const subject = `New Poll Submission on - ${pollTitle} - by ${voterName}`;
  const text = `
  <!DOCTYPE html>
<html lang="en">

<head>
  <style>
    a {
      color: #ffffff !important;
      background-color: #C97B84;
      border: none;
      border-radius: 3px;
      padding: 5px 30px;
      cursor: pointer;
      align-self: flex-end;
      text-decoration: none;
    }

    .container {
      text-align: center;
      flex-flow: column;
      background-color: #FEEFDD;
      padding: 25px 25px 50px 25px;
      border: 3px solid #201E1F;
    }
  </style>
</head>

<body>
  <div class="container">

    <img width="150" src="https://i.imgur.com/ON9qPJd.png" />
    <h3>You have a new vote submission!</h3>
    <h2>${voterName} voted on ${pollTitle}</h2>
    <div>
      <a href="http://localhost:8080/polls/${pollId}"> Share URL</a>
      <a href="http://localhost:8080/polls/${pollId}/results">Poll Results</a>
    </div>

  </div>

</body>

</html>
`
  return { subject, text };
}


module.exports = { generateNewPollEmail, generateNewVoteEmail };
