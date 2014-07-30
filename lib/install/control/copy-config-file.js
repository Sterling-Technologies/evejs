module.exports = function(eden, eve, local, deploy, next) {
	eden('folder', eve.root + '/config/control')
	.copy(local + '/config/control', function() {
		eve.trigger('install-control-step-5', eve, local, deploy.path);
		next();
	});
};