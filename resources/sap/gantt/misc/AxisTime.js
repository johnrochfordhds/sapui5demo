/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/gantt/misc/Utility","sap/ui/thirdparty/d3"],function(B){"use strict";var A=function(t,v,z,a,b,l,R,Z){this.scale=d3.time.scale().domain(t).range(v).clamp(false);this.timeRange=t;this.viewRange=v;this.zoomRate=sap.gantt.misc.Utility.assign(z,1);this.zoomOrigin=sap.gantt.misc.Utility.assign(a,0);this.viewOffset=sap.gantt.misc.Utility.assign(b,0);this.locale=l;var c=sap.ui.getCore().getConfiguration().getLanguage();this.language=c.toLowerCase();if(l&&l.getUtcdiff()){var f=d3.time.format("%Y%m%d%H%M%S");this.timeZoneOffset=Math.round((f.parse("20000101"+l.getUtcdiff()).getTime()-f.parse("20000101000000").getTime())/1000);if(l.getUtcsign()==="-"){this.timeZoneOffset=-this.timeZoneOffset;}}this.RTL=R;this._oZoomStrategy=Z?Z:sap.gantt.config.DEFAULT_TIME_ZOOM_STRATEGY;};A.prototype.CONSTANT={C_SEPARATOR:"_@@_",C_MESSAGE:{ARGUMENT_ERROR:"AxisOrdinal: Argument Error!"}};A.prototype.timeToView=function(t){if(this.RTL!==true){return Math.round((this.scale(t)-this.zoomOrigin)*this.zoomRate-this.viewOffset);}else{return Math.round(this.viewRange[1]*this.zoomRate-(((this.scale(t)+this.zoomOrigin)*this.zoomRate)+this.viewOffset));}};A.prototype.viewToTime=function(v){if(this.RTL!==true){return this.scale.invert((v+this.viewOffset)/this.zoomRate+this.zoomOrigin);}else{return this.scale.invert(this.viewRange[1]-(v+this.viewOffset)/this.zoomRate-this.zoomOrigin);}};A.prototype.setTimeRange=function(t){this.timeRange=t;this.scale.domain(t);return this;};A.prototype.getTimeRange=function(){return this.scale.domain();};A.prototype.setViewRange=function(v){this.viewRange=v;this.scale.range(v);return this;};A.prototype.getViewRange=function(){var r=this.scale.range();return[Math.round((r[0]-this.zoomOrigin)*this.zoomRate-this.viewOffset),Math.round((r[1]-this.zoomOrigin)*this.zoomRate-this.viewOffset)];};A.prototype.getZoomStrategy=function(){return this._oZoomStrategy;};A.prototype.setZoomRate=function(z){this.zoomRate=sap.gantt.misc.Utility.assign(z,1);return this;};A.prototype.getZoomRate=function(){return this.zoomRate;};A.prototype.setZoomOrigin=function(z){this.zoomOrigin=sap.gantt.misc.Utility.assign(z,0);return this;};A.prototype.getZoomOrigin=function(){return this.zoomOrigin;};A.prototype.setViewOffset=function(v){this.viewOffset=sap.gantt.misc.Utility.assign(v,0);return this;};A.prototype.getViewOffset=function(){return this.viewOffset;};A.prototype.setLocale=function(l){this.locale=l;if(l&&l.getUtcdiff()){var f=d3.time.format("%Y%m%d%H%M%S");this.timeZoneOffset=Math.round((f.parse("20000101"+l.getUtcdiff()).getTime()-f.parse("20000101000000").getTime())/1000);if(l.getUtcsign()==="-"){this.timeZoneOffset=-this.timeZoneOffset;}}return this;};A.prototype.getLocale=function(){return this.locale;};A.prototype.clone=function(){return new A([new Date(this.timeRange[0].valueOf()),new Date(this.timeRange[1].valueOf())],this.viewRange.slice(0),this.zoomRate,this.zoomOrigin,this.viewOffset,this.locale,this.RTL);};A.prototype.getCurrentTickTimeIntervalLevel=function(){var s=d3.time.format("%Y%m%d%H%M%S").parse("20000101000000");var a=this.scale(s);var c=0;for(var i in this._oZoomStrategy){var b=this._oZoomStrategy[i].innerInterval;var e=this.scale(jQuery.sap.getObject(b.unit).offset(s,b.span));var r=(e-a)*this.zoomRate;if(r>b.range){return c;}c++;}return c-1;};A.prototype.getCurrentTickTimeIntervalKey=function(){var s=d3.time.format("%Y%m%d%H%M%S").parse("20000101000000");var a=this.scale(s);var c;for(var i in this._oZoomStrategy){var b=this._oZoomStrategy[i].innerInterval;var e=this.scale(jQuery.sap.getObject(b.unit).offset(s,b.span));var r=(e-a)*this.zoomRate;if(r>b.range){c=i;break;}}return c;};A.prototype.getNowLabel=function(){var d=new Date();var u=new Date(d.getTime()+(d.getTimezoneOffset()*60000));var v=this.timeToView(u);var l=d3.time.second.offset(u,this.timeZoneOffset);var a=this.getTimeLabel(this.language,this._oZoomStrategy[this.getCurrentTickTimeIntervalKey()].smallInterval.format,l);return[{"date":l,"value":Math.round(v),"label":a}];};A.prototype.getTickTimeIntervalLabel=function(l,t,v){var i;var a=l;if(typeof l==="number"){var c=0;for(i in this._oZoomStrategy){if(c===l){a=i;break;}c++;}}var p,b;var e=null;if(this.locale&&this.locale.getDstHorizons().length>0){e=this.locale.getDstHorizons();}var f=d3.time.format("%Y%m%d%H%M%S");var g=[];if(e){for(i=0;i<e.length;i++){g[i]={};p=e[i].getStartTime();b=e[i].getEndTime();g[i].startDate=f.parse(p);g[i].endDate=f.parse(b);}}var h=this.timeZoneOffset?[d3.time.second.offset(this.timeRange[0],this.timeZoneOffset),d3.time.second.offset(this.timeRange[1],this.timeZoneOffset)]:this.timeRange;var j=new sap.gantt.misc.AxisTime(h,this.viewRange,this.zoomRate,this.zoomOrigin,this.viewOffset,null,this.RTL);var k=null;var m=null;var n=null;var o=null;var q=null;var r=null;var u=null;var w=[];var x=[];var y=null;if(t){r=this.timeZoneOffset?d3.time.second.offset(t[0],this.timeZoneOffset):t[0];u=this.timeZoneOffset?d3.time.second.offset(t[1],this.timeZoneOffset):t[1];k=this.timeZoneOffset?[d3.time.second.offset(t[0],this.timeZoneOffset),d3.time.second.offset(t[1],this.timeZoneOffset)]:t;m=[this.timeToView(t[0]),this.timeToView(t[1])];if(g&&g.length){this._calculateTimeRange(g,r,u,w);}y=this._calculateScale(w,x,k,m,false);}else if(v){r=this.timeZoneOffset?d3.time.second.offset(this.viewToTime(v[0]),this.timeZoneOffset):this.viewToTime(v[0]);u=this.timeZoneOffset?d3.time.second.offset(this.viewToTime(v[1]),this.timeZoneOffset):this.viewToTime(v[1]);k=[r,u];m=v;if(g.length){this._calculateTimeRange(g,r,u,w);}y=this._calculateScale(w,x,k,m,false);}else{r=h[0];u=h[1];k=h;m=this.viewRange;if(g.length){this._calculateTimeRange(g,r,u,w);}y=this._calculateScale(w,x,k,m,h);}x=y.viewRangeSet;n=y.visibleScale;o=y.dstScale;q=y.normalScale;var z=[];var C,D,E,F;var G=this._oZoomStrategy[a].largeInterval;var H=this._oZoomStrategy[a].smallInterval;var I,J;if(G){var K=[];var L=[];var M=[];if(!(n instanceof Array)){K[0]=n.ticks(jQuery.sap.getObject(G.unit).range,G.span);}else{for(I=0;I<o.length;I++){L[I]=o[I].ticks(jQuery.sap.getObject(G.unit).range,G.span);M[I]=q[I].ticks(jQuery.sap.getObject(G.unit).range,G.span);}for(I=0;I<n.length;I++){K[I]=n[I].ticks(jQuery.sap.getObject(G.unit).range,G.span);}}var N=[];if(K[0]!==null){for(I=0;I<K.length;I++){for(J=0;J<K[I].length;J++){C=K[I][J];E=j.timeToView(C);F=this.getTimeLabel(this.language,G.format,C);N.push({"date":C,"value":Math.round(E),"label":F});}}}if(L[0]!==null){for(I=0;I<L.length;I++){for(J=0;J<L[I].length;J++){C=L[I][J];D=M[I][J];E=j.timeToView(d3.time.second.offset(C.getTime(),-60*60));F=this.getTimeLabel(this.language,G.format,C);N.push({"date":C,"value":Math.round(E),"label":F});}}}z.push(N);}else{z.push([]);}if(H){var O=[];var P=[];var Q=[];if(!(n instanceof Array)){Q[0]=n.ticks(jQuery.sap.getObject(H.unit).range,H.span);}else{for(I=0;I<o.length;I++){O[I]=o[I].ticks(jQuery.sap.getObject(H.unit).range,H.span);P[I]=q[I].ticks(jQuery.sap.getObject(H.unit).range,H.span);}for(I=0;I<n.length;I++){Q[I]=n[I].ticks(jQuery.sap.getObject(H.unit).range,H.span);}}var R=[];if(Q[0]){for(I=0;I<Q.length;I++){for(J=0;J<Q[I].length;J++){C=Q[I][J];var S;var T=false;if(g.length){for(var d=0;d<g.length;d++){if(C.getTime()===g[d].startDate.getTime()){S=d3.time.second.offset(C.getTime(),60*60);if((J===Q[I].length-1)&&(a==="1hour"||a==="30min"||a==="15min"||a==="10min"||a==="5min")){T=true;}}if((J===Q[I].length-1)&&(C.getTime()===d3.time.second.offset(g[d].endDate.getTime(),60*60).getTime())){S=d3.time.second.offset(C.getTime(),-60*60);}}}E=j.timeToView(C);if(T){break;}else if(S){F=this.getTimeLabel(this.language,H.format,S);S=null;}else{F=this.getTimeLabel(this.language,H.format,C);}R.push({"date":C,"value":Math.round(E),"label":F});}}}if(O[0]){for(I=0;I<O.length;I++){for(J=0;J<O[I].length;J++){C=O[I][J];D=P[I][J];var U;var V=false;if((J===O[I].length-1)&&(a==="1hour"||a==="30min"||a==="15min"||a==="10min"||a==="5min")){if(w.length>0){for(var W=0;W<w.length;W++){if((!w[W].haveDST)&&(D.getTime()===w[W].range[0].getTime())){V=true;}}}}if(g.length){for(var s=0;s<g.length;s++){if(C.getTime()===g[s].startDate.getTime()){U=d3.time.second.offset(C.getTime(),60*60);}if((J===O[I].length-1)&&(C.getTime()===d3.time.second.offset(g[s].endDate.getTime(),60*60).getTime())){U=d3.time.second.offset(C.getTime(),-60*60);}}}if(a!=="1hour"&&a!=="30min"&&a!=="15min"&&a!=="10min"&&a!=="5min"){E=j.timeToView(d3.time.second.offset(C.getTime(),-60*60));}else{E=j.timeToView(D);}if(V){break;}else if(U){F=this.getTimeLabel(this.language,H.format,U);U=null;}else{F=this.getTimeLabel(this.language,H.format,C);}R.push({"date":C,"value":Math.round(E),"label":F});}}}z.push(R);}else{z.push([]);}return z;};A.prototype._calculateScale=function(a,v,b,c,l){var d=null;var e=[];var n=[];if(a.length){d=[];var f=0;var g=0;for(var t=0;t<a.length;t++){v[t]=[this.timeToView(a[t].range[0]),this.timeToView(a[t].range[1])];if(a[t].haveDST){e[f]=new sap.gantt.misc.AxisTime(a[t].dstRange,v[t],this.zoomRate,this.zoomOrigin,this.viewOffset,null,this.RTL).scale;n[f]=new sap.gantt.misc.AxisTime(a[t].range,v[t],this.zoomRate,this.zoomOrigin,this.viewOffset,null,this.RTL).scale;f++;}else{d[g]=new sap.gantt.misc.AxisTime(a[t].range,v[t],this.zoomRate,this.zoomOrigin,this.viewOffset,null,this.RTL).scale;g++;}}}else if(l){d=new sap.gantt.misc.AxisTime(l,this.viewRange,this.zoomRate,this.zoomOrigin,this.viewOffset,null,this.RTL).scale;}else{d=new sap.gantt.misc.AxisTime(b,c,this.zoomRate,this.zoomOrigin,this.viewOffset,null,this.RTL).scale;}var r={"viewRangeSet":v,"visibleScale":d,"dstScale":e,"normalScale":n};return r;};A.prototype._calculateTimeRange=function(d,s,e,a){if(d.length){var b=s;var c=e;var f=[];var g=[];var h,i;h=d[0].startDate;i=d[0].endDate;this._calculateRangeItem(h,i,b,c,f,g);if(d.length>1){for(var j=1;j<d.length;j++){if(f.length){var r=[];for(var k in f){r.push(f[k]);}f=[];for(var t=0;t<r.length;t++){h=d[j].startDate;i=d[j].endDate;b=r[t].range[0];c=r[t].range[1];this._calculateRangeItem(h,i,b,c,f,g);}}}}for(var l in g){a.push(g[l]);}for(var m in f){a.push(f[m]);}}};A.prototype._calculateRangeItem=function(d,a,s,e,t,b){var r=null;if(s<d){if(e<a){if(e>d){r={};r.haveDST=false;r.range=[s,d];t.push(r);r={};r.haveDST=true;r.range=[d,e];r.dstRange=[d3.time.second.offset(d.getTime(),60*60),d3.time.second.offset(e,60*60)];b.push(r);}else{r={};r.haveDST=false;r.range=[s,e];t.push(r);}}else{r={};r.haveDST=false;r.range=[s,d];t.push(r);r={};r.haveDST=true;r.range=[d,a];r.dstRange=[d3.time.second.offset(d.getTime(),60*60),d3.time.second.offset(a.getTime(),60*60)];b.push(r);r={};r.haveDST=false;r.range=[a,e];t.push(r);}}else if(s>=d){if(s<a){if(e<=a){r={};r.haveDST=true;r.range=[s,e];r.dstRange=[d3.time.second.offset(s,60*60),d3.time.second.offset(e,60*60)];b.push(r);}else{r={};r.haveDST=true;r.range=[s,a];r.dstRange=[d3.time.second.offset(s,60*60),d3.time.second.offset(a.getTime(),60*60)];b.push(r);r={};r.haveDST=false;r.range=[a,e];t.push(r);}}else{r={};r.haveDST=false;r.range=[s,e];t.push(r);}}};A.prototype.getTimeLabel=function(l,f,d){var F=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:f},new sap.ui.core.Locale(l));return F.format(d);};return A;},true);
