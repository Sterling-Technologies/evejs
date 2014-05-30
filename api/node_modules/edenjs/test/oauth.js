!function($) {
	var eden = require('eden');
	var unit = eden().get('unit');
	var test = unit.extend(function(public) {
		/* Public Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
		};
		
		/* Construct
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		public.testGet = function() {
			var self = this,
				request = 'http://term.ie/oauth/example/request_token.php',
				access	= 'http://term.ie/oauth/example/access_token.php';
				
			eden('oauth', request, 'key', 'secret')
			.setSignatureToHmacSha1()
			.send(function(response, status, headers, meta) {
				response = eden(response).queryToHash().get();
				
				self.assertHasKey('oauth_token', response, 'Request Token');
				self.assertHasKey('oauth_token_secret', response, 'Request Secret');
				
				eden('oauth', access, 'key', 'secret')
					.setSignatureToHmacSha1()
					.setToken(response.oauth_token, response.oauth_token_secret)
					.send(function(response, status, headers, meta) {
						response = eden(response).queryToHash().get();
						self.assertHasKey('oauth_token', response, 'Access Token');
						self.assertHasKey('oauth_token_secret', response, 'Access Secret');
						run();
					});
			});
		};
		
		/* Private Methods
		-------------------------------*/
	});
	
	var run = unit.cli.call(test, 'oauth', 1);
}();