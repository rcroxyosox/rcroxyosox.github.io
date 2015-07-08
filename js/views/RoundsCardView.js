define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ui/CardItemView',
	'views/RoundsDetailView',
	'text!/html/RoundsCardView.html',
	'css!/css/RoundsCardView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		CardItemView,
		RoundsDetailView,
		html
		) {

		return CardItemView.extend({
			className: 'CardItemView RoundsCardView',
			headerTitle: "Rounds",
			headerSubTitle: "Last 7 Days",
			template: Handlebars.compile(html),
			DetailView: RoundsDetailView, 
			render: function() {
				CardItemView.prototype.render.call(this);
				this.$el.html(this.template(this));
				return this;
			}
		});
	}
);