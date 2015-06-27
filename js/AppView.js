define([
	'backbone',
	'views/ui/PaletteView'
], function(
	Backbone,
	PaletteView
) {

	var Router = Backbone.Router.extend({
		routes: {
			"": "home"
		}
	});

	var AppView = Backbone.View.extend({
		tagName:"section",
		className:"AppView",
		router: new Router(),
		switchView: function(options){
			var view = new options.view();
			this.$el.html(view.render().$el);
			if(view.Nav){
				this.$el.prepend(new view.Nav().render().$el);
				view.$el.addClass('withNavBarView');
			}
		},
		startRouter: function() {
			var that = this;
			this.router.on("route:home", function() {
				require(['views/HomeDialogView'], function(HomeDialogView) {
					that.switchView({
						view: HomeDialogView
					});
				});
				// do something
			});

			Backbone.history.start();
		},
		initialize: function() {
			this.startRouter();
		},
		render: function(){
			$('body').html(this.$el);

			// Show the Palette
			// $('body').append(new PaletteView().render().$el);

			return this;
		}
	});

	return AppView;

});