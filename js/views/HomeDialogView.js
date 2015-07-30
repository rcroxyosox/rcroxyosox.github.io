define([
	'jquery',
	'jqueryScrollTo',
	'backbone',
	'handlebars',
	'moment',
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
		moment,
		Utils,
		AppView,
		HomeNavBarView,
		UserPromptView,
		ConversationItemModelCollection,
		html,
		ConversationItemViewHTML
		) {

		var tapEvent = (Utils.hasTouchSupport())?'touchstart':'click';

		var ConversationPromptView = UserPromptView.extend({
			model: null,
			events   : function(){
				var events = {};
				events['focus input'] = 'focusInput';
				events['keyup input'] = 'enterKey';
				events[tapEvent+' .buttonSet'] = 'addResponse';
				events[tapEvent+' button'] = 'addResponse';
				return events;
			},

			initialize: function(options){
				UserPromptView.prototype.initialize.call(this, options);
				var responseType = ConversationItemModelCollection.getInstance().model.responseType;
				var reqResponseType = this.model.get('requiresResponseType');
				this.choices = this.model.get('choices');
				this.isTypeChoice = (reqResponseType == responseType.CHOICE);
				this.isTypeInput = (reqResponseType == responseType.INPUT);
			},

			enterKey: function(event){
				if(event.keyCode == 13){
					this.addResponse();
				}
			},

			focusInput: function(event){
				$(event.target).removeClass('blink');
			},

			moveToResponsePosition: function(){
				var that = this;
				var $last = $('.ConversationCollectionView li:last');
				var $lastMessage = $last.find('p');
				var position = $lastMessage.position();
				var right = $('body').width() - position.left + $lastMessage.width();
				var bottom = $('body').height() - position.top;
				var delay = Utils.getTransitionDuration(that.$el);
				var x = '-'+$('.mainViewContent').css('padding-right');
				var y = '-'+(bottom)+'px';
				
				setTimeout(function(){
					$last.addClass('in');
				},delay-400);

				that.$el.removeClass('in');
				that.saveResponse();
			},

			saveResponse: function(){
				var that = this;
				var conversationItemModelCollection = ConversationItemModelCollection.getInstance();
				conversationItemModelCollection.create(this.responseObj)
				.done(function(){
					that.remove();
				})
				.fail(function(){
					that.$el.removeClass('send').addClass('in');
				});
			},

			addResponse: function(event){
				var that = this;
				var conversationItemModelCollection = ConversationItemModelCollection.getInstance();
				event && event.preventDefault();
				
				var responseType = conversationItemModelCollection.model.responseType;
				var reqResponseType = this.model.get('requiresResponseType');

				this.$el.addClass('send').removeClass('in');
				this.responseObj = {
					responseTo: this.model,
					responseType: reqResponseType
				};
				// return;


				if(reqResponseType == responseType.CHOICE){
					var $selection = $(event.target).closest('li');
					var selectedChoiceIndex = $selection.index();
					var conversationItemModelCollection = ConversationItemModelCollection.getInstance();
					var ConversationItemModel = ConversationItemModelCollection.getInstance().model;

					this.responseObj.selectedChoice = selectedChoiceIndex;
				}
				else if(reqResponseType == responseType.INPUT){
					this.responseObj.responseText = this.$('input').val();
				}

				conversationItemModelCollection.addUserResponse(this.responseObj);

				setTimeout(function(){
					that.moveToResponsePosition();
				},100);
			}
		});

		// A conversational item
		var ConversationItemView = Backbone.View.extend({
			tagName: 'li',
			model: null, // Should be a ConversationItemModel
			template: Handlebars.compile(ConversationItemViewHTML),

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
			Nav: HomeNavBarView.extend({navTitle:''}),
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
				this.userPrompt = new ConversationPromptView({model:model}).render();
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
				this.$el.html(this.template({postTime: moment().calendar()})).find('.mainViewContent').append(this.conversationCollectionView.render().$el);
				setTimeout(function(){ that.$el.addClass('in'); },10);
				return this;
			}
		});
	}
);