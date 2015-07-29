define([
	'jquery',
	'backbone',
	'handlebars',
	'Utils',
	'text!/html/ui/InlineNavView.html',
	'css!/css/ui/InlineNavView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		Utils,
		html
		) {

		var tapEvent = (Utils.hasTouchSupport())?'touchstart':'click';

		return Backbone.View.extend({
			tagName  : "div",
			className: 'InlineNavView',
			events   : function(){
				var events = {};
				events[tapEvent+' nav li'] = 'selectNavItem';
				return events;
			},
			selectionBarHtml: '<div class="selectionBar"></div>',
			navItems: [], // {text: "Hello", action: function(navItem){}, View:Backbone.View, _renderedView: new Backbone.View()} 
			_prevIndex: null,
			_direction: null,
			_animating: false,
			template: Handlebars.compile(html),

			initialize: function(options){
				_.extend(this, options);
			},

			getSelectedIndex: function(){
				return _.findIndex(this.navItems, {selected:true});
			},

			getSelectedView: function(){
				return this.navItems[this.getSelectedIndex()]._renderedView;
			},

			selectNavItem: function(event){

				if(this._animating){
					return;
				}

				var selectedIndex = null;

				if(event){
					var $obj = $(event.target);
					selectedIndex = $obj.index();
				}else{
					selectedIndex = this.getSelectedIndex();
				}

				if(selectedIndex == null){
					return;
				}

				this.navItems.map(function(navItem){
					navItem.selected = false;
				});

				this.navItems[selectedIndex].selected = true;

				var valid = this.validate();	
				if(!valid){
					return;
				}

				this.setSelectedState();
				this.switchView();
				this.takeAction();
			},

			validate: function(){
				var okay = true;
				var selectedIndex = this.getSelectedIndex();
				var button = this.navItems[selectedIndex];
				if(!button.action && !button.View){
					var okay = false;
					console.error(button, " Should have either an action (a function), or a view (a Backbone.View)");
				}
				return okay;
			},

			takeAction: function(){
				var selectedIndex = this.getSelectedIndex();
				var navItem = this.navItems[selectedIndex];
				var action = navItem.action;
				if(action){
					action.call(this, navItem);
				}
			},

			switchView: function(){
				var that = this;
				var selectedIndex = this.getSelectedIndex();

				if(this._prevIndex == selectedIndex || !this.navItems[selectedIndex].View){
					return;
				}

				var $viewContainer = this.$('.inlineNavContentArea');
				var view = this.navItems[selectedIndex]._renderedView = new this.navItems[selectedIndex].View();

				if(this._prevIndex != null){
					this._animating = true;
					this._direction = (selectedIndex > this._prevIndex)?'Left':'Right'
					this.$el.addClass('animate animate'+this._direction);
					var delay = Utils.getTransitionDuration($viewContainer);
					that.navItems[that._prevIndex]._renderedView.$el.removeClass('in');
					view.$el.addClass('transitioning');
					setTimeout(function(){
						that._animating = false;
						that.$el.removeClass('animate animateLeft animateRight');
						that.navItems[that._prevIndex]._renderedView.remove();
						that.navItems[selectedIndex]._renderedView.$el.removeClass('transitioning left right');
						that._prevIndex = selectedIndex;
					}, delay || 500);

				}else{
					this._prevIndex = selectedIndex;
				}

				if(view){
					this._direction && view.render().$el.addClass(this._direction.toLowerCase());

					setTimeout(function(){
						view.$el.addClass('in');
					},0);

					$viewContainer.append(view.render().$el);
				}

				
			},

			setSelectedState: function(){
				var selectedIndex = this.getSelectedIndex();
				var $selectedItem = this.$('li:eq('+selectedIndex+')');
				var $selectionBar = this.$('.selectionBar');
				var pos = $selectedItem.position();
				var size = {width: $selectedItem.width(),height: $selectedItem.height()};
				$selectionBar.css({left: pos.left, width: size.width});
			},

			render: function() {

				if(!this.navItems.length){
					return this;
				}

				var that = this;
				this.$el.html(this.template(this));
				setTimeout(function(){
					that.selectNavItem();
				},300)
				return this;
			}
		});
	}
);