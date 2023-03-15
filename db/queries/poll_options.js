const db = require('../connection');

const getPollOptions = (pollId) => {
  const pollsQuery = `
  WITH summary_of_votes AS (
    SELECT
      poll_id,
      option_id,
      SUM(rank_position)
    FROM votes
    WHERE votes.poll_id = $1
    GROUP BY poll_id, option_id
    ORDER BY sum DESC
  ), summary_of_options AS (
    SELECT id, description FROM options WHERE poll_id = $1
  )

  SELECT
    description,
    sum
  FROM summary_of_options
  JOIN summary_of_votes
    ON summary_of_options.id = summary_of_votes.option_id;
  `
  return db.query(pollsQuery, [pollId])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      return error;
    });
};

module.exports = { getPollOptions };
