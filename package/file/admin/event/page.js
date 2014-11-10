define(function() {
	return function() {
		var controller = this, $ = jQuery;
		
		$('<input class="file-input hide" '
		+ 'type="file" />')
		.appendTo(document.body).change(function() {
			var request 	= controller.getState();
			var settings 	= { file: Array.prototype.slice.apply(this.files) };
			controller.trigger('file-create', settings, request);
		});
		
		
		$('#body').on('click', 'a', function(e) {
			if(this.href.replace(window.location.origin, '').indexOf('/file/create') === 0) {
				e.preventDefault();
				e.originalEvent.stop = true;
				
				var request = controller.getState();
				var state = $.chops().getState(this.href);
				//hijack the request
				request.url		= state.url;
				request.path	= state.path;
				request.query	= state.query;
				request.json	= state.json;
				request.method	= state.method; 
				request.data	= state.data;
				request.serial	= state.serial;
				request.files	= state.files;
				request.variables = [];
				
				//we need to manually get the variables
				var pathArray = request.path.split('/');
				
				do {
					request.variables.unshift(pathArray.pop());
				} while(pathArray.join('/') !== '/file/create');
				
				$('input.file-input').click();
			}
		});
		
		$('#sidebar').on('click', 'a', function(e) {
			if(this.href.replace(window.location.origin, '').indexOf('/file/create') === 0) {
				e.preventDefault();
				e.originalEvent.stop = true;
				$('input.file-input').click();
			}
		});
	};
});