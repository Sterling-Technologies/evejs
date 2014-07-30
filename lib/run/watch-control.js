module.exports = function(eve, local, args) {
	var eden = require('edenjs');
	
	var settings = eden('file', local + '/build.json');
	
	var watcher = require(__dirname + '/../watch/control/watcher.js').bind(null, eden, eve, local, settings);
	
	var init = require(__dirname + '/../watch/control/init.js').bind(null, eden, eve, local, args, settings, watcher);

	init();
};