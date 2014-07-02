module.exports = function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.schema = {
		name		: { type: String, required: true },
		slug		: { type: String, required: true },
		email		: { type: String, required: true },
        password    : String,
        birthdate   : Date,
        gender      : { type: String, enum: ['male', 'female', null, ''] },
		website     : String,
        phone		: String,
		address		: [{
			label		    : String,
			contact		    : String, 
			street		    : String, 
			neighborhood    : String, 
			city		    : String, 
			state		    : String, 
			region		    : String, 
			country		    : String, 
			postal		    : String, 
			phone		    : String
		}],

        company     : {
            name    : String,
            title   : String,
            street  : String,
            city    : String,
            state   : String,
            country : String,
            postal  : String,
            phone   : String,
            email   : String
        },
		
		photo		: [{
			name		: String,
			source		: String,
			mime		: String,
			date		: { type: Date, default: Date.now }
		}],
		
		facebook	: String,
		twitter		: String,
		google		: String,
		linkedin	: String,
		
		active: { type: Boolean, default: true },
		created: { type: Date, default: Date.now },
		updated: { type: Date, default: Date.now }
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
		
		this.store = mongoose.model('User', this.definition);
	};
	
	/* Public Methods
	-------------------------------*/
	/**
	 * Returns count based on the query
	 *
	 * @param object
	 * @param function
	 * @return this
	 */
	public.count = function(query, callback) {
		this.store.count(query, callback);
		return this;
	};
	
	/**
	 * Inserts an object to the collection
	 *
	 * @param object
	 * @param function
	 * @return this
	 */
	public.insert = function(data, callback) {
		this.model(data).save(callback);
		return this;
	};
	
	/**
	 * Returns the raw mongoose find protocol
	 *
	 * @param object
	 * @return Mongoose
	 */
	public.find = function(query) {
		return this.store.find(query);
	};
	
	/**
	 * Returns the raw mongoose findById protocol
	 *
	 * @param ID
	 * @return Mongoose
	 */
	public.findById = function(id) {
		return this.store.findById(id);
	};
	
	/**
	 * Returns the raw mongoose findOne protocol
	 *
	 * @param object
	 * @return Mongoose
	 */
	public.findOne = function(query) {
		return this.store.findOne(query);
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
	 * Returns the raw mongoose model
	 *
	 * @param object
	 * @return Mongoose
	 */
	public.model = function(data) {
		return new (this.store)(data);
	};
	
	/**
	 * removes an object based on the id
	 * this does not actually remove the object
	 * but simply sets the active to false
	 *
	 * @param ID
	 * @param function
	 * @return this
	 */
	public.remove = function(id, callback) {
		this.store.findOneAndUpdate(
			{_id: id, active: true }, 
			{ $set: { active: false } }, callback);
		
		return this;
	};
	
	/**
	 * restores the object
	 *
	 * @param ID
	 * @param function
	 * @return this
	 */
	public.restore = function(id, callback) {
		this.store.findOneAndUpdate(
			{_id: id, active: false }, 
			{ $set: { active: true } }, callback);
		
		return this;
	};
	
	/**
	 * Updates the object
	 *
	 * @param ID
	 * @param object
	 * @param function
	 * @return this
	 */
	public.update = function(id, data, callback) {
		return this.store.findOneAndUpdate(
			{_id: id, active: true}, 
			{ $set: data }, callback);
	};
	
	/* Private Methods
	-------------------------------*/
	var _buildQuery = function(query, keyword) {
		query 	= query 	|| {};
		keyword = keyword 	|| null;
		
		if(query.active != -1) {
			query.active = query.active != 0;
		}
		
		var not, or = [];
		
		//keyword search
		if(keyword) {
			or.push([
				{ name	: new RegExp(keyword, 'ig') },
				{ username: new RegExp(keyword, 'ig') },
				{ email	: new RegExp(keyword, 'ig') } ]);
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