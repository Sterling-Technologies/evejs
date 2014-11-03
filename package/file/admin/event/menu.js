define(function() {
	return function(e, menu) {
		// event when the file menu is starting
		this.trigger('file-menu-before');
	
		//add our menu item
		menu.push({
			path	: '/file',
			icon	: 'file',
			label	: 'Files',
			children: [{
				path	: '/file/create',
				label	: 'Create File' }]
			});
	
		// event when the file menu is finished
		this.trigger('file-menu-after');
	};
});