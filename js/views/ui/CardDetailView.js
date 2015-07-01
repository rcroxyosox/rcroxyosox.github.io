define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/ui/CardDetailView.html',
	'css!/css/ui/CardDetailView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'CardDetailView',
			events   : {},
			template: Handlebars.compile(html),
			initialize: function(options){
				_.extend(this,options);
			},
			render: function() {
				this.$el.html(this.template({}));
				return this;
			}
		});
	}
);