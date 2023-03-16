$(document).ready(function() {

  // ACTIVE POLLS

  const $activePollsContainer = $('#active-polls');

  const getActivePolls = (polls) => {
    return polls.filter(poll => !poll.complete);
  };

  const renderActivePolls = function (polls) {
    $activePollsContainer.text('');
    let itemsToShow;
    itemsToShow = polls.length >= 2 ? 2 : polls.length;
    polls.length <= 2 ? $('.see-more-active').hide() : $('.see-more-active').show();
    for (let i = 0; i < itemsToShow; i++) {
      $('.active-polls-title').text(`Active Polls - ${polls.length}`)
      const activePoll = showActivePollElement(polls[i]);
      $activePollsContainer.prepend(activePoll);
    }
  };

  const showActivePollElement = (poll) => {
    console.log('poll', poll)
    const dateCreated = new Date(poll.date_created);
    const $activePoll = $(`
      <article class="poll">
        <header>
          <div class="title">${poll.title}</div>
          <div class="right-corner-buttons">
          <form>
            <button class="btn btn-outline-secondary results-button" data-poll-id="${poll.id}">Results</button>
            <button type="submit" class="btn btn-outline-secondary complete-button" data-poll-id="${poll.id}">Complete</button></form>
          </div>
        </header>
        <footer>
          <div class="date">Date created: ${dateCreated.toLocaleDateString()}</div>

          <div class="right-corner-icons">
            <div class="tooltip">
              <span class="tooltiptext">Click here to copy shareable link</span>
              <button class="share-button" data-copy="http://localhost:8080/polls/${poll.id}"><i class="fa-solid fa-share"></i></button>
              <p class="copy-notification">Link copied!</p>
            </div>

            <div class="votes">
              <div class="tooltip">
                <span class="tooltiptext">Total votes</span>
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="total-votes">${poll.total_votes}</div>
            </div>
          </div>
        </footer>
      </article>
    `);
    return $activePoll;
  };

  $('.see-more-active').on('click', () => {
    let itemsToShow = 2;
    $.ajax('/polls/api', {
      method: 'GET',
      dataType: 'json',
    })
      .then((polls) => {
        const activePolls = getActivePolls(polls);
        console.log('activePolls', activePolls);
        for (let i = itemsToShow; i < activePolls.length; i++) {
          const newActivePoll = showActivePollElement(activePolls[i]);
          $activePollsContainer.append(newActivePoll);
          itemsToShow++;
          if (itemsToShow === activePolls.length) {
            return $('.see-more-active').hide();
          }
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  });


  // COMPLETED POLLS

  const $completedPollsContainer = $('#completed-polls');

  const getCompletedPolls = (polls) => {
    return polls.filter(poll => poll.complete);
  };

  const renderCompletedPolls = function (polls) {
    $('.completed-polls-title').text(`Completed Polls - ${polls.length}`)
    $completedPollsContainer.text('');
    let itemsToShow;
    itemsToShow = polls.length >= 2 ? 2 : polls.length;
    polls.length <= 2 ? $('.see-more-completed').hide() : $('.see-more-completed').show();
    for (let i = 0; i < itemsToShow; i++) {
      const completedPoll = showCompletedPollElement(polls[i]);
      $completedPollsContainer.prepend(completedPoll);
    }
  };

  const showCompletedPollElement = (poll) => {
    let dateCompleted = new Date(poll.date_completed);
    // if statement for testing purposes
    if (!poll.date_completed) {
      dateCompleted = new Date();
    }
    const $completedPoll = $(`
      <article class="poll">
        <header>
          <div class="title">${poll.title}</div>
          <div class="right-corner-buttons">
            <button class="btn btn-outline-secondary results-button" data-poll-id="${poll.id}">Results</button>
          </div>
        </header>
        <footer>
          <div class="date">Date completed: ${dateCompleted.toLocaleDateString()}</div>
          <div class="right-corner-icons">
            <div class="votes">
              <div class="tooltip">
                <span class="tooltiptext">Total votes</span>
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="total-votes">${poll.total_votes}</div>
            </div>
          </div>
        </footer>
      </article>
    `);
    return $completedPoll;
  };

  $('.see-more-completed').on('click', () => {
    let itemsToShow = 2;
    $.ajax('/polls/api', {
      method: 'GET',
      dataType: 'json',
    })
      .then((polls) => {
        const completedPolls = getCompletedPolls(polls);
        console.log('completedPolls', completedPolls);
        for (let i = itemsToShow; i < completedPolls.length; i++) {
          const newCompletedPoll = showCompletedPollElement(completedPolls[i]);
          console.log('newCompletedPoll', newCompletedPoll)
          $completedPollsContainer.append(newCompletedPoll);
          itemsToShow++;
          if (itemsToShow === completedPolls.length) {
            return $('.see-more-completed').hide();
          }
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  });

  // LOAD POLLS

  const loadActivePolls = function () {
    $.ajax('/polls/api', {
      method: 'GET',
      dataType: 'json',
    })
      .then((polls) => {
        console.log('polls', polls);
        const activePolls = getActivePolls(polls);
        console.log('activePolls', activePolls);
        renderActivePolls(activePolls);
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  const loadCompletedPolls = function () {
    $.ajax('/polls/api', {
      method: 'GET',
      dataType: 'json',
    })
      .then((polls) => {
        const completedPolls = getCompletedPolls(polls);
        console.log('completedPolls', completedPolls);
        renderCompletedPolls(completedPolls);
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  loadActivePolls();
  loadCompletedPolls();

  // COMPLETE POLL

  $('body').on('click', '.complete-button', function(e) {
    e.preventDefault();
    const pollId = $(this).attr('data-poll-id');

    $.ajax(`/polls/${pollId}/complete`, {
      method: 'POST'
    })
    .then(() => {
      loadActivePolls();
      loadCompletedPolls()
    })
    .catch((err) => {
      console.log('error', err);
    });
  });

  // POLL RESULTS BUTTON

  $('body').on('click', '.results-button', function(e) {
    e.preventDefault();
    const pollId = $(this).attr('data-poll-id');
    window.location.href = `/polls/${pollId}/results`;
  });

  // SHARE ICON

  $('body').on('click', '.share-button', function (e) {
    e.preventDefault();
    const shareLink = $(this).attr('data-copy');
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        console.log('Text copied');
        $(this).siblings('.copy-notification').show();

        setTimeout(() => {
        $(this).siblings('.copy-notification').hide();
        }, 2000);
      })
      .catch((err) => {
        console.log('error', err);
      });
    });

});
