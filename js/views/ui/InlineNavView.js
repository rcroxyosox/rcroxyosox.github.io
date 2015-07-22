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
			navItems: [], // {text: "Hello", action: function(navItem){}, view:Backbone.View} 
			template: Handlebars.compile(html),

			initialize: function(options){
				_.extend(this, options);
			},

			getSelectedIndex: function(){
				return _.findIndex(this.navItems, {selected:true});
			},

			getSelectedView: function(){
				return this.navItems[this.getSelectedIndex()].view;
			},

			selectNavItem: function(event){

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
				if(!button.action && !button.view){
					var okay = false;
					console.error(button, " Should have either an action (a function), or a view (a Backbone.View)");
				}
				return okay;
			},

			takeAction: function(){
				var selectedIndex = _.findIndex(this.navItems, {selected:true});
				var navItem = this.navItems[selectedIndex];
				var action = navItem.action;
				if(action){
					action.call(this, navItem);
				}
			},

			switchView: function(){
				var selectedIndex = _.findIndex(this.navItems, {selected:true});
				var $viewContainer = this.$('.inlineNavContentArea');
				var view = this.navItems[selectedIndex].view;
				if(view){
					$viewContainer.empty().append(this.navItems[selectedIndex].view.render().$el);
				}
			},

			setSelectedState: function(){
				var selectedIndex = _.findIndex(this.navItems, {selected:true});
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
				},0)
				return this;
			}
		});
	}
);