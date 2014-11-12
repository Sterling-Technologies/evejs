define(function() {
	return function() {
		//set paths
		this.path('batch', this.path('package') + '/batch');	
		
		//load the factory
		require([this.path('batch') + '/factory.js'], function(factory) {
			//add it to the global factory
			this.package('batch', factory);
			
			this.trigger('batch-init');
		}.bind(this));
		
		return 'batch-init';
	};
});