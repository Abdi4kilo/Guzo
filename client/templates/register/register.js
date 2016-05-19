Template.register.events({
	"submit .form-signup": function(event){
		event.preventDefault();
		var email=event.target.email.value;
		var password=event.target.password.value;
		var name=event.target.full_name.value;
		var password2=event.target.password2.value;
		if(password===password2){
 			Accounts.createUser({
			email:email,
			password:password,
			profile:{
				full_name:name
			}
		},function(err){
			if(err){
				  Messages.send('info', 'Error registering you!');
			}else{
				  Messages.send('info', 'Account created!');
				  Router.go('/driver');
			}
		});
		}else{
		Messages.send('info', 'Password one don\'t match password2');
		}

	}
});