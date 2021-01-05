import $ from 'jquery';

$(document).ready(function() {
	let activities = $('#activities').data("activities");

	hydrateTextboxes();

	$('#edt_activity_idActivity').change(hydrateTextboxes);

	//changes the content of the textboxes in the form for the current selected activity
	function hydrateTextboxes(){
	    $('#edt_activity_name').val(activities[$('#edt_activity_idActivity').val()]["name"]);
	    $('#edt_activity_description').val(activities[$( "#edt_activity_idActivity" ).val()]["description"]);
	}
});