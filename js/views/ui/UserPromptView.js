define([
	'jquery',
	'backbone',
	'handlebars',
	'Utils',
	'models/ConversationItemModelCollection',
	'text!/html/ui/UserPromptView.html',
	'css!/css/ui/UserPromptView.css',
	'css!/css/ui/buttons.css'
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
			template: Handlebars.compile(html),
			model: null,
			responseObj: null,
			choices: [],
			units: [], // eg. {text:"Inches", value:"in"}, {text:"Feet", value:"ft"}
			isTypeChoice: false,
			isTypeInput: false,
			isTypeDate: false,
			isTypeUnit: false,

			initialize: function(options){
				_.extend(this, options);
			},

			hide: function(){
				this.$el.removeClass('in');
			},

			show: function(){
				this.$el.addClass('in');
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

			render: function() {
				var that = this;

				this.numChoices = this.choices.length;
				this.$el.html(this.template(this));
				
				$('.AppView').append(this.$el);
				
				setTimeout(function(){
					that.$el.addClass('in');
				},100);

				return this;
			}
		});
	}
);