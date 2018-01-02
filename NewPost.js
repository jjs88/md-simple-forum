var NewPost = (function() {

    var postIncrement = 100;
    var $newPostForm;


    function addPost(e) {

        e.preventDefault();
        e.stopPropagation();

        let $name = $(this).find("input[name=name]").val();
        let $title = $(this).find("input[name=title]").val();
        let $post = $(this).find('.newPost-body').val();



        if($name && $title && $post) {

            postIncrement++;

            let postObj = {};

            postObj.name = $name;
            postObj.title = $title;
            postObj.postBody = $post;
            postObj.id = postIncrement;
            postObj.comments = [];

            console.log('post getting triggered');
            $(document).trigger('doc:addToListing', postObj);

            //reset form fields
            $(this).find("input[name=name]").val("");
            $(this).find("input[name=title]").val("");
            $(this).find('.newPost-body').val("");


        }
    }


    function init() {
        cacheDOM();
        events();
    }


    function cacheDOM() {
        $newPostForm = $('.newPostForm');
    }

    function events() {
        $newPostForm.on('submit', addPost);
    }



    return {
        init
    }




})();