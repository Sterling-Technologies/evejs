module.exports = function(eve, local, args) {
	eve.listen('watch-server-init', function() {
		//then watch control
		require('./watch-control.js')(eve, local, args);
	}).listen('watch-control-init', function() {
		//then watch web
		require('./watch-web.js')(eve, local, args);
	});
	
	//watch server
	require('./watch-server.js')(eve, local, args);
};