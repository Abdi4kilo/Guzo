Router.configure({
	layoutTemplate: 'layout'
});
Router.map(function(){
	this.route('home',{
		path:'/',
		template:'home'
	});
	this.route('driver',{
		path:'/driver',
		template: 'driver',
		onBeforeAction: function () {
			if(Meteor.userId()){
				
			}else{
				Router.go('/login');
			}
			this.next();
		}
	});
	this.route('login',{
		path:'/login',
		template:'login',
		onBeforeAction: function () {
			if(Meteor.userId()){
				Router.go('/');
			}
			this.next();
		}

	});
	this.route('logindetial',{
		path:'/login/:id',
		template:'login',
	});
	
	this.route('register',{
		path:'/register',
		template:'register',
		onBeforeAction: function () {
			if(Meteor.userId()){
				Router.go('/');
			}
			this.next();
		}
	});
	this.route('menu',{
		path:'/menu',
		template:'menu',
		onBeforeAction: function () {
			if(Meteor.userId()){
			
			}else{
				Router.go('/login');
			}
			this.next();
		}
	});

	this.route('detail',{
		path:'/detail/:id',
		template:'driverdetail',
		onBeforeAction: function () {
			if(Meteor.userId()){
				Router.go('/detail/'+Router.current().params.id);
			}else{
				Router.go('/login');
			}
			this.next();
		}
	});
	this.route('managerides',{
		path:'/managerides',
		template:'managerides',
		onBeforeAction: function () {
			if(Meteor.userId()){
				Router.go('/managerides');
			}else{
				Router.go('/login');
			}
			this.next();
		}
	});
	this.route('/search',{
		path:'/search',
		template:'search',
	});
	
});
