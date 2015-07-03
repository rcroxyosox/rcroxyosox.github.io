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

		var tapEvent = (Utils.hasTouchSupport())?'touchstart':'click';

		return Backbone.View.extend({
			tagName  : "div",
			className: 'UserPromptView',
			events   : function(){
				var events = {};
				events[tapEvent+' .userPromptChoices'] = 'addResponse';
				events['focus input'] = 'focusInput';
				return events;
			},
			template: Handlebars.compile(html),
			model: null,
			responseObj: null,
			focusInput: function(event){
				$(event.target).removeClass('blink');
			},
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
				var x = '-'+$('.mainViewContent').css('padding-right');
				var y = '-'+(bottom)+'px';

				// that.$el.empty().css({
				// 	'transform': 'translateX('+x+') translateY('+y+')', 
				// });
				
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
				event.preventDefault();
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
				var responseType = ConversationItemModelCollection.getInstance().model.responseType;
				var reqResponseType = this.model.get('requiresResponseType');
				var data = this.model.toJSON();

				data.choices && (data.numChoices = data.choices.length);
				data.isTypeChoice = (reqResponseType == responseType.CHOICE);
				data.isTypeInput = (reqResponseType == responseType.INPUT);

				this.$el.html(this.template(data));
				
				$('.AppView').append(this.$el);
				
				setTimeout(function(){
					that.$el.addClass('in');
				},100);

				return this;
			}
		});
	}
);