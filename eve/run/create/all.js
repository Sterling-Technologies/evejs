module.exports = function(eve, command) {
	eve.on('create-complete', function(environment, name) {
		switch(environment) {
			case 'server':
				//install admin
				require('./admin.js')(eve, command);
				break;
			case 'admin':
				//install web
				require('./web.js')(eve, command);
				break;
		}
	});
	
	//install server
	require('./server.js')(eve, command);
};