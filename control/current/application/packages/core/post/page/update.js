define(function() {
    var c = function() {}, public = c.prototype;
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Update Post';
    public.header       = 'Update Post';
    public.subheader    = 'CRM';
    public.crumbs       = [{ 
        path: '/post/update',
        icon: 'post', 
        label: 'Posts' 
    }, {  label: 'Update Post' }];
    
    public.data     = {};
    public.template = controller.path('post/template') + '/form.html';
    
    /* Private Properties
    -------------------------------*/
    var $       = jQuery;
    var _api    = 'http://api.eve.dev:8082/user/';
    
    /* Loader
    -------------------------------*/
    public.__load = c.load = function() {
        return new c();
    };
    
    /* Construct
    -------------------------------*/
    /* Public Methods
    -------------------------------*/
    public.render = function() {
        $.sequence().setScope(this)
        .then(this.getData)
        .then(this.output);
        
        return this;
    };
    
     public.getData = function(callback) {
        var self = this;
    
        callback(); 
        return this;
    };
    
    public.output = function(callback) {
        var self = this;
   
        controller
        .setTitle(this.title)
        .setHeader(this.header)
        .setSubheader(this.subheader)
        .setCrumbs(this.crumbs)
        .setBody(self.template, self.data);

        callback();

        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _processUpdate = function(e) {
        //prevent page from reloading
        e.preventDefault();
    };

    /* A-aptor
    -------------------------------*/
    return c.load();
});