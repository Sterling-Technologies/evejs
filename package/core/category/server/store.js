module.exports = function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.schema = {
		name	: { type: String, required: true },
		slug	: { type: String, required: true },
		detail	: { type: String, required: true },
		
		active		: { type: Boolean, default: true },
		created		: { type: Date, default: Date.now },
		updated		: { type: Date, default: Date.now }
	};
	
	/* Private Properties
	-------------------------------*/
	var mongoose 	= require('mongoose');
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		if(!this.__instance) {
			this.__instance = new c();
		}
		
		return this.__instance;
	};
	
	/* Construct
	-------------------------------*/
	public.__construct = function() {
		var schema = mongoose.Schema;
		
		//define schema
		this.definition = new schema(this.schema);
		//NOTE: add custom schema methods here
		
		this.store = mongoose.model('categories', this.definition);
	};
	
	/* Public Methods
	-------------------------------*/
	public.count = function(query, callback) {
		return this.store.count(query, callback);
	};
	
	public.model = function(data) {
		return new (this.store)(data);
	};
	
	public.find = function(query) {
		return this.store.find(query);
	};
	
	public.findOne = function(query) {
		return this.store.findOne(query);
	};
	
	public.findById = function(id) {
		return this.store.findById(id);
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