/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","sap/ui/model/FilterProcessor","sap/ui/model/Filter","sap/ui/model/SorterProcessor","sap/ui/model/Sorter","sap/ui/model/Context"],function(q,F,c,S,d,C){"use strict";var T=function(){};T.JSONDataKey="originJSONData";T.addDummyData=function(t,D,r){var a=[];if(r){a=t.getSelectedIndices().map(function(I){return T._buildContextMap(t,I,null,null);});}var b=this._contextIndexMap(t,D);if(b&&b.length>0){for(var i=0;i<b.length;i++){var o=b[i];this._addDummyDataToChildren(t,o);}}T._updateModalBinding(b);if(r){this._restoreSelectedIndices(t,a);}};T.removeDummyDataFromSelectedIndices=function(t,s,g){var A=t.getSelectedIndices().map(function(I){return T._buildContextMap(t,I,null,null);});s=(s||[]).sort(function(a,b){return a-b;});var e=s.map(function(I){return T._buildContextMap(t,I,null,g);});for(var i=0;i<e.length;i++){this._removeDummyDataFromSelectedIndex(t,e[i]);}T._updateModalBinding(e);this._restoreSelectedIndices(t,A);};T.isDummyRow=function(t,s){var o=t.getContextByIndex(s);if(o){var a=o.getObject();return!!a.__dummy;}else{return false;}};T.isMultipleSpanMainRow=function(t,s,r){var i;if(!r){var R=t.getRows()[s];if(R){i=R.getIndex();}else{return false;}}else{i=s;}var o=t.getContextByIndex(i);if(o){var a=o.getObject();if(a&&a.previousNodeNum!==undefined&&a.afterNodeNum!==undefined){return true;}else{return false;}}else{return false;}};T.getMultipleSpanMainRowGroupIndices=function(t,s,r){if(this.isMultipleSpanMainRow(t,s,r)){var I;if(!r){var R=t.getRows()[s];if(R){I=R.getIndex();}else{return false;}}else{I=s;}var a=t.getContextByIndex(I).getObject();var b=s-a.previousNodeNum;var e=s+a.afterNodeNum;var m=[];for(var i=b;i<=e;i++){m.push(i);}return m;}else{return null;}};T.getContextObject=function(t,s){var o=t.getContextByIndex(s);if(o){return o.getObject();}};T.toggleOpenStateWithRowIndex=function(t,s,e){var o=t.getContextByIndex(s),m=o.getModel(),a=o.getObject(),p=this._getParentBindingPath(o),P=o.getObject(p);var A=this._getBindingParameterArrayNames(t);if(e){var l=this._collectNumberOfSiblingDummyData(a,P,null);var r=this._removeSiblingDummyData(a,P,null);this._addDummyDataToChildrenInBatch(t,s,r);q.sap.log.info("Move "+l.length+" rows out to its parent level");}else{var R=this._removeChildrenDummyData(a,A,null);var i=q.inArray(a,P);P.splice.apply(P,[i+1,0].concat(R));q.sap.log.info("Move "+R.length+" rows into its children");}m.updateBindings(false);var b=t.getSelectedIndices();t.clearSelection();b.forEach(function(I){t.addSelectionInterval(I,I);});};T.filter=function(e){e.preventDefault();var t=e.getSource(),a=t.getColumns(),b=t.getBinding("rows"),m=b.getModel();t.clearSelection();T.clearAllDummyData(t);var o=e.getParameter('column'),v=e.getParameter('value');if(v){o.setFiltered(true);o.setFilterValue(v);}else{o.setFiltered(false);o.setFilterValue(null);}if(!t.data(T.JSONDataKey)){var f=m.getProperty(b.getPath());t.data(T.JSONDataKey,q.extend(true,{},f));}m.setProperty(b.getPath(),q.extend(true,{},t.data(T.JSONDataKey)),null,true);m.updateBindings(false);var u=T._getRecursiveContexts(b);var g=a.filter(function(o){return o.getFiltered();}).map(function(o){return o._getFilter();});var s=a.filter(function(o){return o.getSorted();}).map(function(o){return new d(o.getSortProperty(),o.getSortOrder()===sap.ui.table.SortOrder.Descending);});var p=[],P;if(g.length>0){p=F.apply(u,g,function(r,i){var O=r.getObject();var V=O[i];if(V!=undefined&&typeof V!=="string"&&!(V instanceof Date)){V=(V).toString();}return V;});P=T._parseDataFromContexts(t,p);m.setProperty(b.getPath(),P);m.updateBindings(false);}else{P=q.extend(true,{},t.data(T.JSONDataKey));p=u;}if(s.length>0){var h=T._getSortedRecursiveContexts(b,s,5);P=T._parseDataFromContexts(t,h);}m.setProperty(b.getPath(),P);q.sap.log.info("Table filter "+o+' value is '+v);};T._sortContexts=function(a,s){var n=q.isArray(s)?s:[s];return S.apply(a,n,function(o,p){return o.getObject()[p];});};T.sort=function(e){e.preventDefault();var o=e.getParameter('column'),s=e.getParameter('sortOrder');var t=e.getSource(),a=t.getColumns(),b=t.getBinding("rows"),m=b.getModel();t.clearSelection();T.clearAllDummyData(t);a.forEach(function(o){o.setSorted(false);o.setSortOrder(sap.ui.table.SortOrder.Ascending);});o.setSorted(true);o.setSortOrder(s);var n=new d(o.getSortProperty(),s===sap.ui.table.SortOrder.Descending);var f=T._getSortedRecursiveContexts(b,n,5);var g=this._parseDataFromContexts(t,f);m.setProperty(b.getPath(),g);};T.clearAllDummyData=function(t){var b=t.getBinding("rows"),B=b.getLength(),I=[];var a;for(var i=0;i<B;i++){if(!this.isDummyRow(t,i)){a=i;}else if(I.indexOf(a)===-1){I.push(a);}}if(I.length>0){var e=I.map(function(f){return T._buildContextMap(t,f,null);});for(var j=0;j<e.length;j++){this._removeDummyDataFromSelectedIndex(t,e[j]);}T._updateModalBinding(e);}};T._parseDataFromContexts=function(t,a){var b=t.getBinding("rows"),o=q.extend({},b.getModel().getProperty(b.getPath())),r=null,B=b.getPath();if(a.length===0){return{};}var m={aOriginPathChain:[],sHittedOnPath:null,aMappingChain:[]};var A=this._getBindingParameterArrayNames(t);for(var i=0;i<a.length;i++){var p=a[i].getPath(),R=p.replace(B,""),P=R.split("/");P.pop();var s=P.join("/");var e=q.extend({},this._getObjFromPath(o,R)),I=this._getObjFromPath(r,m[s]);if(I===null){r=this._buildDataFormOriginData(r,o,s,m);I=this._getObjFromPath(r,m[s]);}if(!m[R]){I.push(e);m.aOriginPathChain=R.split("/");m.sHittedOnPath=s;m.aMappingChain=[I.length-1];this._updateMapping(m);for(var j=0;j<A.length;j++){if(e[A[j]]){e[A[j]]=[];m.aOriginPathChain=R.split("/");m.sHittedOnPath=s;m.aMappingChain=[I.length-1];m.aOriginPathChain.push(A[j]);m.aMappingChain.push(A[j]);this._updateMapping(m);}}}}return r;};T._buildDataFormOriginData=function(t,o,p,P){var a=p.split("/");P.aOriginPathChain=q.extend([],a);var A=a.pop(),n=a.join("/"),b=q.extend({},this._getObjFromPath(o,n));P.aMappingChain.push("X");P.aMappingChain.push(A);b[A]=[];t=this._buildDataRecursive(t,o,n,b,P);this._updateMapping(P);return t;};T._buildDataRecursive=function(t,o,n,a,p){if(n===""){p.aMappingChain[0]="";if(!p[""]){p[""]="";}return a;}else{var P=n.split("/");P.pop();var s=P.join("/"),b=P.pop(),e=P.join("/"),f=q.extend({},this._getObjFromPath(o,e));var i=this._getObjFromPath(t,p[e]);if(i!==null){i[b].push(a);p.sHittedOnPath=s;p.aMappingChain[0]=i[b].length-1;return t;}else{f[b]=[];f[b].push(a);p.aMappingChain[0]="0";p.aMappingChain.unshift(b);p.aMappingChain.unshift("X");return this._buildDataRecursive(t,o,e,f,p);}}};T._updateMapping=function(p){var o="",h="";if(p.sHittedOnPath!==null){o=p.sHittedOnPath;h=p[p.sHittedOnPath];var H=h.split("/");var l=p.aOriginPathChain.length-H.length,b=H.length;for(var i=0;i<l;i++){o=o+"/"+p.aOriginPathChain[i+b];h=h+"/"+p.aMappingChain[i];p[o]=h;}}else if(p.aOriginPathChain.length===p.aMappingChain.length){for(var j=0;j<p.aMappingChain.length;j++){if(p.aMappingChain[j]!==""){o=o+"/"+p.aOriginPathChain[j];h=h+"/"+p.aMappingChain[j];p[o]=h;}}}p.aOriginPathChain=[];p.sHittedOnPath=null;p.aMappingChain=[];};T._getObjFromPath=function(o,p){if(o===null||p===undefined){return null;}else if(p==""){return o;}var P=p.split("/"),r=o,m=false;for(var i=0;i<P.length;i++){if(P[i]!==""){if(r[P[i]]!==undefined){m=true;r=r[P[i]];}else{m=false;return null;}}}if(m){return r;}else{return null;}};T._removeDummyDataFromSelectedIndex=function(t,o){var g=o.group||null;var e=o.expanded,s=o.object,p=o.parentObject;var a=this._getBindingParameterArrayNames(t);if(e){this._removeChildrenDummyData(s,a,g);}else{this._removeSiblingDummyData(s,p,g);}q.sap.log.info("Remove dummy rows for selecting row");};T._addDummyDataToChildren=function(t,o){var D=o.dummyData;D.forEach(function(i,I,A){A[I]=q.extend({__group:null},i,{__dummy:true});});var a=this._getBindingParameterArrayNames(t);var s=o.object;if(s&&s.__dummy){return;}var e=t.isExpanded(o.oldIndex);var f=D[0].__group;var b=false;a.forEach(function(n){var g=s[n];if(g&&e){var i=-1;q.each(g,function(j,k){if(k.__group===f){b=true;}if(j===0&&!!k.__dummy===false){i=0;}else if(!!k.__dummy===true){i=j;}return false;});if(i==-1||i==0){i=0;}else{i+=1;}if(!b){g.splice.apply(g,[i,0].concat(D));}}else{q.sap.log.warning("parameter "+n+" data node doesn not exist");var p=o.parentObject;var h=q.inArray(s,p);if(h>=0){var I=h+1;while(p[I]&&p[I].__dummy){if(p[I].__group===f){b=true;}I++;}if(!b){p.splice.apply(p,[I,0].concat(D));}}}});};T._addDummyDataToChildrenInBatch=function(t,s,D){var a=this._getBindingParameterArrayNames(t);var o=t.getContextByIndex(s),b=o.getObject();a.forEach(function(n){var e=b[n];if(e){e.unshift.apply(e,D);}else{q.sap.log.warning("parameter "+n+" data node doesn not exist");}});};T._getBindingParameterArrayNames=function(t){return t.getBindingInfo("rows").parameters.arrayNames;};T._getParentBindingPath=function(o){var p=o.getPath().split("/");p.pop();return p.join("/");};T._removeSiblingDummyData=function(s,p,g){var l=this._collectNumberOfSiblingDummyData(s,p,g);return p.splice(l.index+1,l.length);};T._removeChildrenDummyData=function(s,a,g){var r=[];a.forEach(function(n){var b=s[n];if(b){var i=-1,e=0;q.each(b,function(I,o){if(o.__dummy&&(o.__group===g||g===null)){if(i===-1){i=I;}e++;return true;}else if(o.__dummy){return true;}else{return false;}});if(i!==-1&&e>0){r.push.apply(r,b.splice(i,e));}}else{q.sap.log.info("NO dummy rows were found");}});return r;};T._collectNumberOfSiblingDummyData=function(s,p,g){var n=0;var f=-1;var i=q.inArray(s,p);if(i>=0){var I=i+1;var N=p[I];while(N&&N.__dummy){if(N.__group==g||g===null){n++;if(f==-1){f=I;}}I++;N=p[I];}}if(f!=-1){f-=1;}var r={index:f,length:n};return r;};T._restoreSelectedIndices=function(t,a){if(a.length===0){return;}q.sap.delayedCall(100,t,function(){t.clearSelection();a.forEach(function(o){var b=t.getBinding("rows");if(b&&b.findNode){var l=b.getLength();for(var i=0;i<l;i++){var n=b.findNode(i);if(q.sap.equal(n.context.getObject(),o.object,1)){t.addSelectionInterval(i,i);break;}}}});});};T._contextIndexMap=function(t,D){var s=Object.keys(D).map(function(k){return parseInt(k,10);}).sort(function(a,b){return a-b;});return s.map(function(i){return T._buildContextMap(t,i,D,null);});};T._buildContextMap=function(t,s,D,g){var o=t.getContextByIndex(s),m=o.getModel();var p=T._getParentBindingPath(o),P=m.getProperty(p);var e=false;var b=t.getBinding("rows");if(b.hasChildren&&b.hasChildren(o)){e=t.isExpanded(s);}var a={oldIndex:s,path:o.getPath(),object:o.getObject(),parentObject:P,context:o,expanded:e};if(D&&D[s]){a.dummyData=D[s];}if(g){a.group=g;}return a;};T._updateModalBinding=function(a){var u=false;for(var i=0;i<a.length;i++){if(u){break;}else{var o=a[i];o.context.getModel().updateBindings(false);u=true;}}};T._getRecursiveContexts=function(b){var r=[];var R=b.getRootContexts(0,b.getLength());var f=function(a){var n=[];a.forEach(function(o){n=n.concat(o);var i=b.getChildCount(o),h=i>0,e=[];if(h){e=b.getNodeContexts(o,0,i);n=n.concat(f(e));}});return n;};r=f(R);return r;};T._getSortedRecursiveContexts=function(b,s,l){l=l?l:1;var r=[];var R=b.getRootContexts(0,b.getLength());r.push(R);var g=function(j){var n=[];j.forEach(function(o){var k=b.getChildCount(o),H=k>0;if(H){var m=b.getNodeContexts(o,0,k);n=n.concat(m);}});return n;};var a=R;while(r.length<=l){var e=g(a);if(e.length===0){break;}else{r.push(e);}a=e;}var f=[];for(var i=0;i<r.length;i++){var h=T._sortContexts(r[i],s);f=f.concat(h);}return f;};return T;},true);