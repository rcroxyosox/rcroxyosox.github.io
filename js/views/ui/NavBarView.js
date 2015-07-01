define([
	'jquery',
	'backbone',
	'handlebars',
	'AppView',
	'text!/html/ui/NavBarView.html',
	'css!/css/ui/NavBarView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		AppView,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'NavBarView',
			leftButtons:[],
			rightButtons:[],
			template: Handlebars.compile(html),
			events:{},
			initialize: function(){
				var that = this;

				this.listenTo(AppView.getInstance().router, 'route', that.setSelected);

				_.each(this.getButtons(), function(button){
					if(button.route && button.iconClass){
						that.events['click .'+button.iconClass] = function(){
							AppView.getInstance().router.navigate(button.route, {trigger:true});
						}
					}
				});

				this.delegateEvents();

				// myRouter.on("route", function(route, params) {
				//     console.log("Different Page: " + route);
				// });
			},
			getButtons: function(){
				return _.extend({},this.leftButtons, this.rightButtons);
			},
			setSelected: function(){
				var selected = AppView.getInstance().router.getCurrentRoute();
				var buttons = this.getButtons();
				var button = _.findWhere(buttons, {route:selected});
				this.$('.icon').removeClass('selected');
				this.$('.'+button.iconClass).addClass('selected');
			},
			toggleSettings: function(){
				alert("settings");
			},
			render: function() {
				var that = this;
				this.$el.html(this.template(this));
				setTimeout(function(){ that.setSelected(); },0);
				return this;
			}
		});
	}
);