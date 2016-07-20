/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./LegendBase"
], function (LegendBase) {
	"use strict";
	
	var DimensionLegend = LegendBase.extend({
		metadata: {
			properties: {
				shape: {type: "sap.gantt.config.Shape"},
				xDimension: {type: "string"},
				yDimension: {type: "string"},
				xDomain: {type: "array"},
				yDomain: {type: "array"}
			}
		}
	});
	
	return DimensionLegend;
}, true);