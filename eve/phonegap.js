var spawn = require('child_process').spawn;

/**
 * Starts the phonegap.
 * 
 * @param {Object} settings
 * @returns {nodemon}
 */
module.exports = function(eve, settings, callback) {
    var phonegap = spawn('phonegap', ['serve'], {
		cwd: settings.projectDir
	});
	
	var started = false;
	phonegap.stdout.on('data', function (data) {
		if(!started) {
			started = true;
			eve().trigger('phonegap-start');
		}
		
		if(data.toString().indexOf('listening') !== -1) {
			eve().trigger('message', data);
		}
	});
	
	phonegap.stderr.on('data', function (data) {
		eve().trigger('error', data, true);
	});
	
	phonegap.on('exit', function (code) {
		eve().trigger('phonegap-quit', code);
	});
	
	phonegap.on('quit', function() {
		phonegap.kill('SIGINT');
	});
	
	callback(null, { server: phonegap });
	
	return phonegap;
};


var aBetterWay = function(eve, settings, callback) {
	var phonegap = require('phonegap');
	
	phonegap.serve(settings || {
		port: 3000,
		autoreload: true,
		localtunnel: false
	}, function(error, data) {
		if(error) {
			eve().trigger('error', error);
			process.exit(0);
		}
		
		eve().trigger('phonegap-start', error, data);
		
		data.server.on('close', function() {
			eve().trigger('phonegap-quit', data);
		});
		
		data.server.on('quit', function() {
			data.server.close();
		});
		
		callback(error, data);
	});
	
	phonegap.on('log', function(message) {
		eve().trigger('phonegap-log', message);
    });
	
    return phonegap;
};