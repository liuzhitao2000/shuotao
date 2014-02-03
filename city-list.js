// START WRAPPER: The YUI.add wrapper is added by the build system, when you use YUI Builder to build your component from the raw source in this file
YUI.add("st-city-list", function(Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang;

    /* List class constructor */
    function CityList(config) {
        CityList.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    CityList.NAME = "cityList";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    CityList.ATTRS = {
				wrap:{
					value:"city-list-wrap"	
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
				currentCityName:{
					value:"",
					getter:function(){
						return localStorage.getItem('currentCityName');	
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
		//CityList.APIHOST = "http://shuotao.me/";
		CityList.APIHOST = "http://192.168.1.100/xampp/lehui/";
		CityList.APIGETCITYLIST = "get_recommend_city.php?data_type=jsonp&";
		CityList.APIGETCITYBYGPS = "get_gps_city_name.php?data_type=jsonp&";
		CityList.MYNODE_TEMPLATE ='<li data-city-name="{{city_table_name}}" data-city-id="{{city_id}}">{{city_name}}</li>';



		CityList.LOADING_TEMPLATE="<div id='list-loading'><img width='16' height='16' src='asset/loading.gif' /></div>";
    /* List extends the base Widget class */
    Y.extend(CityList, Y.ST.List, {

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
						 this.renderUI();
						 //this.bindUI();
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
						 Y.log(this.get('currentCityName'));
						 if(!this.get('table')||!this.get('currentCityName')){
							 	Y.log('do get geo');
								this._getGEO(); 
						 }else{
								Y.one('#city-gps').setContent(this.get('currentCityName'));
						 }

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
						var self = this;
						Y.on("scroll",function(){
							if(!self.get('onload')){
								if(Y.DOM.docScrollY() == Y.DOM.docHeight()-Y.DOM.winHeight()){
										Y.log('do load content');
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
							//Y.log(this);
							//Y.log(this.getAttribute('data-tweet-id'));	
							//e.preventDefault();
							localStorage.setItem('tweetid',this.getAttribute('data-tweet-id'));
						},'.tweet');	
					
				},
				_createLoading : function(){
				},
				_showLoading:function(){
					//this.get('loading').setStyle('display','block');
					
				},
				_hideLoading:function(){
					//this.get('loading').setStyle('display','none');
				},
				_doRequest:function(){
					Y.log("do request","info");
					this._showLoading();
					//var url = "http://shuotao.me/staoapi/list.php?user_id=%d&cate=10000&page_num="+this.get("pageNum")+"&session_id=20121231&lat="+this.get("lat")+"&lng="+this.get("lon")+"&no_region=1",
					//Y.log(this.get('requestUrl'));
					var url = this._createUrl(),
					self = this,
					obj = Y.Get.script(url, {
							onSuccess:this._getSuccess,
							onFailure:this._getError,
							context:this

					});
				},
				_doGetGPSCityRequest:function(){
					var url = CityList.APIHOST + CityList.APIGETCITYBYGPS+"&lat="+this.get("lat")+"&lng="+this.get("lon"),
					self = this,
					obj = Y.Get.script(url, {
							onSuccess:function(o){
									Y.one('#city-gps').setContent(x.city_name);
									localStorage.setItem('currentCityName',x.city_name);
									localStorage.setItem('currentCityId',x.city_id);
									localStorage.setItem('currentCityTable',x.city_table_name);
							},
							onFailure:this._getError,
							context:this
					});
					
				},
				_getSuccess:function(o){
					 //var feed = Y.JSON.parse(j);
					this._buildHTML(x.data);
					this.set('onload',false);
					this._hideLoading();
				},
				_buildHTML : function(o){
					
					var htmlarray = this._createHTML(o),
							 html="",m,n;
					for(m=0,n=htmlarray.length;m<n;m++){
							html+=htmlarray[m]; 
					}
					Y.one('#city-list-ul').insert(html);
				}
				,
				_getError:function(){
					
					
				},
        _createUrl:function(){
					var baseUrl = CityList.APIHOST + CityList.APIGETCITYLIST,url;
					url = baseUrl + "page="+this.get("pageNum");
					this.set('requestUrl',url);
					return url;
				},
				_createHTML : function(feed){
					return Y.Array.map(feed, function (tweet) {
							return Y.mustache(CityList.MYNODE_TEMPLATE,tweet);
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
						this._doGetGPSCityRequest();
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
				}
		});

    Y.namespace("ST").CityList = CityList;


}, "3.4.0", {requires:["st-list",'st-city-list-style']});
// END WRAPPER

