define(function() {
	return function(e, {{from.schema.name}}, {{to.schema.name}}, request, action) {
		this.notify('Success', '{{from.schema.singular}} has been linked with {{to.schema.singular}}!', 'success');
		this.trigger('{{name}}-response', request, action);
	};
});