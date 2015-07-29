define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ModalNavBarView',
	'views/ui/InlineNavView',
	'views/RoundsTodayView',
	'views/RoundsHistoryView',
	'text!/html/RoundsDetailView.html',
	'css!/css/RoundsDetailView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		ModalNavBarView,
		InlineNavView,
		RoundsTodayView,
		RoundsHistoryView,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'mainView RoundsDetailView',
			Nav: ModalNavBarView.extend({
				navTitle: "Rounds"
			}),
			events   : {},
			template: Handlebars.compile(html),
			inlineNavView: null,
			remove: function(){
				var that = this;
				this.navInstance && this.navInstance.$el.addClass('hide'); 
				this.$el.removeClass('in');
				if(this.inlineNavView){
					var view = this.inlineNavView.getSelectedView();
					view && view.remove();
				}
				setTimeout(function(){
					Backbone.View.prototype.remove.call(that);
					that.trigger('removed');
				}, 500);
			},

			render: function() {
				var that = this;
				this.$el.html(this.template({}));
				setTimeout(function(){ that.$el.addClass('in'); },10);
				this.inlineNavView = new InlineNavView({
					navItems: [	
						{text: "Today", View: RoundsTodayView},
						{text: "History", selected: true, View: RoundsHistoryView },
						{text: "Over Time", action: function(){console.log("rerender?");}}
					]
				});
				this.inlineNavView.render().$el.prependTo(this.$('.mainViewContent'));

				return this;
			}
		});
	}
);