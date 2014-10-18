module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	var separator = require('path').sep;
	
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._deploy	= null;
	this._settings 	= null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	/**
	 * Default callback just for processing errors
	 *
	 * @return this
	 */
	this.error = function(error) {
		if (error) {
			this.trigger('error', error);
		}
		
		return this;
	};
	
	/**
	 * Returns eve path
	 *
	 * @return string
	 */
	this.getEvePath = function(root) {
		return __dirname;
	};
	
	/**
	 * Returns build path
	 *
	 * @return string
	 */
	this.getBuildPath = function() {
		return process.env.PWD || process.cwd();
	};
	
	/**
	 * Returns the deploy path
	 *
	 * @return string
	 */
	this.getDeployPath = function() {
		return this._deploy;
	};
	
	/**
	 * Returns the project settings in build.json
	 *
	 * @return object
	 */
	this.getSettings = function() {
		if(this._settings === null
		&& this.File(this.getBuildPath() + '/build.json').isFile()) {
			this._settings = require(this.getBuildPath() + '/build.json') || null;
		}
		
		return this._settings || {};
	};
	
	/**
	 * Normalizes generated fields
	 *
	 * @param object schema
	 * @param bool true if a list of fields vs just one field
	 * @return object normalized schema
	 */
	this.normalize = function(field, fields) {
		if(fields) {
			for(var key in field) {
				if(field.hasOwnProperty(key)) {
					field[key] = this.normalize(field[key]);
				}
			}
			
			return field;
		}
		
		var normal = { type: field.type || 'string' };
		
		normal.field 	= field.field 	|| ['text'];
		normal.valid 	= field.valid 	|| [];
		normal.label 	= field.label 	|| '';
		normal.holder 	= field.holder 	|| '';
		normal.search 	= field.search 	|| false;
		
		if(field.type === 'file') {
			normal.field = 'file';
			normal.multiple = field.multiple || false;
		}
		
		if(field.field === false) {
			normal.field = false;
		} else if(typeof normal.field === 'string') {
			normal.field = [normal.field];
		}
		
		if(typeof normal.valid === 'string') {
			normal.valid = [[normal.valid]];
		}
		
		if(typeof field.default !== 'undefined') {
			normal.default = field.default;
		}
		
		if(normal.default === null || normal.default === 'NULL') {
			normal.default = 'NULL'
		} else if(normal.field === 'int' && typeof normal.default !== 'undefined') {
			normal.default = parseInt(normal.default) || '0';
			normal.default += '';
		} else if(normal.field === 'float' && typeof normal.default !== 'undefined') {
			normal.default = parseFloat(normal.default) || '0.00';
			normal.default += '';
		} else if(normal.field === 'boolean' && typeof normal.default !== 'undefined') {
			normal.default = !!normal.default ? '1': '0';
		} else if(normal.field === 'datetime' 
		&& (normal.default === 'now' 
		|| normal.default === 'now()'
		|| normal.default === 'CURRENT_TIMESTAMP')) {
			normal.default = 'CURRENT_TIMESTAMP';
		} else if(typeof normal.default === 'string') {
			normal.default = "'" + normal.default + "'";
		}
		
		var valid = [];
		
		for(var i = 0; i < normal.valid.length; i++) {
			if(normal.valid[i] instanceof Array) {
				valid.push(normal.valid[i]);
				continue;
			}
			
			valid.push([normal.valid[i]]);
		}
		
		normal.valid = valid;
		
		if(field.options instanceof Array) {
			normal.options = [];
			for(i = 0; i < field.options.length; i++) {
				if(typeof field.options[i] === 'string') {
					normal.options.push({
						value: field.options[i],
						label: field.options[i][0].toUpperCase() + field.options[i].substr(1)
					});
					
					continue;
				}
				
				normal.options.push(field.options[i]);
			}
			
			if(normal.type !== 'file') {
				valid.push(['one', normal.options]);
			}
		}
		
		return normal;
	}
	
	/**
	 * Fixes path
	 *
	 * @param string
	 * @return string
	 */
	this.path = function(path) {
		return path.replace(/\//g, separator);
	};
	
	/**
	 * Sets the current deploy path
	 *
	 * @param string
	 * @return this
	 */
	this.setDeployPath = function(path) {
		this._deploy = this.path(path);
		
		//if destination starts with a .
		if(this._deploy.indexOf('.') === 0) {
			//destination is relative to local
			this._deploy = this.getBuildPath() + this._deploy.substr(1);
		}
		
		return this;
	};
	
	/**
	 * Sets settings into local build.json
	 *
	 * @param object
	 * @param function
	 * @return this
	 */
	this.setSettings = function(settings, callback) {
		this._settings = settings;
		
		this.File(this.getBuildPath() + '/build.json').setData(settings, callback);
		return this;
	};
	
	/**
	 * Runs a command if it is an actual command
	 *
	 * @param string
	 * @return this
	 */
	this.run = function(command) {
		//default command is "eve watch"
		action 	= command.shift() || 'watch';
		
		//just let the files be responsible for the actions if it exists
		
		//first check for the file
		var script = __dirname + '/eve/run/' + action + '.js';
		
		//if script is not a file
		if(!this.File(script).isFile()) {
			//give an error and return
			this.trigger('error', 'This is not a valid command');
			return;
		}
		
		this.trigger(action, command);
		
		//require the file and let it do the rest
		require(script)(this, command);
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).register('eve').singleton();