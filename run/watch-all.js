module.exports = function(eve, local, args) {
	require('./watch-server.js')(eve, local, args);
	require('./watch-control.js')(eve, local, args);
	require('./watch-web.js')(eve, local, args);
};