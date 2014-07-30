module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/config/server')
	.copy(deploy.path + '/config', function() {
		eve.trigger('install-server-step-4', eve, local, deploy.path);
		next();
	});
};