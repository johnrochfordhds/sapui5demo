/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Control", "sap/gantt/misc/Utility", "../misc/AxisTime", "sap/ui/thirdparty/d3"
], function (Control, Utility, AxisTime) {
	"use strict";
	
	var LegendBase = Control.extend("sap.gantt.legend.LegendBase", {
		metadata: {
			abstract: true,
			properties: {
				svgDefs: {type: "array"},
				legendWidth: {type: "number", defaultValue: 32}, // width in pixels in compact mode
				legendHeight: {type: "number", defaultValue: 32}, // height in pixels in compact mode

				/**
				 * Font size of legend item texts.
				 */
				fontSize: {type: "number", defaultValue: 16} // font size for legend text
			}
		}
	});
	
	// timestamp to create a fake axistime.
	LegendBase.prototype.TIME_RANGE = ["20160101000000", "20160103000000"];
	// middle timestamp of the time axis.
	LegendBase.prototype.TIME = "20160102000000";
	
	LegendBase.prototype.init = function () {
		this._aTimeRange = [d3.time.format("%Y%m%d%H%M%S").parse(this.TIME_RANGE[0]),
			d3.time.format("%Y%m%d%H%M%S").parse(this.TIME_RANGE[1])];
	};
	
	LegendBase.prototype.getAxisTime = function () {
		return this._oAxisTime;
	};
	
	LegendBase.prototype.onBeforeRendering = function () {
		this._sUiSizeMode = Utility.findSapUiSizeClass();
		
		this._aViewRange = [0, this._getScaledLegendWidth()];
		this._oAxisTime = new AxisTime(this._aTimeRange, this._aViewRange);
//		for calendar
//		this._oStatusSet = {
//			aViewBoundary: this._aViewRange
//		};
	};
	
	LegendBase.prototype._getScaledLegendWidth = function () {
		return Utility.scaleBySapUiSize(this.getSapUiSizeClass(), this.getLegendWidth());
	};
	
	LegendBase.prototype._getScaledLegendHeight = function () {
		return Utility.scaleBySapUiSize(this.getSapUiSizeClass(), this.getLegendHeight());
	};

	LegendBase.prototype.getSapUiSizeClass = function () {
		return this._sUiSizeMode;
	};
	return LegendBase;
}, true);