window.onload=function(){

	//顶部分页点击及滚屏效果
	var aLi=document.getElementById('list').getElementsByTagName('li');
	var oScroll=getId('scroll');
	var oScrollList=oScroll.getElementsByTagName('div')[0];
	var aScroll=getByClass(oScrollList,'scroll');
	var allLi=oScroll.getElementsByTagName('li');
	var num=0;
	
	//滚屏的宽度
	for(var i=0;i<aScroll.length;i++){
		aScroll[i].style.width=view().w+'px';
	}
	oScrollList.style.width=aScroll.length*view().w+'px';
	
	for(var i=0;i<aLi.length;i++){
		aLi[i].index=i;
		aLi[i].onclick=function(){
			num=this.index;
			for(var i=0;i<aLi.length;i++){
				aLi[i].className='';
			}
			this.className='active';
			startMove2(oScrollList,{left:-this.index*view().w});
		}
	}
	
	bind(document,'mousewheel',scroll);
	bind(document,'DOMMouseScroll',scroll);
	
	function scroll(ev){
		var e=ev||event;
		var b=true;
		
		if(e.wheelDelta){
			b=e.wheelDelta>0?true:false;
		}else{
			b=e.detail<0?true:false;	
		}
		
		if(b){
			num--;
			if(num<0){
				num=aLi.length-1;
			}
			for(var i=0;i<aLi.length;i++){
				aLi[i].className='';
			}
			aLi[num].className='active';
			startMove2(oScrollList,{left:-num*view().w});
		}else{
			num++;
			if(num==aLi.length){
				num=0;
			}
			for(var i=0;i<aLi.length;i++){
				aLi[i].className='';
			}
			aLi[num].className='active';
			startMove2(oScrollList,{left:-num*view().w});
		}
		
		if(e.preventDefault){
			e.preventDefault();	
		}
		
		return false;
	}
	
	//桌面图标拖拽效果
	for(var i=0;i<aScroll.length;i++){
		dragFn2(aScroll[i]);	
	}
	
	function dragFn2(ssss){
		var deskLi=ssss.getElementsByTagName('li');
		var arr=[];
		
		for(var i=0;i<deskLi.length;i++){
			arr[i]={ left:deskLi[i].offsetLeft,top:deskLi[i].offsetTop };
			drag(deskLi[i]);
		}
		
		for(var i=0;i<deskLi.length;i++){
			deskLi[i].style.left=arr[i].left+'px';
			deskLi[i].style.top=arr[i].top+'px';
			deskLi[i].style.position='absolute';
			deskLi[i].style.margin='0px';
			deskLi[i].index=i;
		}
		
		//拖拽函数封装
		function drag(obj){
			obj.onmousedown=function(ev){
				var e=ev||event;
				var disX=e.clientX-obj.offsetLeft;
				var disY=e.clientY-obj.offsetTop;
				
				document.onmousemove=function(ev){
					var e=ev||event;
					obj.style.left=	e.clientX-disX+'px';
					obj.style.top=e.clientY-disY+'px';	
				}
				
				document.onmouseup=function(){
					document.onmousemove=document.onmouseup=null;
					
					for(var i=0;i<deskLi.length;i++){
						if(obj==deskLi[i])continue;
						if(cdTest(obj,deskLi[i])){
							startMove2(deskLi[i],arr[obj.index]);
							startMove2(obj,arr[deskLi[i].index]);
							
							var tmp=0;
							tmp=obj.index;
							obj.index=deskLi[i].index;
							deskLi[i].index=tmp;
						}else{
							startMove2(obj,arr[obj.index]);	
						}
					}
				}
				
				return false;
			}
		}
	}
	//碰撞检测封装
	function cdTest(obj1,obj2){
		var l1=obj1.offsetLeft;
		var r1=l1+obj1.offsetWidth;
		var t1=obj1.offsetTop;
		var b1=t1+obj1.offsetHeight;
		
		var l2=obj2.offsetLeft;
		var r2=l2+obj2.offsetWidth;
		var t2=obj2.offsetTop;
		var b2=t2+obj2.offsetHeight;
		
		//如果碰不上
		return !( r1<l2 || l1>r2 || b1<t2 || t1>b2 );				
	}
	
	//html5播放器
	
	var html5=document.getElementById('html5_audio');
	var oCircle=getByClass(html5,'circle')[0];
	var oAudioList=getByClass(html5,'audio_list')[0];
	var oAudioLi=oAudioList.getElementsByTagName('li');
	var oH2=getByClass(html5,'audio_title')[0];
	
	var oVolumeProBar=getByClass(html5,'volumeProBar')[0];
	var oVolLine=getByClass(html5,'volLine')[0];
	var oVolBtn=getByClass(html5,'volBtn')[0];
	var oHorn=getByClass(html5,'horn')[0];
	var oHornLines=getByClass(html5,'hornLines')[0];
	var oHornClose=getByClass(html5,'hornClose')[0];
	
	
	var oPlayPause=getByClass(html5,'playAndPause')[0];
	var oPrev=getByClass(html5,'prev')[0];
	var oNext=getByClass(html5,'next')[0];
	
	var oTimeBar=getByClass(html5,'timeProBar')[0];
	var oTime_line=getByClass(html5,'time_line')[0];
	var oTime_bar=getByClass(html5,'time_bar')[0];
	var oPlayTimeBar=getByClass(html5,'playTimeBar')[0];
	var oCurTime=getByClass(html5,'curTime')[0];
	var oAllTime=getByClass(html5,'allTime')[0];
	
	var aSpan=oPlayPause.getElementsByTagName('span');
	var oA=document.getElementById('audio');
	var Num=0;
	var onOff=true;
	var ttt=null;
	
	//歌曲数据
	var musicData=[
		{
			title:'甄妮 - 铁血丹心.mp3',
			src:'music/甄妮 - 铁血丹心.mp3'		
		},
		{
			title:'张国荣 - 倩女幽魂.mp3',
			src:'music/张国荣 - 倩女幽魂.mp3'		
		},
		{
			title:'李翊君 - 雨蝶.mp3',
			src:'music/李翊君 - 雨蝶.mp3'		
		},
		{
			title:'杜歌 - 兄弟难当.mp3',
			src:'music/杜歌 - 兄弟难当.mp3'		
		},
		{
			title:'金莎 - 星月神话',
			src:'music/金莎 - 星月神话.mp3'		
		},
		{
			title:'孙楠 - 拯救.mp3',
			src:'music/孙楠 - 拯救.mp3'		
		},
		{
			title:'爱乐团 - 天涯.mp3',
			src:'music/爱乐团 - 天涯.mp3'		
		},
		{
			title:'T-ara - 넘버나인 (No.9).mp3',
			src:'music/T-ara - 넘버나인 (No.9).mp3'		
		},
		{
			title:'T-ara - T.T.L (Time To Love).mp3',
			src:'music/T-ara - T.T.L (Time To Love).mp3'		
		},
		{
			title:'T-ara - SEXY LOVE.mp3',
			src:'music/T-ara - SEXY LOVE.mp3'		
		}
	];
	
	//进度条控制
	oTime_bar.onmousedown=function(ev){
		var e=ev||event;
		e.cancelBubble=true;
		var disX=e.clientX-this.offsetLeft;
		
		document.onmousemove=function(ev){
			var e=ev||event;
			var proL=e.clientX-disX;
			if(proL<0){
				proL=0;
			}else if(proL>oTimeBar.offsetWidth-oTime_bar.offsetWidth){
				proL=oTimeBar.offsetWidth-oTime_bar.offsetWidth;
			}
			oTime_bar.style.left=proL+'px';
			oTime_line.style.width=proL+'px';
			
			var scaleX=proL/(oTimeBar.offsetWidth-oTime_bar.offsetWidth);
			oA.currentTime=scaleX*oA.duration;
			nowTime();
		}
		
		document.onmouseup=function(){
			document.onmousemove=document.onmouseup=null;	
		}
		
		return false;
	}

	
	function nowTime(){
		
		oCurTime.innerHTML = changeTime(oA.currentTime);
		oAllTime.innerHTML = changeTime(oA.duration);
		var scale2 = oA.currentTime/oA.duration;
		
		oTime_bar.style.left=scale2*(oTimeBar.offsetWidth-oTime_bar.offsetWidth)+'px';
		oTime_line.style.width=scale2*(oTimeBar.offsetWidth-oTime_bar.offsetWidth)+'px';
		
	}

	function changeTime(iNum){
		
		iNum = parseInt( iNum );
		
		//var iH = toZero(Math.floor(iNum/3600));
		var iM = toZero(Math.floor(iNum%3600/60));
		var iS = toZero(Math.floor(iNum%60));
		
		return iM + ':' + iS;
		
	}
	
	function toZero(num){
		if(num<=9){
			return '0' + num;
		}
		else{
			return '' + num;
		}
	}

	oHorn.onclick=function(){
		if(oA.muted){
			oHornClose.style.display='none';
			oA.muted=false;
			oA.volume=1;
			oVolBtn.style.left=148+'px';
			oVolLine.style.width=148+'px';
		}else{
			oHornClose.style.display='block';
			oA.muted=true;
			oA.volume=0;
			oVolBtn.style.left=0+'px';
			oVolLine.style.width=0+'px';
		}
	}
	
	
	//音量控制
	oVolBtn.onmousedown=function(ev){
		var e=ev||event;
		e.cancelBubble=true;
		var disX=e.clientX-this.offsetLeft;
		
		document.onmousemove=function(ev){
			var e=ev||event;
			var vL=e.clientX-disX;
			if(vL<0){
				vL=0;
			}else if(vL>oVolumeProBar.offsetWidth-oVolBtn.offsetWidth){
				vL=oVolumeProBar.offsetWidth-oVolBtn.offsetWidth;
			}
			oVolBtn.style.left=vL+'px';
			oVolLine.style.width=vL+'px';
			
			var scaleX=vL/(oVolumeProBar.offsetWidth-oVolBtn.offsetWidth);
			oA.volume=scaleX;
			if(oA.volume==0){
				oHornClose.style.display='block';
				oA.muted=true;
			}else{
				oHornClose.style.display='none';
				oA.muted=false;
			}
		}
		
		document.onmouseup=function(){
			document.onmousemove=document.onmouseup=null;	
		}
		
		return false;
	}
	
	
	
	oCircle.onclick=function(){
		if(onOff){
			startMove(oAudioList,{top:140},500,'bounceOut');
		}else{
			startMove(oAudioList,{top:-140},500,'bounceIn');
		}
		onOff=!onOff;
	}
	
	oPlayPause.onclick=function(){
		if(oA.paused){
			oA.play();
			aSpan[0].style.display='none';
			aSpan[1].style.display='block';
			init();
			nowTime();
			ttt = setInterval(nowTime,1000);
		}else{
			oA.pause();
			aSpan[1].style.display='none';
			aSpan[0].style.display='block';	
			clearInterval(ttt);
		}
	}
	
	oPrev.onclick=function(){
		Num--;	
		if(Num<0){
			Num=oAudioLi.length-1;
		}
		init();
	}
	
	oNext.onclick=function(){
		Num++;	
		if(Num>=oAudioLi.length){
			Num=0;
		}
		init();
	}
	
	for(var i=0;i<oAudioLi.length;i++){
		oAudioLi[i].innerHTML=(i+1)+'. '+musicData[i].title;
		oAudioLi[i].index=i;
		oAudioLi[i].ondblclick=function(){
			Num=this.index;
			init();
			nowTime();
			ttt = setInterval(nowTime,1000);
		}
	}
	
	function init(){
		for(var i=0;i<oAudioLi.length;i++){
			oAudioLi[i].className='';
		}
		oAudioLi[Num].className='cur';
		oA.src=musicData[Num].src;
		oA.play();
		oH2.innerHTML=musicData[Num].title;
		aSpan[0].style.display='none';
		aSpan[1].style.display='block';
		oA.volume=1;
		oVolBtn.style.left=148+'px';
		oVolLine.style.width=148+'px';
	}

	//时钟表盘
	var oClock=document.getElementById('clock');
	var oClockList=document.getElementById('clock_list');	
	var oCss=document.getElementById('css');

	var oHour=document.getElementById('hour');	
	var oMin=document.getElementById('minute');	
	var oSec=document.getElementById('seconds');	
	
	var aClockLi='';
	var sCss='';
	for(var i=0;i<60;i++){
		aClockLi+='<li></li>';
		sCss+='#clock ul li:nth-of-type('+(i+1)+'){ -webkit-transform:rotate('+i*6+'deg);}';
	}
	oClockList.innerHTML=aClockLi;
	oCss.innerHTML+=sCss;
	
	toTime();
	setInterval(toTime,1000);
	function toTime(){
		var oDate=new Date();
		var iSec=oDate.getSeconds();
		var iMin=oDate.getMinutes()+iSec/60;
		var iHour=oDate.getHours()+iMin/60;
		
		oSec.style.WebkitTransform='rotate('+6*iSec+'deg)';	
		oMin.style.WebkitTransform='rotate('+6*iMin+'deg)';	
		oHour.style.WebkitTransform='rotate('+30*iHour+'deg)';		
	}


	//点击换肤效果
	var skin=document.getElementById('skin');
	var oClose=document.getElementById('close');
	var oPicture=document.getElementById('picture');
	var oPicCon=getByClass(oPicture,'pic_con')[0];
	var oSkin=getByClass(oPicture,'skin_list')[0];
	var aSkinImg=oSkin.getElementsByTagName('img');
	var oScrollBar=getByClass(oPicture,'scrollBar')[0];
	var oS_bar=getByClass(oPicture,'s_bar')[0];
	
	var oBody=document.getElementsByTagName('body')[0];
	
	var _top=(view().h-oPicture.offsetHeight)/2;
	oPicture.style.top=view().h+'px';
	
	var skinImg=['img/bg01.jpg','img/bg02.jpg','img/bg03.jpg','img/bg04.jpg','img/bg05.jpg','img/bg06.jpg','img/bg07.jpg','img/bg08.jpg','img/bg09.jpg','img/bg10.jpg'];
	
	skin.onclick=function(){
		startMove(oPicture,{top:_top,opacity:100},400,'bounceOut');	
	}
	
	oClose.onclick=function(){
		startMove(oPicture,{top:view().h,opacity:0},400,'backIn');	
	}
	
	for(var i=0;i<aSkinImg.length;i++){
		aSkinImg[i].onclick=function(){
			oBody.style.backgroundImage='url('+this.src+')';	
		}
	}

	oS_bar.onmousedown=function(ev){
		var e=ev||event;
		var disY=e.clientY-this.offsetTop-oScrollBar.offsetTop;	
		
		document.onmousemove=function(ev){
			var e=ev||event;
			var T=e.clientY-disY;
			if(T<0){
				T=0;
			}else if(T>oScrollBar.offsetHeight-oS_bar.offsetHeight){
				T=oScrollBar.offsetHeight-oS_bar.offsetHeight;
			}
			oS_bar.style.top=T+'px';
			
			var scale=T/(oScrollBar.offsetHeight-oS_bar.offsetHeight);
			oSkin.style.top=-scale*(oSkin.offsetHeight-oPicCon.offsetHeight)+'px';
			
		}
		
		document.onmouseup=function(){
			document.onmousemove=document.onmouseup=null;
		}
		
		return false;
	}

	bind(oPicture,'mousewheel',fn1);
	bind(oPicture,'DOMMouseScroll',fn1);
	
	function fn1(ev){
		var e=ev||event;
		var b=true;
		var _T=0;
		e.cancelBubble=true;
		
		if(e.wheelDelta){
			b=e.wheelDelta>0?true:false;
		}else{
			b=e.detail<0?true:false;	
		}
		
		if(b){
			_T=oS_bar.offsetTop-10;
		}else{
			_T=oS_bar.offsetTop+10;
		}
		
		if(_T<0){
			_T=0;
		}else if(_T>oScrollBar.offsetHeight-oS_bar.offsetHeight){
			_T=oScrollBar.offsetHeight-oS_bar.offsetHeight;
		}
		
		oS_bar.style.top=_T+'px';
			
		var scale=_T/(oScrollBar.offsetHeight-oS_bar.offsetHeight);
		oSkin.style.top=-scale*(oSkin.offsetHeight-oPicCon.offsetHeight)+'px';
		
		if(e.preventDefault){
			e.preventDefault();	
		}
		
		return false;
	}
	
	
	//左侧弹出面板
	var oMenu=document.getElementById('menu');
	var oSide_nav=document.getElementById('side_nav');
	var oSideClose=getByClass(oSide_nav,'snp-ft')[0];
	
	oMenu.onclick=function(){
		startMove(oSide_nav,{left:74,opacity:100},400,'bounceOut');	
	}
	
	oSideClose.onclick=function(){
		startMove(oSide_nav,{left:-182,opacity:0},400,'bounceIn');
	}
	
	//右键菜单
	var oContextmenu=document.getElementById('contextmenu');
	var oRefresh=document.getElementById('refresh');
	
	document.oncontextmenu=function(ev){
		var e=ev||event;
		e.cancelBubble=true;
		
		oContextmenu.style.display='block';
		oContextmenu.style.left=e.clientX+'px';
		oContextmenu.style.top=e.clientY+'px';
			
		return false;	
	}
	
	document.onclick=function(){
		oContextmenu.style.display='none';	
	}
	
	//刷新
	oRefresh.onclick=function(){
		window.location.href='webQQ.html';
	}
	
	//桌面图标数据
	var appDate=[
		{
			src:'img/sina.png',
			name:'新浪',
			url:'http://www.sina.com.cn/'
		},
		{
			src:'img/sohu.png',
			name:'搜狐',
			url:'http://www.sohu.com'
		},
		{
			src:'img/tx.png',
			name:'腾讯网',
			url:'http://www.qq.com'
		},
		{
			src:'img/sg.png',
			name:'搜狗地图',
			url:'http://map.sogou.com/'
		},
		{
			src:'img/tbao.png',
			name:'淘宝网',
			url:'http://www.taobao.com'
		},
		{
			src:'img/dd.png',
			name:'当当网',
			url:'http://www.dangdang.com'
		},
		{
			src:'img/365.png',
			name:'365',
			url:'http://www.365rili.com/'
		},
		{
			src:'img/aiqy.png',
			name:'爱奇艺',
			url:'http://www.iqiyi.com/'
		},
		{
			src:'img/gh.png',
			name:'工商银行',
			url:'http://www.icbc.com.cn/'
		},
		{
			src:'img/jh.png',
			name:'建设银行',
			url:'http://www.ccb.com/'
		},
		{
			src:'img/nh.png',
			name:'农业银行',
			url:'http://www.abchina.com/'
		},
		{
			src:'img/hj.png',
			name:'沪江网校',
			url:'http://class.hujiang.com/'
		},
		{
			src:'img/mk.png',
			name:'慕课网',
			url:'http://www.imooc.com/'
		},
		{
			src:'img/W3C.png',
			name:'W3C',
			url:'http://www.w3school.com.cn/'
		},
		{
			src:'img/yx.png',
			name:'易迅网',
			url:'http://www.yixun.com'
		},
		{
			src:'img/tbao.png',
			name:'淘宝网',
			url:'http://www.taobao.com'
		},
		{
			src:'img/dd.png',
			name:'当当网',
			url:'http://www.dangdang.com'
		},
		{
			src:'img/365.png',
			name:'365',
			url:'http://www.365.com'
		},
		{
			src:'img/letv.png',
			name:'乐视TV',
			url:'http://www.letv.com/'
		},
		{
			src:'img/mgj.png',
			name:'蘑菇街',
			url:'http://www.mogujie.com/'
		},
		{
			src:'img/sina.png',
			name:'新浪',
			url:'http://www.sina.com.cn/'
		},
		{
			src:'img/sohu.png',
			name:'搜狐',
			url:'http://www.sohu.com'
		},
		{
			src:'img/tx.png',
			name:'腾讯网',
			url:'http://www.qq.com'
		},
		{
			src:'img/sg.png',
			name:'搜狗地图',
			url:'http://map.sogou.com/'
		},
		{
			src:'img/tbao.png',
			name:'淘宝网',
			url:'http://www.taobao.com'
		}
	];

	for(var i=0;i<allLi.length;i++){
		allLi[i].innerHTML='<img src="'+appDate[i].src+'" /><h2>'+appDate[i].name+'</h2>';
	}
	
	//应用弹出层	
	var oPen=document.getElementById('open_wrap');
	var oEm=getByClass(oPen,'open_tit')[0];
	var oMini=getByClass(oPen,'mini')[0];
	var oMaxi=getByClass(oPen,'maxi')[0];
	var oRegain=getByClass(oPen,'regain')[0];
	var oClose=getByClass(oPen,'close')[0];
	var oPenCon=getByClass(oPen,'open_con')[0];
	var oIframe=getId('iframe');
	
	var _left=(view().w-oPen.offsetWidth)/2;
	oPen.style.left=_left+'px';
	
	for(var i=0;i<allLi.length;i++){
		allLi[i].num=i;
		allLi[i].ondblclick=function(){
			startMove(oPen,{top:_top},400,'backOut');	
			oEm.innerHTML=this.getElementsByTagName('h2')[0].innerHTML;
			oIframe.src=appDate[this.num].url;
		}
	}
	
	oMini.onclick=function(){
		startMove(oPen,{width:166,height:35,top:view().h-35,left:72},200);
		this.style.display='none';
		oMaxi.style.display='block';
		oRegain.style.display='block';	
	}
	
	oMaxi.onclick=function(){
		startMove(oPen,{width:view().w,height:view().h,top:0,left:0},200);
		this.style.display='none';
		oMini.style.display='block';
		oRegain.style.display='block';
	}
	
	oRegain.onclick=function(){
		startMove(oPen,{width:560,height:400,top:_top,left:_left},200);
		this.style.display='none';
		oMaxi.style.display='block';
		oMini.style.display='block';
	}
	
	oClose.onclick=function(){
		startMove(oPen,{top:-500},400,'backIn');
	}
	
	//播放器及表盘拖拽
	dragFn(oClock);
	dragFn(html5);
	

	
	
}



