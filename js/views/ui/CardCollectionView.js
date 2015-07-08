define([
	'jquery',
	'backbone',
	'handlebars',
	'css!/css/ui/CardCollectionView.css'
	], function(
		$,
		Backbone,
		Handlebars
		) {

		return Backbone.View.extend({
			tagName  : "ul",
			className: 'mainViewContent CardCollectionView',
			cards: [],
			events   : {},
			initialize: function(options){
				_.extend(this, options);
			},
			render: function() {
				var that = this;
				_.each(this.cards, function(CardClass){
					var cardItemView = new CardClass();
					that.$el.append(cardItemView.render().$el);
				});
				return this;
			}
		});
	}
);