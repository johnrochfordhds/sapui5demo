/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/Link','sap/m/LinkRenderer','sap/ui/comp/navpopover/LinkData'],function(q,L,a,b){"use strict";var S=L.extend("sap.ui.comp.navpopover.SmartLink",{metadata:{library:"sap.ui.comp",properties:{semanticObject:{type:"string",defaultValue:null},semanticObjectController:{type:"any",defaultValue:null},fieldName:{type:"string",defaultValue:null},semanticObjectLabel:{type:"string",defaultValue:null},createControlCallback:{type:"object",defaultValue:null},mapFieldToSemanticObject:{type:"boolean",defaultValue:true},ignoreLinkRendering:{type:"boolean",defaultValue:false}},aggregations:{innerControl:{type:"sap.ui.core.Control",multiple:false}},events:{beforePopoverOpens:{parameters:{semanticObject:{type:"string"},semanticAttributes:{type:"object"},setSemanticAttributes:{type:"function"},setAppStateKey:{type:"function"},originalId:{type:"string"},open:{type:"function"}}},navigationTargetsObtained:{parameters:{mainNavigation:{type:"sap.ui.comp.navpopover.LinkData"},actions:{type:"sap.ui.comp.navpopover.LinkData[]"},ownNavigation:{type:"sap.ui.comp.navpopover.LinkData"},semanticObject:{type:"string"},originalId:{type:"string"},show:{type:"function"}}},innerNavigate:{parameters:{text:{type:"string"},href:{type:"string"},semanticObject:{type:"string"},semanticAttributes:{type:"object"},originalId:{type:"string"}}}}},renderer:function(r,c){var R=true;if(c.getIgnoreLinkRendering()){var o=c._getInnerControl();if(o){r.write("<div ");r.writeControlData(c);r.writeClasses();r.write(">");r.renderControl(o);r.write("</div>");R=false;}}if(R){a.render.call(a,r,c);}}});S.prototype.init=function(){this.attachPress(this._linkPressed);this.addStyleClass("sapUiCompSmartLink");this._oSemanticAttributes=null;};S.prototype._linkPressed=function(e){if(this._processingLinkPressed){window.console.warn("SmartLink is still processing last press event. This press event is omitted.");return;}if(this.getIgnoreLinkRendering()){window.console.warn("SmartLink should ignore link rendering. Press event is omitted.");return;}this._processingLinkPressed=true;var A;this._oSemanticAttributes=this._calculateSemanticAttributes();var t=this;var o=function(){t._createPopover();if(t._oSemanticAttributes){t._oPopover.setSemanticAttributes(t._oSemanticAttributes);}if(A){t._oPopover.setAppStateKey(A);}t._oPopover.retrieveNavTargets();};if(this.hasListeners("beforePopoverOpens")){this.fireBeforePopoverOpens({semanticObject:this.getSemanticObject(),semanticAttributes:t._oSemanticAttributes,setSemanticAttributes:function(m){t._oSemanticAttributes=m;},setAppStateKey:function(k){A=k;},originalId:this.getId(),open:o});}else{o();}};S.prototype._onTargetsObtainedOpenDialog=function(){var t=this;if(!this._oPopover.getMainNavigation()){this._oPopover.setMainNavigation(new b({text:this.getText()}));}this.fireNavigationTargetsObtained({actions:this._oPopover.getAvailableActions(),mainNavigation:this._oPopover.getMainNavigation(),ownNavigation:this._oPopover.getOwnNavigation(),semanticObject:this.getSemanticObject(),semanticAttributes:this.getSemanticAttributes(),originalId:this.getId(),show:function(m,M,A,e){if(m!=null&&typeof m==="string"){t._oPopover.setMainNavigationId(m);}else{e=A;A=M;M=m;}if(M){t._oPopover.setMainNavigation(M);}if(A){t._oPopover.removeAllAvailableActions();if(A&&A.length){var i,l=A.length;for(i=0;i<l;i++){t._oPopover.addAvailableAction(A[i]);}}}if(e){t._oPopover.setExtraContent(e);}t._oPopover.show();t._processingLinkPressed=false;}});if(!this.hasListeners("navigationTargetsObtained")){this._oPopover.show();this._processingLinkPressed=false;}};S.prototype._onInnerNavigate=function(e){var p=e.getParameters();this.fireInnerNavigate({text:p.text,href:p.href,originalId:this.getId(),semanticObject:this.getSemanticObject(),semanticAttributes:this.getSemanticAttributes()});};S.prototype._createPopover=function(){if(!this._oPopover){var c=this._getComponent();q.sap.require("sap.ui.comp.navpopover.NavigationPopover");var N=sap.ui.require("sap/ui/comp/navpopover/NavigationPopover");this._oPopover=new N({title:this.getSemanticObjectLabel(),semanticObjectName:this.getSemanticObject(),targetsObtained:q.proxy(this._onTargetsObtainedOpenDialog,this),navigate:q.proxy(this._onInnerNavigate,this),component:c});this._oPopover.setSource(this);}};S.prototype._getComponent=function(){var p=this.getParent();while(p){if(p instanceof sap.ui.core.Component){return p;}p=p.getParent();}return null;};S.prototype._calculateSemanticAttributes=function(){var c=this.getBindingContext();if(!c){return null;}var B=this.getBinding("text");var C=B.getPath();var r={};var c=c.getObject(c.getPath());for(var A in c){if(A==="__metadata"){continue;}if(!c[A]){continue;}var s=this._mapFieldToSemanticObject(A);if(A===C&&this.getSemanticObject()){s=this.getSemanticObject();}if(s===this.getSemanticObject()&&!this.getMapFieldToSemanticObject()){s=A;}var o=c[A];if(r[s]){if(c[C]){o=c[C];}}r[s]=o;}return r;};S.prototype.getSemanticAttributes=function(){if(this._oSemanticAttributes===null){this._oSemanticAttributes=this._calculateSemanticAttributes();}return this._oSemanticAttributes;};S.prototype._mapFieldToSemanticObject=function(f){var s=this.getSemanticObjectController();if(!s){return f;}var m=s.getFieldSemanticObjectMap();if(!m){return f;}return m[f]||f;};S.prototype.setFieldName=function(f){this.setProperty("fieldName",f);var s=this.getSemanticObjectController();if(s){s.setIgnoredState(this);}};S.prototype.setSemanticObject=function(s){this.setProperty("semanticObject",s,true);var o=this.getSemanticObjectController();if(o){o.setIgnoredState(this);}};S.prototype.setSemanticObjectController=function(c){var o=this.getProperty("semanticObjectController");if(o){o.unregisterControl(this);}this.setProperty("semanticObjectController",c,true);if(c){c.registerControl(this);}this._oSemanticAttributes=null;};S.prototype.getSemanticObjectController=function(){var c=this.getProperty("semanticObjectController");if(!c){var p=this.getParent();while(p){if(p.getSemanticObjectController){c=p.getSemanticObjectController();if(c){this.setSemanticObjectController(c);break;}}p=p.getParent();}}return c;};S.prototype.getSemanticObjectValue=function(){var s=this.getSemanticAttributes();if(s){var c=this.getSemanticObject();return s[c];}return null;};S.prototype.setText=function(t){if(this._isRenderingInnerControl()){this.setProperty("text",t,true);}else{L.prototype.setText.call(this,t);}};S.prototype._isRenderingInnerControl=function(){return this.getIgnoreLinkRendering()&&this._getInnerControl()!=null;};S.prototype._getInnerControl=function(){var i=this.getAggregation("innerControl");if(!i){var c=this.getCreateControlCallback();if(c){i=c();this.setAggregation("innerControl",i,true);}}return i;};S.prototype.getInnerControlValue=function(){if(this._isRenderingInnerControl()){var i=this._getInnerControl();if(i){if(i.getText){return i.getText();}if(i.getValue){return i.getValue();}}}return this.getText();};S.prototype.onBeforeRendering=function(){this.getSemanticObjectController();if(this.getIgnoreLinkRendering()&&this._getInnerControl()==null){this.setEnabled(false);}else{this.setEnabled(true);}};S.prototype.exit=function(){this.setSemanticObjectController(null);};return S;},true);