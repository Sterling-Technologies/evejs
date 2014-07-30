module.exports = function(eve, local, args) {
	var eden 	= require('edenjs');
	var section = args[0] || 'all';
	
	//just let the files be responsible for the actions if it exists
		
	//first check for the file
	var script = __dirname + '/install-' + section + '.js';
	
	//if this is not a file
	if(!eden('file', script).isFile()) {
		//give an error and return
		eve.trigger('error', 'This is not a valid command', local);
		return;
	}
	
	eve.trigger('install-' + section, local);
	
	//prepare the arguments
	args = Array.prototype.slice.apply(args);
	
	args.shift();
	
	//require the file and let it do the rest
	require(script)(eve, local, args);
};