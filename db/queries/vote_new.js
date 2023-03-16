const db = require('../connection');
const sendEmail = require('../../lib/mailgun.js');

const insertVotes = function (pollId, voterName, results) {

  results = results.split(',');
  const n = results.length;
  let queryString = `

  WITH new_voter AS(

    INSERT INTO users (name) values ($1)
     RETURNING id
  )

  INSERT INTO votes (voter_id, poll_id,option_id ,rank_position )
    VALUES
  `;

  results.forEach((result, index) => {
    queryString += `
     ((SELECT id FROM new_voter) , ${pollId}, ${result} , ${n - (index + 1)} )
    `;
    if (index < results.length - 1) {
      queryString += ', '
    }
  });

  queryString += `RETURNING (
    SELECT title FROM polls WHERE id = ${pollId});`

  return db.query(queryString, [voterName])
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log('error:', err.message);
    });
};

const randomVotes = function (pollId, pollResults, pollName) {
  const voterNames = [
    'Emma West',
    'Tatiana Wall',
    'Sally Mercado',
    'Felicity Bentley',
    'Jodie Savage',
    'Kareem Rivas',
    'Addie Owen',
    'Daniel Nixon',
    'Mariam Ramos',
    'Monty York'
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  for (const name of voterNames) {
    results = pollResults.split(',');
    shuffleArray(results);
    const n = results.length;
    let queryString = `
    WITH new_voter AS(

      INSERT INTO users (name) values ($1)
       RETURNING id
    )

    INSERT INTO votes (voter_id, poll_id,option_id ,rank_position )
      VALUES
    `;

    results.forEach((result, index) => {
      queryString += `
       ((SELECT id FROM new_voter) , ${pollId}, ${result} , ${n - (index + 1)} )
      `;
      if (index < results.length - 1) {
        queryString += ', '
      }
    });

    queryString += `RETURNING (
      SELECT title FROM polls WHERE id = ${pollId});`

    db.query(queryString, [name])
      .then((data) => {
        sendEmail('vote', pollName, pollId, name);
      })
      .catch((err) => {
        console.log('error:', err.message);
      });
  }

};


module.exports = { insertVotes, randomVotes };
