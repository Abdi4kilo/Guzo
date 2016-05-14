
if(Meteor.isClient){
	
	Template.home.helpers({
		routes: function(){
			 return	Routes.find({},{sort:{createdAt:-1}});
		},
		session: function(){
			if(Session.get('Abdi')==="" || Session.get('Abdi')==null){
  				//console.log('empty');
  			}else{
  				return Session.get('Abdi')
  			}
		}
	});
  	Template.home.events({
			"click .submit-route":function(event){
				var result=[];
				var distance=[];
				var destination=document.getElementById('des').value;
				var departuer=document.getElementById('dep').value;
				Meteor.call('checkTwitter',destination,departuer,function(err, closestRoutes) {
				Session.set('Abdi',closestRoutes)
			});
		}
	});
}


