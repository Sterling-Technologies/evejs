controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('category'			, controller.path('package') + '/core/category')
		.path('category/action'		, controller.path('package') + '/core/category/action')
		.path('category/asset'		, controller.path('package') + '/core/category/asset')
		.path('category/template'	, controller.path('package') + '/core/category/template');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	//add our menu item
	menu.push({
		path	: '/category',
		icon	: 'pencil',
		label	: 'Category',
		children: [{
			path	: '/category/create',
			label	: 'Create Category' }]
		});
})
//when a url request has been made
.listen('request', function() {
	// cache post index
	var postIndex = window.location.pathname.indexOf('/post');

	//if it doesn't start with category
	if(window.location.pathname.indexOf('/category') !== 0 && postIndex !== 0) {
		//we don't care about it
		return;
	}

	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/category/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/category/update') === 0:
			action = 'update';
			break;
		case window.location.pathname.indexOf('/category/remove') === 0:
			action = 'remove';
			break;
		case window.location.pathname.indexOf('/category/restore') === 0:
			action = 'restore';
			break;
		case window.location.pathname.indexOf('/category/bulk') === 0:
			action = 'bulk';
			break;
	}
	
	action = controller.path('category/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});

	// check if we are on the post page
	if(postIndex == 0) {
		var categories,
			tableContentFlag = false;
		// get the list of category
		var _getCategory = function(fn) {
			var requestUrl = controller.getServerUrl() + '/category/list/';

			// ajax request, get all category
			$.getJSON(requestUrl, function(data) {
				fn(data);
			});
		};

		// async function fix
		var _setCategory = function(data) {
			categories = data.results;

			// listens for the document to become fully loaded
			controller.listen('post-ready', function() {
				// create the selectors
				var post_table_head = $('body .post-list .table thead tr'),
					post_table_body = $('body .post-list .table tbody tr');

				// append the table-header element
				if(tableContentFlag == false) {
					post_table_head.children().eq(3).after('<th>Category</th>');

					// append the table-content
					$.each(post_table_body, function() {
						// get the post id of the current item
						var post_id = $(this).find('td:eq(2)').html();

						// will accept a parameter and iterate
						// through each category item and
						// return a category name
						var cat = function(post) {
							var name  = "";

							// iterate through each category
							$.each(categories, function(key, value) {
								var found = false;
								// check if the current item has the same
								// post id, then store it to name variable
								if(value._post == post) {
									name = value.name;
									found = true;
								}

								// check if there's no value found
								if(found == false) {
									name = "UNCATEGORIZED";
								}
							});

							// return the category name
							return name;
						};

						// get the correct element node, display the category for the current
						// cursor of the loop
						$(this).find('td:eq(3)').after('<td>' + cat(post_id) + '</td>');
					});

					tableContentFlag = true;
				}
			});
		};

		// call the injection process
		_getCategory(_setCategory);
	}


});