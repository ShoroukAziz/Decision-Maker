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
  console.log(pollId, pollResults, pollName);
  console.log('made it inside randomVoters')
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
    console.log('array went in', array);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.log('array came out', array);
    return array;
  }

  for (const name of voterNames) {
    console.log('made it inside the for loop')
    results = pollResults.split(',');
    shuffleArray(results);
    console.log('shuffled results')
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
    console.log('finalized building the query', queryString);
    db.query(queryString, [name])
      .then((data) => {
        console.log('ran query')
        sendEmail('vote', pollName, pollId, name);
        console.log('sent email')
      })
      .catch((err) => {
        console.log('error:', err.message);
      });
  }

};


module.exports = { insertVotes, randomVotes };
