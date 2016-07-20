/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Path"],function(P){"use strict";var C=P.extend("sap.gantt.shape.ext.Cursor",{metadata:{properties:{isClosed:{type:"boolean",defaultValue:true},length:{type:"number",defaultValue:10},width:{type:"number",defaultValue:5},pointHeight:{type:"number",defaultValue:5}}}});C.prototype.init=function(){var r=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",r.getText("ARIA_CURSOR"));};C.prototype.getD=function(d,r){if(this.mShapeConfig.hasShapeProperty("d")){return this._configFirst("d",d);}var n=this.getPointHeight(d,r);var a=this.getWidth(d,r);var b=this.getLength(d,r);var c=b/2;var e=this.getRotationCenter(d,r);return"M "+e.join(" ")+" m "+-c+" "+-(a+n)/2+" l "+b+" 0 l 0 "+a+" l -"+c+" "+n+" l -"+c+" -"+n+" z";};C.prototype.getLength=function(d){return this._configFirst("length",d,true);};C.prototype.getWidth=function(d){return this._configFirst("width",d,true);};C.prototype.getPointHeight=function(d){return this._configFirst("pointHeight",d,true);};return C;},true);
