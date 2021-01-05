import { ActionsGroupment } from './_actionsGroupment.js';
import { hydrateEvents } from './_actionsGroupment.js';
import $ from 'jquery';




$(document).ready(function() {
	let allEvents = $('#infos').data("stats");
	let events = hydrateEvents(allEvents);
	let activityNames = $('#names').data("names");
	activityNames.forEach(function(item, index){
		$('#activity').append("<option value=\""+index+"\">"+item+"</option>")
	});
	$('#activity').on('change', function() {
		let selected_Data=averageActivityInfluence(activityNames[this.value]);
		$('#positive').html("Positive: "+selected_Data['positive'].toFixed(2)+" minute(s)");
		$('#negative').html("Negative: "+selected_Data['negative'].toFixed(2)+" minute(s)");
		$('#neutral').html("Neutral: "+selected_Data['neutral'].toFixed(2)+" minute(s)");
		$('#nodata').html("No data: "+selected_Data['nodata'].toFixed(2)+" minute(s)");
	});
	$('#activity').trigger("change");
	
	console.log(averageActivityInfluence("activity1"));


	function averageActivityInfluence(activity_name)	//returns how 1 hour of an activity influences the productivity of a day on average
	{
		let positive = 0;
		let negative = 0;
		let neutral = 0;
		let nodata= 0;
		let coefTotal=0;

		for (let [year, months] of Object.entries(events)) {
			for (let [month, days] of Object.entries(months)) {
				for (let [day, dayValue] of Object.entries(days)) {	
					for (let [isgoodKey, event] of Object.entries(dayValue)) {
						for (var i = event.length - 1; i >= 0; i--) {
							//console.log(event[i]['name']);
							if(event[i]['name'] == activity_name){
								let obj=new ActionsGroupment();
								obj.addActions(dayValue);
								let processedDataForDay = getProductivityPerDay(obj);
								let coef=event[i]['duration'];
								coefTotal+=coef;
								positive+=processedDataForDay['positive']*coef;
								negative+=processedDataForDay['negative']*coef;
								neutral+=processedDataForDay['neutral']*coef;
								nodata+=processedDataForDay['nodata']*coef;
							}
						}
						
					}
				}
			}
		}

		positive=positive/coefTotal;
		negative=negative/coefTotal;
		neutral=neutral/coefTotal;
		nodata=nodata/coefTotal;

		return {'positive': positive, 'negative': negative, 'neutral': neutral, 'nodata': nodata};
	}

	function getProductivityPerDay(day){	//day is an ActionsGroupment instance , returns the total of productivity for the day
		let positive=0;
		let negative=0;
		let neutral=0;
		let nodata=day['nodata'];
		for (let [event, duration] of Object.entries(day['positive'])) {
			positive+=duration;
		}
		for (let [event, duration] of Object.entries(day['negative'])) {
			negative+=duration;
		}
		for (let [event, duration] of Object.entries(day['neutral'])) {
			neutral+=duration;
		}
		return {positive: positive, negative: negative, neutral: neutral, nodata: nodata};
	}

});


