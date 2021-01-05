import {GoogleCharts} from 'google-charts';
import { ActionsGroupment } from './_actionsGroupment.js';
import { hydrateEvents } from './_actionsGroupment.js';
import $ from 'jquery';






$(document).ready(function() {
	$('#next').click( function() 
	{
		if(selectedView==1)	//if monthly view -- the initiated value (nextMonth in this if() ) is a Date object unlike for the yearly view so it makes sure it is a valid date by itself
		{
			let nextMonth = new Date(selectedYear, selectedMonth+1, 1);
			if(nextMonth <= today)
			{
				if(nextMonth.getMonth()==today.getMonth() && nextMonth.getFullYear()==today.getFullYear())
				{
					 $('#next').prop('disabled',true); 
				}
				selectedMonth=nextMonth.getMonth();
				selectedYear=nextMonth.getFullYear();
				selectedChartsData = monthlyChartsData(events);
				loadCharts1and2(selectedYear+"/"+(selectedMonth+1));
				$('#previous').prop('disabled',false); 
			}
		}
		else	//if yearly view
		{
			let nextYear = selectedYear+1;
			if(nextYear<=today.getFullYear())
			{
				if(nextYear==today.getFullYear())
				{
					$('#next').prop('disabled',true); 
				}
				selectedYear=nextYear;
				selectedChartsData = yearlyChartsData(events);
				loadCharts1and2(selectedYear);
				$('#previous').prop('disabled',false); 
			}
		}
	});
	$('#previous').click( function() 
	{
		if(selectedView==1)
		{
			let previousMonth = new Date(selectedYear, selectedMonth, 0);
			if(events.hasOwnProperty(previousMonth.getFullYear()) && events[previousMonth.getFullYear()].hasOwnProperty(previousMonth.getMonth()+1))
			{
				if(previousMonth.getFullYear()==getMin(events) && previousMonth.getMonth()+1==getMin(events[previousMonth.getFullYear()]))
				{
					$('#previous').prop('disabled',true); 
				}
				selectedMonth=previousMonth.getMonth();
				selectedYear=previousMonth.getFullYear();
				selectedChartsData = monthlyChartsData(events);
				loadCharts1and2(selectedYear+"/"+(selectedMonth+1));
				$('#next').prop('disabled',false); 
			}
		}
		else
		{
			let previousYear = selectedYear-1;
			if(events.hasOwnProperty(previousYear))
			{
				if(previousYear == getMin(events))
				{
					$('#previous').prop('disabled',true); 
				}
				selectedYear=previousYear;
				selectedChartsData = yearlyChartsData(events);
				loadCharts1and2(selectedYear);
				$('#next').prop('disabled',false); 
			}
		}
	});
	$('#yearly').click( function() 
	{
		selectedYear=today.getFullYear();
		selectedView=0;
		selectedChartsData = yearlyChartsData(events);
		loadCharts1and2(selectedYear);
		$('#next').prop('disabled',true);
		$('#previous').prop('disabled',false);
	});
	$('#monthly').click( function() 
	{
		selectedYear=today.getFullYear();
		selectedMonth=today.getMonth();
		selectedView=1;
		selectedChartsData = monthlyChartsData(events);
		loadCharts1and2(selectedYear+"/"+(selectedMonth+1));
		$('#next').prop('disabled',true);
		$('#previous').prop('disabled',false);
	});



    let allEvents = $('#infos').data("stats");
    
    let events = hydrateEvents(allEvents);

    console.log(events);


    let today = new Date();
    let aYearAgo= new Date();
    let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
    aYearAgo.setFullYear(aYearAgo.getFullYear()-1);
    let aWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate()-6); 

    //for static piechart
    let last7days=getPieChartData(events, aWeekAgo, tomorrow);

	
    GoogleCharts.load(function(){drawChart(last7days, "chart3", "last 7 days")});

    //default
    let selectedYear = today.getFullYear();
    let selectedMonth = today.getMonth();
    let selectedChartsData = monthlyChartsData(events);
    let selectedView = 1; // 0 for yearly 1 for monthly
    loadCharts1and2(today.getFullYear()+"/"+(today.getMonth()+1));
    $('#next').prop('disabled',true);

	

	function drawChart(data, element, title) 
	{
		data = GoogleCharts.api.visualization.arrayToDataTable(data);

		let view = new GoogleCharts.api.visualization.DataView(data);
		let options = {};
		let chart;
		switch (element) {
		  case "chart1":
		    options = {
				title: title,
			    //width: 1000,
			    //height: 800,
			    bar: {groupWidth: "95%"},
			    isStacked: true,
			    legend: { position: "none" }, 
			    hAxis: {slantedText:true, slantedTextAngle:90},
			};
			chart = new GoogleCharts.api.visualization.ColumnChart(document.getElementById(element));
		    break;
		  default:
		    options = {
				title: title,
			    //width: 850,
			    //height: 600,
			    bar: {groupWidth: "95%"},
			    legend: { position: "none" }, 
			    slices:{
			    	0: {color:'green'},
			    	1: {color:'red'},
			    	2: {color:'gray'},
			    	3: {color:'#e6e6e6'}
			    },
			};
			chart = new GoogleCharts.api.visualization.PieChart(document.getElementById(element));
		}
		chart.draw(view, options);
	}

	function loadCharts1and2(title)
	{
		GoogleCharts.load(function(){drawChart(selectedChartsData['columnChartData'] , "chart1", title)});
		GoogleCharts.load(function(){drawChart(selectedChartsData['pieChartData'] , "chart2", "Total for "+title)});
	}

	function monthlyChartsData(events)		//for given month
	{
		//for total pie chart
	    let start=new Date(selectedYear, selectedMonth, 1);
	    let end= new Date(selectedYear,selectedMonth, getMax(events[selectedYear][selectedMonth+1])+1);
	    let totalMonth=getPieChartData(events, start, end);

	    return {columnChartData:getColumnChartData(events, selectedYear, selectedMonth) , pieChartData:totalMonth};//returns monthly charts data tables
	}


	function yearlyChartsData(events)		//for given year							    
	{

		//for total pie chart
		let start=new Date(selectedYear, getMin(events[selectedYear])-1, 1);
		let endMonth=getMax(events[selectedYear]);
		let end=new Date(selectedYear, endMonth-1, getMax(events[selectedYear][endMonth]));
		let totalYear=getPieChartData(events, start, end);

		return {columnChartData:getColumnChartData(events, selectedYear, undefined) , pieChartData:totalYear}; //returns yearly charts data tables
	}

	//combines the data for the column charts
	function getColumnChartData(events, selectedYear, selectedMonth)
	{
		let data=[];
		let arrayOfActions=[];
		data.push(["Timespan", "Positive", { role: "tooltip"}, { role: "style" }, "Negative", { role: "tooltip"}, { role: "style" }, "Neutral", { role: "tooltip"}, { role: "style" }, "No data", { role: "tooltip"}, { role: "style" } ]);	//chart columns
		if(typeof selectedMonth === 'undefined')	//makes the function work for monthly and yearly chart
		//hydrates events parameter data into arrayofactions array
		{
			for (let [monthKey, month] of Object.entries(events[selectedYear])) {
				let groupment=new ActionsGroupment();    	
				for (let [dayKey, day] of Object.entries(month)) {
					groupment.addActions(day);
				}
				arrayOfActions[monthKey]=groupment.getAll();
			}
		}
		else
		{
			for (let [key, value] of Object.entries(events[selectedYear][selectedMonth+1])) {
		    	let groupment= new ActionsGroupment();
		    	groupment.addActions(value);
		    	arrayOfActions[key]=groupment.getAll();
		    }
		}
		arrayOfActions.forEach(function(item, index){

			let timespan=index.toString();
			let positiveTime=0;
			let positiveTooltip="";
			let positiveColor="#00e600";
			let negativeTime=0;
			let negativeTooltip="";
			let negativeColor="#ff0000";
			let neutralTime=0;
			let neutralTooltip="";
			let neutralColor="#999999";
			let nodataTime=arrayOfActions[index]['nodata']/60;
			let nodataTooltip="NO DATA\n The time that has no action associated: "+minutesToHoursMinutesStr(arrayOfActions[index]['nodata']);
			let nodataColor="#eeeeee";

			arrayOfActions[index]['positive'].forEach(function(_item, _index){
				positiveTime+=_item['duration']/60;
				if(positiveTooltip != ""){
					positiveTooltip+="\n ";
				}
				else
				{
					positiveTooltip+="POSITIVE\n ";
				}
				positiveTooltip+=_item['name']+": "+minutesToHoursMinutesStr(_item['duration']);
			});
			arrayOfActions[index]['negative'].forEach(function(_item, _index){
				negativeTime+=_item['duration']/60;
				if(negativeTooltip != ""){
					negativeTooltip+="\n ";
				}
				else
				{
					negativeTooltip+="NEGATIVE\n ";
				}
				negativeTooltip+=_item['name']+": "+minutesToHoursMinutesStr(_item['duration']);
			});
			arrayOfActions[index]['neutral'].forEach(function(_item, _index){
				neutralTime+=_item['duration']/60;
				if(neutralTooltip != ""){
					neutralTooltip+="\n ";
				}
				else
				{
					neutralTooltip+="NEUTRAL\n ";
				}
				neutralTooltip+=_item['name']+": "+minutesToHoursMinutesStr(_item['duration']);
			});
			let responseArr=[timespan , positiveTime, positiveTooltip, positiveColor, negativeTime, negativeTooltip, negativeColor , neutralTime, neutralTooltip, neutralColor , nodataTime ,nodataTooltip, nodataColor];
			data.push(responseArr);
		});
		return data;
	}

	//returns max key of object
	function getMax(obj) 
	{	
		return Math.max.apply(null,Object.keys(obj));
	}

	//returns min key of object
	function getMin(obj) 
	{
		return Math.min.apply(null,Object.keys(obj));
	}


	function minutesToHoursMinutesStr(minutes)
	{
		let str=minutes%60;
		str=(minutes-str)/60+"h"+str+"m";
		return str;
	}

	//combines the data for the pie charts
	function getPieChartData(calendar, start, end)
	{
		let groupment = new ActionsGroupment();
		while(start < end)
		{
			groupment.addActions(calendar[start.getFullYear()][start.getMonth()+1][start.getDate()]);
			start.setDate(start.getDate()+1);
		}
		let events=groupment.getAll();
		let positiveTime=0;
		let positiveTooltip="";
		let positiveColor="#00e600";
		let negativeTime=0;
		let negativeTooltip="";
		let negativeColor="#ff0000";
		let neutralTime=0;
		let neutralTooltip="";
		let neutralColor="#999999";
		let nodataTime=events['nodata']/60;
		let nodataTooltip="NO DATA\n The time that has no action associated: "+minutesToHoursMinutesStr(events['nodata']);
		let nodataColor="#ffffff";
		let data=[];
		events['positive'].forEach(function(item, index){
			positiveTime+=item['duration']/60;
			if(positiveTooltip != ""){
				positiveTooltip+="\n ";
			}
			else
			{
				positiveTooltip+="POSITIVE\n ";
			}
			positiveTooltip+=item['name']+": "+minutesToHoursMinutesStr(item['duration']);

		});
		events['negative'].forEach(function(item, index){
			negativeTime+=item['duration']/60;
			if(negativeTooltip != ""){
				negativeTooltip+="\n ";
			}
			else
			{
				negativeTooltip+="NEGATIVE\n ";
			}
			negativeTooltip+=item['name']+": "+minutesToHoursMinutesStr(item['duration']);

		});
		events['neutral'].forEach(function(item, index){
			neutralTime+=item['duration']/60;
			if(neutralTooltip != ""){
				neutralTooltip+="\n ";
			}
			else
			{
				neutralTooltip+="NEUTRAL\n ";
			}
			neutralTooltip+=item['name']+": "+minutesToHoursMinutesStr(item['duration']);

		});
		data.push(["Isgood", "Time", { role: "tooltip"}, { role: "style" }]);
		data.push(["Positive" , positiveTime, positiveTooltip, positiveColor]);
		data.push(["Negative", negativeTime, negativeTooltip, negativeColor]);
		data.push(["Neutral", neutralTime, neutralTooltip, neutralColor]);
		data.push(["No data", nodataTime , nodataTooltip, nodataColor]);
		return data;
	}

});