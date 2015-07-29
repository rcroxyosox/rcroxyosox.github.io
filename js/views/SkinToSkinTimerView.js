define([
	'jquery',
	'backbone',
	'handlebars',
	'Utils',
	'views/ui/UserPromptView',
	'text!/html/SkinToSkinTimerView.html',
	'css!/css/SkinToSkinTimerView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		Utils,
		UserPromptView,
		html
		) {

		var tapEvent = (Utils.hasTouchSupport())?'click':'click';

		return Backbone.View.extend({
			tagName  : "div",
			className: 'SkinToSkinTimerView',
			events   : {},
			template: Handlebars.compile(html),
			goalTime: 6000,
			intervalText: "Minute",
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

			renderUserPrompt: function(){
				var that = this;
				this.userPrompt && this.userPrompt.remove();
				this.userPrompt = new UserPromptView({
					choices: ["start"],
					isTypeChoice: true,
					events: function(){
						var events = {};
						events[tapEvent+' .userPromptChoices'] = function(event){
							that.toggleTimer.call(that, event)
						}
						return events;
					}
				}).render();
			},

			pauseTimer: function(event){
				var $btn = $(event.target).closest('li');
				$btn.text('Start');
				clearTimeout(this.timeout);
				$('.timerElement').removeClass('blink');
				delete this.timeout;
			},

			endTimer: function(event){
				this.pauseTimer(event);
	    		this.elapsedTime = [0,0,0];
	    		this._counter = 0;
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

			    		that.endTimer(event);
			    		return;
			    	}

			    	that.timeout = setTimeout(update, interval);
			    })();
			},

			toggleTimer: function(event){
				if(this.timeout){
					this.pauseTimer(event);
				}else{
					this.startTimer(event);
				}

			},

			render: function() {
				var that = this;
				var goalMinutes = Math.floor(this.goalTime / 60000);
				var goalSeconds = (this.goalTime - (goalMinutes * 60000)) / 1000;
				goalSeconds = ("0" + goalSeconds).slice(-2);
				var goalTime = (goalSeconds > 0)?goalMinutes+":"+goalSeconds:goalMinutes;
				var intervalText = (goalMinutes > 0) ? this.intervalText : this.intervalText+"s";
				this.$el.html(this.template({goalTime:goalTime, intervalText: intervalText}));
				that.renderUserPrompt();
				return this;
			}
		});
	}
);