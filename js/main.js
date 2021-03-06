require.config({

	paths :{
		underscore: '/js/lib/underscore',
		backbone: '/js/lib/backbone',
		handlebars: '/js/lib/handlebars-v3.0.3',
		jquery:'/js/lib/jquery-1.11.3',
		jqueryScrollTo:'/js/lib/jquery.scrollTo/jquery.scrollTo',
		moment:'/js/lib/moment',
		text: '/js/lib/require-text/text',
		css: '/js/lib/require-css/css'
	}

});

require(['AppView'], function(AppView){
	AppView.getInstance().render();
});