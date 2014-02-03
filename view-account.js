// START WRAPPER: The YUI.add wrapper is added by the build system, when you use YUI Builder to build your component from the raw source in this file
YUI.add("st-view-account", function(Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang;

    /* ViewAccount class constructor */
    function ViewAccount(config) {
        ViewAccount.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    ViewAccount.NAME = "viewAccount";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    ViewAccount.ATTRS = {
				wrap:{
					value:"#st-view-account-wrap"	
					
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

        
        // ... attrB, attrC, attrD ... attribute configurations. 

        // Can also include attributes for the super class if you want to override or add configuration parameters
    };

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
		//ViewAccount.APIHOST = "http://shuotao.me:8888/";
		ViewAccount.APIHOST = "http://192.168.1.101/xampp/lehui/";
		ViewAccount.APIGETACCOUNT = "myinfo.php?";
    ViewAccount.MYNODE_TEMPLATE = "<div class='user-info clear'>"+
																		"<div class='avatar'><img class='st-photo' width='45' height='45' src='{{user_image}}'></div>"+
																		"<div class='desc'>"+
																			"<p class='user-name'>{{user_name}}<img class='sex' src='asset/sex_{{user_sex}}.png' /></p>"+
																			"<p class='user-id'>id:{{user_id}}</p>"+
																		"</div>"+
																	"</div>"+
																	"<div class='user-status table-group' >"+
																		"<table class='radius-table'>"+
																			"<tr>"+
																				"<td>{{follow_count}}<span>关注</span></td>"+
																				"<td>{{weibo_count}}<span>说说</span></td>"+
																			"</tr>"+
																			"<tr>"+
																				"<td>{{fans_count}}<span>粉丝</span></td>"+
																				"<td>{{tag_count}}<span>兴趣</span></td>"+
																			"</tr>"+
																		"</table>"+
																	"</div>"+
																	"<div class='user-desc table-group'>"+
																		"<ul class='radius-li'>"+
																			"<li>简介:{{user_summary}}</li>"+
																			"<li>城市:{{city_name}}</li>"+
																			"<li>找好友</li>"+
																			"<li>推荐标签</li>"+
																		"</ul>"+
																	"</div>"+
																	"<div class='table-group'>"+
																	 "<ul class='radius-li'>"+
																		"<li>告诉我们您的意见</li>"+
																	 "</ul>"+
																	"</div>"+
																	"<div class='table-group'>"+
																		"<ul class='radius-li'>"+
																			"<li>退出登陆</li>"+
																		"</ul>"+
																	"</div>";

    /* ViewAccount extends the base Widget class */
    Y.extend(ViewAccount, Y.Widget, {

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

             this.publish("myEvent", {
                defaultFn: this._defMyEventFn,
                bubbles:false
             });
						 this.renderUI();
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
						 this._doRequest();	

             // this._mynode = Node.create(Y.substitute(ViewAccount.MYNODE_TEMPLATE, {mynodeid: this.get("id") + "_mynode"})); 
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
				_doRequest:function(){
					Y.log("do request","info");

					var url = this._createUrl(),
					self = this,
					obj = Y.Get.script(url, {
							onSuccess:this._getSuccess,
							onFailure:this._getError,
							context:this

					});
				},
				_createUrl:function(){
					var baseUrl = ViewAccount.APIHOST+ViewAccount.APIGETACCOUNT+"data_type=jsonp&",url;
					url = baseUrl + "user_id="+this.get("userid")+"&session_id="+this.get('sessionid')+"&target_user_id=4";
					this.set('requestUrl',url);
					return url;
				},
				_createHTML : function(feed){
							return Y.mustache(ViewAccount.MYNODE_TEMPLATE,feed);
				},
				_getSuccess:function(o){
					 //var feed = Y.JSON.parse(j);
					Y.log(x.status);
					var html = this._createHTML(x.data);
					Y.one(this.get('wrap')).insert(html);
				},
				_getError:function(){
					
					
				},

        // Beyond this point is the ViewAccount specific application and rendering logic

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

    Y.namespace("ST").ViewAccount = ViewAccount;

}, "3.4.0", {requires:["widget"]});
// END WRAPPER
