define([
	'jquery',
	'backbone',
	'handlebars',
	'AppView',
	'Utils',
	'views/ui/MintModalView',
	'views/MainMenuView',
	'text!/html/ui/NavBarView.html',
	'css!/css/ui/NavBarView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		AppView,
		Utils,
		MintModalView,
		MainMenuView,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'NavBarView',
			collapsed: false,
			leftButtons: [{
				iconClass:'icon-menu',
				action: function(event){
					var that = this;
					var $main = $('.AppView').children().not('.mainMenuModal');
					$main.addClass('out');

					if(this.mainMenuModal){
						return;
					}

					this.mainMenuModal = new MintModalView({
						extraClass: 'mainMenuModal',
						onBeforeClose: function(){
							that.mainMenuModal = null;
							$main.removeClass('out');
						},
						contentView: new MainMenuView()
					}).render();
				},
			}],
			rightButtons:[],
			attachedToView: null,
			template: Handlebars.compile(html),
			headerSelector: '.navBarViewHeader', // a reference to the header element
			navTitle: "",
			headerTitle: "",
			headerSubTitle: "",
			events: {},
			initialize: function(options){
				_.extend(this, options);
				var that = this;
				var tapEvent = (Utils.hasTouchSupport())?'touchstart':'click';
				this.listenTo(AppView.getInstance().router, 'route', that.setSelected);
				_.each(this.getButtons(), function(button){

					if(!button.iconClass){
						console.error("Buttons should have an .iconClass key");
						return;
					}


					if(button.route){
						that.events[tapEvent+' .'+button.iconClass] = function(){
							AppView.getInstance().router.navigate(button.route, {trigger:true});
						}
					}

					if(button.action){
						that.events[tapEvent+' .'+button.iconClass] = button.action;
					}

				});

				this.delegateEvents();
				this.initScrollListener();
			},

			initScrollListener: function(){
				var that = this;
				if(this.collapsed){ return; }
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

					if((headerHeight - scrollAmount) < navHeight){
						that.$el.addClass('in')
					}else{
						that.$el.removeClass('in');
					}

					that.$el.find('.navTitleCell').css({opacity: perc2});
				});
			},

			getButtons: function(){
				return this.leftButtons.concat(this.rightButtons);
			},

			setSelected: function(){
				var selected = AppView.getInstance().router.getCurrentRoute();
				var buttons = this.getButtons();
				var button = _.findWhere(buttons, {route:selected});
				if(button){
					this.$('.icon').removeClass('selected');
					this.$('.'+button.iconClass).addClass('selected');
				}
			},

			toggleSettings: function(){
				alert("settings");
			},

			render: function() {
				var that = this;
				this.collapsed && this.$el.addClass('in collapsed');
				this.$el.html(this.template(this));
				this.collapsed && this.$('.navBarViewHeader').addClass('collapsed');
				setTimeout(function(){ 
					that.setSelected(); 
					that.$el.parent().append(that.$(that.headerSelector));
				},0);
				return this;
			}
		});
	}
);