define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ui/NavBarView',
	'models/ConversationItemModelCollection',
	'text!/html/HomeDialogView.html',
	'text!/html/ConversationItemView.html',
	'css!/css/HomeDialogView.css',
	'css!/css/ConversationCollectionView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		NavBarView,
		ConversationItemModelCollection,
		html,
		ConversationItemViewHTML
		) {

		// A conversational item
		var ConversationItemView = Backbone.View.extend({
			tagName: 'li',
			model: null, // Should be a ConversationItemModel
			template: Handlebars.compile(ConversationItemViewHTML),
			render: function(){
				var data = this.model.toJSON();
				data.isFromBot = this.model.isFromBot();
				this.$el.addClass((data.isFromBot)?'botItem':'userItem');
				this.$el.html(this.template(data));
				return this;
			}
		});

		// A collection of conversational items
		var ConversationCollectionView = Backbone.View.extend({
			tagName: 'ul',
			className: 'ConversationCollectionView',
			collection: ConversationItemModelCollection.getInstance(),
			initialize: function(){
				this.listenTo(this.collection, 'add', function(model){
					console.log(model);
				});
			},
			render: function(){
				var that = this;
				this.collection.each(function(model){
					that.$el.append(new ConversationItemView({model:model}).render().$el);
				});
				return this;
			}
		});

		// the main view container
		return Backbone.View.extend({
			tagName  : "div",
			className: 'mainView HomeDialogView',
			Nav: NavBarView.extend({}),
			events   : {},
			template: Handlebars.compile(html),
			conversationCollectionView: null,
			initialize: function(){
				this.conversationCollectionView = new ConversationCollectionView();
				this.conversationCollectionView.collection.fetch();

			},
			render: function() {
				this.$el.html(this.template({test:"World"})).append(this.conversationCollectionView.render().$el);
				return this;
			}
		});
	}
);