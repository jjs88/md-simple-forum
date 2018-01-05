## Simple Forum

[live](https://jjs88.github.io/md-simple-forum)

This project utilizes a combination of Jquery with vanilla JS. I used handlebars.js to render the initial data. 

Since I didn't use an actual database, I took the raw data from users/posts/comments ajax call
and combined them into a single object that fit what I needed as a model for the web page. After this, I was able to create my template and necessary block helpers to render the data.

I made use of the data attribute so that I could attach the post ID in each post listing to the comments container. This would be helpful when I needed to add another comment for a post. I could then take this ID to find the correct post in my posts object and add the new comment.

Another piece that I needed to get creative with was the pagination for displaying only a certain number of
posts per page. Again, I used a data attribute to put on the page value for each post. This would be done in my pagination function where I passed in the posts object and cycle through each post, and based on my pagination logic, I would set the page property for eachpost to be the correct page number. This number would then get set to the data-page attribute value when handlebars rendered the template.

After the page is rendered, another function was called that only displayed the posts that had a data-page=1, since this would be the first page. All the other posts would be ``display="none"``.

When a user makes a comment on the page, we grab all the form values, and also the post ID that is attached to the comments section. We then 
perform a "lookup" using the filter method on the posts object to grab the post id that equals the one attached to the comments section. After getting the correct post, we add the new comment onto the comments array.

Control is then passed to the ActivityFeed module where we add the comment to the right side real time activity feed. A trigger passes the post, the comment, and the name of the commentor to the module. An element is created to hold the feed details and then appended to the feed. After this, the span that has the class ``timeStamp`` is passed to the jquery plugin `timeago.js`. 

This jquery plugin is a class that handles the updating of the time stamp for each comment in the activity feed. Moment.js is used here to make use of the `fromNow` function. The class gets instantiated with the `timeStamp` element. There are two methods for the class `getTime` and `render`. The `getTime` function gets the current time and it gets saved as a property on the class. Afterwords, `render` is called, which will update the span element with the time ago Moment.js value. The `render` function will get called every 60 seconds to update the html on the page. 

So, everytime a new comment is made, this timeago function will get instantiated and every 60 seconds, due to using `setTimeOut`, will update the span element text with how long ago it was posted.

On the left side of the web page, you can also add a new post. This is where things got a little tricky without using a frontend framework that would enable data binding. When someone makes a new post, the post will get appended to the DOM, at the end of the main container for the post listings. Along with this, all the events for clicking and adding new comments need to be added to the new post. 

Also, all the other posts need to be updated to reflect the total post count. Updating the post count was actually pretty easy since I just used the posts object to get the length, and then I cycled through each posts span element with the number and updated the html to reflect this. I also had to add +1 so that the number starts at 1 instead of 0.

````
  function updatePostNumber() {

        let $elements = $('.postNumber');

        $elements.each(function(index) {
            $(this).text(`${index+1}/${posts.length}`);
        });
    }
````

Similar to the posts, when someone makes a comment on a post, the total comments number has to reflect this. Again, heavy DOM manipulation had to be done to achieve this:

````
 let $commentsNum = $(this).parent().prev().children().last().children().last(); //get the element for Comments()

        //find correct post and add comment to object model
        posts.filter(post => post.id === postID)
            .forEach(post => {
                
                post.comments.push({commentor: $name, commentBody: $comment});

                $commentsNum.html(`<br>Comments(${post.comments.length})`);

                //pass data to activity feed 
                $(document).trigger('doc:addToFeed', [post, $comment, $name]);

                //reset form fields
                $(this).find("input[name=name]").val("");
                $(this).find('.leave-comment').val("");
            });
````

Again, this would be handled if data-binding was used for the project. 



