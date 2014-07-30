module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/build/server')
	.copy(deploy.path, function() {
		eve.trigger('install-server-step-3', eve, local, deploy.path);
		next();
	});
};