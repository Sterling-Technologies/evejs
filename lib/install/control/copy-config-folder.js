module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/config/control')
	.copy(deploy.path + '/application/config', function() {
		eve.trigger('install-control-step-4', eve, local, deploy.path);
		next();
	});
};