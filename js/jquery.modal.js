$(function(){

 	var defaults = {
 			width: null, //弹出层宽度
 			height: null,  //弹出层高度
 			autoSize: true,  //是否自适应尺寸,默认自适应
 			autoHide: false,  //是否自自动消失，配合time参数共用
 			time: 3000,  //自动消失时间，单位毫秒
 			zIndex: 99999,  //弹出层定位层级
 			hasMask: false,  //是否显示遮罩层
 			hasClose: false,  //是否显示关闭按钮
 			effect: '', //动画效果：fade(默认),newspaper,fall,scaled,flip-horizontal,flip-vertical,sign,
 			type: 'normal', //对话框类型：normal(普通对话框),correct(正确/操作成功对话框),error(错误/警告对话框)
 			title: '',  //标题内容，如果不设置，则连同关闭按钮（不论设置显示与否）都不显示标题
 			content: ''  //正文内容，可以为纯字符串，html标签字符串，以及URL地址，当content为URL地址时，将内嵌目标页面的iframe。
 		};

 	function Modal(options){
 		this.settings = $.extend({}, defaults, options);
 		this.init();
 	}

 	Modal.prototype = {

 		//初始化弹出框
 		init: function(){
 			var that = this;
 			that.render();
 			that.setStyle();
 			that.trigger();
 		},

 		//创建弹出框
 		create: function(){
 			var that = this,
 				title =  that.settings.title,
 				hasMask = that.settings.hasMask,
 				hasClose = that.settings.hasClose,
 				modalHTML = [];

 			if(!title){
 				modalHTML[0] = '<section class="modal-box"><div class="modal-box-container"><div class="modal-box-content"></div>';
 			}else{
 				if(!hasClose){
					modalHTML[0] = '<section class="modal-box"><div class="modal-box-container"><div class="modal-box-title"><h3>'+ title + '</h3></div><div class="modal-box-content"></div>';
 				}else{
 					modalHTML[0] = '<section class="modal-box"><div class="modal-box-container"><div class="modal-box-title"><h3>'+ title + '</h3><span class="modal-box-close">×</span></div><div class="modal-box-content"></div>';
 				}
 			}

 			if(!hasMask){
 				modalHTML[1] = '';
 			}else{
 				modalHTML[1] = '<div class="modal-box-mask"></div>';
 			}

 			return modalHTML;
 		},

 		//渲染弹出框
 		render: function(){
 			var that = this,
 				modalHTML = that.create(),
 				$content = that.parseContent();

 			$('body').append(modalHTML[0]);

 			if(typeof($content) === 'object'){
 				$content.appendTo('.modal-box-content');
 			}else{
 				$('.modal-box-content').append($content);
 			}

 			$('body').append(modalHTML[1]);
 		},

 		//解析并处理弹出框内容
 		parseContent: function(){
 			var that = this,
 				content = that.settings.content,
 				width = that.settings.width,
 				height = that.settings.height,
 				type = that.settings.type,
 				$iframe = $('<iframe>'),
 				random = '?tmp=' + Math.random(),
 				urlReg = /^(https?:\/\/|\/|\.\/|\.\.\/)/;

 			if(urlReg.test(content)){
 				$iframe.attr({
 					src: content + random,
 					frameborder: 'no',
 					scrolling: 'no',
 					name: 'modal-box-iframe',
 					id: 'modal-box-iframe'
 				})
 				.on('load',function(){

 					//动态自适应iframe高度;
 					var $iframe = $(window.frames['modal-box-iframe'].document),
 						$iframeBody = $(window.frames['modal-box-iframe'].document.body),
 						iframeWidth = $iframe.outerWidth() - 8,
 						iframeHeight = $iframe.outerHeight() - 16,
 						$modalBox = $('.modal-box'),
 						$content = $('.modal-box-content'),
 						$container = $('.modal-box-container');

 						modalBoxWidth = iframeWidth + 40;
 						modalBoxHeight = iframeHeight + 126;

 					if(that.settings.autoSize){
 						$(this).width(iframeWidth);
 						$(this).height(iframeHeight);

 						$iframeBody.css({
 							margin: '0',
 							padding: '0'
 						});

 						$content.css({
 							width: iframeWidth + 'px',
 							height: iframeHeight + 'px'
 						});

 						$container.css({
 							width: modalBoxWidth + 'px',
 							height: modalBoxHeight + 'px'
 						});

 						$modalBox.css({
 							width: modalBoxWidth,
 							height: function(){
 								if(type === '' || type === 'normal'){
 									return modalBoxHeight + 'px';
 								}else if(type === 'error' || type === 'correct'){
 									modalBoxHeight = modalBoxHeight + 8;
 									return modalBoxHeight + 'px';
 								}
 							},
 							'margin-top': function(){
 								if(type === '' || type === 'normal'){
 									return -Math.round(modalBoxHeight/2) + 'px';
 								}else if(type === 'error' || type === 'correct'){
 									modalBoxHeight = modalBoxHeight + 4;
 									return -Math.round(modalBoxHeight/2) + 'px';
 								}
 							},
 							'margin-left': -Math.round(modalBoxWidth/2) + 'px'
 						});

 					}else{
 						$(this).width(that.settings.width - 40);
 						$(this).height(that.settings.height - 126);
 					}
 				});
				return $iframe;
 			}else{
 				return content;
 			}
 		},

 		//显示弹出框
 		show: function(){
 			$('.modal-box').css({display:'block'});

 			setTimeout(function(){
 				$('.modal-box').addClass('show');
 			},50)

 			$('.modal-box-mask').show();
 		},

 		//隐藏弹出框
 		hide: function(){
 			var $modalBox = $('.modal-box'),
 				$modalBoxMask = $('.modal-box-mask');

 			$modalBox.removeClass('show');

 			setTimeout(function(){
 				$modalBox.remove();
 				$modalBoxMask.remove();
 			},150)
 		},

 		//设置弹出框样式
 		setStyle: function(){
 			var that = this,
 				$modal = $('.modal-box'),
 				$container = $('.modal-box-container'),
 				$content = $('.modal-box-content'),
 				$mask  = $('.modal-box-mask'),
 				type = that.settings.type,
 				EFFECT = 'effect';

 			//弹出框外框样式
 			$modal.css({
 				width: function(){
 					if(that.settings.width){
 						return that.settings.width + 'px';
 					}else{
 						return;
 					}
 				},
 				height: function(){
 					if(that.settings.height){
 						if(type === '' || type === 'normal'){
 							return that.settings.height + 'px';
 						}else if(type === 'error' || type === 'correct'){
 							return that.settings.height + 4 + 'px';
 						}
 					}else{
 						return;
 					}
 				},
 				'margin-top': function(){
 					var height;
 					if(type === '' || type === 'normal'){
 						height = that.settings.height;
 					}else if(type === 'error' || type === 'correct'){
 						height = that.settings.height + 4;
 					}
 					return -Math.round(height/2) + 'px';
 				},
 				'margin-left': function(){
 					var width = $(this).width();
 					return -Math.round(width/2) + 'px';
 				},
 				'z-index': that.settings.zIndex
 			});

 			//弹出框内层容器样式
 			$container.css({
 				width: function(){
 					if(that.settings.width){
						return that.settings.width + 'px';
 					}else{
 						return;
 					}
 				},
 				height: function(){
 					if(that.settings.height){
 						return that.settings.height + 'px';
 					}else{
 						return;
 					}
 				},
 			});

 			//弹出框内容样式
 			$content.css({
 				width: function(){
 					if(that.settings.width){
 						return that.settings.width - 40 + 'px';
 					}else{
 						return;
 					}
 				},
 				height: function(){
 					if(that.settings.height){
 						return that.settings.height - 126 + 'px';
 					}else{
 						return;
 					}
 				}
 			});

 			//遮罩层样式
 			$mask.css({
 				height: $(document).height() + 'px'
 			});


 			//判断弹出框类型
 			switch(that.settings.type){
 				case 'correct':
 					$container.addClass('correct');
 					break;
 				case 'error':
 					$container.addClass('error');
 					break;
 				default:
 					$container.addClass('normal');;
 					break;
 			}

 			//弹出框多种动画效果
 			switch(that.settings.effect){
 				case 'newspaper':
 					$modal.addClass(EFFECT + '-newspaper');
 					break;
 				case 'fall':
 					$modal.addClass(EFFECT + '-fall');
 					break;
 				case 'scaled':
 					$modal.addClass(EFFECT + '-scaled');
 					break;
 				case 'flip-horizontal':
 					$modal.addClass(EFFECT + '-flip-horizontal');
 					break;
 				case 'flip-vertical':
 					$modal.addClass(EFFECT + '-flip-vertical');
 					break;
 				case 'sign':
 					$modal.addClass(EFFECT + '-sign');
 					break;
 				default:
 					$modal.addClass(EFFECT + '-fade');
 					break;
 			}
 		},

 		//弹出框触屏器(系列事件)
 		trigger: function(event){
 			var that = this;
 			$('.modal-box-close, .modal-box-mask').on('click',function(){
 				that.hide('.modal-box');
 			});

 			$(document).keyup(function(event){
 				if(event.keyCode === 27){
 					that.hide('.modal-box');
 				}
 			});

 			if(that.settings.autoHide){
 				setTimeout(function(){
 					that.hide('.modal-box');
 				},that.settings.time)
 			}
 		}
 	};

  $.Modal = Modal;

});
