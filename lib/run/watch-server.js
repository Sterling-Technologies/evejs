module.exports = function(eve, local, args) {
	var eden = require('edenjs');
	
	var settings = eden('file', local + '/build.json');
	
	var watcher = require(__dirname + '/../watch/server/watcher.js').bind(null, eden, eve, local, settings);
	
	var init = require(__dirname + '/../watch/server/init.js').bind(null, eden, eve, local, args, settings, watcher);

	init();
};