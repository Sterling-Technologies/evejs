module.exports = (function() {
	var Definition = function() {
		this.__construct.call(this);
	}, prototype = Definition.prototype;
	
	/* Public Properties
	-------------------------------*/
	//NOTE: BULK GENERATE
	prototype.schema = {{{schema}}};
	
	/* Private Properties
	-------------------------------*/
	var mongoose 	= require('mongoose');
	
	/* Loader
	-------------------------------*/
	prototype.__load = Definition.load = function() {
		if(!this.__instance) {
			this.__instance = new Definition();
		}
		
		return this.__instance;
	};
	
	/* Construct
	-------------------------------*/
	prototype.__construct = function() {
		var schema = mongoose.Schema;
		
		//define schema
		this.definition = new schema(this.schema);
		//NOTE: add custom schema methods here
		
		this.store = mongoose.model('{{singular}}', this.definition);
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
	prototype.count = function(query, callback) {
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
	prototype.insert = function(data, callback) {
		{{#if use_slug~}}
		//case for slug
		_getNextSlug.call(this, data.title, function(slug) {
			data.slug = slug;
			this.model(data).save(callback);
		}.bind(this));
		{{~else~}}
		this.model(data).save(callback);
		{{~/if}}
		return this;
	};
	
	/**
	 * Returns the raw mongoose find protocol
	 *
	 * @param object
	 * @return Mongoose
	 */
	prototype.find = function(query) {
		return this.store.find(query);
	};
	
	/**
	 * Returns the raw mongoose findById protocol
	 *
	 * @param ID
	 * @return Mongoose
	 */
	prototype.findById = function(id) {
		return this.store.findById(id);
	};
	
	/**
	 * Returns the raw mongoose findOne protocol
	 *
	 * @param object
	 * @return Mongoose
	 */
	prototype.findOne = function(query) {
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
	prototype.getDetail = function(id, callback, lean) {
		{{#if use_active~}}
		var query = this.findOne({ _id: id, active: true });
		{{~else~}}
		var query = this.findOne({ _id: id });
		{{/if~}}
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
	prototype.getList = function(query, keyword, order, start, range, callback) {
		query 		= query 	|| {};
		range 		= range 	|| 50;
		start 		= start 	|| 0;
		order 		= order 	|| {};
		keyword		= keyword 	|| null;
		callback	= callback 	|| function() {};
		
		switch(true) {
			case typeof arguments[0] === 'function': //query
				callback 	= arguments[0];
				query = {};
				break;
			case typeof arguments[1] === 'function': //keyword
				callback = arguments[1];
				keyword	= null;
				break;
			case typeof arguments[2] === 'function': //order
				callback = arguments[2];
				order = {};
				break;
			case typeof arguments[3] === 'function': //start
				callback = arguments[3];
				start = 0;
				break;
			case typeof arguments[4] === 'function': //range
				callback = arguments[4];
				range = 50;
				break;
		}
		
		query = _buildQuery(query, keyword);
		
		//now we are ready to call the query
		var store = this.find(query)
			.skip(start)
			.limit(range);
		
		for(var key in order) {
			store.sort(key, order[key] !== -1 ? 1: -1);
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
	prototype.getTotal = function(query, keyword, callback) {
		query 		= query 	|| {};
		keyword		= keyword 	|| null;
		callback	= callback 	|| function() {};
		
		switch(true) {
			case typeof arguments[0] === 'function': //query
				callback 	= arguments[0];
				query = {};
				break;
			case typeof arguments[1] === 'function': //keyword
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
	prototype.model = function(data) {
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
	prototype.remove = function(id, callback) {
		{{#if use_active ~}}
		this.store.findOneAndUpdate(
			{_id: id, active: true },
			{ $set: { active: false } }, callback);
		{{else~}}
		this.store.findOneAndRemove({ _id: id }, callback);
		{{/if~}}
		
		return this;
	};
	
	/**
	 * restores the object
	 *
	 * @param ID
	 * @param function
	 * @return this
	 */
	prototype.restore = function(id, callback) {
		this.store.findOneAndUpdate(
			{{#if use_active ~}}
			{ _id: id, active: false }, 
			{{~else~}}
			{ _id: id }, 
			{{~/if}}
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
	prototype.update = function(id, data, callback) {
		{{#if use_slug}}
		//case for slug
		_getNextSlug.call(this, data.title, function(slug) {
			data.slug = slug;
			{{#if use_updated}}data.updated = new Date();{{/if}}
			{{#if use_revision}}_findAndRevision.call(this, 
			{{~else~}}this.store.findOneAndUpdate({{/if}}
				{{#if use_active}}{ _id: id, active: true },
				{{~else~}}{ _id: id },{{/if}}
				{ $set: data }, callback);
		}.bind(this), id);
		{{else}}
		{{#if use_updated}}data.updated = new Date();{{/if}}
		{{#if use_revision}}_findAndRevision.call(this, 
		{{~else~}}this.store.findOneAndUpdate({{/if}}
			{{#if use_active}}{ _id: id, active: true },
			{{~else~}}{ _id: id },{{/if}}
			{ $set: data }, callback);
		{{/if}}
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _getNextSlug = function(slug, callback, id) {
		//turn it into a slug
		slug = slug.toString().toLowerCase()
		  .replace(/\\s+/g, '-')        // Replace spaces with -
		  .replace(/[^\\w\\-]+/g, '')   // Remove all non-word chars
		  .replace(/\\-\\-+/g, '-')      // Replace multiple - with single -
		  .replace(/^-+/, '')          // Trim - from start of text
		  .replace(/-+$$/, '');         // Trim - from end of text
		//get all slugs that start with argument
		//'^something\\-cool(\\-[0-9]+){0,1}$$'
		var regex = new RegExp('^' + slug.replace(/\\-/g, '\\\\-') + '(\\\\-[0-9]+){0,1}$$', 'g');
		this.find({ slug: regex }).lean().exec(function(error, list) {
			list = list || [];
			
			for(var number, count = -1, i = 0; i < list.length; i++) {
				//if the id is given and found
				//if the slug prefix is the same
				//as the prescribed one
				if(list[i]._id.toString() === id 
				&& list[i].slug.indexOf(slug) === 0) {
					//call the callback
					callback(list[i].slug);
					//that's it
					return;	
				}
				
				//FROM: somthing-cool-2 TO: -2
				//FROM: something-cool TO ''
				number = list[i].slug.substr(slug.length);
				//there should be a hyphen at the start now
				if(number.indexOf('-') !== 0) {
					//it's 0 anyways
					number = '-0';
				}
				
				// now remove the hyphen so we can 
				// make it into an integer
				number = parseInt(number.substr(1));
				
				//all that just for this...
				if(number > count) {
					count = number;
				}
			}
			
			if(count >= 0) {
				callback(slug + '-' + (count + 1));
				return;
			}
			
			callback(slug);
		});
	};
	
	var _findAndRevision = function(where, set, callback) {
		this.getDetail(where._id, function(error, row) {
			set['$push'] = { revision: row };
			this.store.findOneAndUpdate(where, set, callback);
		}.bind(this), true);
	};
	
	var _buildQuery = function(query, keyword) {
		query 	= query 	|| {};
		keyword = keyword 	|| null;
		
		{{#if use_active ~}}
		if(query.active !== -1 && query.active !== '-1') {
			query.active = query.active !== 0 && query.active !== '0';
		}
		{{~/if}}
		
		var not, or = [];
		
		//TODO: ADD KEYWORD SEARCH
		//keyword search
		if(keyword) {
			//NOTE: BULK GENERATE
			{{{searchable}}}
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
		
		if(or.length === 1) {
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
	return Definition;  
})();