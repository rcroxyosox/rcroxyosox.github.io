define([
	'jquery',
	'jqueryScrollTo',
	'backbone',
	'handlebars',
	'views/HomeNavBarView',
	'views/ui/CardCollectionView',
	'views/SkinToSkinCardView',
	'views/ProgressCardView',
	'views/RoundsCardView',
	'text!/html/HomeDashboardView.html',
	'css!/css/HomeDashboardView.css'
	], function(
		$,
		jqueryScrollTo,
		Backbone,
		Handlebars,
		HomeNavBarView,
		CardCollectionView,
		SkinToSkinCardView,
		ProgressCardView,
		RoundsCardView,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'mainView HomeDashboardView',
			events   : {},
			Nav: HomeNavBarView.extend({navTitle: "Dashboard"}),
			remove: function(){
				var that = this;
				var scrolled = this.$el.scrollTop();

				var remove = function(){
					that.$el.removeClass('in');
					setTimeout(function(){
						that.trigger('removed');
						Backbone.View.prototype.remove.call(that);
					},300);
				}

				if(scrolled > 0){
					this.$el.animate({ scrollTop: 0 }, 300, remove);
				}else{
					remove();
				}
			},
			template: Handlebars.compile(html),
			render: function() {
				var that = this;
				this.$el.html(this.template(this));
				this.$el.append(new CardCollectionView({
					cards: [RoundsCardView, SkinToSkinCardView, ProgressCardView]
				}).render().$el);
				setTimeout(function(){ that.$el.addClass('in'); },10);
				return this;
			}
		});
	}
);