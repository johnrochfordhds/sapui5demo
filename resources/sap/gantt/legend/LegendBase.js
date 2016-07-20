/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control","sap/gantt/misc/Utility","../misc/AxisTime","sap/ui/thirdparty/d3"],function(C,U,A){"use strict";var L=C.extend("sap.gantt.legend.LegendBase",{metadata:{abstract:true,properties:{svgDefs:{type:"array"},legendWidth:{type:"number",defaultValue:32},legendHeight:{type:"number",defaultValue:32},fontSize:{type:"number",defaultValue:16}}}});L.prototype.TIME_RANGE=["20160101000000","20160103000000"];L.prototype.TIME="20160102000000";L.prototype.init=function(){this._aTimeRange=[d3.time.format("%Y%m%d%H%M%S").parse(this.TIME_RANGE[0]),d3.time.format("%Y%m%d%H%M%S").parse(this.TIME_RANGE[1])];};L.prototype.getAxisTime=function(){return this._oAxisTime;};L.prototype.onBeforeRendering=function(){this._sUiSizeMode=U.findSapUiSizeClass();this._aViewRange=[0,this._getScaledLegendWidth()];this._oAxisTime=new A(this._aTimeRange,this._aViewRange);};L.prototype._getScaledLegendWidth=function(){return U.scaleBySapUiSize(this.getSapUiSizeClass(),this.getLegendWidth());};L.prototype._getScaledLegendHeight=function(){return U.scaleBySapUiSize(this.getSapUiSizeClass(),this.getLegendHeight());};L.prototype.getSapUiSizeClass=function(){return this._sUiSizeMode;};return L;},true);
