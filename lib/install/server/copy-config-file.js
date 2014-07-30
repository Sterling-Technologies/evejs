module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/config/server')
	.copy(local + '/config/server', function() {
		eve.trigger('install-server-step-5', eve, local, deploy.path);
		next();
	});
};