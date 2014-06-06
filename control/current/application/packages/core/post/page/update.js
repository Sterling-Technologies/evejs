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
        label: 'posts' 
    }, {  label: 'Update post' }];
    
    public.data     = {};
    public.template = controller.path('post/template') + '/form.html';
    
    /* Private Properties
    -------------------------------*/
    var $           = jQuery;
    var _api        = 'http://api.eve.dev:8082/post/';
    var _listening  = false;
    
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
        .then(this.output)
        .then(this.listen);
        
        return this;
    };
    
     public.getData = function(callback) {
        var self = this;
        
        //set button to update

        //get post id
        var _id =  _api + window.location.pathname.split('/')[3];
        
        $.getJSON(_id, function(response) {
            
            //if error
            if(response.error) {
                return;
            }

            //store requested details in a variable for ease of access
            var post = response.results;
            
            //prepare all form templates
            forms = [
            'text!' + controller.path('post/template') +  'form/attributes.html',
            'text!' + controller.path('post/template') +  'form/categories.html',
            'text!' + controller.path('post/template') +  'form/copy.html',
            'text!' + controller.path('post/template') +  'form/publish.html',
            'text!' + controller.path('post/template') +  'form/revision.html',
            'text!' + controller.path('post/template') +  'form/tags.html'];

            //require form templates
            //assign it to main form
            require(forms, function(attributes, categories, copy, publish, revision,
            tags) {

                //load attributes form template
                self.data.attributes = Handlebars.compile(attributes)({
                    field : [
                        { name : 'name', value : 'value' } ]
                });
                
                //load copy form template
                self.data.copy = Handlebars.compile(copy)({
                    title  : post.title,
                    path   : post.path,
                    detail : post.detail,
                    active : post.active

                });

                //load publish form template
                self.data.publish = Handlebars.compile(publish)({
                    update        : 'update',
                    mode          : 'update',
                    status        : post.status,
                    visibility    : post.visibility,
                    status_option : [
                        { value : 'publish', name: 'Publish' },
                        { value : 'draft',   name: 'Draft' },
                        { value : 'review',  name: 'Review' }],
                    visibility_option : [
                        { value : 'public',  name: 'Public' },
                        { value : 'private', name: 'Private' }]
                });
            });
            
            callback(); 
        });

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

    /** 
     * check if we are listening
     * @param function
     * return this
     */
    public.listen = function(callback) {
        // if we are listening, we cant send data
        if(_listening){
            callback();
            return this;
        }

        //if not listening, submit form
        $('#body').on('submit', 'form.package-post-form', { scope: self }, _processUpdate);               
        //set listening to true
        _listening = true;
        callback();

        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _processUpdate = function(e) {
        console.log('updating');
        //prevent page from reloading
        e.preventDefault();

        //prepare form data
        var data = $('.package-post-form').serialize();

        //set api to update.
        _api = 'http://api.eve.dev:8082/post/update/';
        
        //get requested id
        _id  =  window.location.pathname.split('/')[3];

        //join update and query.
        _api = _api + _id;
       
       //update data on database
       $.post(_api, data, function(response) {
            //clear message status
             $('.msg').empty().remove();
            //display message status
            $('.package-post-form').append('<span class="msg label label-success arrowed"> Record successfully updated. </span>').show('slow');
       });
    };

    /* A-aptor
    -------------------------------*/
    return c.load();
});