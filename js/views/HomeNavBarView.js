define([
	'jquery',
	'views/ui/NavBarView',
	], function(
		$,
		NavBarView
		) {

		var HomeNavBarView = NavBarView.extend({
			headerTitle: "Wednesday July 1",
			headerSubTitle: "Good Morning Mike",
			events   : {},
			initialize: function(options){
				NavBarView.prototype.initialize.call(this, options);
			},
			leftButtons: [{
				iconClass:'icon-menu'
			}],
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