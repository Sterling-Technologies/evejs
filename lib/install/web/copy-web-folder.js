module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/build/web')
	.copy(deploy.path, function() {
		eve.trigger('install-web-step-3', eve, local, deploy.path);
		next();
	});
};