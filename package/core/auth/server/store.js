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
		// Mongoose Schema Object
		var schema = mongoose.Schema;
		// Reference to User Package store
		var store  = controller.user().store();

		// Copy user schema
		this.schema = Object.create(store.schema);

		// Inject auth object
		this.schema.auth = _auth;

		// Define New User Schema
		this.definition = new schema(this.schema, { collection : 'users' });

		// Define Store model
		this.store = mongoose.model('auth', this.definition);
	};
	
	/* Public Methods
	-------------------------------*/
	/**
	 * Returns record count
	 * based on the given
	 * query
	 *
	 * @param 	object
	 * @param 	function
	 * @return 	object
	 */
	public.count = function(query, callback) {
		return this.store.count(query, callback);
	};
	
	/**
	 * Returns raw mongoose model
	 *
	 * @param 	object
	 * @return 	object
	 */
	public.model = function(data) {
		return new (this.store)(data);
	};
	
	/**
	 * Returns records based on
	 * the given query
	 *
	 * @param 	object
	 * @param 	function
	 * @return 	object
	 */
	public.find = function(query, callback) {
		return this.store.find(query, callback);
	};
	
	/**
	 * Returns single record based
	 * on the given query
	 *
	 * @param 	object
	 * @param 	string
	 * @param 	object
	 * @param 	function
	 * @return 	object
	 */
	public.findOne = function(query, fields, options, callback) {
		return this.store.findOne(query, fields, options, callback);
	};

	/**
	 * Returns the details based on the id
	 *
	 * @param ID
	 * @param function
	 * @param bool
	 * @return this
	 */
	public.getDetail = function(id, callback, lean) {
		var query = this.findOne({ _id: id, active: true });
		
		if(lean) {
			query = query.lean();
		}
		
		query.exec(callback);
			
		return this;
	};
	
	/**
	 * Returns a list based on the given parameters
	 *
	 * @param object
	 * @param string
	 * @param object
	 * @param number
	 * @param number
	 * @param function
	 * @return this
	 */
	public.getList = function(query, keyword, order, start, range, callback) {
		query 		= query 	|| {};
		range 		= range 	|| 50;
		start 		= start 	|| 0;
		order 		= order 	|| {};
		keyword		= keyword 	|| null;
		callback	= callback 	|| function() {};
		
		switch(true) {
			case typeof arguments[0] == 'function': //query
				callback 	= arguments[0];
				query = {};
				break;
			case typeof arguments[1] == 'function': //keyword
				callback = arguments[1];
				keyword	= null;
				break;
			case typeof arguments[2] == 'function': //order
				callback = arguments[2];
				order = {};
				break;
			case typeof arguments[3] == 'function': //start
				callback = arguments[3];
				start = 0;
				break;
			case typeof arguments[4] == 'function': //range
				callback = arguments[4];
				range = 50;
				break;
		}
		
		query = _buildQuery(query, keyword);
		
		//now we are ready to call the query
		var store = this.find(query)
			.skip(start)
			.limit(range);
		
		for(key in order) {
			store.sort(key, order[key] != -1 ? 1: -1);
		}
		
		//query for results
		store.lean().exec(callback);
		
		return this;
	};
	
	/**
	 * Returns a total count based on the given parameters
	 *
	 * @param object
	 * @param string
	 * @param function
	 * @return this
	 */
	public.getTotal = function(query, keyword, callback) {
		query 		= query 	|| {};
		keyword		= keyword 	|| null;
		callback	= callback 	|| function() {};
		
		switch(true) {
			case typeof arguments[0] == 'function': //query
				callback 	= arguments[0];
				query = {};
				break;
			case typeof arguments[1] == 'function': //keyword
				callback = arguments[1];
				keyword	= null;
				break;
		}
		
		query = _buildQuery(query, keyword);
		
		return this.count(query, callback);
	};
	
	/**
	 * Returns single record based
	 * on the given id
	 *
	 * @param 	string 		ObjectID
	 * @param  	object
	 * @param 	object
	 * @param 	function
	 * @return 	object
	 */
	public.findById = function(id, fields, options, callback) {
		return this.store.findById(id, fields, options, callback);
	};
	
	/**
	 * Removes a record based on 
	 * ObjectID given
	 *
	 * @param 	string 		ObjectID
	 * @param 	function
	 * @return 	object
	 */
	public.remove = function(id, callback) {
		return this.update(id, { active: false }, callback);
	};
	
	/**
	 * Returns inactive records
	 * and updates its status
	 * to active
	 * 
	 * @param 	string 		ObjectID
	 * @param 	function
	 * @return 	object
	 */
	public.restore = function(id, callback) {
		return this.store.findOneAndUpdate(
			{_id: id, active: false}, 
			{ $set: { active: true } }, callback);
	};
	
	/**
	 * Updates single record based
	 * on the given id and data
	 *
	 * @param 	string 	ObjectID
	 * @param 	object
	 * @param 	function
	 * @return 	object
	 */
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