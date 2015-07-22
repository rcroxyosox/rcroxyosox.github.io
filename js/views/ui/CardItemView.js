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

		var tapEvent = (Utils.hasTouchSupport())?'click':'click';

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
			modal: null,
			onModalClose: function(){
				AppView.getInstance().router.back({trigger: false, replace: false});
				AppView.getInstance().currentNav.$el.removeClass('hide');
				this.$el.removeClass('modalIn');
			},
			initialize: function(options){
				var that = this;
				_.extend(this, options);
				this.modal = new MintModalView({
					onClose: function(){ that.onModalClose(); },
					contentView: new this.DetailView()
				})
			},
			openDetailView: function(event){
				var that = this;
				this.$el.toggleClass('modalIn');
				AppView.getInstance().currentNav.$el.addClass('hide');
				setTimeout(function(){
					that.modal.render();
				},300);
			},
			render: function() {
				this.$el.html(this.template(this));
				return this;
			}
		});
	}
);