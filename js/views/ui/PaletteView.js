define([
	'jquery',
	'backbone',
	'handlebars',
	'text!/html/ui/PaletteView.html',
	'css!/css/ui/PaletteView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		html
		) {

		return Backbone.View.extend({
			tagName  : "ul",
			className: 'PaletteView',
			events   : {},
			template: Handlebars.compile(html),
			colors: [],
			initialize: function(){
				this.getColorsFromBase();
				try{
				require(['text!/sass/_base.scss'], function(){
					console.log("no");
				});
				}catch(e){
					
				}
			},
			getColorsFromBase: function(){
				// this.colors = _base.match(/#[0-9a-fA-F]{3,6}/g);
			},
			render: function() {
				this.$el.html(this.template(this));
				return this;
			}
		});
	}
);