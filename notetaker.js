(function() {
  // The number of colors the user may choose between
  const NUM_COLORS = 7;
  // This will be set to the note the user is working on, otherwise undefined
  let currentNote;
  // This is set to the color of the text area
  let currentColor;

  $(function() {
    // Set up color options
    chooseColors();
    // Set up save button behavior
    $('#save').click(saveNote);
  });

  /**
   * Choose a number of random colors to allow user to pick from
   */
  function chooseColors() {
    const colorPicker = $('#notebook__color-picker');
    for (let i = 0; i < NUM_COLORS; i++) {
      const color = _getBackgroundColor();
      if (i === 0) {
        currentColor = color;
        _setBackgroundColor($('#notebook__text-area'));
      }
      const coloredDiv = $('<div>').css('backgroundColor', color);
      coloredDiv.click(setColor);
      colorPicker.append(coloredDiv);
    }
  }

  // CLICK HANDLERS

  /**
   * Save the text in the text area in a new note, or an existing one
   * if in edit state
   */
  function saveNote() {
    const noteToSave = $('#notebook__text-area').val();
    if (!noteToSave) {
      // do not create a blank note
      return;
    }

    let list = $('#notebook__list');
    if (!list.length) {
      const notes = $('#notebook__notes');
      list = $('<ul>').attr('id', 'notebook__list');
      notes.empty().append(list);
    }

    if (!currentNote) {
      currentNote = _createNote(noteToSave);
      list.append(currentNote);
    } else {
      const currentText = $(currentNote).children()[2];
      $(currentText).text(noteToSave);
    }

    _setBackgroundColor(currentNote);
    currentNote = undefined;

    // Clear out text area
    $('#notebook__text-area').val('');
  }

  /**
   * Allow user to edit a note in the text area
   */
  function editNote() {
    currentNote = $(this).parent();
    currentColor = $(currentNote).css('backgroundColor');
    _setBackgroundColor($('#notebook__text-area'));
    const textElem = $(currentNote).children()[2];
    const noteText = $(textElem).text();
    $('#notebook__text-area').val(noteText);
  }

  /**
   * Delete this note
   */
  function deleteNote() {
    $($(this).parent()).remove();
    currentNote = undefined;
  }

  /**
   * Set the text area background color to the selected color
   */
  function setColor() {
    currentColor = $(this).css('backgroundColor');
    _setBackgroundColor($('#notebook__text-area'));
  }

  // HELPERS

  /**
   * Generate a note with note text, edit and delete buttons
   * and attach handlers
   * @param {string} text - the note text
   * @return {object} the note element with text and buttons
   */
  function _createNote(noteText) {
    const note = $('<li>')
    .addClass('notebook__note')
    .css('backgroundColor', currentColor);
    const textElem = $('<pre>').text(noteText);
    const edit = $('<button>').html('Edit')
    .addClass('notebook__edit-action');
    const del = $('<button>').html('X')
    .addClass('notebook__delete-action');

    edit.click(editNote);
    del.click(deleteNote);

    return note.append(del)
    .append(edit)
    .append(textElem);
  }

  /**
   * Set the background color of an element with the current color
   * @param {object} elem - the element to set the color of
   */
  function _setBackgroundColor(elem) {
    elem.css('backgroundColor', currentColor);
  }

  /**
   * Return a random background color with .3 transparency
   * @return {string} the random color with .3 transparency
   */
  function _getBackgroundColor() {
    const randNum = () => Math.floor(Math.random() * 255);
    return `rgba(${randNum()},${randNum()},${randNum()},.3)`;
  }
})();