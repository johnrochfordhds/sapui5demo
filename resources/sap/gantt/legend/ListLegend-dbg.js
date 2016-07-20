/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./LegendBase", "sap/gantt/drawer/ListLegend", "sap/gantt/drawer/CalendarPattern"
], function (LegendBase, ListLegendDrawer, CalendarPattern) {
	"use strict";
	
	var ListLegend = LegendBase.extend("sap.gantt.legend.ListLegend", {
		metadata: {
			properties: {
				shapes: {type: "array"}
			}
		}
	});
	
	ListLegend.prototype.init = function () {
		LegendBase.prototype.init.apply(this, arguments);
		this._oListLegendDrawer = new ListLegendDrawer();
	};
	
	ListLegend.prototype.onAfterRendering = function () {
		for (var i = 0; i < this._aShapeInstance.length; i++) {
			var oShape = this._aShapeInstance[i];
			
			var aSvg = d3.select("#" + this.getId() + "-svg-" + i);

			this._oListLegendDrawer._drawPerTag(aSvg, oShape);
		}
	};
	
	ListLegend.prototype.setShapes = function (aShapes) {
		if (aShapes && aShapes.length > 0) {
			this._aShapeInstance = this._instantShape(aShapes);
			this.setProperty("shapes", aShapes);
		}
		return this;
	};

	ListLegend.prototype._instantShape = function (aShapes) {
		var aRetVal = [];
		// parse shape instances
		for (var i = 0; i < aShapes.length; i++) {
			if (aShapes[i].getShapeClassName()) {
				// create shape instance
				var oShapeInst = this._instantiateCustomerClass(aShapes[i].getShapeClassName(), i, aShapes[i]);
				
				if (aShapes[i].getClippathAggregation() && aShapes[i].getClippathAggregation() instanceof Array) {
					// create aggregation classes for clip-path
					var aPath = this._instantShape(aShapes[i].getClippathAggregation());
					aRetVal = aRetVal.concat(aPath);
				} else if (aShapes[i].getGroupAggregation() && aShapes[i].getGroupAggregation() instanceof Array) {
					// create aggregation classes for group
					var aAggregation = this._instantShape(aShapes[i].getGroupAggregation());
					for (var k = 0; k < aAggregation.length; k++) {
						oShapeInst.addShape(aAggregation[k]);
					}
				}
				
				if (this._isProperShape(oShapeInst)) {
					aRetVal.push(oShapeInst);
				}
			}
		}

		return aRetVal;
	};
	
	ListLegend.prototype._isProperShape = function (oShapeInst) {
		if (oShapeInst instanceof sap.gantt.shape.cal.Calendar) {
			jQuery.sap.log.warning("Calendar is not proper shape", "key '" + oShapeInst.mShapeConfig.getKey() + "'", "ListLegend");
			return false;
		} else if (oShapeInst.getTag() == "clippath") {
			return false;
		} else {
			return true;
		}
	};

	ListLegend.prototype._instantiateCustomerClass = function (sCustomerClassName, sShapeId, oShapeConfig) {
		var CustomerClass = jQuery.sap.getObject(sCustomerClassName);
		if (!CustomerClass) {
			jQuery.sap.require(sCustomerClassName);
			CustomerClass = jQuery.sap.getObject(sCustomerClassName);
		}
		
		var oCustomerClassInstance = new CustomerClass();

		oCustomerClassInstance.mShapeConfig = oShapeConfig;
		oCustomerClassInstance.mChartInstance = this;

		return oCustomerClassInstance;
	};
	
	return ListLegend;
}, true);