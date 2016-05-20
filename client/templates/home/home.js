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
	
	var input = document.getElementById('dep');
    var destination=document.getElementById('des');
	var searchBox = new google.maps.places.Autocomplete(input);
	var serachBox2=new google.maps.places.Autocomplete(destination);
	
} 
Template.home.helpers({
	routes: function(){
		 return	Routes.find({createBy:{$ne:Meteor.userId()}},{sort:{createdAt:-1}});
	}
});
Template.home.events({
	"click .submit-route":function(event){
		event.preventDefault();
		var destination=document.getElementById('des').value;
		var departuer=document.getElementById('dep').value;
		var date=document.getElementById('date').value;
		var search={
			destination:destination,
			departuer:departuer,
			date:date
		};
		Session.set('search',search);
		
		Router.go('/search');
	}	
});



