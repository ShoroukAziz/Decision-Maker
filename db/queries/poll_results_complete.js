const db = require('../connection');

const setPollToComplete = (pollId) => {
  const pollsQuery = `
  UPDATE polls
  SET complete = true,
      date_completed = NOW()
  WHERE id = $1
  RETURNING id;
  `
  return db.query(pollsQuery, [pollId])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      return error;
    });
};

module.exports = { setPollToComplete };
