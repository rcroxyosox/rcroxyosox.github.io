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
			}

			var lastItem = collection[collection.length-1];
			var requiresResponseType = lastItem.get('requiresResponseType');
			var responseType = lastItem.get('responseType');

			// If the last item was a selection of a CHOICE
			if(responseType == ConversationItemModel.responseType.CHOICE){
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

			// If the last item was a DATE or UNIT value given 
			else if(responseType == ConversationItemModel.responseType.DATE 
				|| responseType == ConversationItemModel.responseType.UNIT){

				// get the original question
				var originalQuestionItem =  lastItem.get('responseTo');
				var nextId = originalQuestionItem.get('possibleResponses')[0];

				if(typeof(nextId) != "undefined"){
					var nextItem = _.findWhere(this.fakeDB, {id: nextId});
					return nextItem;
				}else{
					console.error("Could not find possibleResponses arr for ", possibleResponses);
				}
			}

			// If the last item was an INPUT value given
			else if(responseType == ConversationItemModel.responseType.INPUT){

				// Bunch of server side magic...
				var nextItem = _.findWhere(this.fakeDB, {id: 3});
				return nextItem;
			}

			else if(requiresResponseType == ConversationItemModel.responseType.BOTCONTINUE ){
				var nextItem = _.findWhere(this.fakeDB, {id: lastItem.get('possibleResponses')[0]});
				return nextItem;
			}

		},
		// A possible schema for a conversation
		fakeDB : [
		{
			id: 1,
			responseTo: 21,
			message: "When is your childs birthday?",
			requiresResponseType: ConversationItemModel.responseType.DATE,
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [2]
		},
		{
			id: 2,
			responseTo: 21,
			message: "Got it. And what does your baby weigh?",
			requiresResponseType: ConversationItemModel.responseType.UNIT,
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			units: [{text:"Pounds", value:"lbs"}, {text:"Kilograms", value:"kg"}],
			possibleResponses: [21]
		},
		{
			id: 21,
			responseTo: 21,
			message: "Got it. How are you doing?",
			requiresResponseType: ConversationItemModel.responseType.CHOICE,
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			choices: ["<img src=\"/img/icon-smiley-sad.svg\" width=\"40\" />", "<img src=\"/img/icon-smiley-happy.svg\" height=\"40\" />"],
			possibleResponses: [3,4]
		},
		{
			id: 20,
			responseTo: 0,
			message: "By the way, looks like you've been getting in more Skin to Skin time. That's great",
			requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [22]
		},
		{
			id: 3,
			responseTo: 2,
			message: "bummer :(",
			requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [5]
		},
		{
			id: 4,
			responseTo: 2,
			message: "Great!",
			requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [7]
		},
		{
			id: 5,
			responseTo: 3,
			message: "Can I make you a cup of tea?",
			choices: ["Sure that should help", "How about a coffee instead"],
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [8,9],
			requiresResponseType: ConversationItemModel.responseType.CHOICE,
		},
		{
			id: 7,
			responseTo: 3,
			message: "Welp, guess I'll talk to you later then!",
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			requiresResponseType: ConversationItemModel.responseType.NONE,
		},
		{
			id: 8,
			responseTo: 5,
			message: "<img src=\"http://pngimg.com/upload/cup_PNG2000.png\" />",
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [10]
		},
		{
			id: 10,
			responseTo: 8,
			message: ":D",
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [20]
		},
		{
			id: 9,
			responseTo: 5,
			message: "<img src=\"http://www.downeastcoffee.ca/sites/default/files/media/slides/coffee.png\" />",
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			requiresResponseType: ConversationItemModel.responseType.BOTCONTINUE,
			possibleResponses: [10]
		},
		{
			id: 22,
			responseTo: 20,
			message: "{{carditem:skintoskin}}",
			responseType: ConversationItemModel.responseType.BOTCONTINUE,
			requiresResponseType: ConversationItemModel.responseType.NONE
		}
		]
	};


	var ConversationItemModelCollection = Backbone.Collection.extend({

		addUserResponse: function(userResponse){
			var reqResponseType = userResponse.responseTo.get('requiresResponseType');
			userResponse.id = userResponse.responseTo.get('id') + 1;
			userResponse.fromType = ConversationItemModel.fromType.USER;
			userResponse.requiresResponseType = ConversationItemModel.responseType.BOTCONTINUE;

			if(reqResponseType == ConversationItemModel.responseType.CHOICE){
				userResponse.message = userResponse.responseTo.get('choices')[userResponse.selectedChoice];
			}

			else if(reqResponseType == ConversationItemModel.responseType.INPUT
				|| reqResponseType == ConversationItemModel.responseType.DATE
				|| reqResponseType == ConversationItemModel.responseType.UNIT
				){
				userResponse.message = userResponse.responseText;
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