define(function() {
	return {
		server: { 
			type		: 'server', 
			protocol 	: 'http', 
			host 		: 'server.eve.dev', 
			port 		: 8082 },
		admin: { 
			type		: 'admin', 
			protocol 	: 'http', 
			host 		: 'admin.eve.dev', 
			port 		: 80 },
		web: { 
			type		: 'web', 
			protocol 	: 'http', 
			host 		: 'web.eve.dev', 
			port 		: 80 }
	};
});
