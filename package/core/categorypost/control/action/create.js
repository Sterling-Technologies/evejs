define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data		= {};

	/* Private Properties
	-------------------------------*/
	var $ 		     = jQuery;
	var selectFlag   = false;
	var lastInserted = '';
	var tree 	 	 = [];

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
			.then(_createPost)
			.then(_process);

		return this;
	};

	/* Private Methods
	------------------------------*/
	var selectBox = function() {
		//build the request url
		var requestUrl = controller.getServerUrl() + '/category/list/';

		var categories = {};
		// ajax request, get all category
		$.ajax({
	    	url 		: requestUrl,
	    	async 		: false,
	    	dataType 	: 'json',
	    	success 	: function(data) {
	    		categories = data.results;
	    	}
	    });


		var result = _getCategoryPostTemplate(categories);

		// return the result
		return result;
	};

	var _createPost = function(next) {
		// reset the flag for the selectbox
		selectFlag = false;
		
		// listen if the document is ready
		controller.listen('post-create-ready', function() {
			// check if the select box for category have been rendered already
			if(selectFlag == false) {
				// if not yet, select the correct location
				// and prepend the select box
				$('aside')
					.append(selectBox());
				
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
			//template for chosenjs
			var which = parseInt(2);
			if(which == 2) {
				$('#form-field-select-4').addClass('tag-input-style');
				return;
			}
			
			$('#form-field-select-4').removeClass('tag-input-style');
			return;
		});

		next();
	};

	var _process = function(next) {
	 	// listen for post update
		controller.listen('post-created', function(e, res) {
			
			var url 	= controller.getServerUrl() + '/categorypost/create/';
			// build the postdata that would be pass on the api server
			var postData = { _category: res.data.category, _post: res._post };
			
			if(lastInserted !== postData._post) {
				$.post(url, postData, function(response) {
					lastInserted = postData._post;
				}.bind(this));
			}
			
			// unlisten to the event to prevent the multiple listening and form sending
			controller.unlisten('post-created');
			next();
		});

	};

	var _getCategoryPostTemplate = function(categories) {
	 	// create the initial selecbox
		var result = '<div class="widget-box panel-primary">' + 
					 '<div class="widget-header header-color-red"><h5>Category</h5></div>' +
					 '<div class="widget-body"><div class="widget-main">' +
					 '<div><div><h6>Categories</h6><div>' + 
					 '<select multiple name="category[]" class="width-80 chosen-select" id="form-field-select-4" data-placeholder="Choose a category...">';

		// iterate on each category
		// on list
		for(var i in categories) {
			// temp handler
			var category = '';
			// current category id
			var id 		 = categories[i].id;
			// parent category id
			var parent 	 = categories[i].parent;
			// current category
			var current  = categories[i].name;

			// if the category has no parent
			if(parent === 'undefined') {
				result += '<option value="' + id + '">' + current + '</option>';
				continue;
			}

			// push current category on
			// queue
			tree.push(current);
			// traverse and find current category's
			// child
			category = _traverseCategory(parent, categories);
			// clear out category queue
			tree = [];

			// append html
			result += '<option value="' + id + '" label="' + current + '">' + category + '</option>'

		}

		// append ending tags
		result += '</select></div></div></div></div>';

		return result;
	};

	var _traverseCategory = function(parent, categories) {
		// find out given category
		// parent
		for(var i in categories) {
			// current category id
			var id 	 = categories[i]._id;
			// current category parent
			var root = categories[i].parent;
			// current category name
			var name = categories[i].name;

			// if current id is
			// equal to the given
			// parent id
			if(id == parent) {
				// push it into our queue
				tree.push(name);
				// it means that we need to
				// re-call this function again
				return _traverseCategory(root, categories);
			}

			// if parent of current category
			// is undefined, it means this is
			// the root category
			if(parent === 'undefined') {
				// reverse queue, then join using
				// > seperator
				tree = tree.reverse().join(' > ');
				// return category tree
				return tree;
			}
		}
	};

	return c;	
});