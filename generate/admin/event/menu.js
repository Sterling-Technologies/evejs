define(function() {
	return function(e, menu) {
		// event when the {{name}} menu is starting
		this.trigger('{{name}}-menu-before');
	
		//add our menu item
		menu.push({
			path	: '/{{name}}',
			icon	: '{{icon}}',
			label	: '{{plural}}',
			children: [{
				path	: '/{{name}}/create',
				label	: 'Create {{singular}}' }]
			});
	
		// event when the {{name}} menu is finished
		this.trigger('{{name}}-menu-after');
	};
});