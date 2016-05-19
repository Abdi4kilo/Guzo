Template.login.events({
	"submit .login-form": function(event){
		event.preventDefault();
		console.log();
		var email=event.target.email.value;
		var password=event.target.password.value;
		Meteor.loginWithPassword(email,password,function(err){
			if(err){
				event.target.email.value=email;
				event.target.password.value=password;
				//Messages.send('info',err.reason);
			}else{
				const route=Router.current().params.id;
				
				if(route==undefined || route==null){
					Messages.send('info', 'Success!');
					Router.go('/');
				}else{
					Router.go('/detail/'+route);
				}
				
				
			}
		});
		
 	}

	
});