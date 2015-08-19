define(['backbone'], function(Backbone){

	var fromType = {
		BOT: 0,
		USER: 1
	};

	var responseType = {
		CHOICE:0, // The user is selecting a choice
		INPUT:1, // The user should give text input
		DATE: 2, // The user should give a date
		UNIT: 3, // The user should give a value and a unit
		BOTCONTINUE: 20, // the bot will say something else
		NONE: 21 // the conversation is over for now
	};

	return Backbone.Model.extend({
		defaults: {
			id: null, // a unique id
			stub: false, // a stub waiting for a message
			message: "", // A String of text
			fromType: fromType.BOT, // see the fromType enum above 
			responseTo: null, // an model of another conversation item
			responseType: null, // see the responseType enum above
			requiresResponseType: null, // see the responseType enum above 
			choices: [], // a list of response choices if any
			units: [], // a list of unit options for the user to choose from
			selectedChoice: null, // a selected choice if any
			possibleResponses: [] // a list of keys to possible responses to user input
		},
		isFromBot: function(){ // Convenience method
			return (this.get('fromType') == fromType.BOT);
		}
	},{
		fromType: fromType,
		responseType: responseType,
		requiresResponseFromUser: function(responseTypeFromSource){
			return (responseTypeFromSource == responseType.CHOICE 
				|| responseTypeFromSource == responseType.INPUT
				|| responseTypeFromSource == responseType.DATE
				|| responseTypeFromSource == responseType.UNIT);
		},
		requiresResponseFromBot: function(responseTypeFromSource){
			return (responseTypeFromSource == responseType.BOTCONTINUE);
		}
	});

});