module.exports = function() {
	var c = function() {}, public = c.prototype;
	
	public.eden 	= require('edenjs')();
	
	/* Properties
	-------------------------------*/
	var _paths 		= {};
	var _databases 	= {};
	var _events 	= new (require('events').EventEmitter);
	
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
	/* Public Methods
	-------------------------------*/
	/**
	 * Get's a configuration
	 *
	 * @param string
	 * @return this
	 */
	public.config = function(key) {
		return require(_paths.config + '/' + key);
	};
	
	/**
	 * Global event listener for the server
	 *
	 * @return this
	 */
	public.listen = function(event, callback) {
		_events.on(event, callback);
		return this;
	};
	
	/**
	 * Global event once listener for the server
	 *
	 * @return this
	 */
	public.once = function(event, callback) {
		_events.once(event, callback);
		return this;
	};
	
	/**
	 * Returns the path given the key
	 *
	 * @param string
	 * @return this
	 */
	public.path = function(key, value) {
		if(value) {
			_paths[key] = value;
			return this;
		}
		
		return _paths[key];
	};
	
	/**
	 * Save any database info in memory
	 *
	 * @return this
	 */
	public.setDatabases = function() {
		var databases = this.config('databases'),
			database, authentication;
		
		for(var key in databases) {
			database = databases[key];
			
			switch(database.type) {
				case 'mongo':
					authentication = '';
					if(database.user && database.pass) {
						authentication = database.user+':'+database.pass+'@';
					} else if(database.user) {
						authentication = database.user+'@';
					}
					
					_databases[key] = require('mongoose')
					.connect('mongodb://' 
						+ authentication 
						+ database.host 
						+ ':' + database.port 
						+ '/' + database.name);
						
					break;
			}
		}
		
		return this;
	};
	
	/**
	 * Starts up any packages
	 *
	 * @return this
	 */
	public.startPackages = function() {
		var packages = this.config('packages');
		
		for(var i = 0; i < packages.length; i++) {
			require(_paths.package + '/' + packages[i] + '/index.js').call(this);
		}
		
		return this;
	};
	
	/**
	 * Set paths
	 *
	 * @return this
	 */
	public.setPaths = function() {
		this.path('root'	, __dirname)
			.path('config'	, __dirname + '/config')
			.path('package'	, __dirname + '/package');
		
		return this;
	};
	
	/**
	 * Process to start server
	 *
	 * @return this
	 */
	public.startServer = function() {
		var self = this, settings = this.config('settings').server;
		
		this.server = this.eden.load('server')
			.setHost(settings.host)
			.setPort(settings.port)
			//when a request from the client has been made
			.listen('request', function(request, response) { 
				//ALLOW CORS
				response.headers['Access-Control-Allow-Origin'] = '*';
				
				response.headers['Access-Control-Allow-Headers'] = 
					'origin, x-requested-with, content-type';
				
				response.headers['Access-Control-Allow-Methods'] = 
					'PUT, GET, POST, DELETE, OPTIONS';
				
				self.trigger('server-request', self, request, response);
			})
			
			//when a response has been given out
			.listen('output', function(request, response) { 
				self.trigger('server-response', self, request, response);
			})
			
			//when there's nothing found
			.listen('response-404', function(request, response, error) {
				self.trigger('server-response-404', self, request, response, error);
			})
			//begin to connect
			.connect();
			
		return this;
	};
	
	/**
	 * Global event trigger for the server
	 *
	 * @return this
	 */
	public.trigger = function() {
		_events.emit.apply(_events, arguments);
		return this;
	};
	
	/**
	 * Stops listening to a specific event
	 *
	 * @return this
	 */
	public.unlisten = function() {
		_events.removeAllListeners.apply(_events, arguments);
		return this;	
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load(); 
}();