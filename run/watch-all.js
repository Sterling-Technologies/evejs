module.exports = function(eve, local, args) {
	var eden 	= require('edenjs');
    var build 	= eden('file', local + '/build.json');
    var watch 	= function() {
        require('./watch-server.js')(eve, local, args);
        require('./watch-control.js')(eve, local, args);
        require('./watch-web.js')(eve, local, args);
    };

    // we assumed that the dir is empty because the build.json is not there
    if (!build.isFile()) {
		// we need to listens to the last environment to be done
		eve.listen('install-web-complete', watch);
		 
        require('./install-all.js')(eve, local, args); // starts installing the script

        return;
    }

    watch();
};