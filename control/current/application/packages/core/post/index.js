controller
//when the application is initialized
.listen('init', function() {
    //set paths
    controller
        .path('post'            , controller.path('packages') + '/core/post/')
        .path('post/page'       , controller.path('packages') + '/core/post/page/')
        .path('post/template'   , controller.path('packages') + '/core/post/template/');
})
//add template helpers
.listen('engine', function() {
    //set pagination
    Handlebars.registerHelper('pagination', function (total, range, options) {
        //get current query
        var query       = {},
            current     = 1,
            queryString = window.location.href.split('?')[1];
        
        //if we have a query string
        if(queryString && queryString.length) {
            //make it into an object
            query = controller.queryToHash(queryString);
            //remember the current page
            current = query.page || 1;
        }
        
        //how many pages?
        var pages = Math.ceil(total / range);
        
        //if there is one or less pages
        if(pages < 2) {
            //there is no need for pagination
            return null;
        }
        
        var html = '';
        for(var i = 0; i < pages; i++) {
            query.page = i + 1;
            html += options.fn({
                page    : i + 1,
                active  : current == (i + 1),
                query   : controller.hashToQuery(query) });
        }
          
        return html;
    });
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
    //add our menu item
    menu.push({
        path    : '/post',
        icon    : 'Post',
        label   : 'Posts',
        children: [{
            path    : '/post/create',
            label   : 'Create Post' }]
        });
})
//when a url request has been made
.listen('request', function() {
    //if it doesn't start with post
    if(window.location.pathname.indexOf('/post') !== 0) {
        //we don't care about it
        return;
    }
    
    //router -> action
    var page = 'index';
    switch(window.location.pathname.split('/')[2]) {
        case 'create':
            page = 'create';
            break;
        case 'update':
            page = 'update';
            break;
        case 'remove':
            page = 'remove';
            break;
    }
    
    page = controller.path('post/page') + page + '.js';
    
    //load up the action
    require([page], function(page) {
        page.render();
    });
});