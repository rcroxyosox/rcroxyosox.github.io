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