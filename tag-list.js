// START WRAPPER: The YUI.add wrapper is added by the build system, when you use YUI Builder to build your component from the raw source in this file
YUI.add("st-tag-list", function(Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang;

    /* List class constructor */
    function TagList(config) {
        TagList.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    TagList.NAME = "TagList";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    TagList.ATTRS = {
				wrap:{
					value:"tag-list-wrap"	
				},
				apihost:{
					value:"http://192.168.1.101/xampp/lehui/"
				},
				api:{
					value:"get_recommend_tags.php?"	
					
				},
				template:{
					value:'<div class="tag clear">' +
										'<div class="avatar">'+
											'<img width="48" height="48" src="asset/{{tag_type}}_2.png" class="photo" ' +
												'alt="{{tag_name}}">' +
										'</div>'+	
										'<div class="tag-desc">' +
											'<p class="tag-name st-highlight">{{tag_name}}</p>'+
											'<a class="ctl-btn {{#follow}}unfollow{{/follow}}" data-tag-id="{{tag_id}}" data-tag-status="{{tag_status}}">{{#follow}}取消{{/follow}}关注</a>'+

										'</div>'+
									'</div>'
	
				},
				template_filter:{
					value:{
						follow:function(){
							if(this.tag_status == 1)	{
								return true;	
							}else{
								return false;	
							}
							
						},
						unfollow:function(){
							if(this.tag_status ==2) {
								return true;	
							}else{
								return false;	
							}
							
						}
					}
				},
				template_loading:{
					value:"<div id='list-loading'><img width='16' height='16' src='asset/loading.gif' /></div>"
				}
        
        
        // ... attrB, attrC, attrD ... attribute configurations. 

        // Can also include attributes for the super class if you want to override or add configuration parameters
    };

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
										
    Y.extend(TagList, Y.ST.List, {

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
						 Y.log("tag list initializer","info");

        },
				addEvent:function(){
					Y.on('click',function(e){
						this._swapStatus(e.target);
						e.preventDefault();
					},'.ctl-btn',this);	
					
				},
				_swapStatus:function(node){
					
					node.toggleClass('unfollow');
					if(node.getAttribute('data-tag-status')==1){	//swap to unfollow
						node.setAttribute('data-tag-status',"2");
						node.setContent('关注')
					}else{																				//swap to follow
						node.setAttribute('data-tag-status',"1");	
						node.setContent('取消关注')
					}
					
				},
				_createUrl:function(){
					var baseUrl = this.get('apihost')+this.get('api')+"data_type=jsonp&",url;
					url = baseUrl + "user_id="+this.get("userid")+"&session_id="+this.get('sessionid')+"&target_user_id=4&page_num="+this.get("pageNum");
					Y.log(url,"info");
					this.set('requestUrl',url);
					return url;
				},
				_createHTML : function(data){
					var self = this;
					return Y.Array.map(data, function (person) {
							o = Y.merge(person,self.get('template_filter'));
							return Y.mustache(self.get('template'),o);
					});
					
				},
				_getSuccess:function(o){
					 //var feed = Y.JSON.parse(j);
					this._buildHTML(x.data);
					this.set('onload',false);
					this._hideLoading();
				},
				_postRequest:function(){
						
					
				}


		});

    Y.namespace("ST").TagList = TagList;


}, "3.4.0", {requires:["base","dom","node","io","mustache","node-load","widget","event","st-list"]});
// END WRAPPER

