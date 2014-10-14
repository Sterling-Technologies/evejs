module.exports = function(eve, command) {
	var environment = command.shift() || 'all';
	
	//just let the files be responsible for the actions if it exists
		
	//first check for the file
	var script = __dirname + '/install/' + environment + '.js';
	
	//if this is not a file
	if(!eve.File(script).isFile()) {
		//give an error and return
		eve.trigger('error', 'This is not a valid command');
		return;
	}
	
	eve.trigger('install-' + environment);
	
	//require the file and let it do the rest
	require(script)(eve, command);
};