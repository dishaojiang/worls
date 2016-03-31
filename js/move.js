//通过id获取元素
function getId(id){
	return document.getElementById(id);	
}

//获取元素属性值		
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

//通过class获取元素
function getByClass(oParent,sClass){
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	
	for(var i=0;i<aEle.length;i++){
		if(aEle[i].className==sClass){
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}

//绑定事件
function bind(obj,sEv,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+sEv,fn);	
	}else{
		obj.addEventListener(sEv,fn,false);	
	}
}

//获取可视区宽高
function view(){
	return {
		w:document.documentElement.clientWidth,
		h:document.documentElement.clientHeight	
	}
}

// 普通运动函数
function doMove(obj,attr,dir,target,endFn){
	dir=parseInt(getStyle(obj,attr))<target?dir:-dir;
	clearInterval(obj.timer);
	
	obj.timer=setInterval(function(){
	   var speed=parseInt(getStyle(obj,attr))+dir;
	   
	   if(speed>target&&dir>0||speed<target&&dir<0){
		  speed=target;
	   }
	   
	   obj.style[attr]=speed+'px';
	   if(speed==target){
		  clearInterval(obj.timer);
		  
		  endFn&&endFn();   
	   }
	},30)		
}
	
// 元素抖动函数
function shake(obj,attr,endFn){
   var pos=parseInt(getStyle(obj,attr));
   var arr=[];
   var num=0;
   
   for( var i=15;i>0;i-=2){
	   arr.push(i,-i);
   }
   arr.push(0);
   
  clearInterval(obj.shake);
  obj.shake=setInterval(function(){
	   obj.style[attr]=pos+arr[num]+'px';
	   num++;
	   if(num==arr.length){
		  clearInterval(obj.shake);	
		  endFn&&endFn();	   
	   } 
  },50)
}

//速度版运动框架
function startMove2(obj, json, fnEnd)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var bStop=true;		//假设：所有值都已经到了
		
		for(var attr in json)
		{
			var cur=0;
			
			if(attr=='opacity')
			{
				cur=Math.round(parseFloat(getStyle(obj, attr))*100);
			}
			else
			{
				cur=parseInt(getStyle(obj, attr));
			}
			
			var speed=(json[attr]-cur)/6;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			
			if(cur!=json[attr])
				bStop=false;
			
			if(attr=='opacity')
			{
				obj.style.filter='alpha(opacity:'+(cur+speed)+')';
				obj.style.opacity=(cur+speed)/100;
			}
			else
			{
				obj.style[attr]=cur+speed+'px';
			}
		}
		
		if(bStop)
		{
			clearInterval(obj.timer);
						
			if(fnEnd)fnEnd();
		}
	}, 30);
}

//时间版运动框架
function startMove(obj,json,times,fx,fn){
	
	if( typeof times == 'undefined' ){
		times = 400;
		fx = 'linear';
	}
	
	if( typeof times == 'string' ){
		if(typeof fx == 'function'){
			fn = fx;
		}
		fx = times;
		times = 400;
	}
	else if(typeof times == 'function'){
		fn = times;
		times = 400;
		fx = 'linear';
	}
	else if(typeof times == 'number'){
		if(typeof fx == 'function'){
			fn = fx;
			fx = 'linear';
		}
		else if(typeof fx == 'undefined'){
			fx = 'linear';
		}
	}
	
	var iCur = {};
	
	for(var attr in json){
		iCur[attr] = 0;
		
		if( attr == 'opacity' ){
			iCur[attr] = Math.round(getStyle(obj,attr)*100);
		}
		else{
			iCur[attr] = parseInt(getStyle(obj,attr));
		}
		
	}
	
	var startTime = now();
	
	clearInterval(obj.timer);
	
	obj.timer = setInterval(function(){
		
		var changeTime = now();
		
		var t = times - Math.max(0,startTime - changeTime + times);  //0到2000
		
		for(var attr in json){
			
			var value = Tween[fx](t,iCur[attr],json[attr]-iCur[attr],times);
			
			if(attr == 'opacity'){
				obj.style.opacity = value/100;
				obj.style.filter = 'alpha(opacity='+value+')';
			}
			else{
				obj.style[attr] = value + 'px';
			}
			
		}
		
		if(t == times){
			clearInterval(obj.timer);
			if(fn){
				fn.call(obj);
			}
		}
		
	},13);
	
	function now(){
		return (new Date()).getTime();
	}
	
}

//Tween公式
var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}


//ajax函数
function ajax(url,fnSucc,fnFaild){
	//1.创建ajax对象
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();
	}else{
		var oAjax=new ActiveXObject("Microsoft.XMLHTTP");
	}
	//2.连接服务器 open(方法，文件名，异步传输)
	oAjax.open('GET',url,true);
	//3.发送请求
	oAjax.send();
	//4.接收返回
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){//读取完成
			if(oAjax.status==200)//成功
			{
				fnSucc(oAjax.responseText);
			}else{
				if(fnFaild){
					fnFaild(oAjax.status);
				}
			}
		}
	};
};

//cookie函数
function setCookie(name,value,iDay){
	var oDate=new Date();
	oDate.setDate(oDate.getDate()+iDay);
	document.cookie=name+'='+value+';expires='+oDate;
}
//setCookie('user','pzy',10);

function getCookie(name){
	var arr=document.cookie.split('; ');
	for(var i=0;i<arr.length;i++){
		var arr2=arr[i].split('=');
		if(arr2[0]==name){
			return arr2[1];
		}
	}
	return '';
}

function removeCookie(name){
	setCookie(name,1,-1);
}

//拖拽函数封装
function dragFn(obj){
	obj.onmousedown=function(ev){
		var e=ev||event;
		var disX=e.clientX-obj.offsetLeft;
		var disY=e.clientY-obj.offsetTop;
		
		document.onmousemove=function(ev){
			var e=ev||event;
			var L=e.clientX-disX;
			var T=e.clientY-disY;
			if(L<0){
				L=0;
			}else if(L>view().w-obj.offsetWidth){
				L=view().w-obj.offsetWidth;
			}
			if(T<0){
				T=0;
			}else if(T>view().h-obj.offsetHeight){
				T=view().h-obj.offsetHeight;
			}
			obj.style.left=L+'px';
			obj.style.top=T+'px';	
		}
		
		document.onmouseup=function(){
			document.onmousemove=document.onmouseup=null;
		}
		
		return false;
	}
}