define([
	'jquery',
	'backbone',
	'handlebars',
	'AppView',
	'views/ui/CardItemView',
	'views/RoundsDetailView',
	'text!/html/RoundsCardView.html',
	'css!/css/RoundsCardView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		AppView,
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
			openDetailView: function(){
				CardItemView.prototype.openDetailView.call(this);
				AppView.getInstance().router.navigate('rounds');
			},
			render: function() {
				CardItemView.prototype.render.call(this);
				this.$el.html(this.template(this));
				return this;
			}
		});
	}
);