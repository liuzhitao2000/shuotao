// START WRAPPER: The YUI.add wrapper is added by the build system, when you use YUI Builder to build your component from the raw source in this file
YUI.add("st-recommend-tag-list", function(Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang;

    /* List class constructor */
    function RecommendTagList(config) {
        RecommendTagList.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    RecommendTagList.NAME = "RecommendTagList";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    RecommendTagList.ATTRS = {
				wrap:{
					value:"recommend-tag-list-wrap"	
				},
				api:{
					value:"get_recommend_tags.php?"	
					
				}
        
        
        // ... attrB, attrC, attrD ... attribute configurations. 

        // Can also include attributes for the super class if you want to override or add configuration parameters
    };

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
										
    Y.extend(RecommendTagList, Y.ST.TagList, {

        initializer: function() {
            /*
             * initializer is part of the lifecycle introduced by 
             * the Base class. It is invoked during construction,
             * and can be used to setup instance specific state or publish events which
             * require special configuration (if they don't need custom configuration, 
             * events are published lazily only if there are subscribers).
             *
             * It does not need to invoke the superclass initializer. 
             * init() will call initializer() for all classes in the hierarchy.
             */
						 Y.log("recommend list initializer","info");
             this.publish("myEvent", {
                defaultFn: this._defMyEventFn,
                bubbles:false
             });
						 this.renderUI();
						 this.bindUI();
						 this.addEvent();
        }


		});

    Y.namespace("ST").RecommendTagList = RecommendTagList;


}, "3.4.0", {requires:["base","dom","node","io","mustache","node-load","widget","event","st-list"]});
// END WRAPPER

