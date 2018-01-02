var PostListings = (function() {

    var usersRaw, postsRaw, commentsRaw, $pages, $Container, $commentForm,
    $currentPost, $commentsNum, $currentComments, $sameComment, $post, $title, $newPostForm;

    var postIncrement = 101;

    var reRender = 0;

    var posts = []; //data model for combined data




    function createTemplate(input, posts) {

        let templateStr = $(input).html(); //create string
        let template = Handlebars.compile(templateStr); //create template

        return template({posts}); //return html with injected data    
    }


    function renderTemplate(input) {

    }


    function combineData(usersRaw, postsRaw, commentsRaw) {

        
        return promise = new Promise(function(resolve, reject) {
       
            postsRaw.forEach(function(post) { //cycle through each post

                let postObj = {};
                postObj.title = post.title;
                postObj.postBody = post.body;
                postObj.id = post.id;
                postObj.comments = [];


                usersRaw.forEach(function(user) {

                    if(user.id === post.userId) {

                        postObj.name = user.name
                    }
                })


                commentsRaw.forEach(function(comment) {

                    let commentsObj = {};

                    if(comment.postId === post.id) {
                        commentsObj.commentor = comment.name;
                        commentsObj.commentBody = comment.body;

                        postObj.comments.push(commentsObj);
                    }
                })

                posts.push(postObj);

            });

            resolve(); //posts cycle is all complete. resolve promise
        });
    }


    function pagination(posts) {
            

        let pages = [1];
        let page = 1;
        let perPage = 15;
        let pageCnt = 0;
        let postsLength = posts.length;


        posts.forEach(function(post) {

            if(pageCnt === perPage) { //reset for next page
                pageCnt = 1;
                page++;
                post.page = page; //set current post to the new page
                pages.push(page);

            } else { //same page
                post.page = page; //put page on the post object. will get injected using handlebars as data-page={{page}}
                pageCnt++;
            }
        })

        // createPages(pages)
        return pages;

        //return pages and then run createPages after the dom injection
    }


    function createPages(input) {

        let pages = document.getElementsByClassName('pages')[0];

        let element;
        let text;

        input.forEach(function(page) {
            
            element = document.createElement('div');
            element.classList.add('page');
            text = document.createTextNode(page);
            element.appendChild(text);
            pages.appendChild(element);
        })
    }


    function displayPageOne(posts) { //display the first page albums on initial load


        posts = Array.from(posts);

        posts.forEach(function(post) {

            // console.log(album);
            if (Number(post.getAttribute('data-page')) !== 1) {
                post.style.display = 'none';
            };
        })
    }


    function displayPage(e) {

        e.preventDefault();

        if($currentComments) {
            $currentComments.toggle(); //when going to new page, hide the comments from the post on that prev page
        }


        if(e.target.classList.contains('page')) {

            let page = Number(e.target.innerHTML); //get page number

            document.querySelectorAll('.post-container').forEach(function(post) { //cycle through each post

                // console.log(album);
                if (Number(post.getAttribute('data-page')) !== page) { //if it doesnt equal the number, then hide it.
                    post.style.display = 'none';
                } else {
                    post.style.display = 'flex';
                }
            })

        }     
    }


    function clickPost(e) {

        e.preventDefault();
      
        if($currentPost) { // a post is already opened 

            if($currentComments && ($currentComments.css('display') !== 'none')) { //comment sections is open from prev clicked post

                $currentComments.toggle(); //hide the comments from the post  
            }

            $currentPost.toggle(); //hide the previous post
            $currentPost = $(e.target).next(); //set current clicked post 
            $currentPost.slideDown(); //slide post into view

        } else { //no post clicked yet, open up current clicked

            $currentPost = $(e.target).next(); //set current post clicked
            $currentPost.slideDown(); //slide post into view
        }  
    }


    function clickComments(e) {

        if(e.target === $sameComment) { //same comment was clicked on open post

           $currentComments.toggle("slow"); //make the transition smooth. either close or expand comments
        }
        
        else { // open up the comment for the post

            $currentComments = $(e.target).parent().parent().next();
            $currentComments.slideDown();
        }

        $sameComment = e.target;
    }


    function addComment(e) {

        e.preventDefault();
        e.stopPropagation();

        let $name = $(this).find("input[name=name]").val();
        let $comment = $(this).find('.leave-comment').val();
        let postID = $(this).data('postid');
        let $parent = $(this).parent();


        if($name && $comment) {

            let $newComment = $('<div/>')
                .addClass('comment');
            
            let $commentor = $('</p>')
                .addClass('commentor')
                .text($name);

            let $commentBody = $('<p/>')
                .addClass('commentBody')
                .text($comment);
            
            $newComment.append($commentor).append($commentBody);
            $($parent).find('form:last-child').before($newComment);

        }


        let $commentsNum = $(this).parent().prev().children().last().children().last(); //get the element for Comments()

        //find correct post and add comment to object model
        posts.filter(post => post.id === postID)
            .forEach(post => {
                
                post.comments.push({commentor: $name, commentBody: $comment});

                $commentsNum.html(`<br> Comments(${post.comments.length})`);

                //pass data to activity feed 
                $(document).trigger('doc:addToFeed', [post, $comment, $name]);

                //reset form fields
                $(this).find("input[name=name]").val("");
                $(this).find('.leave-comment').val("");
            });
    }


    function render() {

        console.log(posts);
        let html = createTemplate('#users-template', posts);
        $(document.body).append(html);        
    }


    function createNewPosting(post) {


        let pages = pagination(posts); //redo pagination data attributes since new post added
 
        let postLength = posts.length;
        let currentPostNum = posts.length;

        let $postContainer = $('<div/>')
            .addClass('post-container')
            .attr('data-page', post.page)

        let $title = $('<h4/>')
            .addClass('title')
            .text(post.title)

        let $postNumber = $('<span/>')
            .addClass('postNumber')
            .text(`${currentPostNum}/${postLength}`)

        $title.append($postNumber);
        $postContainer.append($title);
        $Container.append($postContainer);

        let $post = $('<div/>')
            .addClass('post')

        let $postBody = $('<p/>')
            .addClass('postBody')
            .text(post.postBody)

        let $postName = $('<p/>')
            .addClass('name')
            .html(post.name)

        let $commentsNum = $('<span/>')
            .addClass('commentsNum')
            .html(`<br> Comments(${post.comments.length})`)


        $post.append($postBody);
        $postName.append($commentsNum);
        $post.append($postName);
        $postContainer.append($post)

        //comments section
        let $comments = $('<div/>')
            .addClass('comments')


        let $form = $('<form/>')
                .addClass('commentForm')
                .data('postid', post.id)

        let $nameInput = '<input type="text>" placeholder="name" name="name"><br>';
        let $textArea = '<textarea class="leave-comment"></textarea><br>';
        let $submit = '<input type="submit">';

        $postContainer.append($comments);
        $form.append($nameInput).append($textArea).append($submit);
        $comments.append($form);


        //add events and re-do pagination
        $('.pages').empty();
        createPages(pages); //create pages

        $commentsNum.on('click', clickComments);
        $form.on('submit', addComment);
        $postContainer.css('display', 'none');
        $title.on('click', clickPost);
        updatePostNumber();

    }
    

    function updatePostNumber() {

        let $elements = $('.postNumber');

        $elements.each(function(index) {
            $(this).text(`${index+1}/${posts.length}`);
        });
    }


    function addPostToObject(post) {

        posts.push(post);
    }







    //custom events
    $(document).on('doc:getData', function(e, ...data) {
    
        usersRaw = data[0]; 
        postsRaw = data[1];
        commentsRaw = data[2];

        init(); //initalize module once data is received
    });


    $(document).on('doc:addToListing', function(e, ...data) {


        addPostToObject(data[0]);
        createNewPosting(data[0]);

    });



    Handlebars.registerHelper('comments', function (context, options) {

        var out = '';
        for (var i = 0, ii = context.length; i < ii; i++) {

            out += `<div class="comment">${options.fn(context[i])}</div>`;   
        }

        return out;
    });


    Handlebars.registerHelper('addOne', function (val) {
        return val + 1;
    });


    
    


    function init() {

        console.log('PostListings initialized');

        let promise = combineData(usersRaw, postsRaw, commentsRaw);

        promise.then(function(data) {


                let pages = pagination(posts);
                render(); //render data
                createPages(pages); //create pages
                displayPageOne($('.post-container'));  
                
                cacheDOM();
                events();
                $post.hide();    
                NewPost.init();           
        });
    }

    function cacheDOM() {
        $pages = $('.pages');
        $Container = $('.container');
        $commentsNum = $('.commentsNum');
        $post = $('.post');
        $commentForm = $('.commentForm');
        $title = $('.title');
        $newPostForm = $('.newPostForm');

    }

    
    function events() {
        $pages.on('click', displayPage);
        $commentForm.on('submit', addComment);
        $title.on('click', clickPost);
        $commentsNum.on('click', clickComments);
        
    }


    return {
        init
    }


})()