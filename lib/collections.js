Routes=new Mongo.Collection('routes');

Meteor.methods({

	addRoutes: function(departuer,destination,date){
		
		Routes.insert({
			start:departuer,
			end:destination,
			travelDate:date,
			createdAt:new Date()
		});
	},

	getShortest: function (departuer,destination,date) {
	this.unblock();
	var routes="";
	  try {

		var dd = date.getDate();
		var ddsecond=date.getDate()+1;
		var mm = date.getMonth()+1; //January is 0!
		var yyyy = date.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		} 
		if(ddsecond<10) {
		    dd='0'+dd
		} 
		if(mm<10) {
		    mm='0'+mm
		} 

		today = mm+'/'+dd+'/'+yyyy;
		tommorrow=mm+'/'+ddsecond+'/'+yyyy;
		//console.log(today);
	  	routes=Routes.find({travelDate:{"$gte":new Date(today),"$lt":new Date(tommorrow)}}).fetch();
	  	console.log(routes);
	  	var count=routes.length;
	  	var compareDepartuer="";
	  	var compareDestination="";
	  	for(var i=0;i<count;i++){
	  		if(i==(count-1)){
	  			compareDepartuer+=routes[i].start;	
	  			compareDestination+=routes[i].end;
	  		}else{
	  			compareDepartuer+=routes[i].start+"|";	
	  			compareDestination+=routes[i].end+"|";
	  		}
	  	}
	  	var	departuerMap=[];
	  	var	destinationMap=[];
	  	console.log("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+departuer+"&destinations="+compareDepartuer+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
	  	console.log("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+destination+"&destinations="+compareDestination+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
	 	var compareDepartuerResult=HTTP.call("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+departuer+"&destinations="+compareDepartuer+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
	 	var compareDestinationResult=HTTP.call("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+destination+"&destinations="+compareDestination+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
	  	if(compareDepartuerResult.statusCode==200 && compareDestinationResult.statusCode==200){
	 		var respJsonDepartuer=JSON.parse(compareDepartuerResult.content);
	 		var respJsonDestination=JSON.parse(compareDestinationResult.content);
	 		var countDistance=respJsonDepartuer.rows[0].elements.length;
	 		var DistanceBetweenDepartuer=[];
	 		var DistanceBetweenDestination=[];
	 	
			for(var j=0;j<countDistance;j++){
	 		 		if(respJsonDestination.rows[0].elements[j].status==="ZERO_RESULTS" || respJsonDepartuer.rows[0].elements[j].status==="ZERO_RESULTS"){
	 		 			console.log('failed');
	 		 			continue;
	 		 		}
	 		 		var distanceDest=respJsonDestination.rows[0].elements[j].distance.text;
	 		 		var distanceDep=respJsonDepartuer.rows[0].elements[j].distance.text;
	 		 		if(distanceDest.indexOf("km">-1)){
	 		 			distanceDest=(parseFloat(distanceDest.replace("km",""))*1000).toString();
	 		 		}
	 		 		if(distanceDep.indexOf("km">-1)){
	 		 			distanceDep=(parseFloat(distanceDep.replace("km",""))*1000).toString();
	 		 		}
	 		 		distanceDest=distanceDest.replace("m","");
	 		 		distanceDep=distanceDep.replace("m","");
	 		 		DistanceBetweenDestination.push(distanceDest);
	 		 		DistanceBetweenDepartuer.push(distanceDep);
					destinationMap.push(j);
					departuerMap.push(j);
	 		}
	 		var sortedDistance=[];
			var all=[];
			for(var k=0;k<departuerMap.length;k++){
				var total=parseFloat(((parseFloat((DistanceBetweenDepartuer[k]))+(parseFloat(DistanceBetweenDestination[k])))/1000).toFixed(2));
	 		 	sortedDistance.push(total);
	 		 	var obj={};
	 	 	 	obj['distance']=total;
	 	 	 	obj['index']=departuerMap[k];
	 	 	 	all.push(obj);
			}
			all.sort(function(a,b){return a.distance-b.distance});
		 	 
		 	
			  var define=[];
			for(var z=0;z<all.length;z++){
				 var temp=routes[all[z].index];
				 temp.distance=all[z].distance;
				 define.push(temp);
			 }
			// console.log(define);
	 		return define;
	 	}
	  
	  } catch (e) {
	  
	    return "error";
	  }
	}

	
});
