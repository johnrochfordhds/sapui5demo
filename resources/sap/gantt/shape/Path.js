/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Shape","sap/gantt/misc/Utility"],function(S,U){"use strict";var P=S.extend("sap.gantt.shape.Path",{metadata:{properties:{tag:{type:"string",defaultValue:"path"},isClosed:{type:"boolean",defaultValue:false},fill:{type:"string",defaultValue:"none"},d:{type:"string"}}}});P.prototype.init=function(){var r=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",r.getText("ARIA_PATH"));};P.prototype.getD=function(d,r){if(this.mShapeConfig.hasShapeProperty("d")){return this._configFirst("d",d);}var c=this._getCenter(d,r),i=this.getIsDuration(d,r),m=this.mChartInstance.getSapUiSizeClass();var n=U.scaleBySapUiSize(m,7.5);if(i){var e=this._getCenter(d,r,true);n=(e[0]-c[0])/2;}return"M "+c[0]+" "+c[1]+" c 0,"+-n+" "+n+","+-n+" "+n+",0 c 0,"+n+" "+n+","+n+" "+n+",0";};P.prototype.getIsClosed=function(d){return this._configFirst("isClosed",d);};return P;},true);
