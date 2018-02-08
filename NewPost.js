var NewPost = (function() {

    var postId = 100;
    var $newPostForm;


    function addPost(e) {

        e.preventDefault();
        e.stopPropagation();

        let $name = $(this).find("input[name=name]").val();
        let $title = $(this).find("input[name=title]").val();
        let $post = $(this).find('.newPost-body').val();



        if($name && $title && $post) { //only submit if values are filled in

            postId++;

            let postObj = {};

            postObj.name = $name;
            postObj.title = $title;
            postObj.postBody = $post;
            postObj.id = postId;
            postObj.comments = [];

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