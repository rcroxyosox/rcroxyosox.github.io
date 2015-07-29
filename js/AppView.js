define([
	'backbone',
	'views/ui/PaletteView',
	'views/ui/MintModalView',
	'css!/css/AppView.css'
], function(
	Backbone,
	PaletteView,
	MintModalView
) {

	var Router = Backbone.Router.extend({
		initialize: function() {
			this.routesHit = 0;
			//keep count of number of routes handled by your application
			Backbone.history.on('route', function() {
				this.routesHit++;
			}, this);
		},

		back: function(options) {
			var settings = _.extend({
					trigger: true,
					replace: true
				}, options);
			
			if (this.routesHit > 1) {
				window.history.back();
			} else {
				this.navigate('', settings);
			}
		},

		getCurrentRoute: function() {
			return this.routes[Backbone.history.getFragment()]
		},

		routes: {
			"": "conversation",
			"conversation": "conversation",
			"dashboard": "dashboard",
			"skintoskin": "skintoskin",
			"rounds": "rounds"
		}
	});

	var AppView = Backbone.View.extend({
		tagName: "section",
		className: "AppView",
		router: new Router(),
		currentNav: null,
		currentView: null,
		previousView: null,
		switchView: function(options) {
			var that = this;
			this.previousView = this.currentView;
			this.currentView = new options.view();
			var createNewView = function() {
				that.$el.html(that.currentView.render().$el);
				if (that.currentView.Nav) {
					that.currentNav = new that.currentView.Nav({
						attachedToView: that.currentView
					});
					that.currentView.navInstance = that.currentNav;
					that.$el.prepend(that.currentNav.render().$el);
					that.currentView.$el.addClass((that.currentNav.collapsed) ? 'withNavBarViewCollapsed' : 'withNavBarView');
				}
			}

			if (this.previousView) {
				this.previousView.on('removed', createNewView);
				this.previousView.remove();
			} else {
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
			});

			this.router.on("route:dashboard", function() {
				require(['views/HomeDashboardView'], function(HomeDashboardView) {
					that.switchView({
						view: HomeDashboardView,
					});
				});
			});

			this.router.on("route:skintoskin", function() {
				require(['views/SkinToSkinDetailView'], function(SkinToSkinDetailView) {
					that.switchView({
						view: SkinToSkinDetailView,
					});
				});
			});

			this.router.on("route:rounds", function() {
				require(['views/RoundsDetailView'], function(RoundsDetailView) {
					that.switchView({
						view: RoundsDetailView,
					});
				});
			});

			Backbone.history.start();
		},
		initialize: function() {
			this.startRouter();
			$('body').removeClass('preload');
		},
		render: function() {
			$('body').html(this.$el);

			// Show the Palette
			$('body').append(new PaletteView().render().$el);

			return this;
		}
	}, {
		getInstance: function() {
			return instance;
		}
	});

	var instance = new AppView();

	return AppView;

});