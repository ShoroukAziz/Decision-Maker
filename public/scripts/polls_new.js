$(document).ready(function () {

  $(".add-button").click(function () {

    const lastId = Number($('div.choice').last().find('input').attr('id')) || 0;
    $('fieldset').append(createChoiceElement(lastId + 1));

  });

  // Attach a delegated event handler to delete options
  $('form').on('click', '.delete-button', function () {
    $(this).parent().parent().remove();
  });


  // Attach a delegated event handler to close the warnings
  $('form').on('click', '.close', function () {
    $(this).parent().remove();
  });


  $('form').on('submit', function (e) {

    const title = $('#title:text').val();
    const question = $('#question:text').val();
    const choices = $('.choice');

    const { isValid, errorMesage } = validateNewPollForm(title, question, choices);
    if (!isValid) {
      e.preventDefault();
      const errorMessageElement = createErrorMessageElement(errorMesage);
      $('form').prepend(errorMessageElement);
      return;
    }
    return confirm(systemMessages.confirmPollSubmission);
  })

});




////// Helpers -----------------------------

const validateNewPollForm = function (title, question, choices) {

  if (!validateNotEmpty(title)) {
    return { isValid: false, errorMesage: systemMessages.emptyTitleError };
  }
  if (!validateNotEmpty(question)) {
    return { isValid: false, errorMesage: systemMessages.emptyQuestionError };
  }
  if (!validateChoicesCount(choices, MIN_CHOICES_COUNT)) {
    return { isValid: false, errorMesage: systemMessages.lessThanTwoOptionsError };
  }
  if (!validateChoicesFeilds(choices)) {
    return { isValid: false, errorMesage: systemMessages.emptyChoiceFeildsError };
  }


  return { isValid: true }
};

const validateNotEmpty = function (text) {
  return text.trim()
};

const validateChoicesCount = function (choices, count) {
  return choices.length >= count;
}


const validateChoicesFeilds = function (choices) {
  let emptyChoice = false;
  choices.each(function () {
    choiceText = $(this).find('input:text').val();
    console.log(choiceText);

    if (!validateNotEmpty(choiceText)) {
      emptyChoice = true;
      return false;
    }
  });
  return !emptyChoice;
}

