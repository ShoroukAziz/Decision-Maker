const express = require('express');
const router = express.Router();
const sendEmail = require('../lib/mailgun.js');

const pollsQueries = require('../db/queries/polls');
const newPollQueries = require('../db/queries/poll_new');
const getPollQueries = require('../db/queries/poll_get');
const votingQueries = require('../db/queries/vote_new');
const pollCompleteQueries = require('../db/queries/poll_complete');
const queryPolls = require('../db/queries/poll_details');
const queryOptions = require('../db/queries/poll_options');
const sumConverter = require('../lib/sumsConverter');

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


/*
* Retrieves The new poll form
*/
router.get('/new', (req, res) => {
  // TODO: replace the hardcoded object with the cookie object
  res.render('polls_new', { user: { email: "choicemateapp@gmail.com" } });
});

/*
*  Submits a new Poll
*/
router.post('/', (req, res) => {
  console.log("req Body", req.body);

  // change to req.session.userId later
  newPollQueries.createPoll(1, {
    title: req.body.title,
    question: req.body.question,
    options: Object.values(req.body).slice(2)
  })
    .then((data) => {
      const createdPollId = data.rows[0].id;
      sendEmail('poll', req.body.title, createdPollId);
      res.redirect('/polls');
    })
    .catch(err => {
      const statusCode = 500;
      res.status(statusCode);
      return res.render('error', { code: statusCode });
    });
});


/*
* Retrieves a specific poll to vote on it
*/
router.get('/:id', (req, res) => {

  getPollQueries.getPollAndOptionsByPollId(req.params.id)
    .then((data) => {

      if (data[0].complete) {
        const statusCode = 401;
        res.status(statusCode);
        return res.render('error', { code: statusCode });
      }
      const choices = [];
      data.forEach(element => {
        choices.push(
          {
            id: element.option_id,
            description: element.description
          }
        )
      });
      const templateVars = {
        id: data[0].id,
        title: data[0].title,
        question: data[0].question,
        choices
      };
      res.render('polls_vote', templateVars);
    })
    .catch(err => {
      const statusCode = 500;
      res.status(statusCode);
      return res.render('error', { code: statusCode });
    });
});



router.post('/:id/complete', (req, res) => {
  const pollId = req.params.id;
  pollCompleteQueries.completePoll(pollId)
    .then(poll => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error('error:', err);
    });
})

/*
* Submits a vote on a poll
*/
router.post('/:id', (req, res) => {

  votingQueries.insertVotes(req.params.id, req.body.name, req.body.results)
    .then((data) => {
      const pollTitle = data.rows[0].title;
      sendEmail('vote', pollTitle, req.params.id, req.body.name);
      res.redirect('/thank-you');
    })
    .catch(err => {
      const statusCode = 500;
      res.status(statusCode);
      return res.render('error', { code: statusCode });
    });
});

router.get('/:id/results', (req, res) => {
  queryPolls.getPollDetails(req.params.id)
    .then(pollDetails => {
      console.log(pollDetails)
      if (pollDetails.length === 0) {
        res.statusCode = 404;
        return res.redirect('/error', { code: 404 });
      }

      queryOptions.getPollOptions(req.params.id)
        .then(pollOptions => {
          const converted = sumConverter.toPercentage(pollOptions);
          const pollResultsQuery = {
            pollIdNum: pollDetails[0].id,
            pollTitle: pollDetails[0].title,
            numOfVoters: pollDetails[0].total_voters,
            pollQuestion: pollDetails[0].question,
            options: converted,
            buttonState: ""
          }

          if (pollDetails[0].complete) {
            pollResultsQuery.buttonState = 'disabled';
          }

          return res.render('polls_results', pollResultsQuery);
        })
        .catch(error => {
          res.statusCode = 404;
          return res.render('error', { code: 404 });
        });
    })
    .catch(error => {
      res.statusCode = 400;
      return res.render('error', { code: 400 });
    });
});

router.patch('/:id/results', (req, res) => {
  pollCompleteQueries.completePoll(req.params.id)
    .then(pollId => {
      return res.redirect('/polls');
    })
    .catch(error => {
      res.statusCode = 404;
      return res.render('error', { code: 404 });
    });
});

module.exports = router;
