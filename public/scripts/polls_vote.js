$(document).ready(function () {

  let dragged;

  $('.draggable').on('dragstart', function (event) {
    dragged = $(this)
    setTimeout(() => {
      dragged.parent().css("display", "none")
    }, 0);
  })


  $('.dropable').on("dragover", (event) => {
    $(event.currentTarget).addClass('active');
    event.preventDefault();
  });

  $('.dropable').on("dragleave", (event) => {
    $(event.currentTarget).removeClass('active');

  });

  $('.dropable').on("dragend", (event) => {
    const dragSlot = dragged.parent()[0];
    dragSlot.style.display = "flex";
  });

  $('.dropable').on('drop', function (event) {
    event.preventDefault();
    $(event.currentTarget).removeClass('active');
    const dragSlot = dragged.parent()[0];
    const draggedElement = dragged[0];
    const dropSlot = $(this)[0];
    const replacedElement = dropSlot.children[1];
    replacedElement.remove();
    draggedElement.remove();
    dragSlot.appendChild(replacedElement);
    dropSlot.appendChild(draggedElement);
    console.log(dragSlot.style);
    dragSlot.style.display = "flex";

  })

});
