module.exports = function(controller, request, response) {
    //Converting request messages to JSON
    var batch = JSON.parse(request.message)
    //Loop the all the batch request
    for(var i = 0; i < batch.length; i++){
        //Check for the batch method
        switch(batch[i].method.toUpperCase()){
            case 'POST':
                require('./create')(controller, request, response); return;
            break;
            case 'DELETE': 
            case 'PUT':
                if ( batch[i].method.toUpperCase() == 'DELETE'){
                    require('./remove')(controller, request, response); return;
                } else if ( batch[i].method.toUpperCase() == 'PUT' ){
                    require('./update')(controller, request, response); return;
                } 
                require('./detail')(controller, request, response);
                return;
            break;
            default: require('./list')(controller, request, response);
        }
    }

    //Array that will contain the request message
    var results = [];
    controller.once('user-action-response', function(request, response) {
        //All results will be push to the array results
        results.push(response.message);

        //If results is equal to request query
        if(results.length == request.query.batch.length){
            //All batch results will be JSON stringify
            response.message = JSON.stringify({ batch:results })

            //Been trigger to the user action
            controller.server.trigger('user-action-response', request, response);
        }
    });
}