define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ui/NavBarView',
	'text!/html/HomeDialogView.html',
	'css!/css/HomeDialogView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		NavBarView,
		html
		) {

		var Nav = NavBarView.extend({});

		return Backbone.View.extend({
			tagName  : "div",
			className: 'mainView HomeDialogView',
			Nav: Nav,
			events   : {},
			template: Handlebars.compile(html),
			render: function() {
				this.$el.html(this.template({test:"World"}));
				return this;
			}
		});
	}
);