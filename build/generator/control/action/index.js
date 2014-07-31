define(function() {
    var Definition = function() {
		this.__construct.call(this);
	}, prototype = Definition.prototype;
	
	/* Public Properties
	-------------------------------*/
	prototype.title 		= '{PLURAL}';
	prototype.header 		= '{PLURAL}';
	prototype.subheader 	= 'CRM';
	prototype.crumbs 		= [{ icon: '{SLUG}', label: '{PLURAL}' }];
	prototype.data 			= {};
	
	prototype.start		= 0;
	prototype.page 		= 1;
	prototype.range 	= 25;
	
	prototype.template 	= controller.path('{SLUG}/template') + '/index.html';
	
	/* Private Properties
	-------------------------------*/
	var $ = jQuery;
	
	/* Loader
	-------------------------------*/
	prototype.__load = Definition.load = function() {
		return new Definition();
	};
	
	/* Construct
	-------------------------------*/
	prototype.__construct = function() {
		//reset data because of "pass by ref"
		this.data = {};
	};
	
	/* Public Methods
	-------------------------------*/
	prototype.render = function() {
		$.sequence()
			.setScope(this)
			.then(_setData)
			.then(_output)
			.then(_listen);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
		//use a batch call
		var batch = [], query = $.getUrlQuery();
		
		//1. get the list
		batch.push({ url: _getListRequest.call(this, query) });
		
		//2. get the active count
		batch.push({ url: _getActiveCountRequest.call(this, query) });
		
		{USE_ACTIVE_BATCH}
		
		$.post(
			controller.getServerUrl() + '/{SLUG}/batch', 
			JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
                //OUTPUT
				//NOTE: BULK GENERATE
				{CONTROL_OUTPUT_FORMAT}
				
				//add it to row
				rows.push(response.batch[0].results[i]);
            }
			
			var showing = query.mode || 'active';
			showing = showing.toUpperCase().substr(0, 1) + showing.toLowerCase().substr(1);
			
			//1. List
			//2. Active Count
			//3. Trash Count
			
			this.data = {
				showing : showing,
				rows	: rows,
				mode	: query.mode || 'active',
				keyword	: query.keyword || null,
				active	: response.batch[1].results,
				{USE_ACTIVE_DATA}
				range	: this.range };
            
			next();
		}.bind(this));
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);
			
			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);
			
			next();
		}.bind(this));
	};
	
	var _listen = function(next) {
		//listen to remove restore
		$('section.{SLUG}-list a.remove, section.{SLUG}-list a.restore').click(function(e) {
			e.preventDefault();
			$(this).parent().parent().remove();
		});
		
		$('section.{SLUG}-list  tbody input[type="checkbox"]').click(function() {
			setTimeout(function() {	
				var allChecked = true;
				$('section.{SLUG}-list tbody input[type="checkbox"]').each(function() {
					if(!this.checked) {
						allChecked = false;
					}
				});
				
				$('section.{SLUG}-list th input.checkall')[0].checked = allChecked;
			}, 1);
		});
		
		//listen to remove restore
		$('section.{SLUG}-list th input.checkall').click(function() {
			var checked = this.checked;
			$('section.{SLUG}-list tbody input[type="checkbox"]').each(function() {
				this.checked = checked;
			});
		});
		
		next();
	};
	
	var _getListRequest = function(request) {
		var query = {};
		
		query.filter 	= request.filter 	|| {};
		query.range		= request.range 	|| this.range;
		query.start 	= request.start 	|| this.start;
		
		if(request.page) {
			query.start = (request.page - 1) * this.range;
		}
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		{USE_ACTIVE_LIST}
		
		return '/{SLUG}/list?' + $.hashToQuery(query);
	};
	
	var _getActiveCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
	
		query.count = 1;
		{USE_ACTIVE_COUNT}
		
		return '/{SLUG}/list?' + $.hashToQuery(query);
	};
	
	{USE_ACTIVE_TRASH}
	
	/* Adaptor
	-------------------------------*/
	return Definition; 
});