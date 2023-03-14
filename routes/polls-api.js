const express = require('express');
const router  = express.Router();
const pollsQueries = require('../db/queries/polls');

router.get('/polls', (req, res) => {
  const creatorId = 1;
  pollsQueries.getAllPolls(creatorId)
    .then(polls => {
      let totalActivePolls = 0;
      let totalCompletedPolls = 0;
      for (const poll of polls) {
        if (poll.complete) {
          totalCompletedPolls++;
        } else {
          totalActivePolls++;
        }
      }
      const templateVars = {
        polls,
        active_polls: totalActivePolls,
        completed_polls: totalCompletedPolls
      }
      console.log('templateVars', templateVars)
      res.render('index', templateVars);
    })

    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
