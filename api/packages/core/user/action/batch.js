module.exports = function(controller, request, response) {
    //Batch file called
    response.batch = true;
    //Converting request messages to JSON
    var batch = JSON.parse(request.message);
    //Loop the all the batch request
    for(var i = 0; i < batch.length; i++){
        //Check for the batch method
        switch(batch[i].method.toLowerCase()){
            case 'create':
                require('./create')(controller, request, response);
                break;
            case 'remove':
                require('./remove')(controller, request, response);
                break;
            case 'update':
                require('./update')(controller, request, response);
                break;
            case 'detail':
                require('./detail')(controller, request, response);
                break;
            case 'list':
                require('./list')(controller, request, response);
                break;
            case 'address':
                require('./address')(controller, request, response);
                break;
            case 'phone':
                require('./phone')(controller, request, response);
                break;
            case 'photo':
                require('./photo')(controller, request, response);
                break;

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
            controller.trigger('user-action-response', request, response);
        }
    });
}