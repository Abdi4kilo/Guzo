Template.driver.events({
	"click .submit-route":function(event){
		var destination=document.getElementById('des').value;
		var departuer=document.getElementById('dep').value;
		Routes.insert({
			start:departuer,
			end:destination,
			createdAt:new Date()
		});
	}
});
