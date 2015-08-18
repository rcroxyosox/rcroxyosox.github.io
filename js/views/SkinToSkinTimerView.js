define([
	'jquery',
	'backbone',
	'handlebars',
	'Utils',
	'views/ui/UserPromptView',
	'text!/html/SkinToSkinTimerView.html',
	'css!/css/SkinToSkinTimerView.css',
	'css!/css/ui/forms.css',
	'css!/css/ui/popover.css'
	], function(
		$,
		Backbone,
		Handlebars,
		Utils,
		UserPromptView,
		html
		) {

		var tapEvent = (Utils.hasTouchSupport())?'click':'click';

		var goalTimeFromDB = 1000 * 60 * .5;

		return Backbone.View.extend({
			tagName  : "div",
			className: 'SkinToSkinTimerView',
			events   : function(){
				var events = {};
				events[tapEvent+' .timerContainer'] = 'toggleTimerPopover';
				events['input .timerInput'] = 'sliderChange';
				events[tapEvent+' .timerButtonSet'] = 'saveCancelGoalTime';
				return events;
			},
			template: Handlebars.compile(html),
			goalTime: goalTimeFromDB,
			intervalText: ["Second", "Minute"],
			_counter: 0,
			elapsedTime: [0,0,0],
			initialize: function(options){
				_.extend(this, options);
			},

			remove: function(){
				var that = this;
				this.userPrompt && this.userPrompt.remove();
				setTimeout(function(){
					Backbone.View.prototype.remove.call(that);
				},300);
			},
			
			saveGoalTime: function(){
				this.goalTime = this.$('.timerInput').val() * 60 * 1000;
			},

			cancelGoalTime: function(){
				this.goalTime = goalTimeFromDB;
				this.renderGoalTime();
				this.$('.timerInput').val(this.goalTime / 1000 / 60);
			},

			saveCancelGoalTime: function(event){
				var action = $(event.target).text();
				var actionSet = {
					save: this.saveGoalTime,
					cancel: this.cancelGoalTime
				};
				actionSet[action] && actionSet[action].call(this);
				this.toggleTimerPopover();
			},

			sliderChange: function(event){
				var $slider = $(event.target);
				goalTime = $slider.val();
				this.goalTime = goalTime * 60 * 1000;
				this.renderGoalTime();
			},

			toggleTimerPopover: function(event){
				if(event){
					var $obj = $(event.target);
					if($obj.closest('.timerSliderPopover').length){
						return;
					}
				}

				var isIn = this.$('.timerSliderPopover').is('.in');
				if(isIn){
					this.$('.timerSliderPopover').removeClass('in');
					this.userPrompt && this.userPrompt.$el.addClass('in');
				}else{
					this.pauseTimer();
					this.$('.timerSliderPopover').addClass('in');
					this.userPrompt && this.userPrompt.$el.removeClass('in');
				}
			},

			renderUserPrompt: function(){
				var that = this;
				this.userPrompt && this.userPrompt.remove();
				this.userPrompt = new UserPromptView({
					choices: ["start"],
					isTypeDate: true,
					events: function(){
						var events = {};
						events[tapEvent+' .buttonSet'] = function(event){
							that.toggleTimer.call(that, event)
						}
						return events;
					}
				}).render();
			},

			pauseTimer: function(event){
				if(!this.userPrompt){
					return;
				}

				var $btn = this.userPrompt.$('li:first');
				$btn.text('Start');
				clearTimeout(this.timeout);
				$('.timerElement').removeClass('blink');
				delete this.timeout;
			},

			endTimer: function(event){
				this.pauseTimer(event);
	    		this.elapsedTime = [0,0,0];
	    		this._counter = 0;

	    		this.inlineNavView.switchToViewWithIndex(1);
			},

			startTimer: function(event){
				var that = this;
				var $btn = $(event.target).closest('li');
				$btn.text('Stop');
				$('.timerElement').addClass('blink');
				this.$('.timerElement').removeClass('timerComplete');

			    (update = function(){
			    	var interval = 10;
			    	that._counter += interval;
			    	that.$('.graphic').css({height: (that._counter/that.goalTime)*100+"%"});

			    	if(that._counter % 1000 != 0){
			    		that.timeout = setTimeout(update, interval);
			    		return;
			    	}

			        var dt = new Date();
			        dt.setHours(0);
			        dt.setMinutes(that.elapsedTime[0]);
			        dt.setSeconds(that.elapsedTime[1]);
			        
			        var dt2 = new Date(dt.valueOf() + 1000);
			        var temp = dt2.toTimeString().split(" ");
			        var ts = temp[0].split(":");
			        that.elapsedTime = [parseInt(ts[1]),ts[2], that.elapsedTime[2]+1000];
			        var elapsedTimeFormatted = (that.elapsedTime[1] > 0)?that.elapsedTime[0]+":"+that.elapsedTime[1]:that.elapsedTime[0];
			        that.$('.elapsedTime').text(elapsedTimeFormatted);
			        
			        // Time reached the end
			    	if(that.elapsedTime[2] >= that.goalTime){
			    		that.$('.timerElement').addClass('timerComplete').removeClass('blink');

			    		// that.endTimer(event);
			    		// return;
			    	}

			    	that.timeout = setTimeout(update, interval);
			    })();
			},

			toggleTimer: function(event){
				if(this.timeout){
					this.$('.graphic').css({height: 0});
					this.endTimer(event);
				}else{
					this.startTimer(event);
				}

			},

			getFragmentedGoalTime: function(){
				var goalMinutes = Math.floor(this.goalTime / 60000);
				var goalSeconds = (this.goalTime - (goalMinutes * 60000)) / 1000;
				goalSeconds = ("0" + goalSeconds).slice(-2);
				var goalTimeFormatted = (goalSeconds > 0)?goalMinutes+":"+goalSeconds:goalMinutes;

				var intervalText;
				if(goalMinutes > 1){
					intervalText = this.intervalText[1]+"s";
				}else if(goalMinutes == 1 && goalSeconds == 0){
					intervalText = this.intervalText[1];
				}else if(goalSeconds > 1){
					intervalText = this.intervalText[0]+"s";
				}else if(goalSeconds == 1){
					intervalText = this.intervalText[0];
				}else{
					intervalText = this.intervalText[1]+"s";
				}

				var goalTimeFragment = {
					goalTimeAsMinutes: (this.goalTime / 1000 / 60),
					goalTime: goalTimeFormatted,
					seconds: goalSeconds,
					minutes: goalMinutes,
					intervalText: intervalText
				};
				return goalTimeFragment;
			},

			renderGoalTime: function(){
				var goalTimeFragment = this.getFragmentedGoalTime();
				this.$('.intervalText').text(goalTimeFragment.intervalText);
				this.$('.goalTime').text(goalTimeFragment.goalTime);
			},

			render: function() {
				var that = this;
				this.$el.html(this.template(this.getFragmentedGoalTime()));
				that.renderUserPrompt();
				return this;
			}
		});
	}
);