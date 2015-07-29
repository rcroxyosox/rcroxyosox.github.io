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
						{label:"Is Jane Well?", type:"select", options:[{text:"", value:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{label:"Is Jane in Pain?", type:"select", options:[{text:"", attributes:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{label: "Is Jane Comfortable?", type:"select", options:[{text:"", attributes:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{attributes:"placeholder=Overall Observations", type:"text"}
					])
				});

				var VitalsFormCardItemView = FormCardItemView.extend({
					headerTitle: "Vitals",
					roundsFormItemCollection: new RoundsFormItemCollection([
						{label:"Is Jane Well?", type:"select", options:[{text:"", value:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{label:"Is Jane in Pain?", type:"select", options:[{text:"", attributes:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{label: "Is Jane Comfortable?", type:"select", options:[{text:"", attributes:"disabled selected"}, {text:"Yes", value:"yes"}, {text:"No", value:"no"}]},
						{attributes:"placeholder=Overall Observations", type:"text"}
					])
				});

				var cardCollectionView = new CardCollectionView({ cards: [DateFormCardItemView, BasicsFormCardItemView, GeneralFormCardItemView, VitalsFormCardItemView] });
				this.$el.empty().append(cardCollectionView.render().$el);

				return this;
			}
		});
	}
);