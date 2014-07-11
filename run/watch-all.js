module.exports = function(eve, local, config) {
	require('./watch-server.js')(eve, local, config);
	require('./watch-control.js')(eve, local, config);
	require('./watch-web.js')(eve, local, config);
};