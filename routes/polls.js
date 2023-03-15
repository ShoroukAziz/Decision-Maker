const express = require('express');
const router  = express.Router();
const pollsQueries = require('../db/queries/polls');

router.get('/api', (req, res) => {
  const creatorId = 1; // replace by user
  pollsQueries.getAllPolls(creatorId)
    .then(polls => {
      return res.json(polls);
    })

    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
})

router.get('/', (req, res) => {
  const creatorId = 1; // replace by user
  pollsQueries.getAllPolls(creatorId)
    .then(() => {
      res.render('index');
    })

    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
