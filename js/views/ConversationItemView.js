define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/ConversationItemView.html',
	'css!/css/ConversationItemView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : 'div',
			className: 'ConversationItemView',
			events   : {},
			template: Handlebars.compile(html),
			render: function() {
				this.$el.html(this.template({}));
				return this;
			}
		});
	}
);