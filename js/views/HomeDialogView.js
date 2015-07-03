define([
	'jquery',
	'jqueryScrollTo',
	'backbone',
	'handlebars',
	'Utils',
	'AppView',
	'views/HomeNavBarView',
	'views/ui/UserPromptView',
	'models/ConversationItemModelCollection',
	'text!/html/HomeDialogView.html',
	'text!/html/ConversationItemView.html',
	'css!/css/HomeDialogView.css',
	'css!/css/ConversationCollectionView.css'
	], function(
		$,
		jqueryScrollTo,
		Backbone,
		Handlebars,
		Utils,
		AppView,
		HomeNavBarView,
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
			events:{
				'click':'test'
			},

			renderViewFromBotResponse: function(renderInstruction){
				console.log(renderInstruction);

				// A skin to skin card
				return $.Deferred(function(dfd){
					if(renderInstruction == "carditem:skintoskin"){
						require(['views/SkinToSkinCardView'], function(SkinToSkinCardView){
							dfd.resolve(new SkinToSkinCardView({tagName:'div'}).render().$el);
						});
					}else{
						def.reject('No action found for instruction: '+renderInstruction);
					}
				}).promise();
			},

			initialize: function(){
				var that = this;
				this.listenTo(this.model, 'change:stub', function(){
					that.$el.toggleClass('stubItem', this.model.get('stub'));
					var message = that.model.get('message');
					var $container = that.$('p');
					if(message.indexOf("{{") > -1){
						var renderInstruction = message.substring(2,message.length-2);
						that.renderViewFromBotResponse(renderInstruction).always(function(response){
							$container.empty().append(response);
						});
					}else{
						$container.empty().append(message);
					}

					setTimeout(function(){
						that.scrollIfNeeded();
					},300);
				});
			},
			scrollIfNeeded: function(){
				var that = this;
				var thisBottom = that.$('p').position().top + that.$('p').height();
				var pageBottom = $('.mainView').height();
				if(thisBottom > pageBottom){
					$('.mainView').scrollTo('.ConversationCollectionView li:last', 800);
				}
			},
			render: function(){
				var that = this;
				var data = this.model.toJSON();
				data.isFromBot = this.model.isFromBot();
				this.$el.toggleClass('stubItem', data.stub);
				this.$el.addClass((data.isFromBot)?'botItem':'userItem');
				this.$el.html(this.template(data));
				if(data.isFromBot){
					setTimeout(function(){
						that.$el.addClass('in');
					},100);
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
				this.collection.reset([]);
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
			Nav: HomeNavBarView.extend({navTitle:""}),
			events   : {},
			template: Handlebars.compile(html),
			conversationCollectionView: null,
			remove: function(){
				var that = this;
				this.$el.removeClass('in');
				this.userPrompt && this.userPrompt.remove();
				var scrolled = this.$el.scrollTop();

				var remove = function(){
					that.$el.removeClass('in');
					setTimeout(function(){
						that.trigger('removed');
						Backbone.View.prototype.remove.call(that);
					},300);
				}

				if(scrolled > 0){
					this.$el.animate({ scrollTop: 0 }, 300, remove);
				}else{
					remove();
				}

			},
			renderUserPrompt: function(model){
				this.userPrompt && this.userPrompt.remove();
				this.userPrompt = new UserPromptView({model:model}).render();
				this.userPrompt.render();
			},
			initialize: function(){
				var that = this;
				this.conversationCollectionView = new ConversationCollectionView();
				this.listenTo(this.conversationCollectionView.collection, 'prompt', function(model){
					that.renderUserPrompt(model);
				});
			},
			render: function() {
				var that = this;
				this.$el.html(this.template()).find('.mainViewContent').append(this.conversationCollectionView.render().$el);
				setTimeout(function(){ that.$el.addClass('in'); },10);
				return this;
			}
		});
	}
);