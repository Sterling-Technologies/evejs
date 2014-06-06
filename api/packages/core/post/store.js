module.exports = function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	/* Private Properties
	-------------------------------*/
	var mongoose 	= require('mongoose');
	
	var _schema = {
		title: String,
		detail: String,
		user: {
			name	: String,
			email	: String,
			photo	: {
				name		: String,
				source		: String,
				mime		: String,
				size		: String,
				date		: { type: Date, default: Date.now }
			},
			
			facebook	: String,
			twitter		: String,
			google		: String,
			linkedin	: String
		},
		
		comments: [{
			title: String,
			detail: String,
			user: {
				name	: String,
				email	: String,
				photo	: {
					name		: String,
					source		: String,
					mime		: String,
					size		: String,
					date		: { type: Date, default: Date.now }
				},
				
				facebook	: String,
				twitter		: String,
				google		: String,
				linkedin	: String
			},
			
			active: { type: Boolean, default: true },
			created: { type: Date, default: Date.now },
			updated: { type: Date, default: Date.now }
		}],
		
		active: { type: Boolean, default: true },
		created: { type: Date, default: Date.now },
		updated: { type: Date, default: Date.now }
	};
	
	var _sample = {
		title: 'Hello World!!',
		detail: 'Beginner program, simplest program created',
		user: {
			name	: 'Dennis Richie',
			email	: 'dennisrichie@yahoo.com',
			photo	: {
				name		: String,
				source		: String,
				mime		: String,
				size		: String,
				date		: { type: Date, default: Date.now }
			},
			
			facebook	: 'facebook_url',
			twitter		: 'twitter_url',
			google		: 'google_url',
			linkedin	: 'linkedin'
		},
		
		comments: [{
			title: String,
			detail: String,
			user: {
				name	: String,
				email	: String,
				photo	: {
					name		: String,
					source		: String,
					mime		: String,
					size		: String,
					date		: { type: Date, default: Date.now }
				},
				
				facebook	: String,
				twitter		: String,
				google		: String,
				linkedin	: String
			},
		}],
	};
	
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
		this.schema = new schema(_schema);
		//NOTE: add custom schema methods here
		
		this.store = mongoose.model('post', this.schema);
	};
	
	/* Public Methods
	-------------------------------*/
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