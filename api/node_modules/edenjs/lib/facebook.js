module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.USER_AGENT	= 'User-Agent';
		public.LOGOUT_URL 	= 'https://www.facebook.com/logout.php?next={URL}&access_token={TOKEN}';
		public.RSS 			= 'https://www.facebook.com/feeds/page.php?id={ID}&format=rss20';
		public.RSS_AGENT 	= 'Mozilla/5.0 (X11; U; Linux x86_64; en-US; '
							+ 'rv:1.9.2.13) Gecko/20101206 Ubuntu/10.10 '
							+ '(maverick) Firefox/3.6.13';
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			if(!this.__instance) {
				this.__instance = new this();
			}
			
			return this.__instance;
		};
		
		/* Construct
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		/**
		 * Returns Facebook Auth
		 *
		 * @param string
		 * @param string
		 * @param string
		 * @return Eden_Facebook_Auth
		 */
		public.auth = function(key, secret, redirect) {
			return $.load('facebook/auth', key, secret, redirect);
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
		public.event = function(token, name, start, end) {
			return $.load('facebook/event', token, name, start, end);
		};
	
		/**
		 * Returns Facebook FQL
		 *
		 * @param string
		 * @return Eden_Facebook_Fql
		 *
		public.fql = function(token) {
			return $.load('facebook/fql', token);
		};
		
		/**
		 * Returns the logout URL
		 *
		 * @param string
		 * @param string
		 * @return string
		 */
		public.getLogoutUrl = function(token, redirect) {
			return this.LOGOUT_URL
				.replace('{URL}', $.string.urlEncode(redirect))
				.replace('{TOKEN}', token);	
		};
		
		/**
		 * Returns Facebook Graph
		 *
		 * @param string
		 * @return Eden_Facebook_Graph
		 */
		public.graph = function(token) {
			return $.load('facebook/graph', token);
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
		 * Returns an RSS feed to a public id
		 *
		 * @param int
		 * @return SimpleXml
		 */
		public.rss = function(id, callback) {
			$.load('rest')
				.setUrl(this.RSS.replace('{ID}', id))
				.setHeaders(this.USER_AGENT, this.RSS_AGENT)
				.send(callback);
				
			return this;
		};
		
		/**
		 * Returns Facebook subscribe
		 *
		 * @param string
		 * @param string
		 * @return Eden_Facebook_Subscribe
		 */
		public.subscribe = function(clientId, secret) {
			return $.load('facebook/subscribe', clientId, secret);
		};
		
		/* Private Methods
		-------------------------------*/
	});
};