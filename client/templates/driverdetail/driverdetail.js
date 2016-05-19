Meteor.subscribe('routes');
Meteor.subscribe('users');
Template.driverdetail.helpers({
		detail: function(){
			const id=Router.current().params.id;
			const driver=Routes.findOne({_id:id}).createBy;
			return{
			 	user: Meteor.users.findOne({_id:driver}),
			 	route: Routes.findOne({_id:id})
			 };
		}
});
Template.driverdetail.events({
	"click .request": function(event){
		event.preventDefault();
		const rideid=Router.current().params.id;
		const departuer=Session.get('desdep').dep;
		const destination=Session.get('desdep').des;
		

		Meteor.call('addHitcher',rideid,departuer,destination);
		document.getElementById('request').innerHTML="Requested";
	}
});