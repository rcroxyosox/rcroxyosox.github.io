define([
	'jquery',
	'views/ui/NavBarView',
	], function(
		$,
		NavBarView
		) {

		var HomeNavBarView = NavBarView.extend({
			events   : {
				'click .icon-menu':'toggleSettings'
			},
			initialize: function(){
				NavBarView.prototype.initialize.call(this);
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
			},{
				iconClass:'icon-settings'
			}]
		});

		return HomeNavBarView;
	}
);