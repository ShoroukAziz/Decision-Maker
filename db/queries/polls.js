const db = require('../connection');

const getAllPolls = function (creator_id) {
  const queryString = `
  SELECT polls.id, title, date_created, date_completed, complete, count(voter_id) as total_votes
  FROM polls
  JOIN (
    SELECT poll_id, voter_id
    FROM votes
    GROUP BY voter_id, poll_id
    ORDER BY poll_id, voter_id
  ) as votes ON polls.id = poll_id
  WHERE creator_id = $1
  GROUP BY polls.id
  ORDER BY date_created DESC;
  `;
  const values = [creator_id];

  return db.query(queryString, values)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { getAllPolls };
