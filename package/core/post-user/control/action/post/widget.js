define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data 	= {};
	public.template = controller.path('post-user/template') + '/post/widget.html';

	/* Private Properties
	-------------------------------*/
	var $ = jQuery;

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
		controller.once('body', function() {
			$.sequence()
			 .setScope(this)
			 .then(_getPostUser)
			 .then(_setData)
			 .then(_output)
			 .then(_listen);
		}.bind(this));

		return this;
	};

	/* Private Methods
	-------------------------------*/
	var _getPostUser = function(next) {
		var id  = controller.getUrlSegment(-1);
		var url = controller.getServerUrl() + '/post/detail/' + id +
				  '?join[to]=users&join[using]=users._id';

		if(window.location.pathname.indexOf('/post/update') === 0) {
			var self = this;

			// sad, but we need to make this
			// synchronous :( bacause of same
			// request origin policy.
			$.ajax({
				url 	 : url,
				async 	 : false,
				dataType : 'json',
				success  : function(response) {
					if(!response.error) {
						self.data.current = response.results.users;
					}
					
					next();
				}
			});
		}

		next();
	};

	var _setData = function(next) {
		// get list of users
		var url = controller.getServerUrl() + '/user/list?filter[active]=1';

		$.getJSON(url, function(response) {
			this.data.users = response.results;

			// loop through users and check
			// what users the current user
			// has selected
			for(var i in this.data.users) {
				for(var k in this.data.current) {
					if(this.data.current[k]._id === null) {
						continue;
					}

					if(this.data.current[k]._id._id == this.data.users[i]._id) {
						this.data.users[i].selected = true;
					}
				}

				// check if post create is from user-post
				if(window.location.pathname.indexOf('/post/create/user') === 0) {
					// get user id
					var id = controller.getUrlSegment(-1);

					if(this.data.users[i]._id == id) {
						this.data.users[i].selected = true;
					} 
				}
			}

			next();
		}.bind(this));
	};

	var _output = function(next) {
		require(['text!' + public.template], function(template) {
			var body = Handlebars.compile(template)(this.data);

			if($('aside.post-user-widget').length !== 0) {
				return next();
			}

			$('form.package-post-form .row').append(body);
			next();
		}.bind(this));
	};

	var _listen = function(next) {
		// initialize chosen
		$('select.post-user-chosen').chosen();

		controller
			// clear all events first
			.unlisten('post-create-before', _postCreateUpdateBefore)
			// listen once post create before
			.once('post-create-before', _postCreateUpdateBefore.bind(this));

		controller
			// clear all events first
			.unlisten('post-create-after', _postCreateUpdateAfter)
			// listen once post create after
			.once('post-create-after', _postCreateUpdateAfter.bind(this));

		controller
			// clear all events first
			.unlisten('post-update-before', _postCreateUpdateBefore)
			// listen once post create before
			.once('post-update-before', _postCreateUpdateBefore.bind(this));

		controller
			// clear all events first
			.unlisten('post-update-after', _postCreateUpdateBefore)
			// listen once post update after
			.once('post-update-after', _postCreateUpdateAfter.bind(this));

		next();
	};

	var _postCreateUpdateBefore = function(e) {
		this.data.join = [];

		// get selected users
		$('select.post-user-chosen option:selected').each(function(key, option) {
			this.data.join.push({ _id : $(option).val() });
		}.bind(this));
	};

	var _postCreateUpdateAfter = function(e, post) {
		// if post update
		if(window.location.pathname.indexOf('/post/update') === 0) {
			post._id = controller.getUrlSegment(-1);
		}

		var url  = controller.getServerUrl() + '/post/join?collection=users',
			join = { _id : post._id, join : { users : this.data.join } };

		$.ajax({
			url 	 : url,
			data 	 : join,
			async 	 : false,
			type 	 : 'post',
			dataType : 'json',
			success  : function(response) {
				if(!response.error) {
					// case if request is from user-post
					if(window.location.pathname.indexOf('/post/create/user') === 0) {
						var id = controller.getUrlSegment(-1);

						// then redirect back to user post
						window.location.href = '/user/post/' + id;
						return;
					}
				}
			}
		});
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});