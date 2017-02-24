//STAP message exchange via jsonp
//	current url must include a parameter "l" which specifies the url for the task;
//	the task url will include a parameter d, the value of which will be a STAP-compliant user message, e.g.:
//		http://taskServer/taskScript?d=<<STAPmsg>>
//	the task url must return executable javascript that includes a call to recv(msg),
//		where the parameter msg is a legal STAP task->actor message;
//		additionally, if the url task script is stateless,
//			the callback can include a change to STATE, e.g.:
//				STATE=0; recv([ "hello world" ]);
//          the value of STATE will be included in the next callback to task url, e.g.:
//				http://taskServer/taskScript?d=<<STAPmsg>>&s=<<STATE>>
//

var PARAMS={};location.search.substr(1).split("&").forEach(function(a){var b=a.split("=");PARAMS[b[0]]=b[1]});
var LOC=PARAMS['l'];
var HEAD = document.getElementsByTagName('head')[0];

var state;


function urlWithQuery(url){
	var i=url.indexOf('?');
	if(i===-1)return url+'?';
	if(i===url.length-1 || url.endsWith('&'))return url;
	return url+'&';
}

function send(msg){
	console.log('<- '+msg);
	var s=document.createElement('script');
	if(state!==undefined)s.src=LOC+'d='+encodeURIComponent(msg)+'&s='+encodeURIComponent(state);
	else s.src=LOC+'d='+encodeURIComponent(msg);
	HEAD.appendChild(s);
}

function recv(data){
	console.log('-> ',data);
	processData(data);
}

function connect(){
	LOC=urlWithQuery(LOC);
	onTaskConnect();
}

