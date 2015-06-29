define([
	'jquery',
	'backbone',
	'handlebars',
	'Utils',
	'views/ui/NavBarView',
	'views/ui/UserPromptView',
	'models/ConversationItemModelCollection',
	'text!/html/HomeDialogView.html',
	'text!/html/ConversationItemView.html',
	'css!/css/HomeDialogView.css',
	'css!/css/ConversationCollectionView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		Utils,
		NavBarView,
		UserPromptView,
		ConversationItemModelCollection,
		html,
		ConversationItemViewHTML
		) {

		// A conversational item
		var ConversationItemView = Backbone.View.extend({
			tagName: 'li',
			model: null, // Should be a ConversationItemModel
			template: Handlebars.compile(ConversationItemViewHTML),
			initialize: function(){
				var that = this;
				this.listenTo(this.model, 'change:stub', function(){
					that.$el.toggleClass('stubItem', this.model.get('stub'));
					that.$('p').html(that.model.get('message'));
				});
			},
			render: function(){
				var that = this;
				var data = this.model.toJSON();
				data.isFromBot = this.model.isFromBot();
				this.$el.toggleClass('stubItem', data.stub);
				this.$el.addClass((data.isFromBot)?'botItem':'userItem');
				this.$el.html(this.template(data));
				if(data.isFromBot){
					setTimeout(function(){that.$el.addClass('in');},100);
				}

				return this;
			}
		});

		// A collection of conversational items
		var ConversationCollectionView = Backbone.View.extend({
			tagName: 'ul',
			className: 'ConversationCollectionView',
			collection: ConversationItemModelCollection.getInstance(),
			initialize: function(){
				var that = this;
				this.listenTo(this.collection, 'add', function(model){
					that.$el.append(new ConversationItemView({model:model}).render().$el);
				});
				that.collection.fetch();
			},
			render: function(){
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
			renderUserPrompt: function(model){
				this.userPrompt && this.userPrompt.remove();
				this.userPrompt = new UserPromptView({model:model}).render();
				this.$el.append(this.userPrompt.$el);
			},
			initialize: function(){
				var that = this;
				this.conversationCollectionView = new ConversationCollectionView();
				this.listenTo(this.conversationCollectionView.collection, 'prompt', function(model){
					this.renderUserPrompt(model);
				});
			},
			render: function() {
				this.$el.html(this.template({test:"World"})).append(this.conversationCollectionView.render().$el);
				return this;
			}
		});
	}
);