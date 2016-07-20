define("tinymce/tableplugin/CellSelection",["tinymce/tableplugin/TableGrid","tinymce/dom/TreeWalker","tinymce/util/Tools"],function(T,a,b){return function(c){var d=c.dom,t,s,f,l,h=true,r;function g(e){c.getBody().style.webkitUserSelect='';if(e||h){c.$('td[data-mce-selected],th[data-mce-selected]').removeAttr('data-mce-selected');h=false;}}function i(e,k){if(!e||!k){return false;}return e===d.getParent(k,'table');}function j(e){var k,m=e.target,n;if(r){return;}if(m===l){return;}l=m;if(f&&s){n=d.getParent(m,'td,th');if(!i(f,n)){n=d.getParent(f,'td,th');}if(i(f,n)){e.preventDefault();if(!t){t=new T(c,f,s);c.getBody().style.webkitUserSelect='none';}t.setEndCell(n);h=true;k=c.selection.getSel();try{if(k.removeAllRanges){k.removeAllRanges();}else{k.empty();}}catch(o){}}}}c.on('SelectionChange',function(e){if(h){e.stopImmediatePropagation();}},true);c.on('MouseDown',function(e){if(e.button!=2&&!r){g();s=d.getParent(e.target,'td,th');f=d.getParent(s,'table');}});c.on('mouseover',j);c.on('remove',function(){d.unbind(c.getDoc(),'mouseover',j);g();});c.on('MouseUp',function(){var e,k=c.selection,m,w,n,o;function p(n,q){var w=new a(n,n);do{if(n.nodeType==3&&b.trim(n.nodeValue).length!==0){if(q){e.setStart(n,0);}else{e.setEnd(n,n.nodeValue.length);}return;}if(n.nodeName=='BR'){if(q){e.setStartBefore(n);}else{e.setEndBefore(n);}return;}}while((n=(q?w.next():w.prev())));}if(s){if(t){c.getBody().style.webkitUserSelect='';}m=d.select('td[data-mce-selected],th[data-mce-selected]');if(m.length>0){e=d.createRng();n=m[0];e.setStartBefore(n);e.setEndAfter(n);p(n,1);w=new a(n,d.getParent(m[0],'table'));do{if(n.nodeName=='TD'||n.nodeName=='TH'){if(!d.getAttrib(n,'data-mce-selected')){break;}o=n;}}while((n=w.next()));p(o);k.setRng(e);}c.nodeChanged();s=t=f=l=null;}});c.on('KeyUp Drop SetContent',function(e){g(e.type=='setcontent');s=t=f=l=null;r=false;});c.on('ObjectResizeStart ObjectResized',function(e){r=e.type!='objectresized';});return{clear:g};};});