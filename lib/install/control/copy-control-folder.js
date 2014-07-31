module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/build/control')
	.copy(deploy.path, function() {
		eve.trigger('install-control-step-3', eve, local, deploy.path);
		next();
	});
};