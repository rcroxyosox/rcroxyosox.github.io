define([
	'backbone',
	'models/ConversationItemModel'
	], 
	function(
		Backbone, 
		ConversationItemModel
	){

	var ConversationItemModelCollection = Backbone.Collection.extend({
		model: ConversationItemModel
	},{
		getInstance: function(){
			return instance;
		}
	});

	var instance = new ConversationItemModelCollection();
	return ConversationItemModelCollection;

});