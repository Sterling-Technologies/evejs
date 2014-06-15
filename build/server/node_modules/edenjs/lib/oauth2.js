module.exports = function($) {
	return this.define(function(public) {
		/* Constants
		-------------------------------*/
		public.CODE    	= 'code';
		public.TOKEN	= 'token';
		public.ONLINE	= 'online';
		public.OFFLINE	= 'offline';
		public.AUTO    	= 'auto';
		public.FORCE   	= 'force';
		public.TYPE		= 'Content-Type';
		public.REQUEST	= 'application/x-www-form-urlencoded';
		
		public.RESPONSE_TYPE	= 'response_type';
		public.CLIENT_ID		= 'client_id';
		public.REDIRECT_URL		= 'redirect_uri';
		public.ACCESS_TYPE		= 'access_type';
		public.APROVAL			= 'approval_prompt';
		public.CLIENT_SECRET	= 'client_secret';
		public.GRANT_TYPE		= 'grant_type';
		public.AUTHORIZATION	= 'authorization_code';
		public.REFRESH_TOKEN	= 'refresh_token';
		
		/* Public Properties
		-------------------------------*/
		public.client		= '';
		public.secret		= '';
		public.redirect		= '';
		public.state		= '';
		public.scope		= '';
		public.display		= '';
		public.requestUrl	= '';
		public.accessUrl	= '';
		
		public.responseType		= public.CODE;
		public.approvalPrompt	= public.FORCE;
		public.accessType		= public.ONLINE;
		public.grantType    	= public.AUTHORIZATION;
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function(client, secret, redirect, requestUrl, accessUrl) {
			return new this(client, secret, redirect, requestUrl, accessUrl);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(client, secret, redirect, requestUrl, accessUrl) {
			//Argument Testing
			$.load('argument')
				.test(1, 'string')
				.test(2, 'string')
				.test(3, 'string')
				.test(4, 'string')
				.test(5, 'string');
				
			this.client 	= client;
			this.secret 	= secret;
			this.redirect 	= redirect;
			this.requestUrl	= requestUrl;
			this.accessUrl 	= accessUrl;
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * Set auth for online access
		 *
		 * @return this
		 */
		public.approvalPromptToAuto = function() {
			this.approvalPrompt = this.AUTO;
			return this;
		};
		
		/**
		 * Set auth to auto approve
		 *
		 * @return this
		 */
		public.autoApprove = function() {
			this.approvalPrompt = this.AUTO;
			return this;
		};
		
		/**
		 * Set auth for force approve
		 *
		 * @return this
		 */
		public.forceApprove = function() {
			this.approvalPrompt = this.FORCE;
			return this;
		};
		
		/**
		 * Set auth for offline access
		 * 
		 * @return this
		 */
		public.forOffline = function() { 
			this.accessType = this.OFFLINE;
			return this;
		};
		
		/**
		 * Set auth for online access
		 *
		 * @return this
		 */
		public.forOnline = function() {
			this.accessType = this.ONLINE;
			return this;
		};
		
		/**
		 * Returns website login url
		 *
		 * @param string*
		 * @return array
		 */
		public.getAccess = function(code, callback, refreshToken) {
			//Argument Testing
			$.load('argument')
				.test(1, 'string')
				.test(2, 'function')
				.test(3, 'string', 'undefined');
			
			//populate fields
			var query = {};
			
			query[this.CLIENT_ID] 		= this.client;
			query[this.CLIENT_SECRET]	= this.secret;
			
			//if you want to refresh a token only
			if(refreshToken) {
				//populate fields
				query[this.GRANT_TYPE]		= this.REFRESH_TOKEN;
			} else {
				//populate fields
				query[this.REDIRECT_URL]	= this.redirect;
				query[this.GRANT_TYPE]		= this.grantType;
			}
			
			return _getAccess.call(this, callback, query, code, refreshToken);
		};
		
		/**
		 * Returns website login url
		 *
		 * @param string|null
		 * @param string|null
		 * @return url
		 */
		public.getLoginUrl = function(scope, display) {
			//Argument Testing
			$.load('argument')
				.test(1, 'string', 'undefined')
				.test(2, 'string', 'undefined');
				
			//if scope in not null
			if(scope) {
				//lets set the scope
				this.setScope(scope);
			}
			
			//if display in not null
			if(display) {
				//lets set the display
				this.setDisplay(display);
			}
			
			//populate fields
			var query = {};
			
			query[this.RESPONSE_TYPE] 	= this.responseType;
			query[this.CLIENT_ID]		= this.client;
			query[this.REDIRECT_URL] 	= this.redirect;
			query[this.ACCESS_TYPE]		= this.accessType;
			query[this.APROVAL] 		= this.approvalPrompt;
			
			return _getLoginUrl.call(this, query);
		};
		
		/**
		 * Set state
		 *
		 * @param string
		 * @return this
		 */
		public.setState = function(state) {
			//Argument Testing
			$.load('argument').test(1, 'string');
			
			this.state = state;
			return this;
		};
		
		/**
		 * Set scope
		 *
		 * @param string|array
		 * @return this
		 */
		public.setScope = function(scope) {
			//Argument Testing
			$.load('argument').test(1, 'string', 'array');
			
			this.scope = scope;
			return this;
		};
		
		/**
		 * Set display
		 *
		 * @param string|array
		 * @return this
		 */
		public.setDisplay = function(display) {
			//Argument Testing
			$.load('argument').test(1, 'string', 'array');
			
			this.display = display;
			return this;
		};
	
		/* Private Methods
		-------------------------------*/
		var _getLoginUrl = function(query) {
			//if there is a scope
			if(this.scope) {
				//if scope is in array
				if($.load('array').isArray(this.scope)) {
					this.scope = this.scope.join(' ');
				}
				
				//add scope to the query
				query.scope = this.scope;
			}
			
			//if there is state
			if(this.state) {
				//add state to the query
				query.state = this.state;
			}
			
			//if there is display
			if(this.display) {
				//add state to the query
				query.display = this.display;
			}
			
			//generate a login url
			return this.requestUrl + '?' + $.load('hash').toQuery(query);
		};
		
		var _getAccess = function(callback, query, code, refreshToken) {
			//if there is a code
			if(code) {
				//if you only want to refresh a token
				if(refreshToken) { 
					//put code in the query
					query[this.REFRESH_TOKEN] = code;
				//else you want to request a token
				} else {
					//put code in the query
					query[this.CODE] = code;	
				}
			}
			
			var meta = { url: this.url, query: query };
			
			//set rest	  
			$.load('rest')
				.setUrl(this.accessUrl)
				.setHeaders(this.TYPE, this.REQUEST)
				.setMethod('POST')
				.setBody($.load('hash').toQuery(query))
				.send(function(response, status, headers) {
					response = $.load('string').toHash(response);
					callback.call(callback, response, status, headers, meta);
				});
			
			return this;
		};
	});
};