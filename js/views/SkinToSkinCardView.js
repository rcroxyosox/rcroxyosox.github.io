define([
	'jquery',
	'backbone',
	'handlebars',
	'views/ui/CardItemView',
	'views/ui/MintChartBarView',
	'views/SkinToSkinDetailView',
	'text!/html/SkinToSkinCardView.html',
	'css!/css/SkinToSkinCardView.css'
	], function(
		$,
		Backbone,
		Handlebars,
		CardItemView,
		MintChartBarView,
		SkinToSkinDetailView,
		html
		) {

		var SkinToSkinModel = Backbone.Model.extend({
			defaults:{
				delta: 2,
				deltaIncrease: true
			}
		});

		return CardItemView.extend({
			className: 'CardItemView SkinToSkinCardView',
			headerTitle: "Skin To Skin",
			headerSubTitle: "Last 7 Days",
			template: Handlebars.compile(html),
			model: new SkinToSkinModel(),
			DetailView: SkinToSkinDetailView, 
			render: function() {
				CardItemView.prototype.render.call(this);
				var data = _.extend(this, this.model.toJSON());
				this.$el.html(this.template(data));
				this.$('section > div').append(new MintChartBarView({
					topPadding: 3,
					lines: 0,
					data: [3,10,5,9,2,0,8,4],
					labels: ["w","t","f","s","s","m","t","w"],
					showToolTips: false,
				}).render().$el);
				return this;
			}
		});
	}
);