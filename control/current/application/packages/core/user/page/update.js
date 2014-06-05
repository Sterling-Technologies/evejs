define(function() {
    var c = function() {}, public = c.prototype;
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Update User';
    public.header       = 'Update User';
    public.subheader    = 'CRM';
    public.crumbs       = [{ 
        path: '/user/update',
        icon: 'user', 
        label: 'Users' 
    }, {  label: 'Update User' }];
    
    public.data     = {};
    public.template = controller.path('user/template') + '/form.html';
    
    /* Private Properties
    -------------------------------*/
    var $       = jQuery;
    var _api    = 'http://api.eve.dev:8082/user/detail/';
    
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
        
        //set button to update
        self.data.update = { update : 'update'};

        //get user id
        var _id =  _api + window.location.pathname.split('/')[3];
        
        $.getJSON(_id, function(response) {
            
            //if error
            if(response.error) {
                return;
            }

            //store requested details in a variable for ease of access
            var user = response.results;
            
            //prepare all form templates
            var forms = [
            controller.path('config') + '/countries.js',
            'text!' + controller.path('user/template') +  'form/basic.html',
            'text!' + controller.path('user/template') +  'form/company.html',
            'text!' + controller.path('user/template') +  'form/contact.html',
            'text!' + controller.path('user/template') +  'form/picture.html',
            'text!' + controller.path('user/template') +  'form/required.html',
            'text!' + controller.path('user/template') +  'form/tabs.html',
            'text!' + controller.path('user/template') +  'form/social.html'];

            //inlcude form templates to page
            //load templates and assign user details to its respective fields
            require(forms, function(countries, basic, company, contact, picture,
            required, tabs, social) {

                //basic form
                self.data.basic = Handlebars.compile(basic)({
                    user_birthdate : user.birthdate,
                    user_gender    : user.gender
                });

                //company form
                self.data.company = Handlebars.compile(company)({
                    user_company         : user.company[0].name,
                    user_job_title       : user.company[0].title,
                    user_company_street  : user.company[0].street,
                    user_company_city    : user.company[0].city,
                    user_company_state   : user.company[0].state,
                    //We need an array for country code and country name
                    //lets create an array inside company and store all country data on it
                    country              : countries,
                    user_company_postal  : user.company[0].postal,
                    user_company_phone   : user.company[0].phone,
                    user_company_email   : user.company[0].email
                });

                //contact form
                self.data.contact = Handlebars.compile(contact)({
                    user_website  : user.website,
                    user_phone    : user.phone[0].value
                });
                
                //picture form
                self.data.picture = Handlebars.compile(picture)({
                    user_photo : 'example.jpg'
                });

                //required form
                self.data.required = Handlebars.compile(required)({
                    user_name       : user.name,
                    user_slug       : user.username,
                    user_email      : user.email,
                    user_password   : '********',
                    user_confirm    : '********',
                    errors : {
                        user_name       : '',
                        user_slug       : '',
                        user_email      : '',
                        user_password   : '',
                        user_confirm    : ''
                    }
                });

                //tabs
                self.data.tabs = Handlebars.compile(tabs)({
                    request_uri : '',
                    path : 'example/path',
                    id : 'example_id',
                    tabs : [{
                        item : {
                            icon : 'example.icon',
                            label : 'example label'
                        }
                    }]
                });

                //social form
                self.data.social = Handlebars.compile(social)({
                    user_facebook : user.facebook,
                    user_twitter  : user.twitter,
                    user_google   : user.google,
                    user_linkedin : user.linkedin
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
        $('#body').on('submit', '.package-user-form', { scope: self }, _process);
        callback();

        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _process = function(e) {
        e.preventDefault();
        //console.log('test');
        _api = 'http://api.eve.dev:8082/user/update';
        _id  =  window.location.pathname.split('/')[3];

        console.log(_api + _id + '/' + self);
        //console.log(this, e.data.scope.title);
        $.getJSON(self, function(response) {
            console.log(response.result);
            //if error
            if(response.error) {
                return;
            }
        }); 
    };

    /* A-aptor
    -------------------------------*/
    return c.load();
});