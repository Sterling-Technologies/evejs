define(function() {
	return {
		server	: { protocol: 'http', host: 'server.eve.dev', port : 8082 },
		socket	: { protocol: 'http', host: 'socket.eve.dev', port : 1337 },
		control	: { protocol: 'http', host: 'control.eve.dev', port : 80 },
		web		: { protocol: 'http', host: 'web.eve.dev', port : 80 }
	};
});