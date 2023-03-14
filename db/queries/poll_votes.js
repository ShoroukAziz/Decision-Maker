const db = require('../connection');

const getPollVotes = () => {

  return db.query('SELECT title, (SELECT count(voter_id) as total_voters FROM (select voter_id from votes where poll_id = 1 group by voter_id) as result), question FROM polls where id = 1;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getUsers };
