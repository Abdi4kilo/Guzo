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

	getShortest: function (departuer,destination) {
	this.unblock();
	var routes="";
	  try {
	  	routes=Routes.find({},{sort:{createdAt:-1}}).fetch();
	  	var count=Routes.find({}).count();
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
	 	var compareDepartuerResult=HTTP.call("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+departuer+"&destinations="+compareDepartuer+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
	 	var compareDestinationResult=HTTP.call("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+destination+"&destinations="+compareDestination+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
	  	if(compareDepartuerResult.statusCode==200 && compareDestinationResult.statusCode==200){
	 		var respJsonDepartuer=JSON.parse(compareDepartuerResult.content);
	 		var respJsonDestination=JSON.parse(compareDestinationResult.content);
	 		var countDistance=respJsonDepartuer.rows[0].elements.length;
	 		var DistanceBetweenDepartuer=[];
	 		var DistanceBetweenDestination=[];
	 	
			for(var j=0;j<countDistance;j++){
	 		 		if(respJsonDestination.rows[0].elements[j].status==="ZERO_RESULTS"){
	 		 			console.log('failed');
	 		 			continue;
	 		 		}
	 		 		var distance=respJsonDestination.rows[0].elements[j].distance.text;
	 		 		if(distance.indexOf("km">-1)){
	 		 			distance=(parseFloat(distance.replace("km",""))*1000).toString();
	 		 		}
	 		 		distance=distance.replace("m","");
	 		 		DistanceBetweenDestination.push(distance);
					destinationMap.push(j);
	 		}
	 		for(var j=0;j<countDistance;j++){
	 		 		if(respJsonDepartuer.rows[0].elements[j].status==="ZERO_RESULTS"){
	 		 			console.log('failed');
	 		 			continue;
	 		 		}
	 		 		var distance=respJsonDepartuer.rows[0].elements[j].distance.text;
	 		 		distance=distance.replace("km","");
	 		 		distance=distance.replace("m","");
	 		 		DistanceBetweenDepartuer.push(distance);
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
			 console.log(define);
	 		return define;
	 	}
	  
	  } catch (e) {
	  
	    return "error";
	  }
	}

	
});
