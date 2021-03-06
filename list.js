// START WRAPPER: The YUI.add wrapper is added by the build system, when you use YUI Builder to build your component from the raw source in this file
YUI.add("st-list", function(Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang;

    /* List class constructor */
    function List(config) {
        List.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    List.NAME = "List";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    List.ATTRS = {
				wrap:{
					value:"list-wrap"	
				},
        pageNum : {
            value: 1                     // The default value for attrA, used if the user does not set a value during construction.
            /*
            , valueFn: "_defAttrAVal"      // Can be used as a substitute for "value", when you need access to "this" to set the default value.
             
            , setter: "_setAttrA"          // Used to normalize attrA's value while during set. Refers to a prototype method, to make customization easier
            , getter: "_getAttrA"          // Used to normalize attrA's value while during get. Refers to a prototype method, to make customization easier
            , validator: "_validateAttrA"  // Used to validate attrA's value before updating it. Refers to a prototype method, to make customization easier

            , readOnly: true               // Cannot be set by the end user. Can be set by the component developer at any time, using _set
            , writeOnce: true              // Can only be set once by the end user (usually during construction). Can be set by the component developer at any time, using _set
            
            , lazyAdd: false               // Add (configure) the attribute during initialization. 
            
                                           // You only need to set lazyAdd to false if your attribute is
                                           // setting some other state in your setter which needs to be set during initialization 
                                           // (not generally recommended - the setter should be used for normalization. 
                                           // You should use listeners to update alternate state). 

            , broadcast: 1                 // Whether the attribute change event should be broadcast or not.
            */
        },
				sumPage:{
					value:1	
				},
				lat:{
					value:0	
				},
				lon:{
					value:0	
				},
				requestUrl:{
					value:""	
				},
				useGEO:{
					value:false	
				},
				userid:{
					value:"",
					getter:function(){
						return localStorage.getItem('userid');	
					}
					
				},
				sessionid:{
					value:"",
					getter:function(){
						return localStorage.getItem('sessionid');	
					}
					
				},
				table:{
					value:"",
					getter:function(){
						return localStorage.getItem('cityTableName');	
					}
				},
				cate:{
					value:10000	
				},
				userphone:{
					value:'',
					getter:function(){
						return localStorage.getItem('userphone')	
					}
					
				},
				norange:{
					value:0	
				},
				loading:{
					getter:function(){
						return Y.one('#list-loading');
					}
					
				},
				onload:{
					value:false	
				}
        
        // ... attrB, attrC, attrD ... attribute configurations. 

        // Can also include attributes for the super class if you want to override or add configuration parameters
    };

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
		List.APIHOST = "http://shuotao.me:8888/";
		List.APIGETLIST = "newfeed2/";
		List.MYNODE_TEMPLATE ='<a href="detail.html?tweetid={{tweet_id}}" data-tweet-id="{{tweet_id}}" class="tweet clear">' +
														'<div class="avatar">'+
															'<img width="48" height="48" src="{{avatar}}" class="photo" ' +
																'alt="Profile photo for {{user_name}}">' +
														'</div>'+	

														'<div class="tweet-desc">' +
															'<span class="data">{{tweet_datetime}}</span>'+
															'<p class="user-name st-highlight">{{user_name}}</p>'+
															'<p class="tweet-text">{{tweet}}</p>' +
															'{{#isRetweet}}'+
																'{{#source}}'+
																	'{{#user_name}}{{user_name}}{{/user_name}}'+':'+'{{tweet}}'+
																'{{/source}}'+
															'{{/isRetweet}}'+
															'{{#isReOffer}}'+
																'{{#source}}'+
																	'{{>offerTemplate}}'+
																'{{/source}}'+
															'{{/isReOffer}}'+
														'</div>'+
													'</a>';
		List.MYNODE_TEMPLATE_PARM ={
																	offerTemplate : 
																	'<div class="offer">'+
																		'<p>@{{user_name}}:'+
																		'{{#source}}'+
																				'{{title}}</p>'+
																				'<div class="offer-pic"><img src="http://shuotao.me/staoapi/offer_files/{{image_url}}" /></div>'+
																		'{{/source}}'+
																	'</div>'
																};
		List.TEMPLATE_FILTER = {
									
															hasSource:function(){
																	if(this.source&&this.source.srouce){
																			return true;
																	}else{
																			return false;	
																	}

															},
															isOffer:function(){
																	if(this.transmit_type == 2){
																		 return true;
																	}else{
																		return false;
																	}
															},
															isRetweet:function(){
																	if(this.transmit_type==1&&
																		!Y.Lang.isUndefined(this.source.source)&&
																		this.source.transmit_type==1){
																			return true;
																		}else{
																			return false;	
																		}
																
															},
															isReOffer:function(){
																	if(this.transmit_type==1&&
																		!Y.Lang.isUndefined(this.source.source)&&
																		this.source.transmit_type==2){
																		return true;		
																	}else{
																		return false;	
																	}	
															}
													};




		List.LOADING_TEMPLATE="<div id='list-loading'><img width='16' height='16' src='asset/loading.gif' /></div>";
    /* List extends the base Widget class */
    Y.extend(List, Y.Widget, {

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
						 Y.log("list initializer","info");
             this.publish("myEvent", {
                defaultFn: this._defMyEventFn,
                bubbles:false
             });
						 //this.renderUI();
						 this.bindUI();
						 //this.addEvent();
        },

        destructor : function() {
            /*
             * destructor is part of the lifecycle introduced by 
             * the Widget class. It is invoked during destruction,
             * and can be used to cleanup instance specific state.
             *
             * Anything under the boundingBox will be cleaned up by the Widget base class
             * We only need to clean up nodes/events attached outside of the bounding Box
             *
             * It does not need to invoke the superclass destructor. 
             * destroy() will call initializer() for all classes in the hierarchy.
             */
        },

        renderUI : function() {
					Y.log('list render ui');
            /*
             * renderUI is part of the lifecycle introduced by the
             * Widget class. Widget's renderer method invokes:
             *
             *     renderUI()
             *     bindUI()
             *     syncUI()
             *
             * renderUI is intended to be used by the Widget subclass
             * to create or insert new elements into the DOM. 
             */
						 this._createLoading();
						 this._doRequest();	

             // this._mynode = Node.create(Y.substitute(List.MYNODE_TEMPLATE, {mynodeid: this.get("id") + "_mynode"})); 
        },

        bindUI : function() {
            /*
             * bindUI is intended to be used by the Widget subclass 
             * to bind any event listeners which will drive the Widget UI.
             * 
             * It will generally bind event listeners for attribute change
             * events, to update the state of the rendered UI in response 
             * to attribute value changes, and also attach any DOM events,
             * to activate the UI.
             */
            
             // this.after("attrAChange", this._afterAttrAChange);
						Y.log('list bindUI','info');
						var self = this;
						Y.on("scroll",function(){
							if(!self.get('onload')){
								if(Y.DOM.docScrollY() == Y.DOM.docHeight()-Y.DOM.winHeight()){
										Y.log('do load content');
										Y.log(self.get('sumPage'));
										if(self.get('sumPage')>=self.get('pageNum')){
											return;	
										}
										self.set('pageNum',self.get("pageNum")+1);

										self.set('onload',true);
										self._doRequest();
								}
							}
						},window,this);



        },

        syncUI : function() {
            /*
             * syncUI is intended to be used by the Widget subclass to
             * update the UI to reflect the initial state of the widget,
             * after renderUI. From there, the event listeners we bound above
             * will take over.
             */

            // this._uiSetAttrA(this.get("attrA"));
        },
				addEvent:function(){
						Y.on("click",function(e){
							localStorage.setItem('tweetid',this.getAttribute('data-tweet-id'));
						},'.tweet');	
					
				},
				_createLoading : function(){
					 Y.one("#"+this.get("wrap")).insert(List.LOADING_TEMPLATE,"after");
				},
				_showLoading:function(){
					this.get('loading').setStyle('display','block');
					
				},
				_hideLoading:function(){
					this.get('loading').setStyle('display','none');
				},
				_doRequest:function(){
					alert(this._createUrl);
					this._showLoading();
					var url = this._createUrl(),
					self = this,
					obj = Y.Get.script(url, {
							onSuccess:this._getSuccess,
							onFailure:this._getError,
							context:this

					});
				},
				_getSuccess:function(o){
					this._buildHTML(j.feed);
					this.set('sumPage',j.page_num);
					this.set('onload',false);
					this._hideLoading();
				},
				_buildHTML : function(o){
					
					var htmlarray = this._createHTML(o),
							 html="",m,n;
					for(m=0,n=htmlarray.length;m<n;m++){
							html+=htmlarray[m]; 
					}
					Y.one('#'+this.get('wrap')).insert(html);
				}
				,
				_getError:function(){
					
					
				},
        _createUrl:function(){
					var baseUrl = List.APIHOST+List.APIGETLIST,url;
					url = baseUrl + "page="+this.get("pageNum");
					Y.log(url,"info");
					this.set('requestUrl',url);
					return url;
				},
				_createHTML : function(feed){
					return Y.Array.map(feed, function (tweet) {
							Y.log(tweet.source);
							var filter = List.TEMPLATE_FILTER;
							var o = Y.merge(tweet,filter);
							return Y.mustache(List.MYNODE_TEMPLATE,o,List.MYNODE_TEMPLATE_PARM);
					});
					
				},
				_getGEO:function(){
					//Y.log("get GEO ","info");
					this._showLoading();
					var self = this;
					var watchPositionId =navigator.geolocation.getCurrentPosition(
						function(p){
							self._getGEOSuccess(p);		
						}, 
						function(e){
							self._getGEOFailure(e)
						},
						{
							timeout:15000
						}
					);
				},
				_getGEOSuccess:function(p){
						Y.log("get GEO success","info");
						this.set('lat',p.coords.latitude);
						this.set('lon',p.coords.longitude);  
						this._doRequest();
				},
				_getGEOFailure:function(e){
						this._hideLoading();
						//alert(e.message);
						Y.log("get GEO failed","info");
						switch(e.code){
							case e.TIMEOUT:
								Y.log("get GEO time out","info");
								alert("超时了,正在尝试重新定位");
								this._getGEO();
								break;
							case 1:
								alert("系统拒绝定位请求，请在\"设置\"中允许说淘访问定位信息");
							case 2:
								alert("无法定位");
								break;
							default:
								Y.log("get GEO error","warrning");
						}	
				},

        // Beyond this point is the List specific application and rendering logic

        /* Attribute state supporting methods (see attribute config above) */
       
        _defAttrAVal : function() {
            // this.get("id") + "foo";
        },

        _setAttrA : function(attrVal, attrName) {
            // return attrVal.toUpperCase();
        },

        _getAttrA : function(attrVal, attrName) {
            // return attrVal.toUpperCase();
        },

        _validateAttrA : function(attrVal, attrName) {
            // return Lang.isString(attrVal);
        },

        /* Listeners, UI update methods */

        _afterAttrAChange : function(e) {
            /* Listens for changes in state, and asks for a UI update (controller). */

            // this._uiSetAttrA(e.newVal);
        },

        _uiSetAttrA : function(val) {
            /* Update the state of attrA in the UI (view) */

            // this._mynode.set("innerHTML", val);
        },

        _defMyEventFn : function(e) {
            // The default behavior for the "myEvent" event.
        }
    });

    Y.namespace("ST").List = List;


}, "3.4.0", {requires:["base","dom","node","io","mustache","node-load","widget","event","st-offer-list-style"]});
// END WRAPPER

