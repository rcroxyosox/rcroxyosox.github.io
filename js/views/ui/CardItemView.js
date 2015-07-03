define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/ui/CardItemView.html',
	'css!/css/ui/CardItemView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "li",
			events   : {
				// 'click':'takeAction'
			},
			model: null,
			template: Handlebars.compile(html),
			headerTitle: "",
			headerSubTitle: "",
			takeAction: function(event){
				console.log(event);
				var $li = $(event.target);
				var pos = $li.position();
				var $modal = $('<div></div>');
				$modal.addClass('modal').css({left: event.offsetX, top: event.offsetY}).appendTo('.mainView');
				setTimeout(function(){$modal.addClass('in');},1);
			},
			initialize: function(options){
				_.extend(this, options);
			},
			render: function() {
				this.$el.html(this.template(this));
				return this;
			}
		});
	}
);