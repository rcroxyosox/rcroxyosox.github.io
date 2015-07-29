define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/TableView.html',
	'css!/css/TableView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'TableView',
			events   : {},
			template: Handlebars.compile(html),
			initialize: function(options){
				_.extend(this, options);
			},
			render: function() {
				this.$el.html(this.template({}));
				return this;
			}
		});
	}
);