Meteor.subscribe('routes');
Meteor.subscribe('hitcher');
 var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
Template.managerides.rendered = function () {
    $(document).foundation('reflow');
  	
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 6,
          center: {lat: 41.85, lng: -87.65}
        });
     directionsDisplay.setMap(map);
}
 function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var waypts = [];
    
        waypts.push({location:Session.get('test2').departuer,stopover:true});
        waypts.push({location:Session.get('test2').destination,stopover:true});
        directionsService.route({
          origin: Session.get('test').start,
          destination: Session.get('test').end,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
           } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
Template.managerides.helpers({
	myroutes: function(){
		 return	Routes.find({createBy:Meteor.userId()});
	},
  rides: function(){
     return Hitcher.find({hitcherId:Meteor.userId()});
  }
});

Template.managerides.events({
	"click .submit": function(event){
		const detailId=event.target.id;
		var x = document.getElementById(detailId).parentElement;
		var y=document.getElementById(x.getAttribute('id')).parentElement;
		var z=document.getElementById(y.getAttribute('id')).parentElement;
		var rideId=z.getAttribute('id');
		var rideInfo=Routes.findOne({_id:rideId});
		var ret="";
		for(var k=0;k<rideInfo.hitchers.length;k++){
			if(rideInfo.hitchers[k].hitcherId===detailId){
				ret=rideInfo.hitchers[k];
				break;
			}
		}
		
		Session.set('test2',ret);
		Session.set('test',rideInfo);
		calculateAndDisplayRoute(directionsService, directionsDisplay);

	}
});


