var Data = (function() {


    function retrieveData(url) {

        return promise = new Promise(function(resolve, reject) {
            $.ajax(url, {

                success: function(data, status) {
                    resolve(data);
                }
            })
        })
    }



    function init() {

        let promises = [
            retrieveData('https://jsonplaceholder.typicode.com/users'), 
            retrieveData('https://jsonplaceholder.typicode.com/posts'),
            retrieveData('https://jsonplaceholder.typicode.com/comments')
        ];

        Promise.all(promises).then(function(data) {


            $(document).trigger('doc:getData', data); //send data to the PostListings module
    
        });


        

    }


    function events() {



    }


    function cacheDOM() {



    }


    return {

        init
    }








})();