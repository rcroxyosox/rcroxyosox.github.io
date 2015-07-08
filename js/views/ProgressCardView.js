define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ui/CardItemView',
	'views/ProgressDetailView',
	'text!/html/ProgressCardView.html',
	'css!/css/ProgressCardView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		CardItemView,
		ProgressDetailView,
		html
		) {

		return CardItemView.extend({
			className: 'CardItemView ProgressCardView',
			headerTitle: "Progress",
			headerSubTitle: "Last 7 Days",
			template: Handlebars.compile(html),
			dataPoints: [{name:"Breathing", perc:40}, {name:"Eating", perc:80}, {name:"Training", perc:35}], // make this a collection of models
			DetailView: ProgressDetailView, 
			render: function() {
				var that = this;
				CardItemView.prototype.render.call(this);
				this.$el.html(this.template(this));
				setTimeout(function(){
					that.$('.progressBar').addClass('in');
				},10);
				return this;
			}
		});
	}
);