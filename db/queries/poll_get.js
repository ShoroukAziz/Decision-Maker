const db = require('../connection');

const getPollAndOptionsByPollId = function (pollId) {

  const queryString = `
    SELECT polls.id, title, question ,  users.email, options.id as option_id , options.description
    FROM polls
    JOIN options
    ON  polls.id = options.poll_id
    JOIN users
    ON polls.creator_id = users.id
    WHERE polls.id = $1;
  `;
  const values = [pollId];

  return db.query(queryString, values)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log('error:', err.message);
    });

};


module.exports = { getPollAndOptionsByPollId };

