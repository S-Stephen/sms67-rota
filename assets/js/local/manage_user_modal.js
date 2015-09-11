
$('#myModal1').on('show.bs.modal', function (event) {
  alert("showing the modal");
  var button = $(event.relatedTarget) // Button that triggered the modal
  var email = button.data('email') // Extract info from data-* attributes
  var username = button.data('username') // Extract info from data-* attributes
  var display_name = button.data('display_name') // Extract info from data-* attributes
  var id = button.data('id') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  if (username != "") modal.find('.modal-title').text('Edit record of '+username)
  modal.find('#email').val(email)
  modal.find('#username').val(username)
  modal.find('#display_name').val(display_name)
  modal.find('#id').val(id)
  
  //on submit call ajax and close
  //frmnewprovider=modal.find('form');
  // frmnewprovider.submit(function (e) {
    // e.preventDefault();
    // //frmnewprovider.validate();
    // //if (frmnewprovider.valid()) {
	// alert("DEBUg posting the new user");
        // $.ajax({
            // url: "/user",
            // type: "POST",
            // contentType: "application/json; charset=utf-8",
            // data: JSON.stringify({
                // username: frmnewprovider.find('#username').val(),
                // email: frmnewprovider.find('#email').val(),
                // display_name: frmnewprovider.find('#display_name').val()
            // }),
            // success: function (result) {
                // //if record was added to db, then...
                // //window.location.replace('/Providers/Index'); //we can redirect
                // //or simply close our modal.
                // modal.modal('hide');
            // },
            // error: function(result) {
                // alert('error '+result);
            // }
        // });
    // //}
  // });
});
var frmnewprovider = $("#update-user-form");


$('#rotaModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  rot_code = button.data('rot_code') // Extract info from data-* attributes
  rot_description = button.data('rot_description') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  if ( rot_code != '' ) modal.find('.modal-title').text('Edit record of '+rot_code)
  modal.find('#rot_code').val(rot_code)
  modal.find('#rot_description').val(rot_description)
  
  //on submit call ajax and close
  //frmnewprovider=modal.find('form');
  frmrotaprovider.submit(function (e) {
    e.preventDefault();
    //frmnewprovider.validate();
    //if (frmnewprovider.valid()) {
	alert("DEBUg posting the new user");
        $.ajax({
            url: "/rota",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                rot_code: frmrotaprovider.find('#rot_code').val(),
                rot_description: frmrotaprovider.find('#rot_description').val(),
            }),
            success: function (result) {
                //if record was added to db, then...
                //window.location.replace('/Providers/Index'); //we can redirect
                //or simply close our modal.
                modal.modal('hide');
            },
            error: function(result) {
                alert('error '+result);
            }
        });
    //}
  });
});
var frmrotaprovider = $("#update-rota-form");

$(document).ready(function () {
});