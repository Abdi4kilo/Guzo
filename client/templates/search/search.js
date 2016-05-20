Meteor.subscribe('routes');
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	var info="";
Template.search.rendered=function(){
	 
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
	 if(info!==""){
	 document.getElementById('dep').value=info.departuer;
	 document.getElementById('des').value=info.destination;
	 document.getElementById('date').value=info.date;
	 onChangeHandler();
	 document.getElementById("go").click();
	}
} 
Template.modal.rendered=function(){
$(document).foundation('reflow');
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
Template.search.created=function(){
	if(!(Session.get('search')==="" || Session.get('search')==null)){
		info=Session.get('search');
	}
}
Template.search.helpers({
	session: function(){
		if(Session.get('Abdi')==="" || Session.get('Abdi')==null){
				//console.log('empty');
		}else{
			var driver=Session.get("Abdi");
			for(var i=0;i<driver.length;i++){
				driver[i].drivername=Meteor.users.findOne({_id:driver[i].createBy}).profile.full_name;
			}
			return driver;
		}
	}
});
Template.search.events({
	"click .submit-route":function(event){
			var result=[];
			var distance=[];
			var destination=document.getElementById('des').value;
			var departuer=document.getElementById('dep').value;
			var desdep={
				dep:departuer,
				des:destination
			};
			Session.set('desdep',desdep);
			var date=document.getElementById('date').value;
			var dateTime=new Date(date);
			Meteor.call('getShortest',departuer,destination,dateTime,function(err, closestRoutes) {
				if(closestRoutes!=="error"){
					Session.set('Abdi',closestRoutes);
				}
			});
	},
	"click .request": function(event){
		event.preventDefault();
		var split=event.target.id.split("-");
		const rideid=split[0];
		const departuer=Session.get('desdep').dep;
		const destination=Session.get('desdep').des;
		console.log(rideid+departuer+destination);
		Meteor.call('addHitcher',rideid,departuer,destination);
		document.getElementById(event.target.id).innerHTML="Requested";
	}
});

