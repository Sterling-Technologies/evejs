module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.host		= '127.0.0.1';
		public.port		= 1337;
		
		public.resource = null;
		
		/* Private Properties
		-------------------------------*/
		var _events 	= new (require('events').EventEmitter);
		var _formidable = require('formidable');
		var _http 		= require('http');
		
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
		 * Connect to server
		 *
		 * @return this
		 */
		public.connect = function() {
			this.resource = _http
				.createServer(_response.bind(this))
				.listen(this.port, this.host);
				
			console.log('Eden running on http://'+this.host+':'+this.port+'/');
			return this;
		};
		
		/**
		 * Global event listener for the server
		 *
		 * @return this
		 */
		public.listen = function(event, callback) {
			//Argument Testing
			$.load('argument')
				.test(1, 'string')
				.test(2, 'function');
			
			_events.on(event, callback);
			return this;
		};
		
		/**
		 * Sets the identifiable host name
		 *
		 * @param string
		 * @return this
		 */
		public.setHost = function(host) {
			//Argument Testing
			$.load('argument').test(1, 'string');
			
			this.host = host;
			return this;
		};
		
		/**
		 * Sets the identifiable port
		 *
		 * @param string
		 * @return this
		 */
		public.setPort = function(port) {
			//Argument Testing
			$.load('argument').test(1, 'string', 'int');
			
			this.port = port;
			return this;
		};
		
		/**
		 * Global event trigger for the server
		 *
		 * @return this
		 */
		public.trigger = function() {
			//Argument Testing
			$.load('argument').test(1, 'string');
			
			_events.emit.apply(_events, arguments);
			return this;
		};
	
		/* Private Methods
		-------------------------------*/
		var _response = function(request, response) {
			//add post and get method
			//on request object
			request.post = _http.request;
			request.get  = _http.get;
			
			//start in good conscience
			response.state 		= 200;
			response.headers 	= { 'Content-Type': 'text/html' };
			
			//parse out the URL
			request.path 		= $.load('string').toPath(request.url);
			request.pathArray	= $.load('string').pathToArray(request.url);
			request.query 		= $.load('string').pathToQuery(request.url);
			
			request.message 		= '';
			
			//if this is a form submit
			if(request.headers && request.headers['content-type']
			&& request.headers['content-type'].indexOf('multipart/form-data') === 0) {
				//create a stream for files
				request.stream = _stream(request);
				_process.bind(this)(request, response);
				
				return;
			}
			
			request.on('data', function(data) {
				request.message += data;
				
				//Prevent FLOOD ATTACK, FAULTY CLIENT, NUKE REQUEST
				if(request.message.length > 1e6) {
					request.message = '';
					response.writeHead(413, {'Content-Type': 'text/plain'});
					response.end();
					request.connection.destroy();
				}
			});
			
			request.on('end', _process.bind(this, request, response));
		};
		
		var _process = function(request, response) {
			//wait for the response to be ready
			this.listen('response', function(request, response) {
				try {
					response.writeHead(response.state, response.headers);
					response.end(response.message+'');
					
					//event trigger
					this.trigger('output', request, response);
				} catch(error) {
					response.state = 500;
					//event trigger
					this.trigger('output-error', request, response, error);
					
					if(!response.message) {
						response.message = error.toString();
					}
					
					response.writeHead(response.state, response.headers);
					response.end(response.message);
				}
			}.bind(this));
			
			//request trigger
			this.trigger('request', request, response);
			
			//if response isn't processing
			if(!response.processing) {
				response.state = 404;
				this.trigger('response', request, response);
			}
			
		};
		
		var _stream = function(request) { 
			var events 	= new (require('events').EventEmitter);
			
			events.start = function() {
				//use formidable
				var query = [], files = [], form = new _formidable.IncomingForm();
				
				form.onPart = function(part) {
					//part can be any type of request
					//the only one we care about is requests
					//that are file uploads
					if(!part.filename || !part.mime) {
						//let formidable handle this
						form.handlePart(part);
						return;
					}
					
					files.push({ name: part.filename, mime: part.mime });
					
					this.emit('file-start', part.filename, part.mime);
					
					part.addListener('data', function() {
						//just pass it along
						var args = $.args();
						args.unshift('file-data');
						this.emit.apply(events, args);
					}.bind(this));
					
					part.addListener('end', function() {
						//just pass it along
						var args = $.args();
						args.unshift('file-end');
						this.emit.apply(events, args);
					}.bind(this));
				}.bind(this);
				
				//collect the fields
				form.on('field', function(name, value) {
					query.push(name + '=' + value);
				}).on('end', function() {
					this.emit('complete', query.join('&'), files);
					request.message = query.join('&');
				}.bind(this));
				
				this.emit('start');
				form.parse(request);
			}.bind(events);
			
			return events;
		};
	});
};