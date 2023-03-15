const db = require('../connection');

const completePoll = function (poll_id) {
  const queryString = `
  UPDATE polls
  SET complete = true,
      date_completed = NOW()
  WHERE id = $1
  RETURNING id;`;

  return db.query(queryString, [poll_id])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { completePoll };
