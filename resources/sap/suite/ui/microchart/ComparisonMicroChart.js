/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control'],function(q,l,C){"use strict";var a=C.extend("sap.suite.ui.microchart.ComparisonMicroChart",{metadata:{library:"sap.suite.ui.microchart",properties:{size:{type:"sap.m.Size",group:"Misc",defaultValue:"Auto"},scale:{type:"string",group:"Misc",defaultValue:""},width:{type:"sap.ui.core.CSSSize",group:"Misc"},view:{type:"sap.suite.ui.microchart.ComparisonMicroChartViewType",group:"Appearance",defaultValue:"Normal"},colorPalette:{type:"string[]",group:"Appearance",defaultValue:[]},shrinkable:{type:"boolean",group:"Misc",defaultValue:"false"},height:{type:"sap.ui.core.CSSSize",group:"Appearance"}},aggregations:{data:{type:"sap.suite.ui.microchart.ComparisonMicroChartData",multiple:true}},events:{press:{}}}});a.prototype.init=function(){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");this.setTooltip("{AltText}");};a.prototype._calculateChartData=function(){var r=[];var d=this.getData();var c=d.length;var m=0;var M=0;var t;var b;var e;var i;for(i=0;i<c;i++){var D=isNaN(d[i].getValue())?0:d[i].getValue();m=Math.max(m,D);M=Math.min(M,D);}t=m-M;b=(t==0)?0:Math.round(m*100/t);if(b==0&&m!=0){b=1;}else if(b==100&&M!=0){b=99;}e=100-b;for(i=0;i<c;i++){var I={};var f=isNaN(d[i].getValue())?0:d[i].getValue();I.value=(t==0)?0:Math.round(f*100/t);if(I.value==0&&f!=0){I.value=(f>0)?1:-1;}else if(I.value==100){I.value=b;}else if(I.value==-100){I.value=-e;}if(I.value>=0){I.negativeNoValue=e;I.positiveNoValue=b-I.value;}else{I.value=-I.value;I.negativeNoValue=e-I.value;I.positiveNoValue=b;}r.push(I);}return r;};a.prototype.attachEvent=function(e,d,f,L){sap.ui.core.Control.prototype.attachEvent.call(this,e,d,f,L);if(this.hasListeners("press")){this.$().attr("tabindex",0).addClass("sapSuiteUiMicroChartPointer");}return this;};a.prototype.detachEvent=function(e,f,L){sap.ui.core.Control.prototype.detachEvent.call(this,e,f,L);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");}return this;};a.prototype._getLocalizedColorMeaning=function(c){return this._oRb.getText(("SEMANTIC_COLOR_"+c).toUpperCase());};a.prototype.getAltText=function(){var s=this.getScale();var A="";for(var i=0;i<this.getData().length;i++){var b=this.getData()[i];var m=(this.getColorPalette().length)?"":this._getLocalizedColorMeaning(b.getColor());A+=((i==0)?"":"\n")+b.getTitle()+" "+(b.getDisplayValue()?b.getDisplayValue():b.getValue())+s+" "+m;}return A;};a.prototype.getTooltip_AsString=function(){var t=this.getTooltip();var T=this.getAltText();if(typeof t==="string"||t instanceof String){T=t.split("{AltText}").join(T).split("((AltText))").join(T);return T;}return t?t:"";};a.prototype._adjustBars=function(){var h=parseFloat(this.$().css("height"));var b=this.getData().length;var B=this.$().find(".sapSuiteCmpChartItem");var m=parseFloat(B.css("min-height"));var M=parseFloat(B.css("max-height"));var i;if(b!=0){i=h/b;if(i>M){i=M;}else if(i<m){i=m;}B.css("height",i);if(this.getView()==="Wide"){this.$().find(".sapSuiteCmpChartBar>div").css("height",(i*79/42)+"%");}else if(this.getView()==="Normal"){this.$().find(".sapSuiteCmpChartBar>div").css("height",(i-19)+"%");}var c=(h-i*b)/2;if(c>0){q(B[0]).css("margin-top",c+7+"px");}}};a.prototype.onAfterRendering=function(){if(this.getHeight()!=""){var t=this;sap.ui.Device.media.attachHandler(function(){t._adjustBars();});this._adjustBars();}};a.prototype._getBarAltText=function(b){var s=this.getScale();var B=this.getData()[b];var m=(this.getColorPalette().length)?"":this._getLocalizedColorMeaning(B.getColor());return B.getTitle()+" "+(B.getDisplayValue()?B.getDisplayValue():B.getValue())+s+" "+m;};a.prototype.onsaptabnext=function(e){var L=this.$().find(":focusable").last();if(L){this._bIgnoreFocusEvt=true;L.get(0).focus();}};a.prototype.onsaptabprevious=function(e){if(e.target.id!=e.currentTarget.id){var f=this.$().find(":focusable").first();if(f){f.get(0).focus();}}};a.prototype.ontap=function(e){if(sap.ui.Device.browser.edge){this.onclick(e);}};a.prototype.onclick=function(e){if(!this.fireBarPress(e)){if(sap.ui.Device.browser.internet_explorer||sap.ui.Device.browser.edge){this.$().focus();}this.firePress();}};a.prototype.onkeydown=function(e){switch(e.keyCode){case q.sap.KeyCodes.SPACE:e.preventDefault();break;case q.sap.KeyCodes.ARROW_LEFT:case q.sap.KeyCodes.ARROW_UP:var f=this.$().find(":focusable");var t=f.index(e.target);if(f.length>0){f.eq(t-1).get(0).focus();e.preventDefault();e.stopPropagation();}break;case q.sap.KeyCodes.ARROW_DOWN:case q.sap.KeyCodes.ARROW_RIGHT:var F=this.$().find(":focusable");var T=F.index(e.target);if(F.length>0){F.eq((T+1<F.length)?T+1:0).get(0).focus();e.preventDefault();e.stopPropagation();}break;default:}};a.prototype.onkeyup=function(e){if(e.which==q.sap.KeyCodes.ENTER||e.which==q.sap.KeyCodes.SPACE){if(!this.fireBarPress(e)){this.firePress();e.preventDefault();}}};a.prototype.fireBarPress=function(e){var b=q(e.target);if(b&&b.attr("data-bar-index")){var i=parseInt(b.attr("data-bar-index"),10);var c=this.getData()[i];if(c){c.firePress();e.preventDefault();e.stopPropagation();if(sap.ui.Device.browser.internet_explorer){q.sap.byId(this.getId()+"-chart-item-bar-"+i).focus();}return true;}}return false;};a.prototype.setBarPressable=function(b,p){if(p){var B=this._getBarAltText(b);q.sap.byId(this.getId()+"-chart-item-bar-"+b).addClass("sapSuiteUiMicroChartPointer").attr("tabindex",0).attr("title",B).attr("role","presentation").attr("aria-label",B);}else{q.sap.byId(this.getId()+"-chart-item-bar-"+b).removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer").removeAttr("title").removeAttr("role").removeAttr("aria-label");}};a.prototype.onfocusin=function(e){if(this._bIgnoreFocusEvt){this._bIgnoreFocusEvt=false;return;}if(this.getId()+"-hidden"==e.target.id){this.$().focus();e.preventDefault();e.stopPropagation();}};return a;});
