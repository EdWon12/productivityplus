import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {Draggable} from '@fullcalendar/interaction';
import '../css/calendar.scss';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

document.addEventListener('DOMContentLoaded', function() {
	var calendarEl = document.getElementById('calendar');


	var calendar;
  	// value = backgroundColors; key=isGood.id;
  	var backgroundcolors=[];
  	backgroundcolors[1]='#00e600';
  	backgroundcolors[2]='#ff0000';
  	backgroundcolors[3]='#999999';
  	function mobileCheck() {
        if (window.innerWidth >= 768 && window.innerHeight >= 768) {
            return false;
        } else {
            return true;
        }
    };



  	//gets and initiates draggable events
  	let draggableEvents;
  	let xmlhttp = new XMLHttpRequest();
  	xmlhttp.onreadystatechange = function() {
  		if(xmlhttp.readyState ==4){
  			if(xmlhttp.status==200){
  				draggableEvents = JSON.parse(xmlhttp.responseText);
  				for (let [key, value] of Object.entries(draggableEvents)) {
  					var div = document.createElement("div");
  					var divContainer= document.createElement("div");//adding one more div level to the draggable makes us able to make the last level not glitch (requires text-align:left) but we can still position it however we want

  					div.className+="text-left"; //necessary so the dragging clone isn't glitchy
  					div.style.display = 'inline'; //necessary because bootstrap uses !important

  					div.id = "draggable"+key;
  					div.innerHTML=draggableEvents[key]['title'] ; 
  					divContainer.appendChild(div)
  					document.getElementById('draggablesContainer').appendChild(divContainer);
					draggableEvents[key]['duration']='00:20'; //default duration
					let draggableEvent = new Draggable(document.getElementById("draggable"+key), {
						eventData: draggableEvents[key]
					})
				}
				//gets calendar events and their start/end times and initiates the whole calendar
				let calendarEvents=[];
				let xmlhttp1 = new XMLHttpRequest();
				xmlhttp1.onreadystatechange = function() {
					if(xmlhttp1.readyState ==4){
						if(xmlhttp1.status==200){
							calendarEvents = JSON.parse(xmlhttp1.responseText);
							for (let [key, value] of Object.entries(calendarEvents)) {
								calendarEvents[key]['backgroundColor']=backgroundcolors[calendarEvents[key]['isGood']];
								calendarEvents[key]['title']=draggableEvents[calendarEvents[key]['idActivity']]['title'];
								calendarEvents[key]['start']=new Date(calendarEvents[key]['start']).toISOString();
								calendarEvents[key]['end']=new Date(calendarEvents[key]['end']).toISOString();
							}
							calendar = new Calendar(calendarEl, {
								plugins: [ dayGridPlugin,timeGridPlugin, interactionPlugin],
								views: {
					                eightDays: {
					                    type: 'timeGrid',
					                    visibleRange: function(currentDate){
											var startDate = new Date(currentDate.valueOf());
											var endDate = new Date(currentDate.valueOf());
											startDate.setDate(startDate.getDate() - 4);
											return { start: startDate, end: endDate };
										}
					                }
					            },
								events: calendarEvents,
								header: false,
								defaultView: mobileCheck() ? 'eightDays' : 'timeGrid',
								editable: true,
								droppable: true,
								eventOverlap: false,
								slotDuration: '00:10:00',
								displayEventEnd:true,

								visibleRange: function(currentDate){
									var startDate = new Date(currentDate.valueOf());
									var endDate = new Date(currentDate.valueOf());
									startDate.setDate(startDate.getDate() - 6);
									return { start: startDate, end: endDate };
								},
								locale: 'en',
								allDaySlot: false,
								nowIndicator: true,
								eventConstraint:{
          							startTime: '00:00',
         							endTime: '24:00', 
     							},
								eventReceive: function(infos) {	// gets called when draggables are added to the calendar
									infos.event.setExtendedProp('idActivity', infos.event._def.publicId);
									var dialog = $('<p>Is it productive?</p>').dialog({
										closeOnEscape: false,
										modal: true,
										open: function(event, ui) {
											$(this).parent().children().children('.ui-dialog-titlebar-close').hide();
										},
										buttons: {
											"Yes": function() {
												infos.event.setExtendedProp('isGood', 1);
												infos.event.setProp("backgroundColor",backgroundcolors[1]);
												dialog.dialog('close');
											},
											"No":  function() {
												infos.event.setExtendedProp('isGood', 2);
												infos.event.setProp("backgroundColor",backgroundcolors[2]);
												dialog.dialog('close');
											},
											"Neutral":  function() {
													infos.event.setExtendedProp('isGood', 3);
													infos.event.setProp("backgroundColor",backgroundcolors[3]);
													dialog.dialog('close');
											}
										},
										close: function(){
											var http = new XMLHttpRequest();
											var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+'/newaction';
											var params = infos.event.extendedProps;
											params['start']=infos.event.start.toISOString();
											params['end']=infos.event.end.toISOString();
											http.open('POST', url, true);

											//Send the proper header information along with the request
											http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

											http.onreadystatechange = function() {//Call a function when the state changes.
												if(http.readyState == 4 && http.status == 200) {
													infos.event.setExtendedProp('idAction' ,JSON.parse(http.responseText)['id']);
												}
											}
											http.send(JSON.stringify(params));

										}
									});
								},
								eventResize: function(infos){editTimespan(infos)},
								eventDrop: function(infos){editTimespan(infos)},
								eventRender: function(infos) {
									//adding a delete button
									$(infos.el).find(".fc-bg").css("pointer-events","none");
							    	$(infos.el).append("<div style='position:absolute;bottom:0px;right:0px;z-index:5;' ><button type='button'  id='btnDeleteEvent'>X</button></div>" );	//change the button size so it works even when the duration < 10min
							    	$(infos.el).find("#btnDeleteEvent").click(function(){var http = new XMLHttpRequest();
							    		var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+'/delaction';
							    		var params={"id": infos.event.extendedProps.idAction};
							    		http.open('POST', url, true);

										//Send the proper header information along with the request
										http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

										http.onreadystatechange = function() {//Call a function when the state changes.
											if(http.readyState == 4 && http.status == 200) {
												infos.event.remove();
											}
										}
										http.send(JSON.stringify(params));
									});
							    },


							});

							calendar.render();
							calendar.updateSize();
						}
					}
				}
				xmlhttp1.open('get', location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+'/actions', true)
				xmlhttp1.send(null)
				
			}
		}
	}
	xmlhttp.open('get', location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+'/activities', true)
	xmlhttp.send(null)



	
});

//uses POST to update "start" and "end" times, executed on a few callbacks
function editTimespan(infos){
	var http = new XMLHttpRequest();
	var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+'/edtaction';
	var params={"id": infos.event.extendedProps.idAction, "start":infos.event.start.toISOString(), "end":infos.event.end.toISOString()};
	http.open('POST', url, true);

	//Send the header information along with the request
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
		}
	}
	http.send(JSON.stringify(params));
}

