Template.driver.events({
	"click .submit-route":function(event){
		var destination=document.getElementById('des').value;
		var departuer=document.getElementById('dep').value;
		var date=document.getElementById('date').value;
		var dateTime=new Date(date);
		Meteor.call('addRoutes',departuer,destination,dateTime);
	}
});
