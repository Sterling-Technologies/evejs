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
    /**
     * Render
     *
     * @return this
     */
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
     * @return this
     */
     public.getData = function(callback) {
        var self = this;
        
        //set button to update
        self.data.update = { update : 'update' };

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
                    user_company         : user.company.name,
                    user_job_title       : user.company.title,
                    user_company_street  : user.company.street,
                    user_company_city    : user.company.city,
                    user_company_state   : user.company.state,
                    //We need an array for country code and country name
                    //lets create an array inside company and store all country data on it
                    country              : countries,
                    user_company_postal  : user.company.postal,
                    user_company_phone   : user.company.phone,
                    user_company_email   : user.company.email
                });

                //contact form
                self.data.contact = Handlebars.compile(contact)({
                    user_website  : user.website,
                    user_phone    : user.phone.value
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

    /**
     * Output
     *
     * @param function callback
     * @return this
     */
    public.output = function(callback) {
        var self = this;
   
        controller
        .setTitle(this.title)
        .setHeader(this.header)
        .setSubheader(this.subheader)
        .setCrumbs(this.crumbs)
        .setBody(self.template, self.data);
        $('#body').on('submit', '.package-user-form', { scope: self }, _processUpdate);
        callback();

        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _processUpdate = function(e) {
        //prevent page from reloading
        e.preventDefault();

        //prepare form data
        var data = $('.package-user-form').serialize();

        //set api to update.
        _api = 'http://api.eve.dev:8082/user/update/';
        
        //get requested id
        _id  =  window.location.pathname.split('/')[3];

        //join update and query.
        _api = _api + _id;
       
       //update data on database
       $.post(_api, data, function(response) {
            //clear message status
             $('.msg').empty().remove();
            //display message status
            $('.package-user-form').append('<span class="msg label label-success arrowed"> Record successfully updated. </span>').show('slow');
       });
    };

    /* A-aptor
    -------------------------------*/
    return c.load();
});