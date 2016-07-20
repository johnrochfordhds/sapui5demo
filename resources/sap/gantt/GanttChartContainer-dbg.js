/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Control", "sap/ui/layout/Splitter", "sap/ui/layout/SplitterLayoutData", "sap/ui/core/Orientation",
	"./legend/LegendContainer", "./control/Toolbar", "./control/AssociateContainer",
	"./config/TimeHorizon", "./misc/Utility"
], function (Control, Splitter, SplitterLayoutData, Orientation, LegendContainer, Toolbar, AssociateContainer,
	TimeHorizon, Utility) {
	"use strict";

	/**
	 * Creates and initializes a new Gantt chart container.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A container that holds one or more <code>GanttChartBase</code> instances.
	 *
	 * <p> This class has several built-in several controls to support <code>GanttChartBase</code> instances:
	 *  <ul>
	 * 		<li>A toolbar above all Gantt Charts. Many built-in controls can be enabled or disabled using configuration property <code>toolbarScheme</code>. Built-in functions include:
	 *			<ul>
	 *				<li>ComboBox for container selection</li>
	 *				<li>Buttons for Add View, Delete View, and Switch Splitter Orientation</li>
	 *				<li>Expand/Collapse groups for expandable charts</li>
	 *				<li>A zooming slider</li>
	 *				<li>A legend button</li>
	 *				<li>A Settings button</li>
	 *			</ul>
	 *			If nothing is added to the toolbar, the toolbar is hidden automatically. For more information about the functions and configuration, 
	 *			see the API documentation of <code>sap.gantt.config.ToolbarScheme.</code>
	 *		</li>
	 *		<li>A Splitter containing aggregation <code>ganttCharts</code></li>
	 *  </ul>
	 * </p>
	 *
	 * @extend sap.ui.core.Control
	 * 
	 * @author SAP SE
	 * @version 1.36.8
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.GanttChartContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GanttChartContainer = Control.extend("sap.gantt.GanttChartContainer", /** @lends sap.gantt.GanttChartContainer.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * Width of the control
				 */
				width: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},

				/**
				 * Height of the control
				 */
				height: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},

				/**
				 * Switch to enable and disable scroll synchronization by time on instances of aggregation <code>ganttCharts</code>.
				 */
				enableTimeScrollSync: {type: "boolean", defaultValue: true},

				/**
				 * Switch to enable and disable scroll synchronization by row on instances of aggregation <code>ganttCharts</code>.
				 */
				enableRowScrollSync: {type: "boolean", defaultValue: false},

				/**
				 * Switch to enable and disable the cursor line that follows the cursor.
				 *
				 * When this value is set, it overrides the corresponding value on instances of aggregation <code>ganttCharts</code>.
				 */
				enableCursorLine: {type: "boolean", defaultValue: true},

				/**
				 * Switch to enable and disable the present time indicator.
				 *
				 * When this value is set, it overrides the corresponding value on instances of aggregation <code>ganttCharts</code>.
				 */
				enableNowLine: {type: "boolean", defaultValue: true},

				/**
				 * Switch to enable and disable vertical lines representing intervals along the time axis.
				 *
				 * When this value is set, it overrides the corresponding value on instances of aggregation <code>ganttCharts</code>.
				 */
				enableVerticalLine: {type: "boolean", defaultValue: true},

				/**
				 * Definitions of paint servers used for advanced shape features around SVG fill, stroke, and filter attributes.
				 * 
				 * If this property is provided, the paint server definition of the SVG is rendered. Method <code>getDefString()</code> should be
				 * implemented by all paint server classes that are passed in in this property. It is easier to assign a common paint server definition
				 * in this class instead of in separate instances of <code>sap.gantt.GanttChartBase</code>. Then the definition is 
				 * rendered only once.
				 */
				svgDefs: {type: "sap.gantt.def.SvgDefs", defaultValue: null},

				/**
				 * List of available modes. To apply modes to the toolbar and shapes, further configuration is needed. (specifically, 
				 * in property <code>toolbarSchemes</code>, and properties <code>toolbarSchemes</code> and <code>shapes</code> in 
				 * the <code>GanttChartBase</code> class)If not provided, a default configuration is provided.
				 */
				modes: {type: "array", defaultValue: sap.gantt.config.DEFAULT_MODES},

				/**
				 * List of available toolbar schemes. If not provided, a default configuration is provided.
				 */
				toolbarSchemes: {type: "array", defaultValue: sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEMES},

				/**
				 * List of available hierarchies. If not provided, a default configuration is provided.
				 */
				hierarchies: {type: "array", defaultValue: sap.gantt.config.DEFAULT_HIERARCHYS},

				/**
				 * Configuration of container layouts.
				 * 
				 * This configuration affects the data source selection ComboBox in the Container Toolbar. When the selection
				 * changes, the <code>ganttChartChangeRequested</code> event that is triggered includes the corresponding layout key.
				 */
				containerLayouts: {type: "array", defaultValue: sap.gantt.config.DEFAULT_CONTAINER_LAYOUTS},

				/**
				 * Current container layout key.
				 * 
				 * This is a key configured in configuration property <code>containerLayouts</code>.
				 */
				containerLayoutKey: {type: "string", defaultValue: sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY},

				/**
				 * Define the amount of units to change the time zoom slider.
				 *
				 * See {@link sap.m.Slider#setStep}
				 */
				sliderStep: {type: "int", defaultValue: 10}
			},
			aggregations: {
				
				/**
				 * Legend shown when the legend button is clicked.
				 * 
				 * This aggregation is used only when the Legend button is configured to be shown in the container toolbar.
				 */
				legendContainer: {type: "sap.gantt.legend.LegendContainer", multiple: false, visibility: "public"},

				/**
				 * Controls to be placed in the container toolbar.
				 * 
				 * <p>This aggregation is used only when the custom toolbar item group is configured to be shown in the container toolbar.
				 * Different from the built-in buttons that are configured to be shown or hidden, these controls are free controls created 
				 * by the application, but are only placed in the container toolbar by <code>sap.gantt.GanttChartContainer</code>.</p>
				 * 
				 * <p>If the source selection group is enabled and you want your application to use a container layout pre-configured 
				 * for a specific source, you can implement your custom toolbar items in the event handler of event <code>ganttChartChangeRequested</code>.</p>
				 */
				customToolbarItems: {type: "sap.ui.core.Control", multiple: true, visibility: "public",
					singularName: "customToolbarItem", bindable: "bindable"},

				/**
				 * Gantt chart instances.
				 * 
				 * <p>If the source selection group is enabled and you want your application to use a container layout pre-configured 
				 * for a specific source, you can implement your custom toolbar items in the event handler of event <code>ganttChartChangeRequested</code>.</p>
				 * <p>Provide a Gantt chart in compliance with the container layout setting.
				 * GanttChartContainer is designed to support Gantt chart layouts that include multiple views.</p>
				 */
				ganttCharts: {type: "sap.gantt.GanttChartBase", multiple: true, visibility: "public", singularName: "ganttChart", bindable: "bindable"},

				_toolbar: {type: "sap.gantt.control.Toolbar", multiple: false, visibility: "hidden"}
			},
			events: {
				
				/**
				 * Event fired when any change occurs in the toolbar that requests the application to change aggregation <code>ganttCharts</code>. 
				 * 
				 * <p>Possible triggers are:
				 * <ul>
				 * 	<li>The source selection group changes in the container toolbar.</li>
				 * 	<li>The layout group button is clicked in the container toolbar.</li>
				 * 	<li>The source selection group changes in the Gantt chart toolbar.</li>
				 * </ul>
				 * </p>
				 */
				ganttChartChangeRequested: {
					parameters: {
						/**
						 * Action that caused the change.
						 * 
						 * <p>Possible action values are:
						 * <ul>
						 * 	<li><code>'switchGanttChart'</code>: The source selection group of one Gantt chart toolbar is changed.</li>
						 * 	<li><code>'addGanttChart'</code>: The Add Gantt chart dropdown menu is selected.</li>
						 *  <li><code>'lessGanttChart'</code>: The Less Gantt chart dropdown menu is selected.</li>
						 *  <li><code>'switchContainerLayout'</code>: The source selection group of the Container toolbar is changed.</li>
						 * </ul>
						 * </p>
						 */
						action: {type: "string"},
						
						/**
						 * Provided for actions <code>'switchGanttChart'</code> and <code>'lessGanttChart'</code>.
						 */
						ganttChartIndex: {type: "int"},
						
						/**
						 * Provided for actions <code>'switchGanttChart'</code>, <code>'addGanttChart'</code> and <code>'lessGanttChart'</code>.
						 */
						hierarchyKey: {type: "string"},
						
						/**
						 * Provided for action <code>'switchGanttChart'</code>.
						 */
						oldHierarchyKey: {type: "string"},
						
						/**
						 * Provided for action <code>'switchContainerLayout'</code>.
						 */
						containerLayoutKey: {type: "string"}
					}
				},
				
				/**
				 * Event fired when the custom settings are changed.
				 * 
				 * The Custom settings are application-injected settings that can be configured in the Settings dialog box. This event allows the application to handle these settings.
				 * Only check boxes are supported.
				 */
				customSettingChange: {
					parameters: {
						/**
						 * ID of the custom setting
						 */
						id: {type: "string"},
						
						/**
						 * The value of the custom setting
						 */
						value: {type: "boolean"}
					}
				}
			}
		}
	});

	GanttChartContainer.prototype.init = function () {
		jQuery.sap.measure.start("GanttChartContainer Init","GanttPerf:GanttChartContainer Init function");
		
		this._bInitHorizonApplied = false;

		this._oToolbar = new Toolbar({
			type: sap.gantt.control.ToolbarType.Global,
			sourceId: sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY
		});
		this._oToolbar.setSliderStep(this.getSliderStep());
		this.setAggregation("_toolbar", this._oToolbar);
		this._oToolbar.attachSourceChange(this._onToolbarSourceChange, this);
		this._oToolbar.attachLayoutChange(this._onToolbarLayoutChange, this);
		this._oToolbar.attachExpandChartChange(this._onToolbarExpandChartChange, this);
		this._oToolbar.attachZoomRateChange(this._onToolbarZoomRateChange, this);
		this._oToolbar.attachSettingsChange(this._onToolbarSettingsChange, this);
		this._oToolbar.data("holder", this);

		this._oSplitter = new Splitter({
			width: "100%",
			height: "100%",
			orientation: Orientation.Vertical
		});
		
		this._oModesConfigMap = {};
		this._oModesConfigMap[sap.gantt.config.DEFAULT_MODE_KEY] = sap.gantt.config.DEFAULT_MODE;
		
		this._oToolbarSchemeConfigMap = {};
		this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY] = sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME;
		this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY] = sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME;
		this._oToolbarSchemeConfigMap[sap.gantt.config.EMPTY_TOOLBAR_SCHEME_KEY] = sap.gantt.config.EMPTY_TOOLBAR_SCHEME;
		
		this._oHierarchyConfigMap = {};
		this._oHierarchyConfigMap[sap.gantt.config.DEFAULT_HIERARCHY_KEY] = sap.gantt.config.DEFAULT_HIERARCHY;
		
		this._oContainerLayoutConfigMap = {};
		this._oContainerLayoutConfigMap[sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY] = sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT;
		this._oContainerLayoutConfigMap[sap.gantt.config.DEFAULT_CONTAINER_DUAL_LAYOUT_KEY] = sap.gantt.config.DEFAULT_CONTAINER_DUAL_LAYOUT;
		
		jQuery.sap.measure.end("GanttChartContainer Init");
	};

	GanttChartContainer.prototype.applySettings = function (mSettings, oScope) {
		var retVal = Control.prototype.applySettings.apply(this, arguments);
		if (this.getContainerLayouts() && this.getContainerLayoutKey()) {
			this.switchOrientation(null, true);
		}
		return retVal;
	};
	
	GanttChartContainer.prototype.setModes = function (aModes) {
		this.setProperty("modes", aModes);
		this._oToolbar.setModes(aModes);
		// build a map for easy look up
		this._oModesConfigMap = {};
		if (aModes) {
			for (var i = 0; i < aModes.length; i++) {
				this._oModesConfigMap[aModes[i].getKey()] = aModes[i];
			}
		}
		return this;
	};

	GanttChartContainer.prototype.setSliderStep = function (step) {
		this.setProperty("sliderStep", step);
		this._oToolbar.setSliderStep(step);
		return this;
	};

	GanttChartContainer.prototype.setToolbarSchemes = function (aToolbarSchemes) {
		this.setProperty("toolbarSchemes", aToolbarSchemes);
		this._oToolbar.setToolbarSchemes(aToolbarSchemes);
		// build a map for easy look up
		this._oToolbarSchemeConfigMap = {};
		if (aToolbarSchemes) {
			for (var i = 0; i < aToolbarSchemes.length; i++) {
				this._oToolbarSchemeConfigMap[aToolbarSchemes[i].getKey()] = aToolbarSchemes[i];
			}
		}
		return this;
	};
	
	GanttChartContainer.prototype.setHierarchies = function (aHierarchies) {
		this.setProperty("hierarchies", aHierarchies);
		this._oToolbar.setHierarchies(aHierarchies);
		// build a map for easy look up
		this._oHierarchyConfigMap = {};
		if (aHierarchies) {
			for (var i = 0; i < aHierarchies.length; i++) {
				this._oHierarchyConfigMap[aHierarchies[i].getKey()] = aHierarchies[i];
			}
		}
		return this;
	};
	
	GanttChartContainer.prototype.setContainerLayouts = function (aContainerLayouts) {
		this.setProperty("containerLayouts", aContainerLayouts);
		this._oToolbar.setContainerLayouts(aContainerLayouts);
		// build a map for easy look up
		this._oContainerLayoutConfigMap = {};
		if (aContainerLayouts) {
			for (var i = 0; i < aContainerLayouts.length; i++) {
				this._oContainerLayoutConfigMap[aContainerLayouts[i].getKey()] = aContainerLayouts[i];
			}
		}
		if (this.getContainerLayoutKey()) {
			this.switchOrientation(null, true);
		}
		return this;
	};

	GanttChartContainer.prototype.setEnableCursorLine = function (bEnableCursorLine) {
		this.setProperty("enableCursorLine", bEnableCursorLine);
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++) {
			aGanttCharts[i].setEnableCursorLine(bEnableCursorLine);
		}
		this.getAggregation("_toolbar").setEnableCursorLine(bEnableCursorLine);
		return this;
	};

	GanttChartContainer.prototype.setEnableNowLine = function (bEnableNowLine) {
		this.setProperty("enableNowLine", bEnableNowLine);
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++) {
			aGanttCharts[i].setEnableNowLine(bEnableNowLine);
		}
		this.getAggregation("_toolbar").setEnableNowLine(bEnableNowLine);
		return this;
	};

	GanttChartContainer.prototype.setEnableVerticalLine = function (bEnableVerticalLine) {
		this.setProperty("enableVerticalLine", bEnableVerticalLine);
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++) {
			aGanttCharts[i].setEnableVerticalLine(bEnableVerticalLine);
		}
		this.getAggregation("_toolbar").setEnableVerticalLine(bEnableVerticalLine);
		return this;
	};

	GanttChartContainer.prototype.setEnableTimeScrollSync = function (bEnableTimeScrollSync) {
		this.setProperty("enableTimeScrollSync", bEnableTimeScrollSync);
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++) {
			aGanttCharts[i].detachHorizontalScroll(this._onGanttChartHSBScroll, this);
			if (bEnableTimeScrollSync) {
				aGanttCharts[i].attachHorizontalScroll(this._onGanttChartHSBScroll, this);
			}
		}
		this.getAggregation("_toolbar").setEnableTimeScrollSync(bEnableTimeScrollSync);
		return this;
	};
	

	GanttChartContainer.prototype.setEnableRowScrollSync = function (bEnableRowScrollSync) {
		this.setProperty("enableRowScrollSync", bEnableRowScrollSync);
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++){
			aGanttCharts[i].detachVerticalScroll(this._onGanttChartVSBScroll, this);
			if (bEnableRowScrollSync) {
				aGanttCharts[i].attachVerticalScroll(this._onGanttChartVSBScroll, this);
			}
		}
		this.getAggregation("_toolbar").setEnableRowScrollSync(bEnableRowScrollSync);
		return this;
	};

	GanttChartContainer.prototype.setContainerLayoutKey = function (sContainerLayoutKey) {
		if (this.getProperty("containerLayoutKey") === sContainerLayoutKey) {
			return this;
		}
		this.setProperty("containerLayoutKey", sContainerLayoutKey);
		this._oToolbar.setSourceId(sContainerLayoutKey);
		if (this.getContainerLayouts()) {
			this.switchOrientation(null, true);
		}
		return this;
	};

	GanttChartContainer.prototype.setLegendContainer = function (oLegendContainer) {
		this.setAggregation("legendContainer", oLegendContainer);
		if (oLegendContainer){
			this._oToolbar.setLegend(new AssociateContainer({
				content: oLegendContainer.getId()
			}));
		} 
		return this;
	};

	GanttChartContainer.prototype.addCustomToolbarItem = function (oCustomToolbarItem) {
		this._oToolbar.addCustomToolbarItem(oCustomToolbarItem);
	};

	GanttChartContainer.prototype.insertCustomToolbarItem = function (oCustomToolbarItem, iIndex) {
		this._oToolbar.insertCustomToolbarItem(oCustomToolbarItem, iIndex);
	};

	GanttChartContainer.prototype.removeCustomToolbarItem = function (oCustomToolbarItem) {
		this._oToolbar.removeCustomToolbarItem(oCustomToolbarItem);
	};

	GanttChartContainer.prototype.removeAllCustomToolbarItems = function () {
		this._oToolbar.removeAllCustomToolbarItems();
	};

	GanttChartContainer.prototype.addGanttChart = function (oGanttChart) {
		this.addAggregation("ganttCharts", oGanttChart);
		if (oGanttChart) {
			this._insertGanttChart(oGanttChart);
		}
	};

	GanttChartContainer.prototype.insertGanttChart = function (oGanttChart, iIndex) {
		this.insertAggregation("ganttCharts", oGanttChart, iIndex);
		if (oGanttChart) {
			this._insertGanttChart(oGanttChart, iIndex);
		}
	};

	GanttChartContainer.prototype.removeGanttChart = function (vGanttChart) {
		this._removeGanttChart(vGanttChart);
		this.removeAggregation("ganttCharts", vGanttChart);
	};

	GanttChartContainer.prototype.removeAllGanttCharts = function () {
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++) {
			this._removeGanttChart(aGanttCharts[i]);
		}
		this.removeAllAggregation("ganttCharts");
	};

	GanttChartContainer.prototype._insertGanttChart = function (oGanttChart, iIndex) {
		jQuery.sap.measure.start("GanttChartContainer _insertGanttChart","GanttPerf:GanttChartContainer _insertGanttChart function");
		if (!oGanttChart) {
			return;
		}
		// wrap association container
		var oAssociateContainer = new AssociateContainer({
			content: oGanttChart.getId(),
			layoutData: new SplitterLayoutData({
				size: "auto"
			})
		});
		if (iIndex !== 0 && !iIndex) {
			this._oSplitter.addContentArea(oAssociateContainer);
		} else {
			this._oSplitter.insertContentArea(oAssociateContainer, iIndex);
		}
		
		// pass down properties
		var oContainerLayoutConfig = this._oContainerLayoutConfigMap[this.getContainerLayoutKey()];
		var sSelectionPanelSize = oContainerLayoutConfig.getSelectionPanelSize() ?
			oContainerLayoutConfig.getSelectionPanelSize() : "Auto";
		oGanttChart.setSelectionPanelSize(sSelectionPanelSize);
		
		//oView.setTimeZoomRate(this._oToolbar.getZoomRate());
		// attach events
		if (this.getEnableTimeScrollSync()) {
			oGanttChart.attachHorizontalScroll(this._onGanttChartHSBScroll, this);
		}
		//
		if (this.getEnableRowScrollSync()){
			oGanttChart.attachVerticalScroll(this._onGanttChartVSBScroll, this);
		}

		oGanttChart.attachSplitterResize(this._onViewSplitterResize, this);
		oGanttChart.attachGanttChartSwitchRequested(this._onGanttChartSwitchRequested, this);
		oGanttChart.attachChartDragEnter(this._onChartDragEnter, this);
		oGanttChart.attachChartDragLeave(this._onChartDragLeave, this);
		oGanttChart.attachShapeDragEnd(this._onChartDragEnd, this);
		jQuery.sap.measure.end("GanttChartContainer _insertGanttChart");
	};

	GanttChartContainer.prototype._removeGanttChart = function (vGanttChart) {
		var oGanttChart = vGanttChart;
		if ((typeof vGanttChart) === "number") {
			oGanttChart = this.getGanttCharts()[vGanttChart];	
		}
		if (oGanttChart) {
			// remove associated container
			this._oSplitter.removeContentArea(oGanttChart._oAC);
			// detach events
			oGanttChart.detachHorizontalScroll(this._onGanttChartHSBScroll, this);
			oGanttChart.detachVerticalScroll(this._onGanttChartVSBScroll, this);
			oGanttChart.detachSplitterResize(this._onViewSplitterResize, this);
			oGanttChart.detachGanttChartSwitchRequested(this._onGanttChartSwitchRequested, this);
			oGanttChart.detachChartDragEnter(this._onChartDragEnter, this);
			oGanttChart.detachChartDragLeave(this._onChartDragLeave, this);
			oGanttChart.detachShapeDragEnd(this._onChartDragEnd, this);
		}
	};

	GanttChartContainer.prototype.onBeforeRendering = function () {
		this._detachEvents();
		//View switch will initial global toolbar, need to reset the correct setting status to global toolbar
		this._oToolbar.setEnableTimeScrollSync(this.getEnableTimeScrollSync());
		this._oToolbar.setEnableRowScrollSync(this.getEnableRowScrollSync());
		this._oToolbar.setEnableCursorLine(this.getEnableCursorLine());
		this._oToolbar.setEnableNowLine(this.getEnableNowLine());
		this._oToolbar.setEnableVerticalLine(this.getEnableVerticalLine());
		
		var aGanttCharts = this.getGanttCharts();
		// Views need to respect the setting in Gantt, especially when changing
		// hierarchy layout, which triggered binding updated
		for (var i = 0; i < aGanttCharts.length; i++) {
			var oGanttChart = aGanttCharts[i];
			oGanttChart.setEnableCursorLine(this.getEnableCursorLine());
			oGanttChart.setEnableNowLine(this.getEnableNowLine());
			oGanttChart.setEnableVerticalLine(this.getEnableVerticalLine());
		}
	};

	GanttChartContainer.prototype._detachEvents = function () {};

	GanttChartContainer.prototype.onAfterRendering = function () {
		this._attachEvents();
	};

	
	GanttChartContainer.prototype._attachEvents = function () {
	};
	
	GanttChartContainer.prototype._detachToolbarEvents = function () {
		this._oToolbar.detachSourceChange(this._onToolbarSourceChange, this);
		this._oToolbar.detachLayoutChange(this._onToolbarLayoutChange, this);
		this._oToolbar.detachExpandChartChange(this._onToolbarExpandChartChange, this);
		this._oToolbar.detachZoomRateChange(this._onToolbarZoomRateChange, this);
		this._oToolbar.detachSettingsChange(this._onToolbarSettingsChange, this);
	};
	
	GanttChartContainer.prototype._onGanttChartHSBScroll = function(oEvent){
		var fLeftOffsetRate = oEvent.getParameters().leftOffsetRate;
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++){
			if (oEvent.oSource.getId() === aGanttCharts[i].getId()){
				continue;
			}
			aGanttCharts[i].jumpToPosition(fLeftOffsetRate);
		}
	};
	
	GanttChartContainer.prototype._onGanttChartVSBScroll = function(oEvent){
		var nScrollSteps = oEvent.getParameters().scrollSteps;
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++){
			if (oEvent.oSource.getId() === aGanttCharts[i].getId()){
				continue;
			}
			var oNowGanttChart = aGanttCharts[i]._oTC || aGanttCharts[i]._oTT;
			oNowGanttChart._oVSb.setScrollPosition(nScrollSteps);
		}
	};
	
	GanttChartContainer.prototype._onViewSplitterResize = function (oEvent) {
		if (this._oSplitter.getOrientation() === Orientation.Vertical) {
			this._syncSelectionPanelSizeBetweenViews(oEvent);
			this._oToolbar.setZoomInfo(oEvent.getParameter("zoomInfo"));
		}
	};

	GanttChartContainer.prototype._syncSelectionPanelSizeBetweenViews = function (oEvent) {
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++) {
			if (oEvent.oSource.getId() === aGanttCharts[i].getId()) {
				continue;
			}
			aGanttCharts[i].setSelectionPanelSize(oEvent.getParameter("newSizes")[0] + "px", true);
		}
	};

	GanttChartContainer.prototype._onGanttChartSwitchRequested = function (oEvent) {

		oEvent.getSource().notifySourceChange();

		this.fireGanttChartChangeRequested({
			action: "switchGanttChart",
			hierarchyKey: oEvent.getParameter("hierarchyKey"),
			oldHierarchyKey: oEvent.getParameter("oldHierarchyKey"),
			ganttChartIndex: this.getGanttCharts().indexOf(oEvent.getSource())
		});
	};
	
	GanttChartContainer.prototype._onToolbarLayoutChange = function (oEvent){
		var sEventId = oEvent.getParameter("id");
		var oEventValue = oEvent.getParameter("value");
		switch (sEventId) {
			case "orientation":
				this.switchOrientation(oEventValue);
				break;
			case "add":
				this.fireGanttChartChangeRequested({
					action: "addGanttChart",
					hierarchyKey: oEventValue.hierarchyKey
				});
				this._updateGanttChartSize();
				break;
			case "less":
				this.fireGanttChartChangeRequested({
					action: "lessGanttChart",
					hierarchyKey: oEventValue.hierarchyKey,
					ganttChartIndex: oEventValue.ganttChartIndex
				});
				this._updateGanttChartSize();
				break;
			default:
				break;
		}
	};
	
	GanttChartContainer.prototype._updateGanttChartSize = function() {
		var aContents = this._oSplitter.getContentAreas();
		for (var l = 0; l < aContents.length; l++) {
			if (aContents[l].getLayoutData()) {
				if (aContents[l].getLayoutData().getSize() === "auto") {
					aContents[l].getLayoutData().setSize("100%");
				}
				aContents[l].getLayoutData().setSize("auto");
			}
		}
	};

	GanttChartContainer.prototype._onToolbarSourceChange = function (oEvent) {
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++) {
			aGanttCharts[i].notifySourceChange();
		}

		this.setContainerLayoutKey(oEvent.getParameter("id"));
		this.fireGanttChartChangeRequested({
			action: "switchContainerLayout",
			containerLayoutKey: oEvent.getParameter("id")
		});
	};

	GanttChartContainer.prototype._onToolbarExpandChartChange = function (oEvent) {
		var aGanttCharts = this.getGanttCharts();
		for (var i = 0; i < aGanttCharts.length; i++) {
			aGanttCharts[i].expandChartChange(oEvent);
		}
	};

	GanttChartContainer.prototype._onToolbarZoomRateChange = function (oEvent) {
		var aGanttCharts = this.getGanttCharts();
		var i, oGanttChart;
		for (i = 0; i < aGanttCharts.length; i++) {
			oGanttChart = aGanttCharts[i];
			oGanttChart.setTimeZoomRate(oEvent.getParameter("zoomRate"));
		}
		if (this._bInitHorizonApplied) {
			return;
		}
		this._bInitHorizonApplied = true;
		for (i = 0; i < aGanttCharts.length; i++) {
			oGanttChart = aGanttCharts[i];
			oGanttChart.jumpToPosition();
		}
	};
	
	GanttChartContainer.prototype._onChartDragEnter = function (oEvent) {
		//do the following only when the mouse is still down
		var oSourceEvent = oEvent.getParameter("originEvent");
		var oGanttChart = oEvent.getSource();
		if (oSourceEvent.button == 0 && oSourceEvent.buttons !== 0 && this._oDraggingSource !== undefined) {
			oGanttChart.setDraggingData(this._oDraggingSource);
			this._oDraggingSource = undefined;
		}else {
			this._oDraggingSource = undefined;
			oGanttChart.setDraggingData(this._oDraggingSource);
		}
	};
	
	GanttChartContainer.prototype._onChartDragLeave = function (oEvent) {
		var oParam = oEvent.getParameters();
		if (oParam.draggingSource !== undefined) {
			//drag out of chart
			this._oDraggingSource = oParam.draggingSource;
		}else {
			this._oDraggingSource = undefined;
		}
	};
	
	GanttChartContainer.prototype._onChartDragEnd = function (oEvent) {
		this._oDraggingSource = undefined;
	};
	
	GanttChartContainer.prototype._onToolbarSettingsChange = function(oEvent){
		var oParameters = oEvent.getParameters();
		for (var i = 0; i < oParameters.length; i++) {
			switch (oParameters[i].id)	{
				case sap.gantt.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY:
					if (this.getEnableTimeScrollSync() !== oParameters[i].value) {
						this.setEnableTimeScrollSync(oParameters[i].value);
					}
					break;
				case sap.gantt.config.SETTING_ITEM_ROW_SCROLL_SYNC_KEY:
					if (this.getEnableRowScrollSync() !== oParameters[i].value) {
						this.setEnableRowScrollSync(oParameters[i].value);
					}
					break;
				case sap.gantt.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY:
					if (this.getEnableCursorLine() !== oParameters[i].value) {
						this.setEnableCursorLine(oParameters[i].value);
					}
					break;
				case sap.gantt.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY:
					if (this.getEnableNowLine() !== oParameters[i].value) {
						this.setEnableNowLine(oParameters[i].value);
					}
					break;
				case sap.gantt.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY:
					if (this.getEnableVerticalLine() !== oParameters[i].value) {
						this.setEnableVerticalLine(oParameters[i].value);
					}
					break;
				default:
					this.fireCustomSettingChange(oParameters[i]);
			}
		}
		
	};

	/**
	 * Switches the splitter orientation.
	 * 
	 * @param {string} [vOrientation] Target orientation. If not provided, this method inverts the orientation.
	 * @param {boolean} [bReadConfig] If this value is provided, it overrides the target orientation from the current configuration indicated by property <code>containerLayoutKey</code>.
	 * @returns {object} - <code>this</code>
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.switchOrientation = function (vOrientation, bReadConfig) {
		// init target orientation by switch current orientation
		var sOrientation = this._oSplitter.getOrientation() === Orientation.Horizontal ?
				Orientation.Vertical :
				Orientation.Horizontal;
		// over-write target orientation by input
		sOrientation = vOrientation ? vOrientation : sOrientation;
		
		
		if (bReadConfig) { // if bReadConfig, over-write target orientation by config 
			var sContainerLayoutKey = this.getContainerLayoutKey();
			if (this._oContainerLayoutConfigMap[sContainerLayoutKey]) {
				sOrientation = this._oContainerLayoutConfigMap[sContainerLayoutKey].getOrientation();
			}
		} else { // else, reset view ratio to 'auto'
			this._resetSplitterLayoutData(sOrientation);
		}
		
		this._oSplitter.setOrientation(sOrientation);
		
		return this;
	};

	GanttChartContainer.prototype._resetSplitterLayoutData = function (orientation) {
		var aSplitter;
		var aGanttCharts = this.getGanttCharts();
		var aContents = this._oSplitter.getContentAreas();
		for (var l = 0; l < aContents.length; l++) {
			if (aContents[l].getLayoutData()) {
				// to trigger resize of gantt splitter first
				if (aContents[l].getLayoutData().getSize() === "auto") {
					aContents[l].getLayoutData().setSize("100%");
				}
				aContents[l].getLayoutData().setSize("auto");
			}
		}
		for (var i = 0; i < aGanttCharts.length; i++) {
			aSplitter = aGanttCharts[i]._oSplitter;
			var contents = aSplitter.getContentAreas();
			for (var j = 0;j < contents.length; j++) {
				if (contents[j].getLayoutData()) {
					if (orientation === Orientation.Vertical) {
						if (j == 0 && contents.length > 1) {
							contents[j].getLayoutData().setSize("30%");
						} else {
							contents[j].getLayoutData().setSize("auto");
						}
					} else {
						contents[j].getLayoutData().setSize("auto");
					}			
				}
			}
		}
	};
	
	/**
	 * Returns the current effective toolbar scheme key.
	 * 
	 * @returns {string} - Toolbar scheme key.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.getToolbarSchemeKey = function () {
		return this._oToolbar.getToolbarSchemeKey();
	};
	
	/**
	 * Selects in-row shapes and returns a success code.
	 * 
	 * @param {int} [iGanttChart] Index of the Gantt chart containing the shapes that you want to select
	 * @param {array} [aIds] L of the shape IDs that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected shapes are to be deselected
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.selectShapes = function(iGanttChart, aIds, isExclusive) {
		var aGanttCharts = this.getGanttCharts(),
			bRetVal = false,
			oGanttChart;
		
		if (iGanttChart != undefined && iGanttChart < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChart];
			bRetVal = oGanttChart.selectShapes(aIds, isExclusive);
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				if (oGanttChart.selectShapes(aIds, isExclusive)) {
					bRetVal = true;
				}
			}
		}
		return bRetVal;
	};

	/**
	 * Deselects in-row shapes and returns a success code.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the shapes that you want to deselect
	 * @param {array} [aIds] List of the shapes that you want to deselect
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.deselectShapes = function(iGanttChartIndex, aIds) {
		var aGanttCharts = this.getGanttCharts(),
			bRetVal = false,
			oGanttChart;
		
		if (iGanttChartIndex != undefined && iGanttChartIndex < this.getGanttCharts().length) {
			oGanttChart = this.getGanttCharts()[iGanttChartIndex];
			bRetVal = oGanttChart.deselectShapes(aIds);
		}else {
			for (var iGanttChart in aGanttCharts) {
				oGanttChart = aGanttCharts[iGanttChart];
				if (oGanttChart.deselectShapes(aIds)) {
					bRetVal = true;
				}
			}
		}
		return bRetVal;
	};

	/**
	 * Selects relationships and returns a success code.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the relationships that you want to select
	 * @param {array} [aIds] List of the relationships that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected relationships are to be deselected
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.selectRelationships = function(iGanttChartIndex, aIds, isExclusive) {
		var aGanttCharts = this.getGanttCharts(),
			bRetVal = false,
			oGanttChart;
		
		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			bRetVal = oGanttChart.selectRelationships(aIds, isExclusive);
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				if (oGanttChart.selectRelationships(aIds, isExclusive)) {
					bRetVal = true;
				}
			}
		}
		return bRetVal;
	};

	/**
	 * Deselects relationships and returns a success code.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the relationships that you want to deselect
	 * @param {array} [aIds] List of the relationships that you want to deselect
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.deselectRelationships = function(iGanttChartIndex, aIds) {
		var aGanttCharts = this.getGanttCharts(),
			bRetVal = false,
			oGanttChart;

		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			bRetVal = oGanttChart.deselectRelationships(aIds);
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				if (oGanttChart.deselectRelationships(aIds)) {
					bRetVal = true;
				}
			}
		}

		return bRetVal;
	};

	/**
	 * Selects rows and returns a success code.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the rows that you want to select
	 * @param {array} [aIds] List of the rows that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected rows are to be deselected
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.selectRows = function(iGanttChartIndex, aIds, isExclusive) {
		var bRetVal = false,
			aGanttCharts = this.getGanttCharts(),
			oGanttChart;
		
		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			bRetVal = oGanttChart.selectRows(aIds, isExclusive);
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				if (oGanttChart.selectRows(aIds, isExclusive)) {
					bRetVal = true;
				}
			}
		}

		return bRetVal;
	};

	/**
	 * Deselects rows and returns a success code.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the rows that you want to deselect
	 * @param {array} [aIds] List of the rows that you want to deselect
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.deselectRows = function(iGanttChartIndex, aIds) {
		var bRetVal = false,
			aGanttCharts = this.getGanttCharts(),
			oGanttChart;
		
		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			bRetVal = oGanttChart.deselectRows(aIds);
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				if (oGanttChart.deselectRows(aIds)) {
					bRetVal = true;
				}
			}
		}
		return bRetVal;
	};
	
	/**
	 * Selects rows and all shapes contained in these rows.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the rows and shapes that you want to select
	 * @param {array} [aIds] Row UIDs
	 * @param {boolean} [bIsExclusive] Whether reset all other selected rows and shapes are to be reset
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.selectRowsAndShapes = function(iGanttChartIndex, aIds, bIsExclusive) {
		var bRetVal = false,
			aGanttCharts = this.getGanttCharts(),
			oGanttChart;
		
		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			bRetVal = oGanttChart.selectRowsAndShapes(aIds, bIsExclusive);
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				if (oGanttChart.selectRowsAndShapes(aIds, bIsExclusive)) {
					bRetVal = true;
				}
			}
		}
		return bRetVal;
	};

	/**
	 * Gets the selected in-row shapes.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the selected shapes that you want to get
	 * @return {array} Returns all selected shapes in the chart
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.getSelectedShapes = function(iGanttChartIndex) {
		var aRetVal = [],
			aGanttCharts = this.getGanttCharts(),
			oGanttChart,
			oSelectedShapes;
		
		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			oSelectedShapes = oGanttChart.getSelectedShapes();
			if (oSelectedShapes !== undefined) {
				aRetVal.push({"ganttChartIndex": iGanttChartIndex, "selectedShapes": oSelectedShapes});
			}
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				oSelectedShapes = oGanttChart.getSelectedShapes();
				if (oSelectedShapes !== undefined) {
					aRetVal.push({"ganttChartIndex": i, "selectedShapes": oSelectedShapes});
				}
			}
		}
		
		return aRetVal;
	};

	/**
	 * Gets the selected rows.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the selected rows that you want to get
	 * @return {array} Returns all selected rows
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.getSelectedRows = function(iGanttChartIndex) {
		var aRetVal = [],
			aGanttCharts = this.getGanttCharts(),
			oGanttChart, aRows;
		
		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			aRows = oGanttChart.getSelectedRows();
			if (aRows !== undefined && aRows.length > 0) {
				aRetVal.push({"ganttChartIndex": iGanttChartIndex, "selectedRows": aRows});
			}
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				aRows = oGanttChart.getSelectedRows();
				if (aRows !== undefined) {
					aRetVal.push({"ganttChartIndex": i, "selectedRows": aRows});
				}
			}
		}
		
		return aRetVal;
	};
	
	/**
	 * Gets the selected relationships.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing the selected relationships that you want to get
	 * @return {array} Returns all selected relationships in the chart
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.getSelectedRelationships = function(iGanttChartIndex) {
		var aRetVal = [],
			aGanttCharts = this.getGanttCharts(),
			oGanttChart, aRelationships;

		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			aRelationships = oGanttChart.getSelectedRelationships();
			if (aRelationships !== undefined) {
				aRetVal.push({"ganttChartIndex": iGanttChartIndex, "selectedRelationships": aRelationships});
			}
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				aRelationships = oGanttChart.getSelectedRelationships();
				if (aRelationships !== undefined) {
					aRetVal.push({"ganttChartIndex": i, "selectedRelationships": aRelationships});
				}
			}
		}
		
		return aRetVal;
	};
	
	/**
	 * Gets all selected rows and shapes, including relationships.
	 * 
	 * @param {int} [iGanttChartIndex] Index of the Gantt chart containing that you want to get
	 * @return {object} The returned object contains "rows" for all selected rows, "shapes" for all selected shapes, and "relationships" for all selected relationships
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GanttChartContainer.prototype.getAllSelections = function(iGanttChartIndex) {
		var aRetVal = [],
			aGanttCharts = this.getGanttCharts(),
			oGanttChart, oSelections;
		
		if (iGanttChartIndex != undefined && iGanttChartIndex < aGanttCharts.length) {
			oGanttChart = aGanttCharts[iGanttChartIndex];
			oSelections = oGanttChart.getAllSelections();
			if (oSelections !== undefined) {
				aRetVal.push({"ganttChartIndex": iGanttChartIndex, "allSelection": oSelections});
			}
		}else {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oGanttChart = aGanttCharts[i];
				oSelections = oGanttChart.getAllSelections();
				if (oSelections !== undefined) {
					aRetVal.push({"ganttChartIndex": i, "allSelection": oSelections});
				}
			}
		}
		
		return aRetVal;
	};

	GanttChartContainer.prototype.exit = function () {
		this._detachEvents();
		this._oToolbar.destroy();
		this._oSplitter.destroy();
	};

	return GanttChartContainer;
}, true);
