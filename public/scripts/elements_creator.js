/**
 * Creates a jQuery node for a warning from a warning message
 * @param  {string}       errorMessage   [The warning message]
 * @return {jQueryNode}                  [an object with a warning node and its unique id]
 */
const createErrorMessageElement = function (errorMessage) {
  return $(`
    <div class="user-input-warning">
        <i class="fas fa-exclamation-circle"></i>
        <p> ${errorMessage} </p>
        <i class="close fas fa-times-circle"></i>
    </div>
  `)
};


const createChoiceElement = function (id) {
  return `
     <div class="choice">
      <input id="${id}" name="choice-${id}" type="text" placeholder="Add a choice">
       <div class="tooltip delete">
       <span class="tooltiptext">Delete this choice</span>
      <i class="delete-button fas fa-trash-alt"></i>
      </div>
     </div>

  `
}
