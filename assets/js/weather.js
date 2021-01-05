import $ from 'jquery';
const image11 = require('../images/weather/11.png');
const image09 = require('../images/weather/09.png');
const image10 = require('../images/weather/10.png');
const image13 = require('../images/weather/13.png');
const image01 = require('../images/weather/01.png');
const image02 = require('../images/weather/02.png');
const image03 = require('../images/weather/03.png');
const image04 = require('../images/weather/04.png');
const image50 = require('../images/weather/50.png');

$(document).ready(function() {

	let currentWeatherId = $('#infos1').data("id");
	let tomorrowWeatherId = $('#infos2').data("id");
	let weatherCode={};
	console.log(currentWeatherId);
	weatherCode['200']="thunderstorm with light rain";
	weatherCode['201']="thunderstorm with rain";
	weatherCode['202']="thunderstorm with heavy rain";
	weatherCode['210']="light thunderstorm";
	weatherCode['211']="thunderstorm";
	weatherCode['212']="heavy thunderstorm";
	weatherCode['221']="ragged thunderstorm";
	weatherCode['230']="thunderstorm with light drizzle"
	weatherCode['231']="thunderstorm with drizzle";
	weatherCode['232']="thunderstorm with heavy drizzle";
	weatherCode['300']="light intensity drizzle";
	weatherCode['301']="drizzle";
	weatherCode['302']="heavy intensity drizzle";
	weatherCode['310']="light intensity drizzle rain";
	weatherCode['311']="drizzle rain";
	weatherCode['312']="heavy intensity drizzle rain";
	weatherCode['313']="shower rain and drizzle";
	weatherCode['314']="heavy shower rain and drizzle";
	weatherCode['321']="shower drizzle";
	weatherCode['500']="light rain";
	weatherCode['501']="moderate rain";
	weatherCode['502']="heavy intensity rain";
	weatherCode['503']="very heavy rain";
	weatherCode['504']="extreme rain";
	weatherCode['511']="freezing rain";
	weatherCode['520']="light intensity shower rain";
	weatherCode['521']="shower rain";
	weatherCode['522']="heavy intensity shower rain";
	weatherCode['531']="ragged shower rain";
	weatherCode['600']="light snow";
	weatherCode['601']="Snow";
	weatherCode['602']="Heavy snow";
	weatherCode['611']="Sleet";
	weatherCode['612']="Light shower sleet";
	weatherCode['613']="Shower sleet";
	weatherCode['615']="Light rain and snow";
	weatherCode['616']="Rain and snow";
	weatherCode['620']="Light shower snow";
	weatherCode['621']="Shower snow";
	weatherCode['622']="Heavy shower snow";
	weatherCode['701']="mist";
	weatherCode['711']="Smoke";
	weatherCode['721']="Haze";
	weatherCode['731']="sand/ dust whirls";
	weatherCode['741']="fog";
	weatherCode['751']="sand";
	weatherCode['761']="dust";
	weatherCode['762']="volcanic ash";
	weatherCode['771']="squalls";
	weatherCode['781']="tornado";
	weatherCode['800']="clear sky";
	weatherCode['801']="few clouds: 11-25%";
	weatherCode['802']="scattered clouds: 25-50%";
	weatherCode['803']="broken clouds: 51-84%";
	weatherCode['804']="overcast clouds: 85-100%";
	

	let description_CurrentWeather=weatherCode[currentWeatherId];
	let description_TomorrowWeather=weatherCode[tomorrowWeatherId];

	let advice_CurrentWeather=getAdvice(currentWeatherId);
	let advice_TomorrowWeather=getAdvice(tomorrowWeatherId);

	let image_CurrentWeather=getImage(currentWeatherId);
	let image_TomorrowWeather=getImage(tomorrowWeatherId);


	let div_currentp=document.getElementById("currentp");
	let div_tomorrowp=document.getElementById("tomorrowp");

	let div_currentimg=document.getElementById("currentimg");
	let div_tomorrowimg=document.getElementById("tomorrowimg");

	let div_currenth4=document.getElementById("currenth4");
	let div_tomorrowh4=document.getElementById("tomorrowh4");


	div_currenth4.innerHTML=description_CurrentWeather;
	div_tomorrowh4.innerHTML=description_TomorrowWeather;

	div_currentp.innerHTML=advice_CurrentWeather;
	div_tomorrowp.innerHTML=advice_TomorrowWeather;

	div_currentimg.src=image_CurrentWeather;
	div_tomorrowimg.src=image_TomorrowWeather;

	function getAdvice(weatherId)
	{
		let advice="";
		switch(weatherId) {
			case 800:
			case 801:
		    	advice="It's sunny, you should enjoy it by going outdoors!";
		    break;
			case 601:
			case 602:
		    	advice="You should have a peek outside and feel the joy of the snow!";
		    break;
			default:
		    	advice="It's not the 'nicest' weather, you can use that opportunity to do some productive work. Stay safe!";
		} 
		return advice;
	}

	function getImage(weatherId)
	{
		let image;
		if(weatherId>=200 && weatherId<233)
		{
			image=image11;
		}
		else if(weatherId>=300 && weatherId<322 || weatherId>=520 && weatherId<532)
		{
			image=image09;
		}
		else if(weatherId>=500 && weatherId<505)
		{
			image=image10;
		}
		else if(weatherId>=600 && weatherId<623 || weatherId == 511)
		{
			image=image13;
		}
		else if(weatherId == 800)
		{
			image=image01;
		}
		else if(weatherId== 801)
		{
			image=image02;
		}
		else if(weatherId== 802)
		{
			image=image03;
		}
		else if(weatherId == 803 || weatherId == 804)
		{
			image=image04;
		}
		else
		{
			image=image50;
		}

		return image;
	}
});