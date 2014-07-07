controller
// listen when the application is initialized
.listen('init', function() {
	// set the paths
	controller
		.path('categorypost'			, controller.path('package') + '/core/categorypost')
		.path('categorypost/action'		, controller.path('package') + '/core/categorypost/action');

})
// when a url request has been made
.listen('request', function() {
	// cache post index
	var postIndex 		 = window.location.pathname.indexOf('/post'),
		postCreateIndex  = window.location.pathname.indexOf('/post/create'),
		postUpdateIndex = window.location.pathname.indexOf('/post/update');

	// if it doesn't start with category
	if(postIndex !== 0) {
		// this class doesn't care about it
		return;
	}

	var action = 'index';
	switch(true) {
		case postCreateIndex == 0:
			action = 'create';
			break;
		case postUpdateIndex == 0:
			action = 'update';
			break;
	}

	action = controller.path('categorypost/action') + '/' + action + '.js';

	// //load up the action
	require([action], function(action) {
		action.load().render();
	});

	//NOTE: I've tried putting the event listener here just incase the listener doesnt work on the action/index.js
	// controller.listen('post-ready', function() {
	// 	action = 'index';
	// 	action = controller.path('categorypost/action') + '/' + action + '.js';

	// 	//load up the action
	// 	require([action], function(action) {
	// 		action.load().render();
	// 	});
	// });

	//NOTE: The codes below are my first codes
	//It was like a procedural style actually
	//WARNING:MESSY CODES AHEAD

	// var selectBox = function() {
	// 	var requestUrl = controller.getServerUrl() + '/category/list/';
	// 	// create the initial selecbox
	// 	var result = '<div><h6>Category</h6><div><select class="form-control" name="category">';
	// 	var categories;

	// 	var getCat = function() {
	// 		// ajax request, get all category
	// 		$.ajax({
	// 	    	url: requestUrl,
	// 	    	async: false,
	// 	    	dataType: 'json',
	// 	    	success: function(data) {
	// 	    		categories = data.results;
	// 	    	}
	// 	    });
	// 	};

	// 	getCat();

	// 	// create options by iterating through each category
	// 	$.each(categories, function(key, data) {
	// 		result += '<option value="' + data._id + '">' + data.name + '</option>';
	// 	});

	// 	// concatenate the endings
	// 	result += '</select></div></div>';

	// 	// return the result
	// 	return result;
	// };

	// check if we are updating a post
	if(postUpdateIndex == 0) {
		// console.log('Im updating an old post');
		// var selectFlag = false;
		// var update_id 		=  window.location.pathname.split('/')[3];

		// // listen if the document is ready
		// controller.listen('post-ready', function() {
		// 	// check if the checkbox for category have been rendered already
		// 	if(selectFlag == false) {
		// 		// if not yet, select the correct location
		// 		// and prepend the select box
		// 		$('.widget-body div.widget-main')
		// 			.children().eq(3)
		// 			.prepend(selectBox());
				
		// 		// set the flag true to know if the selectbox is rendered
		// 		selectFlag = true;
		// 	}

		// 	// listen for post update
		// 	controller.listen('post-updated', function(e, data) {
		// 		var url 	= controller.getServerUrl() + '/categorypost/update/'+update_id;
					
		// 		var postData = { _category: data, _post: update_id };
		// 		$.post(url, postData, function(response) {
		// 			console.log(postData);
		// 		}.bind(this));

		// 	});

		// });

	}

	// check if we are creating a new post
	if(postCreateIndex == 0) {
		// console.log('Im creating a new post');
		// var selectFlag = false;
		
		// // listen if the document is ready
		// controller.listen('post-ready', function() {
		// 	// check if the select box for category have been rendered already
		// 	if(selectFlag == false) {
		// 		// if not yet, select the correct location
		// 		// and prepend the select box
		// 		$('.widget-body div.widget-main')
		// 			.children().eq(3)
		// 			.prepend(selectBox());
				
		// 		// set the flag true to know if the selectbox is rendered
		// 		selectFlag = true;
		// 	}

		// 	// listen for post update
		// 	controller.listen('post-created', function(e, data, res) {
		// 		var url 	= controller.getServerUrl() + '/categorypost/create/';
		// 			console.log(res)
		// 		var postData = { _category: data, _post: update_id };
		// 		// $.post(url, postData, function(response) {
		// 		// 	console.log(postData);
		// 		// }.bind(this));

		// 	});
		// });
	}
	
	//NOTE: This one is working but the programing style is bad
	// I guess it would break the current structure of the framework
	// but It's working

	//check if we are on the post page
	// if(postIndex == 0) {
	// 	//private variables
	// 	var categories,
	// 		tableContentFlag = false,
	// 		foundCategory = '';


	// 	//1 Create a sequence to call the function synchronously
	// 	var _injectToPost = function() {
	// 		$.sequence()
	// 			.setScope(this)
	// 			.then(_getCategory)
	// 			.then(_setCategory);
	// 	}

	// 	//2 get all the categorypost list
	// 	var _getCategory = function(next) {
	// 		var requestUrl = controller.getServerUrl() + '/categorypost/list/';

	// 		// ajax request, get all category
	// 		$.getJSON(requestUrl, function(data) {
	// 			categories = data.results;
	// 			next();
	// 		});
	// 	};

	// 	// utility to find the specified category
	// 	function findCat(id) {
	// 		var requestUrl = controller.getServerUrl() + '/category/detail/' + id;
	// 		// ajax request, get all category
	// 		$.ajax({
	// 	    	url: requestUrl,
	// 	    	async: false,
	// 	    	dataType: 'json',
	// 	    	success: function(data) {
	// 	    		foundCategory = data.results.name;
	// 	    	}
	// 	    });
	// 	};

	// 	//3 Set the category
	// 	var _setCategory = function(next) {
	// 		// listen for the document to become fully loaded
	// 		controller.listen('post-ready', function() {
	// 			// create the selectors
	// 			var post_table_head = $('body .post-list .table thead tr'),
	// 				post_table_body = $('body .post-list .table tbody tr');

	// 			// append the table-header element
	// 			if(tableContentFlag == false) {
	// 				post_table_head.children().eq(3).after('<th>Category</th>');

					
	// 				// append the table-content
	// 				$.each(post_table_body, function(key, bodyContent) {
	// 					// get the post id of the current item
	// 					var post_id = $(this).find('td:eq(2)').html();

	// 					// linking category and post
	// 					var name  = "";

	// 					// iterate through each category
	// 					$.each(categories, function(key, value) {
	// 						var found = false;
	// 						// check if the current item has the same
	// 						// post id, then store it to name variable
	// 						if(value._post == post_id) {
	// 							//get the category for this row of post
	// 							findCat(value._category);
	// 							name = foundCategory;
	// 							foundCategory = '';
	// 							found = true;
	// 							return false;
	// 						}

	// 						// check if there's no value found
	// 						if(found == false) {
	// 							name = "UNCATEGORIZED";
	// 						}
	// 					});

	// 					// get the correct element node, display the category for the current
	// 					// cursor of the loop
	// 					$(this).find('td:eq(3)').after('<td>' + name + '</td>');

	// 					return;
	// 				});

	// 				tableContentFlag = true;
	// 			}


	// 		});

	// 		next();
	// 	};

	// 	_injectToPost();
	// }

})
