/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Path","sap/gantt/misc/Utility","sap/gantt/misc/Format"],function(P,U,F){"use strict";var a=P.extend("sap.gantt.shape.ext.ulc.UlcClipingPath",{});a.prototype.getD=function(d,r){if(this.mShapeConfig.hasShapeProperty("d")){return this._configFirst("d",d);}var b="";if(d.values){for(var i=0;i<d.values.length;i++){var A=this.mChartInstance.getAxisTime();var x=A.timeToView(F.abapTimestampToDate(d.values[i].from));var c=A.timeToView(F.abapTimestampToDate(d.values[i].to));var e=d.values[i].value;if(isNaN(e)){e=0;}var m=25;if(this.mShapeConfig.hasShapeProperty("maxVisibleRatio")){m=this._configFirst("maxVisibleRatio",d);}if(e>(100+m)){e=100+m;}var y=r.y+r.rowHeight-r.rowHeight*(e/(100+m));var l=r.y+r.rowHeight;b=b+(d.values[i].firstOne?" M "+x+" "+l:"")+" L "+x+" "+y+" L "+c+" "+y+(d.values[i].lastOne?" L "+c+" "+l:"");}}return b===""?"M 0 0":b;};return a;},true);
