define([
	'jquery',
	'jqueryScrollTo',
	'backbone',
	'handlebars',
	'views/HomeNavBarView',
	'views/ui/CardCollectionView',
	'text!/html/HomeDashboardView.html',
	'css!/css/HomeDashboardView.css'
	], function(
		$,
		jqueryScrollTo,
		Backbone,
		Handlebars,
		HomeNavBarView,
		CardCollectionView,
		html
		) {

		return Backbone.View.extend({
			tagName  : "div",
			className: 'mainView HomeDashboardView',
			events   : {},
			Nav: HomeNavBarView.extend({navTitle: "Dashboard"}),
			remove: function(){
				var that = this;
				this.$el.animate({ scrollTop: 0 }, 300, function(){
					that.$el.removeClass('in');
					setTimeout(function(){
						that.trigger('removed');
						Backbone.View.prototype.remove.call(that);
					},300);
				});
			},
			template: Handlebars.compile(html),
			render: function() {
				var that = this;
				this.$el.html(this.template(this));
				this.$el.append(new CardCollectionView().render().$el);
				setTimeout(function(){ that.$el.addClass('in'); },10);
				return this;
			}
		});
	}
);