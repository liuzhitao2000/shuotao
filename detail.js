YUI.add('st-detail',function(Y){
	function Detail(config) {
    Detail.superclass.constructor.apply(this, arguments);
	}
	 
	Detail.NAME = "detail";
	 
	Detail.ATTRS = {
			id : {
				value:"#st-detail"
			},
			tweetId:{
				value:0,
				getter:function(){
					return localStorage.getItem('tweetid');	
				}
			},
			data:{
				value:{}	
			},
			template:{
				value:
					'<div class="user-info"><p>' +
							'<img width="48" height="48" src="{{avatar}}" class="photo" ' +
								'alt="Profile photo for {{user_name}}">' +
							'<span class="user">{{user_name}}</span>' +
					'</p></div>' +
						'<div class="tweet-detail">' +
							'<p class="tweet-text">{{tweet}}</p>' +
							'{{#hasSource}}'+
								'<div class="top"><div class="x1"></div><div class="x2"></div></div>'+
								'<div class="transmit-tweet {{#hasRange}}show-range{{/hasRange}}">'+
								'{{#isRetweet}}'+
									'{{#source}}'+
										'@{{user_name}}'+':'+'{{tweet}}'+
									'{{/source}}'+
								'{{/isRetweet}}'+
								'{{#isReOffer}}'+
									'{{#source}}'+
										'{{>offerTemplate}}'+
									'{{/source}}'+
								'{{/isReOffer}}'+
								'</div>'+
							'{{/hasSource}}'+
						'</div>'+
						'<div class="fun"><p class="clear">'+
								'<a class="transmit" href="transmit://">分享:{{transmit_count}}</a>'+
								'<a class="comment" href="comment://"> 评论:{{comment_count}}</a>'+
						'</p></div>'+
						'<div class="time">{{tweet_datetime}}</div>'
			},
			parm : {
				value:{
						offerTemplate : 
							'<p>@{{user_name}}:'+ 
							'{{#source}}'+
									'{{title}}</p>'+
									'<div class="offer-pic"><div class="offer-pic-w">'+
										'<span class="tip">距离{{range_val}}米</span>'+
										'<img width="{{image_width}}" src="http://shuotao.me/staoapi/offer_files/big/{{image_url}}" />'+
									'</div></div>'+
									'<div class="clear num">'+
										'<span><strong class="c-price">{{c_price}}</strong><small>元</small></span>'+
										'<ul>'+
										'<li>原价:<del>{{o_price}}元</del></li>'+
										'<li>{{buy_download_count}}人已购买</li>'+
										'</ul>'+
									'<p><a class="view-btn" href="{{url}}">查看详情</a></p>'+
							'{{/source}}'+
							'<div class="fun"><p class="clear">'+
								'<a class="transmit" href="orgTransmit://">分享:{{transmit_count}}</a>'+
								'<a class="comment" href="orgComment://"> 评论:{{comment_count}}</a>'+
							'</p></div>'
				}
			},
			filter : {
				value:{
									
					hasSource:function(){
							if(!Y.Lang.isUndefined(this.source)){
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
					},
					hasRange:function(){
							if(this.range_val>0){
								return true;
							}else{
								return false;		
							}	
						
					}
				}
			}

	}
	Y.extend(Detail, Y.Widget, {
		initializer : function(cfg) {
        this._wrapper = Y.one(this.get('id'));
				this._doRequest();
				//this.plug(Y.Plugin.ST.Post);
    },
 
    // Tasks MyClass needs to perform during 
    // the destroy() lifecycle phase
    destructor : function() {
        Y.Event.purgeElement(this._wrapper);
        this._wrapper.get("parentNode").removeChild(this._wrapper);
        this._wrapper = null;
    },
		_doRequest : function(){

			var url = "http://192.168.1.106/shuotao_android/detail_data.html?tweetid="+this.get('tweetId')+"&range_val=-1",
					self = this,
					obj = Y.Get.script(url, {
							onSuccess: function(){
								self._successHandle(detail_json);
							}
					});
		},
		_successHandle : function(o){
			this._renderUI(o);
		},
		_renderUI : function(o){
			Y.log(this.get('filter'));
			var o = Y.merge(o.tweet,this.get('filter')),
			html = Y.mustache(this.get('template'), o ,this.get('parm'));
			Y.log(o);
			this._wrapper.insert(html);
			this._addEvent();
		},
		_synEvent : function(){
			
		},
		_addEvent : function(){
			var self = this;
			Y.on('click',function(){
					Y.log('j-recommend click');
					this.post.pop();
			},".j-recommend",self);

		}
		
	});
	
	Y.namespace("ST").Detail = Detail;

}, "3.4.0", {requires:["base"]});
