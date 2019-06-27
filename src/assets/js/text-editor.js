function loadTextEditor() {
  //Bootstrap 4 + daemonite material UI + Summernote wysiwyg text editor
//doc : https://github.com/summernote/summernote

  $('#my-summernote').summernote({
    minHeight: 200,
    placeholder: 'Write here ...',
    focus: false,
    airMode: false,
    fontNames: ['Roboto', 'Calibri', 'Times New Roman', 'Arial'],
    fontNamesIgnoreCheck: ['Roboto', 'Calibri'],
    dialogsInBody: true,
    dialogsFade: true,
    disableDragAndDrop: false,
    toolbar: [
      // [groupName, [list of button]]
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['style', 'ul', 'ol', 'paragraph']],
      ['fontsize', ['fontsize']],
      ['font', ['strikethrough', 'superscript', 'subscript']],
      ['height', ['height']],
      ['misc', ['undo', 'redo', 'print', 'help', 'fullscreen']]
    ],
    popover: {
      air: [
        ['color', ['color']],
        ['font', ['bold', 'underline', 'clear']]
      ]
    },
    print: {
      //'stylesheetUrl': 'url_of_stylesheet_for_printing'
    }
  });
//$('#my-summernote2').summernote({airMode: true,placeholder:'Try the airmode'});

}
