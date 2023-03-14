$(document).ready(function () {

  $(".add-button").click(function () {

    const lastId = Number($('div.choice').last().find('input').attr('id')) || 0;
    $('fieldset').append(createChoiceElement(lastId + 1));

  });

  $('form').on('click', '.delete-button', function () {
    console.log("clicked");
    $(this).parent().remove();
  });


});


const createChoiceElement = function (id) {
  return `
     <div class="choice">
      <input id="${id}" name="choice-${id}" type="text" placeholder="Add a choice">
      <i class="delete-button fas fa-trash-alt"></i>
     </div>

  `
}

