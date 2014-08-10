define(function() {
    var Definition = function() {
		this.__construct.call(this);
	}, prototype = Definition.prototype;
	
	/* Public Properties
	-------------------------------*/
	prototype.title 		= '{{plural}}';
	prototype.header 		= '{{plural}}';
	prototype.subheader 	= 'CRM';
	prototype.crumbs 		= [{ icon: '{{slug}}', label: '{{plural}}' }];
	prototype.data 			= {};
	
	prototype.start		= 0;
	prototype.page 		= 1;
	prototype.range 	= 25;
	
	prototype.template 	= controller.path('{{slug}}/template') + '/index.html';
	
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
		
		{{#if use_active ~}}
		//3. get the trash count
		batch.push({ url: _getTrashCountRequest.call(this, query) });
		{{~/if}}
		
		$.post(
			controller.getServerUrl() + '/{{slug}}/batch', 
			JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
				//OUTPUT
				//NOTE: BULK GENERATE
				{{#loop fields ~}}
				{{~#when value.type '==' 'date' ~}}
				response.batch[0].results[i].{{../key}} = $.timeToDate((new Date(response.batch[0].results[i].{{../key}})).getTime());
				{{/when~}}
				{{~#when value.type '==' 'boolean' ~}}
				response.batch[0].results[i].{{../key}} = response.batch[0].results[i].{{../key}} ? 'Yes': 'No';
				{{/when~}}
				{{~/loop}}
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
				{{#if use_active ~}}
				trash	: response.batch[2].results,
				{{/if~}}
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
		$('section.{{slug}}-list a.remove, section.{{slug}}-list a.restore').click(function(e) {
			e.preventDefault();
			$(this).parent().parent().remove();
		});
		
		$('section.{{slug}}-list  tbody input[type="checkbox"]').click(function() {
			setTimeout(function() {	
				var allChecked = true;
				$('section.{{slug}}-list tbody input[type="checkbox"]').each(function() {
					if(!this.checked) {
						allChecked = false;
					}
				});
				
				$('section.{{slug}}-list th input.checkall')[0].checked = allChecked;
			}, 1);
		});
		
		//listen to remove restore
		$('section.{{slug}}-list th input.checkall').click(function() {
			var checked = this.checked;
			$('section.{{slug}}-list tbody input[type="checkbox"]').each(function() {
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
		
		{{#if use_active ~}}
		switch(request.mode || 'active') {
			case 'active':
				query.filter.active = 1;
				break;
			case 'trash':
				query.filter.active = 0;
				break;
		}
		
		{{/if~}}
		return '/{{slug}}/list?' + $.hashToQuery(query);
	};
	
	var _getActiveCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
	
		query.count = 1;
		{{#if use_active ~}}
		query.filter.active = 1;
		
		{{/if~}}
		
		return '/{{slug}}/list?' + $.hashToQuery(query);
	};
	
	{{#if use_active ~}}
	var _getTrashCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count = 1;
		query.filter.active = 0;
		
		return '/{{../slug}}/list?' + $.hashToQuery(query);
	};
	
	{{/if~}}
	/* Adaptor
	-------------------------------*/
	return Definition; 
});