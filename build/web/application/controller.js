/*
 * This file is part a custom application package.
 * (c) 2014-2015 Openovate Labs
 */
(function() {
	var controller = jQuery.eve.base.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		this._menu 		= []; 
		
		/* Private Properties
		-------------------------------*/
		var __paths 	= {};
		var __settings 	= {};
		var __chops		= null;
		
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		/**
		 * Cookie wrapper
		 *
		 * @param string
		 * @param mixed
		 * @return mixes
		 */
		this.cookie = function(key, value) {
			if(typeof value === 'undefined') {
				return $.cookie(key);
			}
			
			if(value === null) {
				$.removeCookie(key, { path: '/' });
				return this;
			}
			
			$.cookie(key, value, { path: '/' });
			
			return this;
		};
		
		/**
		 * Get's a configuration
		 *
		 * @param string
		 * @return this
		 */
		this.config = function(key, callback) {
			require([this.path('config') + '/' + key + '.js'], callback);
			return this;
		};
		
		/**
		 * Returns the server url
		 *
		 * @return string
		 */
		this.getServerUrl = function() {
			return __settings.server.protocol 
			+ '://' + __settings.server.host 
			+ ':'	+ __settings.server.port;
		};
		
		/**
		 * This get settings
		 *
		 * @return object
		 */
		this.getSettings = function() {
			return __settings;
		};
		
		/**
		 * Returns the state
		 *
		 * @return object|null
		 */
		this.getState = function() {
			if(__chops === null) {
				return null;
			}
			
			return __chops.getState();
		};
		
		/**
		 * Returns Url Segment based on
		 * index given.
		 *
		 * @param 	int
		 * @return 	string
		 */
		this.getUrlSegment = function(index) {
			var buffer = window.location.pathname.split('/');
	
			if(index < 0) {
				index = buffer.length - Math.abs(index);
			}
	
			return buffer[index];
		};
	
		/**
		 * Stops listening to a specific event
		 *
		 * @return this
		 */
		this.off = function(event, handler) {
			if(handler) {
				$(window).unbind(event, handler);
				return this;
			}
	
			$(window).unbind(event);
			return this;
		};
		
		/**
		 * Global event listener for the server
		 *
		 * @return this
		 */
		this.on = function(event, callback) {
			$(window).on(event, callback.bind(this));
			return this;
		};
	
		/**
		 * Global event listener for the server once
		 *
		 * @return this
		 */
		this.once = function(event, callback) {
			$(window).one(event, callback.bind(this));
			return this;
		};
		
		/**
		 * Returns the path given the key
		 *
		 * @param string
		 * @return this
		 */
		this.path = function(key, value) {
			if(value) {
				__paths[key] = value;
				return this;
			}
			
			return __paths[key];
		};
		
		/**
		 * Local redirect
		 *
		 * @param string path
		 * @return this
		 */
		this.redirect = function(path) {
			__chops.redirect(path);
			return this;
		};
		
		/**
		 * Global event trigger for the server
		 *
		 * @return this
		 */
		this.trigger = function() {
			var args = Array.prototype.slice.apply(arguments);
			var event = args.shift();
			$(window).trigger.apply($(window), [event, args]);
			return this;
		};
		
		/* Page Methods
		-------------------------------*/
		/**
		 * Adds a message on top
		 *
		 * @param string
		 * @param string
		 * @param string
		 * @return this
		 */
		this.addMessage = function(message, type, icon) {
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
		this.notify = function(title, message, type) {
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
		this.setBody = function(html) {
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
		this.setCrumbs = function(crumbs) {
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
		this.setHeader = function(header) {
			$('#header-title').html(header);
			return this;
		};
		
		/**
		 * Sets page subheader
		 *
		 * @param string
		 * @return this
		 */
		this.setSubheader = function(subheader) {
			$('#subheader-title').html(subheader);
			return this;
		};
		
		/**
		 * Sets page title
		 *
		 * @param string
		 * @return this
		 */
		this.setTitle = function(title) {
			$('head title').html(title);
			return this;
		};
		
		/* Bootstrap Methods
		-------------------------------*/
		/**
		 * Render Page
		 *
		 * @return this
		 */
		this.renderPage = function(callback) {
			callback = callback || $.noop;
			
			var self 		= this, 
				_menu		= this._menu,
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
				self.trigger('menu', _menu);
				//render head
				head = Handlebars.compile(head)({ right: true });
				
				//render menu
				menu = Handlebars.compile(menu)({ items: _menu });
				
				//render page
				$(document.body).html(Handlebars.compile(page)({
					head		: head,
					foot		: foot,
					menu		: menu
				}));
				
				//listen for a change in url
				self.on('client-request', function(e) {
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
				
				callback();
			});
			
			return this;
		};
		
		/**
		 * Starts up any packages
		 *
		 * @return this
		 */
		this.startPackages = function(callback) {
			callback = callback || $.noop;
			
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
					var packages = Array.prototype.slice.apply(arguments);
					
					for(var event, count = 0, i = 0; i < packages.length; i++) {
						this.on(packages[i].call(self), function() {
							count++;
							if(count === packages.length) {
								callback();
							}
						});
					}
				}.bind(this));
			}.bind(this));
			
			return this;
		};
		
		/**
		 * Starts client side session
		 *
		 * @param function
		 * @return this
		 */
		this.startSession = function(callback) {
			callback = callback || $.noop;
			
			if(!this.cookie('session')) {
				this.cookie('session', Date.now() + '' + Math.floor(Math.random() * 10000));
			}
			
			callback();
			
			return this;
		};
		
		/**
		 * Set paths
		 *
		 * @return this
		 */
		this.setLoader = function(callback) {
			callback = callback || $.noop;
			
			require.config({
				paths: { text: '/eve/require/text' },
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
			
			callback();
			
			return this;
		};
		
		/**
		 * Set paths
		 *
		 * @return this
		 */
		this.setPaths = function(callback) {
			callback = callback || $.noop;
			
			this.path('root'	, '/application')
				.path('config'	, '/application/config')
				.path('template', '/application/template')
				.path('package'	, '/application/package');
			
			callback();
			
			return this;
		};
		
		/**
		 * Set settings
		 *
		 * @return this
		 */
		this.setSettings = function(callback) {
			callback = callback || $.noop;
			
			var args = Array.prototype.slice.apply(arguments);
			
			//get settings
			return this.config('settings', function(settings) {
				__settings = settings;
				callback();
			}.bind(this));
		};
		
		/**
		 * Process to start server
		 *
		 * @return this
		 */
		this.startClient = function(callback) {
			callback = callback || $.noop;
			
			//that's all it takes to start the server
			__chops = $.chops();
			
			this.on('request', function(e, path, state) {
				this.trigger('client-request', state);
			}.bind(this));
			
			this.trigger('request', window.location.href, this.getState());
			
			callback();
			
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
	
	jQuery.eve.base.define({ Controller: controller });
})();