$(document).ready(function() {

  // ACTIVE POLLS

  const creatorId = 1;
  const $activePollsContainer = $('#active-polls');

  const getActivePolls = (polls) => {
    return polls.filter(poll => !poll.complete);
  };

  const renderActivePolls = function (activePolls) {
    let itemsToShow = 2;
    for (let i = 0; i < itemsToShow; i++) {
      const activePoll = showActivePollElement(activePolls[i]);
      $activePollsContainer.prepend(activePoll);
    }
  };

  const showActivePollElement = (poll) => {
    const $activePoll = $(`
      <article class="poll">
        <header>
          <div class="title">${poll.title}</div>
          <div class="right-corner-buttons">
            <button class="results-button">Results</button>
            <button class="complete-button">Complete</button>
          </div>
        </header>
        <footer>
          <div class="date">Date created: ${poll.date_created.toLocaleString()}</div>
          <div class="right-corner-icons">
            <i class="fa-solid fa-share"></i>
            <div class="votes">
              <i class="fa-solid fa-user"></i>
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
      .then(function (polls) {
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
  });


// COMPLETED POLLS

  const $completedPollsContainer = $('#completed-polls');

  const getCompletedPolls = (polls) => {
    return polls.filter(poll => poll.complete);
  };

  const renderCompletedPolls = function (polls) {
    let itemsToShow = 2;
    for (let i = 0; i < itemsToShow; i++) {
      const completedPoll = showCompletedPollElement(polls[i]);
      $completedPollsContainer.prepend(completedPoll);
    }
  };

  const showCompletedPollElement = (poll) => {
    const $completedPoll = $(`
      <article class="poll">
        <header>
          <div class="title">${poll.title}</div>
          <div class="right-corner-buttons">
            <button class="results-button">Results</button>
            <button class="complete-button">Complete</button>
          </div>
        </header>
        <footer>
          <div class="date">Date created: ${(poll.date_completed)}</div>
          <div class="right-corner-icons">
            <i class="fa-solid fa-share"></i>
            <div class="votes">
              <i class="fa-solid fa-user"></i>
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
      .then(function (polls) {
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
  });

// LOAD POLLS

  const loadPolls = function () {
    $.ajax('/polls/api', {
      method: 'GET',
      dataType: 'json',
    })
      .then(function (polls) {
        console.log('polls', polls);
        const activePolls = getActivePolls(polls);
        console.log('activePolls', activePolls);
        renderActivePolls(activePolls);
        const completedPolls = getCompletedPolls(polls);
        console.log('completedPolls', completedPolls);
        renderCompletedPolls(completedPolls);
      });
  };

  loadPolls();

});
