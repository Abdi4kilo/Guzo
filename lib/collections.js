Routes=new Mongo.Collection('routes');

Meteor.methods({

	addRoutes: function(departuer,destination){

		Routes.insert({
			start:departuer,
			end:destination,
			createdAt:new Date()
		});
	},

		checkTwitter: function () {
		this.unblock();
		  try {
		    var result = HTTP.call("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Vancouver+BC|Seattle&destinations=San+Francisco|Victoria+BC&mode=bicycling&language=fr-FR&key=AIzaSyAFqA_wqLzyUdJsADQIHoHZjCCrDaTwN3s");
		    console.log(result);
		    return true;
		  } catch (e) {
		    // Got a network error, time-out or HTTP error in the 400 or 500 range.
		    return false;
		  }
		}
	
});
