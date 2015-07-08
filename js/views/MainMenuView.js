define([
	'jquery',
	'backbone',
	'handlebars',
	'AppView',
	'Utils',
	'text!/html/MainMenuView.html',
	'css!/css/MainMenuView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		AppView,
		Utils,
		html
		) {

		var tapEvent = (Utils.hasTouchSupport())?'touchstart':'click';

		return Backbone.View.extend({
			tagName  : "div",
			className: 'MainMenuView',
			events   : function(){
				var events = {};
				events[tapEvent+' li'] = 'goToMenuItem';
				return events;
			},
			template: Handlebars.compile(html),
			goToMenuItem: function(event){
				var $li = $(event.target);
				var route = $li.data('route');
				AppView.getInstance().router.navigate(route, {trigger:true});
				this.modal.remove();
			},
			render: function() {
				this.$el.html(this.template({}));
				return this;
			}
		});
	}
);