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
             var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            for (var i = 0; i < route.legs.length; i++) {
              var routeSegment = i + 1;
              summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                  '</b><br>';
              summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
              summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
              summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
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
	   var splitIds=detailId.split("-");
    var rideInfo=Routes.findOne({_id:splitIds[0]});
		var ret="";
		for(var k=0;k<rideInfo.hitchers.length;k++){
			if(rideInfo.hitchers[k].hitcherId===splitIds[1]){
				ret=rideInfo.hitchers[k];
				break;
			}
		}
		Session.set('test2',ret);
		Session.set('test',rideInfo);
		calculateAndDisplayRoute(directionsService, directionsDisplay);

	},
  "click .accept":function(event){
    const detailId=event.target.id;
    var splitIds=detailId.split("-");
    Meteor.call('acceptHitcher',splitIds[0],splitIds[1]);
   // document.getElementById(detailId).className += "checkedbutton";
  },
  "click .decline":function(event){
    const detailId=event.target.id;
    var splitIds=detailId.split("-");
    Meteor.call('declineHitcher',splitIds[0],splitIds[1]);
   // document.getElementById(detailId).className += "checkedbutton";
  }
});


