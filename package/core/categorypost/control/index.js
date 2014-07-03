controller
// listen when the application is initialized
.listen('init', function() {
	// set the paths
	controller
		.path('categorypost'			, controller.path('package') + '/core/categorypost');
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

	var selectBox = function() {
		var requestUrl = controller.getServerUrl() + '/category/list/';
		// create the initial selecbox
		var result = '<div><h6>Category</h6><div><select class="form-control">';
		var categories;

		var getCat = function() {
			// ajax request, get all category
			$.ajax({
		    	url: requestUrl,
		    	async: false,
		    	dataType: 'json',
		    	success: function(data) {
		    		categories = data.results;
		    	}
		    });
		};

		getCat();

		// create options by iterating through each category
		$.each(categories, function(key, data) {
			result += '<option value="' + data._id + '">' + data.name + '</option>';
		});

		// concatenate the endings
		result += '</select></div></div>';

		// return the result
		return result;
	};

	// check if we are updating a post
	if(postUpdateIndex == 0) {
		console.log('Im updating an old post');
		var selectFlag = false;

		// listen if the document is ready
		controller.listen('post-ready', function() {
			// check if the checkbox for category have been rendered already
			if(selectFlag == false) {
				// if not yet, select the correct location
				// and prepend the select box
				$('.widget-body div.widget-main')
					.children().eq(3)
					.prepend(selectBox());
				
				// set the flag true to know if the selectbox is rendered
				selectFlag = true;
			}
		});
	}

	// check if we are creating a new post
	if(postCreateIndex == 0) {
		console.log('Im creating a new post');
		var selectFlag = false;
		console.log(selectBox());
		// listen if the document is ready
		controller.listen('post-ready', function() {
			// check if the select box for category have been rendered already
			if(selectFlag == false) {
				// if not yet, select the correct location
				// and prepend the select box
				$('.widget-body div.widget-main')
					.children().eq(3)
					.prepend(selectBox());
				
				// set the flag true to know if the selectbox is rendered
				selectFlag = true;
			}
		});
	}
	
	//check if we are on the post page
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

})