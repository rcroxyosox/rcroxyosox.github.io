define([
	'backbone',
	'views/ui/PaletteView'
], function(
	Backbone,
	PaletteView
) {

	var Router = Backbone.Router.extend({
		getCurrentRoute: function(){
			return this.routes[Backbone.history.getFragment()]
		},
		routes: {
			"": "conversation",
			"conversation": "conversation",
			"dashboard": "dashboard"
		}
	});

	var AppView = Backbone.View.extend({
		tagName:"section",
		className:"AppView",
		router: new Router(),
		currentView: null,
		previousView: null,
		switchView: function(options){
			this.previousView = this.currentView;
			this.currentView = new options.view();
			this.$el.html(this.currentView.render().$el);

			if(this.currentView.Nav){
				this.$el.prepend(new this.currentView.Nav().render().$el);
				this.currentView.$el.addClass('withNavBarView');
			}

		},
		startRouter: function() {

			var that = this;

			this.router.on("route:conversation", function() {
				require(['views/HomeDialogView'], function(HomeDialogView) {
					that.switchView({
						view: HomeDialogView
					});
				});
				// do something
			});

			this.router.on("route:dashboard", function() {
				require(['views/HomeDashboardView'], function(HomeDashboardView) {
					that.switchView({
						view: HomeDashboardView,
					});
				});
				// do something
			});

			Backbone.history.start();
		},
		initialize: function() {
			this.startRouter();
			$('body').removeClass('preload');
		},
		render: function(){
			$('body').html(this.$el);

			// Show the Palette
			$('body').append(new PaletteView().render().$el);

			return this;
		}
	},{
		getInstance: function(){
			return instance;
		}
	});

	var instance = new AppView();

	return AppView;

});