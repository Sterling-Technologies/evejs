module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/config/web')
	.copy(local + '/config/web', function() {
		eve.trigger('install-web-step-5', eve, local, deploy.path);
		next();
	});
};