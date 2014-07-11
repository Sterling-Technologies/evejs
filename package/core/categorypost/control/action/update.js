define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data		= {};

	/* Private Properties
	-------------------------------*/
	var $ 			   = jQuery;
	var selectFlag 	   = false;
	var lastCategories = [];
	var parentName	   = '';

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
		$.sequence()
			.setScope(this)
			.then(_getCategory)
			.then(_updatePost)
			.then(_process);

		return this;
	};

	/* Private Methods
	------------------------------*/

	/**
	 * Get all the categories-post link from the mongodb
	 *
	 */
	var _getCategory = function(next) {
		var update_id 		=  window.location.pathname.split('/')[3];

		// build the request url to be use on ajax
		var requestUrl = controller.getServerUrl() + '/categorypost/detail/' + update_id;

		// ajax request, get all category
		$.getJSON(requestUrl, function(data) {
			// get the results
			lastCategories = data.results;
			next();
		});

	};

	/**
	 * Build the widget box for this plugin
	 *
	 */
	var selectBox = function() {
		//build the request url
		var requestUrl = controller.getServerUrl() + '/category/list/';

		// create the initial selecbox
		var result = '<div class="widget-box panel-primary">';
		result += '<div class="widget-header header-color-red"><h5>Category<h5></div>';
		result += '<div class="widget-body"><div class="widget-main">';
		result += '<div>';
		result += '<div><h6>Categories</h6><div><select multiple name="category[]" class="width-80 chosen-select" id="form-field-select-4" data-placeholder="Choose a category...">';

		var categories;

		/**
		 * Get all the categories
		 *
		 */
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

		/**
		 * Get the parent upto the root node of the category recursively
		 */
		var _getParentCategory = function(parentId) {
			var requestUrl = controller.getServerUrl() + '/category/detail/' + parentId;

			// get the parent of this child categories
			$.ajax({
		    	url: requestUrl,
		    	async: false,
		    	dataType: 'json',
		    	success: function(data) {
		    		var results = data.results;

		    		// get the parent name
					parentName = results.name + ' > ' + parentName;

					// recursion base case
					if(results.parent == 'undefined') {
						return parentName;
					}

					// recursive case
					// it will run except when the parent category is undefined
					return _getParentCategory(results.parent);
		    	}
		    });
		}

		getCat();

		// create options by iterating through each category
		$.each(categories, function(key, data) {
			result += '<option value="';
			result += data._id;
			result += '"';

			// check if this category is on the array of last category
			if($.inArray(data._id, lastCategories._category) < 0) {
				result += '>';
			} else {
				result += ' selected>';
			}
			
			// check if the parent has parents categories
			if(data.parent == 'undefined') {
				result += data.name + '</option>';
			} else {
				// get the parents
				_getParentCategory(data.parent)
				result += parentName + data.name + '</option>';
			}

			// reset the parents
			parentName = '';
		});

		// concatenate the endings
		result += '</select>';
		result += '</div></div>';
		result += '</div>';
		result += '</div>';

		// return the result
		return result;
	};

	/**
	 * Create Post hack, check if the user is creating a post
	 * and listens if the form was submitted and successfully stored
	 */
	var _updatePost = function(next) {
		// reset the flag for the selectbox
		selectFlag = false;

		// listen if the document is ready
		controller.listen('post-update-ready', function() {
			// check if the checkbox for category have been rendered already
			if(selectFlag == false) {
				// if not yet, select the correct location
				// and prepend the select box
				$('aside')
					.append(selectBox());

				lastCategories = [];
				
				// set the flag true to know if the selectbox is rendered
				selectFlag = true;
			}

			// for the select multiple list
			$(".chosen-select").chosen().change(function() {
				$('.search-choice span').each(function(key, data) { 
					var lastElem = $(this).text().split(' > ');
					$(this).text(lastElem[lastElem.length - 1]);
				});
			});
			// template for chosenjs
			var which = parseInt(2);
			if(which == 2) $('#form-field-select-4').addClass('tag-input-style');
			else $('#form-field-select-4').removeClass('tag-input-style');

		});

		next();
	};

	/**
	 * Will process the data that will be updated
	 */
	 var _process = function(next) {
	 	var update_id 		=  window.location.pathname.split('/')[3];
	 	
	 	// listen for post update
		controller.once('post-updated', function(e, data) {
			// build the request url
			var url 	= controller.getServerUrl() + '/categorypost/update/'+update_id;
				
			var postData = { _category: data.category, _post: update_id };
			$.post(url, postData, function(response) {
				//updated success
			}.bind(this));

			// unlisten to the event to prevent multiple event listening
			controller.unlisten('post-updated', this);
			next();
		});
	 };


	return c;	
});