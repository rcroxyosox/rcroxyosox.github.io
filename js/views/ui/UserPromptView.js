define([
	'jquery',
	'backbone',
	'handlebars',
	'Utils',
	'models/ConversationItemModelCollection',
	'text!/html/ui/UserPromptView.html',
	'css!/css/ui/UserPromptView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		Utils,
		ConversationItemModelCollection,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'UserPromptView',
			events   : {
				'click .userPromptChoices': 'addResponse'
			},
			template: Handlebars.compile(html),
			model: null,
			responseObj: null,
			remove: function(){
				var that = this;
				if(this.$el.is('.in')){
					var delay = Utils.getTransitionDuration(this.$el);
					this.$el.removeClass('in');
					setTimeout(function(){
						Backbone.View.prototype.remove.call(that);
					},delay);
				}else{
					Backbone.View.prototype.remove.call(this);
				}
			},
			moveToResponsePosition: function(){
				var that = this;
				
				var $last = $('.ConversationCollectionView li:last');
				var $lastMessage = $last.find('p');
				var position = $lastMessage.position();
				var right = $('body').width() - position.left + $lastMessage.width();
				var bottom = $('body').height() - position.top;
				var delay = Utils.getTransitionDuration(that.$el);
				that.$el.css({bottom: "", right: $('.mainView').css('padding-right'), bottom: bottom});
				setTimeout(function(){
					$last.addClass('in');
				},delay-400);
				setTimeout(function(){
					that.$el.removeClass('in').empty();
					console.log(that.$el.html());
					that.saveResponse();
				}, delay+400)
				setTimeout(function(){
					$last.addClass('showText');
				}, delay)
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
				this.$el.addClass('send').removeClass('in');
				// return;

				var that = this;
				// this.$el.removeClass('in');
				var $selection = $(event.target).closest('li');
				var selectedChoiceIndex = $selection.index();
				var conversationItemModelCollection = ConversationItemModelCollection.getInstance();
				var ConversationItemModel = ConversationItemModelCollection.getInstance().model;
				this.responseObj = {
					responseTo: this.model,
					selectedChoice: selectedChoiceIndex
				};

				conversationItemModelCollection.addUserResponse(this.responseObj);

				setTimeout(function(){
					that.moveToResponsePosition();
				},100);
			},
			render: function() {
				var that = this;
				var data = this.model.toJSON();
				data.choices && (data.numChoices = data.choices.length);
				this.$el.html(this.template(data));
				setTimeout(function(){
					that.$el.addClass('in');
				},100);
				return this;
			}
		});
	}
);