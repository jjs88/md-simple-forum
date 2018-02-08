var PostListings = (function() {

    var usersRaw, postsRaw, commentsRaw, $pages, $Container, $commentForm,
    $currentPost, $commentsNum, $currentComments, $sameComment, $post, $title, $newPostForm,
    postsTemplate, postTemplate;

    var posts = []; //data model for combined data


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

            let comment = {commentor: $name, commentBody: $comment}

            injectComment(commentTemplate, comment, $parent.find('form:last-child'));


            let $commentsNum = $(this).parent().prev().children().last().children().last(); //get the element for Comments()
  
            //find correct post and add comment to object model
            posts.filter(post => post.id === postID)
                .forEach(post => {
                    
                    post.comments.push({commentor: $name, commentBody: $comment});
    
                    $commentsNum.html(`Comments(${post.comments.length})`);
    
                    //pass data to activity feed 
                    $(document).trigger('doc:addToFeed', [post, $comment, $name]);
    
                    //reset form fields
                    $(this).find("input[name=name]").val("");
                    $(this).find('.leave-comment').val("");
                });

        }

    }


    function render() {  
        injectPosts(postsTemplate, posts, $Container);     
    }


    function createNewPosting(post) {

        let pages = pagination(posts); //redo pagination data attributes since new post added

        injectPost(postTemplate, post, $Container);
        
        //add events and re-do pagination
        $('.pages').empty();
        createPages(pages); //create pages

        //get last post container to add the events
        let $commentsNum = $('.commentsNum').last();
        let $commentForm = $('.commentForm').last();
        let $postContainer = $('.post-container').last();
        let $title = $('.title').last();

        $commentsNum.on('click', clickComments);
        $commentForm.on('submit', addComment);
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

    /*************************************************** */
    //CUSTOM EVENTS
    /*************************************************** */

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


    /*************************************************************** */
    //HANDLEBARS TEMPLATES / DATA INJECTION
    /**************************************************************** */

    function createTemplate(temp) {

        let templateStr = $(temp).html(); //create string
        let template = Handlebars.compile(templateStr); //create template
        return template; //return template to inject data into
    }


    function injectPosts(template, posts, element) { //used for collection of users
        element.append(template({posts}));
        // return template({users});
    }

    function injectPost(template, post, element) { //used for collection of users
        element.append(template(post));
        // return template({users});
    }

    function injectComment(template, comment, element) {
        element.before(template(comment));
    }


    /******************************************** */
    // HANDLEBARS HELPERS/PARTIALS
    /******************************************** */

    Handlebars.registerHelper('comments', function (comments, options) {

        var out = '';
        for (var i = 0, ii = comments.length; i < ii; i++) {

            out += `<div class="comment">${options.fn(comments[i])}</div>`;   
        }

        return out;
    });


    Handlebars.registerHelper('addOne', function (val) { return val + 1; });


    Handlebars.registerHelper('totalPosts', function() { return posts.length; })


    var postsPartial = ` <div class="post-container" data-page="{{page}}">
        <h4 class="title">{{title}} 
            <span class="postNumber">{{addOne @index}}/{{totalPosts}}</span>
        </h4>
        <div class="post">
            <p class="postBody">{{postBody}}</p>
            <p class="name">By {{name}}
            <br><span class="commentsNum">Comments ({{comments.length}})</span>
            </p>
        </div>
        <div class="comments">
            {{#comments comments}}
            <p class="commentor">{{commentor}}</p>
            <p class="commentBody">{{commentBody}}</p>
            {{/comments}}
            <form class="commentForm" data-postid="{{id}}">
                <input type="text>" placeholder="name" name="name"><br>
                <textarea class="leave-comment" placeholder="type your comment..."></textarea><br>
                <input type="submit">                
            </form>
        </div>
    </div>`


    Handlebars.registerPartial('postsPartial', postsPartial);


    
    


    function init() {

        //create templates 
        postsTemplate = createTemplate('#posts-template');
        postTemplate = createTemplate('#post-template');
        commentTemplate = createTemplate('#comment-template');

        let promise = combineData(usersRaw, postsRaw, commentsRaw);

        promise.then(function(data) {


                let pages = pagination(posts);
                cacheDOM();
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