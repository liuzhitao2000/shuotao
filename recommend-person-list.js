// START WRAPPER: The YUI.add wrapper is added by the build system, when you use YUI Builder to build your component from the raw source in this file
YUI.add("st-recommend-person-list", function(Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang;

    /* List class constructor */
    function RecommendPersonList(config) {
        RecommendPersonList.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    RecommendPersonList.NAME = "recommendPersonList";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    RecommendPersonList.ATTRS = {
				wrap:{
					value:"recommend-person-list-wrap"	
				},
				api:{
					value:"update_add_list.php?"	
				},
				phones:{
					value:""
				},
				parm:{
					value:""	
				}

        
        
        // ... attrB, attrC, attrD ... attribute configurations. 

        // Can also include attributes for the super class if you want to override or add configuration parameters
    };

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
    /* List extends the base Widget class */
    Y.extend(RecommendPersonList, Y.ST.PersonList, {

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
						 Y.log("recommend person list initializer","info");
             this.publish("myEvent", {
                defaultFn: this._defMyEventFn,
                bubbles:false
             });
						 this.renderUI();

        },
				
				renderUI :function(){
					var self = this;
					navigator.notification.confirm("导入通讯录可以帮你找到更多朋友",function(button){
							switch(button){
								case 1:
									self.getContacts(self);
									break;
								case 2:
									self.set('parm',"&user_id="+this.get("userid")+"&session_id="+this.get('sessionid')+"&phones=&user_phone="+this.get('userphone'))
									self._doRequest();
									break;
							}
					},'是否导入通讯录？','确定,取消');

				},
				_createParm :function(){
					alert('createParm');
					return this.get('parm');
				},
				getContacts:function(self){
						var options = new ContactFindOptions();
								filter = ["phoneNumbers"];   // return contact.displayName field

						var phones ="";

						navigator.contacts.find(filter,
																		function(contacts){
																			for(var m=0,n=contacts.length;m<n;m++){

																				if(contacts[m].phoneNumbers){

																					for(var p=0,q=contacts[m].phoneNumbers.length;p<q;p++){
																						
																						phones=phones+contacts[m].phoneNumbers[p].value+",";	
																					}
																				}
																			}
																			doSetParm();
																		},
																		function(contactError){
																			
																			alert(contactError);
																			
																		},
																		options
						);
						var doSetParm = function(){
								self.set('parm', "&user_id="+self.get("userid")+"&session_id="+self.get('sessionid')+"&phones="+phones+"&user_phone="+self.get('userphone'));
								self._doRequest();
						}
				},
				_getSuccess:function(o){
					 //var feed = Y.JSON.parse(j);
					this._buildHTM(x.data);
					this.set('sumPage',x.page_num);
					this.set('onload',false);
					this._hideLoading();
				},



		});

    Y.namespace("ST").RecommendPersonList = RecommendPersonList;


}, "3.4.0", {requires:["st-person-list"]});
// END WRAPPER

