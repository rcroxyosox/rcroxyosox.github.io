define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/RoundsDateCardItem.html',
	'css!/css/RoundsCardItems.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'RoundsDateCardItem',
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