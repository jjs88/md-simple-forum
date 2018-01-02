## Simple Forum

[live](https://jjs88.github.io/md-simple-forum)

This project utilizes a combination of Jquery with vanilla JS. I used handlebars.js to render the data. 

Since I didn't use an actual database, I took the raw data from users/posts/comments ajax call
and combined them into a single object that fit what I needed as a model for the web page. After this, I was able to create 
my template and necessary block helpers to render the data.

I made use of the data attribute so that I could attach the post ID in each post listing. This would be helpful
when I needed to add another comment for a post. I could then take this ID to find the correct post in my posts object and
add the new comment.

Another piece that I needed to get creative with was the pagination for displaying only a certain number of
posts per page. Again, I used a data attribute to put on the page value for each post. This would be done in my pagination function
where I passed in the posts object and cycle through each post, and based on my pagination logic, I would set the page property for each
post to be the correct page number. This number would then get set to the data-page attribute value when handlebars rendered the template.

After the page is rendered, another function was called that only displayed the posts that had a data-page=1, since this would be the first
page. All the other posts would be ``display="none"``.

When a user makes a comment on the page, we grab all the form values, and also the post ID that is attached to the comments section. We then 
perform a "lookup" using the filter method on the posts object to grab the post id that equals the one attached to the comments section. 
After getting the correct post, we add the new comment onto the comments array.

