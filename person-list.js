// START WRAPPER: The YUI.add wrapper is added by the build system, when you use YUI Builder to build your component from the raw source in this file
YUI.add("st-person-list", function(Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang;

    /* List class constructor */
    function PersonList(config) {
        PersonList.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    PersonList.NAME = "List";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    PersonList.ATTRS = {
				wrap:{
					value:"person-list-wrap"	
				},
				apihost:{
					value:"http://192.168.1.101/xampp/lehui/"
				},
				api:{
					value:"view_target_user_follow.php?"	
					
				},
				template : {
					value:'<div data-query-user-id="{{user_id}}" class="person clear">' +
									'<div class="avatar">'+
										'<img width="48" height="48" src="{{user_image}}" class="photo" ' +
											'alt="{{user_name}}">' +
									'</div>'+	
									'<div class="person-desc">' +
										'<p class="person-name st-highlight">{{user_name}}</p>'+
										'<p class="person-text">{{user_summary}}</p>' +
										'<a class="ctl-btn {{#follow}}unfollow{{/follow}}" data-user-id="{{user_id}}" data-user-status="{{relation_status}}">{{#follow}}取消{{/follow}}关注</a>'+
									'</div>'+
								'</div>'	
				},
				template_filter : {
					value:{
							follow : function(){
								if(this.user_status == 1)	{
									return true;	
								}else{
									return false;	
								}
								
							},
							unfollow : function(){
								if(this.user_status ==2) {
									return true;	
								}else{
									return false;	
								}
						}
					}
				}
        
        
        // ... attrB, attrC, attrD ... attribute configurations. 

        // Can also include attributes for the super class if you want to override or add configuration parameters
    };

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
		PersonList.APIGETLIST = "view_target_user_follow.php?";
    /* List extends the base Widget class */
    Y.extend(PersonList, Y.ST.List, {

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
						 Y.log("person list initializer","info");
             this.publish("myEvent", {
                defaultFn: this._defMyEventFn,
                bubbles:false
             });
						 this.bindUI();
        },
				bindUI:function(){
					Y.log('person list bindUI','info');
					Y.on('click',function(e){
						this._swapStatus(e.target);
						e.preventDefault();
					},'.ctl-btn',this);		
					
				},
				_createParm :function(){
					return "&user_id="+this.get("userid")+"&session_id="+this.get('sessionid')+"&target_user_id=4&page_num="+this.get("pageNum");
				},
				_createUrl:function(){
					var baseUrl = this.get('apihost')+this.get('api')+"data_type=jsonp",url;
					url = baseUrl + this._createParm();
					alert(url);
					this.set('requestUrl',url);
					return url;
				},
				_createHTML : function(data){
					var self = this;
					return Y.Array.map(data, function (person) {
							var o = Y.merge(person,self.get('template_filter'));
							return Y.mustache(self.get('template'),o);
					});
				},
				_swapStatus:function(node){
					
					node.toggleClass('unfollow');
					if(node.getAttribute('data-user-status')==1){	//swap to unfollow
						node.setAttribute('data-user-status',"2");
						node.setContent('关注');
						this._doSwapStatusRequest(node.getAttribute('data-user-id'),2);
					}else{																				//swap to follow
						node.setAttribute('data-user-status',"1");	
						node.setContent('取消关注');
						this._doSwapStatusRequest(node.getAttribute('data-user-id'),1);
					}
				},
				_doSwapStatusRequest:function(id,type){
					var url = "http://shuotao.me/staoapi/";
					if(type==1){
						url +=	"add_friend.php?";
					}else{
						url +=	"del_friend.php?";
					}
		

					var win = function(r) {

					}

					var fail = function(error) {
					}


					var options = new FileUploadOptions();
					var params = new Object();
					//params.user_name = localStorage.getItem('userName');
					params.user_id = this.get('userid');
					params.user_session_id = this.get('sessionid');
					params.follow_id = id;

					options.params = params;

					var ft = new FileTransfer();
					ft.upload('', url, win, fail, options);

				},
				_getSuccess:function(o){
					 //var feed = Y.JSON.parse(j);
					Y.log(x); 
					this._buildHTML(x.data);
					this.set('onload',false);
					this._hideLoading();
				},


		});

    Y.namespace("ST").PersonList = PersonList;


}, "3.4.0", {requires:["base","dom","node","io","mustache","node-load","widget","event","st-list"]});
// END WRAPPER

