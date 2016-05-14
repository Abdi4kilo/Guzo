Routes=new Mongo.Collection('routes');

Meteor.methods({

	addRoutes: function(departuer,destination){

		Routes.insert({
			start:departuer,
			end:destination,
			createdAt:new Date()
		});
	},

		checkTwitter: function (departuer,destination) {
		this.unblock();
		var routes="";
		  try {
		  	routes=Routes.find({},{sort:{createdAt:-1}}).fetch();
		  	var count=Routes.find({}).count();
		  	var destinationApi="";
		  	var destinationsArray=[];
		  	for(var i=0;i<count;i++){
		  		if(i==(count-1)){
		  			destinationApi+=routes[i].start;	
		  		}else{
		  			destinationApi+=routes[i].start+"|";	
		  		}
		  		destinationsArray.push(routes[i].start);
		  		
		  	}
		  	var myMap=new Map();
		  	var myNew=new Map();
		  	var result=HTTP.call("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+destination+"&destinations="+destinationApi+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
		  	console.log("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+destination+"&destinations="+destinationApi+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
		 	if(result.statusCode==200){
		 		var respJson = JSON.parse(result.content);
		 		var countDistance=respJson.rows[0].elements.length;
		 		var eachDistance=[];
		 		 for(var j=0;j<countDistance;j++){
		 		 		if(respJson.rows[0].elements[j].status==="ZERO_RESULTS"){
		 		 			console.log('failed');
		 		 			continue;
		 		 		}
		 		 		var distance=respJson.rows[0].elements[j].distance.text;
		 		 		distance=distance.replace("km","");
		 		 		distance=distance.replace("m","");
		 		 		eachDistance.push(distance);
		 		 		myMap.set(distance,j);
		 		 		myNew.set(distance,destinationsArray[j]);
		 		 }
				 var display=[];
		 		  eachDistance.sort(function(a, b){return a-b});
 					var ids={};
 					 var defau={};
 					 var define=[];
 				for(var z=0;z<eachDistance.length;z++){
			 		var dis={};
			 		 var temp=routes[myMap.get(eachDistance[z])];
			 		 temp.distance=eachDistance[z];
			 		 define.push(temp);
		 		 }
		 		
 				return define;
		 		

		 	}
		  //  return result;
		   // return true;
		  } catch (e) {
		    // Got a network error, time-out or HTTP error in the 400 or 500 range.
		    return "error";
		  }
		}
	
});
