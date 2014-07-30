module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/config/web')
	.copy(deploy.path + '/application/config', function() {
		eve.trigger('install-web-step-4', eve, local, deploy.path);
		next();
	});
};