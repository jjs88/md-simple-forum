var ActivityFeed = (function() {



    function addCommentToFeed(post, comment, name) {

        let $feedItem = $('<div/>')
            .addClass('feedItem')
            .data('recentActivity', 'test')

        let $comment = $('</p>')
            .addClass('activityComment')
            .text(comment)

        let $timeStamp = $('<span/>')
            .addClass('timestamp')

        let $title = $('<p/>')
            .addClass('commentPost')
            .text(post.title);

        let $commentor = $('<span/>')
            .addClass('activityCommentor')
            .text(name + ' says:')
            

        $feedItem.append($commentor);
        $feedItem.append($comment);
        $feedItem.append($title);

        $comment.append($timeStamp);

        $feedItem.insertAfter('.activity-title');

    
        TimeAgo.init($timeStamp);
    }





    //custom events
    $(document).on('doc:addToFeed', function(e, ...data) {

        let post = data[0];
        let comment = data[1];
        let name = data[2];

       addCommentToFeed(post, comment, name);
    
    });



    // function init() {

    //     cacheDOM();
    // }

    // function cacheDOM() {

    // }


    // return {
    //     init
    // }




})();