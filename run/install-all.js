module.exports = function(eve, local, args) {
	eve.listen('install-server-complete', function() {
		//then install control
		require('./install-control.js')(eve, local, args);
	}).listen('install-control-complete', function() {
		//then install web
		require('./install-web.js')(eve, local, args);
	});
	
	//install server
	require('./install-server.js')(eve, local, args);
};