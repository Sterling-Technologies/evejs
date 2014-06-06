define(function() {
    var c = function() {}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Create Post';
    public.header       = 'Create Post';
    public.subheader    = 'CRM';
    public.crumbs       = [{ 
        path: '/post',
        icon: 'post', 
        label: 'posts' 
    }, {  label: 'Create post' }];
    
    public.data     = {};
    public.template = controller.path('post/template') + '/form.html';
    
    /* Private Properties
    -------------------------------*/
    var $       = jQuery;
    var _api    = 'http://api.eve.dev:8082/post/create';
    
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
        
        var self = this,

        //store form templates path to array
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

            //load categories form template
            self.data.categories = Handlebars.compile(categories)({
                name     : 'name',
                children : 'child',
                template : 'template'
            });

            // //load copy form template
            // self.data.copy = Handlebars.compile(copy)({
            //     data : 'data'
            // });
            
            //load publish form template
            self.data.publish = Handlebars.compile(publish)({
                status : [
                    { value : 'publish', name: 'Publish' },
                    { value : 'draft',   name: 'Draft' },
                    { value : 'review',  name: 'Review' }],
                visibility : [
                    { value : 'public',  name: 'Public' },
                    { value : 'private', name: 'Private' }]
            });

            //load revision form template
            self.data.revision = Handlebars.compile(revision)({
                row : [ {id: '_id', created: '10/10/2014'}]
            });

            //load tags template
            self.data.tags = Handlebars.compile(tags)({
                field : 'tag'
            });

        });

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

        $('#body').on('submit', 'form.package-post-form', { scope: self }, _processSaveData);               
        callback();

        return this;
    };
    
    /* Private Methods
    -------------------------------*/
    var _processSaveData = function(e) {
        //prevent page from reloading
        e.preventDefault();

        //prepare form data
        var data = $(".package-post-form").serialize();

        //save data to database
        $.post(_api, data, function(response) {
            //clear message status
             $('.msg').empty().remove();
            //display message status
            $('.package-post-form').append('<span class="msg label label-success arrowed"> Record successfully saved. </span>').show('slow');
       });
    };
    
    /* Adaptor
    -------------------------------*/
    return c.load(); 
});