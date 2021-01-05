import $ from 'jquery';


document.addEventListener('DOMContentLoaded', function() {


	$("#contact_submit").on("click", function()
		{
			if(validateEmail($("#contact_email").val()) )
			{
				send();
			}
			else
			{
				$("#contact_email").val("Error - Invalid email");
			}
		});



	function validateEmail(email) {
	    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    console.log(re.test(String(email).toLowerCase()));
	    return re.test(String(email).toLowerCase());
	}


	function send(){
		var http = new XMLHttpRequest();
		var url = 'http://127.0.0.1:8000/Contact';
		var params = {};
		params['email']=$("#contact_email").val();
		params['message']=$("#contact_message").val();
		http.open('POST', url, true);

		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				$('#contact_modal').modal('toggle');
				alert("Message sent!");
			}
		}
		http.send(JSON.stringify(params));

	}
});