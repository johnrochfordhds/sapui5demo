/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Element','sap/ui/core/Renderer'],function(q,l,E,R){"use strict";var C=E.extend("sap.m.Column",{metadata:{library:"sap.m",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},hAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin},vAlign:{type:"sap.ui.core.VerticalAlign",group:"Appearance",defaultValue:sap.ui.core.VerticalAlign.Inherit},styleClass:{type:"string",group:"Appearance",defaultValue:null},visible:{type:"boolean",group:"Appearance",defaultValue:true},minScreenWidth:{type:"string",group:"Behavior",defaultValue:null},demandPopin:{type:"boolean",group:"Behavior",defaultValue:false},popinHAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin,deprecated:true},popinDisplay:{type:"sap.m.PopinDisplay",group:"Appearance",defaultValue:sap.m.PopinDisplay.Block},mergeDuplicates:{type:"boolean",group:"Behavior",defaultValue:false},mergeFunctionName:{type:"string",group:"Misc",defaultValue:'getText'}},defaultAggregation:"header",aggregations:{header:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.ui.core.Control",multiple:false}}}});C.prototype._index=-1;C.prototype._screen="";C.prototype._media=null;C.prototype.exit=function(){this._clearMedia();};C.prototype._clearMedia=function(){if(this._media&&this._minWidth){sap.ui.Device.media.removeRangeSet(this.getId());this._media=null;}};C.prototype._addMedia=function(){if(this._minWidth){sap.ui.Device.media.initRangeSet(this.getId(),[parseFloat(this._minWidth)]);sap.ui.Device.media.attachHandler(this._notifyResize,this,this.getId());this._media=sap.ui.Device.media.getCurrentRange(this.getId());if(this._media){this._media.triggered=false;this._media.matches=!!this._media.from;}}};C.prototype._notifyResize=function(m){if(!this._media.triggered){this._media.triggered=true;return;}this._media=m;this._media.triggered=true;this._media.matches=!!m.from;q.sap.delayedCall(0,this,function(){var p=this.getParent();this.fireEvent("media",this);if(p&&p.onColumnResize){p.onColumnResize(this);}});};C.prototype._validateMinWidth=function(w){if(!w){return;}if(Object.prototype.toString.call(w)!="[object String]"){throw new Error('expected string for property "minScreenWidth" of '+this);}if(Object.keys(sap.m.ScreenSizes).indexOf(w.toLowerCase())!=-1){return;}if(!/^\d+(\.\d+)?(px|em|rem)$/i.test(w)){throw new Error('invalid CSS size("px", "em", "rem" required) or sap.m.ScreenSize enumeration for property "minScreenWidth" of '+this);}};C.prototype._isWidthPredefined=function(w){var t=this,u=w.replace(/[^a-z]/ig,""),b=parseFloat(sap.m.BaseFontSize)||16;q.each(sap.m.ScreenSizes,function(s,a){if(u!="px"){a/=b;}if(a+u==w){t._minWidth=this+"px";t._screen=s;return false;}});if(this._minWidth){return true;}if(u=="px"){this._minWidth=w;}else{this._minWidth=parseFloat(w)*b+"px";}};C.prototype.applyAlignTo=function(c,a){a=a||this.getHAlign();if(a===sap.ui.core.TextAlign.Initial||!c.getMetadata().getProperties().textAlign||c.getTextAlign()===a){return c;}c.setProperty("textAlign",a,true);var d=c.getDomRef();a=this.getCssAlign(a);if(d&&a){d.style.textAlign=a;}return c;};C.prototype.getCssAlign=function(a){a=a||this.getHAlign();var t=sap.ui.core.TextAlign;if(a===t.Begin||a===t.End||a===t.Initial){a=R.getTextAlign(a);}return a.toLowerCase();};C.prototype.getStyleClass=function(r){var c=this.getProperty("styleClass");if(!r){return c;}if(this._screen&&(!this.getDemandPopin()||!window.matchMedia)){c+=" sapMSize-"+this._screen;}else if(this._media&&!this._media.matches){c+=" sapMListTblNone";}return c.trim();};C.prototype.setIndex=function(n){this._index=+n;};C.prototype.setOrder=function(n){this._order=+n;};C.prototype.getOrder=function(){return this.hasOwnProperty("_order")?this._order:this.getInitialOrder();};C.prototype.setInitialOrder=function(n){this._initialOrder=+n;};C.prototype.getInitialOrder=function(){if(this.hasOwnProperty("_initialOrder")){return this._initialOrder;}var p=this.getParent();if(p&&p.indexOfColumn){return p.indexOfColumn(this);}return-1;};C.prototype.setDisplay=function(t,d){if(!t||this._index<0){return;}var i=this._index+1,p=this.getParent(),a=d?"table-cell":"none",h=t.querySelector("tr > th:nth-child("+i+")"),c=t.querySelectorAll("tr > td:nth-child("+i+")"),b=c.length;h.style.display=a;h.setAttribute("aria-hidden",!d);for(i=0;i<b;i++){c[i].style.display=a;c[i].setAttribute("aria-hidden",!d);}if(p&&p.setTableHeaderVisibility){setTimeout(function(){p.setTableHeaderVisibility(d);},0);}};C.prototype.setDisplayViaMedia=function(t){var p=this.getParent(),d=this._media&&this._media.matches;if(!this.getDemandPopin()&&this._screen&&p&&p.setTableHeaderVisibility){setTimeout(function(){p.setTableHeaderVisibility(d);},0);}else{this.setDisplay(t,d);}};C.prototype.setVisible=function(v){if(v==this.getVisible()){return this;}var p=this.getParent(),t=p&&p.getTableDomRef&&p.getTableDomRef(),s=t&&this._index>=0;this.setProperty("visible",v,s);if(s){this.setDisplay(t,v);}return this;};C.prototype.setMinScreenWidth=function(w){if(w==this.getMinScreenWidth()){return this;}this._validateMinWidth(w);this._clearMedia();this._minWidth=0;this._screen="";if(w){w=w.toLowerCase();var a=sap.m.ScreenSizes[w];if(a){this._screen=w;this._minWidth=a+"px";}else{this._isWidthPredefined(w);}this._addMedia();}return this.setProperty("minScreenWidth",w);};C.prototype.setDemandPopin=function(v){if(v==this.getDemandPopin()){return this;}if(!this.getMinScreenWidth()){return this.setProperty("demandPopin",v,true);}return this.setProperty("demandPopin",v);};C.prototype.isPopin=function(){if(!this.getDemandPopin()){return false;}if(this._media){return!this._media.matches;}return false;};C.prototype.isHidden=function(){if(this._media){return!this._media.matches;}if(this._screen&&this._minWidth){return parseFloat(this._minWidth)>window.innerWidth;}return false;};C.prototype.setLastValue=function(v){if(this.getMergeDuplicates()){this._lastValue=v;}return this;};C.prototype.clearLastValue=function(){return this.setLastValue(NaN);};C.prototype.getLastValue=function(){return this._lastValue;};C.prototype.onItemsRemoved=function(){this.clearLastValue();};C.prototype.isRelativeWidth=function(){return/^(|auto|[-+]?\d+\.?\d*%|inherit)$/i.test(this.getWidth());};return C;},true);
