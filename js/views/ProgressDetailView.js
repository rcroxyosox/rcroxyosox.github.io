define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/ProgressDetailView.html',
	'css!/css/ProgressDetailView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'ProgressDetailView',
			events   : {},
			template: Handlebars.compile(html),
			render: function() {
				this.$el.html(this.template({}));
				return this;
			}
		});
	}
);