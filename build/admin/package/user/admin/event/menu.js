define(function() {
	return function(e, menu) {
		// event when the user menu is starting
		this.trigger('user-menu-before');
	
		//add our menu item
		menu.push({
			path	: '/user',
			icon	: 'user',
			label	: 'Users',
			children: [{
				path	: '/user/create',
				label	: 'Create User' }]
			});
	
		// event when the user menu is finished
		this.trigger('user-menu-after');
	};
});