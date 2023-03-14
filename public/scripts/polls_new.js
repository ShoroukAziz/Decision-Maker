$(document).ready(function () {

  $(".add-button").click(function () {

    const fieldset = $('fieldset');
    const currentCount = fieldset.children().length;
    console.log(currentCount);
    fieldset.append(createChoiceElement(currentCount));
  });

  //TODO : see what you're gonna do about the name property
  $('form').on('click', '.delete-button', function () {
    console.log("clicked");
    $(this).parent().remove();
  });


});


const createChoiceElement = function (currentCount) {
  return `
     <div class="choice">
      <input name="choice-${currentCount}" type="text" placeholder="Add a choice">
      <i class="delete-button fas fa-trash-alt"></i>
     </div>

  `
}
