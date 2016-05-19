var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
Template.driver.rendered=function(){
	 $(document).foundation('reflow');
 $('#date').fdatepicker({
		format: 'mm-dd-yyyy hh:ii',
		disableDblClickSelection: true,
		pickTime: true
	});
	var input = document.getElementById('dep');
    var destination=document.getElementById('des');
	var searchBox = new google.maps.places.SearchBox(input);
	var serachBox2=new google.maps.places.SearchBox(destination);
	
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		center: {lat: 41.85, lng: -87.65}
	});
  directionsDisplay.setMap(map);
  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('go').addEventListener('click',function(event){
  	event.preventDefault();
  	onChangeHandler();
  });
}
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('dep').value,
    destination: document.getElementById('des').value,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
Template.driver.events({
	"click .submit-route":function(event){
		var userId=Meteor.userId();
		var destination=document.getElementById('des').value;
		var departuer=document.getElementById('dep').value;
		var date=document.getElementById('date').value;
		var numberseats=parseInt(document.getElementById('numberseats').value);
		var cartype=document.getElementById('cartype').value;
		
		var dateTime=new Date(date);
		Meteor.call('addRoutes',departuer,destination,dateTime,numberseats,cartype,userId);
	}
});
