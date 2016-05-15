
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
				var date=document.getElementById('date').value;
				var dateTime=new Date(date);
				Meteor.call('getShortest',departuer,destination,dateTime,function(err, closestRoutes) {
					Session.set('Abdi',closestRoutes)
				});
		}
	});
}


