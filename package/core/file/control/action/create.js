define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Upload File';
    public.header       = 'Upload File';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/file',
        icon: 'file', 
        label: 'Files' 
    }, {  label: 'Upload File' }];
	
    public.data     = {};
	
    public.template = controller.path('file/template') + '/form.html';
    
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
		//reset data because of "pass by ref"
		this.data = {};
	};
    
	/* Public Methods
    -------------------------------*/
    public.render = function() {
        var url = controller.getServerUrl() + '/file/create';
		
		//save data to database
		$.post(url, this.data.file, function(response) {
			response = JSON.parse(response);

			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'File successfully created!', 'success')
					//go to listing
					.redirect('/file');
				
				//no need to next since we are redirecting out
				return;
			}
			
			this.data.errors = response.validation || {};
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
	   
        return this;
    };

    /* Private Methods
    -------------------------------*/
    /* Adaptor
    -------------------------------*/
    return c; 
});