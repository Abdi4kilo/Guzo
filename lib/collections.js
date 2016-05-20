Routes=new Mongo.Collection('routes');
Hitcher=new Mongo.Collection('hitcher');

if(Meteor.isServer){
	Meteor.publish('routes',function(){
		return Routes.find();
	});	
	Meteor.publish('users', function() {
    	return Meteor.users.find();
	});
	Meteor.publish('hitcher',function(){
		return Hitcher.find();
	});	
}

Meteor.methods({

	addRoutes: function(departuer,destination,date,numberseats,cartype,userId){
		Routes.insert({
			start:departuer,
			end:destination,
			travelDate:date,
			numberofseats:numberseats,
			cartype:cartype,
			hitchers:[],
			leftseats:numberseats,
			createdAt:new Date(),
			createBy:userId
		});
	},
	addHitcher: function(rideId,departuer,destination){
	var hitchinfo={hitcherId:Meteor.userId(),hitchername: Meteor.users.findOne({_id:Meteor.userId()}).profile.full_name,departuer:departuer,destination:destination,status:"undetermined",accept:false,decline:false};	
	var driverId=Routes.findOne({_id:rideId}).createBy;
	 var driverName=Meteor.users.findOne({_id:driverId}).profile.full_name;
	 Hitcher.insert({rideId:rideId,hitcherId:Meteor.userId(),drivername:driverName,hitchername: Meteor.users.findOne({_id:Meteor.userId()}).profile.full_name,departuer:departuer,destination:destination,status:"undetermined"});	
     Routes.update({_id:rideId}, {$push: {hitchers:hitchinfo}});
    },
    acceptHitcher: function(rideId,hitcherId){
	 Hitcher.update({rideId:rideId,hitcherId:hitcherId},{$set: {status:"Accepted"}});	
     Routes.update({_id:rideId,"hitchers.hitcherId":hitcherId},{$set: {"hitchers.$.status":"Accepted","hitchers.$.accept":true,"hitchers.$.decline":false}});
     Routes.update({_id:rideId}, {$inc:{leftseats:-1}});
     console.log('it happend');
    },
    declineHitcher: function(rideId,hitcherId){
	 Hitcher.update({rideId:rideId,hitcherId:hitcherId},{$set: {status:"Declined"}});	
     Routes.update({_id:rideId,"hitchers.hitcherId":hitcherId},{$set: {"hitchers.$.status":"Declined","hitchers.$.accept":false,"hitchers.$.decline":true}});
     Routes.update({_id:rideId}, {$inc:{leftseats:1}});
     console.log('it happend');
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
		
	  	routes=Routes.find({createBy:{$ne:Meteor.userId()},travelDate:{"$gte":new Date(today),"$lt":new Date(tommorrow)}}).fetch();
	  	var countDate=Routes.find({travelDate:{"$gte":new Date(today),"$lt":new Date(tommorrow)}}).count();
	  	if(countDate==0){
	  		return "error";
	  	}
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
			return define;
	 	}
	  
	  } catch (e) {
	  
	    return "error";
	  }
	}

	
});
