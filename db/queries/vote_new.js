const db = require('../connection');

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



module.exports = { insertVotes };
