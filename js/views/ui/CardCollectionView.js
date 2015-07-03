define([
	'jquery',
	'backbone',
	'handlebars',
	'views/SkinToSkinCardView',
	'css!/css/ui/CardCollectionView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		SkinToSkinCardView
		) {

		return Backbone.View.extend({
			tagName  : "ul",
			className: 'mainViewContent CardCollectionView',
			cards: [SkinToSkinCardView],
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