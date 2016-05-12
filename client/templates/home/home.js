// Template.home.rendered = function() {
//     if(!this._rendered) {
//       this._rendered = true;
//       console.log('Template onLoad');

//         alert(result.statusCode);
//     }
// }


if(Meteor.isClient){
	
	Template.home.helpers({
		routes: function(){
			return	Routes.find({},{sort:{createdAt:-1}});
		}
	});
	Template.home.events({
	"click .submit-route":function(event){
		var result=[];
		var destination=document.getElementById('des').value;
		var departuer=document.getElementById('dep').value;
		//result=Meteor.call('checkTwitter',destination,departuer);
		
		Meteor.call('checkTwitter',destination,departuer,function(err, users) {
  			console.log(users);
		});
	}
	});
}


