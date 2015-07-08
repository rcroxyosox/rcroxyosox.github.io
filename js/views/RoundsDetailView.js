define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/RoundsDetailView.html',
	'css!/css/RoundsDetailView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'RoundsDetailView',
			events   : {},
			template: Handlebars.compile(html),
			render: function() {
				this.$el.html(this.template({}));
				return this;
			}
		});
	}
);