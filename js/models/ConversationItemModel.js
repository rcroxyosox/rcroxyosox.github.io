define(['backbone'], function(Backbone){

	var fromType = {
		BOT: 0,
		USER: 1
	};

	var responseType = {
		CHOICE:0,
		INPUT:1,
		BOT: 2, // the bot will say something else
		NONE: 3 // the conversation is over for now
	};

	return Backbone.Model.extend({
		defaults: {
			id: null, // a unique id
			message: "", // A String of text
			fromType: null, // see the fromType enum above 
			responseTo: null, // an id mapping to another conversation item
			requiresResponseType: null // see the responseType enum above 
		}
	},{
		fromType: fromType,
		responseType: responseType
	});

});