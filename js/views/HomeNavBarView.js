define([
	'jquery',
	'views/ui/NavBarView',
	'moment'
	], function(
		$,
		NavBarView,
		moment
		) {

		function getGreetingTime() {
			var m = moment();
			var g = null; //return g

			if (!m || !m.isValid()) {
				return;
			} //if we can't find a valid or filled moment, we return.

			var split_afternoon = 12 //24hr time to split the afternoon
			var split_evening = 17 //24hr time to split the evening
			var currentHour = parseFloat(m.format("HH"));

			if (currentHour >= split_afternoon && currentHour <= split_evening) {
				g = "afternoon";
			} else if (currentHour >= split_evening) {
				g = "evening";
			} else {
				g = "morning";
			}

			return g;
		}

		var HomeNavBarView = NavBarView.extend({

			headerTitle: moment().format('dddd, MMMM D'),
			headerSubTitle: "Good "+getGreetingTime()+" Mike",
			events   : {},
			initialize: function(options){
				NavBarView.prototype.initialize.call(this, options);
			},
			rightButtons: [{
				iconClass:'icon-conversation',
				route: 'conversation'
			},{
				iconClass:'icon-dashboard',
				route: 'dashboard'
			}]
		});

		return HomeNavBarView;
	}
);