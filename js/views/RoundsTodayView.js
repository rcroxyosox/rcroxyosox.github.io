define([
	'jquery',
	'backbone',
	'handlebars',
	'moment',
	'views/ui/CardCollectionView',
	'views/ui/FormCardItemView'
	], function(
		$,
		Backbone,
		Handlebars,
		moment,
		CardCollectionView,
		FormCardItemView
		// html
		) {


		var RoundsFormItemModel = Backbone.Model.extend({
			defaults:{
				type:"", 
				options:[], // {{text="", value=""}}
				label:"", 
				attributes:"" //foo=bar foo2=bar2
			}
		});

		var RoundsFormItemCollection = Backbone.Collection.extend({
			model: RoundsFormItemModel
		})

		return Backbone.View.extend({
			tagName  : "div",
			className: 'RoundsTodayView',
			events   : {},
			initialize: function(options){
				_.extend(this, options);
			},
			render: function() {

				var DateFormCardItemView = FormCardItemView.extend({
					headerTitle: "Date",
					roundsFormItemCollection: new RoundsFormItemCollection([
						{type:"text", value:moment().format('dddd, MMMM Do, YYYY'), attributes:"disabled"}
					])
				});

				var BasicsFormCardItemView = FormCardItemView.extend({
					headerTitle: "Basics",
					roundsFormItemCollection: new RoundsFormItemCollection([
						{label:"Weight", type:"text"},
						{label:"Notes", type:"text"}
					])
				});

				var GeneralFormCardItemView = FormCardItemView.extend({
					headerTitle: "General Conditions",
					roundsFormItemCollection: new RoundsFormItemCollection([
						{type:"select", options:[{text:"Is Jane Well?", attributes:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{type:"select", options:[{text:"Is Jane in Pain?", attributes:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{type:"select", options:[{text:"Is Jane Comfortable?", attributes:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{attributes:"placeholder=Overall Observations", type:"text"}
					])
				});

				var cardCollectionView = new CardCollectionView({ cards: [DateFormCardItemView, BasicsFormCardItemView, GeneralFormCardItemView] });
				this.$el.empty().append(cardCollectionView.render().$el);

				return this;
			}
		});
	}
);