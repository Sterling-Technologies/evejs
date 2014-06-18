var controller = function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.menu 	= []; 
	public.post		= {};
	
	/* Private Properties
	-------------------------------*/
	var $			= jQuery;
	var _paths 		= {};
	var _refresh 	= false; //quirk
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		if(!this.__instance) {
			this.__instance = new c();
		}
		
		return this.__instance;
	};
	
	/* Construct
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	/**
	 * Returns an array form of arguments
	 *
	 * @return array
	 */
	public.args = function() {
		return Array.prototype.slice.apply(arguments.callee.caller.arguments);
	};
	
	/**
	 * Get's a configuration
	 *
	 * @param string
	 * @return this
	 */
	public.config = function(key, callback) {
		require([this.path('config') + '/' + key + '.js'], callback);
		return this;
	};
	
	/**
	 * Returns formatted server 
	 * url from config settings
	 *
	 * @return string
	 */
	public.getServerUrl = function() {
		return this.settings.server.protocol 
		+ '://' + this.settings.server.host 
		+ ':'	+ this.settings.server.port;
	};
	
	/**
	 * Returns formatted server 
	 * url from config settings
	 *
	 * @return string
	 */
	public.getSocketUrl = function() {
		return this.settings.socket.protocol 
		+ '://' + this.settings.socket.host 
		+ ':'	+ this.settings.socket.port;
	};
	
	/**
	 * Returns post data from push state
	 *
	 * @return string
	 */
	public.getPost = function() {
		return window.history.state || '';
	};
	
	/**
	 * Global event listener for the server
	 *
	 * @return this
	 */
	public.listen = function(event, callback) {
		$(window).on(event, callback);
		return this;
	};
	
	/**
	 * Returns the path given the key
	 *
	 * @param string
	 * @return this
	 */
	public.path = function(key, value) {
		if(value) {
			_paths[key] = value;
			return this;
		}
		
		return _paths[key];
	};
	
	/**
	 * Local redirect
	 *
	 * @param string path
	 * @param string post string data
	 * @return this
	 */
	public.redirect = function(path, post) {
		post = post || '';
		window.history.pushState(post, '', path);
		return this;
	};
	
	/**
	 * Sets a global template partial
	 *
	 * @param string partial name
	 * @param string template
	 */
	public.setPartial = function(key, template) {
		Handlebars.registerPartial(key, template);
		return this;
	};
	
	/**
	 * Global event trigger for the server
	 *
	 * @return this
	 */
	public.trigger = function() {
		$(window).trigger.apply($(window), arguments);
		return this;
	};
	
	/* Bootstrap Methods
	-------------------------------*/
	/**
	 * Render Page
	 *
	 * @return this
	 */
	public.renderPage = function() {
		var self 		= this, 
			//get args for sequence
			args 		= arguments, 
			//default templates
			templates 	= [
				'text!' + this.path('template') + '/_page.html',
				'text!' + this.path('template') + '/_head.html',
				'text!' + this.path('template') + '/_foot.html',
				'text!' + this.path('template') + '/_menu.html'];
		
		//require all the default templates
		require(templates, function(page, head, foot, menu) {
			//allow any package to add to the menu
			self.trigger('menu', [self.menu]);
			
			//render head
			head = Handlebars.compile(head)({ right: false });
			
			//render menu
			menu = Handlebars.compile(menu)({ items: self.menu });
			
			//render page
			$(document.body).html(Handlebars.compile(page)({
				head		: head,
				foot		: foot,
				menu		: menu
			}));
			
			//listen for a change in url
			self.listen('request', function(e) {
				//find all menu items
				$('#sidebar li')
				//make them inactive
				.removeClass('active')
				//for each link in the items
				.find('a').each(function() {
					//if the url starts with whats in the link
					if(window.location.href.indexOf(this.href) === 0
					|| window.location.pathname.indexOf(this.href) === 0) {
						//set the item active
						$(this).parent('li').addClass('active');
					}
				});
			});
			
			//if sequence
			if(typeof args[0] == 'function') {
				//call the next
				args[0]();
			}
		});
		
		return this;
	};
	
	/**
	 * Sequence asyncronous event request
	 *
	 * @param string
	 * @return this
	 */
	public.sequenceTrigger = function(event, next) {
		this.trigger(event);
		next();
		
		return this;
	};
	
	/**
	 * Starts up any packages
	 *
	 * @return this
	 */
	public.startPackages = function() {
		//get args for sequence
		var self = this, args = arguments;
		
		//get packages
		this.config('packages', function(packages) {
			//compile a list of index.js found in each package
			var list = [];
			
			//for each package
			for(var i = 0; i < packages.length; i++) {
				//create the path and push it into the list
				list.push(self.path('package') + '/' + packages[i] + '/index.js');
			}
			
			//now we can bulk require all the packages
			require(list, function() {			
				//if sequence
				if(typeof args[0] == 'function') {
					//call next
					args[0]();
				}
			});
		});
		
		return this;
	};
	
	/**
	 * Set paths
	 *
	 * @return this
	 */
	public.setLoader = function() {
		require.config({
			paths: { text: '/scripts/text' },
			config: {
				text: {
					useXhr: function (url, protocol, hostname, port) {
						// allow cross-domain requests
						// remote server allows CORS
						return true;
					}
				}
			}
		});
		
		//if sequence
		if(typeof arguments[0] == 'function') {
			arguments[0]();
		}
		
		return this;
	};
	
	/**
	 * Set paths
	 *
	 * @return this
	 */
	public.setPaths = function() {
		this.path('root'	, '/application')
			.path('config'	, '/application/config')
			.path('template', '/application/template')
			.path('package'	, '/application/package');
		
		//if sequence
		if(typeof arguments[0] == 'function') {
			arguments[0]();
		}
		
		return this;
	};
	
	/**
	 * Set settings
	 *
	 * @return this
	 */
	public.setSettings = function() {
		var args = this.args();
		
		//get settings
		return this.config('settings', function(settings) {
			this.settings = settings;
			
			//if sequence
			if(typeof args[0] == 'function') {
				//call next
				args[0]();
			}
		}.bind(this));
	};
	
	/**
	 * Set template engine
	 *
	 * @return this
	 */
	public.setTemplateEngine = function() {
		Handlebars.registerHelper('when', function (value1, operator, value2, options) {
			var valid = false;
			
			switch (true) {
				case operator == 'eq' 	&& value1 == value2:
				case operator == '==' 	&& value1 == value2:
				case operator == 'req' 	&& value1 === value2:
				case operator == '===' 	&& value1 === value2:
				case operator == 'neq' 	&& value1 != value2:	
				case operator == '!=' 	&& value1 != value2:
				case operator == 'rneq' && value1 !== value2:
				case operator == '!==' 	&& value1 !== value2:
				case operator == 'lt' 	&& value1 < value2:
				case operator == '<' 	&& value1 < value2:
				case operator == 'lte' 	&& value1 <= value2:
				case operator == '<=' 	&& value1 <= value2:
				case operator == 'gt' 	&& value1 > value2:
				case operator == '>' 	&& value1 > value2:
				case operator == 'gte' 	&& value1 >= value2:
				case operator == '>=' 	&& value1 >= value2:
				case operator == 'and' 	&& value1 && value2:
				case operator == '&&' 	&& (value1 && value2):
				case operator == 'or' 	&& value1 || value2:
				case operator == '||' 	&& (value1 || value2):
				
				case operator == 'startsWith' 
				&& value1.indexOf(value2) === 0:
				
				case operator == 'endsWith' 
				&& value1.indexOf(value2) === (value1.length - value2.length):
					valid = true;
					break;
			}
			
			if(valid) {
				return options.fn(this);
			}
			
			return options.inverse(this);
		});
		
		//if sequence
		if(typeof arguments[0] == 'function') {
			arguments[0]();
		}
		
		return this;
	};
	
	/**
	 * Process to start server
	 *
	 * @return this
	 */
	public.startClient = function() {
		//from a refresh - quirk
		_refresh = true;
		
		//hijack url changes
		_hijackPushState();
		_hijackPopState();
		//hijack links
		_hijackLinks();
		//hijack forms
		_hijackForms();
		
		//listen for a url request
		this.listen('request', function() {
			//from a refresh - quirk
			_refresh = false;
		}.bind(this)).trigger('request');
		
		//if sequence
		if(typeof arguments[0] == 'function') {
			arguments[0]();
		}
		
		return this;
	};
	
	/* Page Methods
	-------------------------------*/
	/**
	 * Adds an alert message
	 *
	 * @param string
	 * @param string
	 * @param string
	 * @return this
	 */
	public.addMessage = function(message, type, icon) {
		icon = icon || 'okay';
		type = type || 'success';
		
		//get the alert template
		require(['text!' + this.path('template') + '/_alert.html'], function(template) {
			//add the message to the messages container
			$('#messages').prepend(Handlebars.compile(template)({
				type	: type,
				message	: message,
				icon	: icon
			}));
		});
		
		return this;
	};
	
	/**
	 * Adds a popup notification
	 * less intrusive than message
	 *
	 * @param string
	 * @param string
	 * @param string
	 * @return this
	 */
	public.notify = function(title, message, type) {
		$.extend($.gritter.options, { position: 'bottom-right' });
		
		$.gritter.add({ title: title, text: message, class_name: 'gritter-'+type });
		
		return this;
	};
	
	/**
	 * Sets page body
	 *
	 * @param string
	 * @return this
	 */
	public.setBody = function(html) {
		$('#body').html(html);
			
		//trigger body event
		return this.trigger('body');
	};
	
	/**
	 * Sets page crumbs
	 *
	 * @param array
	 * @return this
	 */
	public.setCrumbs = function(crumbs) {
		//get the global crumbs template
		require(['text!' + this.path('template') + '/_crumbs.html'], function(template) {
			//add the crumbs to the breadcrumbs container
			$('#breadcrumbs').html(Handlebars.compile(template)({ crumbs: crumbs }));
		});
		
		return this;
	};
	
	/**
	 * Sets page header
	 *
	 * @param string
	 * @return this
	 */
	public.setHeader = function(header) {
		$('#header-title').html(header);
		return this;
	};
	
	/**
	 * Sets page subheader
	 *
	 * @param string
	 * @return this
	 */
	public.setSubheader = function(subheader) {
		$('#subheader-title').html(subheader);
		return this;
	};
	
	/**
	 * Sets page title
	 *
	 * @param string
	 * @return this
	 */
	public.setTitle = function(title) {
		$('head title').html(title);
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _hijackPushState = function() {
		//remember the push state
		var pushState = window.history.pushState;
		
		//override the function
		window.history.pushState = function(state) {
			if (typeof window.history.onpushstate == 'function') {
				window.history.onpushstate({state: state});
			}
			
			var results = pushState.apply(history, arguments);
			
			//now trigger something special
			var event = jQuery.Event('request');
			event.state = state;
			$(window).trigger(event);
			
			return results;
		}
	};
	
	var _hijackPopState = function() {
		window.onpopstate = function (e) {
			//from a refresh - quirk
			if(_refresh) {
				_refresh = false;
				return;
			}
			
			//now trigger something special
			var event = jQuery.Event('request');
			event.state = e.state;
			$(window).trigger(event);
		};
	};
	
	var _hijackLinks = function() {
		//live listen to all links
		$(document).on('click', 'a', function(e) {
			//if another event says to do nothing
			if(e.originalEvent.stop) {
				//do nothing
				return;
			}
			
			//if the link is in the same domain
			if(this.href.indexOf(window.location.origin) === 0) {
				//stop it
				e.preventDefault();
				//push the state
				window.history.pushState('', '', this.href);
			}
		});
	};
	
	var _hijackForms = function() {
		//listen to form submits
		$(document.body).on('submit', 'form', function(e) {
			//if another event says to do nothing
			if(e.originalEvent.stop) {
				//do nothing
				return;
			}
			
			//if the action is in the same domain
			if(!$(this).attr('action') 
			|| $(this).attr('action').indexOf(window.location.origin) === 0
			|| $(this).attr('action').indexOf('/') === 0) {
				//stop it
				e.preventDefault();
				
				var post = '', url = $(this).attr('action') || window.location.href;
				
				if(!$(this).attr('method') || $(this).attr('method').toUpperCase() == 'GET') {
					//manually form the HREF
					//if there is a ?
					if(url.indexOf('?') != -1) {
						url = url.split('?')[0];
					} 
					
					url += '?' + $(this).serialize();
				} else {
					post = $(this).serialize();
				}
				
				//push the state
				window.history.pushState(post, '', url);
			}
		});
	};
	
	/* Adaptor
	-------------------------------*/
	return c.load(); 
}();