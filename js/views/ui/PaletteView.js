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
			colors: [{"name":"$gray1","color":"#eff2ec"},{"name":"$gray2","color":"#eeeded"},{"name":"$gray2_3","color":"#e3e3e3"},{"name":"$gray3","color":"#d4d4d4"},{"name":"$gray4","color":"#999999"},{"name":"$gray6","color":"#333"},{"name":"$purple2","color":"#6563a4"},{"name":"$purple3","color":"#5f5d9a"},{"name":"$purple4","color":"#7a4364"},{"name":"$pink2","color":"#d667cd"},{"name":"$green2","color":"#6dd5c9"},{"name":"$blue3","color":"#00bcd4"}],
			_base: null,
			initialize: function(){
				var that = this;
				if(!this.colors.length){
					require(['text!/sass/_base.scss'], function(_base){
						that._base = _base; 
						that.getColorsFromBase();
						that.render();
					});
				}
			},
			getColorsFromBase: function(){
				var that = this;
				var colors = this._base.match(/(\$.*?) ?: ?#[0-9a-fA-F]{3,6}/g);
				_.each(colors, function(color){
					var colorItem = color.replace(/\s/g,'').split(":");

					that.colors.push({
						name: colorItem[0],
						color: colorItem[1]
					});
				});
				console.log(JSON.stringify(this.colors));
			},
			render: function() {
				this.$el.html(this.template(this));
				return this;
			}
		});
	}
);