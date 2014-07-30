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
	public.run = function(local, action) {
		//default command is "eve watch"
		action 	= action 	|| 'watch';
		
		//just let the files be responsible for the actions if it exists
		
		//first check for the file
		var script = __dirname + '/run/' + action + '.js';
		
		//if script is not a file
		if(!_eden('file', script).isFile()) {
			//give an error and return
			this.trigger('error', 'This is not a valid command', local, action);
			return;
		}
		
		this.trigger(action, local, action);
		
		//prepare the arguments
		var args = Array.prototype.slice.apply(process.argv);
		//[location] eve watch all
		args.shift(); //[location]
		args.shift(); //eve
		args.shift(); //watch
		
		//require the file and let it do the rest
		require(script)(this, local, args);
		
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
