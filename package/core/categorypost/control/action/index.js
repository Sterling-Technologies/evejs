define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data 		= {};

	/* Private Properties
	-------------------------------*/
	var $ 				 = jQuery,
		categories		 = '',
		tableContentFlag = false,
		foundCategory 	 = '';

	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};

	/* Construct
	-------------------------------*/
	public.__construct = function() {
		this.data = {};
	};

	/* Public Methods
	-------------------------------*/
	public.render = function() {
		tableContentFlag = false;

		$.sequence()
			.setScope(this)
			.then(_getCategory)
			.then(_setCategory);

		return this;
	};

	/* Private Methods
	-------------------------------*/

	/**
	 * Find a category on the given id
	 *
	 * @param string
	 */
	function findCat(id) {
		var requestUrl = controller.getServerUrl() + '/category/detail/' + id;
		// ajax request, get all category
		$.ajax({
	    	url: requestUrl,
	    	async: false,
	    	dataType: 'json',
	    	success: function(data) {
	    		foundCategory = data.results.name;
	    	}
	    });
	};
	
	/**
	 * Get all the categories from the mongodb
	 *
	 */
	var _getCategory = function(next) {
		var requestUrl = controller.getServerUrl() + '/categorypost/list/';

		// ajax request, get all category
		$.getJSON(requestUrl, function(data) {
			categories = data.results;
			next();
		});
	};

	/**
	 * Set the category on every post item on the table
	 *
	 */
	var _setCategory = function(next) {
		// listen for the document to become fully loaded
		controller.listen('post-ready', function() {

			// create the selectors
			var post_table_head = $('body .post-list .table thead tr'),
				post_table_body = $('body .post-list .table tbody tr');

			// process the category of each post
			// then append them into the table
			if(tableContentFlag == false) {
				// append the table-header element
				post_table_head.children().eq(3).after('<th>Category</th>');
				
				// append the table-content
				$.each(post_table_body, function(key, bodyContent) {
					// get the post id of the current item
					var post_id = $(this).find('td:eq(2)').html();

					// linking category and post
					var name  = "";

					// iterate through each category
					$.each(categories, function(key, value) {
						var found = false;
						// check if the current item has the same
						// post id, then store it to name variable
						if(value._post == post_id) {
							//get the category for this row of post
							findCat(value._category);
							name = foundCategory;
							foundCategory = '';
							found = true;
							return false;
						}

						// check if there's no value found
						if(found == false) {
							name = "UNCATEGORIZED";
						}
					});

					// get the correct element node, display the category for the current
					// cursor of the loop
					$(this).find('td:eq(3)').after('<td>' + name + '</td>');

					return;
				});

				tableContentFlag = true;
			}

		});

		next();
	};


	/* Adaptor
	-------------------------------*/
	return c; 
});