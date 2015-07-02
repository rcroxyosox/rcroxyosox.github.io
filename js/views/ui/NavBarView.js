define([
	'jquery',
	'backbone',
	'handlebars',
	'AppView',
	'Utils',
	'text!/html/ui/NavBarView.html',
	'css!/css/ui/NavBarView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		AppView,
		Utils,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'NavBarView',
			leftButtons:[],
			rightButtons:[],
			attachedToView: null,
			template: Handlebars.compile(html),
			headerSelector: '.navBarViewHeader', // a reference to the header element
			navTitle: "",
			headerTitle: "",
			headerSubTitle: "",
			initialize: function(options){
				_.extend(this, options);
				var that = this;
				var tapEvent = (Utils.hasTouchSupport())?'touchstart':'click';
				this.listenTo(AppView.getInstance().router, 'route', that.setSelected);

				_.each(this.getButtons(), function(button){
					if(button.route && button.iconClass){
						that.events[tapEvent+' .'+button.iconClass] = function(){
							AppView.getInstance().router.navigate(button.route, {trigger:true});
						}
					}
				});

				this.delegateEvents();
				this.initScrollListener();
			},

			initScrollListener: function(){
				var that = this;
				this.attachedToView.$el.on('scroll', function(event){
					var $header = $(that.headerSelector);
					var headerHeight = parseInt(that.attachedToView.$el.css('padding-top'));
					var navHeight = that.$el.height();
					var scrollAmount = $(event.target).scrollTop();
					var perc = (scrollAmount*0.3);
					var perc2 = (scrollAmount/(headerHeight-that.$el.height()));

					$header.css({'background-size':(100+perc*0.3)+"%"});
					$header.find('.tint').css({opacity: perc2});
					$header.find('section').css({opacity: 1-perc2*2.5, transform:'translateY(-'+perc+'px)'});
					console.log(perc);


					if((headerHeight - scrollAmount) < navHeight){
						that.$el.addClass('in')
					}else{
						that.$el.removeClass('in');
					}

					that.$el.find('.navTitleCell').css({opacity: perc2});
				});
			},

			getButtons: function(){
				return _.extend({},this.leftButtons, this.rightButtons);
			},

			setSelected: function(){
				var selected = AppView.getInstance().router.getCurrentRoute();
				var buttons = this.getButtons();
				var button = _.findWhere(buttons, {route:selected});
				this.$('.icon').removeClass('selected');
				this.$('.'+button.iconClass).addClass('selected');
			},

			toggleSettings: function(){
				alert("settings");
			},

			render: function() {
				var that = this;
				this.$el.html(this.template(this));
				setTimeout(function(){ 
					that.setSelected(); 
					that.$el.parent().append(that.$(that.headerSelector));
				},0);
				return this;
			}
		});
	}
);