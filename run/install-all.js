module.exports = function(eve, local, config) {
	eve.listen('install-server-complete', function() {
		//then install control
		require('./install-control.js')(eve, local, config);
	}).listen('install-control-complete', function() {
		//then install web
		require('./install-web.js')(eve, local, config);
	});
	
	//install server
	require('./install-server.js')(eve, local, config);
};