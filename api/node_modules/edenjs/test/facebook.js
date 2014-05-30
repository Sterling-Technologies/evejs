!function($) {
	var eden = require('eden');
	var unit = eden().get('unit');
	var test = unit.extend(function(public) {
		/* Public Properties
		-------------------------------*/
		public.count	= 0;
		public.key 		= '475008209211480';
		public.secret 	= '66cbf3afe9c6386bee27253489fb42eb';
		public.redirect = 'http://chris.project.dev/';
		
		public.code 	= 'AQCz9xSSAlTQbF_ZkX11_9sZKDshqo-ZBcJit-qlhn2-lSLkoD94hjTSM4qG'
						+ 'ncBCGk_qGSTC0Sa7zjjVTTug1eva5GtCDKDr9o6qaIcbRKzgBXKdlcz06KtG'
						+'a0TVvK5JNWj5oUO_SbHoPRpfbotJ26SJRDMSCCTgPxRlcd52j05ZkU11RyoE'
						+ 's__z6Fb5jiLMXHzk2FtPFbckQtYfdYw72Q-dL0y2p8qQB4fN3xsioRrKe-EC'
						+'ort_KRFmdVHYmoM8xFTLhRYSzGy17_Q-F7ffEIlgbwx6Nn8nIpxKX7kzfPjx'
						+ 'k-1V9tu0CmAsDgh5JLiR6HQ';
						
		public.access 	= 'CAAGwBHeTUFgBAE2YZBc24R7yjqZAZA4xcLZAavDvM1P27YHCaZAq5pIcuhd'
						+ 'CwaEbIFoUgOfZAWbDGetgaZCNWdxj2fGZBZAlQ83KhZBAeQx5DZBSgMqJ3pB'
						+ 'daNDFpzR7DepNORLz4EWMzw5hKwJcPYbS2jKvZARZBKzHDZAFW3WZCDaNdZA'
						+ 'nMJpdqQhzEzqMo3OVVRsPnZAkZD';
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function() {
			this.__parent.__construct();
			
			this.auth = eden('facebook').load().auth(
				this.key, this.secret, this.redirect);
			
			this.graph = eden('facebook').load().graph(this.access);
		};
		
		/* Public Methods
		-------------------------------*/
		public.testGetLoginUrl = function() {
			var url = this.auth.getLoginUrl();
			
			this.assertSame(
				'https://www.facebook.com/dialog/oauth'
				+'?response_type=code&client_id=4750082'
				+'09211480&redirect_uri=http%3A%2F%2Fch'
				+'ris.project.dev%2F&access_type=online'
				+'&approval_prompt=force', url,
				'Test Login URL');
		};
		
		public.testGetAccess = function() {
			var self = this; 
			this.auth.getAccess(this.code, 
			function(response, status, headers, meta) {
				self.assertHasKey('error', response,'Get Access Token');
				run();
			});
		};
		
		public.testGetUser = function() {
			var self = this; 
			this.graph.getUser().send(function(response, status, headers, meta) {
				self.assertHasKey('id', response, 'Get User ID');
				self.assertHasKey('name', response, 'Get User Name');
				run();
			});
		};
		
		/* Private Methods
		-------------------------------*/
	});
	
	var run = unit.cli.call(test, 'facebook', 2);
}();