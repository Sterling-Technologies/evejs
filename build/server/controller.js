module.exports = (function() {
	var Definition = function() {}, prototype = Definition.prototype;
	
	prototype.eden 	= require('edenjs')();
	
	/* Properties
	-------------------------------*/
	var _paths 		= {};
	var _databases 	= {};
	var _events 	= new (require('events').EventEmitter)();
	
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
	/* Public Methods
	-------------------------------*/
	/**
	 * Get's a configuration
	 *
	 * @param string
	 * @return this
	 */
	prototype.config = function(key) {
		return require(_paths.config + '/' + key);
	};
	
	/**
	 * Global event listener for the server
	 *
	 * @return this
	 */
	prototype.listen = function(event, callback) {
		_events.on(event, callback);
		return this;
	};
	
	/**
	 * Global event once listener for the server
	 *
	 * @return this
	 */
	prototype.once = function(event, callback) {
		_events.once(event, callback);
		return this;
	};
	
	/**
	 * Returns the path given the key
	 *
	 * @param string
	 * @return this
	 */
	prototype.path = function(key, value) {
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
	prototype.setDatabases = function() {
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
	prototype.startPackages = function() {
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
	prototype.setPaths = function() {
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
	prototype.startServer = function() {
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
				
				//the client is just pinging what's possible
				if(request.method.toLowerCase() == 'options') {
					//send a default response
					response.headers.Allow = 'HEAD,GET,POST,PUT,DELETE,OPTIONS'; 
					response.state = 200;
					
					self.server.trigger('response', request, response);
					
					return;
				}
				
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
	 * Process to start socket.io
	 *
	 * @return 	this
	 */
	prototype.startSocket = function() {
		// Initialize socket io connection
		this.socket = this.eden.load('socket')
			// on client connection
			.listen('request', function(socket) {
				// trigger socket client event
				this.trigger('socket-request', this, socket);
			}.bind(this))
			// start socket io server
			.connect(this.server.server, {});

		return this;
	};

	/**
	 * Global event trigger for the server
	 *
	 * @return this
	 */
	prototype.trigger = function() {
		_events.emit.apply(_events, arguments);
		return this;
	};
	
	/**
	 * Stops listening to a specific event
	 *
	 * @return this
	 */
	prototype.unlisten = function() {
		_events.removeAllListeners.apply(_events, arguments);
		return this;	
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return Definition.load(); 
})();
