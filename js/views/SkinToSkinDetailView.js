define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/SkinToSkinDetailView.html',
	'css!/css/SkinToSkinDetailView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'SkinToSkinDetailView',
			events   : {},
			template: Handlebars.compile(html),
			render: function() {
				this.$el.html(this.template({}));
				return this;
			}
		});
	}
);