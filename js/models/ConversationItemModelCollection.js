define([
	'backbone',
	'models/ConversationItemModel'
	], 
	function(
		Backbone, 
		ConversationItemModel
	){

	// Everything here would happen on the server
	var fakeServer = {

		getVariableDelayTime: function(){
			var r = Math.floor((Math.random() * (this.fakeServerDelayTime*3)) + this.fakeServerDelayTime);
			return r;
		},

		fakeServerDelayTime : 800,

		fakeServerDecideWhichToShow: function(collection){
			var collection = collection.where({stub: false});
			if(collection.length == 0){
				return this.fakeDB[0];
			}else{

				var lastItem = collection[collection.length-1];
				var requiresResponseType = lastItem.get('requiresResponseType');

				// If its in response to a choice
				if(typeof lastItem.get('selectedChoice') === "number"){
					// get the original question
					var originalQuestionItem =  lastItem.get('responseTo');
					var nextId = originalQuestionItem.get('possibleResponses')[lastItem.get('selectedChoice')];

					if(typeof(nextId) != "undefined"){
						var nextItem = _.findWhere(this.fakeDB, {id: nextId});
						return nextItem;
					}else{
						console.error("Could not find "+selectedChoice+" inside possibleResponses arr for ", possibleResponses);
					}

				}
				else if(requiresResponseType == ConversationItemModel.responseType.BOTCONTINUE){
					var nextItem = _.findWhere(this.fakeDB, {id: lastItem.get('possibleResponses')[0]});
					return nextItem;
				}

			}
		},
		// A possible schema for a conversation
		fakeDB : [{
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
			message: "bummer :(",
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
			possibleResponses: [8,9],
			requiresResponseType: ConversationItemModel.responseType.CHOICE,
		},
		{
			id: 7,
			responseTo: 3,
			message: "Welp, guess I'll talk to you later then!",
			requiresResponseType: ConversationItemModel.responseType.NONE,
		},
		{
			id: 8,
			responseTo: 5,
			message: "<img src=\"http://pngimg.com/upload/cup_PNG2000.png\" />",
			requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [10]
		},
		{
			id: 10,
			responseTo: 8,
			message: ":D",
			requiresResponseType: ConversationItemModel.responseType.NONE,
		},
		{
			id: 9,
			responseTo: 5,
			message: "<img src=\"http://www.downeastcoffee.ca/sites/default/files/media/slides/coffee.png\" />",
			requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [10]
		}
		]
	};


	var ConversationItemModelCollection = Backbone.Collection.extend({

		addUserResponse: function(userResponse){
			if(typeof(userResponse.selectedChoice) != "undefined"){
				userResponse.id = userResponse.responseTo.get('id') + 1;
				userResponse.fromType = ConversationItemModel.fromType.USER;
				userResponse.message = userResponse.responseTo.get('choices')[userResponse.selectedChoice];
				userResponse.requiresResponseType = ConversationItemModel.responseType.BOTCONTINUE
			}

			this.add(userResponse);
		},

		create: function(userResponse){
			var that = this;

			return $.Deferred(function(dfd){
				setTimeout(function(){

					that.fetch();
					dfd.resolve();

				},fakeServer.fakeServerDelayTime)
			});
		},

		fetch: function(){
			// Return a default
			var that = this;

			this.stub = this.add({
				responseTo: this.models[this.length-1],
				message:"...", stub: true
			});
			
            return $.Deferred(function(dfd){
				setTimeout(function(){
					var response = fakeServer.fakeServerDecideWhichToShow(that);
					if(response){

						// Modify the elipsis stuf if it exists
						var stub = that.findWhere({stub:true});

						if(stub){
							var settings = _.extend(stub.attributes, response);
							settings.stub = false;
							stub.set(settings).trigger('change:stub');
							dfd.resolve(stub);
						}else{
							dfd.reject({error:"No stub found"});
							return;
						}

						// Prompt if user input is required, fetch again if bot, otherwise the discussion is over
						if(ConversationItemModel.requiresResponseFromUser(response.requiresResponseType)){
							that.trigger('prompt', stub);
						}else if(ConversationItemModel.requiresResponseFromBot(response.requiresResponseType)){
							that.fetch().fail(function(error){
								console.error(error);
							});
						}else{
							// end of discussion
						}

					}else{
						dfd.reject({error:"Nothing found in the db"});
					}

				}, fakeServer.getVariableDelayTime());
            }).promise();

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