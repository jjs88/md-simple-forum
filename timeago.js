var TimeAgo = (function() {


    var defaults = {
        // set defaults
    };

    class TimeAgo {
        constructor(element, options) {

            this.config = $.extend({}, defaults, options); //sets up the jquery plugin
            this.element = element; //set the element to the time ago instance 
            element.data('timeago', this); //add the timeago instance to the element

            this.init();
        }


        getTime() {
            this.dateMoment = moment(this.date);        
        }


        render() {

            var str = this.dateMoment.fromNow();
            this.element.text(str);

            this.timer = setTimeout( () => {
                console.log('calling timeout',this);
                this.render();
            }, 60000) //re-render the .timestamp span value every minute
        }
        

        init() {
            this.getTime();
            this.render();

        }

    }


    function init(element) {

        new TimeAgo(element); 
    }


    return {
        init
    }






})();