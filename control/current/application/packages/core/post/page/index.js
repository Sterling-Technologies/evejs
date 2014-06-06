define(function() {
    var c = function() {}, public = c.prototype;
    
    /* Public Properties
    -------------------------------*/
    public.title        = 'Posts';
    public.header       = 'Posts';
    public.subheader    = 'CRM';
    public.crumbs       = [{ icon: 'post', label: 'posts' }];
    
    public.data     = {};
    public.template = controller.path('post/template') + '/index.html';
    
    /* Private Properties
    -------------------------------*/
    var $       = jQuery;
    var _api    = 'http://api.eve.dev:8082/post';
    
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
    
    /** 
     * Get data
     *
     * @param function callback
     * return this
     */
    public.getData = function(callback) {
        var self = this;

        $.getJSON(_api, function(response) {
            var i, rows = [];
            
            //if error
            if(response.error) {
                return;
            }
            //prepare template variables
            for(i in response.results) {
                var updated = new Date(response.results[i].updated);
                var format = controller.timeToDate(updated.getTime(), true, true);
                
                rows.push({
                    id      : response.results[i]._id,
                    title   : response.results[i].title,
                    status  : response.results[i].status,
                    main    : true,
                    updated : format });

            }
            
            //TODO: default data for now.
            self.data = {
                showing : 'Showing All',
                rows    : rows,
                action  : 'active',
                all     : 76,
                active  : 24,
                guests  : 12,
                trash   : 4,
                range   : 15
            };
            
            callback();
        });
        
        return this;
    };

    /** 
     * Output
     *
     * @param function callback
     * return this
     */
    public.output = function(callback) {

        controller
        .setTitle(this.title)
        .setHeader(this.header)
        .setSubheader(this.subheader)
        .setCrumbs(this.crumbs)
        .setBody(this.template, this.data);
        
        callback();
        
        return this;
    };
    
    /* Private Methods
    -------------------------------*/
    /* Adaptor
    -------------------------------*/
    return c.load(); 
});