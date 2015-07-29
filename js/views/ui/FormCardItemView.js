define([
	'jquery',
	'backbone',
	'handlebars',
	'lib/handlebars-helpers',
	'views/ui/CardItemView',
	'text!/html/ui/FormCardItemView.html',
	'css!/css/ui/FormCardItemView.css',
	'css!/css/ui/forms.css'
	], function(
		$,
		Backbone,
		Handlebars,
		handlebarsHelpers,
		CardItemView,
		html
		) {

		return CardItemView.extend({
			className: 'CardItemView FormCardItemView',
			events   : {},
			template: Handlebars.compile(html),
			headerTitle: "",
			roundsFormItemCollection: null,
			initialize: function(options){
				_.extend(this, options);
			},
			render: function() {
				var that = this;
				var data = _.extend(this, {formItems: this.roundsFormItemCollection.toJSON()});
				this.$el.html(this.template(data));
				return this;
			}
		});
	}
);