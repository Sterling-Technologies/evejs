module.exports = function() {
	var c = function(controller) {
		this.__construct.call(this, controller);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.schema = {};

	/* Private Properties
	-------------------------------*/
	var mongoose = require('mongoose');

	var _auth = {
		active  : { type : Boolean },
		token   : String
	};

	/* Loader
	-------------------------------*/
	public.__load = c.load = function(controller) {
		if(!this.__instance) {
			this.__instance = new c(controller);
		}
		
		return this.__instance;
	};
	
	/* Construct
	-------------------------------*/
	public.__construct = function(controller) {
		var schema = mongoose.Schema;
		var store  = controller.user().store();

		// Copy user schema
		this.schema = Object.create(store.schema);

		// Inject Oauth object
		this.schema.auth = _auth;

		// Define New User Schema
		this.definition = new schema(this.schema, { collection : 'users' });

		// Define Store model
		this.store = mongoose.model('auth', this.definition);
	};
	
	/* Public Methods
	-------------------------------*/
	public.count = function(query, callback) {
		return this.store.count(query, callback);
	};
	
	public.model = function(data) {
		return new (this.store)(data);
	};
	
	public.find = function(query, callback) {
		return this.store.find(query, callback);
	};
	
	public.findOne = function(query, fields, options, callback) {
		return this.store.findOne(query, fields, options, callback);
	};
	
	public.findById = function(id, fields, options, callback) {
		return this.store.findById(id, fields, options, callback);
	};
	
	public.remove = function(id, callback) {
		return this.update(id, { active: false }, callback);
	};
	
	public.restore = function(id, callback) {
		return this.store.findOneAndUpdate(
			{_id: id, active: false}, 
			{ $set: { active: true } }, callback);
	};
	
	public.update = function(id, data, callback) {
		return this.store.findOneAndUpdate(
			{_id: id, active: true}, 
			{ $set: data }, callback);
	};

	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c;  
}();