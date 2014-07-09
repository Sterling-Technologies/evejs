module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		// Default host to listen to
		public.host 	= '127.0.0.1';
		// Default port to use
		public.port 	= 1337;
		// Default http server
		public.server 	= null;
		// Default io handler
		public.io   	= null;
		// Default socket options
		public.options  = { serveClient : false };

		/* Private Properties
		-------------------------------*/
		var _http 	= require('http');
		var _io 	= require('socket.io')();
		var _events = new(require('events').EventEmitter);

		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
		};

		/* Construct
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		/**
		 * Connects socket io to the
		 * given server object or port
		 * number. First parameter can accept
		 * either http.server object or port
		 * number. And Second parameter will
		 * be the option for socket io
		 *
		 * @param 	object|number
		 * @param 	object
		 * @return 	object
		 */
		public.connect = function(http, options) {
			// process socket io server
			this.io = _process.call(this, http, options);

			// make events listeners infinite
			_events.setMaxListeners(0);
			
			return this;
		};

		/**
		 * Sets socket.io options
		 *
		 * @param 	object
		 * @return 	this
		 */
		public.setOptions = function(options) {
			this.options = options;
			return this;
		};

		/**
		 * Sets the HTTP Server Host
		 *
		 * @param 	string
		 * @return 	this
		 */
		public.setHost = function(host) {
			this.host = host;
			return this;
		};

		/**
		 * Sets the HTTP Server Port
		 *
		 * @param 	number
		 * @return 	this
		 */
		public.setPort = function(port) {
			this.port = port;
			return this;
		};

		/**
		 * Global event listener for socket
		 *
		 * @param 	string
		 * @param 	function
		 * @return 	this
		 */
		public.listen = function(event, callback) {
			_events.on(event, callback);
			return this;
		};

		/**
		 * Global event trigger for socket
		 *
		 * @param 	string
		 * @return 	this
		 */
		public.trigger = function(event) {
			_events.emit.apply(_events, arguments);
			return this;
		};

		/* Private Methods
		-------------------------------*/
		var _process = function(http, options) {
			// If http and options is provided
			if(http && options) {
				// attach http object and options
				// to socket.io engine
				_io.attach(http, options);

				// on socket connection
				_io.on('connection', function() {
					this.trigger('request', _io);
				}.bind(this));

				console.log('Socket.io listening to current server address');

				return _io;
			}

			// else if http and options is
			// not defined, create new 
			// server instance for socket io
			this.server = _http.Server();

			// attach http server and default
			// options to socket io engine
			_io.attach(this.server, this.options);

			// listen to the port and host
			// being set before connecting
			this.server.listen(this.port, this.host);

			// on socket connection
			_io.on('connection', function() {
				this.trigger('request', _io);
			}.bind(this));

			console.log('Socket.io listening to http://' +
				this.host + ':' + this.port + '/');

			return _io;
		};
	});
};