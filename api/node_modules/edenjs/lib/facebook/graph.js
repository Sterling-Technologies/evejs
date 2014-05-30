module.exports = function($) {
	return this.define(function(public) {
		/* Constants
		-------------------------------*/
		public.GRAPH_URL	= 'https://graph.facebook.com/';
		public.USER_AGENT	= 'facebook-php-3.1';
		
		
		/* Public Properties
		-------------------------------*/
		public.token 		= null;
		public.auth			= true;
		public.file			= {};
		public.query 		= {};
		public.post			= {};
		public.id 			= '';
		public.connection 	= '';
		
		/* Private Properties
		-------------------------------*/
		var _list = [
			'Friends',		'Home',
			'Feed',			'Likes',
			'Movies',		'Music',
			'Books',		'Photos',
			'Albums',		'Videos',
			'VideoUploads', 'Events',
			'Groups',		'Checkins'];
		
		var _search = [
			'Posts',		'Users',
			'Pages',		'Likes',
			'Places',		'Events',
			'Groups',		'Checkins'];
			
		/* Loader
		-------------------------------*/
		public.__load = function(token) {
			return new this(token);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(token) {
			this.token = token;
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * Add an album
		 *
		 * @param string|int the object ID to place the album
		 * @param string
		 * @param string the album description
		 * @return this
		 */
		public.createAlbum = function(id, name, message) {
			return this.setId(id)
				.setData({ name: name, message: message })
				.useAuthentication()
				.setConnection('albums');
		};
		
		/**
		 * Adds a comment to a post
		 *
		 * @param int the post ID commenting on
		 * @param string
		 * @return this
		 */
		public.createComment = function(id, message) {
			return this.setId(id)
				.setData({ message: message })
				.useAuthentication()
				.setConnection('comments');
		};
		
		/**
		 * Add a note
		 *
		 * @param int|string object ID where to put the note
		 * @param string
		 * @param string
		 * @return this
		 */
		public.createNote = function(id, subject, message) {
			return this.setId(id || 'me')
				.setData({ subject: subject, message: message })
				.useAuthentication()
				.setConnection('notes');
		};
		
		/**
		 * Add an event
		 *
		 * @param string
		 * @param string
		 * @param string|int
		 * @param string|int
		 * @return Eden_Facebook_Event
		 */
		public.event = function(name, start, end) {
			return $.load('facebook/event', this.token, name, start, end);
		};
		
		/**
		 * Attend an event
		 *
		 * @param int the event ID
		 * @return this
		 */
		public.eventAttend = function(id) {
			return this.setId(id)
				.useAuthentication()
				.setConnection('attending');
		};
		
		/**
		 * Check into a place
		 *
		 * @param string|int the checkin ID
		 * @param string 
		 * @param float
		 * @param float
		 * @param int the place ID
		 * @param string|array
		 * @return int
		 */
		public.eventCheckin = function(id, message, latitude, longitude, place, tags) {
			var post 	= {};
			
			//if message
			if(message) {
				//add it
				post.message = message;
			}
			
			//if coords
			if(latitude && longitute) {
				//add it
				post.coordinates = JSON.stringify({
					latitude: latitude,
					longitude: longitude });
			}
			
			//if place
			if(place) {
				//add it
				post.place = place;
			}
			
			//if tags
			if(tags) {
				//add it
				post.tags = tags;
			}
			
			return this.setId(id)
				.useAuthentication()
				.setConnection('checkins')
				.setData(post);
		};
		
		/**
		 * Maybe an event
		 *
		 * @param int event ID
		 * @return this
		 */
		public.eventMaybe = function(id) {
			return this.setId(id)
				.useAuthentication()
				.setConnection('maybe');
		};
		
		/**
		 * Returns specific fields of an object
		 *
		 * @param string|int
		 * @param string|hash
		 * @return this
		 */
		public.getFields = function(id, fields) {
			//if fields is an array	
			if($.get('array').isArray(fields)) {
				//make it into a string
				fields = fields.join(',');
			}
			
			return this.setId(id || 'me')
				.setQuery({fields: fields})
				.useAuthentication();
		};
		
		/**
		 * Returns user permissions
		 *
		 * @param string|int
		 * @return this
		 */
		public.getPermissions = function(id) {
			return this.setId(id || 'me')
				.setConnection('permissions')
				.useAuthentication();
		};
		
		/**
		 * Returns the user's image
		 *
		 * @param string|int
		 * @param bool
		 * @return string
		 */
		public.getPictureUrl = function(id, token) {
			id = id || 'me';
			token = token !== false;
			
			//for the URL	
			var url = this.GRAPH_URL + id + '/picture';
			
			//if this needs a token
			if(token) {
				//add it
				url += '?access_token=' + this.token;
			}
			
			return url;
		};
		
		/**
		 * Returns the user info
		 *
		 * @return array
		 */
		public.getUser = function(id) {
			return this.setConnection(id || 'me');
		}
		
		/**
		 * Like an object
		 *
		 * @param int|string object ID
		 * @return this
		 */
		public.like = function(id) {
			this.setId(id)
				.setConnection('likes')
				.useAuthentication();
		};
		
		/**
		 * Add a link
		 *
		 * @param string
		 * @param string
		 * @return Eden_Facebook_Post
		 */
		public.link = function(token, url) {
			return $.load('facebook/link', token, url);
		};
		
		/**
		 * Uploads a file of your album
		 *
		 * @param int|string
		 * @param string
		 * @param string|null
		 * @return this
		 */
		public.photoUpload = function(id, file, message) {
			this.setId(id)
				.setConnection('photos')
				.useAuthentication()
				.setFile('source', file);
				
			if(message) {
				this.setData('message', message);
			};
			
			return this;
		};
			
		/**
		 * Returns Facebook Post
		 *
		 * @param string
		 * @param string
		 * @return Eden_Facebook_Post
		 */
		public.post = function(token, message) {
			return $.load('facebook/post', token, message);
		};
		
		/**
		 * Resets Object
		 *
		 * @return this
		 */
		public.reset = function() {
			this.auth			= true;
			this.query 			= {};
			this.post			= {};
			this.file			= {};
			this.id 			= '';
			this.connection 	= '';
			
			return this;
		};
		
		/** 
		 * Returns the detail of any object
		 *
		 * @return this
		 */
		public.send = function(callback) {
			//get the query
			var query = Object.create(this.query);
			
			//for the url
			var url = this.GRAPH_URL + this.id + this.connection;
			
			url = url.replace('com//', 'com/');
			
			//if this requires authentication
			if(this.auth) {
				//add the token
				query.access_token = this.token;
			}
			
			query = $.hash.toQuery(query);
			
			//if we have a query
			if(query.length) {
				//append it to the url
				url += '?' + query;
			}
			
			if(this.file.key && this.file.path) {
				var key = this.file.key, post = Object.create(this.post);
				//get file contents
				$.load('file', this.file.path).getContent(function(error, data) {
					if(error) {
						throw error;
					}
					
					post[key] = data;
					
					//call it
					_call(url, post, callback);
				});
				
				//reset
				return this.reset();
			}
			
			//call it
			_call.call(this, url, this.post, callback);
			
			//reset
			return this.reset();
		};
		
		/**
		 * Adds an additional path to the url
		 * Facebook calls a connection
		 *
		 * @param string
		 * @return this
		 */
		public.setConnection = function(connection) {
			this.connection = '/'+connection;
			return this;
		};
		
		/**
		 * Sets data for post
		 *
		 * @param string
		 * @param string
		 * @return this
		 */
		public.setData = function(key, value) {
			if($.hash.isHash(key)) {
				this.post = key;
				return this;
			}
			
			this.post[key] = value;
			return this;
		};
		
		/**
		 * Queues a file to be upload as part of the request
		 *
		 * @param string
		 * @param string
		 * @return this
		 */
		public.setFile = function(key, file) {
			this.file = { key: key, path: file };
			return this;
		};
		
		/**
		 * Sets Id
		 *
		 * @param string
		 * @return this
		 */
		public.setId = function(id) {
			this.id = id;
			return this;
		};
		
		/**
		 * Sets data for query
		 *
		 * @param string
		 * @param string
		 * @return this
		 */
		public.setQuery = function(key, value) {
			if($.hash.isHash(key)) {
				this.query = key;
				return this;
			}
			
			this.query[key] = value;
			return this;
		};
		
		/**
		 * A flag to whether append the token or not
		 *
		 * @param bool
		 * @return this
		 */
		public.useAuthentication = function(useAuth) {
			this.auth = useAuth !== false;
			return this;
		};
		
		/* Private Methods
		-------------------------------*/
		var _call = function(url, post, callback) {
			post = post || {};
			
			var rest = $.load('rest')
				.setMethod('GET')
				.setUrl(url)
				.setHeaders('User-Agent', this.USER_AGENT);
			
			if($.hash.size(post)) {
				rest.setMethod('POST').setBody($.hash.toQuery(post));
			}
			
			var meta = { url: url, post: post };
			
			rest.send(function(response, status, headers) {
				if($.string.isJson(response)) {
					response = JSON.parse(response);
				}
				
				callback.call(callback, response, status, headers, meta);
			});
		};
		
		var _getList = function(id, connection, start, range, since, until) {
			start = start || 0;
			range = range || 0;
			since = since || 0;
			until = until || 0;
			
			query = {};
			if(start > 0) {
				query.offset = start;
			}
			
			if(range > 0) {
				query.limit = range;
			}
			
			if(since > 0) {
				query.since = since;
			}
			
			if(until > 0) {
				query.until = until;
			}
			
			return this.setId(id)
				.setConnection(connection)
				.setQuery(query);
		};
		
		var _getSearch = function(connection, query, fields) {
			query = { type: connection, q: query };
			
			if($.array.isArray(fields)) {
				fields = fields.join(',');
			}
			
			if(fields) {
				query.fields = fields;
			}
			
			return this.setConnection('search').setQuery(query);
		};
		
		/* Auto Generated Methods
		-------------------------------*/
		for(var i = 0; i < _list.length; i++) {
			public['get'+_list[i]] = (function(name) {
				return function(id, start, range, since, until) {
					id 		= id || 'me';
					start 	= start || 0;
					range 	= range || 0;
					since 	= since || 0;
					until 	= until || 0;
					
					return _getList.call(this, 'me', name, start, range, since, until);
				};
			})(_list[i].toLowerCase());
		}
		
		for(i = 0; i < _search.length; i++) {
			public['search'+_search[i]] = (function(name) {
				return function(query, fields) {
					query = query || {};
					fields = fields || {};
					
					return _getSearch.call(this, name, fields);
				};
			})(_search[i].toLowerCase());
		}
	});
};