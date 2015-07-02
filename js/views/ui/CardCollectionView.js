define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ui/CardItemView',
	'css!/css/ui/CardCollectionView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		CardItemView
		) {

		// Extend different types of card items
		var CardItemModel = Backbone.Model.extend({
			defaults:{
				header: ""
			}
		});

		var CardItemModelCollection = Backbone.Collection.extend({
			model: CardItemModel
		});

		return Backbone.View.extend({
			tagName  : "ul",
			className: 'mainViewContent CardCollectionView',
			collection: new CardItemModelCollection([{heading:"Rounds"},{heading:"Skin to Skin"},{heading:"Another Card"},{heading:"Another Card"}]),
			events   : {},
			initialize: function(options){
				_.extend(this, options);
			},
			render: function() {
				var that = this;
				this.collection.each(function(model){
					var cardItemView = new CardItemView({model:model});
					that.$el.append(cardItemView.render().$el);
				});
				return this;
			}
		},{
			CardItemModel: CardItemModel,
			CardItemModelCollection: CardItemModelCollection
		});
	}
);