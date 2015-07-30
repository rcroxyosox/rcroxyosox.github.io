define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/SkinToSkinHistoryView.html',
	'css!/css/SkinToSkinHistoryView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'SkinToSkinHistoryView',
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