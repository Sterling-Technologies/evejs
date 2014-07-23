module.exports = function(eve, local, args) {
    var eden = require('edenjs');
    var buildFile = eden('file', local + '/build.json');
    var startWatching = function() {
        require('./watch-server.js')(eve, local, args);
        require('./watch-control.js')(eve, local, args);
        require('./watch-web.js')(eve, local, args);
    };

    // we assumed that the dir is empty because the build.json is not there
    if (!buildFile.isFile()) {
        var installScript = require('./install.js');

        // cause the installScript is shifting the first argument
        args.unshift('all');

        installScript(eve, local, args); // starts installing the script

        // we need to listens to the last environment to be done
        return eve.listen('install-web-complete', startWatching);
    }

    startWatching();
};