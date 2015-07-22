define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ModalNavBarView',
	'text!/html/RoundsDetailView.html',
	'css!/css/RoundsDetailView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		ModalNavBarView,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'RoundsDetailView',
			Nav: ModalNavBarView.extend({
				navTitle: "Rounds"
			}),
			events   : {},
			template: Handlebars.compile(html),
			render: function() {
				this.$el.html(this.template({}));
				return this;
			}
		});
	}
);