const db = require('../connection');

const createPoll = function (creatorId, poll) {
  let queryString = `

  WITH new_poll AS(

    INSERT INTO polls
     (creator_id,title,question,date_completed)
     VALUES($1,$2,$3, NULL)
     RETURNING id
  )

  INSERT INTO options (poll_id, description)
    VALUES
  `;

  poll.options.forEach((option, index) => {
    queryString += `
     ((SELECT id FROM new_poll) , $${index + 4} )
    `;
    if (index < poll.options.length - 1) {
      queryString += ', '
    }
  });

  queryString += `
  RETURNING
  (SELECT id FROM new_poll) ,
  ( SELECT users.email
     FROM users
     WHERE id = ${creatorId}
  );`

  const values = [creatorId, poll.title, poll.question].concat(poll.options);

  return db.query(queryString, values)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log('error:', err.message);
    });
};



module.exports = { createPoll };
