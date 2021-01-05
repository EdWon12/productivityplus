export 
class ActionsGroupment{
	constructor(){
		//arrays of actions
		this.positive={};
		this.negative={};
		this.neutral={};
		this.nodata=0; //in minutes
	}

	addActions(data) // the input matches the format of getAll output, and it checks for the presence of 'nodata' key in the array to do the proper changes on the nodata property -- also it merges actions with same name and adds up  the durations
	{
		if ("nodata" in data){	//checks if it s an output of this class -- if not it s a single day
			this.nodata+=data["nodata"];
			for (let [key, value] of Object.entries(data['positive'])) {
				if(this.positive.hasOwnProperty(value['name']))
				{
					this.positive[value['name']]+=value['duration'];
				}
				else
				{
					this.positive[value['name']]=value['duration'];
				}
			}
			for (let [key, value] of Object.entries(data['negative'])) {
				if(this.negative.hasOwnProperty(value['name']))
				{
					this.negative[value['name']]+=value['duration'];
				}
				else
				{
					this.negative[value['name']]=value['duration'];
				}
			}
			for (let [key, value] of Object.entries(data['neutral'])) {
				if(this.neutral.hasOwnProperty(value['name']))
				{
					this.neutral[value['name']]+=value['duration'];
				}
				else
				{
					this.neutral[value['name']]=value['duration'];
				}
			}
		}
		else
		{
			let nodataduration=1440; //in order to add the missing data duration of the day 
			for (let [key, value] of Object.entries(data['positive'])) {
				nodataduration-=value['duration'];
				if(this.positive.hasOwnProperty(value['name']))
				{
					this.positive[value['name']]+=value['duration'];
				}
				else
				{
					this.positive[value['name']]=value['duration'];
				}
			}
			for (let [key, value] of Object.entries(data['negative'])) {
				nodataduration-=value['duration'];
				if(this.negative.hasOwnProperty(value['name']))
				{
					this.negative[value['name']]+=value['duration'];
				}
				else
				{
					this.negative[value['name']]=value['duration'];
				}
			}
			for (let [key, value] of Object.entries(data['neutral'])) {
				nodataduration-=value['duration'];
				if(this.neutral.hasOwnProperty(value['name']))
				{
					this.neutral[value['name']]+=value['duration'];
				}
				else
				{
					this.neutral[value['name']]=value['duration'];
				}
			}
			this.nodata+=nodataduration;
		}
	}


	getAll()
	{
		let obj={};
		obj['positive']=[];
		obj['negative']=[];
		obj['neutral']=[];
		obj['nodata']=this.nodata;
		for (let [key, value] of Object.entries(this.positive)) {
			obj['positive'].push({name:key , duration:value});
		}
		for (let [key, value] of Object.entries(this.negative)) {
			obj['negative'].push({name:key , duration:value});
		}
		for (let [key, value] of Object.entries(this.neutral)) {
			obj['neutral'].push({name:key , duration:value});
		}

		return obj;
	}

}

function YMDArr()	//creates object with year,month,day as keys for  the past year
{
	var date = new Date();
	var end =  new Date(date);
	end.setFullYear(end.getFullYear() - 5);
	end.setDate(0);
	var array = {};
	while(date > end){
		var day=date.getDate();
		var month=date.getMonth()+1;
		var year=date.getFullYear();
		if (array[year] == undefined)
		{
			array[year]={};
		}
		if (array[year][month] == undefined)
		{
			array[year][month]={};
		}
		array[year][month][day]={};
	    array[year][month][day]['positive']=[];
	    array[year][month][day]['negative']=[];
	    array[year][month][day]['neutral']=[];
	    date.setDate(date.getDate() - 1);
	}
	return array;
}


export function hydrateEvents(events)	//gives us the format we want, also calculates the duration of events
{ 
		let myarr = YMDArr();
		for (let [key, value] of Object.entries(events)) {
			let start=new Date(value['start']*1000);
			let end=new Date(value['end']*1000);
			//makes it timezone responsive
			start.setMinutes(start.getMinutes()-start.getTimezoneOffset());
			end.setMinutes(end.getMinutes()-end.getTimezoneOffset());

			let duration=(end.getTime()-start.getTime())/60000;
			switch(value['isgood']) {
		  		case 1:
		    	myarr[start.getFullYear()][start.getMonth()+1][start.getDate()]['positive'].push({name:value['name'] , duration:duration });
		    	break;
		  		case 2:
		   		myarr[start.getFullYear()][start.getMonth()+1][start.getDate()]['negative'].push({name:value['name'] , duration:duration });
		    	break;
		    	case 3:
		   		myarr[start.getFullYear()][start.getMonth()+1][start.getDate()]['neutral'].push({name:value['name'] , duration:duration });
		    	break;
			}
		}
		return myarr;
}