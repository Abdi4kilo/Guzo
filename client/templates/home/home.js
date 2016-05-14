
if(Meteor.isClient){
	
	Template.home.helpers({
		routes: function(){
			 return	Routes.find({},{sort:{createdAt:-1}});
		}
		

		 
		 
	});
	Template.registerHelper('session',function(input){
  		//return Routes.find({start:{$in:Session.get('Abdi')}});
  			if(Session.get('Abdi')==="" || Session.get('Abdi')==null){
  				//	
  				console.log('empty');
  			}else{
  				console.log(Routes.find({start:{$in:Session.get("Abdi")}}));
  				console.log(Session.get('Abdi'));
  			}
  			//
  		//	["170 Lafayette St, Bridgeport, CT 06604, USA", "Milford, CT, USA", "New Haven, CT, USA"]
	 });
	// Tracker.autorun(function() {
 //  		var sessionVal = Session.get("Abdi");
  		
	// 		bestRoute();
  	
  		
  
	// });
	Template.home.events({
	"click .submit-route":function(event){
		var result=[];
		var destination=document.getElementById('des').value;
		var departuer=document.getElementById('dep').value;
		//result=Meteor.call('checkTwitter',destination,departuer);
		
		Meteor.call('checkTwitter',destination,departuer,function(err, closestRoutes) {
  			
  			for (var key in closestRoutes) {
			  if (closestRoutes.hasOwnProperty(key)) {
			    
			  result.push(key);
					    
			  }
			}
			Session.set('Abdi',result);


		});

		//Session.set('Abdi',result);
		//	console.log(Session.get('Abdi'));
			//return Routes.find({start:{$in:Session.get('Abdi')}});
		}
	});
}


