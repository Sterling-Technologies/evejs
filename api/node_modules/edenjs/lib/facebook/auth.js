module.exports = function($) {
	return $.get('oauth2').extend(function(public) {
		/* Constants
		-------------------------------*/
		public.REQUEST_URL 	= 'https://www.facebook.com/dialog/oauth';
		public.ACCESS_URL	= 'https://graph.facebook.com/oauth/access_token';
		
		/* Public Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function(client, secret, redirect) {
			return new this(client, secret, redirect);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(key, secret, redirect) {
			this.__parent.__construct(key, secret, redirect, this.REQUEST_URL, this.ACCESS_URL);
		};
		
		/* Public Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	});
};