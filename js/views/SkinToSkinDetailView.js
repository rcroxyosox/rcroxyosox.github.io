define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ModalNavBarView',
	'views/ui/InlineNavView',
	'views/SkinToSkinTimerView',
	'text!/html/SkinToSkinDetailView.html',
	'css!/css/SkinToSkinDetailView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		ModalNavBarView,
		InlineNavView,
		SkinToSkinTimerView,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'mainView SkinToSkinDetailView',
			Nav: ModalNavBarView.extend({
				navTitle: "Skin to Skin"
			}),
			events   : {},
			template: Handlebars.compile(html),
			inlineNavView: null,
			modalOptions: {

			},
			
			remove: function(){
				var that = this;
				this.navInstance && this.navInstance.$el.addClass('hide'); 
				this.$el.removeClass('in');
				if(this.inlineNavView){
					var view = this.inlineNavView.getSelectedView();
					view && view.remove();
				}
				setTimeout(function(){
					Backbone.View.prototype.remove.call(that);
					that.trigger('removed');
				}, 500);
			},

			render: function() {
				var that = this;
				this.$el.html(this.template({}));

				setTimeout(function(){ that.$el.addClass('in'); },10);

				this.inlineNavView = new InlineNavView({
					navItems: [	
						{text: "Timer", selected: true, View: SkinToSkinTimerView},
						{text: "Overtime", action: function(){console.log("rerender?");}}
					]
				});
				
				this.inlineNavView.render().$el.appendTo(this.$('.mainViewContent'));

				return this;
			}
		});
	}
);