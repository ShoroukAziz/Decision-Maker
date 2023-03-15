const db = require('../connection');

const getPollDetails = (pollId) => {
  const pollsQuery = `
  WITH unique_voters AS (
    SELECT
      poll_id,
      COUNT(DISTINCT voter_id) AS total_voters
    FROM votes
    WHERE poll_id = $1
    GROUP BY poll_id
  ), poll_details AS (
    SELECT
      id,
      title,
      question
    FROM polls
    where id = $1 and complete != true
  )

  SELECT
    id,
    title,
    question,
    total_voters
  FROM poll_details
  JOIN unique_voters
    ON unique_voters.poll_id = poll_details.id;
  `

  return db.query(pollsQuery, [pollId])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      return error;
    });
};

module.exports = { getPollDetails };
