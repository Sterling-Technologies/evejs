module.exports = (function() { 
	var c = function(controller, socket) {
        this.__construct.call(this, controller, socket);
    }, public = c.prototype;

	/* Public Properties
    -------------------------------*/
    public.controller	= null;
    public.socket 		= null;
    
	/* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, socket) {
        return new c(controller, socket);
    };
    
	/* Construct
    -------------------------------*/
	public.__construct = function(controller, socket) {
		//set request and other usefull data
		this.controller = controller;
		this.socket  	= socket;
	};
	
	/* Public Methods
    -------------------------------*/
	public.render = function() {
		this.socket
			.of('/notification/create')
			.on('connection', function(socket) {
				socket.emit('data', { data : 'Notification Emit!' });
			});
	};
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();