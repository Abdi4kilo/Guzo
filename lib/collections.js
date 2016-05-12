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
		  	for(var i=0;i<count;i++){
		  		if(i==(count-1)){
		  			destinationApi+=routes[i].start;	
		  		}else{
		  			destinationApi+=routes[i].start+"|";	
		  		}
		  		
		  	}
		  	var myMap=new Map();
		  	var result=HTTP.call("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+departuer+"&destinations="+destinationApi+"&mode=driving&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
		 	if(result.statusCode==200){
		 		//console.log('ok');
		 		var respJson = JSON.parse(result.content);
		 		//console.log(respJson.rows[0].elements[0].distance.text);
		 		var countDistance=respJson.rows[0].elements.length;
		 		var eachDistance=[];
		 		 for(var j=0;j<countDistance;j++){
		 		 		if(respJson.rows[0].elements[j].status==="ZERO_RESULTS"){
		 		 			console.log('failed');
		 		 			continue;
		 		 		}
		 		 		var distance=respJson.rows[0].elements[j].distance.text;
		 		 		distance=distance.replace("km"," ");
		 		 		eachDistance.push(distance);
		 		 		myMap.set(distance,j);
		 		 	
		 		 }

		 		 var display=[];
		 		 var sendBack=new Map();
		 		 eachDistance.sort(function(a, b){return a-b});
		 		 for(var z=0;z<eachDistance.length;z++){
		 		 //	console.log(eachDistance[z]);
		 		 var dis={};
		 		 dis[eachDistance[z]]=routes[myMap.get(eachDistance[z])];
		 		 	display.push(dis);
		 		 	//sendBack.set(eachDistance[z],display[z])
		 		 	//console.log(routes[myMap.get(eachDistance[z])]);
		 		 }
		 		  //console.log(display);


				 return display;
		 		

		 	}
		  //  return result;
		   // return true;
		  } catch (e) {
		    // Got a network error, time-out or HTTP error in the 400 or 500 range.
		    return "error";
		  }
		}
	
});
