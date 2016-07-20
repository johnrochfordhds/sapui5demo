define("tinymce/tableplugin/Quirks",["tinymce/util/VK","tinymce/util/Delay","tinymce/Env","tinymce/util/Tools","tinymce/tableplugin/Utils"],function(V,D,E,T,U){var a=T.each,g=U.getSpanVal;return function(b){function m(){function k(e){var l=e.keyCode;function o(c,i){var n=c?'previousSibling':'nextSibling';var r=b.dom.getParent(i,'tr');var G=r[n];if(G){A(b,i,G,c);e.preventDefault();return true;}var H=b.dom.getParent(r,'table');var I=r.parentNode;var J=I.nodeName.toLowerCase();if(J==='tbody'||J===(c?'tfoot':'thead')){var K=p(c,H,I,'tbody');if(K!==null){return s(c,K,i);}}return t(c,r,n,H);}function p(c,i,n,r){var G=b.dom.select('>'+r,i);var H=G.indexOf(n);if(c&&H===0||!c&&H===G.length-1){return q(c,i);}else if(H===-1){var I=n.tagName.toLowerCase()==='thead'?0:G.length-1;return G[I];}return G[H+(c?-1:1)];}function q(c,i){var n=c?'thead':'tfoot';var r=b.dom.select('>'+n,i);return r.length!==0?r[0]:null;}function s(c,i,n){var r=u(i,c);if(r){A(b,n,r,c);}e.preventDefault();return true;}function t(c,i,n,r){var G=r[n];if(G){v(G);return true;}var H=b.dom.getParent(r,'td,th');if(H){return o(c,H,e);}var I=u(i,!c);v(I);e.preventDefault();return false;}function u(c,i){var n=c&&c[i?'lastChild':'firstChild'];return n&&n.nodeName==='BR'?b.dom.getParent(n,'td,th'):n;}function v(n){b.selection.setCursorLocation(n,0);}function w(){return l==V.UP||l==V.DOWN;}function x(b){var n=b.selection.getNode();var c=b.dom.getParent(n,'tr');return c!==null;}function y(i){var n=0;var c=i;while(c.previousSibling){c=c.previousSibling;n=n+g(c,"colspan");}return n;}function z(n,y){var c=0,r=0;a(n.children,function(G,i){c=c+g(G,"colspan");r=i;if(c>y){return false;}});return r;}function A(c,n,r,i){var G=y(b.dom.getParent(n,'td,th'));var H=z(r,G);var I=r.childNodes[H];var J=u(I,i);v(J||I);}function B(F){var n=b.selection.getNode();var c=b.dom.getParent(n,'td,th');var i=b.dom.getParent(F,'td,th');return c&&c!==i&&C(c,i);}function C(n,N){return b.dom.getParent(n,'TABLE')===b.dom.getParent(N,'TABLE');}if(w()&&x(b)){var F=b.selection.getNode();D.setEditorTimeout(b,function(){if(B(F)){o(!e.shiftKey&&l===V.UP,F,e);}},0);}}b.on('KeyDown',function(e){k(e);});}function f(){function i(r,p){var c=p.ownerDocument,e=c.createRange(),k;e.setStartBefore(p);e.setEnd(r.endContainer,r.endOffset);k=c.createElement('body');k.appendChild(e.cloneContents());return k.innerHTML.replace(/<(br|img|object|embed|input|textarea)[^>]*>/gi,'-').replace(/<[^>]+>/g,'').length===0;}b.on('KeyDown',function(e){var r,t,c=b.dom;if(e.keyCode==37||e.keyCode==38){r=b.selection.getRng();t=c.getParent(r.startContainer,'table');if(t&&b.getBody().firstChild==t){if(i(r,t)){r=c.createRng();r.setStartBefore(t);r.setEndBefore(t);b.selection.setRng(r);e.preventDefault();}}}});}function d(){b.on('KeyDown SetContent VisualAid',function(){var l;for(l=b.getBody().lastChild;l;l=l.previousSibling){if(l.nodeType==3){if(l.nodeValue.length>0){break;}}else if(l.nodeType==1&&(l.tagName=='BR'||!l.getAttribute('data-mce-bogus'))){break;}}if(l&&l.nodeName=='TABLE'){if(b.settings.forced_root_block){b.dom.add(b.getBody(),b.settings.forced_root_block,b.settings.forced_root_block_attrs,E.ie&&E.ie<10?'&nbsp;':'<br data-mce-bogus="1" />');}else{b.dom.add(b.getBody(),'br',{'data-mce-bogus':'1'});}}});b.on('PreProcess',function(o){var l=o.node.lastChild;if(l&&(l.nodeName=="BR"||(l.childNodes.length==1&&(l.firstChild.nodeName=='BR'||l.firstChild.nodeValue=='\u00a0')))&&l.previousSibling&&l.previousSibling.nodeName=="TABLE"){b.dom.remove(l);}});}function h(){function t(e,r,n,i){var k=3,l=e.dom.getParent(r.startContainer,'TABLE');var o,p,q;if(l){o=l.parentNode;}p=r.startContainer.nodeType==k&&r.startOffset===0&&r.endOffset===0&&i&&(n.nodeName=="TR"||n==o);q=(n.nodeName=="TD"||n.nodeName=="TH")&&!i;return p||q;}function c(){var r=b.selection.getRng();var n=b.selection.getNode();var e=b.dom.getParent(r.startContainer,'TD,TH');if(!t(b,r,n,e)){return;}if(!e){e=n;}var i=e.lastChild;while(i.lastChild){i=i.lastChild;}if(i.nodeType==3){r.setEnd(i,i.data.length);b.selection.setRng(r);}}b.on('KeyDown',function(){c();});b.on('MouseDown',function(e){if(e.button!=2){c();}});}function j(){function p(e){b.selection.select(e,true);b.selection.collapse(true);}function c(e){b.$(e).empty();U.paddCell(e);}b.on('keydown',function(e){if((e.keyCode==V.DELETE||e.keyCode==V.BACKSPACE)&&!e.isDefaultPrevented()){var t,i,s,k;t=b.dom.getParent(b.selection.getStart(),'table');if(t){i=b.dom.select('td,th',t);s=T.grep(i,function(k){return!!b.dom.getAttrib(k,'data-mce-selected');});if(s.length===0){k=b.dom.getParent(b.selection.getStart(),'td,th');if(b.selection.isCollapsed()&&k&&b.dom.isEmpty(k)){e.preventDefault();c(k);p(k);}return;}e.preventDefault();b.undoManager.transact(function(){if(i.length==s.length){b.execCommand('mceTableDelete');}else{T.each(s,c);p(s[0]);}});}}});}j();if(E.webkit){m();h();}if(E.gecko){f();d();}if(E.ie>9){f();d();}};});
