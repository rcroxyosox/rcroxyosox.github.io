define([
	'jquery',
	'backbone',
	'handlebars',
	'views/HomeNavBarView',
	'views/ui/CardCollectionView',
	'text!/html/HomeDashboardView.html',
	'css!/css/HomeDashboardView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		HomeNavBarView,
		CardCollectionView,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'mainView HomeDashboardView',
			events   : {},
			Nav: HomeNavBarView.extend({navTitle: "Dashboard"}),
			template: Handlebars.compile(html),
			render: function() {
				this.$el.html(this.template(this));
				this.$el.append(new CardCollectionView().render().$el);
				return this;
			}
		});
	}
);