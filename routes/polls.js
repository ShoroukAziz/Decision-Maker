const express = require('express');
const router = express.Router();
const sendEmail = require('../lib/mailgun.js');

const pollsQueries = require('../db/queries/polls');
const newPollQueries = require('../db/queries/poll_new');
const getPollQueries = require('../db/queries/poll_get');
const votingQueries = require('../db/queries/vote_new');
const pollCompleteQueries = require('../db/queries/poll_complete');
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
      res.render('index', {
        user:
        {
          id: req.session.userId,
          email: req.session.userEmail,
          name: req.session.userName
        }
      });
    })

    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/new/drinks', (req, res) => {
  // TODO: replace the hardcoded object with the cookie object
  res.render('polls_new_drinks', {
    user:
    {
      id: req.session.userId,
      email: req.session.userEmail,
      name: req.session.userName
    }, content: {
      title: "Drinks",
      question: "What is your favourite drink?",
      answers: {
        one: "Water",
        two: "Tea",
        three: "Coffee",
        four: "Juice"
      }
    }
  });
});

/*
* Retrieves The new poll form
*/
router.get('/new', (req, res) => {
  // TODO: replace the hardcoded object with the cookie object
  res.render('polls_new', {
    user:
    {
      id: req.session.userId,
      email: req.session.userEmail,
      name: req.session.userName
    }
  });
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
      return res.render('error', {
        code: statusCode, user:
        {
          id: req.session.userId,
          email: req.session.userEmail,
          name: req.session.userName
        }
      });
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
        choices,
      };
      res.render('polls_vote', templateVars);
    })
    .catch(err => {
      const statusCode = 500;
      res.status(statusCode);
      return res.render('error', {
        code: statusCode, user:
        {
          id: req.session.userId,
          email: req.session.userEmail,
          name: req.session.userName
        }
      });
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
      votingQueries.randomVotes(req.params.id, req.body.results, pollTitle);
      res.redirect('/thank-you');
    })
    .catch(err => {
      const statusCode = 500;
      res.status(statusCode);
      return res.render('error', { code: statusCode });
    });
});

router.get('/:id/results', (req, res) => {
  const creator_id = 1;
  pollsQueries.getAllPolls(creator_id)
    .then(data => {

      let pollDetails;
      for (let element of data) {
        if (element.id === Number(req.params.id)) {
          pollDetails = element;
          break;
        }
      }

      console.log("pollDetails", pollDetails)

      if (pollDetails.length === 0) {
        res.statusCode = 404;
        return res.redirect('/error', {
          code: 404,
          user:
          {
            id: req.session.userId,
            email: req.session.userEmail,
            name: req.session.userName
          }
        });
      }

      queryOptions.getPollOptions(req.params.id)
        .then(pollOptions => {
          const converted = sumConverter.toPercentage(pollOptions);
          console.log('converted', converted);
          const pollResultsQuery = {
            user:
            {
              id: req.session.userId,
              email: req.session.userEmail,
              name: req.session.userName
            },
            pollIdNum: pollDetails.id,
            pollTitle: pollDetails.title,
            numOfVoters: pollDetails.total_votes,
            pollQuestion: pollDetails.question,
            options: converted,
            buttonState: ""
          }

          if (pollDetails.complete) {
            pollResultsQuery.buttonState = 'disabled';
          }

          return res.render('polls_results', pollResultsQuery);
        })
        .catch(error => {
          console.log('error 1')
          res.statusCode = 404;
          return res.render('error', {
            code: 404, user:
            {
              id: req.session.userId,
              email: req.session.userEmail,
              name: req.session.userName
            }
          });
        });
    })
    .catch(error => {
      console.log('error 2')
      res.statusCode = 400;
      return res.render('error', {
        code: 400, user:
        {
          id: req.session.userId,
          email: req.session.userEmail,
          name: req.session.userName
        }
      });
    });
});

router.patch('/:id/results', (req, res) => {
  pollCompleteQueries.completePoll(req.params.id)
    .then(pollId => {
      return res.redirect('/polls');
    })
    .catch(error => {
      res.statusCode = 404;
      return res.render('error', {
        code: 404,
        user:
        {
          id: req.session.userId,
          email: req.session.userEmail,
          name: req.session.userName
        }
      });
    });
});

module.exports = router;
