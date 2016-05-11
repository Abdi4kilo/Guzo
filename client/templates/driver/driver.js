Template.driver.events({
	"click .submit-route":function(event){
		var destination=document.getElementById('des').value;
		var departuer=document.getElementById('dep').value;
		Meteor.call('addRoutes',departuer,destination);
	}
});
