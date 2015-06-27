define([
	'backbone',
	'models/ConversationItemModel'
	], 
	function(
		Backbone, 
		ConversationItemModel
	){

	// A possible schema for a conversation
	var fakeDB = [{
		id: 1,
		responseTo: 0,
		message: "how are you doing today?",
		requiresResponseType: ConversationItemModel.responseType.CHOICE,
		choices: ["Meh", "Great!"],
		possibleResponses: [3,4]
	},
	{
		id: 3,
		responseTo: 2,
		message: "Sorry to hear that :(",
		requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
		possibleResponses: [5]
	},
	{
		id: 4,
		responseTo: 2,
		message: "Great!",
		requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
		possibleResponses: [7]
	},
	{
		id: 5,
		responseTo: 3,
		message: "Can I make you a cup of tea?",
		choices: ["Sure that should help", "How about a coffee instead"],
		requiresResponseType: ConversationItemModel.responseType.NONE,
	},
	{
		id: 7,
		responseTo: 3,
		message: "Welp, guess I'll talk to you later then!",
		requiresResponseType: ConversationItemModel.responseType.NONE,
	}
	];

	var ConversationItemModelCollection = Backbone.Collection.extend({
		parse: function(fakeDBItem){
			delete fakeDBItem.requiresResponseType;
			delete fakeDBItem.possibleResponses;
			return fakeDBItem;
		},
		fetch: function(){
			// Return a default
			var response = this.parse(fakeDB[0]);
			this.reset([response]);
			var that = this;
			setTimeout(function(){
				that.add(that.parse(fakeDB[1]));
			}, 2000);
		},
		model: ConversationItemModel,
	},{
		getInstance: function(){
			return instance;
		}
	});

	var instance = new ConversationItemModelCollection();
	return ConversationItemModelCollection;

});