Template.navbar.events({
	"click .logout-btn":function(event){
		Meteor.logout(function(err){
			if(err){
				console.log(err.reason);
			}else{
				Router.go('/');
			}
		});
	}
});
