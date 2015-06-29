define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/ui/NavBarView.html',
	'css!/css/ui/NavBarView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'NavBarView',
			events   : {
				'click .icon-settings':'toggleSettings'
			},
			leftButtons: [{
				iconClass:'icon-settings'
			}],
			rightButtons: [],
			template: Handlebars.compile(html),
			toggleSettings: function(){
				alert("settings");
			},
			render: function() {
				this.$el.html(this.template(this));
				return this;
			}
		});
	}
);