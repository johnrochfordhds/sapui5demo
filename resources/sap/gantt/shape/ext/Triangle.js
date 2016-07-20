/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Path"],function(P){"use strict";var T=P.extend("sap.gantt.shape.ext.Triangle",{metadata:{properties:{isClosed:{type:"boolean",defaultValue:true},base:{type:"number",defaultValue:10},height:{type:"number",defaultValue:10},distanceOfyAxisHeight:{type:"number",defaultValue:5}}}});T.prototype.init=function(){var r=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",r.getText("ARIA_TRIANGLE"));};T.prototype.getD=function(d,r){if(this.mShapeConfig.hasShapeProperty("d")){return this._configFirst("d",d);}var n=this.getBase(d,r);var a=this.getHeight(d,r);var b=this.getDistanceOfyAxisHeight(d,r);var c=this.getHeight(d,r)/2;var C=this.getRotationCenter(d,r);return"M "+C.join(" ")+" m 0 "+c+" l -"+b+" 0 l "+b+" -"+a+" l "+Number(n-b)+" "+a+" l -"+Number(n-b)+" 0 z";};T.prototype.getBase=function(d){return this._configFirst("base",d,true);};T.prototype.getHeight=function(d){return this._configFirst("height",d,true);};T.prototype.getDistanceOfyAxisHeight=function(d){return this._configFirst("distanceOfyAxisHeight",d,true);};return T;},true);
