jQuery('.icon-remove').click(function(event) { //GET ID-- FROM ID REMOVE ROWS.
    //hide data then fire remove
    var id = $(this).attr('value');
    $('#'+id).hide();
});