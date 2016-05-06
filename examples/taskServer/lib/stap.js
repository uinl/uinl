/*base template for STAP visualizationualization

BUG:
	number seems to be allowed to be out of numspec bounds

TODO for latest STAP release:
	add _vis, _tb, _i+, _i*, _., _task
*/

//////////////////////////////////////////////////////////////////////////////
// helper functions
dp=function(s){console.log(typeof(s)=="string"?s:JSON.stringify(s));};
function round2(n,r){return (Math.round(n/r) * r);}
if(String.prototype.startsWith===undefined)String.prototype.startsWith=function(prefix){return this.slice(0,prefix.length)===prefix;};
if(String.prototype.endsWith===undefined)String.prototype.endsWith=function(suffix){return this.slice(this.length-suffix.length)===suffix;};
String.prototype.replaceAll = function(search, replacement) {
	return this.split(search).join(replacement);
};
Date.prototype.format = function (format, utc){return formatDate(this, format, utc);};
TIMEZONEOFFSET=new Date().getTimezoneOffset()* 60000
function formatDate(date, format, utc){
	var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	function ii(i, len) { var s = i + ""; len = len || 2; while (s.length < len) s = "0" + s; return s; }
 
	var y = utc ? date.getUTCFullYear() : date.getFullYear();
	format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
	format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
	format = format.replace(/(^|[^\\])y/g, "$1" + y);
 
	var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
	format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
	format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
	format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
	format = format.replace(/(^|[^\\])M/g, "$1" + M);
 
	var d = utc ? date.getUTCDate() : date.getDate();
	format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
	format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
	format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
	format = format.replace(/(^|[^\\])d/g, "$1" + d);
 
	var H = utc ? date.getUTCHours() : date.getHours();
	format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
	format = format.replace(/(^|[^\\])H/g, "$1" + H);
 
	var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
	format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
	format = format.replace(/(^|[^\\])h/g, "$1" + h);
 
	var m = utc ? date.getUTCMinutes() : date.getMinutes();
	format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
	format = format.replace(/(^|[^\\])m/g, "$1" + m);
 
	var s = utc ? date.getUTCSeconds() : date.getSeconds();
	format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
	format = format.replace(/(^|[^\\])s/g, "$1" + s);
 
	var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
	format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
	f = Math.round(f / 10);
	format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
	f = Math.round(f / 10);
	format = format.replace(/(^|[^\\])f/g, "$1" + f);
 
	var T = H < 12 ? "AM" : "PM";
	format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
	format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));
 
	var t = T.toLowerCase();
	format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
	format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));
 
	var tz = -date.getTimezoneOffset();
	var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
	if (!utc)
	{
		tz = Math.abs(tz);
		var tzHrs = Math.floor(tz / 60);
		var tzMin = tz % 60;
		K += ii(tzHrs) + ":" + ii(tzMin);
	}
	format = format.replace(/(^|[^\\])K/g, "$1" + K);
 
	var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
	format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
	format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);
 
	format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
	format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);
 
	format = format.replace(/\\(.)/g, "$1");
 
	return format;
};
function firstkey(obj){return Object.keys(obj)[0];}
function set(a){var o={};for(var key in a)o[a[key]]="";return o;}
function find1common(obj1,obj2){
	for(key in obj1)if(obj2.hasOwnProperty(key))return key;
	return false;
}
function objectify(o){
	var r={};
	for(var key in o)
		if(typeof(o[key])=='object')r[key]=objectify(o[key]);
		else r[key]=o[key];
	return r;
}
function loadURLs(urls, callback){
	var url, onload, fileref;
	if(urls.constructor===Array)url=urls.shift();
	else{url=urls;urls=[];}
	if(urls.length)onload=function(){loadURLs(urls,callback);};
	else onload=callback;
	dp(url);
	if (url.endsWith(".js")){ //if filename is a external JavaScript file
		fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", url)
	}
	else { //if filename is an external CSS file
		fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", url)
	}
	fileref.onreadystatechange=onload;
	fileref.onload=onload;
	document.getElementsByTagName('head')[0].appendChild(fileref);
}
//////////////////////////////////////////////////////////////////////////////
 
var BTNUP=1,
	BTNDOWN=2,
	CLICK=3,
	DBLCLICK=4,
	MOVE=8,
	MOUSEENTER=16,
	MOUSELEAVE=32;

var ONSUBMIT_NOTHING=1,
	ONSUBMIT_DISABLE=0,
	ONSUBMIT_CLEAR=-1;


var PORT=location.search.substr(1)||8719;
var HOST=location.hostname || "localhost";
//var HOST="eloi.ncsa.illinois.edu";

var SVGNS="http://www.w3.org/2000/svg";
var STAP2STYLE={'x':'left','y':'top','w':'width','h':'height','r':'borderRadius','bg':'backgroundColor','bd':'borderStyle','bdw':'borderWidth','bdc':'borderColor','pad':'padding','fnt':'font','col':'color','rot':'rotation'};
var PXSTYLE=set(['x','y','w','h','r']);
var EASE;//defined after GSAP loads

var ws,maindiv,msgTimeouts={},txtReplace={};


//////////////////////////////////////////////////////////////////////////////
 
function replaceShorthand(s){
	for(var shorthand in txtReplace){
		s=s.replaceAll(shorthand,txtReplace[shorthand]);
	}
	return s;
}
 
function addDiv(container,classes){
	var c=container.appendChild(document.createElement('div'));
	for(var i=0;i<classes.length;++i)c.classList.add(classes[i].replace(/[^\w-_]/gi, '_'));
	return c;
}
 
function addDivs(container,type,level,key){
	if(type=='_ln_child'){
		var path=container.parentElement.svg.appendChild(document.createElementNS(SVGNS,'path'));
		path._type='_ln_child';
		path.setAttribute('stroke-width',1);
		path.setAttribute('stroke','black');
		path.setAttribute('fill','none');
		return path;
	}else{
		var cf=addDiv(container,[type,'lvl_'+level,'id_'+key,'frame']);
		var c=addDiv(cf,[type,'lvl_'+level,'id_'+key,'main']);
		c._frame=cf;
		c._parentState=container.parentElement;
		c._key=addDiv(c,[type,'lvl_'+level,'id_'+key,'key']);
		var cs=addDiv(c,[type,'lvl_'+level,'id_'+key,'sep']);
		c._content=addDiv(c,[type,'lvl_'+level,'id_'+key,'content']);
		c.id=key;
		c._type=type;
		c._childmap={};
		c._numspec={};
		c._hide=function(){cf.style.visibility='hidden';};
		c._unhide=function(){cf.style.visibility='visible';};
		c._clear=function(){
			c._content.innerHTML='';
			c._childmap={};
			c._numspec={};
			c._value=0;
			c._type=undefined;
		};
		c._remove=function(){
			//cf.remove();
			cf.parentElement.removeChild(cf);
			delete container.parentElement._childmap[key];
			c._type=undefined;
		};
		c._setclass=function(cls){
			cls=cls.replace(/[^\w-_]/gi, '_');
			c._clear();
			cf.classList.remove(c._type);
			c.classList.remove(c._type);
			c._key.classList.remove(c._type);
			cs.classList.remove(c._type);
			c._content.classList.remove(c._type);
			cf.classList.add(cls);
			c.classList.add(cls);
			c._key.classList.add(cls);
			cs.classList.add(cls);
			c._content.classList.add(cls);
			c._type=cls;
		};
		return c;
	}
}
 
function sendAction(element,val){
	var action={};
	action[element.id || element]=val;
	ws.send(JSON.stringify(action));
	dp({'<-':action});
	//console.log(element,element._specialOptions);
	//dp(typeof(element));
	if(typeof(element)==="object" && "onsubmit" in element._specialOptions){
		if(element._specialOptions.onsubmit==ONSUBMIT_DISABLE)element.classList.add('disabled');
		else if(element._specialOptions.onsubmit==ONSUBMIT_CLEAR)element._clear()
	}
}

function getEaseSpec(options){
	var easeSpec=Linear.easeNone;
	if(typeof(options)==='object'){
		var ease=Linear;
		if(options.ease)ease=EASE[options.ease];
		if(options.easeout==-1)easeSpec=ease.easeIn;
		else if(options.easeout==0)easeSpec=ease.easeInOut;
		else easeSpec=ease.easeOut;
	}
	return easeSpec;
}

function setDivOptions(div,options){
	//TODO: test all options
	if(options.hasOwnProperty('_T')){
		var ani=options._T.s || 1,
			newOptions={ease:getEaseSpec(options._T)};
		if(options._T.tid){
			newOptions.onComplete=sendAction;
			newOptions.onCompleteParams=[options._T.tid,0];
		}
		delete options._T;
		for(var key in options){
			//if(key=='bg')newOptions['colorProps']={'background':options[key]};
			//else
			newOptions[STAP2STYLE[key]]=options[key];
		}
		TweenLite.to(div,ani,newOptions);
	}else{
		if(options.hasOwnProperty('w')){
			div.style.width=options.w;
			//div.svg.setAttribute('width',options.w);
		}
		if(options.hasOwnProperty('h')){
			div.style.height=options.h;
			//div.svg.setAttribute('height',options.h);
		}
		if(options.hasOwnProperty('x'))div.style.left=options.x;
		if(options.hasOwnProperty('y')){
			div.style.top=options.y;
			if(!div.classList.contains('xy')){
				div.classList.add('xy');
				div.parentElement.classList.add('xy');
				div.parentElement.parentElement.classList.add('xy');
			}
		}
		if(options.hasOwnProperty('r'))div.style.borderRadius=options.r+'px';
		if(options.hasOwnProperty('bg'))div.style.backgroundColor=options.bg;
		if(options.hasOwnProperty('bd'))div.style.border=options.bd;
		if(options.hasOwnProperty('bdw'))div.style.borderWidth=options.bdw;
		if(options.hasOwnProperty('bdc'))div.style.borderColor=options.bdc;
		if(options.hasOwnProperty('pad'))div.style.padding=options.pad;
		if(options.hasOwnProperty('fnt'))div.style.font=options.fnt;
		if(options.hasOwnProperty('col'))div.style.color=options.col;
		if(options.hasOwnProperty('rot'))div.style.setProperty('transform','rotate('+options.rot+'deg)');
	}
	/*	if('MozTransform' in document.body.style)
			div.style.setProperty('-moz-transform','rotate('+options.rot+'deg)');
		else if('webkitTransform' in document.body.style)
			div.style.setProperty('-webkit-transform','rotate('+options.rot+'deg)');*/
}
 
function makeMarker(path,end,markerType,width){
	if(markerType==='arrow' || markerType==='circle' || markerType==='square'){
		path.setAttribute('marker-'+end,'url(#marker'+markerType+')');
	}else{
		path.setAttribute('marker-'+end,'none');
	}
}
 
function setPathOptions(path,options){
	// <marker id="markerCircle" markerWidth="8" markerHeight="8" refX="5" refY="5">
		// <circle cx="5" cy="5" r="3" style="stroke: none; fill:#000000;"/>
	// </marker>
 
	// <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6"
		   // orient="auto">
		// <path d="M2,2 L2,11 L10,6 L2,2" style="fill: #000000;" />
	// </marker>
	var width=options.w || 1;
	path.setAttribute('stroke-width',width);
	path.setAttribute('stroke',options.c || 'black');
	path.setAttribute('fill',options.f || 'none');
	if(options.hasOwnProperty('cap'))path.setAttribute('stroke-linecap',options.cap);
	if(options.hasOwnProperty('dash'))path.setAttribute('stroke-dasharray',options.dash);
	if(options.hasOwnProperty('start'))makeMarker(path,'start',options.start);
	if(options.hasOwnProperty('end'))makeMarker(path,'end',options.end);
}
 
function sendText(e){
	if(e.target.innerHTML!==e.target._oldInnerHTML){
		if('pwd' in e.target.parentElement._specialOptions)
			sendAction(e.target.parentElement, SHA1(e.target.parentElement._specialOptions.pwd+e.target.innerText));
		else
			sendAction(e.target.parentElement,e.target.innerHTML);
		e.target._oldInnerHTML=e.target.innerHTML;
	}
}
 
function addEvents(container,events){
	for(var i in events){
		if(events[i]==CLICK){
			container.onclick=function(e){
				var rect = container.getBoundingClientRect();
				sendAction(container.parentElement.id,[CLICK,e.clientX-rect.left,e.clientY-rect.top]);
			};
		}else if(events[i]==DBLCLICK){
			container.ondblclick=function(e){
				var rect = container.getBoundingClientRect();
				sendAction(container.parentElement.id,[DBLCLICK,e.clientX-rect.left,e.clientY-rect.top]);
			};
		}else if(events[i]==BTNDOWN){
			container.onmousedown=function(e){
				var rect = container.getBoundingClientRect();
				sendAction(container.parentElement.id,[BTNDOWN,e.clientX-rect.left,e.clientY-rect.top]);
			};
			container.onmouseup=function(e){
				var rect = container.getBoundingClientRect();
				sendAction(container.parentElement.id,[BTNUP,e.clientX-rect.left,e.clientY-rect.top]);
			};
		}else if(events[i]==MOVE){
			container.onmousemove=function(e){
				var rect = container.getBoundingClientRect();
				sendAction(container.parentElement.id,[e.clientX-rect.left,e.clientY-rect.top]);
			};
		}else if(events[i]==MOUSEENTER){
			container.onmouseenter=function(e){
				var rect = container.getBoundingClientRect();
				sendAction(container.parentElement.id,[MOUSEENTER,e.clientX-rect.left,e.clientY-rect.top]);
			};
		}else if(events[i]==MOUSELEAVE){
			container.onmouseleave=function(e){
				var rect = container.getBoundingClientRect();
				sendAction(container.parentElement.id,[MOUSELEAVE,e.clientX-rect.left,e.clientY-rect.top]);
			};
		}
	}
}

specialElementOption={
	disabled:function(container,value){
		if(value)container.classList.add('disabled');
		else if(container.classList.contains('disabled'))container.classList.remove('disabled');
		if(container._content.getAttribute('contenteditable'))
			container._content.setAttribute('contenteditable',!value);
	},
	lines:function(container,value){
		container._content.style.overflowY="scroll";
		//dp(['size',window.getComputedStyle(container._content).fontSize,window.getComputedStyle(container._content).padding]);
		container._content.style.height=(2*value*(2*parseInt(window.getComputedStyle(container._content).padding)+parseInt(window.getComputedStyle(container._content).fontSize)))+"px";
	}
}
function processOptions(data,container){
	if(data.hasOwnProperty('_nm'))Object.assign(container._numspec,data._nm);
	if(data.hasOwnProperty('_bx'))setDivOptions(container._content,data._bx);
	if(data.hasOwnProperty('_ev'))addEvents(container._content,data._ev);
	if(container._specialElement && container._type in data){
		for(var key in data[container._type]){
			if(key in specialElementOption)
				specialElementOption[key](container,data[container._specialElement][key]);
			else if(data[container._specialElement][key]===null)
				delete container._specialOptions[key];
			else
				container._specialOptions[key]=data[container._specialElement][key];
		}
	}
}
elementTypes={
	'object':processState,
	'number':function(data,container,level){
		//create numspec based on parents
		var key,parent=container,
			numspec=Object.assign({},container._numspec);
		while(parent!==maindiv && parent!==ppdiv){
			parent=parent._parentState;
			for(key in parent._numspec)
				if(!(key in numspec))
					numspec[key]=parent._numspec[key];
		}
		//process numspec
		if(typeof(data)!=='number')data=container._value||numspec['=']||0;
		if(numspec.rnd!==undefined){
			data=round2(data,numspec.rnd);
			if(numspec.rnd<1){
				data=data.toFixed((''+numspec.rnd).split('.')[1].length);
			}
		}
		container._value=data;
		if(numspec.unit){
			data=(numspec.unit=='$')?'$'+data:data+''+numspec.unit;
		}else if(numspec.time){
			data=new Date(1000*data).format(numspec.time);
		}
		if(numspec.hasOwnProperty('<=') && numspec.hasOwnProperty('>=')){
			if(!container._progressbar){
				container._content.classList.add("progress");
				container._progressbar=addDiv(container._content,["progressbar"]);
				container._progressval=addDiv(container._content,["progressval"]);
			}
			container._progressbar.style.width=(100*(container._value-numspec['>='])/(numspec['<=']-numspec['>=']))+'%';
			container._progressval.innerHTML=data;
		}else if(numspec.hasOwnProperty('<=')){
			container._content.innerHTML=data+" of "+numspec['<=']+"\n";
		}else{
			container._content.innerHTML=data;
		}
	},
	'string':function(data,container,level){
		if(typeof(data)==="object")processState(data,container,level);
		else container._content.innerHTML=replaceShorthand(data);
	},
	'boolean':function(data,container){container._content.innerHTML=data;},
	'_i':processState,
	'_ih':processState,
	'_i2':processState,
	'_i1':processState,
	'_i_child':function(data,container){
		//console.log(data);
		if(data.hasOwnProperty('_bx'))setDivOptions(container._content,data._bx);
		if(!container.onclick){
			var r={};
			r[container.id]=CLICK;
			container.onclick=function(){sendAction(container._parentState,r);};
		}
	},
	'_ih_child':function(data,container){
		container._content.innerHTML=data;
		container._content.onmousedown=function(){sendAction(container,BTNDOWN);};
		container._content.onmouseup=function(){sendAction(container,BTNUP);};
	},
	'_i2_child':function(data,container){
		//TODO: allow SHFT and long-hold to start multi-select process
		if(data==BTNDOWN)container._key.setAttribute("_selected",1);
		container.onclick=function(){
			var r={};
			if(container._key.getAttribute("_selected")==1){
				container._key.setAttribute("_selected",0);
				r[container.id]=BTNUP;
			}else{
				container._key.setAttribute("_selected",1);
				r[container.id]=BTNDOWN;
			}
			sendAction(container._parentState,r);
		};
	},
	'_i1_child':function(data,container){
		//TODO: if(data===1)container._key.setAttribute("_selected",1);
		var parentState=container._parentState;
		function selectItem(){
			var r={};
			if(parentState._selectedDiv!==container){
				if(parentState._selectedDiv!==undefined)
					parentState._selectedDiv._key.setAttribute('_selected',0);
				parentState._selectedDiv=container;
				container._key.setAttribute("_selected",1);
				r[container.id]=BTNDOWN;
			}else{
				parentState._selectedDiv=undefined;
				container._key.setAttribute("_selected",0);
				r[container.id]=BTNUP;
			}
			sendAction(container._parentState,r);
		};
		if(data==BTNDOWN)selectItem();
		container.onclick=selectItem;
	},
	'_ix':function(data,container){
		if(typeof(data)==="object"){
			if("#0" in data)container._content.innerHTML=replaceShorthand(data["#0"]);
			//processOptions(data,container);
		}else container._content.innerHTML=replaceShorthand(data);
		if(container._content.getAttribute('contenteditable')===null){
			container._content.setAttribute('contenteditable',true);
			container._content.onblur=sendText;
			container._content.onkeypress=function(e){if(e.keyCode==13){sendText(e);return false;}};
		}
	},
	'_i*':function(data,container){},
	'_ln':function(data,container,level){
		if(container.svg===undefined){
			container.svg=container.appendChild(document.createElementNS(SVGNS,'svg'));
			container.svg.cssText="position:absolute;left:0px;top:0px;width:100%;height:100%";
			container.svg.setAttribute('width','1000');
			container.svg.setAttribute('height','1000');
		}
		processState(data,container,level);
	},
	'_ln_child':function(data,container){
		if(data.constructor==Array){
			container.setAttribute('d',"M"+data);
		}
	},
	'_tb':function(data,container){},
}
specialElements=set(['_i','_ih','_i2','_i1','_ix','_ip','_i*','_ln','_tb']);
compatible={
	'object':set(['_i','_ih','_i1','_i2','_ix','_ln']),
	'string':set(['_ix']),
	'number':set(['_i1_child','_i2_child']),
	'boolean':set(['_i1_child','_i2_child']),
}

function isState(o){
	for(var subkey in o){
		if(!key.startsWith('_')) return true;
	}
	return false;
}

function getType(val){
	if(val===undefined)return 'string';
	var specialType,type=typeof(val);
	if(type==='object')specialType=find1common((val.constructor==Array)?set(val):val,specialElements);
	return specialType || type;
}

function animationFrame(data,container,level){
	if(container.offsetParent){
		elementTypes[container._type](data.value,container,level);
	}else{
		container._tween.kill();
		delete container._tween;
	}
}

function processState(data,container,level){
	var child,typeofval,displaykey,keys=[];
	//get data keys
	if(data.constructor==Array){
		if(data[0].constructor==Array){
			var data2={};
			for(var i=0;i<data.length;++i){
				keys.push(data[i][0]);
				data2[data[i][0]]=data[i][1];
			}
			data=data2;
		}else{
			keys=data;
			data={};
		}
	}else keys=Object.keys(data);
	//animated changes
	if(data.hasOwnProperty('_T')){
		//animate values
		//TODO: account for text/object, and ""/null value animations
		for(var key in data){
			if(key in container._childmap && typeof(data[key])==='number'){
				child=container._childmap[key];
				if(child._tween)child._tween.kill();
				var curnum={value:child._value||0};
				var aniopt={ease:getEaseSpec(data._T),
						onUpdate:animationFrame,
						onUpdateParams:[curnum,child,level+1],
						value:data[key]};
				if(data._T.tid){
					aniopt.onComplete=sendAction;
					aniopt.onCompleteParams=[data._T.tid,0];
				}
				child._tween=TweenLite.to(curnum,data._T.s || 1,aniopt);
			}
		}
		return;
	}
	//non-animated changes
	for(var i=0,key=keys[0];i<keys.length;key=keys[++i]){
		key=''+key;
		if(!key.startsWith('_')){
			child=container._childmap[key];
			if(data[key]===null){if(child)child._remove();}
			else if(child && data[key]===""){child._clear();}
			else{
				if(data[key]===undefined)data[key]="";
				if(container._specialElement)typeofval=container._specialElement+"_child";
				else typeofval=getType(data[key]);
				displaykey=key.startsWith('#')?'':replaceShorthand(key.trim());
				if(child===undefined){ //new child
					if(typeofval==='object' && data[key].hasOwnProperty("_nm") && !isState(data[key]))
						typeofval="number";
					child=addDivs(container._content,typeofval,level+1,key);
					if(child._type in specialElements){
						child._specialElement=child._type;
						child._specialOptions={};
					}
					if(typeofval!="_ln_child"){
						child._key.innerHTML=displaykey;
					}
					container._childmap[key]=child;
				}else if(child._type!==typeofval && !(compatible[typeofval] && (child._type in compatible[typeofval])) && !(typeofval==='object' && !isState(data[key]))){
					child._setclass(typeofval);
					if(child._type in specialElements)child._specialElement=child._type;
					child._specialOptions={};
				}
				processOptions(data[key],child);
				elementTypes[child._type](data[key],child,level+1);
			}
		}
	}
}
 
function processData(data){
	dp({"->":data});
	// process special root directives
	if(data===null){maindiv._clear();return;}
	if(typeof(data)==="string"){
		var txt=data;
		data={};
		data["#"+Object.keys(maindiv._childmap).length]=txt;
	}
	if(data.hasOwnProperty('_error')){
		dp({'ERROR':data._error});
		delete data._error;
	}
	if(data.hasOwnProperty('_clientinfo')){
		var reply={};
		for(var i=0;i<data['_clientinfo'].length;++i){
			if(data['_clientinfo'][i]=='url'){
				reply['url']=objectify(location);
			}else if(data['_clientinfo'][i]=='screen'){
				reply['screen']=objectify(screen);
			}else if(data['_clientinfo'][i]=='ip'){
				reply['ip']=''; //TODO: fix this
			}else if(data['_clientinfo'][i]=='userAgent'){
				reply['userAgent']=clientInformation.userAgent;
			}
		}
		sendAction('_clientinfo',reply);
	}
	if(data.hasOwnProperty('_template')){
		var url=data._template;
		delete data._template;
		loadURLs(url,function(){processData(data);});
		return;
	}
	if(data.hasOwnProperty('_unloadwarn')){
		var txt=data._unloadwarn;
		delete data._unloadwarn;
		if(txt==null)onbeforeunload=null;
		else onbeforeunload=function(){return txt;};
	}
	if(data.hasOwnProperty('_replace')){
		for(key in data._replace){
			if(data._replace[key]===null)delete txtReplace[key];
			else txtReplace[key]=data._replace[key];
		}
		delete data._replace;
	}
	if(data.hasOwnProperty('_task')){/*TODO*/}
	if(data.hasOwnProperty('_W')){
		var waitID,wait;
		if(typeof(data._W)=='number')wait=data._W;
		else{
			waitID=firstkey(data._W);
			wait=data._W[waitID];
		}
		//dp('WAIT '+waitID+'  '+ wait+'  '+ JSON.stringify(data));
		delete data._W;
		if(waitID===undefined){
			setTimeout(function(){processData(data);}, wait*1000);
			return;
		}else{
			if(msgTimeouts[waitID]){
				clearTimeout(msgTimeouts[waitID].timer);
				if(wait==null)delete msgTimeouts[waitID];
				else if(!wait){
					var data=msgTimeouts[waitID].data;
					delete msgTimeouts[waitID];
					processData(data);
				}else{
					msgTimeouts[waitID]=setTimeout(function(){
						var data=msgTimeouts[waitID].data;
						delete msgTimeouts[waitID];
						processData(data);
						sendAction(waitID,0);
					}, wait*1000);
				}
			}else{
				msgTimeouts[waitID]={};
				msgTimeouts[waitID].data=data;
				msgTimeouts[waitID].timer=setTimeout(function(){
					delete msgTimeouts[waitID];
					processData(data);
					sendAction(waitID,0);
				}, wait*1000);
				return;
			}
		}
	}
	if(data.hasOwnProperty('_pp')){
		if(data._pp===null || data._pp===""){
			ppdiv._hide();
			ppdiv._clear();
		}else{
			if(maindiv._childmap["#_pp"]==undefined)
				maindiv._childmap["#_pp"]=ppdiv;
			data['#_pp']=data._pp;
			ppdiv._unhide();
		}
		delete data._pp;
	}
	// process other special directives
	processOptions(maindiv,data);
	//process state
	processState(data,maindiv,0);
}
 
function processMsg(msg){
	processData(JSON.parse(msg.data));
}
 
function initMarkers(){
	document.body.innerHTML='<svg width=0 height=0>\
		<defs>\
			<marker id="markercircle" markerWidth="2" markerHeight="2" refX="1" refY="1" markerUnits="strokeWidth">\
				<circle cx="1" cy="1" r="1" style="stroke: none; fill:#000000;"/>\
			</marker>\
			<marker id="markersquare" markerWidth="2" markerHeight="2" refX="1" refY="1" orient="auto" markerUnits="strokeWidth">\
				<rect x="0" y="0" width="2" height="2" style="stroke: none; fill:#000000;"/>\
			</marker>\
			<marker id="markerarrow2" markerWidth="4" markerHeight="3" refX="4" refY="1"\
				   orient="auto" markerUnits="strokeWidth">\
				<path d="M0,0 L0,2 L3,1 L0,0" style="fill: #000000;" />\
			</marker>\
			<marker id="markerarrow" markerWidth="5" markerHeight="5" refX="2" refY="2"\
				   orient="auto" markerUnits="strokeWidth" fill-rule="currentColor">\
				<path d="M0,0 L0,4 L4,2 L0,0"  />\
			</marker>\
		</defs>\
		</svg>';
}
 
function init(){
	EASE={0:Power0,1:Power1,2:Power2,3:Power3,4:Power4,back:Back,elastic:Elastic,bounce:Bounce};
	ws=new window.WebSocket('ws://'+HOST+':'+PORT);
	ws.onerror=function(e){alert(e);};
	ws.onopen=function(){maindiv._clear();dp('ws connection established.');}
	//ws.onclose=function(){alert('Connection closed. Goodbye.');}
	ws.onmessage=processMsg;
}
 
function main(){
	loadURLs("lib/stap.css");
	initMarkers();
	maindiv=addDivs(document.body,'obj',0,"__main__");
	ppdiv=addDivs(document.body,'obj',0,"__pp__");
	ppdiv._hide();
	ppdiv._parentState=maindiv;
	processData('Loading...');
	loadURLs("https://fonts.googleapis.com/icon?family=Material+Icons");
	loadURLs([
		//"https://fonts.googleapis.com/icon?family=Material+Icons",
		"lib/sha1.js",
		"lib/gsap/TweenLite.min.js",
		"lib/gsap/easing/EasePack.min.js",
		"lib/gsap/plugins/CSSPlugin.min.js",
		"lib/gsap/plugins/ColorPropsPlugin.min.js",
		"lib/gsap/plugins/AttrPlugin.min.js",
		"lib/gsap/plugins/TextPlugin.min.js"
	],init);
}
 
 
onload=main;