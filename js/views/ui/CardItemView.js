define([
	'jquery',
	'backbone',
	'AppView',
	'handlebars',
	'Utils',
	'views/ui/MintModalView',
	'text!/html/ui/CardItemView.html',
	'css!/css/ui/CardItemView.css'
	], function(
		$,
		Backbone,
		AppView,
		Handlebars,
		Utils,
		MintModalView,
		html
		) {

		var tapEvent = (Utils.hasTouchSupport())?'touchstart':'click';

		return Backbone.View.extend({
			tagName  : "li",
			events   : function(){
				var events = {};
				events[tapEvent] = 'openDetailView';
				return events;
			},
			model: null,
			template: Handlebars.compile(html),
			headerTitle: "",
			headerSubTitle: "",
			DetailView: null,
			openDetailView: function(event){
				var that = this;
				this.$el.toggleClass('modalIn');
				AppView.getInstance().currentNav.$el.addClass('hide');
				setTimeout(function(){
					new MintModalView({
						onClose: function(){
							AppView.getInstance().currentNav.$el.removeClass('hide');
							that.$el.removeClass('modalIn');
						},
						contentView: new that.DetailView()
					}).render();
				},300);
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