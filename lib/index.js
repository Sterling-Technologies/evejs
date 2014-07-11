module.exports = (function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.root = __dirname + '/../';
	
	/* Private Properties
	-------------------------------*/
	var _eden = require('edenjs');
	
	var _events = new (require('events').EventEmitter);
	
	/* Construct
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	/**
	 * Global event listener for the server
	 *
	 * @return this
	 */
	public.listen = function(event, callback) {
		_events.on(event, callback);
		return this;
	};
	
	/**
	 * Global event once listener for the server
	 *
	 * @return this
	 */
	public.once = function(event, callback) {
		_events.once(event, callback);
		return this;
	};
	
	/**
	 * Global event once listener for the server
	 *
	 * @param string
	 * @return this
	 */
	public.setRoot = function(root) {
		this.root = root;
		return this;
	};
	
	/**
	 * Runs a command if it is an actual command
	 *
	 * @param string
	 * @param string
	 * @param string
	 * @return this
	 */
	public.run = function(local, action, section) {
		//default command is "eve watch all"
		action 	= action 	|| 'watch';
		section = section 	|| 'all';
		
		//just let the files be responsible for the actions if it exists
		
		//first check for the file
		var build = __dirname + '/../run/' + action + '-' + section + '.js';
		
		this.trigger(action + '-' + section + '-before', local, action, section);
		
		//if this is not a file
		if(!_eden('file', build).isFile()) {
			//give an error and return
			this.trigger('error', 'This is not a valid command', local, action, section);
			return;
		}
		
		//where is the config file ?
		var config = local + '/package.json';
		
		//if this is not a file
		if(!_eden('file', config).isFile()) {
			//give an error and return
			this.trigger('error', 'No package.json found. Try using npm init ?', local, action, section);
			return;
		}
		
		var config = require(config);
		
		//if no eve paths
		if(!config.eve || (!config.eve.server && !config.eve.control && !config.eve.web)) {
			//give an error and return
			this.trigger('error', 'eve is not set in package.json. We need paths so we know where to deploy.', local, action, section);
			return;
		}
		
		//require the file and let it do the rest
		require(build)(this, local, config);
		
		return this;
	};
	
	/**
	 * Global event trigger for the server
	 *
	 * @return this
	 */
	public.trigger = function() {
		_events.emit.apply(_events, arguments);
		return this;
	};
	
	/**
	 * Stops listening to a specific event
	 *
	 * @return this
	 */
	public.unlisten = function() {
		_events.removeAllListeners.apply(_events, arguments);
		return this;	
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return new c();
})();