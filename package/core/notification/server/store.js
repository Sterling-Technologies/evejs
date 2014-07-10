module.exports = function() {
	var c = function(controller) {
		this.__construct.call(this, controller);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.schema = null;

	/* Private Properties
	-------------------------------*/
	var mongoose 	= require('mongoose');

	var _notifications = {
		status : { type : String, default : 'unread' },
		queue  : [{
			sender 	: String,
			details : String,
			created : { type : Date, default : Date.now }
		}],
		list   : [{
			sender 	: String,
			details : String,
			created : { type : Date, default : Date.now } 
		}]
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
		this.schema = store.schema;

		// Inject notification
		this.schema.notifications = _notifications;

		// Define New User Schema
		this.definition = new schema(this.schema, { collection : 'users' });

		// Define Store model
		this.store = mongoose.model('notification', this.definition);
	};
	
	/* Public Methods
	-------------------------------*/
	/**
	 * Returns total record count
	 * based on query
	 *
	 * @param 	object
	 * @param 	function
	 * @return 	object
	 */
	public.count = function(query, callback) {
		return this.store.count(query, callback);
	};
	
	/**
	 * Returns raw mongoose mongoose
	 *
	 * @param 	object
	 * @return 	object
	 */
	public.model = function(data) {
		return new (this.store)(data);
	};
	
	/**
	 * Returns a record based on query
	 * specified
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
	 * on query specified
	 *
	 * @param 	object
	 * @param 	function
	 * @return 	object
	 */
	public.findOne = function(query, callback) {
		return this.store.findOne(query, callback);
	};
	
	/**
	 * Returns a record based on id 
	 * given
	 *
	 * @param 	string 	 ObjectId
	 * @param 	function
	 * @return 	object
	 */
	public.findById = function(id, callback) {
		return this.store.findById(id, callback);
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
	 * Removes single record based on
	 * id given
	 *
	 * @param 	string 		ObjectId
	 * @param 	function
	 * @return 	object
	 */
	public.remove = function(id, callback) {
		return this.update(id, { 'metadata.active': false }, callback);
	};
	
	/**
	 * Restores archive / inactive
	 * records back to active
	 *
	 * @param 	string 	 ObjectId
	 * @param 	function
	 * @return 	object
	 */
	public.restore = function(id, callback) {
		return this.store.findOneAndUpdate(
			{_id: id, 'metadata.active': false}, 
			{ $set: { 'metadata.active': true } }, callback);
	};
	
	/**
	 * Updates a record based on id
	 * and data given
	 *
	 * @param 	string 	ObjectId
	 * @param 	object
	 * @param 	function
	 * @return 	object
	 */
	public.update = function(id, data, callback) {
		return this.store.findOneAndUpdate(
			{ _id: id, 'active': true }, data, { upsert : false }, callback);
	};
	
	/* Private Methods
	-------------------------------*/
	var _buildQuery = function(query, keyword) {
		query 	= query 	|| {};
		keyword = keyword 	|| null;
		
		if(query['metadata.active'] != -1) {
			query['metadata.active'] = query['metadata.active'] != 0;
		}
		
		var not, or = [];
		
		//keyword search
		if(keyword) {
			or.push([
				{ filename : new RegExp(keyword, 'ig') } ]);
		}
		
		
		for(var key in query) {
			//if prefixed with !, just test if it does not exist
			//SECRET SAUCE:
			//{ active: true, $or: [ {password: { $exists: false }}, {password: { $type: 10 }}, {password: ""} ] }
			if(key.indexOf('!') === 0) {
				not = [ {}, {}, {} ];
				not[0][key.substr(1)] = { $exists: false };
				not[1][key.substr(1)] = { $type: 10 };
				not[2][key.substr(1)] = '';
				
				or.push(not);
				continue;
			}
			
			if(query[key] !== null) {
				continue;
			}
			
			//if null value, just test if it exists
			
			query[key] = { $exists: true };
		}
		
		if(or.length == 1) {
			query['$or'] = or[0];
		} else if(or.length) {
			query['$and'] = [];
			for(var i = 0; i < or.length; i++) {
				query['$and'].push({ '$or': or[i] });
			}
		}
		
		return query;
	};

	/* Adaptor
	-------------------------------*/
	return c;  
}();