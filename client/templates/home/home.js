Meteor.subscribe('routes');
var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
Template.home.rendered=function(){
	 $(document).foundation('reflow');
	$('#date').fdatepicker({
		format: 'mm-dd-yyyy hh:ii',
		disableDblClickSelection: true,
		pickTime: true
	});
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		center: {lat: 41.85, lng: -87.65}
	});
	var input = document.getElementById('dep');
    var destination=document.getElementById('des');
	var searchBox = new google.maps.places.Autocomplete(input);
	var serachBox2=new google.maps.places.Autocomplete(destination);
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
Template.home.helpers({
	routes: function(){
		 return	Routes.find({createBy:{$ne:Meteor.userId()}},{sort:{createdAt:-1}});
	},
	session: function(){
		if(Session.get('Abdi')==="" || Session.get('Abdi')==null){
				//console.log('empty');
			}else{

				return Session.get('Abdi');
			}
	}
});
	Template.home.events({
		"click .submit-route":function(event){
			var result=[];
			var distance=[];
			var destination=document.getElementById('des').value;
			var departuer=document.getElementById('dep').value;
			var date=document.getElementById('date').value;
			var dateTime=new Date(date);
			Meteor.call('getShortest',departuer,destination,dateTime,function(err, closestRoutes) {
				if(closestRoutes!=="error"){
					Session.set('Abdi',closestRoutes);
				}
				
			});
		},
		"click .detail":function(event){
			event.preventDefault();
			const detailId=event.target.id;
			const destination=document.getElementById('des').value;
			const departuer=document.getElementById('dep').value;
			var desdep={
				dep:departuer,
				des:destination
			};
			Session.set('desdep',desdep);
			if(Meteor.userId())
			Router.go('/detail/'+detailId);
			else
			Router.go('/login/'+detailId);	
		}
});



