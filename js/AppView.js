define([
	'backbone',
	'views/ui/PaletteView',
	'css!/css/AppView.css'
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
		currentNav: null,
		currentView: null,
		previousView: null,
		switchView: function(options){
			var that = this;
			this.previousView = this.currentView;
			this.currentView = new options.view();

			var createNewView = function(){
				that.$el.html(that.currentView.render().$el);
				if(that.currentView.Nav){
					that.currentNav = new that.currentView.Nav({
						attachedToView: that.currentView
					});
					that.$el.prepend(that.currentNav.render().$el);
					that.currentView.$el.addClass('withNavBarView');
				}
			}

			if(this.previousView){
				this.previousView.on('removed', createNewView);
				this.previousView.remove();
			}else{
				createNewView();
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