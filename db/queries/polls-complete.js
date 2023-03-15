const db = require('../connection');

const completePoll = function (poll_id) {
  const queryString = `
  UPDATE polls
  SET complete = $1,
      date_completed = NOW()
  WHERE id = $2;`;
  const values = ['true', poll_id];

  return db.query(queryString, values)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { completePoll };
