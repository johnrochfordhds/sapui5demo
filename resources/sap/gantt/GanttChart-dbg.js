/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'jquery.sap.global',
	"sap/gantt/GanttChartBase", "sap/ui/core/Core", "sap/ui/table/TreeTable", "sap/ui/table/Row",
	"sap/gantt/misc/Utility",
	'sap/ui/core/theming/Parameters',
	"sap/gantt/shape/SelectedShape", "sap/gantt/shape/ext/rls/SelectedRelationship",
	"sap/gantt/drawer/ShapeInRow", "sap/gantt/drawer/ShapeCrossRow", "sap/gantt/drawer/CursorLine", "sap/gantt/drawer/NowLine", "sap/gantt/drawer/VerticalLine","sap/gantt/drawer/CalendarPattern",
	"sap/gantt/misc/AxisTime", "sap/gantt/misc/AxisOrdinal", "sap/gantt/misc/Format", "sap/gantt/misc/TreeTableHelper",
	// 3rd party lib
	"sap/ui/thirdparty/d3"
], function (jQuery, GanttChartBase, Core, TreeTable, Row, Utility, Parameters, SelectedShape, SelectedRelationship,
		ShapeInRowDrawer, ShapeCrossRowDrawer, CursorLineDrawer, NowLineDrawer, VerticalLineDrawer, CalendarPattern, AxisTime, AxisOrdinal, Format, TreeTableHelper) {
	"use strict";
	
	/**
	 * Creates and initializes a new Gantt Chart.
	 * 
	 * @param {string} [sId] ID for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * 
	 * @class 
	 * Gantt Chart control.
	 * 
	 * <p>The Gantt chart has a horizontal axis at the top that represents time and a vertical axis that represents rows.
	 * </p>
	 * 
	 * @extends sap.gantt.GanttChartBase
	 * 
	 * @author SAP SE
	 * @version 1.36.8
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.GanttChart
	 */
	var GanttChart = GanttChartBase.extend("sap.gantt.GanttChart", /** @lends sap.gantt.GanttChart.prototype */ {
		metadata: {
			aggregations: {
				_treeTable: {type: "sap.ui.table.TreeTable", multiple: false, visibility: "hidden"} // to ensure model pass down
			}
		}
	});

	GanttChart.prototype.init = function () {
		jQuery.sap.measure.start("GanttChart init","GanttPerf:GanttChart init function");
		// create tree table
		this._oTT = new TreeTable({
			visibleRowCountMode: "Auto",
			minAutoRowCount: 1,
			selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly,
			selectionMode: sap.ui.table.SelectionMode.Multi,
			columnHeaderVisible: false
		});
		this._oTT.addColumn(new sap.ui.table.Column());
		this.setAggregation("_treeTable", this._oTT);
		// de/attach horizontal scroll bar
		this._oTT._oHSb.detachScroll(this._oTT.onhscroll, this._oTT);
		this._oTT._oHSb.attachScroll(this._onHSbScroll, this);
		// de/attach vertical scroll bar
		this._oTT._oVSb.detachScroll(this._oTT.onvscroll, this._oTT);
		this._oTT._oVSb.attachScroll(this._onVSbScroll, this);
		// sync svg with oTT
		this._oTT.attachEvent("_rowsUpdated", this._onTTRowUpdate.bind(this));
		this._oTT.addEventDelegate({
			onAfterRendering: this._onTTRowUpdate
		}, this);
		
		this._oTT.attachEvent("_rowSelectionChange", this._onRowSelectionChange.bind(this));
		this._oTT.attachRowSelectionChange(this._onRowSelectionChange, this);
		this._oTT.addEventDelegate({
			onAfterRendering: this._updateCSSForDummyRow
		}, this);
		
		// create drawers
		this._oShapeInRowDrawer = new ShapeInRowDrawer();
		this._oShapeCrossRowDrawer = new ShapeCrossRowDrawer();
		this._oCursorLineDrawer = new CursorLineDrawer();
		this._oCalendarPatternDrawer = new CalendarPattern();
		
		// internal private members
		this._oAxisTime = undefined;
		this._oAxisOrdinal = undefined;
		this._aShapeData = undefined; // data to be drawn on svg using registed shape instances
		this._aShapeInstance = undefined;	// array of shape instances
		this._oShapeInstance = undefined;	// map of top shape instances
		this._oZoom = { // zoom info
			base: {}
		};
		this._oDataNamePerType = {};
		this._fLeftOffsetRate = 0.0;
		this._oStatusSet = null;
		this._nLowerRange = 0;
		this._nUpperRange = 0;
		
		this._aSelectedRelationships = undefined;
		this._oSelectedShapes = {};
		this._aSelectedShapeUids = [];
		
		//add for mouse events to support drag shape over views
		this._iMouseDown = 0;
		this._bMouseDown = false;
		this._bDragging = false;
		this._oDraggingData = undefined;
		
		this._lastHoverRowIndex = undefined;
		
		// defualt maps
		this._oChartSchemesConfigMap = {};
		this._oChartSchemesConfigMap[sap.gantt.config.DEFAULT_CHART_SCHEME_KEY] = sap.gantt.config.DEFAULT_CHART_SCHEME;
		this._oObjectTypesConfigMap = {};
		this._oObjectTypesConfigMap[sap.gantt.config.DEFAULT_OBJECT_TYPE_KEY] = sap.gantt.config.DEFAULT_OBJECT_TYPE;
		
		this._fExtendFactor = 0.382;
		
		// create default this._oAxisTime
		this._calZoomFromTimeAxisConfig(sap.gantt.config.DEFAULT_TIME_AXIS);
		this._createAxisTime(sap.gantt.config.DEFAULT_TIME_AXIS);
		
		// performance tuning
		this._mDrawDelayMS = 500;
		this._mTimeouts = {};

		jQuery.sap.measure.end("GanttChart init");
	};
	
	GanttChart.prototype.setTimeAxis = function (oTimeAxis) {
		this.setProperty("timeAxis", oTimeAxis, true); // no need to trigger rerender
		this._calZoomFromTimeAxisConfig(oTimeAxis);
		this._createAxisTime(oTimeAxis);
		this._oStatusSet = null;
		
		this._draw(true); // only _draw is triggered
		
		return this;
	};
	
	GanttChart.prototype.setLocale = function (oLocale) {
		this.setProperty("locale", oLocale, true); // no need to trigger rerender
		this._oAxisTime.setLocale(oLocale);
		
		this._drawShapes();
		this._drawSelectedShapes();
		
		return this;
	};
	
	GanttChart.prototype.setChartSchemes = function (aChartSchemes) {
		this.setProperty("chartSchemes", aChartSchemes, true); // no need to trigger rerender
		// build a map for easy look up
		this._oChartSchemesConfigMap = {};
		if (aChartSchemes) {
			for (var i = 0; i < aChartSchemes.length; i++) {
				this._oChartSchemesConfigMap[aChartSchemes[i].getKey()] = aChartSchemes[i];
			}
		}
		
		this._drawShapes();
		this._drawSelectedShapes();
		
		return this;
	};
	
	GanttChart.prototype.setObjectTypes = function (aObjectTypes) {
		this.setProperty("objectTypes", aObjectTypes, true); // no need to trigger rerender
		// build a map for easy look up
		this._oObjectTypesConfigMap = {};
		if (aObjectTypes) {
			for (var i = 0; i < aObjectTypes.length; i++){
				this._oObjectTypesConfigMap[aObjectTypes[i].getKey()] = aObjectTypes[i];
			}
		}
		
		this._drawShapes();
		this._drawSelectedShapes();
		
		return this;
	};
	
	GanttChart.prototype.setSelectionMode = function (sSelectionMode) {
		this.setProperty("selectionMode", sSelectionMode);
		if (this._oTT) {
			if (sSelectionMode == sap.gantt.SelectionMode.MultiWithKeyboard) {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.Multi);
			}else if (sSelectionMode == sap.gantt.SelectionMode.Multiple){
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
			}else if (sSelectionMode == sap.gantt.SelectionMode.Single) {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.Single);
			}else {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.None);
			}
		}
		return this;
	};

	GanttChart.prototype._calZoomFromTimeAxisConfig = function (oTimeAxis) {
		if (!oTimeAxis) {
			return;
		}
		// init an object on this._oZoom
		this._oZoom.base.sGranularity = oTimeAxis.getGranularity();
		var oGranularity = oTimeAxis.getZoomStrategy()[this._oZoom.base.sGranularity];
		this._oZoom.determinedByConfig = {
			fRate: 1
		};
		// get granularity objects
		var oFinestGranularity = oTimeAxis.getZoomStrategy()[oTimeAxis.getFinestGranularity()];
		var oCoarsestGranularity = oTimeAxis.getZoomStrategy()[oTimeAxis.getCoarsestGranularity()];
		var oStart = d3.time.format("%Y%m%d%H%M%S").parse("20000101000000");
		// calculate base rate scale
		var oBaseDate = jQuery.sap.getObject(oGranularity.innerInterval.unit)
			.offset(oStart, oGranularity.innerInterval.span);
		this._oZoom.base.fScale = this._calZoomScale(oStart, oBaseDate, oGranularity.innerInterval.range);
		// calculate max rate scale
		var oMaxDate = jQuery.sap.getObject(oFinestGranularity.innerInterval.unit)
			.offset(oStart, oFinestGranularity.innerInterval.span);
		var fMaxScale = this._calZoomScale(oStart, oMaxDate, oFinestGranularity.innerInterval.range * 4);
		// calculate min rate scale
		var oMinDate = jQuery.sap.getObject(oCoarsestGranularity.innerInterval.unit)
			.offset(oStart, oCoarsestGranularity.innerInterval.span);
		var fMinScale = this._calZoomScale(oStart, oMinDate, oCoarsestGranularity.innerInterval.range);
		// calculate zoom rates
		this._oZoom.determinedByConfig.fMaxRate = this._oZoom.base.fScale / fMaxScale;
		this._oZoom.determinedByConfig.fMinRate = this._oZoom.base.fScale / fMinScale;
	};

	GanttChart.prototype._calZoomScale = function (oStartDate, oEndDate, iLength) {
		return (oEndDate.valueOf() - oStartDate.valueOf()) / iLength;
	};

	GanttChart.prototype._createAxisTime = function (oConfigTimeAxis) {
		var aStrategy = oConfigTimeAxis.getZoomStrategy();
		var oHorizonStartTime = d3.time.format("%Y%m%d%H%M%S").parse(
			oConfigTimeAxis.getPlanHorizon().getStartTime());
		var oHorizonEndTime = d3.time.format("%Y%m%d%H%M%S").parse(
			oConfigTimeAxis.getPlanHorizon().getEndTime());
		var nHorizonTimeRange = oHorizonEndTime.valueOf() - oHorizonStartTime.valueOf();

		var oGranularity = aStrategy[oConfigTimeAxis.getGranularity()];
		var nUnitTimeRange = jQuery.sap.getObject(oGranularity.innerInterval.unit)
				.offset(oHorizonStartTime, oGranularity.innerInterval.span).valueOf() - oHorizonStartTime.valueOf();

		this._oAxisTime = new AxisTime(
			[oHorizonStartTime, oHorizonEndTime],
			[0, Math.ceil(nHorizonTimeRange * oGranularity.innerInterval.range / nUnitTimeRange)],
			oConfigTimeAxis.getRate(), null, null,
			this.getLocale(), Core.getConfiguration().getRTL(), oConfigTimeAxis.getZoomStrategy());
		this._nLowerRange = this._oAxisTime.getViewRange()[0];
		this._nUpperRange = Math.ceil(this._oAxisTime.getViewRange()[1]);
	};

	GanttChart.prototype.setShapes = function (aShapes) {
		this.setProperty("shapes", aShapes, true); // no need to trigger rerender
		if (aShapes && aShapes.length > 0) {
			this._oShapesConfigMap = {};
			for (var i = 0; i < aShapes.length; i++) {
				this._oShapesConfigMap[aShapes[i].getKey()] = aShapes[i];
			}
			this._parseAndSortShape(this._oShapesConfigMap);
			
			this._drawShapes();
			this._drawSelectedShapes();
		}
		return this;
	};

	GanttChart.prototype._parseAndSortShape = function (oShapeConfig, sTopShapeId) {
		var aRetVal = [];
		// parse shape instances
		var sShapeId, oShapeInst, oSelectedShapeInst, aAggregation, aPath, sSelectedShapeClassName;
		for (var i in oShapeConfig) {
			sShapeId = sTopShapeId ? sTopShapeId : i;
			oShapeInst = {};
			if (oShapeConfig[i].getShapeClassName()) {
				// create shape instance
					oShapeInst = this._instantiateCustomerClass(oShapeConfig[i].getShapeClassName(), i, oShapeConfig[i], sShapeId);
				var category = oShapeInst.getCategory(null, this._oAxisTime, this._oAxisOrdinal);
				// create selected shape instance for top shape only
				if (!sTopShapeId){
					sSelectedShapeClassName = oShapeConfig[i].getSelectedClassName();
					if (!sSelectedShapeClassName) {
						if (category == sap.gantt.shape.ShapeCategory.Relationship) {
							sSelectedShapeClassName = "sap.gantt.shape.ext.rls.SelectedRelationship";
							oSelectedShapeInst = new SelectedRelationship();
						}else {
							sSelectedShapeClassName = "sap.gantt.shape.SelectedShape";
						}
					}
					oSelectedShapeInst = this._instantiateCustomerClass(
							sSelectedShapeClassName, "selected" + i, oShapeConfig[i], sShapeId);
					oShapeInst.setAggregation("selectedShape", oSelectedShapeInst);
				}
				// create aggregations
				if (oShapeConfig[i].getGroupAggregation() && oShapeConfig[i].getGroupAggregation() instanceof Array) {
					// create aggregation classes for group
					aAggregation = this._parseAndSortShape(oShapeConfig[i].getGroupAggregation(), sShapeId);
					for (var k = 0; k < aAggregation.length; k++) {
						oShapeInst.addShape(aAggregation[k]);
					}
				} else if (oShapeConfig[i].getClippathAggregation() && oShapeConfig[i].getClippathAggregation() instanceof Array) {
					// create aggregation classes for clip-path
					aPath = this._parseAndSortShape(oShapeConfig[i].getClippathAggregation(), sShapeId);
					for (var j = 0; j < aPath.length; j++) {
						oShapeInst.addPath(aPath[j]);
					}
				}
			}
			aRetVal.push(oShapeInst);
		}

		// sort top shape instances and create map by shape id
		if (sTopShapeId){
			return aRetVal;
		} else {
			aRetVal.sort(function (oShape1, oShape2) {
				var level1 = jQuery.isNumeric(oShape1.mShapeConfig.getLevel()) ?
						oShape1.mShapeConfig.getLevel() : 99;
				var level2 = jQuery.isNumeric(oShape2.mShapeConfig.getLevel()) ?
						oShape2.mShapeConfig.getLevel() : 99;
				return level2 - level1;
			});
			this._aShapeInstance = aRetVal;

			var oShapeMap = {};
			jQuery.each(this._aShapeInstance, function (iKey, oValue) {
				oShapeMap[oValue.mShapeConfig.getKey()] = oValue;
			});
			this._oShapeInstance = oShapeMap;
		}
	};

	GanttChart.prototype._instantiateCustomerClass = function (sCustomerClassName, sShapeId, oShapeConfig, sTopShapeId) {
		var CustomerClass = jQuery.sap.getObject(sCustomerClassName);
		if (!CustomerClass) {
			jQuery.sap.require(sCustomerClassName);
			CustomerClass = jQuery.sap.getObject(sCustomerClassName);
		}
		
		var oCustomerClassInstance = new CustomerClass();
		var sTShapeId = sTopShapeId;
		if (sTShapeId === undefined) {
			sTShapeId = sShapeId;
		}
		this._storeCustomerClassId(sShapeId, oCustomerClassInstance.getId(), sTopShapeId);
		
		oCustomerClassInstance.mLocaleConfig = this.getLocale();
		oCustomerClassInstance.mShapeConfig = oShapeConfig;
		oCustomerClassInstance.mChartInstance = this;

		return oCustomerClassInstance;
	};
	
	/*
	 * {
	 * 		"activity": "__group0", //sId is the Id of shape class instance and it is randomly generated by UI5 framework
	 * 		"header": "__group1",
	 * 		...
	 * }
	 */
	GanttChart.prototype._storeCustomerClassId = function (sShapeId, sId, sTopShapeId) {
		if (!this._customerClassIds){
			this._customerClassIds = {};
		}
		if (this._oShapesConfigMap[sShapeId]){
			this._customerClassIds[sShapeId] = {
						"classId": sId,
						"topShapeId": sTopShapeId
					};
		}else {
			//non-topShape, when no shapeId in the shapeConfig.groupAggregation
			var sShape = sTopShapeId + "_" + sShapeId;
			this._customerClassIds[sShape] = {
					"classId": sId,
					"topShapeId": sTopShapeId
			};
		}
	};
	
	GanttChart.prototype._getIdByShapeId = function (sShapeId) {
		if (this._customerClassIds && this._customerClassIds[sShapeId]){
			return this._customerClassIds[sShapeId].classId;
		}
		return null;
	};
	
	GanttChart.prototype._getShapeIdById = function (sClassId) {
		if (this._customerClassIds){
			for (var sShapeId in this._customerClassIds) {
				var obj = this._customerClassIds[sShapeId];
				if (obj.classId === sClassId) {
					return {"shapeId": sShapeId, "topShapeId": obj.topShapeId};
				}
			}
		}
		return null;
	};

	GanttChart.prototype._genShapeConfig = function (sShapeId, oProp) {
		var obj = {}, oConfig;
		if (sShapeId !== null && sShapeId !== undefined) {
			obj.shapeId = sShapeId;
		}
		if (oProp.data) {
			obj.data = oProp.data;
		}
		if (oProp.level) {
			obj.level = oProp.level;
		}
		if (oProp.draw){
			oConfig = oProp.draw;
		} else {
			oConfig = oProp;
		}
		for (var item in oConfig) {
			if (item !== "class") {
				obj[item] = oConfig[item];
			}
		}
		return obj;
	};

	GanttChart.prototype.calculateZoomInfoFromChartWidth = function (iChartWidth) {
		var oTimeAxis = this.getTimeAxis();
		var oPlanHorizon = oTimeAxis.getPlanHorizon();
		var oInitHorizon = oTimeAxis.getInitHorizon();
		this._oZoom.determinedByChartWidth = {};
		
		// calculate min zoom rate by time horizon against svg container width
		if (oPlanHorizon) {
			var fMinScale = this._calZoomScale(
				Format.abapTimestampToDate(oPlanHorizon.getStartTime()),
				Format.abapTimestampToDate(oPlanHorizon.getEndTime()),
				iChartWidth);
			this._oZoom.determinedByChartWidth.fMinRate =  this._oZoom.base.fScale / fMinScale;
		}
		// calculate sutible zoom rate by init horizon against svg container width
		if (oInitHorizon && oInitHorizon.getStartTime() && oInitHorizon.getEndTime()) {
			var fSuitableScale = this._calZoomScale(
				Format.abapTimestampToDate(oInitHorizon.getStartTime()),
				Format.abapTimestampToDate(oInitHorizon.getEndTime()),
				iChartWidth);
			this._oZoom.determinedByChartWidth.fSuitableRate = this._oZoom.base.fScale / fSuitableScale;
		}
		this._oZoom.iChartWidth = iChartWidth;
		return this._oZoom;
	};

	GanttChart.prototype.setTimeZoomRate = function (fTimeZoomRate) {
		this.setProperty("timeZoomRate", fTimeZoomRate, true); // no need to trigger rerender
		this._oAxisTime.setZoomRate(fTimeZoomRate);
		this._oAxisTime.setViewOffset(0);
		this._oStatusSet = null;
		this._nLowerRange = this._oAxisTime.getViewRange()[0];
		this._nUpperRange = Math.ceil(this._oAxisTime.getViewRange()[1]);
		this._draw(true); // only _draw is triggered
		return this;
	};

	GanttChart.prototype.getBaseRowHeight = function () {
		if (this._oTT.getRows()[0] && this._oTT.getRows()[0].getDomRef()) {
			return this._oTT.getRows()[0].getDomRef().scrollHeight;
		}
	};
	
	/*
	 * Called by UI5 ManagedObject before and after retrieving data.
	 */
	GanttChart.prototype.updateRelationships = function (sReason) {
		var oBinding = this.getBinding("relationships");
		
		if (oBinding) {
			var aContext = oBinding.getContexts(0, 0);
			
			if (aContext && aContext.length > 0) {
				this._aRelationshipsContexts = aContext;
			}
		}
	};
	
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.addRelationship = function (oRelationship) {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"addRelationship\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.insertRelationship = function (iIndex, oRelationship) {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"insertRelationship\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.removeRelationship = function (oRelationship) {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"removeRelationship\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.getRelationships = function () {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"getRelationships\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.destroyRelationships = function () {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"destroyRelationships\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.indexOfRelationship = function (oRelationship) {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"indexOfRelationship\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.removeAllRelationships = function () {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"removeAllRelationships\" cannot be used programmatically!");
	};

	GanttChart.prototype._bindAggregation = function (sName, oBindingInfo) {
		if (sName == "rows" && oBindingInfo){
			var oModel = this.getModel(oBindingInfo.model);
			// resolve the path if view itself is binded
			var oBindingContext = this.getBindingContext(oBindingInfo.model);
			if (oBindingContext && oModel){
				oBindingInfo.path = oModel.resolve(oBindingInfo.path, oBindingContext);
			}
			this._oTT.bindRows(oBindingInfo);
		} else {
			return sap.ui.core.Control.prototype._bindAggregation.apply(this, arguments);
		}
	};

	GanttChart.prototype.onBeforeRendering = function () {
		this._detachEvents();
		this._updateModelForMultiMainRow();
	};

	GanttChart.prototype._updateModelForMultiMainRow = function() {
		var oBinding = this._oTT.getBinding("rows");
		if (!oBinding || oBinding.getLength() === 0) {
			return;
		}
		var aRowContext = oBinding.getContexts(0, oBinding.getLength());
		var oAllShapeData = {}, iRowSpan = 1, sMainChartScheme,
		sType = aRowContext[0].getProperty("type");
		if (sType && this._oObjectTypesConfigMap[sType]) {
			sMainChartScheme = this._oObjectTypesConfigMap[sType].getProperty("mainChartSchemeKey");
			if (sMainChartScheme && this._oChartSchemesConfigMap[sMainChartScheme]) {
				iRowSpan = this._oChartSchemesConfigMap[sMainChartScheme].getProperty("rowSpan");
			}
		}
	
		if (iRowSpan == 1 || iRowSpan == undefined) {
			return;
		}
		for (var i = 0; i < aRowContext.length; i++) {
			var oRowData = aRowContext[i].getProperty();
			if (TreeTableHelper.isDummyRow(this._oTT, i)) {
				continue;
			}
			if (i < aRowContext.length - 1){
				if (TreeTableHelper.isDummyRow(this._oTT, i + 1)) {
					continue;
				}
			}
			oRowData.previousNodeNum = 0;
			oRowData.afterNodeNum = iRowSpan - 1;
			//allShapeData.push(oRowData);
			var oDummyData = {"chartScheme" : sMainChartScheme, "mainRowId" : oRowData.id};
			var aAddData = [];
			for ( var j = 1; j < iRowSpan; j++) {
				var oTempData = jQuery.extend(true, {}, oDummyData);
				oTempData.previousNodeNum = j;
				oTempData.afterNodeNum = iRowSpan - j - 1;
				aAddData.push(oTempData);
			}
			oAllShapeData[i] = aAddData;
		}

		if (!$.isEmptyObject(oAllShapeData)) {
			TreeTableHelper.addDummyData(this._oTT, oAllShapeData, false);
		}
	};

	GanttChart.prototype._detachEvents = function () {
		jQuery("#" + this.getId() + "-svg-ctn").unbind("mousemove", this._onSvgCtnMouseMove);
		jQuery("#" + this.getId() + "-svg-ctn").unbind("mouseleave", this._onSvgCtnMouseLeave);
		jQuery("#" + this.getId() + "-svg-ctn").unbind("mousedown", this._onSvgCtnMouseDown);
		jQuery("#" + this.getId() + "-svg-ctn").unbind("mouseenter", this._onSvgCtnMouseEnter);
		jQuery("#" + this.getId() + "-svg-ctn").unbind("mouseup", this._onSvgCtnMouseUp);
	};

	GanttChart.prototype.onAfterRendering = function () {
		this._attachEvents();
	};

	GanttChart.prototype._attachEvents = function () {

		var $svgCtn = jQuery("#" + this.getId() + "-svg-ctn");	
		$svgCtn.bind("mousemove", this._onSvgCtnMouseMove.bind(this));
		$svgCtn.bind("mouseleave", this._onSvgCtnMouseLeave.bind(this));
		$svgCtn.bind("mousedown", this._onSvgCtnMouseDown.bind(this));
		$svgCtn.bind("mouseenter", this._onSvgCtnMouseEnter.bind(this));
		$svgCtn.bind("mouseup", this._onSvgCtnMouseUp.bind(this));
	};

	GanttChart.prototype.expandChartChange = function (isExpand, aExpandChartSchemes, aExpandedIndices) {
		if (aExpandChartSchemes.length < 0) {
			return;
		}
		jQuery.sap.measure.start("GanttChart expandChartChange","GanttPerf:GanttChart expandChartChange function");
		var aSelectedIndices = (aExpandedIndices && aExpandedIndices.length > 0) ? aExpandedIndices : this._oTT.getSelectedIndices();
		var key;
		if (isExpand) {
			for (key = 0; key < aExpandChartSchemes.length; key++) {
				var sScheme = aExpandChartSchemes[key];
				var sMode;
				if (this._oChartSchemesConfigMap[sScheme] && this._oChartSchemesConfigMap[sScheme].getModeKey()) {
					sMode = this._oChartSchemesConfigMap[sScheme].getModeKey();
				} else {
					sMode = this.getMode();
				}
				var oAllInsertedData = {};
				for (var i = 0; i < aSelectedIndices.length; i++) {
					if (TreeTableHelper.isDummyRow(this._oTT, aSelectedIndices[i])) {
						continue;
					}
					var oSelectedData = TreeTableHelper.getContextObject(this._oTT, aSelectedIndices[i]);
					var oDummyData = {"__group" : aExpandChartSchemes[key], "parentData" : oSelectedData, "parentRefId" : oSelectedData.id};
					//Check whether the current object data has the expanded chart scheme
					if (this._oObjectTypesConfigMap[oSelectedData.type] && this._oObjectTypesConfigMap[oSelectedData.type].getExpandedChartSchemeKeys().length > 0) {
						var aValidSchems = this._oObjectTypesConfigMap[oSelectedData.type].getExpandedChartSchemeKeys();
						if ($.inArray(sScheme, aValidSchems) > -1) {
							var aDrawData, iRowSpan = 1;
							//If the expandedChartScheme is available in current mode, return all valid data names, which can be drawn by shapes of the expandedChartScheme
							var oSchemeInfo = this._collectDataNameForValidChartScheme(sScheme, sMode);
							if (oSchemeInfo) {
								aDrawData = oSchemeInfo.drawData;
								iRowSpan = oSchemeInfo.rowSpan;
								//Calculate how many rows need to be inserted into tree table and adapt number of rows according to rowSpan
								var aAddedData = this._insertExpandedRowsToTT(aSelectedIndices[i], aDrawData, oDummyData, iRowSpan);
								if (aAddedData && aAddedData.length > 0) {
									oAllInsertedData[aSelectedIndices[i]] = aAddedData;
								}
							}
						}
					}
				}
				if (!$.isEmptyObject(oAllInsertedData)) {
					TreeTableHelper.addDummyData(this._oTT, oAllInsertedData, true);
				}
			}
		} else {
			for (key = 0; key < aExpandChartSchemes.length; key++) {
				TreeTableHelper.removeDummyDataFromSelectedIndices(this._oTT, aSelectedIndices, aExpandChartSchemes[key]);
			}
		}
		jQuery.sap.measure.end("GanttChart expandChartChange");
	};

	GanttChart.prototype._collectDataNameForValidChartScheme = function (sScheme, sMode) {
		if (this._oChartSchemesConfigMap[sScheme]) {
			var aDrawData = [], iRowSpan;
			var aShapesForChartScheme = this._oChartSchemesConfigMap[sScheme].getShapeKeys();
			iRowSpan = this._oChartSchemesConfigMap[sScheme].getRowSpan();
			var that = this;
			jQuery.each(aShapesForChartScheme, function (iKey, oVal) {
				if (that._oShapesConfigMap[oVal]) {
					var aModeKeys = that._oShapesConfigMap[oVal].getModeKeys();
					if ((aModeKeys && aModeKeys.length > 0 && $.inArray(sMode, aModeKeys) > -1) || aModeKeys.length == 0 || sMode == sap.gantt.config.DEFAULT_MODE_KEY) {
						aDrawData.push(that._oShapesConfigMap[oVal].getShapeDataName());
					} 
				}
			});
			if (aDrawData.length > 0 && iRowSpan >= 1) {
				return {"drawData" : aDrawData, "rowSpan" : iRowSpan};
			}
		}
	};

	GanttChart.prototype._insertExpandedRowsToTT = function (iSelectedIndice, aDrawData, oDummyData, iRowSpan) {
		var oSelectedData = TreeTableHelper.getContextObject(this._oTT, iSelectedIndice);
		if (aDrawData && aDrawData.length > 0) {
			var iNumberOfRows = 1, bHasData = false;
			$.each(aDrawData, function(ikey, sData) {
				if (oSelectedData[sData] && oSelectedData[sData].length > 0) {
					bHasData = true;
					for (var i = 0; i < oSelectedData[sData].length; i++) {
						if (oSelectedData[sData][i].rowIndex !== undefined && oSelectedData[sData][i].rowIndex > iNumberOfRows) {
							iNumberOfRows = oSelectedData[sData][i].rowIndex;
						}
					}
				}
			});
			if (!bHasData) {
				return [];
			}
			var aAddedData = [], k, oTempData;
			if (iNumberOfRows > 1 && iRowSpan == 1) {
				for (k = 0; k < iNumberOfRows; k++) {
					oTempData = jQuery.extend(true, {}, oDummyData);
					oTempData.index = k + 1;
					aAddedData.push(oTempData);
				}
			} else {
				oDummyData.index = 1;
				for (k = 0; k < iRowSpan; k++) {
					oTempData = jQuery.extend(true, {}, oDummyData);
					aAddedData.push(oTempData);
				}
			}
			return aAddedData;
		}
		return [];
	};

	GanttChart.prototype._composeParameterForClickPosition = function (event) {
		var aSvg = jQuery("#" + this.getId() + "-svg");
		var oSvgPoint = this._getSvgCoodinateByDiv(aSvg[0], event.pageX, event.pageY);
		var x = event.pageX - aSvg.offset().left || event.offsetX;
		var y = event.pageY - aSvg.offset().top || event.offsetY;
		if (!this._oAxisOrdinal) {
			return;
		}
		var oRowInfo, iRowIndex = this._oAxisOrdinal.viewToRowIndex(y, this._oTT.getVisibleRowCount()) + this._oTT.getFirstVisibleRow();
		var oLeadingRowInfo, iLeadingRowNum = iRowIndex;
		if (TreeTableHelper.isMultipleSpanMainRow(this._oTT, iRowIndex)){
			var mainRowGroupIndices = TreeTableHelper.getMultipleSpanMainRowGroupIndices(this._oTT, iRowIndex);
			iLeadingRowNum = mainRowGroupIndices[0];
		}
		if (iLeadingRowNum !== iRowIndex) {
			oLeadingRowInfo = TreeTableHelper.getContextObject(this._oTT, iLeadingRowNum);
		}
		
		var startTime = this._oAxisTime.viewToTime(x);
		oRowInfo = TreeTableHelper.getContextObject(this._oTT, iRowIndex);
		var param = {
			"startTime": startTime,
			"svgPoint": oSvgPoint,
			"leadingRowNum": iLeadingRowNum,
			"leadingRowInfo": oLeadingRowInfo, //if current row is the main row or current GanttChart is not expand chart and not multi row height, the leadingRowInfo = undefined
			"rowIndex": iRowIndex,
			"rowInfo": oRowInfo //if current row is a dummy row, rowInfo = undefined
		};
		return param;
	};
	
	/**
	 * Gets the selected rows, shapes, and relationships
	 * @return {object} The returned object contains "rows" for all selected rows, "shapes" for all selected shapes, and "relationships" for all selected relationships
	 */
	GanttChart.prototype.getAllSelections = function () {
		var selectedRows = this.getSelectedRows();
		var selectedShapes = this.getSelectedShapes();
		var selectedRelationships = this.getSelectedRelationships();
		var currentSelection = {"rows": selectedRows, "shapes": selectedShapes, "relationships": selectedRelationships};
		return currentSelection;
	};
	
	/**
	 * Gets the selected rows
	 * @return {array} Selected rows
	 * @public
	 */
	GanttChart.prototype.getSelectedRows = function () {
		var aSelectedRows = [];
		var iFirstVisibleRow = this._oTT.getFirstVisibleRow();
		var aSelectedIndexs = this._oTT.getSelectedIndices();
		for (var i = 0; i < aSelectedIndexs.length; i++) {
			var iRowIndex = aSelectedIndexs[i] - iFirstVisibleRow;
			if (iRowIndex > -1 && this._aShapeData[iRowIndex] !== undefined) {
				aSelectedRows.push(this._aShapeData[iRowIndex]);
			}
		}
		return aSelectedRows;
	};
	
	/**
	 * Gets the selected shapes
	 * @return {array} selected shapes
	 * @public
	 */
	GanttChart.prototype.getSelectedShapes = function () {
		var aSelectedShapes = this._oSelectedShapes;
		return aSelectedShapes;
	};
	
	/**
	 * Get all the current selected relationships
	 * @return {array} selected relationships
	 * @public
	 */
	GanttChart.prototype.getSelectedRelationships = function () {
		return this._aSelectedRelationships;
	};
	
	/**
	 * Selects shapes, and deselects all shapes when aIds is a null list and bIsExclusive is true
	 * @param {array} [aIds] List of the shapes that you want to select
	 * @param {boolean} [bIsExclusive] Whether all other selected shapes are deselected
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.selectShapes = function(aIds, bIsExclusive) {
		var i, j, aShapeData, oShapeData;
		var bSelectionUpdated = false;
		if (this._aSelectedShapeUids === undefined) {
			this._aSelectedShapeUids = [];
		}
		if (aIds === undefined || aIds.length < 1) {//deselect all
			if (bIsExclusive && this._aSelectedShapeUids.length > 0) {
				this._oSelectedShapes = {};
				this._aSelectedShapeUids = [];
				bSelectionUpdated = true;
			}
		}else if (bIsExclusive) {
			this._oSelectedShapes = {};
			this._aSelectedShapeUids = [];
			for (i = 0; i < aIds.length; i++) {
				aShapeData = this._getShapeDataById(aIds[i], false);
				for (j = 0; j < aShapeData.length; j++) {
					oShapeData = aShapeData[j];
					if (this._judgeEnableSelection(oShapeData)) { // judge whether the uid is existed and whether is enable selection
						var bUpdate = this._selectShape(oShapeData);
						if (bUpdate) {
							bSelectionUpdated = true;
						}
					}
				}
			}
		}else {
			for (i = 0; i < aIds.length; i++) {
				aShapeData = this._getShapeDataById(aIds[i], false);
				for (j = 0; j < aShapeData.length; j++) {
					oShapeData = aShapeData[j];
					if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) {
						continue;
					}else if (this._judgeEnableSelection(oShapeData) && this._selectShape(oShapeData)) {
						bSelectionUpdated = true;
					}
				}
			}
		}
		
		if (bSelectionUpdated) {
			this._drawSelectedShapes();
		}
		return bSelectionUpdated;
	};

	/**
	 * deselect shapes
	 * @param {array} [aIds] List of the shapes that you want to deselect
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.deselectShapes = function(aIds) {
		var bSelectionUpdated = false;
		for (var i = 0; i < aIds.length; i++) {
			var aShapeData = this._getShapeDataById(aIds[i]);
			var bUpdate;
			for (var j = 0; j < aShapeData.length; j++){
				bUpdate = this._deselectShape(aShapeData[j]);
				if (bUpdate) {
					bSelectionUpdated = true;
				}
			}
		}
		if (bSelectionUpdated) {
			this._drawSelectedShapes();
		}
		return bSelectionUpdated;
	};
	
	/**
	 * Select rows and all shapes contained in those rows
	 * @param {array} [aIds] Row uids
	 * @param {boolean} [bIsExclusive] Wether all other selected rows and shapes are deselected
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.selectRowsAndShapes = function(aIds, bIsExclusive) {
		var bSelectionUpdated = false;
		var bRowSelectionUpdated = this.selectRows(aIds, bIsExclusive);
		if (bIsExclusive) {
			this._oSelectedShapes = {};
			this._aSelectedShapeUids = [];
		}
		if (this._aSelectedShapeUids === undefined) {
			this._aSelectedShapeUids = [];
		}
		for (var id in aIds) {
			var sId = aIds[id];
			var oRowData = this._getRowById(sId);
			if (oRowData !== undefined) {
				for (var sShapeId in oRowData.data) {
					if (oRowData.data[sShapeId] instanceof Array) {
						for ( var i = 0; i < oRowData.data[sShapeId].length; i++) {
							var oShapeData = oRowData.data[sShapeId][i];
							if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) < 0) {
								this._selectShape(oShapeData);
								bSelectionUpdated = true;
							}
						}
					}
				}
			}
		}
		if (bSelectionUpdated) {
			this._drawSelectedShapes();
		}else if (bRowSelectionUpdated) {
			bSelectionUpdated = true;
		}
		
		return bSelectionUpdated;
	};

	/**
	 * Selects relationships, and deselects all other selected relationships if aIds is a null list and bIsExclusive is true
	 * @param {array} [aIds] List of the shapes that you want to select
	 * @param {boolean} [bIsExclusive] Whether all other selected shapes are deselected
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.selectRelationships = function(aIds, bIsExclusive) {
		var i, oRelationship;
		var bSelectionUpdated = false;
		if (this._aSelectedRelationships === undefined) {
			this._aSelectedRelationships = [];
		}
		if (aIds === undefined || aIds.length < 1) {//deselect all
			if (bIsExclusive && this._aSelectedRelationships.length > 0) {
				this._aSelectedRelationships = [];
				bSelectionUpdated = true;
			}
		}else if (bIsExclusive) {
			if (aIds.length == this._aSelectedRelationships.length) {
				//check if any new selecting relationship
				for (i = 0; i < aIds.length; i++) {
					oRelationship = this._getShapeDataById(aIds[i], true)[0];
					if (oRelationship !== undefined && jQuery.inArray(oRelationship, this._aSelectedRelationships) >= 0) {
						continue;
					} else {
						bSelectionUpdated = true;
						break;
					}
				}
			}
			this._aSelectedRelationships = [];
			for (i = 0; i < aIds.length; i++) {
				oRelationship = this._getShapeDataById(aIds[i], true)[0];
				if (oRelationship !== undefined && oRelationship !== null && this._judgeEnableSelection(oRelationship)) {
					this._aSelectedRelationships.push(oRelationship);
					bSelectionUpdated = true;
				}
			}
		}else {
			for (i = 0; i < aIds.length; i++) {
				oRelationship = this._getShapeDataById(aIds[i], true)[0];
				//if the relationship is unavailable or it is already in selection, ignore
				if (oRelationship === undefined || jQuery.inArray(oRelationship, this._aSelectedRelationships) >= 0) {
					continue;
				} else if (this._judgeEnableSelection(oRelationship)) {
					this._aSelectedRelationships.push(oRelationship);
					bSelectionUpdated = true;
				}
			}
		}
		
		if (bSelectionUpdated) {
			this._drawSelectedShapes();
		}
		return bSelectionUpdated;
	};

	/**
	 * Deselects relationships
	 * @param {array} [aIds] List of the relationships that you want to deselect
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.deselectRelationships = function(aIds) {
		var bSelectionUpdated = false;
		var aUids = [];
		if (aIds !== undefined) {
			for (var i = 0; i < aIds.length; i++) {
				var uid = this._getUidById(aIds[i], true)[0];
				if (uid !== undefined) {
					aUids.push(uid);
				}
			}
		}
		for (var j in this._aSelectedRelationships) {
			var oSelectedRLS = this._aSelectedRelationships[j];
			if (jQuery.inArray(oSelectedRLS.uid, aUids) > -1) {
				var iIndex = this._aSelectedRelationships.indexOf(oSelectedRLS);
				this._aSelectedRelationships.splice(iIndex, 1);
				bSelectionUpdated = true;
			}
		}
		if (bSelectionUpdated) {
			this._drawSelectedShapes();
		}
		return bSelectionUpdated;
	};

	/**
	 * Selects rows
	 * @param {array} [aIds] List of the rows that you want to select
	 * @param {boolean} [bIsExclusive] Whether all other selected rows are deselected
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.selectRows = function(aIds, bIsExclusive) {
		var bSelectionUpdated = false;
		var aVisibleRows = this._oTT.getRows();
		//var iFirstRow = this._oTT.getFirstVisibleRow();
		var aSelectedIndexs = this._oTT.getSelectedIndices();
		if (bIsExclusive && aSelectedIndexs.length > 0) {
			this._oTT.clearSelection();
			bSelectionUpdated = true;
		}
		for (var i in aVisibleRows) {
			var oRow = d3.select("#" + aVisibleRows[i].getId());
			//iIndex = iFirstRow + parseInt(oSelectedRow.attr("data-sap-ui-rowindex"), 10);
			var iIndex = parseInt(oRow.attr("data-sap-ui-rowindex"), 10);
			var oRowData = this._aShapeData[iIndex];
			if (oRowData !== undefined && jQuery.inArray(oRowData.data.id, aIds) > -1) {
				if (jQuery.inArray(iIndex, aSelectedIndexs) < 0) {
					//check if the treetable support multiple selection
					var sSelectionMode = this._oTT.getSelectionMode();
					if (sSelectionMode === sap.ui.table.SelectionMode.Multi) {
						this._oTT.addSelectionInterval(iIndex, iIndex);
					}else {
						this._oTT.setSelectedIndex(iIndex);
					}
					bSelectionUpdated = true;
				}
			}
		}
		return bSelectionUpdated;
	};

	/**
	 * Deselects rows
	 * @param {array} [aIds] List of the rows that you want to deselect
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.deselectRows = function(aIds) {
		var bSelectionUpdated = false;
		var aSelectedIndexs = this._oTT.getSelectedIndices();
		var aVisibleRows = this._oTT.getRows();
		for (var i in aSelectedIndexs) {
			var iSelectedIndex = aSelectedIndexs[i];
			var oRow = d3.select("#" + aVisibleRows[iSelectedIndex].getId());
			var iIndex = parseInt(oRow.attr("data-sap-ui-rowindex"), 10);
			var oRowData = this._aShapeData[iIndex];
			if (jQuery.inArray(oRowData.data.id, aIds)) {
				aSelectedIndexs.splice(iSelectedIndex, 1);
				this._oTT.removeSelectionInterval(iSelectedIndex, 1);
				bSelectionUpdated = true;
			}
		}
		return bSelectionUpdated;
	};
	
	//Private method: check if an element is a relationship by its' sShapeUid
	GanttChart.prototype._isRelationship = function (sShapeUid) {
		if (this._getShapeDataNameByUid(sShapeUid) === sap.gantt.shape.ShapeCategory.Relationship) {
			return true;
		}	
		return false;
	};
	
	GanttChart.prototype._onRowSelectionChange = function (oEvent) {

		//below is just a workaround, we may need change these in future
		var aChangedIndices = oEvent.getParameter("rowIndices"),
			aCurrentSelectedIndices = this._oTT.getSelectedIndices(),
			aSelectedIndices = [],
			aDeselectedIndices = [];

		for (var i = 0; i < aChangedIndices.length; i++){
			if (aCurrentSelectedIndices.indexOf(aChangedIndices[i]) === -1){
				aDeselectedIndices.push(aChangedIndices[i]); //deselected indices by user or delegate
			} else {
				aSelectedIndices.push(aChangedIndices[i]); //selected indices by user or delegate
			}
		}
		var oTT = this._oTT;
		var fnUpdateRowSelection = function(aRowIndices, bSelected){
			for (var j = 0; j < aRowIndices.length; j++){
				if (TreeTableHelper.isMultipleSpanMainRow(oTT, aRowIndices[j], true)){
					//indices is actual index in the table
					var aMainRowGroupIndices = TreeTableHelper.getMultipleSpanMainRowGroupIndices(oTT, aRowIndices[j], true);
					var iFirstIndex = aMainRowGroupIndices[0],
						iLastIndex = aMainRowGroupIndices[aMainRowGroupIndices.length - 1];
					
					for (var m = 0; m < aMainRowGroupIndices.length; m++){
						if (bSelected && aCurrentSelectedIndices.indexOf(aMainRowGroupIndices[m]) === -1){
							oTT.addSelectionInterval(iFirstIndex,iLastIndex);
						} else if (!bSelected && aCurrentSelectedIndices.indexOf(aMainRowGroupIndices[m]) !== -1){
							oTT.removeSelectionInterval(iFirstIndex,iLastIndex);
						}
					}
				}
			}
		};

		fnUpdateRowSelection(aSelectedIndices, true);
		fnUpdateRowSelection(aDeselectedIndices, false);

		this.fireRowSelectionChange({
			originEvent: oEvent
		});
	};
	
	//Private method: ShapeSelectionChange, RelationshipSelectionChange
	GanttChart.prototype._selectionChange = function (oShapeData, bCtrl, bShift, origEvent) {
		if (this._aSelectedRelationships == undefined){
			this._aSelectedRelationships = [];
		}
		if (this._aSelectedShapeUids == undefined){
			this._aSelectedShapeUids = [];
		}
		/*
		 * Click on Shapes:	Clear any existing selection of all shape and select current shape.	Clear all rows selection.
		 * Click on Shapes + control key:	Keep existing selection of all shapes and change selection of current shape.	Keep all rows selection. Keep all relationship selection
		 * above 2 same for the relationships
		 * Old: Click on Shape + shift key = Click on Shape
		 */
		var bShapeSelectionChange = false;
		var bRelationshipSelectionChange = false;
		var targetUid = oShapeData.uid;
		var isRelationship = this._isRelationship(targetUid);
		if ((bCtrl && this.getSelectionMode() === sap.gantt.SelectionMode.MultiWithKeyboard) || this.getSelectionMode() === sap.gantt.SelectionMode.Multiple){
			//when ctrl key is pressed or in Fiori multiple selection mode
			if (!isRelationship) {
				//if the shape is already in selectedShapes, deselect it, otherwise select it
				if (this._aSelectedShapeUids !== undefined && jQuery.inArray(targetUid, this._aSelectedShapeUids) > -1){
					if (!this._bDragging) {
						bShapeSelectionChange = this._deselectShape(oShapeData);
					}
				}else {
					bShapeSelectionChange = this._selectShape(oShapeData);
				}
			}else {
				if (jQuery.inArray(oShapeData, this._aSelectedRelationships) < 0){
					this._aSelectedRelationships.push(oShapeData);
				}else {
					var index = this._aSelectedRelationships.indexOf(oShapeData);
					this._aSelectedRelationships.splice(index,1);
				}
				bRelationshipSelectionChange = true;
			}
		}else if (!isRelationship) {
			if ((jQuery.inArray(targetUid, this._aSelectedShapeUids) < 0 || this._aSelectedShapeUids.length > 1) && !this._bDragging) {
				//clear all the Selected Shapes, add the clicking one
				this._oSelectedShapes = {};
				this._aSelectedShapeUids = [];
				bShapeSelectionChange = true;
			}
			if (jQuery.inArray(targetUid, this._aSelectedShapeUids) < 0 ) {
				var bUpdated = this._selectShape(oShapeData);
				if (!bShapeSelectionChange && bUpdated) {
					bShapeSelectionChange = true;
				}
			}
			if (this._aSelectedRelationships.length > 0) {
				this._aSelectedRelationships = [];
				bRelationshipSelectionChange = true;
			}
		}else {//if the current clicking element is a relationship
			if ((jQuery.inArray(oShapeData, this._aSelectedRelationships) < 0) || this._aSelectedRelationships.length > 1){
				//clear all the Selected Shapes, add the clicking one
				this._aSelectedRelationships = [];
				this._aSelectedRelationships.push(oShapeData);
				bRelationshipSelectionChange = true;
			}
			if (this._aSelectedShapeUids !== undefined && this._aSelectedShapeUids.length > 0) {
				this._oSelectedShapes = {};
				this._aSelectedShapeUids = [];
				bShapeSelectionChange = true;
			}
		}
		if (bShapeSelectionChange || bRelationshipSelectionChange) {
			this._drawSelectedShapes();
		}
		return {
			shapeSelectionChange: bShapeSelectionChange,
			relationshipSelectionChange: bRelationshipSelectionChange
		};
	};

	/*
	 * update the selected status back to model data
	 */
	GanttChart.prototype._setSelectedStatusToData = function() {
		for (var sRow in this._aShapeData) {
			var oRowData = this._aShapeData[sRow];
			for (var sShapeDataName in oRowData.data) {
				var aShapes = oRowData.data[sShapeDataName];
				if (aShapes instanceof Array) {
					for ( var iIndex = 0; iIndex < aShapes.length; iIndex++) {
						var oShapeData = aShapes[iIndex];
						if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) {
							oShapeData.selected = true;
						}else {
							oShapeData.selected = false;
						}
					}
				}
			}
		}
		for (var i in this._aRelationships) {
			this._aRelationships[i].selected = false;
			if (this._aSelectedRelationships !== undefined && this._aSelectedRelationships.length > 0){
				for (var j in this._aSelectedRelationships) {
					if (this._aRelationships[i].uid === this._aSelectedRelationships[j].uid) {
						this._aRelationships[i].selected = true;
					}
				}
			}
		}
	};

	/*
	 * get the selections according to the data from model
	 */
	GanttChart.prototype._setSelectedStatusFromData = function (aShapeDataNames) {
		this._oSelectedShapes = {};
		this._aSelectedShapeUids = [];
		for (var sRow in this._aShapeData) {
			var oRowData = this._aShapeData[sRow];
			for (var sShapeDataName in oRowData.data) {
				var aShapes = oRowData.data[sShapeDataName];
				//only loop the arrays, e.g tasks, activities
				if (aShapes instanceof Array && jQuery.inArray(sShapeDataName, aShapeDataNames) > -1) {
					for ( var i = 0; i < aShapes.length; i++) {
						var oShapeData = aShapes[i];
						if (oShapeData.selected) {
							if (this._oSelectedShapes[sShapeDataName] === undefined) {
								this._oSelectedShapes[sShapeDataName] = [];
							}
							this._oSelectedShapes[sShapeDataName].push({"shapeUid": oShapeData.uid, "shapeData": oShapeData, "objectInfoRef": oRowData});
							this._aSelectedShapeUids.push(oShapeData.uid);
						}
					}
				}
			}
		}
		//loop given relationship data, collect the selected data into the selected relationship collection
		this._aSelectedRelationships = [];
		for (var j in this._aRelationships) {
			if (this._aRelationships[j].selected) {
				this._aSelectedRelationships.push(this._aRelationships[j]);
			}
		}
	};
	/*
	 * Synconize the clicks on empty space of chart with selection of rows in the back table
	 */
	GanttChart.prototype._syncTTSelection = function(event){
		jQuery.sap.measure.start("GanttChart syncTTSelection","GanttPerf:GanttChart syncTTSelection function");
		var x = event.clientX;
		var y = event.clientY;
		var bShift = event.shiftKey;
		var bCtrl = event.ctrlKey;
		var $svg = jQuery("#" + this.getId() + "-svg")[0];
		var oClickPoint = this._getSvgCoodinateByDiv($svg, x, y);

		var iRowIndex = parseInt(this._oAxisOrdinal.viewToBandIndex(oClickPoint.y), 10);
		if (iRowIndex < 0){
			return false;
		}
		var aVisibleRows = this._oTT.getRows();
		var iIndex, oSelectedRow = d3.select("#" + aVisibleRows[iRowIndex].getId());
		if (iRowIndex < aVisibleRows.length && oSelectedRow && oSelectedRow.attr("data-sap-ui-rowindex")){
			iIndex = this._oTT.getFirstVisibleRow() + parseInt(oSelectedRow.attr("data-sap-ui-rowindex"), 10);
		}
		//disable selection for expaned dummy row
		if (TreeTableHelper.isDummyRow(this._oTT, iIndex) && TreeTableHelper.getContextObject(this._oTT, iIndex).__group !== undefined) {
			return false;
		}
		var sSelectionMode = this._oTT.getSelectionMode();
		if (iIndex >= 0 && sSelectionMode !== sap.ui.table.SelectionMode.None) {
			if (sSelectionMode === sap.ui.table.SelectionMode.Single) {
				if (!this._oTT.isIndexSelected(iIndex)) {
					this._oTT.setSelectedIndex(iIndex);
				} else {
					this._oTT.clearSelection();
				}
			} else {
				if (sSelectionMode === sap.ui.table.SelectionMode.Multi && this.getSelectionMode === sap.gantt.SelectionMode.Multiple) {
					bCtrl = true;
				}
				if (bShift) {
					// If no row is selected getSelectedIndex returns -1 - then we simply select the clicked row:
					/* Click on Empty place + shift key: Keep all shape/relationship selection.
					 * sync the row selection with original treetable row selection behavior
					 */
					var iSelectedIndex = this._oTT.getSelectedIndex();
					if (iSelectedIndex >= 0) {
						if (iSelectedIndex < iIndex) {
							this._oTT.addSelectionInterval(iSelectedIndex, iIndex);
						}else {
							this._oTT.addSelectionInterval(iIndex, iSelectedIndex);
						}
					}else {
						this._oTT.setSelectedIndex(iIndex);
					}
				}else if (!this._oTT.isIndexSelected(iIndex)) {
					if (bCtrl) {
						this._oTT.addSelectionInterval(iIndex, iIndex);
					} else {
						this._oTT.clearSelection();
						this._oTT.setSelectedIndex(iIndex);
					}
				}else if (bCtrl) {
					this._oTT.removeSelectionInterval(iIndex, iIndex);
				}else if (this._oTT.getSelectedIndices().length > 1) {
					this._oTT.clearSelection();
					this._oTT.setSelectedIndex(iIndex);
				}
			}
		}
		jQuery.sap.measure.end("GanttChart syncTTSelection");
	};
	
	//Set global variances for svg events
	GanttChart.prototype._setEventStatus = function (sEventName) {
		switch (sEventName) {
			case "dragEnter":
				this._bDragging = true;
				break;
			case "mouseDown":
				this._bMouseDown = true; 
				this._bDragging = false;
				break;
			case "shapeDragging":
				this._bDragging = true;
				break;
			case "mouseUp":
				this._bMouseDown = false;
				break;
			case "shapeDragEnd":
				this._bDragging = false;
				this._oDraggingData = undefined;
				break;
			case "dragLeave":
				this._iMouseDown = 0;
				this._bMouseDown = false;
				this._bDragging = false;
				break;
			default:
				break;
		}
	};
	
	GanttChart.prototype._onShapeDragStart = function (oEvent) {
		var aSvg = jQuery("#" + this.getId() + "-svg");
		//if mouse down on a shape that is dragable
		var oSourceShapeData = d3.select(oEvent.target).data()[0];
		var sClassId = oEvent.target.getAttribute("class").split(" ")[0];
		if (oSourceShapeData !== undefined && jQuery.inArray(oSourceShapeData.uid, this._aSelectedShapeUids) > -1
				&& this._judgeEnableDnD(oSourceShapeData, sClassId)) {
			var rowInfo = this._getRowByShapeUid(oSourceShapeData.uid);
			var x = oEvent.pageX - aSvg.offset().left || oEvent.offsetX;
			var y = oEvent.pageY - aSvg.offset().top || oEvent.offsetY;
			var shapeX, shapeWidth;
			if (oEvent.target.getAttribute("x") && oEvent.target.getAttribute("width")) {
				shapeX = parseInt(oEvent.target.getAttribute("x"), 10);
				shapeWidth = parseInt(oEvent.target.getAttribute("width"), 10);
			}else if (oSourceShapeData.startTime){
				var x1 = this._oAxisTime.timeToView(Format.abapTimestampToDate(oSourceShapeData.startTime));
				var x2 = this._oAxisTime.timeToView(Format.abapTimestampToDate(oSourceShapeData.endTime));
				if (Core.getConfiguration().getRTL()) {
					shapeX = x2;
					shapeWidth = (x1 - x2) > 0 ? (x1 - x2) : 1;
				}else {
					shapeX = x1;
					shapeWidth = (x2 - x1) > 0 ? (x2 - x1) : 1;
				}
			}else {
				shapeX = x;
				shapeWidth = 1;
			}
			var oDragStartPoint = {"x": x, "y": y, "shapeX": shapeX, "shapeWidth": shapeWidth};
			
			var aSourceShapeData = [];
			aSourceShapeData.push({
				"shapeData": oSourceShapeData,
				"objectInfo": rowInfo
			});
			for (var sShapeDataName in this._oSelectedShapes) {
				var aShapeData = this._oSelectedShapes[sShapeDataName];
				if (aShapeData !== undefined) {
					for (var i in aShapeData) {
						if (aShapeData[i].shapeUid !== oSourceShapeData.uid && this._judgeEnableDnD(aShapeData[i].shapeData)) {
							aSourceShapeData.push({
								"shapeData": aShapeData[i].shapeData,
								"objectInfo": aShapeData[i].objectInfoRef
							});
						}
					}
				}
			}
			this._oDraggingData = {
					"sourceShapeData": aSourceShapeData,
					"dragStartPoint": oDragStartPoint,
					"sourceSvgId": this.getId(),
					"targetSvgId": this.getId(),
					"domObject": d3.select(oEvent.target)[0][0]
			};
			
			this._oDraggingData.fDragHandler = this._onShapeDrag.bind(this);
			jQuery(document.body).bind("mousemove", this._oDraggingData.fDragHandler);
			this._oDraggingData.fDragEndHandler = this._onShapeDragEnd.bind(this);
			jQuery(document.body).bind("mouseup", this._oDraggingData.fDragEndHandler);
		}
	};
	
	GanttChart.prototype._onShapeDrag = function (oEvent) {
		if (oEvent.button !== 0 || oEvent.buttons === 0 || oEvent.ctrlKey) {
			return false;
		}
		var aDragDiv = d3.select("#activtityDragDrop");
		var dragDiv = aDragDiv[0];
		if (this._oDraggingData === undefined) {
			if (!aDragDiv.empty()){
				aDragDiv.remove();
			}
		}else {
			var nShapeCount = this._oDraggingData.sourceShapeData.length;
			var iShapeX = this._oDraggingData.dragStartPoint.shapeX;
			var iStartMouseX = this._oDraggingData.dragStartPoint.x;
			if (aDragDiv.empty() || dragDiv === null) {
				dragDiv = d3.select("body").append("div").attr("id", "activtityDragDrop")
				.style("position", "absolute").style("z-index", "999");
				var cloneNode = this._oDraggingData.domObject.cloneNode();
				var width = d3.select(cloneNode).attr("width");
				var height = d3.select(cloneNode).attr("height");
				var fontSize = 12;
				var g = dragDiv.append("svg").attr("id", "activtityDragDropSvg").attr("width", width).attr("height", height)
					.append("g").attr("id", "activtityDragDropSvgGroup");
	
				var shadow = d3.select(this._oDraggingData.domObject.cloneNode())
					.classed("shadow", true)
					.attr("fill-opacity", "0.5")
					.attr("x", 0)
					.attr("y", 0);
	
				g.node().appendChild(shadow.node());
				g.append("text")
					.attr("x", width / 2 - fontSize / 2)
					.attr("y", height - fontSize / 2 + 4)
					.attr("fill", "blue")
					.attr("font-size", 12)
					.text(function () {
						return nShapeCount; 
					});
			}
			var iCurrentX = iShapeX + (oEvent.pageX - iStartMouseX);
			var iCurrentY = oEvent.pageY;//calculate current Y on the align of shape&row
			d3.select("#activtityDragDrop").style("left", iCurrentX + 4 + "px");
			d3.select("#activtityDragDrop").style("top", iCurrentY + 4 + "px");
			jQuery(document.body).addClass("sapGanttDraggingCursor");
			this._setEventStatus("shapeDragging");
			this._iMouseDown = 0;
		}
	};
	
	GanttChart.prototype._onShapeDragEnd = function (oEvent) {
		//console.log("_onShapeDragEnd",oEvent);
		var div = d3.select("#activtityDragDrop");
		if (!div.empty()){
			div.remove();
		}
		if (this._bDragging && this._oDraggingData !== undefined) {
			var sTargetSvgId = this.getId() + "-svg";
			this._collectDraggingShapeData(this._oDraggingData, oEvent);
			this.fireShapeDragEnd({
				originEvent: oEvent,
				sourceSvgId: this._oDraggingData.sourceSvgId,
				targetSvgId: sTargetSvgId,
				sourceShapeData: this._oDraggingData.sourceShapeData,
				targetData: this._oDraggingData.targetData
			});
		}
		if (this._oDraggingData !== undefined) {
			jQuery(document.body).unbind("mousemove", this._oDraggingData.fDragHandler);
			jQuery(document.body).unbind("mouseup", this._oDraggingData.fDragEndHandler);
		}
		jQuery(document.body).removeClass("sapGanttDraggingCursor");
		this._setEventStatus("shapeDragEnd");
	};
	
	GanttChart.prototype._collectDraggingShapeData = function (oDraggingSource, oEvent) {
		var aSvg = jQuery("#" + this.getId() + "-svg");
		var x = oEvent.pageX - aSvg.offset().left || oEvent.offsetX;
		var sStartPointX = oDraggingSource.dragStartPoint.x;
		var iDragDistance = parseInt(x, 10) - parseInt(sStartPointX, 10);
		var sShapeCurrentStartX = parseInt(oDraggingSource.dragStartPoint.shapeX, 10) + iDragDistance;
		var sShapeCurrentEndX = sShapeCurrentStartX + parseInt(oDraggingSource.dragStartPoint.shapeWidth, 10);
		var sNewStartTime, sNewEndTime;
		if (Core.getConfiguration().getRTL() === true) {
			sNewStartTime = Format.dateToAbapTimestamp(this._oAxisTime.viewToTime(sShapeCurrentEndX));
			sNewEndTime = Format.dateToAbapTimestamp(this._oAxisTime.viewToTime(sShapeCurrentStartX));
		} else {
			sNewStartTime = Format.dateToAbapTimestamp(this._oAxisTime.viewToTime(sShapeCurrentStartX));
			sNewEndTime = Format.dateToAbapTimestamp(this._oAxisTime.viewToTime(sShapeCurrentEndX));
		}
		/*
		 * Only Update the clicking shape data with the row object at the current point
		 * keep other shape data as the same as they are in sourceshapedata
		 */
		var param = this._composeParameterForClickPosition(oEvent);
		var rowInfo = param.rowInfo;
		oDraggingSource.targetData = {
			"mouseTimestamp": {startTime: sNewStartTime, endTime: sNewEndTime},
			"mode": this.getMode(),
			"objectInfo": rowInfo
		};
	};
	
	/*
	 * set draggingSource when a drag is from outside of the current chart
	 */
	GanttChart.prototype.setDraggingData = function (oDraggingSource) {
		
		this._oDraggingData = oDraggingSource;
		if (this._oDraggingData !== undefined) {
			this._oDraggingData.targetSvgId = this.getId();
			jQuery(document.body).unbind("mousemove", this._oDraggingData.fDragHandler);
			jQuery(document.body).unbind("mouseup", this._oDraggingData.fDragEndHandler);
			this._oDraggingData.fDragHandler = this._onShapeDrag.bind(this);
			this._oDraggingData.fDragEndHandler = this._onShapeDragEnd.bind(this);
			jQuery(document.body).bind("mousemove", this._oDraggingData.fDragHandler);
			jQuery(document.body).bind("mouseup", this._oDraggingData.fDragEndHandler);
			this._setEventStatus("dragEnter");
		}
	};
	
	GanttChart.prototype._onSvgCtnMouseEnter = function (oEvent) {
		if (oEvent.currentTarget.id === (this.getId() + '-svg-ctn') && oEvent.button === 0 && oEvent.buttons !== 0) {// check if the mouse left key is down
			this.fireChartDragEnter({originEvent: oEvent});
		}
	};

	GanttChart.prototype._onSvgCtnMouseMove = function(oEvent){
		var aSvg = jQuery("#" + this.getId() + "-svg");
		// calculate svg coordinate for hover
		var oSvgPoint = this._getSvgCoodinateByDiv(aSvg[0], oEvent.pageX, oEvent.pageY);

		// draw cursorLine. select svgs of all chart instances to impl synchronized cursorLine
		if (this.getEnableCursorLine()) {
			this._oCursorLineDrawer.drawSvg(
				d3.selectAll(".sapGanttChartSvg"),
				d3.selectAll(".sapGanttChartHeaderSvg"),
				this.getLocale(),
				oSvgPoint);
		}
		//Trigger mouseover event from oSVG to tree table, according to row index
		//if current row is the main row or current GanttChart is not expand chart and not multi row height, the leadingRowInfo = undefined, leadingRowNum = rowIndex
		//if current row is a dummy row, rowInfo = undefined
		var param = this._composeParameterForClickPosition(oEvent);
		//only hover the main row when in expand chart
		var iRowIndex = param ? param.rowIndex : -1; 
		var oShapeData = d3.select(oEvent.target).data()[0];
		if (iRowIndex  > -1 && 
				((oShapeData !== undefined && oShapeData.uid !== this._lastHoverShapeUid)
						|| (oShapeData === undefined && this._lastHoverShapeUid !== undefined) || iRowIndex !== this._lastHoverRowIndex)) {
			this.fireChartMouseOver({
				objectInfo: param.rowInfo,
				leadingRowInfo: param.leadingRowInfo,
				timestamp: param.startTime.getTime(),
				svgId: this.getId() + "-svg",
				svgCoordinate: param.svgPoint, 
				effectingMode: this.getMode(),
				originEvent: oEvent
			});
			if (oShapeData !== undefined) {
				this._lastHoverShapeUid = oShapeData.uid;
			}else {
				this._lastHoverShapeUid = undefined;
			}
		}
		if (iRowIndex > -1 && iRowIndex !== this._lastHoverRowIndex) {
			var oTT = this._oTT;
			var $oTT = jQuery(oTT.getDomRef());
			var aHover = $oTT.find(".sapUiTableRowHvr");
			var oTargetRow = $oTT.find(".sapUiTableTr")[iRowIndex];
			
			if (this._oTT.getRows()[iRowIndex]) {
				var iRowNum = this._oTT.getRows()[iRowIndex].getIndex();
				var oRowContent = TreeTableHelper.getContextObject(this._oTT, iRowNum);
				
				if (aHover.length > 0) {
					for (var i = 0; i < aHover.length; i++) {
						if (jQuery.inArray("sapUiTableTr", aHover[i].classList) > -1) {
							jQuery(aHover[i]).mouseleave();
						}
					}
				}
				//disable hover for expaned dummy row
				if (!TreeTableHelper.isDummyRow(this._oTT, iRowNum) || oRowContent.__group === undefined || oRowContent.__group === null) {
					jQuery(oTargetRow).mouseenter();
					this._lastHoverRowIndex = iRowIndex;
				}
			}
		}
	};

	GanttChart.prototype._onSvgCtnMouseLeave = function (oEvent) {
		if (oEvent.currentTarget.id === (this.getId() + '-svg-ctn') && this._bDragging && this._oDraggingData !== undefined) {
			this._oDraggingData.targetSvgId = undefined;
			//if drag a shape out of a chart(view), then fire an event to Gantt
			this.fireChartDragLeave({
				//eventStatus: this._bDragging, this._mouseup, this.mousedown, or can those status already can be judged by the target(null or not?)
				originEvent: oEvent,
				draggingSource: this._oDraggingData
			});
			this._setEventStatus("dragLeave");
		}
		if (this.getEnableCursorLine()) {
			this._oCursorLineDrawer.destroySvg(
				d3.selectAll(".sapGanttChartSvg"),
				d3.selectAll(".sapGanttChartHeaderSvg"));
		}

		//Trigger mouseout event from oSVG to tree table
		var oTT = this._oTT;
		var $oTT = jQuery(oTT.getDomRef());
		var aHover = $oTT.find(".sapUiTableRowHvr");
		
		if (aHover.length > 0) {
			//to less the times of mouse leave, only trigger the row event
			for (var i = 0; i < aHover.length; i++) {
				if (jQuery.inArray("sapUiTableTr", aHover[i].classList) > -1) {
					jQuery(aHover[i]).mouseleave();
				}
			}
		}
		this._lastHoverShapeUid = undefined;
		this._lastHoverRowIndex = -1;
	};
	
	GanttChart.prototype._onSvgCtnMouseDown = function (oEvent) {
		if (oEvent.button == 0 ) {
			var oShapeData = d3.select(oEvent.target).data()[0];
			var sClassId;
			if (oEvent.target.getAttribute("class")){
				sClassId = oEvent.target.getAttribute("class").split(" ")[0];
			}
			//only when the mousedown is happened to a selectable shape, the shape selection change & dragNdrop are available, but the row selection still works
			if (sClassId && oShapeData && this._judgeEnableSelection(oShapeData, sClassId)) {
				this._oLastSelectedShape = oShapeData;
				this._onShapeDragStart(oEvent);
				//Needed for disabling default drag and drop behaviour in Firefox. This is not harmful to the behaviour in other browsers.
				oEvent.preventDefault();
			}
			this._iMouseDown++;
			this._setEventStatus("mouseDown");
		}
	};
	
	GanttChart.prototype._onSvgCtnMouseUp = function (event) {
		/* check if a dragging is happended, if yes, fireShapeDragEnd
		 * Otherwise check if a single click or a double click should happend
		 */
		if (event.button == 2){
			var param = this._composeParameterForClickPosition(event);
			this.fireChartRightClick({ 
				objectInfo: param.rowInfo,
				leadingRowInfo: param.leadingRowInfo,
				timestamp: param.startTime.getTime(),
				svgId: this.getId() + "-svg",
				svgCoordinate: param.svgPoint, 
				effectingMode: this.getMode(),
				originEvent: event
			});
		}else if (event.button == 0 && !this._bDragging && this._bMouseDown) {
			this._onSvgCtnClick(event);
		}
	};
	
	//event handler for single click on chart
	GanttChart.prototype._onSvgCtnClick = function (oEvent) {
		var oShapeData = d3.select(oEvent.target).data()[0];
		var sClassId;
		if (oEvent.target.getAttribute("class")){
			sClassId = oEvent.target.getAttribute("class").split(" ")[0];
		}
		var bSelectionChange = {};
		if (oShapeData !== undefined && this._judgeEnableSelection(oShapeData, sClassId) && this._oLastSelectedShape !== undefined && this._oLastSelectedShape.uid === oShapeData.uid) {
			bSelectionChange = this._selectionChange(oShapeData, oEvent.ctrlKey, oEvent.shiftKey, oEvent);
		}else if (this.getSelectionMode() === sap.gantt.SelectionMode.MultiWithKeyboard) {
			this._syncTTSelection(oEvent);
			this._oLastSelectedShape = undefined;
		}else {
			if (this._aSelectedShapeUids !== undefined && this._aSelectedShapeUids.length > 0) {
				this._oSelectedShapes = {};
				this._aSelectedShapeUids = [];
				bSelectionChange.shapeSelectionChange = true;
			}
			if (this._aSelectedRelationships.length > 0) {
				this._aSelectedRelationships = [];
				bSelectionChange.relationshipSelectionChange = true;
			}
			if (bSelectionChange.shapeSelectionChange || bSelectionChange.relationshipSelectionChange) {
				this._drawSelectedShapes();
			}
		}
		if (!oEvent.ctrlKey && !oEvent.shiftKey){
			var that = this;
			setTimeout(function () {
				if (that._iMouseDown > 1){
					var param = that._composeParameterForClickPosition(oEvent);
					that.fireChartDoubleClick({
						objectInfo: param.rowInfo,
						leadingRowInfo: param.leadingRowInfo,
						timestamp: param.startTime.getTime(),
						svgId: that.getId() + "-svg",
						svgCoordinate: param.svgPoint,
						effectingMode: that.getMode(),
						originEvent: oEvent
					});	
				}
				that._iMouseDown = 0;
				that._setEventStatus("mouseUp");
				this._oLastSelectedShape = undefined;
			}, 300);
		}else {
			this._iMouseDown = 0;
			this._setEventStatus("mouseUp");
			this._oLastSelectedShape = undefined;
		}
		
		if (bSelectionChange.shapeSelectionChange) {
			this.fireShapeSelectionChange({
				originEvent: oEvent
			});
		}
		if (bSelectionChange.relationshipSelectionChange) {
			this.fireRelationshipSelectionChange({
				originEvent: oEvent
			});
		}
	};

	GanttChart.prototype._onHSbScroll = function (oEvent) {
		var nScrollLeft = this._oTT._oHSb.getScrollPosition();
		this.updateLeftOffsetRate(nScrollLeft);
		this._draw(false);
		this.fireHorizontalScroll({
			scrollSteps: nScrollLeft,
			leftOffsetRate: this._fLeftOffsetRate
		});
	};
	
	GanttChart.prototype._onVSbScroll = function (oEvent) {
		this.fireVerticalScroll({
			scrollSteps: this._oTT._oVSb.getScrollPosition()
		});
		this._oTT.setFirstVisibleRow(this._oTT._oVSb.getScrollPosition() || 0, true);
	};

	GanttChart.prototype._hSbScrollLeft = function (nScrollPosition) {
		var $chartBodySvgCnt = jQuery("#" + this.getId() + "-svg-ctn");
		var $chartHeaderSvgCnt = jQuery("#" + this.getId() + "-header");
		var nScrollLeft;
		if (Core.getConfiguration().getRTL() === true) {
			//Header and Body should have same width. Use header to calculate the scroll position in RTL mode
			nScrollLeft = this._oStatusSet.aViewBoundary[1] - $chartHeaderSvgCnt.width() - nScrollPosition;
			if ( nScrollLeft < 0 ) {
				nScrollLeft = 0;
			}
		} else {
			nScrollLeft = nScrollPosition;
		}

		//scroll divs
		if (Core.getConfiguration().getRTL() === true && sap.ui.Device.browser.name === "ff") {
			$chartBodySvgCnt.scrollLeftRTL(nScrollLeft);
			$chartHeaderSvgCnt.scrollLeftRTL(nScrollLeft);
		} else {
			$chartBodySvgCnt.scrollLeft(nScrollLeft);
			$chartHeaderSvgCnt.scrollLeft(nScrollLeft);
		}

	};
	
	GanttChart.prototype.updateLeftOffsetRate = function(nPosition, nContentWidth) {
		//In RTL mode, treeTable use ui5 scrollbar control which wrap-ups the jQuery scrollLeft. The functions getScrollPosition() and setScrollPosition()
		//act same in 3 browsers: ie, ff, cr. The returned value of getScrollPosition() means the width of hidden DOM element at the right of scroll bar
		//Actually 3 browsers have different logic for scroll bar, UI5 scroll bar control wrap-ups the jQuery and make all act as same in ie.
		//To calculate the _fLeftOffsetRate, need to convert the returned value of getScrollPosition() to the width of hidden DOM element at the left of scroll bar 
		var nScrollWidth = nContentWidth ? nContentWidth : parseInt(this._oTT._oHSb.getContentSize(), 0);
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width();
		if (nScrollWidth - nClientWidth !== 0) {
			if (Core.getConfiguration().getRTL() === true) {
				this._fLeftOffsetRate = (nScrollWidth - nPosition - nClientWidth) / (nScrollWidth - nClientWidth);
			} else {
				this._fLeftOffsetRate = nPosition / (nScrollWidth - nClientWidth);
			}
			this._fLeftOffsetRate = this._fLeftOffsetRate < 0 ? 0 : this._fLeftOffsetRate;
			this._fLeftOffsetRate = this._fLeftOffsetRate > 1 ? 1 : this._fLeftOffsetRate;
		}
		return this._fLeftOffsetRate;
	};

	GanttChart.prototype.jumpToPosition = function(value) {
		if (!isNaN(value) && !(value instanceof Date)) {
			// when input parameter "value" is float value which means left offset rate
			this._fLeftOffsetRate = value;
			this._draw(false);
			return;
		}
		
		var oDateToJump, nDatePosition;
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width();
		if (!nClientWidth || nClientWidth <= 0) {
			return;
		}

		if (value instanceof Date) {
			// when value is Date format
			oDateToJump = value;
		} else {
			// when value is null or undefined
			var oTimeAxis = this.getTimeAxis();
			var oInitHorizon = oTimeAxis.getInitHorizon();
			if (!oInitHorizon || !oInitHorizon.getStartTime() || !oInitHorizon.getEndTime()) {
				return;
			}
			oDateToJump = Format.abapTimestampToDate(oInitHorizon.getStartTime());
			// need to adjust zoom rate for jumping to initHorizon
			var fSuitableScale = this._calZoomScale(
				Format.abapTimestampToDate(oInitHorizon.getStartTime()),
				Format.abapTimestampToDate(oInitHorizon.getEndTime()),
				nClientWidth);
			var fSuitableRate = this._oZoom.base.fScale / fSuitableScale;
			this.setTimeZoomRate(fSuitableRate);
		}
		
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		if (!nContentWidth || nContentWidth <= 0) {
			return;
		}
		
		if (Core.getConfiguration().getRTL() === true){
			//Refer to the comments in updateLeftOffsetRate. Convert the the x value to nScrollLeft
			nDatePosition = nContentWidth - this._oAxisTime.timeToView(oDateToJump) - this._oAxisTime.getViewOffset();
			nDatePosition = nDatePosition < 0 ? 0 : nDatePosition;
		} else {
			nDatePosition = this._oAxisTime.timeToView(oDateToJump) + this._oAxisTime.getViewOffset();
		}

		this.updateLeftOffsetRate(nDatePosition, nContentWidth);
		this._draw(false);
	};

	GanttChart.prototype._onTTRowUpdate = function () {
		this._syncSvgHeightWithTT();
		this._syncSvgDataWithTT();
		this._prepareRelationshipDataFromModel();
		this._draw(true);
	};

	GanttChart.prototype._updateDataString = function () {
		var sShapeData = JSON.stringify(this._aShapeData, function(key, value) {
			if (key === "bindingObj" || key === "contextObj") {
				return undefined;
			}
			return value;
		});
		if (this._sShapeData && sShapeData === this._sShapeData) {
			this._sShapeData = sShapeData;
			return false;
		} else {
			this._sShapeData = sShapeData;
			return true;
		}
	};

	GanttChart.prototype._syncSvgHeightWithTT = function () {
		var $svg = this.$().find(".sapGanttChartSvgCtn");
		//var nRowNumber = this._oTT.getVisibleRowCount();
		$svg.height(this.$().find(".sapUiTableCCnt").height());
	};

	GanttChart.prototype._syncSvgDataWithTT = function () {
		var oBinding = this._oTT.getBinding("rows");
		var bJSONTreeBinding = oBinding.getMetadata().getName() === "sap.ui.model.json.JSONTreeBinding";
		
		var iFirstVisibleRow = this._oTT.getFirstVisibleRow();
		var iVisibleRowCount = this._oTT.getVisibleRowCount();
		
		// structured data for drawing by D3
		this._aShapeData = [];
		this._aNonVisibleShapeData = [];
		// temporary variables
		var _aTopNonVisibleShapeData = [];
		var _aBottomNonVisibleShapeData = [];
		// default visible range
		var aVisibleRange = [iFirstVisibleRow, iFirstVisibleRow + iVisibleRowCount - 1];

		if (bJSONTreeBinding) {
			aVisibleRange = this._prepareVerticalDrawingRange();
			
			oBinding.getContexts(0, 0);// get all contexts
			
			if (iFirstVisibleRow > 0) {
				_aTopNonVisibleShapeData = this._getDrawingData([0, iFirstVisibleRow - 1]);
			}
			_aBottomNonVisibleShapeData = this._getDrawingData([iFirstVisibleRow + iVisibleRowCount, oBinding.getLength() - 1]);
			
			oBinding.getContexts(aVisibleRange[0], aVisibleRange[1]);// get contexts of visible area
			
			this._aShapeData = this._getDrawingData(aVisibleRange);
		} else {
			if (this._aRelationshipsContexts && this._aRelationshipsContexts.length > 0){
				// oBinding.getContexts(0, 0) returns all contexts so we have to check whether iFirstVisibleRow is larger than 0
				if (iFirstVisibleRow > 0) {
					_aTopNonVisibleShapeData = this._createShapeDataFromRowContexts(oBinding.getContexts(0, iFirstVisibleRow));
				}
				_aBottomNonVisibleShapeData = this._createShapeDataFromRowContexts(oBinding.getContexts(iFirstVisibleRow + iVisibleRowCount, oBinding.getLength()));
			}
			
			// row contexts of the visible area
			// IMPORTANT: this must be called after getting the row contexts of non visible because Table._aRowIndexMap is refreshed every time when getContexts is called.
			var aRowContext = oBinding.getContexts(iFirstVisibleRow, iVisibleRowCount);
			this._aShapeData = this._createShapeDataFromRowContexts(aRowContext);
		}
		
		// merge _aTopNonVisibleShapeData with _aBottomNonVisibleShapeData
		this._aNonVisibleShapeData = _aTopNonVisibleShapeData.concat(_aBottomNonVisibleShapeData);
		
		// enhance row data
		var aShapeDataNames = this.getShapeDataNames();
		if (aShapeDataNames && aShapeDataNames.length > 0) {
			Utility.generateRowUid(this._aShapeData,this._oObjectTypesConfigMap, aShapeDataNames);	// +uid
			Utility.generateRowUid(this._aNonVisibleShapeData, this._oObjectTypesConfigMap, aShapeDataNames);	// +uid
			this._setSelectedStatusFromData(aShapeDataNames);
		} else {
			jQuery.sap.log.error("Missing configuration for shapeDataNames.");
		}
		var iBaseRowHeight = this.getBaseRowHeight();
		this._oAxisOrdinal = this._createAxisOrdinal(this._aShapeData, iBaseRowHeight,
				(aVisibleRange[0] - iFirstVisibleRow) * iBaseRowHeight);
		
		// this._replaceDataRef(); // replace ref --TODO: move this logic to app
		this._cacheObjectPosition(this._aShapeData, this._oAxisOrdinal);	// +y, +rowHeight
		this._cacheObjectPosition(_aTopNonVisibleShapeData, this._oAxisOrdinal, true);	// +y, +rowHeight
		this._cacheObjectPosition(_aBottomNonVisibleShapeData, this._oAxisOrdinal, false);	// +y, +rowHeight

		if (!this._aVisibleRange || this._aVisibleRange[0] !== aVisibleRange[0] || this._aVisibleRange[1] !== aVisibleRange[1]) {
			this._aVisibleRange = aVisibleRange;
			return true;
		}

		return false;
	};
	
	/*
	 * Creates shape data array for the given row contexts.
	 */
	GanttChart.prototype._createShapeDataFromRowContexts = function (aRowContexts) {
		var aShapeDataNames = this.getShapeDataNames();
		var oBinding = this._oTT.getBinding("rows");
		var oModel = oBinding.getModel();
		
		var aShapeData = [];
		
		for (var i = 0; i < aRowContexts.length; i++) {
			if (aRowContexts[i] != undefined) {
				for (var j = 0; j < aShapeDataNames.length; j++) {
					var sShapeName = aShapeDataNames[j];//e.g. 'Header'
					var aShapeDataPath = aRowContexts[i].getProperty(sShapeName);//e.g. ["HeaderDetail('0%20')","HeaderDetail('48%20')"]
					var oShapeData;
					if (aShapeDataPath) {
						for (var k = 0; k < aShapeDataPath.length; k++) {
							var sShapeDataPath = aShapeDataPath[k];
							oShapeData = oModel.getData("/" + sShapeDataPath);
							aShapeData.push({
								"bindingObj": oBinding,
								"contextObj": aRowContexts[i],
								"data": aRowContexts[i].getObject(),
								"shapeData": [oShapeData],
								"id": oShapeData.id,
								"shapeName": sShapeName,
								"rowIndex": i
							});
						}
					}
				}
			}
		}
		
		return aShapeData;
	};
	
	/*
	 * Calculate [rowHeight] and [y] property for each object based on a given axisY
	 * @param {object[]} objects Shape data array for whose entity we will add y and rowHeight properties to.
	 * @param {object} axisY AxisOrdinal object.
	 * @param {boolean} bAboveOrUnderVisibleArea Optional. Only used for drawing elements in the non visible area.
	 * 		if undefined, means the objects are in the visible area
	 * 		if true, means the objects are above the visible area, then y are -100
	 * 		if false, means the objects are under the visible area, then y are axisY.getViewRange()[1]+100
	 * @return undefined
	 */
	GanttChart.prototype._cacheObjectPosition = function (objects, axisY, bAboveVisibleArea) {
		if (objects && objects.length > 0) {
			if (bAboveVisibleArea === true) {
				for (var i = 0; i < objects.length; i++) {
					objects[i].y = -100;
					objects[i].rowHeight = axisY.getViewBandWidth();
				}
			} else if (bAboveVisibleArea === false) {
				for (var j = 0; j < objects.length; j++) {
					objects[j].y = axisY.getViewRange()[1] + 100;
					objects[j].rowHeight = axisY.getViewBandWidth();
				}
			} else {
				for (var k = 0; k < objects.length; k++) {
					objects[k].y = axisY.elementToView(objects[k].uid);

					if (k > 0) {
						objects[k - 1].rowHeight = objects[k].y - objects[k - 1].y;
					}
				}
				objects[objects.length - 1].rowHeight = axisY.getViewRange()[1] - objects[objects.length - 1].y;
			}
		}
	};
	
	/*
	 * Loop this._aRelationshipsContexts and call getObject method on each entity and then push the value into this._aRelationships
	 */
	GanttChart.prototype._prepareRelationshipDataFromModel = function () {
		this._aRelationships = [];
		if (this._aRelationshipsContexts) {
			for (var i = 0; i < this._aRelationshipsContexts.length; i++) {
				var oRelationship = this._aRelationshipsContexts[i].getObject();
				if (oRelationship !== undefined) {
					this._aRelationships.push(oRelationship);
				}
			}
		}
		Utility.generateUidByShapeDataName(this._aRelationships, "relationship"); // +uid for relationships
	};

	GanttChart.prototype._createAxisOrdinal = function (aShapeData, iBaseRowHeight, fShift) {
		var aRowNames = aShapeData.map(function (oRow) {
			return oRow.uid;
		});
		var aRowHeights = aShapeData.map(function (oRow) {
			if (oRow.rowSpan) {
				return oRow.rowSpan;
			} else {
				//For blank rows in hierarchy, just return 1, since there is no place to specify its rowSpan now...
				return 1;
			}
		});

		return new AxisOrdinal(aRowNames, aRowHeights, iBaseRowHeight, fShift);
	};

	GanttChart.prototype.getShapeData = function(aRange) {
		return this._aShapeData;
	};

	GanttChart.prototype._getDrawingData = function(aRange) {
		var i, j, k, oRow;
		var oBinding = this._oTT.getBinding("rows");
		var aRowList = [];
		for (i = aRange[0]; i <= aRange[1]; i++) {
			oRow = TreeTableHelper.getContextObject(this._oTT, i);
			if (!oRow) {
				continue;
			}
			if (TreeTableHelper.isDummyRow(this._oTT, i)
				&& ((aRowList.length > 0
				&& aRowList[aRowList.length - 1].chartScheme
				&& aRowList[aRowList.length - 1].chartScheme === oRow.__group
				&& aRowList[aRowList.length - 1].index === oRow.index) || oRow.chartScheme)) {
				continue;
			}
			if (oRow.__group) { // expanded row
				var sMode;
				if (this._oChartSchemesConfigMap[oRow.__group] && this._oChartSchemesConfigMap[oRow.__group].getModeKey() && this._oChartSchemesConfigMap[oRow.__group].getModeKey() !== sap.gantt.config.DEFAULT_MODE_KEY) {
					sMode = this._oChartSchemesConfigMap[oRow.__group].getModeKey();
				} else {
					sMode = this.getMode();
				}
				var oSchemeInfo = this._collectDataNameForValidChartScheme(oRow.__group, sMode);
				var oParent = oRow.parentData ? oRow.parentData : null;
				if (oRow.index && oParent && oSchemeInfo && oSchemeInfo.drawData) {
					for (j = 0; j < oSchemeInfo.drawData.length; j++) {
						if (!oParent[oSchemeInfo.drawData[j]]) {
							continue;
						}
						oRow[oSchemeInfo.drawData[j]] = [];
						for (k = 0; k < oParent[oSchemeInfo.drawData[j]].length; k++) {
							if (!oParent[oSchemeInfo.drawData[j]][k].rowIndex ||
								oRow.index === oParent[oSchemeInfo.drawData[j]][k].rowIndex) {
								oRow[oSchemeInfo.drawData[j]].push(oParent[oSchemeInfo.drawData[j]][k]);
							}
						}
					}
				}
				aRowList.push({
					"bindingObj": oBinding,
					"data": oRow,
					"id": oParent.id,
					"rowSpan": oSchemeInfo.rowSpan,
					"chartScheme": oRow.__group,
					"rowIndex": i,
					"index": oRow.index, // > 0
					"icon": this._oChartSchemesConfigMap[oRow.__group].getIcon(),
					"closeIcon": "./image/closeChart.png",
					"name": this._oChartSchemesConfigMap[oRow.__group].getName()
				});
			} else { // main row
				var rowSpan = 1;
				var sChartScheme = this._oObjectTypesConfigMap[oRow.type] ?
					this._oObjectTypesConfigMap[oRow.type].getMainChartSchemeKey() :
					sap.gantt.config.DEFAULT_CHART_SCHEME_KEY;
				if (oRow.type) {
					var oChartScheme = this._oChartSchemesConfigMap[sChartScheme];
					if (oChartScheme) {
						rowSpan = oChartScheme.getRowSpan();
					}
				}
				aRowList.push({
					"bindingObj": oBinding,
					"contextObj": this._oTT.getContextByIndex(i),
					"data": oRow,
					"id": oRow.id,
					"rowSpan": rowSpan,
					"chartScheme": sChartScheme,
					"rowIndex": i,
					"index": 0
				});
			}
		}
		return aRowList;
	};

	GanttChart.prototype._prepareVerticalDrawingRange = function() {
		var nLastBindingRow = this._oTT.getBinding("rows").getLength() - 1;
		if (nLastBindingRow < 0) {
			return [0, -1];
		}
		var nFirstVisibleRow = this._oTT.getFirstVisibleRow();
		var nLastVisibleRow = nFirstVisibleRow + this._oTT.getVisibleRowCount() - 1;
		var nFirstDrawingRow = nFirstVisibleRow;
		var nLastDrawingRow = nLastVisibleRow < nLastBindingRow ? nLastVisibleRow : nLastBindingRow;
		var i, nGroup, nGroupIndex, oRow;
		for (i = nFirstVisibleRow; i >= 0; i--) {
			if (!TreeTableHelper.isDummyRow(this._oTT, i)) {
				break;
			}
			oRow = TreeTableHelper.getContextObject(this._oTT, i);
			if (oRow && oRow.previousNodeNum) {
				nFirstDrawingRow = i - oRow.previousNodeNum;
				continue;
			}
			if (!oRow || !oRow.index || oRow.index < 0) {
				break;
			}			
			if (!nGroupIndex) {
				nGroup = oRow.__group;
				nGroupIndex = oRow.index;
			} else if (nGroup === oRow.__group && nGroupIndex === oRow.index) {
				nFirstDrawingRow = i;
			} else {
				break;
			}
		}
		nGroupIndex = undefined;
		for (i = nLastVisibleRow; i <= nLastBindingRow; i++) {
			oRow = TreeTableHelper.getContextObject(this._oTT, i);
			if (oRow && oRow.afterNodeNum) {
				nLastDrawingRow = i + oRow.afterNodeNum;
				continue;
			}
			if (!TreeTableHelper.isDummyRow(this._oTT, i)) {
				break;
			}			
			if (!oRow || !oRow.index || oRow.index < 0) {
				break;
			}			
			if (!nGroupIndex) {
				nGroup = oRow.__group;
				nGroupIndex = oRow.index;
			} else if (nGroup === oRow.__group && nGroupIndex === oRow.index) {
				nLastDrawingRow = i;
			} else {
				break;
			}
		}
		return [nFirstDrawingRow, nLastDrawingRow];
	};

	GanttChart.prototype._prepareHorizontalDrawingRange = function () {
		//oStatusSet must keep the value of LTR mode because other functions use it
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width();

		if (!this._oStatusSet) {
			this._updateScrollWidth();
		}
		
		var nScrollLeft = Math.ceil((this._fLeftOffsetRate ? this._fLeftOffsetRate : 0) * (nContentWidth - nClientWidth));
		if (this._oStatusSet) {
			if ((nClientWidth >= nContentWidth || (this._oStatusSet.aViewBoundary[0] <= nScrollLeft - this._oStatusSet.nOffset &&
				this._oStatusSet.aViewBoundary[1] >= nScrollLeft + nClientWidth - this._oStatusSet.nOffset))) {
				if (!this._mTimeouts._drawSvg) {
					this._scrollSvg();
				}

				return false;
			}
		}

		var nWidth = nClientWidth * (1 + this._fExtendFactor * 2);
		var nOffset = nScrollLeft - nClientWidth * this._fExtendFactor;
		if (nOffset < this._nLowerRange) {
			nWidth += nOffset;
			nOffset = 0;
		}
		if (nOffset + nWidth > this._nUpperRange) {
			nWidth = this._nUpperRange - nOffset;
		}

		this._oAxisTime.setViewOffset(nOffset);
		this._oStatusSet = {
				nWidth: nWidth,
				nOffset: nOffset,
				nScrollLeft: nScrollLeft,
				aViewBoundary: [0, nWidth],
				aTimeBoundary: [this._oAxisTime.viewToTime(0), this._oAxisTime.viewToTime(nWidth)],
				bRTL: Core.getConfiguration().getRTL()
		};

		return true;
	};

	GanttChart.prototype._draw = function (bForced) {
		if (!this._prepareHorizontalDrawingRange() && !bForced) {
			return;
		}
		
		var that = this;
		this._mTimeouts._drawSvg = this._mTimeouts._drawSvg || window.setTimeout(function() {
			that._drawSvg();
			that._mDrawDelayMS = 0;
		}, this._mDrawDelayMS);
	};

	GanttChart.prototype._updateScrollWidth = function () {
		var nMaxScrollWidth = 100000;
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		var nScrollWidth = nContentWidth > nMaxScrollWidth ? nMaxScrollWidth : nContentWidth;
		if (nScrollWidth + "px" !== this._oTT._oHSb.getContentSize()) {
			this._oTT._oHSb.setContentSize(nScrollWidth + "px").bind(this._oTT.getDomRef());
		}
	};

	GanttChart.prototype._updateScrollLeft = function () {
		var nScrollWidth = parseInt(this._oTT._oHSb.getContentSize(), 0);
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width();
		var nScrollLeft = Math.ceil((this._fLeftOffsetRate ? this._fLeftOffsetRate : 0) * (nScrollWidth - nClientWidth)); 
		if (Core.getConfiguration().getRTL() === true) {
			nScrollLeft = nScrollWidth - nScrollLeft - nClientWidth;
		}
		if (Math.abs(this._oTT._oHSb.getScrollPosition() - nScrollLeft) > 1) {
			this._oTT._oHSb.setScrollPosition(nScrollLeft);
		}
};

	GanttChart.prototype._scrollSvg = function () {
		var $svg = jQuery("#" + this.getId() + "-svg");
		var $header = jQuery("#" + this.getId() + "-header-svg");
		if (this._oStatusSet.nWidth !== $svg.width()) {
			$svg.width(this._oStatusSet.nWidth);
		}
		if (this._oStatusSet.nWidth !== $header.width()) {
			$header.width(this._oStatusSet.nWidth);
		}
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width();
		var nScrollLeft = Math.ceil((this._fLeftOffsetRate ? this._fLeftOffsetRate : 0) * (nContentWidth - nClientWidth));
		this._hSbScrollLeft(nScrollLeft - this._oStatusSet.nOffset);
};

	GanttChart.prototype._drawSvg = function () {
		jQuery.sap.measure.start("GanttChart _drawSvg","GanttPerf:GanttChart _drawSvg function");
		
		// before draw
		this._updateScrollLeft();
		this._scrollSvg();
		this._sUiSizeMode = Utility.findSapUiSizeClass(this);
		
		// draw
		this._drawCalendarPattern();
		this._drawHeader();
		this._drawNowLine();
		this._drawVerticalLine();
		this._drawShapes();
		this._drawSelectedShapes();

		// after draw
		this.fireEvent("_shapesUpdated", {aSvg: jQuery("#" + this.getId() + "-svg")});
		this._updateCSSForDummyRow();
		delete this._mTimeouts._drawSvg;
		
		jQuery.sap.measure.end("GanttChart _drawSvg");
	};
	
	GanttChart.prototype._drawHeader = function () {
		var $headerDom = jQuery(this.getDomRef()).find(".sapGanttChartHeader");
		var nSvgHeight = $headerDom.height();

		var oHeaderSvg = d3.select(jQuery(this.getDomRef()).find(".sapGanttChartHeaderSvg").get(0));
		oHeaderSvg.attr("height", nSvgHeight);

		// Split the total SVG height as 5 parts for drawing 
		// label0 (MM YYYY), label1 (DD) and vertical line (|)
		var nfirstRowYOffset = nSvgHeight / 5 * 2;
		var nMiddleLineYOffset = nSvgHeight / 5 * 4;
		var nSecondRowYOffset = nSvgHeight / 5 * 4;

		var aLabelList = this.getAxisTime().getTickTimeIntervalLabel(
				this.getAxisTime().getCurrentTickTimeIntervalKey(), null, [0, this._oStatusSet.nWidth]);

		// append group
		oHeaderSvg.selectAll("g").remove();
		var oGroupSvg = oHeaderSvg.append("g");

		// append text for labels on first row
		oGroupSvg.selectAll("label0")
			.data(aLabelList[0])
			.enter()
			.append("text")
			.classed("sapGanttTimeHeaderSvgText0", true)
			.text(function (d) {
				return d.label;
			}).attr("x", function (d) {
				return d.value;
			}).attr("y", function (d) {
				return nfirstRowYOffset;
			});

		// append text for labels on second row
		oGroupSvg.selectAll("label1")
			.data(aLabelList[1])
			.enter()
			.append("text")
			.classed("sapGanttTimeHeaderSvgText1", true)
			.text(function (d) {
				return d.label;
			}).attr("x", function (d) {
				// 5px spacing for the text
				return d.value + (Core.getConfiguration().getRTL() ? -5 : 5);
			}).attr("y", function (d) {
				return nSecondRowYOffset;
			});

		// append path for scales on both rows
		var sPathData = "";
		for (var i = 0; i < aLabelList[1].length; i++) {
			var oLabel = aLabelList[1][i];
			if (oLabel) {
				sPathData +=
					" M" +
					" " + (oLabel.value - 1 / 2) +
					" " + nMiddleLineYOffset +
					" L" +
					" " + (oLabel.value - 1 / 2 ) +
					" " + nSvgHeight;
			}
		}

		oGroupSvg.append("path").classed("sapGanttTimeHeaderSvgPath", true).attr("d", sPathData);
	};
	
	GanttChart.prototype._drawCalendarPattern = function () {
		var $GanttChartSvg = d3.select("#" + this.getId() + "-svg");
		this._oCalendarPatternDrawer.drawSvg($GanttChartSvg, this.getId(), this.getCalendarDef(), this._oStatusSet, this.getBaseRowHeight());
	};
	
	GanttChart.prototype._drawNowLine = function () {
		this._oNowlineDrawer  = new NowLineDrawer(this._oAxisTime);

		var $GanttChartHeader = d3.select("#" + this.getId() + "-header-svg"),
			$GanttChartSvg = d3.select("#" + this.getId() + "-svg");
		
		if (this.getEnableNowLine()) {
			this._oNowlineDrawer.drawSvg($GanttChartSvg, $GanttChartHeader);
		} else {
			this._oNowlineDrawer.destroySvg($GanttChartSvg, $GanttChartHeader);
		}
	};

	GanttChart.prototype._drawVerticalLine = function() {
		this._oVerticalLineDrawer = new VerticalLineDrawer(this.getAxisTime());
		var $GanttChartSvg = d3.select("#" + this.getId() + "-svg");
		if (this.getEnableVerticalLine()) {
			this._oVerticalLineDrawer.drawSvg($GanttChartSvg);
		} else {
			this._oVerticalLineDrawer.destroySvg($GanttChartSvg);
		}
	};
	
	GanttChart.prototype._drawShapes = function () {
		var aSvg = d3.select("#" + this.getId() + "-svg");
		
		if (!this._oTT || !this._oTT.getRows() || this._oTT.getRows().length <= 0) {
			return;
		}
		
		// draw shape
		if (this._aShapeData && this._aShapeInstance && this._aShapeInstance.length > 0) {

			this._collectDataPerShapeId();
			var relationshipDataSet = [];
			
			for (var i = 0; i < this._aShapeInstance.length; i++) {
				switch (this._aShapeInstance[i].getCategory(null, this._oAxisTime, this._oAxisOrdinal)) {
					case sap.gantt.shape.ShapeCategory.InRowShape:
						this._oShapeInRowDrawer.drawSvg(aSvg, this._aShapeInstance[i],
							this._oAxisTime, this._oAxisOrdinal, this._oStatusSet);
						break;
					case sap.gantt.shape.ShapeCategory.Relationship:
						if (this._judgeDisplayableOfRLS(this._aShapeInstance[i])) {
							relationshipDataSet = this._oShapeCrossRowDrawer.generateRelationshipDataSet(aSvg, this._oShapeInstance, this._aNonVisibleShapeData,
									this.getShapeDataNames(), this._aRelationships, this._oAxisTime, this._oAxisOrdinal);
						}
						this._aShapeInstance[i].dataSet = relationshipDataSet;
						this._oShapeCrossRowDrawer.drawSvg(aSvg, this._aShapeInstance[i],
								this._oAxisTime, this._oAxisOrdinal);
						break;
					default:
						break;
				}
			}
		}
	};
	
	//draw all the selected shapes and relationships
	GanttChart.prototype._drawSelectedShapes = function () {
		if (!this._oTT || !this._oTT.getRows() || this._oTT.getRows().length <= 0) {
			return;
		}
		
		var aSvg = d3.select("#" + this.getId() + "-svg");
		
		//set selected Status for Shapes and relationships
		this._setSelectedStatusToData();
		// draw selected shape
		this._collectSelectedDataPerShapeId();
		for (var sShapeId in this._oShapeInstance) {
			var oSelectedClassIns = this._oShapeInstance[sShapeId].getAggregation("selectedShape");
			var category = oSelectedClassIns.getCategory(null, this._oAxisTime, this._oAxisOrdinal);
			switch (category) {
			case sap.gantt.shape.ShapeCategory.InRowShape:
				this._oShapeInRowDrawer.drawSvg(aSvg, oSelectedClassIns, this._oAxisTime, this._oAxisrdinal, this._oStatusSet);
				break;
			case sap.gantt.shape.ShapeCategory.Relationship:
				var relationshipDataSet = this._oShapeCrossRowDrawer.generateRelationshipDataSet(aSvg, this._oShapeInstance, this._aNonVisibleShapeData,
						this.getShapeDataNames(), this._aSelectedRelationships, this._oAxisTime, this._oAxisOrdinal);
				oSelectedClassIns.dataSet =  relationshipDataSet;
				this._oShapeCrossRowDrawer.drawSvg(aSvg, oSelectedClassIns,
						this._oAxisTime, this._oAxisOrdinal);
				break;
			default:
				break;
			}
		}
	};
	
	/*
	 * This method collect data according to current row's configuration/objectType/shape/chart scheme/mode.
	 * this._aShapeData contains the data for all different shapes so here we need to pick up by sShapeName
	 * once is function finished execution, each instance of shape classes will have 'dataset' attribute
	 * and it is an array of the data picked up from this._aShapeData for drawing that shape.
	 */
	GanttChart.prototype._collectDataPerShapeId = function () {
		var bJSONTreeBinding = (this._oTT.getBinding("rows").getMetadata().getName() === "sap.ui.model.json.JSONTreeBinding");
		var oRowData, oShapeData;
		//this._oShapeInstance is an object which has properties with format as below:
		//property key is the data name for shapes such as 'header'
		//property value is the instance of shape classes such as sap.gantt.shape.Rectangle
		//so the structure of this._oShapeInstance is like
		//{
		//	'header': <instance of sap.gantt.shape.ext.Chevron>
		//	'task': <sap.gantt.shape.Rectangle>
		//}
		for (var sShapeId in this._oShapeInstance) {
			var sShapeName = this._oShapeInstance[sShapeId].mShapeConfig.getShapeDataName();//e.g. Header
			this._oShapeInstance[sShapeId].dataSet = [];

			for (var i = 0; i < this._aShapeData.length; i++) {
				//this._aShapeData contains the data for all different shapes so here we need to pick up by sShapeName
				oRowData = this._aShapeData[i];
				if (oRowData.isBlank) {
					continue;
				}
				//if user doesn't configure the shape with 'shapeDataName', add all row data to the shape
				if (!sShapeName) {
					this._oShapeInstance[sShapeId].dataSet.push({
						"objectInfoRef": oRowData,
						"shapeData": oRowData.data
					});
					continue;
				}

				if (!this._judgeDisplayableByShapeId(oRowData, sShapeId)) {
					continue;
				}
				if (bJSONTreeBinding){
					oShapeData = oRowData.data[sShapeName];
				}else if (sShapeName == oRowData.shapeName) {
						oShapeData = [oRowData.data];
				}else {
					continue;
				}
				if (oShapeData){
					this._oShapeInstance[sShapeId].dataSet.push({
						"objectInfoRef": oRowData,
						"shapeData": oShapeData
					});
				}
			}
		}
	};

	GanttChart.prototype._collectSelectedDataPerShapeId = function () {
		//group the selected shape data into the dataSet of related selectedClass instance
		for (var sShapeId in this._oShapeInstance) {
			var sShapeDataName = this._oShapeInstance[sShapeId].mShapeConfig.getShapeDataName();//e.g. Header
			var oSelectedClassIns = this._oShapeInstance[sShapeId].getAggregation("selectedShape");
			var sCategory = oSelectedClassIns.getCategory(null, this._oAxisTime, this._oAxisOrdinal);
			//collect shape data for every selectedClass instance according to current selection
			oSelectedClassIns.dataSet = [];
			if (sCategory == sap.gantt.shape.ShapeCategory.Relationship) {
				var aShapeData = [];
				for (var j in this._aSelectedRelationships) {
					var oRelationshipData = this._aSelectedRelationships[j];
					//only when the relationship is display, it needs to be drew
					if (this._getShapeDataById(oRelationshipData.id, true) !== undefined) {
						aShapeData.push(oRelationshipData);
					}
				}
				oSelectedClassIns.dataSet.push({
					"shapeData": aShapeData
				});
			}else if (this._oSelectedShapes[sShapeDataName] !== undefined) {
				for (var i in this._oSelectedShapes[sShapeDataName]) {
					var oShape = this._oSelectedShapes[sShapeDataName][i];
					//only when the master shape is displayed, draw the selectedShape
					var oRowData = this._getRowByShapeUid(oShape.shapeUid);
					if (oRowData !== undefined && oRowData !== null && this._judgeDisplayableByShapeId(oRowData, sShapeId)){
						oShape.objectInfoRef = oRowData;
						oSelectedClassIns.dataSet.push({
							"objectInfoRef": oShape.objectInfoRef,
							"shapeData": [oShape.shapeData]
						});
					}
				}
			}
		}
	};
	
	GanttChart.prototype._judgeDisplayableByShapeId = function (oRowData, sShapeId) {
		var  sChartScheme, oChartScheme, aShapeIdsInChartScheme, sMode;
		if (oRowData.data.__group) {
			sChartScheme = oRowData.data.__group;
		} else {
			sChartScheme = this._oObjectTypesConfigMap[oRowData.data.type] ?
					this._oObjectTypesConfigMap[oRowData.data.type].getMainChartSchemeKey() :
					sap.gantt.config.DEFAULT_CHART_SCHEME_KEY;
		}
		oChartScheme = this._oChartSchemesConfigMap[sChartScheme];
		if (oChartScheme == undefined) {
			return false;
		}
		aShapeIdsInChartScheme = oChartScheme.getShapeKeys();
		/*
		 * determin mode. if mode is coded against chart scheme, it over-write current mode in chart
		 */
		sMode = oChartScheme.getModeKey() !== sap.gantt.config.DEFAULT_MODE_KEY ?
				oChartScheme.getModeKey() :
				this.getMode();
		//sMode = oChartScheme.getModeKey() ? oChartScheme.getModeKey() : this.getMode();
		/*
		 * check if shape should appear in current chart scheme and mode
		 */
		if (sChartScheme !== sap.gantt.config.DEFAULT_CHART_SCHEME_KEY &&
				aShapeIdsInChartScheme.indexOf(sShapeId) < 0 ||
				sMode !== sap.gantt.config.DEFAULT_MODE_KEY &&
				this._oShapesConfigMap[sShapeId].getModeKeys() &&
				this._oShapesConfigMap[sShapeId].getModeKeys().length > 0 &&
				this._oShapesConfigMap[sShapeId].getModeKeys().indexOf(sMode) < 0 ||
				!oRowData.data) {
			return false;
		}
		return true;
	};
	
	GanttChart.prototype._judgeDisplayableOfRLS = function (oShape) {

		var aShapeMode = this._oShapesConfigMap[oShape.mShapeConfig.getKey()] ? 
				this._oShapesConfigMap[oShape.mShapeConfig.getKey()].getModeKeys() : [];
		if (jQuery.inArray(this.getMode(), aShapeMode) < 0 && this.getMode() !== sap.gantt.config.DEFAULT_MODE_KEY) {
			return false;
		}
		return true;
	};
	
	//get shapeId by shape uid and related row data uid
	GanttChart.prototype._getShapeDataNameByUid = function (sShapeUid) {
		//var rowData;
		var sShapeDataName;
		if (sShapeUid !== undefined) {
			var str = "|DATA:";
			if (sShapeUid.split(str)[1]) {
				sShapeDataName = sShapeUid.split(str)[1].split("[")[0];
			}else {
				sShapeDataName = sap.gantt.shape.ShapeCategory.Relationship;
			}
		}
		return sShapeDataName;
	};
	
	//get Uid by id
	GanttChart.prototype._getUidById = function (sId, bRelationship) {
		var sUid = [];
		if (bRelationship) {
			for (var i in this._aRelationships) {
				var oRelationship = this._aRelationships[i];
				if (oRelationship.id == sId) {
					sUid.push(oRelationship.uid);
					break;
				}
			}	
		}else {
			jQuery.each(this._aShapeData, function (k, v) {
				var rowInfo = v;
				for (var sShape in rowInfo.data) {
					if (rowInfo.data[sShape] instanceof Array) {
						for (var i in rowInfo.data[sShape]) {
							//a shape can appear in different rows, so one id may have several uids
							if (rowInfo.data[sShape][i].id == sId) {
								sUid.push(rowInfo.data[sShape][i].uid);
							}
						}
					}
				}
			});
		}
		
		return sUid;
	};
	
	//get shapeData by uid
	GanttChart.prototype._getShapeDataByUid = function (sUid, bRelationship) {
		if (bRelationship) {// if it is a relationship
			for (var i in this._aRelationships) {
				var oRelationship = this._aRelationships[i];
				if (oRelationship.uid === sUid) {
					return oRelationship;
				}
			}
		}else {
			var rowInfo = this._getRowByShapeUid(sUid);
			var sShapeDataName = this._getShapeDataNameByUid(sUid);
			if (rowInfo !== undefined && rowInfo.data[sShapeDataName] !== undefined) {
				for ( var j = 0; j < rowInfo.data[sShapeDataName].length; j++) {
					var oShapeData = rowInfo.data[sShapeDataName][j];
					if (oShapeData.uid == sUid) {
						return oShapeData;
					}
				}
			}
		}
		return undefined;
	};
	
	/*
	 * get shapeData by id
	 * @para 
	 * @para
	 * @return an array as there may be multiple uids for a same id, as the shape can appear more than once
	 */
	GanttChart.prototype._getShapeDataById = function (sId, bRelationship) {
		var aShapeData = [];
		var aUids = this._getUidById(sId, bRelationship);
		for (var i in aUids) {
			var oShapeData = this._getShapeDataByUid(aUids[i], bRelationship);
			if (oShapeData !== undefined) {
				aShapeData.push(oShapeData);
			}
		}
		return aShapeData;
	};
	
	//get row obj by shape uid
	//one shape(has an uid as unique key) may appear more then once in different rows, the uid includes row information
	GanttChart.prototype._getRowByShapeUid = function (sShapeUid) {
		var rowData;
		var sShapeDataName = this._getShapeDataNameByUid(sShapeUid);
		var bJSONTreeBinding = (this._oTT.getBinding("rows").getMetadata().getName() === "sap.ui.model.json.JSONTreeBinding");
		jQuery.each(this._aShapeData, function (k, v) {
			var rowInfo = v;
			if (bJSONTreeBinding && rowInfo.data[sShapeDataName]) {
				for ( var i = 0; i < rowInfo.data[sShapeDataName].length; i++) {
					if (rowInfo.data[sShapeDataName][i].uid == sShapeUid) {
						rowData = rowInfo;
						return false;
					}
				}
			}else if (rowInfo.data.uid === sShapeUid) {
				rowData = rowInfo;
				return false;
			}
		});
		return rowData;
	};
	
	//get row by row id
	GanttChart.prototype._getRowById = function (sRowId) {
		var rowData;
		jQuery.each(this._aShapeData, function (k, v) {
			var rowInfo = v;
			if (rowInfo.data.id == sRowId) {
				rowData = rowInfo;
				return false;
			}
		});
		return rowData;
	};
	
	GanttChart.prototype._getSvgCoodinateByDiv = function(oNode, x, y){
		var oClickPoint = oNode.createSVGPoint();
			oClickPoint.x = x;
			oClickPoint.y = y;
			oClickPoint = oClickPoint.matrixTransform(oNode.getScreenCTM().inverse());
			oClickPoint.svgHeight = oNode.height.baseVal.value;
			oClickPoint.svgId = this.getId() + "-svg";
		
		return oClickPoint;
	};
	
	GanttChart.prototype._getTopShapeInstance = function (oShapeData, sClassId) {
		if (sClassId !== undefined) {
			var oShapeId = this._getShapeIdById(sClassId);
			if (oShapeId !== undefined && oShapeId !== null) {
				if (oShapeId.topShapeId !== undefined) {
					return this._oShapeInstance[oShapeId.topShapeId];
				}else {
					return this._oShapeInstance[oShapeId.shapeId];
				}
			}
		}else {
			var sShapeDataName = this._getShapeDataNameByUid(oShapeData.uid);
			for (var sShapeId in this._oShapeInstance) {
				var sShapeName = this._oShapeInstance[sShapeId].mShapeConfig.getShapeDataName();//e.g. Header
				if (sShapeDataName === sShapeName){
					var sTopShapeId = this._customerClassIds[sShapeId].topShapeId;
					if (sTopShapeId !== undefined) {
						return this._oShapeInstance[sTopShapeId];
					}else {
						return this._oShapeInstance[sShapeId];
					}
				}
			}
		}
		return undefined;
	};
	
	//judge if the shape is selectable
	GanttChart.prototype._judgeEnableSelection = function (oShapeData, sClassId) {	
		if (oShapeData === undefined) {
			return false;
		}
		var oTopShapeInstance = this._getTopShapeInstance(oShapeData, sClassId);
		if (oTopShapeInstance !== undefined) {
			return oTopShapeInstance.getEnableSelection(oShapeData);
		}
		return false;
	};
	
	GanttChart.prototype._judgeEnableDnDByUid = function (sShapeUid) {
		if (sShapeUid === undefined || sShapeUid == null) {
			return false;
		}
		var oShapeData;
		if (this._isRelationship(sShapeUid)) {
			oShapeData = this._getShapeDataByUid(sShapeUid, true);
		}else {
			oShapeData = this._getShapeDataByUid(sShapeUid, false);
		}
		return this._judgeEnableDnD(oShapeData);
	};
	
	GanttChart.prototype._judgeEnableDnD = function (oShapeData, sClassId) {
		if (oShapeData === undefined) {
			return false;
		}
		var oTopShapeInstance = this._getTopShapeInstance(oShapeData, sClassId);
		if (oTopShapeInstance !== undefined) {
			return oTopShapeInstance.getEnableDnD(oShapeData);
		}
		return false;
	};
	
	/*select shape by adding current selecting shape into the shape selection
	 * The structure of aSelectedShapes: {"ShapeDataName1": e.g. all selected activities, "ShapeDataName2": e.g. all selected tasks...--- arrays with a struture of {"shapeUid": "shapeData", "objectInfoRef"}
	 */
	GanttChart.prototype._selectShape = function (oShapeData) {
		var oRowInfo = this._getRowByShapeUid(oShapeData.uid);
		if (oRowInfo == undefined) {
			return false;
		}
		if (this._aSelectedShapeUids === undefined) {
			this._aSelectedShapeUids = [];
		}
		var sShapeDataName = this._getShapeDataNameByUid(oShapeData.uid);
		if (this._oSelectedShapes[sShapeDataName] !== undefined && this._oSelectedShapes[sShapeDataName] !== null ) {
			var aShapes = this._oSelectedShapes[sShapeDataName];
			if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) { //if the shape is already in selection
				return false;
			}else {
				this._aSelectedShapeUids.push(oShapeData.uid);
				aShapes.push({"shapeUid": oShapeData.uid, "shapeData": oShapeData, "objectInfoRef": oRowInfo});
				return true;
			}
		}else {
			this._aSelectedShapeUids.push(oShapeData.uid);
			this._oSelectedShapes[sShapeDataName] = [];
			this._oSelectedShapes[sShapeDataName].push({"shapeUid": oShapeData.uid, "shapeData": oShapeData, "objectInfoRef": oRowInfo});
			return true;
		}
	};

	// deselect current shape by remove it from the collection of selected shapes
	GanttChart.prototype._deselectShape = function (oShapeData) {
		var sShapeDataName = this._getShapeDataNameByUid(oShapeData.uid);
		if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) {
			var iIndex = this._aSelectedShapeUids.indexOf(oShapeData.uid);
			this._aSelectedShapeUids.splice(iIndex,1);
			var aShapes = this._oSelectedShapes[sShapeDataName];
			for (var i in aShapes) {
				if (aShapes[i].shapeUid === oShapeData.uid) {
					aShapes.splice(i,1);
					break;
				}
			}
			return true;
		}
		
		return false;
	};
	
	GanttChart.prototype._updateCSSForDummyRow = function() {
		var aRows = this._oTT.getRows();
		var aRowHeaders = this._oTT.$().find(".sapUiTableRowHdrScr").children();
		for (var i = 0; i < aRows.length; i++){
			var oRow = aRows[i];
			var index = oRow.getIndex();
			
			if (index !== -1 && TreeTableHelper.isMultipleSpanMainRow(this._oTT, i)){
				var context = TreeTableHelper.getContextObject(this._oTT, index);
				if (context.afterNodeNum > 0){
					aRows[i].$().addClass("sapGanttTrNoBorder");
					$(aRowHeaders[i]).addClass("sapGanttTHeaderNoBorder");
				} else {
					aRows[i].$().removeClass("sapGanttTrNoBorder");
					$(aRowHeaders[i]).removeClass("sapGanttTHeaderNoBorder");
				}
			} else {
				aRows[i].$().removeClass("sapGanttTrNoBorder");
				$(aRowHeaders[i]).removeClass("sapGanttTHeaderNoBorder");
			}
		}
	};
	
	GanttChart.prototype.getAxisOrdinal = function () {
		return this._oAxisOrdinal;
	};
	
	GanttChart.prototype.getAxisTime = function () {
		return this._oAxisTime;
	};
	
	GanttChart.prototype.ondblclick = function (oEvent) {
		return null;
	};
	
	GanttChart.prototype.onclick = function (oEvent) {
		return null;
	};
	
	GanttChart.prototype.getSapUiSizeClass = function () {
		return this._sUiSizeMode;
	};
	
	GanttChart.prototype.exit = function () {
		// TODO: destroy axis time and ordinal after refactor to listener pattern.
		// other children are all strong aggregation relations, no need to destroy.
		this._detachEvents();
	};

	return GanttChart;
}, true);
