/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/GanttChartBase", "sap/ui/table/Column", "sap/ui/table/TreeTable", "sap/ui/core/ScrollBar",
	"sap/ui/layout/Splitter", "sap/ui/layout/SplitterLayoutData",
	"sap/gantt/GanttChart", "sap/gantt/control/Cell", "sap/gantt/control/Toolbar",
	"sap/gantt/control/AssociateContainer","sap/gantt/drawer/SelectionPanel","./misc/TreeTableHelper","sap/gantt/misc/Utility","sap/gantt/misc/AxisOrdinal","sap/ui/thirdparty/d3"
], function (GanttChartBase, Column, TreeTable, ScrollBar, Splitter, SplitterLayoutData,
		GanttChart, Cell, Toolbar, AssociateContainer, SelectionPanelDrawer, TreeTableHelper, Utility, AxisOrdinal) {
	"use strict";
	
	/**
	 * Creates and initializes a new Gantt Chart with a TreeTable control on the left and a svg chart area on the right.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * 
	 * @class 
	 * Embed a <code>sap.ui.table.TreeTable</code> and a <code>sap.gantt.GanttChart</code> side-by-side.
	 * 
	 * <p>This class defines:
	 * The TreeTable part provide a column view of data with sorting/filtering functions available. The svg chart part provide graphic Gantt chart
	 * view of data. Both width can be adjusted by a splitter bar, and row scrolling are always synchronized.3
	 * </p>
	 * 
	 * @extends sap.gantt.GanttChartBase
	 * 
	 * @author SAP SE
	 * @version 1.36.8
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.GanttChartWithTable
	 */
	var GanttChartWithTable = GanttChartBase.extend("sap.gantt.GanttChartWithTable", /** @lends sap.gantt.GanttChartWithTable.prototype */ {
		metadata: {
			properties: {
				
				/**
				 * A customized cell callback function.
				 * 
				 * <p> This property is used in combination with configuration property <code>hierarchies</code>.
				 * If aggregation <code>columns</code> is provided, property <code>hierarchies</code> and <code>cellCallback</code> is ignored.
				 * Otherwise property <code>hierarchies</code> must provide column configurations that cellCallback can consume. And if cellCallback
				 * is not provided, a default cellCallback adds <code>sap.m.Label</code> to fill cells.
				 * </p>
				 */
				cellCallback: {type: "object"},
				
				/**
				 * Property propagated from <code>sap.ui.table.Table</code>.
				 * @see sap.ui.table.Table#fixedColumnCount
				 */
				fixedColumnCount: {type: "int"}
			},
			aggregations: {
				
				/**
				 * Controls to be place in Gantt chart toolbar.
				 * 
				 * <p>This aggregation is only used when custom toolbar item group is configured to be shown in Gantt chart toolbar.
				 * Different from the build-in buttons which are configured to be shown or hidden, these are free controls created 
				 * by application, only they are placed in container toolbar by <code>sap.gantt.GanttChartWithTable</code>.</p>
				 * 
				 * <p>A common recommendation is, if the source select group is enabled and application wants to pre-configure
				 * container layouts, the chance to change custom toolbar items is in event handler to event <code>ganttChartSwitchRequested</code>.</p>
				 */
				customToolbarItems: {type: "sap.ui.core.Control", multiple: true, visibility: "public",
					singularName: "customToolbarItem", bindable: "bindable"},
					
				/**
				 * Aggregation delegated to <code>sap.ui.table.Table</code>.
				 * 
				 * <p>If this aggregation is provided, call back property <code>cellCallBack</code> and column configuration in property <code>hierarchies</code> will be ignored.</p>
				 * @see sap.ui.table.Table#columns
				 */
				columns: {type: "sap.ui.table.Column", multiple: true, visibility: "public", singularName: "column"},
				
				_selectionPanel: {type: "sap.ui.table.TreeTable", multiple: false, visibility: "hidden"},
				_chart: {type: "sap.gantt.GanttChart", multiple: false, visibility: "hidden"}
			}
		}
	});

	GanttChartWithTable.prototype.init = function () {
		// create chart
		jQuery.sap.measure.start("GanttChartWithTable Init","GanttPerf:GanttChartWithTable Init function");
		this._oGanttChart = new GanttChart();
		this.setAggregation("_chart", this._oGanttChart);
		this._oGanttChartCnt = new AssociateContainer({
			enableRootDiv: true,
			content: this._oGanttChart
		});
		this._oTC = this._oGanttChart._oTT;

		// create selection panel
		this._oTT = new TreeTable({
			visibleRowCountMode: "Auto",
			minAutoRowCount: 1,
//			rowHeight: 28,
			fixedColumnCount: this.getFixedColumnCount(),
			selectionBehavior: sap.ui.table.SelectionBehavior.Row,
			selectionMode: sap.ui.table.SelectionMode.Multi
		});
		this._oTT.attachFilter(function(oEvent){
			if (this.canExpandGanttChart()){
				TreeTableHelper.filter(oEvent);
			}
		}.bind(this));
		this._oTT.attachSort(function(oEvent){
			if (this.canExpandGanttChart()){
				TreeTableHelper.sort(oEvent);
			}
		}.bind(this));
		this._oTT.attachToggleOpenState(function(oEvent) {
			var oBinding = this.getBinding();
			if (oBinding && oBinding.getModel() instanceof sap.ui.model.json.JSONModel) {
				var oSource = oEvent.getSource(),
					bExpanded = oEvent.getParameter("expanded"),
					iRowIndex = oEvent.getParameter("rowIndex"),
					oContext = oBinding.getContextByIndex(iRowIndex);
				
				// may modify the condition if we need build children to the node
				if (oBinding.hasChildren && oBinding.hasChildren(oContext)) {
					TreeTableHelper.toggleOpenStateWithRowIndex(oSource, iRowIndex, bExpanded);	
				}
			}
		});
		this.setAggregation("_selectionPanel", this._oTT);
		this._oToolbar = new Toolbar({
			type: sap.gantt.control.ToolbarType.Local,
			sourceId: sap.gantt.config.DEFAULT_HIERARCHY_KEY
		});
		this._oToolbar.data("holder", this);
		this._oToolbar.attachSourceChange(this._onToolbarSourceChange, this);
		this._oToolbar.attachExpandTreeChange(this._onToolbarExpandTreeChange, this);
		this._oToolbar.attachModeChange(this._onToolbarModeChange, this);
		this._oTT.addExtension(this._oToolbar);
		this._oSelectionPanelCnt = new AssociateContainer({
			enableRootDiv: true,
			content: this._oTT,
			layoutData: new SplitterLayoutData({
				size: "30%"
			})
		});

		// create horizontal layout
		this._oSplitter = new Splitter({
			width: "100%",
			height: "100%",
			orientation: sap.ui.core.Orientation.Horizontal,
			contentAreas: [this._oSelectionPanelCnt, this._oGanttChartCnt]
		}).addStyleClass("sapGanttViewSplitterH");

		// attach this to layout resize
		this._oSplitter.attachResize(this._onSplitterResize, this);
		// attach to oTC hscroll
		this._oTC._oHSb.attachScroll(this._onChartHSbScroll, this);
		// sync oTC oTT vertical scroll
		this._oTC._oVSb.attachScroll(this._onChartVSbScroll, this);
		this._oTT._oVSb.attachScroll(this._onSelectionPanelVSbScroll, this);
		//this._oTC.attachRowSelectionChange(this._onRowSelectionChange, this);
		this._oGanttChart.attachRowSelectionChange(this._onRowSelectionChange, this);
		this._oGanttChart.attachShapeSelectionChange(this._onShapeSelectionChange, this);
		this._oGanttChart.attachChartMouseOver(this._onChartMouseOver, this);
		this._oGanttChart.attachRelationshipSelectionChange(this._onRelationshipSelectionChange, this);
		this._oGanttChart.attachChartDoubleClick(this._onDoubleClick, this);
		this._oGanttChart.attachChartRightClick(this._onRightClick, this);
		this._oGanttChart.attachEvent("_shapesUpdated", this._onChartShapesUpdated, this);
		this._oGanttChart.attachChartDragEnter(this._onChartDragEnter, this);
		this._oGanttChart.attachChartDragLeave(this._onChartDragLeave, this);
		this._oGanttChart.attachShapeDragEnd(this._onShapeDragEnd, this);
		
		this._oModesConfigMap = {};
		this._oModesConfigMap[sap.gantt.config.DEFAULT_MODE_KEY] = sap.gantt.config.DEFAULT_MODE;
		
		this._oToolbarSchemeConfigMap = {};
		this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY] = sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME;
		this._oToolbarSchemeConfigMap[sap.gantt.config.EMPTY_TOOLBAR_SCHEME_KEY] = sap.gantt.config.EMPTY_TOOLBAR_SCHEME;
		
		this._oHierarchyConfigMap = {};
		this._oHierarchyConfigMap[sap.gantt.config.DEFAULT_HIERARCHY_KEY] = sap.gantt.config.DEFAULT_HIERARCHY;
		this._oDefaultExpansionStatus = {};

		this._oTT.addEventDelegate({
			onAfterRendering: this._appendMaskSvg
		}, this);
		
		this._oTT.addEventDelegate({
			onAfterRendering: this._updateCSSForDummyRow
		}, this);



		this._oSelectionPanelDrawer = new SelectionPanelDrawer();
		
		this.attachEvent("collapseDummyRow",this._onRowCollapse);

		// defualt maps
		this._oGanttChartSchemesConfigMap = {};
		this._oGanttChartSchemesConfigMap[sap.gantt.config.DEFAULT_CHART_SCHEME_KEY] = sap.gantt.config.DEFAULT_CHART_SCHEME;
		this._oObjectTypesConfigMap = {};
		this._oObjectTypesConfigMap[sap.gantt.config.DEFAULT_OBJECT_TYPE_KEY] = sap.gantt.config.DEFAULT_OBJECT_TYPE;
		this._oShapesConfigMap = {};
		jQuery.sap.measure.end("GanttChartWithTable Init");
	};
	
	GanttChartWithTable.prototype.setFixedColumnCount = function (iFixedColumnCount) {
		this.setProperty("fixedColumnCount", iFixedColumnCount);
		this._oTT.setFixedColumnCount(iFixedColumnCount);
		return this;
	};
	
	GanttChartWithTable.prototype.setTimeAxis = function (oTimeAxis) {
		this.setProperty("timeAxis", oTimeAxis);
		this._oGanttChart.setTimeAxis(oTimeAxis);
		return this;
	};

	GanttChartWithTable.prototype.setMode = function (sMode) {
		this.setProperty("mode", sMode);
		this._oGanttChart.setMode(sMode);
		this._oToolbar.setMode(sMode);
		return this;
	};
	
	GanttChartWithTable.prototype.setModes = function (aModes) {
		this.setProperty("modes", aModes);
		this._oToolbar.setModes(aModes);
		this._oGanttChart.setModes(aModes);
		this._oModesConfigMap = {};
		if (aModes) {
			for (var i = 0; i < aModes.length; i++) {
				this._oModesConfigMap[aModes[i].getKey()] = aModes[i];
			}
		}
		return this;
	};
	
	GanttChartWithTable.prototype.setSelectionMode = function (sSelectionMode) {
		this.setProperty("selectionMode", sSelectionMode);
		if (this._oTT) {
			if (sSelectionMode == sap.gantt.SelectionMode.None) {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.None);
				this._oTT.setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
			}else if (sSelectionMode == sap.gantt.SelectionMode.MultiWithKeyboard) {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.Multi);
				this._oTT.setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
			}else {
				if (sSelectionMode == sap.gantt.SelectionMode.Single) {
					this._oTT.setSelectionMode(sap.ui.table.SelectionMode.Single);
				}else {
					this._oTT.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
				}
				this._oTT.setSelectionBehavior(sap.ui.table.SelectionBehavior.RowSelector);
			}
		}
		
		if (this._oGanttChart) {
			this._oGanttChart.setSelectionMode(sSelectionMode);
		}
		return this;
	};
	
	GanttChartWithTable.prototype.setToolbarSchemes = function (aToolbarSchemes) {
		this.setProperty("toolbarSchemes", aToolbarSchemes);
		this._oToolbar.setToolbarSchemes(aToolbarSchemes);
		this._oToolbarSchemeConfigMap = {};
		if (aToolbarSchemes) {
			for (var i = 0; i < aToolbarSchemes.length; i++) {
				this._oToolbarSchemeConfigMap[aToolbarSchemes[i].getKey()] = aToolbarSchemes[i];
			}
		}
		return this;
	};

	GanttChartWithTable.prototype.setHierarchyKey = function (sHierarchyKey) {
		this.setProperty("hierarchyKey", sHierarchyKey);
		this._oToolbar.setSourceId(sHierarchyKey);
		this._hierarchyChange();
		return this;
	};
	
	GanttChartWithTable.prototype.setHierarchies = function (aHierarchies) {
		this.setProperty("hierarchies", aHierarchies);
		this._oToolbar.setHierarchies(aHierarchies);
		this._oGanttChart.setHierarchies(aHierarchies);
		this._oHierarchyConfigMap = {};
		if (aHierarchies) {
			for (var i = 0; i < aHierarchies.length; i++) {
				this._oHierarchyConfigMap[aHierarchies[i].getKey()] = aHierarchies[i];
			}
		}
		this._hierarchyChange();
		return this;
	};
	
	GanttChartWithTable.prototype.setCalendarDef = function (oCalendarDef) {
		this.setAggregation("calendarDef", oCalendarDef);
		/*
		 * Copy oCalendarDef to this._oGanttChart instead of set it directly to this._oGanttChart.
		 * Because if we do so, in binding case, copying of private aggregation '_chart' won't copy
		 * template calendarDef. Therefore have to go this way.
		 * And in this way, have to set templateShareable = true if oCalendarDef is a template. 
		 */
		var oPSBindingInfo = oCalendarDef.getBindingInfo("defs");
		if (oPSBindingInfo) {
			oPSBindingInfo.templateShareable = true;
		}
		this._oGanttChart.setCalendarDef(oCalendarDef.clone());
		return this;
	};
	
	GanttChartWithTable.prototype._hierarchyChange = function () {
		var sHierarchyKey = this.getHierarchyKey();
		if (sHierarchyKey && this._oHierarchyConfigMap[sHierarchyKey]) {
			// if current hierarchy has a column configuration, generate columns from configuration.
			if (this._oHierarchyConfigMap[sHierarchyKey].getColumns() &&
					this._oHierarchyConfigMap[sHierarchyKey].getColumns().length > 0) {
				this._buildColumnFromCellCallback();
			} 
			// adjust current mode
			var sMode =  this.getMode();
			if (sMode === sap.gantt.config.DEFAULT_MODE_KEY && this._oHierarchyConfigMap[this.getHierarchyKey()]) {
				sMode = this._oHierarchyConfigMap[this.getHierarchyKey()].getActiveModeKey();
			}
			this.setMode(sMode);
			this.setSelectionMode(this.getSelectionMode());
		}
	};

	GanttChartWithTable.prototype._buildColumnFromCellCallback = function () {
		this._oTT.removeAllColumns();
		
		var oHierarchyConfig, aColumnConfig;
		oHierarchyConfig = this._oHierarchyConfigMap[this.getHierarchyKey()];
		if (oHierarchyConfig){
			aColumnConfig = oHierarchyConfig.getColumns();
		}
		if (aColumnConfig) {
			for (var i = 0; i < aColumnConfig.length; i++) {
				var oCol = new Column({
					label: aColumnConfig[i].getTitle(),
					sortProperty: aColumnConfig[i].getSortAttribute(),
					filterProperty: aColumnConfig[i].getFilterAttribute(),
					width: aColumnConfig[i].getWidth(),
					template: new Cell({
						cellCallback: this.getCellCallback(),
						columnConfig: aColumnConfig[i]
					})
				});
				this._oTT.addColumn(oCol);
			}
		} 
		
		// hack from treeTable, trigger update cell
		this._oTT._bCallUpdateTableCell = true;
	};
	
	GanttChartWithTable.prototype.setObjectTypes = function (aObjectTypes) {
		this.setProperty("objectTypes", aObjectTypes);
		this._oGanttChart.setObjectTypes(aObjectTypes);
		// build a map for easy look up
		this._oObjectTypesConfigMap = {};
		if (aObjectTypes) {
			for (var i = 0; i < aObjectTypes.length; i++){
				this._oObjectTypesConfigMap[aObjectTypes[i].getKey()] = aObjectTypes[i];
			}
		}
		return this;
	};
	
	GanttChartWithTable.prototype.setChartSchemes = function (aChartSchemes) {
		this.setProperty("chartSchemes", aChartSchemes);
		this._oGanttChart.setChartSchemes(aChartSchemes);
		// build a map for easy look up
		this._oGanttChartSchemesConfigMap = {};
		if (aChartSchemes) {
			for (var i = 0; i < aChartSchemes.length; i++) {
				this._oGanttChartSchemesConfigMap[aChartSchemes[i].getKey()] = aChartSchemes[i];
			}
		}
		return this;
	};
	
	GanttChartWithTable.prototype.setShapeDataNames = function (aShapeDataNames) {
		this.setProperty("shapeDataNames", aShapeDataNames);
		this._oGanttChart.setShapeDataNames(aShapeDataNames);
		return this;
	};
	
	GanttChartWithTable.prototype.setLocale = function (oLocale) {
		this.setProperty("locale", oLocale);
		this._oGanttChart.setLocale(oLocale);
		return this;
	};
	
	GanttChartWithTable.prototype.setShapes = function (aShapes) {
		this.setProperty("shapes", aShapes);
		this._oGanttChart.setShapes(aShapes);
		// build a map for easy look up
		this._oShapesConfigMap = {};
		if (aShapes) {
			for (var i = 0; i < aShapes.length; i++) {
				this._oShapesConfigMap[aShapes[i].getKey()] = aShapes[i];
			}
		}
		return this;
	};

	GanttChartWithTable.prototype.setSvgDefs = function (oSvgDefs) {
		this.setProperty("svgDefs", oSvgDefs);
		this._oGanttChart.setSvgDefs(oSvgDefs);
		return this;
	};

	GanttChartWithTable.prototype.setEnableCursorLine = function (bEnableCursorLine) {
		this.setProperty("enableCursorLine", bEnableCursorLine);
		this._oGanttChart.setEnableCursorLine(bEnableCursorLine);
		this._oToolbar.setEnableCursorLine(bEnableCursorLine);
		return this;
	};

	GanttChartWithTable.prototype.setEnableNowLine = function (bEnableNowLine) {
		this.setProperty("enableNowLine", bEnableNowLine);
		this._oGanttChart.setEnableNowLine(bEnableNowLine);
		this._oToolbar.setEnableNowLine(bEnableNowLine);
		return this;
	};

	GanttChartWithTable.prototype.setEnableVerticalLine = function (bEnableVerticalLine) {
		this.setProperty("enableVerticalLine", bEnableVerticalLine);
		this._oGanttChart.setEnableVerticalLine(bEnableVerticalLine);
		this._oToolbar.setEnableVerticalLine(bEnableVerticalLine);
		return this;
	};

	GanttChartWithTable.prototype.setTimeZoomRate = function (fTimeZoomRate) {
		this.setProperty("timeZoomRate", fTimeZoomRate);
		this._oGanttChart.setTimeZoomRate(fTimeZoomRate);
		return this;
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.addRelationship = function (oRelationship) {
		this._oGanttChart.addRelationship(oRelationship);
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.insertRelationship = function (iIndex, oRelationship) {
		this._oGanttChart.insertRelationship(iIndex, oRelationship);
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.removeRelationship = function (oRelationship) {
		this._oGanttChart.removeRelationship(oRelationship);
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.getRelationships = function () {
		this._oGanttChart.getRelationships();
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.destroyRelationships = function () {
		this._oGanttChart.destroyRelationships();
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.indexOfRelationship = function (oRelationship) {
		this._oGanttChart.indexOfRelationship(oRelationship);
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.removeAllRelationships = function () {
		this._oGanttChart.removeAllRelationships();
	};
	
	// This method is needed because once relationships data is retrieved from the backend,
	// UI5 core will try to call this method and if it not exist the updateAggregation method is called,
	// then it will execute binding.factory method which is a dummy method and causes exceptions.
	GanttChartWithTable.prototype.updateRelationships = function (sReason) {
		this._oGanttChart.updateRelationships(sReason);
	};

	GanttChartWithTable.prototype.setSelectionPanelSize = function (sCSSSize, bSuppressInvalidate) {
		this.setProperty("selectionPanelSize", sCSSSize, bSuppressInvalidate);
		this._oSelectionPanelCnt.setLayoutData(new SplitterLayoutData({
			size: sCSSSize
		}));
		return this;
	};

	GanttChartWithTable.prototype.addCustomToolbarItem = function (oCustomToolbarItem) {
		this._oToolbar.addCustomToolbarItem(oCustomToolbarItem);
	};

	GanttChartWithTable.prototype.insertCustomToolbarItem = function (oCustomToolbarItem, iIndex) {
		this._oToolbar.insertCustomToolbarItem(oCustomToolbarItem, iIndex);
	};

	GanttChartWithTable.prototype.removeCustomToolbarItem = function (oCustomToolbarItem) {
		this._oToolbar.removeCustomToolbarItem(oCustomToolbarItem);
	};

	GanttChartWithTable.prototype.removeAllCustomToolbarItems = function () {
		this._oToolbar.removeAllCustomToolbarItems();
	};

	GanttChartWithTable.prototype.addColumn = function (oColumn) {
		this._oTT.addColumn(oColumn);
	};

	GanttChartWithTable.prototype.insertColumn = function (oColumn, iIndex) {
		this._oTT.insertColumn(oColumn, iIndex);
	};

	GanttChartWithTable.prototype.removeColumn = function (oColumn) {
		this._oTT.removeColumn(oColumn);
	};

	GanttChartWithTable.prototype.removeAllColumns = function () {
		this._oTT.removeAllColumns();
	};
	
	GanttChartWithTable.prototype.getColumns = function () {
		return this._oTT.getColumns();
	};

	GanttChartWithTable.prototype._bindAggregation = function (sName, oBindingInfo) {
		var oModel, oBindingContext;
		if (sName == "rows" && oBindingInfo){
			oModel = this.getModel(oBindingInfo.model);
			// resolve the path if gantt chart itself is binded
			oBindingContext = this.getBindingContext(oBindingInfo.model);
			if (oBindingContext && oModel){
				oBindingInfo.path = oModel.resolve(oBindingInfo.path, oBindingContext);
			}
			// bind rows to tt and chart, two diff binding objects will be created
			this._oTT.bindRows(oBindingInfo);
			this._oGanttChart.bindRows(oBindingInfo);
			// sync behaviors of both controls (expand, etc...)
			this._oTC.updateRows = this._updateRows.bind(this);
			// only one-direction sync. Otherwise endless loop happens when length of data is smaller than visible row count
			//this._oTT.updateRows = this._updateRows.bind(this);
		} else if (sName == "relationships" && oBindingInfo) {
			oModel = this.getModel(oBindingInfo.model);
			// resolve the path if gantt chart itself is binded
			oBindingContext = this.getBindingContext(oBindingInfo.model);
			if (oBindingContext && oModel){
				oBindingInfo.path = oModel.resolve(oBindingInfo.path, oBindingContext);
			}
			this._oGanttChart.bindRelationships(oBindingInfo);
		} else {
			return sap.ui.core.Control.prototype._bindAggregation.apply(this, arguments);
		}
	};
	

	GanttChartWithTable.prototype._updateRows = function () {
		sap.ui.table.Table.prototype.updateRows.apply(this._oTT, arguments);
		sap.ui.table.Table.prototype.updateRows.apply(this._oTC, arguments);
	};

	GanttChartWithTable.prototype._detachToolbarEvents = function () {
		this._oToolbar.detachSourceChange(this._onToolbarSourceChange, this);
		this._oToolbar.detachExpandTreeChange(this._onToolbarExpandTreeChange, this);
	};

	GanttChartWithTable.prototype.onAfterRendering = function () {
		this._attachEvents();
		this._oTT._oHSb.setContentSize(this._oTT.$().find(".sapUiTableCtrlScroll").width() + "px");
	};

	GanttChartWithTable.prototype._attachEvents = function () {
		// add 'onAfterRendering' event delegate to this._oTT
		var oDelegate = {
			onAfterRendering: this._onTTandTCafterRendering
		};
		this._oTT.removeEventDelegate(oDelegate);
		this._oTT.addEventDelegate(oDelegate,this);
		// add 'onAfterRendering' event delegate to this._oTC
		this._oTC.removeEventDelegate(oDelegate);
		this._oTC.addEventDelegate(oDelegate,this);
		
		
	};
	
	GanttChartWithTable.prototype._onRowSelectionChange = function (oEvent){
		
		this.fireRowSelectionChange({
			originEvent: oEvent.getParameter("originEvent")
		});
		this._oTT._oSelection.fireSelectionChanged(); //sync selection of oTC and oTT -- when table impl changes, change accordingly
	};

	GanttChartWithTable.prototype._onChartMouseOver = function (oEvent){
		var oParam = oEvent.getParameters();
		this.fireChartMouseOver({
			objectInfo: oParam.objectInfo,
			leadingRowInfo: oParam.leadingRowInfo,
			timestamp: oParam.timestamp,
			svgId: oParam.svgId,
			svgCoordinate: oParam.svgCoordinate, 
			effectingMode: oParam.effectingMode,
			originEvent: oParam.originEvent
		});
	};
	
	GanttChartWithTable.prototype._onShapeSelectionChange = function (oEvent){
		this.fireShapeSelectionChange({
			originEvent: oEvent.getParameter("originEvent")
		});
	};
	GanttChartWithTable.prototype._onRelationshipSelectionChange = function (oEvent){
		this.fireRelationshipSelectionChange({
			originEvent: oEvent.getParameter("originEvent")
		});
	};
	
	GanttChartWithTable.prototype._onDoubleClick = function (oEvent){
		var oParam = oEvent.getParameters();
		this.fireChartDoubleClick({
			objectInfo: oParam.objectInfo,
			leadingRowInfo: oParam.leadingRowInfo,
			timestamp: oParam.timestamp,
			svgId: oParam.svgId,
			svgCoordinate: oParam.svgCoordinate, 
			effectingMode: oParam.effectingMode,
			originEvent: oParam.originEvent
		});
	};
	/*
	 * This method will fire the right click event on the chart
	 */		
	GanttChartWithTable.prototype._onRightClick = function (oEvent){
		var oParam = oEvent.getParameters();
		this.fireChartRightClick({
			objectInfo: oParam.objectInfo,
			leadingRowInfo: oParam.leadingRowInfo,
			timestamp: oParam.timestamp,
			svgId: oParam.svgId,
			svgCoordinate: oParam.svgCoordinate, 
			effectingMode: oParam.effectingMode,
			originEvent: oParam.originEvent
		});
	};
 
	GanttChartWithTable.prototype._onChartDragEnter = function (oEvent) {
		this.fireChartDragEnter({
			originEvent: oEvent.getParameter("originEvent")
		});
	};
	
	GanttChartWithTable.prototype._onChartDragLeave = function (oEvent) {
		this.fireChartDragLeave({
			originEvent: oEvent.getParameter("originEvent"),
			draggingSource: oEvent.getParameter("draggingSource")
		});
			
	};
	
	GanttChartWithTable.prototype._onShapeDragEnd = function (oEvent) {
		var oParam = oEvent.getParameters();
		this.fireShapeDragEnd({
			originEvent: oParam.originEvent,
			sourceShapeData: oParam.sourceShapeData,
			targetData: oParam.targetData,
			sourceSvgId: oParam.sourceSvgId,
			targetSvgId: oParam.targetSvgId
		});
	};
	
	GanttChartWithTable.prototype._onChartHSbScroll = function (oEvent) {
		var nScrollLeft = this._oTC._oHSb.getScrollPosition();
		this.fireHorizontalScroll({
			scrollSteps: nScrollLeft,
			leftOffsetRate: this._oGanttChart.updateLeftOffsetRate(nScrollLeft)
		});
	};
	
	GanttChartWithTable.prototype._onChartVSbScroll = function (oEvent) {
		this.fireVerticalScroll({
			scrollSteps: this._oTC._oVSb.getScrollPosition()
		});
		this._oTT.setFirstVisibleRow(this._oTC._oVSb.getScrollPosition() || 0, true);
	};
	
	GanttChartWithTable.prototype._onChartShapesUpdated = function (oEvent) {
		this._appendMaskSvg();
		this._updateCSSForDummyRow();
		this.fireEvent("_shapesUpdated", {aSvg: oEvent.mParameters.aSvg});
	};

	GanttChartWithTable.prototype._onSelectionPanelVSbScroll = function (oEvent) {
		this._oTC._oVSb.setScrollPosition(this._oTT.getFirstVisibleRow());
	};

	GanttChartWithTable.prototype._onSplitterResize = function (oEvent) {
		var oParam = oEvent.getParameters();
		// reset size of chart and selectionpanel explicitely to force chart div resizing
		// fire event
		oParam.zoomInfo = this._oGanttChart.calculateZoomInfoFromChartWidth(
			oParam.newSizes[1]);
		this.fireSplitterResize(oParam);

	};

	GanttChartWithTable.prototype._onToolbarSourceChange = function (oEvent) {
		var oldHierarchy = this.getHierarchyKey();
		this.setHierarchyKey(oEvent.getParameter("id"));

		this.notifySourceChange();
		this.fireGanttChartSwitchRequested({
			hierarchyKey: oEvent.getParameter("id"),
			oldHierarchyKey: oldHierarchy
		});
	};

	GanttChartWithTable.prototype._onToolbarExpandTreeChange = function(oEvent){
		var sAction = oEvent.getParameter("action");
		if (sAction){
			var aSelectedRows = this._oTT.getSelectedIndices();
			for (var i = aSelectedRows.length - 1; i > -1; i--){
				this._oTT[sAction](aSelectedRows[i]);
				aSelectedRows = this._oTT.getSelectedIndices();
			}
		}
	};
	
	GanttChartWithTable.prototype._onToolbarModeChange = function (oEvent) {
		// update data if mode is bound to model
		var oBindingInfo = this.getBinding("mode");
		if (oBindingInfo) {
			oBindingInfo.setValue(oEvent.getParameter("mode"));
		}
		// trigger mode change
		this.setMode(oEvent.getParameter("mode"));
	};

	GanttChartWithTable.prototype.expandChartChange = function (oEvent) {
		var oParameters = oEvent.getParameters();
		this._oGanttChart.expandChartChange(oParameters.isExpand, oParameters.expandedChartSchemes, oParameters.aExpandedIndices);
	};

	GanttChartWithTable.prototype.getBaseRowHeight = function () {
		if (this._oTT.getRows()[0]) {
			return this._oTT.getRows()[0].getDomRef().scrollHeight;
		}
	};

	GanttChartWithTable.prototype._onTTandTCafterRendering = function(oEvent) {
		//We'd like to sync the hovering behavior for the rows of table (i.e. _oTT) and chart (i.e. _oTC). The idea is to programmatically trigger
		//hovering event on _oTT when user is hovering over _oTC, visa versa. But here we need to be careful to prevent endless event loop.
		var oTT = this._oTT;
		var $oTT = jQuery(oTT.getDomRef());
		var oTC = this._oTC;
		var $oTC = jQuery(oTC.getDomRef());
		var sOTTId = oTT.getId();
		var sOTCId = oTC.getId();
		var oSrcControl = oEvent.srcControl;
		var sId, oTargetControl;
		if (oSrcControl === oTT){
			//sync row height
			oTC.setRowHeight(this.getBaseRowHeight());
			sId = sOTCId;
			oTargetControl = oTC;
			//this is for the hover event handler of row selector (the rectangles on the leftmost of the table),
			//since they are not part of rows so that the event handlers need to be registered separately.
			$oTT.find(".sapUiTableRowHdr").hover(function(event) {
				var sType = event.type,
					iIndex = $oTT.find(".sapUiTableRowHdr").index(this),
					oRow;
				if (TreeTableHelper.isMultipleSpanMainRow(oTT, iIndex, false)){
					var mainRowGroupIndices = TreeTableHelper.getMultipleSpanMainRowGroupIndices(oTT, iIndex, false);
					for (var i = 0; i < mainRowGroupIndices.length; i++){
						oRow = oTT.getRows()[mainRowGroupIndices[i]];
						if (oRow){
							jQuery(oRow.getDomRef()).trigger(sType, [oTT.getId()]);
						}
					}
				} else {
					oRow = oTC.getRows()[iIndex];
					if (oRow){
						jQuery(oRow.getDomRef()).trigger(sType, [oTT.getId()]);
					}
				}
			});
		}else if (oSrcControl === oTC){
			sId = sOTTId;
			oTargetControl = oTT;
			//this is for the hover event handler of row selector (the rectangles on the leftmost of the table),
			//since they are not part of rows so that the event handlers need to be registered separately. 
			$oTC.find(".sapUiTableRowHdr").hover(function(event) {
				var cType = event.type,
					cIndex = $oTC.find(".sapUiTableRowHdr").index(this),
					oRow;
				if (TreeTableHelper.isMultipleSpanMainRow(oTC,cIndex)){
					var mainRowGroupIndices = TreeTableHelper.getMultipleSpanMainRowGroupIndices(oTC,cIndex);
					for (var i = 0; i < mainRowGroupIndices.length; i++){
						oRow = oTC.getRows()[mainRowGroupIndices[i]];
						if (oRow){
							jQuery(oRow.getDomRef()).trigger(cType,[oTC.getId()]);
						}
					}
				} else {
					oRow = oTT.getRows()[cIndex];
					if (oRow){
						jQuery(oRow.getDomRef()).trigger(cType,[oTC.getId()]);
					}
				}
			});
		}
		//define the hover event handler which is used for both mouseover and mouseout
		var f1 = function(event, sFromControlId, bMainRow){
			var sType = event.type;
			var oRow = jQuery(this).control(0);
			var iIndex = oSrcControl.indexOfRow(oRow);
			//need to ensure the event was triggered by user's action instead of from oTC's hover event handler,
			//otherwise there will be endless event loop.
			
			if (bMainRow === undefined && TreeTableHelper.isMultipleSpanMainRow(oSrcControl, iIndex, false)){
				var mainRowGroupIndices = TreeTableHelper.getMultipleSpanMainRowGroupIndices(oSrcControl, iIndex, false);
				if (sFromControlId !== sId){
					if (sFromControlId === sOTCId && sType !== "mouseleave") {
						var oTTRow = oTargetControl.getRows()[iIndex];
						if (oTTRow) {
							jQuery(oTTRow.getDomRef()).trigger(sType,[oSrcControl.getId()],true);
						}
					}else {
						for (var i = 0; i < mainRowGroupIndices.length; i++){
							var oSrcRow = oSrcControl.getRows()[mainRowGroupIndices[i]];
							var oTarRow = oTargetControl.getRows()[mainRowGroupIndices[i]];
							if (oSrcRow && oTarRow) {
								jQuery(oSrcRow.getDomRef()).trigger(sType,[oTargetControl.getId()], true);
								jQuery(oTarRow.getDomRef()).trigger(sType,[oSrcControl.getId()],true);
							}
						}
					}
				}
			} else if (sFromControlId !== sId){
				if (iIndex > -1){
					oRow = oTargetControl.getRows()[iIndex];
					if (oRow) {
						jQuery(oRow.getDomRef()).trigger(sType,[oSrcControl.getId()],true);
					}
				}
			}
			
		};
		//register events to each row of _oTT
		var aRows = oSrcControl.getRows();
		var iRowsLength = aRows.length;
		var j = 0;
		for (j = 0; j < iRowsLength; j++){
			var $oRow = jQuery(aRows[j].getDomRef());
			//$oRow.hover(f1);
			//just a workaround, we need update the implementation
			if (jQuery._data($oRow[0], "events") === undefined || jQuery._data($oRow[0], "events").mouseover.length < 2) {
				$oRow.mouseenter(f1);
				$oRow.mouseleave(f1);
			}
		}
		//expand tree table to default level expandedLevels defined in configuration of hierarchy
		this._expandDefaultLevel();

	};
	
	GanttChartWithTable.prototype._onRowCollapse = function (oEvent) {
		this.expandChartChange(oEvent);
	};
	
	/**
	 * Returns the effective toolbar scheme key.
	 * 
	 * @returns {string} - Toolbar scheme key.
	 * @public
	 */
	GanttChartWithTable.prototype.getToolbarSchemeKey = function () {
		return this._oToolbar.getToolbarSchemeKey();
	};
	
	/**
	 * Scrolls the visible chart area to a certain time. 
	 * 
	 * <p>It can be used to implement the function of 'Jump To First', 'Jump To Last' and 'Jump To Current'.</p>
	 *
	 * @param {Date} oDate The date object to which the user wants the visible area to scroll.
	 * @public
	 */
	GanttChartWithTable.prototype.jumpToPosition = function(oDate) {
		this._oGanttChart.jumpToPosition(oDate);
	};
	
	/**
	 * Selects in-row shapes and returns a success code.
	 * 
	 * @param {array} [aIds] List of the shapes that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected shapes are deselected
	 * @return {boolean} If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.selectShapes = function(aIds, isExclusive) {
		return this._oGanttChart.selectShapes(aIds, isExclusive);
	};

	/**
	 * Deselects in-row shapes and returns a success code.
	 * 
	 * @param {array} [aIds] List the shapes that you want to deselect
	 * @return {boolean} If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.deselectShapes = function(aIds) {
		return this._oGanttChart.deselectShapes(aIds);
	};

	/**
	 * Selects relationships and returns a success code.
	 * 
	 * @param {array} [aIds] List of the relationships that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected relationships are deselected
	 * @return {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.selectRelationships = function(aIds, isExclusive) {
		return this._oGanttChart.selectRelationships(aIds, isExclusive);
	};

	/**
	 * Deselects relationships and returns a success code.
	 * 
	 * @param {array} [aIds] List of the relationships that you want to deselect
	 * @return {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.deselectRelationships = function(aIds) {
		return this._oGanttChart.deselectRelationships(aIds);
	};

	/**
	 * Selects rows and returns a success code.
	 * 
	 * @param {array} [aIds] List of the rows that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected elements are deselected
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.selectRows = function(aIds, isExclusive) {
		return this._oGanttChart.selectRows(aIds, isExclusive);
	};

	/**
	 * Deselects rows and returns a success code.
	 * 
	 * @param {array} [aIds] List of the rows that you want to deselect
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.deselectRows = function(aIds) {
		return this._oGanttChart.deselectRows(aIds);
	};
	
	/**
	 * Selects rows and all in-row shapes contained in the rows.
	 * 
	 * @param {array} [aIds] Row uids
	 * @param {boolean} [bIsExclusive] Whether all other selected rows and shapes are deselected
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.selectRowsAndShapes = function(aIds, bIsExclusive) {
		return this._oGanttChart.selectRowsAndShapes(aIds, bIsExclusive);
	};

	/**
	 * Gets all selected rows, shapes, and relationships
	 * @return {object} The returned object contains "rows" for all selected rows, "shapes" for all selected shapes, and "relationships" for all selected relationships
	 * @public
	 */
	GanttChartWithTable.prototype.getAllSelections = function () {
		return this._oGanttChart.getAllSelections();
	};
	
	/**
	 * Gets selected in-row shapes.
	 * 
	 * @return {array} Returns all selected shapes in the chart
	 * @public
	 */
	GanttChartWithTable.prototype.getSelectedShapes = function() {
		var aSelectedShapes = this._oGanttChart.getSelectedShapes();
		return aSelectedShapes;
	};

	/**
	 * Gets selected rows.
	 * 
	 * @return {array} Returns all selected rows
	 * @public
	 */
	GanttChartWithTable.prototype.getSelectedRows = function() {
		var aSelectedRows = this._oGanttChart.getSelectedRows();
		return aSelectedRows;
	};
	
	/**
	 * Gets selected relationships.
	 * 
	 * @return {array} Returns all selected relationships in the chart
	 * @public
	 */
	GanttChartWithTable.prototype.getSelectedRelationships = function() {
		var aSelectedRelationships = this._oGanttChart.getSelectedRelationships();
		return aSelectedRelationships;
	};
	
	
	GanttChartWithTable.prototype.setDraggingData = function(oDraggingShape) {
		this._oGanttChart.setDraggingData(oDraggingShape);
	};
	
	GanttChartWithTable.prototype._updateCSSForDummyRow = function() {
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

	GanttChartWithTable.prototype._drawSelectionPanel = function () {
		var aTableSvg = d3.select("#" + this.getId() + "-spm-svg-table");
		var aSelectionSvg = d3.select("#" + this.getId() + "-spm-svg-selection");
		
		var aData = this._oGanttChart.getShapeData();
		if (aData !== undefined){
			this._oSelectionPanelDrawer.drawSvg(aTableSvg, aSelectionSvg, aData, this);
		}
		
	};
	

	GanttChartWithTable.prototype._appendMaskSvg = function(){
		var $tableMask = this.$().find("#" + this.getId() + "-spm-svg-table-ctn");
		var $slecetionMask = this.$().find("#" + this.getId() + "-spm-svg-slecetion-ctn");
		
		if ($tableMask.length == 0 && $slecetionMask.length == 0) {
			
			$tableMask = $("<div id='" + this.getId() + "-spm-svg-table-ctn' class='sapGanttChartSPMSvgCtn' >" + 
						"<svg id='" + this.getId() + "-spm-svg-table' class='sapGanttSPMaskSvg'>" +
						"</svg>" +
					"</div>");
			
			$slecetionMask = $("<div id='" + this.getId() + "-spm-svg-slecetion-ctn' class='sapGanttChartSPMSvgCtn' >" + 
					"<svg id='" + this.getId() + "-spm-svg-selection' class='sapGanttSPMaskSvg'>" +
					"</svg>" +
				"</div>");
			
			this._oTT.$().find("table").parent().append($tableMask);
			this._oTT.$().find("table").parent().parent().prev().append($slecetionMask);

		}
		
		$($tableMask).attr("style", this._oTT.$().find("table").attr("style"));
		
		this._drawSelectionPanel();
	};
	
	GanttChartWithTable.prototype.getAxisOrdinal = function () {
		return this._oGanttChart.getAxisOrdinal();
	};
	
	GanttChartWithTable.prototype.getAxisTime = function () {
		return this._oGanttChart.getAxisTime();
	};

	GanttChartWithTable.prototype._expandDefaultLevel = function() {
		var aExpandedLevels;
		var sHierarchyKey = this.getHierarchyKey();
		//Check because default expansion should be applied only once
		if (this._oDefaultExpansionStatus) {
			if (this._oDefaultExpansionStatus[sHierarchyKey] === true) {
				return;
			}
		}

		if (this._oHierarchyConfigMap[sHierarchyKey] && this._oHierarchyConfigMap[sHierarchyKey].getExpandedLevels()) {
			aExpandedLevels = this._oHierarchyConfigMap[this.getHierarchyKey()].getExpandedLevels();
			var oBinding = this._oTT.getBinding("rows");
			var oTreeTableData = oBinding.getModel().getObject(oBinding.getPath());
			var iCurrentLevel = 0; //Traversal level
			var iRowCursor = 0;
			var aCollapseRowIndex = [];
			var aNodeNames = this._oTT.getBindingInfo("rows").parameters.arrayNames;
			var iIndex;
			var hasChildren = function(oNode) {
				for (var i = 0; i < aNodeNames.length; i++){
					if (oNode[aNodeNames[i]]) {
						return true;
					}
				}
				return false;
			};
			if (aExpandedLevels.length <= 0) {
				//No configuration, mark expand as applied and exit
				this._oDefaultExpansionStatus[sHierarchyKey] = true;
				return;
			} else {
				//Attach change event to binding
				//Expand the tree table to the level of length of configured levels
				//In change event handler. detach the event first, then find and collapse the nodes which do not match the config
				var fnCalculateCollapseRowIndex = function(index, oNode) {
					if (iCurrentLevel > aExpandedLevels.length) {
						if (iCurrentLevel === (aExpandedLevels.length + 1)) {
							iRowCursor++;
						}
						return;
					}
					if (hasChildren(oNode) === true) {
						if (!($.inArray(oNode.type, aExpandedLevels[iCurrentLevel]) > -1)) {
							if (aCollapseRowIndex) {
								aCollapseRowIndex.push(iRowCursor);
							} else {
								aCollapseRowIndex = [iRowCursor];
							}
						}
						iRowCursor++;
						if (iCurrentLevel <= aExpandedLevels.length) {
							iCurrentLevel++;
							for (var j = 0; j < aNodeNames.length; j++){
								if (oNode[aNodeNames[j]]) {
									jQuery.each(oNode[aNodeNames[j]], fnCalculateCollapseRowIndex);
								}
							}
							iCurrentLevel--;
						}
					} else {
						iRowCursor++;
					}
				};
				var fnCollapse = function() {
					oBinding.detachChange(fnCollapse, this);
					for (var i = 0; i < aNodeNames.length; i++){
						if (oTreeTableData[aNodeNames[i]]) {
							jQuery.each(oTreeTableData[aNodeNames[i]], fnCalculateCollapseRowIndex);
						}
					}
					oBinding.getContexts(this._oTT.getFirstVisibleRow(), 0);
					for (iIndex = 0; iIndex < aCollapseRowIndex.length; iIndex++) {
						this._oTT.collapse(aCollapseRowIndex[iIndex]);
					}
				};
				oBinding.attachChange(fnCollapse, this);
				this._oTT.expandToLevel(aExpandedLevels.length);
			}
		}
		//update default expansion status of hierarchy to avoid it is applied again
		this._oDefaultExpansionStatus[sHierarchyKey] = true;
	};

	/**
	 * Walks through the local toolbar schemes and the global toolbar scheme to determine whether the user can
	 * expand the Gantt chart. It is used in the tree table filter and the sort event handler.
	 * 
	 * @return {boolean} true: can be expanded; false: can not be expanded
	 * @private
	 */
	GanttChartWithTable.prototype.canExpandGanttChart = function() {
		var bCanExpandChart = false;
		// Check local tool bar expand chart configuration
		var sCurrentHierarchyKey = this.getHierarchyKey(),
			aAllHierarchies = this.getHierarchies(),
			aAllToolbarSchemes = this.getToolbarSchemes();
		var aFilteredHierarchy = aAllHierarchies.filter(function(oHierarchy){
			return oHierarchy.getKey() === sCurrentHierarchyKey;
		}) || [];

		aFilteredHierarchy.forEach(function(oHierarchy){
			bCanExpandChart = aAllToolbarSchemes.filter(function(oScheme){
				return oScheme.getKey() === oHierarchy.getToolbarSchemeKey();
			}).some(function(oToolbarScheme){
				return oToolbarScheme.getExpandChart();
			});
		});

		// Check if global toolbar has configure expand chart or not
		var oContainer = this.getParent();
		if (!bCanExpandChart && oContainer.getToolbarSchemes) {
			var sLayoutKey = oContainer.getContainerLayoutKey(),
				aLayouts = oContainer.getContainerLayouts(),
				aLayout = aLayouts.filter(function(oItem){
					return oItem.getKey() === sLayoutKey;
				}) || [];
			
			aLayout.forEach(function(oLayout){
				bCanExpandChart = oContainer.getToolbarSchemes().filter(function(oItem){
					return oItem.getKey() === aLayout[0].getToolbarSchemeKey();
				}).some(function(oItem){
					return oItem.getExpandChart();
				});
			});
		}
		return bCanExpandChart;
	};

	/**
	 * Expands the row for the given row index in the selection panel
	 * 
	 * @see sap.ui.table.Table.expand
	 *
	 * @param {int} iRowIndex
	 *         Index of the row to expand
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.expand = function(iRowIndex) {
		this._oTT.expand(iRowIndex);
		return this;
	};
	
	/**
	 * Collapses the row for the given row index in the selection panel
	 *
	 * @see sap.ui.table.Table.collapse
	 * 
	 * @param {int} iRowIndex
	 *         index of the row to expand
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.collapse = function(iRowIndex) {
		this._oTT.collapse(iRowIndex);
		return this;
	};
	
	/**
	 * Selects a row in the selection panel.
	 * 
	 * @see sap.ui.table.Table.setSelectedIndex
	 * 
	 * @param {int} iRowIndex The row index to be selected (if any exists)
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.setSelectedIndex = function(iRowIndex) {
		this._oTT.setSelectedIndex(iRowIndex);
		return this;
	};
	
	/**
	 * Retrieves the lead selection index. The lead selection index is, among other things, used to determine the
	 * start and end of a selection range, when using Shift-Click to select multiple entries. 
	 * 
	 * @see sap.ui.table.Table.getSelectedIndex
	 * 
	 * @return {int[]} An array containing all selected indexes (ascending ordered integers)
	 * @public
	 */
	GanttChartWithTable.prototype.getSelectedIndex = function() {
		return this._oTT.getSelectedIndex();
	};
	
	/**
	 * Gets the first visible row of the selection panel. 
	 * 
	 * @see sap.ui.table.Table.getFirstVisibleRow
	 * 
	 * @return {int} the first visible row index
	 * @public
	 */
	GanttChartWithTable.prototype.getFirstVisibleRow = function() {
		return this._oTT.getFirstVisibleRow();
	};

	/**
	 * Sets the first visible row in the selection panel.
	 * 
	 * @see sap.ui.table.Table.setFirstVisibleRow
	 * 
	 * @param {int} iRowIndex The row index to be set as the first visible row
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.setFirstVisibleRow = function(iRowIndex) {
		this._oTT.setFirstVisibleRow(iRowIndex);
		return this;
	};
	
	/**
	 * Gets the number of visible rows in the selection panel. 
	 * 
	 * @see sap.ui.table.Table.getVisibleRowCount
	 * 
	 * @return {int} The first visible row index
	 * @public
	 */
	GanttChartWithTable.prototype.getVisibleRowCount = function() {
		return this._oTT.getVisibleRowCount();
	};
	
	GanttChartWithTable.prototype.getRows = function() {
		return this._oTT.getRows();
	};
	
	GanttChartWithTable.prototype.exit = function () {
		this._detachToolbarEvents();
		this._oSplitter.destroy();
	};

	GanttChartBase.prototype.notifySourceChange = function(){
		// Remove the custom data when data source change
		this._oTT.data(TreeTableHelper.JSONDataKey, null);
	};
	return GanttChartWithTable;
}, true);
