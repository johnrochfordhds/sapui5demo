define("tinymce/pasteplugin/Utils",["tinymce/util/Tools","tinymce/html/DomParser","tinymce/html/Schema"],function(T,D,S){function f(c,a){T.each(a,function(v){if(v.constructor==RegExp){c=c.replace(v,'');}else{c=c.replace(v[0],v[1]);}});return c;}function i(h){var s=new S(),d=new D({},s),a='';var b=s.getShortEndedElements();var c=T.makeMap('script noscript style textarea video audio iframe object',' ');var e=s.getBlockElements();function w(n){var g=n.name,j=n;if(g==='br'){a+='\n';return;}if(b[g]){a+=' ';}if(c[g]){a+=' ';return;}if(n.type==3){a+=n.value;}if(!n.shortEnded){if((n=n.firstChild)){do{w(n);}while((n=n.next));}}if(e[g]&&j.next){a+='\n';if(g=='p'){a+='\n';}}}h=f(h,[/<!\[[^\]]+\]>/g]);w(d.parse(h));return a;}function t(h){function a(b,s,c){if(!s&&!c){return' ';}return'\u00a0';}h=f(h,[/^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/g,/<!--StartFragment-->|<!--EndFragment-->/g,[/( ?)<span class="Apple-converted-space">\u00a0<\/span>( ?)/g,a],/<br class="Apple-interchange-newline">/g,/<br>$/i]);return h;}return{filter:f,innerText:i,trimHtml:t};});
