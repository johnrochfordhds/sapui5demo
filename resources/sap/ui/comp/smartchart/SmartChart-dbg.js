/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartchart.SmartChart.
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/library', 'sap/chart/Chart', 'sap/chart/library', 'sap/chart/data/Dimension', 'sap/chart/data/Measure', 'sap/m/ToggleButton', 'sap/m/Button', 'sap/m/Text', 'sap/m/ComboBox', 'sap/m/ComboBoxRenderer', 'sap/m/FlexItemData', 'sap/ui/core/Item', 'sap/m/OverflowToolbar', 'sap/m/OverflowToolbarButton', 'sap/m/ToolbarSeparator', 'sap/m/ToolbarDesign', 'sap/m/ToolbarSpacer', 'sap/m/VBox', 'sap/m/VBoxRenderer', 'sap/ui/comp/providers/ChartProvider', 'sap/ui/comp/smartfilterbar/FilterProvider', 'sap/ui/comp/smartvariants/SmartVariantManagement', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator', 'sap/ui/comp/personalization/Util', 'sap/ui/Device', 'sap/ui/comp/odata/ODataModelUtil'
], function(jQuery, library, Chart, ChartLibrary, Dimension, Measure, ToggleButton, Button, Text, ComboBox, ComboBoxRenderer, FlexItemData, Item, OverflowToolbar, OverflowToolbarButton, ToolbarSeparator, ToolbarDesign, ToolbarSpacer, VBox, VBoxRenderer, ChartProvider, FilterProvider, SmartVariantManagement, Filter, FilterOperator, PersoUtil, Device, ODataModelUtil) {
	"use strict";

	/**
	 * Constructor for a new smartchart/SmartChart.
	 * 
	 * @param {string} [sId] ID for the new control that is generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class The SmartChart control creates a chart based on OData metadata and the configuration specified. The entitySet property must be specified
	 *        to use the control. This property is used to fetch fields from OData metadata, from which the chart UI will be generated. It can also be
	 *        used to fetch the actual chart data.<br>
	 *        Based on the chartType property, this control will render the corresponding chart.<br>
	 *        <b>Note:</b> Most of the attributes are not dynamic and cannot be changed once the control has been initialized.
	 * @extends sap.m.VBox
	 * @author Franz Mueller, Pavan Nayak
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartchart.SmartChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartChart = VBox.extend("sap.ui.comp.smartchart.SmartChart", /** @lends sap.ui.comp.smartchart.SmartChart.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * The entity set name from which to fetch data and generate the columns.<br>
				 * <b>Note</b> This is not a dynamic property.
				 */
				entitySet: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * ID of the corresponding SmartFilter control. If specified, the SmartChart control searches for the SmartFilter control (also in the
				 * closest parent view) and attaches to the relevant events of the SmartFilter control to fetch data, show overlay etc.
				 */
				smartFilterId: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * CSV of fields that must be ignored in the OData metadata by the SmartChart control.<br>
				 * <b>Note:</b> No validation is done. Please ensure that you do not add spaces or special characters.
				 */
				ignoredFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * CSV of fields that must be always requested by the backend system.<br>
				 * This property is mainly meant to be used if there is no PresentationVariant annotation.<br>
				 * If both this property and the PresentationVariant annotation exist, the select request sent to the backend would be a combination
				 * of both.<br>
				 * <b>Note:</b> No validation is done. Please ensure that you do not add spaces or special characters.
				 */
				requestAtLeastFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * CSV of fields that is not shown in the personalization dialog.<br>
				 * <b>Note:</b> No validation is done. Please ensure that you do not add spaces or special characters.
				 */
				ignoreFromPersonalisation: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specifies the type of chart to be created by the SmartChart control.
				 */
				chartType: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * CSV of fields that is not shown in the list of available chart types.<br>
				 * <b>Note:</b> No validation is done. Please ensure that you do not add spaces or special characters.
				 */
				ignoredChartTypes: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If set to <code>true</code>, variants are used. As a prerequisite, you need to specify the persistencyKey property.
				 */
				useVariantManagement: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * If set to <code>true</code>, personalized chart settings are defined. If you want to persist the chart personalization, you need
				 * to specify the persistencyKey property.
				 */
				useChartPersonalisation: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Specifies header text that is shown in the chart.
				 */
				header: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Key used to access personalization data.
				 */
				persistencyKey: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Retrieves or applies the current variant.
				 */
				currentVariantId: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If set to <code>true</code>, this enables automatic binding of the chart using the chartBindingPath (if it exists) or entitySet
				 * property. This happens right after the <code>initialise</code> event has been fired.
				 */
				enableAutoBinding: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Specifies the path that is used during the binding of the chart. If not specified, the entitySet property is used instead. (used
				 * only if binding is established internally/automatically - See enableAutoBinding)
				 */
				chartBindingPath: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Controls the visibility of the Drill Up and Drill Down buttons.
				 */
				showDrillButtons: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Controls the visibility of the Zoom In and Zoom Out buttons.
				 * 
				 * @since 1.36
				 */
				showZoomButtons: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Controls the visibility of the Navigation button
				 * 
				 * @since 1.36
				 */
				showSemanticNavigationButton: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Controls the visibility of the Navigation button
				 * 
				 * @since 1.36
				 */
				showLegendButton: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Set chart's legend properties.
				 * 
				 * @since 1.36
				 */
				legendVisible: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Chart selection mode. Supported values are {@link sap.chart.SelectionMode.Single} or {@link sap.chart.SelectionMode.Multi}, case
				 * insensitive, always return in upper case. Unsupported values will be ignored.
				 * 
				 * @since 1.36
				 */
				selectionMode: {
					type: "sap.chart.SelectionMode",
					group: "Misc",
					defaultValue: sap.chart.SelectionMode.Single
				},

				/**
				 * Controls the visibility of the FullScreen button.
				 * 
				 * @since 1.36
				 */
				showFullScreenButton: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Controls the usage either of the tooltip or the popover. If set to <code>true</code>, a tooltip will be displayed.
				 * 
				 * @since 1.36
				 */
				useTooltip: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				}
			},
			aggregations: {

				/**
				 * A toolbar that can be added by the user to define their own custom buttons, icons, etc. If this is specified, the SmartChart
				 * control does not create an additional toolbar, but uses this one.
				 */
				toolbar: {
					type: "sap.m.Toolbar",
					multiple: false
				},

				/**
				 * The Semantic Object Controller allows the user to specify and overwrite functionality for semantic object navigation.
				 * 
				 * @since 1.36
				 */
				semanticObjectController: {
					type: "sap.ui.comp.navpopover.SemanticObjectController",
					multiple: false
				}
			},
			events: {

				/**
				 * This event is fired once the control has been initialized.
				 */
				initialise: {},

				/**
				 * This event is fired right before the binding is done.
				 * 
				 * @param {object} [bindingParams] The bindingParams object contains filters, sorters, and other binding-related information for the
				 *        chart
				 * @param {boolean} [bindingParams.preventChartBind] If set to <code>true</code> by the listener, binding is prevented
				 * @param {object} [bindingParams.filters] The combined filter array containing a set of sap.ui.model.Filter instances of the
				 *        SmartChart and SmartFilter controls; can be modified by users to influence filtering
				 * @param {object} [bindingParams.sorter] An array containing a set of sap.ui.model.Sorter instances of the SmartChart control
				 *        (personalization); can be modified by users to influence sorting
				 */
				beforeRebindChart: {},

				/**
				 * This event is fired when data is received after binding. This event is fired if the binding for the chart is done by the SmartChart
				 * control itself.
				 */
				dataReceived: {},

				/**
				 * This event is fired after the variant management in the SmartChart control has been initialized.
				 */
				afterVariantInitialise: {},

				/**
				 * This event is fired after a variant has been saved. This event can be used to retrieve the ID of the saved variant.
				 * 
				 * @param {string} [currentVariantId] ID of the currently selected variant
				 */
				afterVariantSave: {},

				/**
				 * This event is fired after a variant has been applied.
				 * 
				 * @param {string} [currentVariantId] ID of the currently selected variant
				 */
				afterVariantApply: {},

				/**
				 * This event is fired right before the overlay is shown.
				 * 
				 * @param {object} [overlay] Overlay object that contains information related to the overlay of the chart
				 * @param {boolean} [overlay.show] If set to code>false</code> by the listener, overlay is not shown
				 */
				showOverlay: {}
			}
		},

		renderer: VBoxRenderer.render
	});

	SmartChart.prototype.init = function() {
		sap.m.FlexBox.prototype.init.call(this);
		this.addStyleClass("sapUiCompSmartChart");
		this.setFitContainer(true);
		this._bUpdateToolbar = true;
		this._oChartTypeModel = null;

		this.setHeight("100%");

		var oModel = new sap.ui.model.json.JSONModel({
			items: []
		});
		this.setModel(oModel, "$smartChartTypes");

		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");

		this.sResizeListenerId = null;
		if (Device.system.desktop) {
			this.sResizeListenerId = sap.ui.core.ResizeHandler.register(this, jQuery.proxy(this._adjustHeight, this));
		} else {
			Device.orientation.attachHandler(this._adjustHeight, this);
			Device.resize.attachHandler(this._adjustHeight, this);
		}

	};

	/**
	 * instantiates the SmartVariantManagementControl
	 * 
	 * @private
	 */
	SmartChart.prototype._createVariantManagementControl = function() {

		// Do not create variant management when it is not needed!
		if (this._oVariantManagement || (!this.getUseVariantManagement() && !this.getUseChartPersonalisation()) || !this.getPersistencyKey()) {
			return;
		}

		// always create VariantManagementControl, in case it is not used, it will take care of persisting the personalisation
		// without visualization

		var oPersInfo = new sap.ui.comp.smartvariants.PersonalizableInfo({
			type: "chart",
			keyName: "persistencyKey",
			dataSource: "TODO"
		});

		oPersInfo.setControl(this);

		this._oVariantManagement = new SmartVariantManagement({
			personalizableControls: oPersInfo,
			initialise: function(oEvent) {
				// Current variant could have been set already (before initialise) by the SmartVariant, in case of GLO/Industry specific variant
				// handling
				if (!this._oCurrentVariant) {
					this._oCurrentVariant = "STANDARD";
				}
				this.fireAfterVariantInitialise();
			}.bind(this),
			save: function(oEvent) {
				this._variantSaved();
			}.bind(this),
			afterSave: function() {
				this.fireAfterVariantSave({
					currentVariantId: this.getCurrentVariantId()
				});
			}.bind(this),
			showShare: false
		});
		this._oVariantManagement.initialise();
	};

	/**
	 * event handler for variantmanagement save event
	 * 
	 * @private
	 */
	SmartChart.prototype._variantSaved = function() {
		if (this._oPersController) {
			this._oPersController.setPersonalizationData(this._oCurrentVariant);
		}
	};

	SmartChart.prototype.setUseChartPersonalisation = function(bUseChartPersonalisation) {
		this.setProperty("useChartPersonalisation", bUseChartPersonalisation, true);
		this._bUpdateToolbar = true;
	};

	SmartChart.prototype._createPopover = function() {
		if (!this._oPopover && this._oChart) {
			// assign Popover to chart
			jQuery.sap.require("sap.viz.ui5.controls.Popover");
			this._oPopover = new sap.viz.ui5.controls.Popover({});
			this._oPopover.connect(this._oChart.getVizUid());
		}
	};

	SmartChart.prototype._createTooltip = function() {
		if (this._oChart) {
			this._oChart.setVizProperties({
				"interaction": {
					"behaviorType": null
				},
				"tooltip": {
					"visible": true
				}
			});
		}
	};

	SmartChart.prototype._createTooltipOrPopover = function() {
		if (this.getUseTooltip()) {
			this._createTooltip();
		} else {
			this._createPopover();
		}
	};

	SmartChart.prototype._destroyPopover = function() {
		if (this._oPopover) {
			this._oPopover.destroy();
			this._oPopover = null;
		}
	};

	SmartChart.prototype.setUseVariantManagement = function(bUseVariantManagement) {
		this.setProperty("useVariantManagement", bUseVariantManagement, true);
		if (this._oPersController) {
			this._oPersController.setResetToInitialTableState(!bUseVariantManagement);
		}
		this._bUpdateToolbar = true;
	};

	SmartChart.prototype.setToolbar = function(oToolbar) {
		if (this._oToolbar) {
			this.removeItem(this._oToolbar);
		}
		this._oToolbar = oToolbar;
		this._bUpdateToolbar = true;
	};

	SmartChart.prototype.getToolbar = function() {
		return this._oToolbar;
	};

	SmartChart.prototype.setHeader = function(sText) {
		this.setProperty("header", sText, true);
		this._refreshHeaderText();
	};

	/**
	 * sets the header text
	 * 
	 * @private
	 */
	SmartChart.prototype._refreshHeaderText = function() {
		if (!this._headerText) {
			this._bUpdateToolbar = true;
			return;
		}
		var sText = this.getHeader();
		this._headerText.setText(sText);
	};

	/**
	 * creates the toolbar
	 * 
	 * @private
	 */
	SmartChart.prototype._createToolbar = function() {
		// If no toolbar exists --> create one
		if (!this._oToolbar) {
			this._oToolbar = new OverflowToolbar({
				design: ToolbarDesign.Transparent
			});
			this._oToolbar.addStyleClass("sapUiCompSmartChartToolbar");
		}
		this._oToolbar.setLayoutData(new sap.m.FlexItemData({
			shrinkFactor: 0
		}));
		this.insertItem(this._oToolbar, 0);
	};

	/**
	 * creates the toolbar content
	 * 
	 * @private
	 */
	SmartChart.prototype._createToolbarContent = function() {
		// insert the items in the custom toolbar in reverse order => insert always at position 0
		this._addVariantManagementToToolbar();
		this._addSeparatorToToolbar();
		this._addHeaderToToolbar();

		// add spacer to toolbar
		this._addSpacerToToolbar();

		this._addSemanticNavigationButton();

		// Add chart type selection
		this._addChartTypeToToolbar();

		// Add Drill buttons
		this._addDrillUpDownButtons();

		// Add Legend button
		this._addLegendButton();

		// Add Zoom buttons
		this._addZoomInOutButtons();

		// Add Personalisation Icon
		this._addPersonalisationToToolbar();

		// Add Fullscreen Button
		this._addFullScrrenButton();

		// seems like toolbar only contains spacer and is actually not needed - remove it
		if (this._oToolbar && (this._oToolbar.getContent().length === 0 || (this._oToolbar.getContent().length === 1 && this._oToolbar.getContent()[0] instanceof ToolbarSpacer))) {
			this.removeItem(this._oToolbar);
			this._oToolbar.destroy();
			this._oToolbar = null;
		}
	};

	SmartChart.prototype._addFullScrrenButton = function() {
		var oFullScreenButton, that = this;
		if (this.getShowFullScreenButton()) {
			oFullScreenButton = new OverflowToolbarButton(this.getId() + "-btnFullScreen", {
				press: function() {
					that.setFullScreen(!that.bFullScreen);
				}
			});
			this.oFullScreenButton = oFullScreenButton;
			this.setFullScreen(this.bFullScreen, true);
			this._oToolbar.addContent(oFullScreenButton);
		}
	};

	SmartChart.prototype._addZoomInOutButtons = function() {

		var that = this;
		this._oZoomInButton = new OverflowToolbarButton(this.getId() + "-btnZoomIn", {
			tooltip: this._oRb.getText("CHART_ZOOMINBTN_TOOLTIP"),
			icon: "sap-icon://zoom-in",
			press: function() {
				if (that._oChart) {
					that._oChart.zoom({
						direction: "in"
					});
				}
			},
			visible: this.getShowZoomButtons()
		});

		this._oZoomOutButton = new OverflowToolbarButton(this.getId() + "-btnZoomOut", {
			tooltip: this._oRb.getText("CHART_ZOOMOUTBTN_TOOLTIP"),
			icon: "sap-icon://zoom-out",
			press: function() {
				if (that._oChart) {
					that._oChart.zoom({
						direction: "out"
					});
				}
			},
			visible: this.getShowZoomButtons()
		});

		this._oToolbar.addContent(this._oZoomInButton);
		this._oToolbar.addContent(this._oZoomOutButton);
	};

	SmartChart.prototype.setShowZoomButtons = function(bFlag) {

		this.setProperty("showZoomButtons", bFlag);

		if (this._oZoomInButton) {
			this._oZoomInButton.setVisible(bFlag);
		}
		if (this._oZoomOutButton) {
			this._oZoomOutButton.setVisible(bFlag);
		}
	};

	SmartChart.prototype.setLegendVisible = function(bFlag) {

		this.setProperty("legendVisible", bFlag);

		this._setLegendVisible(bFlag);
	};

	SmartChart.prototype._setLegendVisible = function(bFlag) {

		var oVizFrame = this._getVizFrame();
		if (oVizFrame) {
			oVizFrame.setLegendVisible(bFlag);
		}

	};

	SmartChart.prototype._getVizFrame = function() {

		var oVizFrame = null;
		if (this._oChart) {
			oVizFrame = this._oChart.getAggregation("_vizFrame");
		}

		return oVizFrame;
	};

	SmartChart.prototype._addLegendButton = function() {

		var that = this;
		this._oLegendButton = new OverflowToolbarButton(this.getId() + "-btnLegend", {
			tooltip: this._oRb.getText("CHART_LEGENDBTN_TOOLTIP"),
			icon: "sap-icon://legend",
			press: function() {
				that.setLegendVisible(!that.getLegendVisible());
			},
			visible: this.getShowLegendButton()
		});

		this._oToolbar.addContent(this._oLegendButton);
	};

	SmartChart.prototype.setShowLegendButton = function(bFlag) {

		this.setProperty("showLegendButton", bFlag);

		if (this._oLegendButton) {
			this._oLegendButton.setVisible(bFlag);
		}
	};

	SmartChart.prototype.setShowSemanticNavigationButton = function(bFlag) {

		this.setProperty("showSemanticNavigationButton", bFlag);

		if (this._oSemanticalNavButton) {
			this._oSemanticalNavButton.setVisible(bFlag);
		} else {
			/* eslint-disable no-lonely-if */
			if (bFlag) {
				this._addSemanticNavigationButton();
			}
			/* eslint-enable no-lonely-if */
		}
	};

	SmartChart.prototype._addSemanticNavigationButton = function() {
		var that = this, aSemanticObjects;

		if (!this._oSemanticalNavButton && this.getShowSemanticNavigationButton()) {
			this._oSemanticalNavButton = new Button(this.getId() + "-btnNavigation", {
				text: this._oRb.getText("CHART_SEMNAVBTN"),
				tooltip: this._oRb.getText("CHART_SEMNAVBTN_TOOLTIP"),
				visible: this.getShowSemanticNavigationButton(),
				enabled: false
			});

			jQuery.sap.require("sap.ui.comp.navpopover.NavigationPopoverHandler");

			var oNavHandler = new sap.ui.comp.navpopover.NavigationPopoverHandler({
				control: this._oSemanticalNavButton
			});

			var oSemanticObjectController = this.getSemanticObjectController();
			if (oSemanticObjectController) {
				oNavHandler.setSemanticObjectController(oSemanticObjectController);
			}

			this._oSemanticalNavButton.attachPress(function(oEvent) {

				if (aSemanticObjects && (aSemanticObjects.length > 0)) {

					if (aSemanticObjects.length === 1) {
						oNavHandler.setSemanticObject(aSemanticObjects[0].name);
						oNavHandler.setSemanticObjectLabel(aSemanticObjects[0].fieldLabel);

						oNavHandler._handlePressed(oEvent);
					} else {
						that._semanticObjectList(aSemanticObjects, oNavHandler);
					}
				}
			});

			if (this._oChart) {

				this._oChart.attachDeselectData(function(oEvent) {
					aSemanticObjects = that._setSelectionDataPointHandling(oNavHandler);
				});

				this._oChart.attachSelectData(function(oEvent) {
					aSemanticObjects = that._setSelectionDataPointHandling(oNavHandler);
				});
			}

			var iSpacerIdx = this._indexOfSpacerOnToolbar();
			this._oToolbar.insertContent(this._oSemanticalNavButton, iSpacerIdx + 1);
		}
	};

	SmartChart.prototype._setSelectionDataPointHandling = function(oNavHandler) {
		var aSemanticObjects = this._setSelectionDataPoint(oNavHandler);
		if (aSemanticObjects && aSemanticObjects.length > 0) {
			this._oSemanticalNavButton.setEnabled(true);
		} else {
			this._oSemanticalNavButton.setEnabled(false);
		}

		return aSemanticObjects;
	};

	SmartChart.prototype._setSelectionDataPoint = function(oNavHandler) {
		var oDataContext, oData, aSemanticObjects = null, aDataContext;

		var aSelectedDataPoints = this._oChart.getSelectedDataPoints();

		if (!aSelectedDataPoints || !aSelectedDataPoints.dataPoints || (aSelectedDataPoints.dataPoints.length === 0)) {
			return aSemanticObjects;
		}

		if (aSelectedDataPoints.dataPoints.length === 1) {
			oDataContext = aSelectedDataPoints.dataPoints[0].context;
			if (oDataContext) {
				oData = oDataContext.getObject();

				if (oData) {
					aSemanticObjects = this._determineSemanticObjects(oData, oDataContext);
					if (aSemanticObjects && (aSemanticObjects.length > 0)) {
						oNavHandler.setBindingContext(oDataContext);
					}
				}
			}

			return aSemanticObjects;
		}

		aDataContext = [];
		for (var i = 0; i < aSelectedDataPoints.dataPoints.length; i++) {
			oDataContext = aSelectedDataPoints.dataPoints[i].context;
			if (oDataContext) {
				oData = oDataContext.getObject();

				if (oData) {
					aDataContext.push(oData);
				}
			}
		}

		if (aDataContext && aDataContext.length > 0) {
			aSemanticObjects = this._condensBasedOnSameValue(aDataContext);
			if (aSemanticObjects && aSemanticObjects.length > 0) {
				oNavHandler.setBindingContext(aSelectedDataPoints.dataPoints[aSelectedDataPoints.dataPoints.length - 1].context);
			}
		}

		return aSemanticObjects;
	};

	SmartChart.prototype._condensBasedOnSameValue = function(aData) {

		var aSemObj = null, aResultSemObj, oSemObj, sName;

		// expectation: all datapoint have the same semantical objects
		aSemObj = this._determineSemanticObjects(aData[0]);

		if (aSemObj && aSemObj.length > 0) {
			for (var i = 0; i < aSemObj.length; i++) {
				oSemObj = aSemObj[i];
				sName = oSemObj.name;

				if (this._bAllValuesAreEqual(aData, sName)) {
					if (!aResultSemObj) {
						aResultSemObj = [];
					}

					aResultSemObj.push(oSemObj);
				}
			}

			aSemObj = aResultSemObj;
		}

		return aSemObj;
	};

	SmartChart.prototype._bAllValuesAreEqual = function(aData, sFieldName) {
		var oData, sValue;
		for (var i = 0; i < aData.length; i++) {
			oData = aData[i];

			if (i === 0) {
				sValue = oData[sFieldName];
				continue;
			}

			if (sValue != oData[sFieldName]) {
				return false;
			}
		}

		return true;
	};

	SmartChart.prototype._semanticObjectList = function(aSemanticObjects, oNavHandler) {
		jQuery.sap.require("sap.m.List");
		jQuery.sap.require("sap.m.ListType");
		jQuery.sap.require("sap.m.PlacementType");
		jQuery.sap.require("sap.m.StandardListItem");
		jQuery.sap.require("sap.m.ResponsivePopover");

		var oPopover, oList, oListItem, oSemanticObject;

		if (this._oChart) {

			oList = new sap.m.List({
				mode: sap.m.ListMode.SingleSelectMaster,
				selectionChange: function(oEvent) {
					if (oEvent && oEvent.mParameters && oEvent.mParameters.listItem) {
						oSemanticObject = oEvent.mParameters.listItem.data("semObj");
						if (oSemanticObject) {
							oNavHandler.setSemanticObject(oSemanticObject.name);
							oNavHandler.setSemanticObjectLabel(oSemanticObject.fieldLabel);

							oNavHandler._handlePressed(oEvent);
						}
					}

					oPopover.close();
				}
			});

			for (var i = 0; i < aSemanticObjects.length; i++) {
				oSemanticObject = aSemanticObjects[i];
				oListItem = new sap.m.StandardListItem({
					title: oSemanticObject.fieldLabel,
					type: sap.m.ListType.Active
				});

				oListItem.data("semObj", oSemanticObject);
				oList.addItem(oListItem);
			}

			oPopover = new sap.m.ResponsivePopover({
				title: this._oRb.getText("CHART_SEMNAVBTN"),
				showHeader: false,
				contentWidth: "12rem",
				placement: sap.m.PlacementType.Left
			});

			oPopover.addContent(oList);

			oPopover.openBy(this._oSemanticalNavButton);
		}
	};

	SmartChart.prototype._determineSemanticObjects = function(mData, oDataContext) {
		var n, oField, aSematicObjects = [];
		if (mData) {
			for (n in mData) {
				if (n) {
					oField = this._getField(n);
					if (oField && oField.isDimension && oField.isSemanticObject) {
						aSematicObjects.push(oField);
					}
				}
			}
		}

		if (aSematicObjects) {
			aSematicObjects.sort(function(a, b) {
				return a.fieldLabel.localeCompare(b.fieldLabel);
			});
		}

		return aSematicObjects;
	};

	SmartChart.prototype._checkSemanticNavigationButton = function(bFlag) {

		if (this._oSemanticalNavButton) {
			this._oSemanticalNavButton.setEnabled(bFlag);
		}
	};

	SmartChart.prototype._addDrillUpDownButtons = function() {

		var that = this;

		this._oDrillUpButton = new OverflowToolbarButton(this.getId() + "-btnDrillUp", {
			tooltip: this._oRb.getText("CHART_DRILLUPBTN_TOOLTIP"),
			icon: "sap-icon://drill-up",
			press: function() {
				if (that._oChart) {
					that._oChart.drillUp();
				}
			},
			visible: this.getShowDrillButtons()
		});

		this._oDrillDownButton = new OverflowToolbarButton(this.getId() + "-btnDrillDown", {
			tooltip: this._oRb.getText("CHART_DRILLDOWNBTN_TOOLTIP"),
			icon: "sap-icon://drill-down",
			press: function(oEvent) {
				that._drillDown(oEvent);
			},
			visible: this.getShowDrillButtons()
		});

		this._oToolbar.addContent(this._oDrillUpButton);
		this._oToolbar.addContent(this._oDrillDownButton);
	};

	SmartChart.prototype.setShowDrillButtons = function(bFlag) {

		this.setProperty("showDrillButtons", bFlag);

		if (this._oDrillUpButton) {
			this._oDrillUpButton.setVisible(bFlag);
		}
		if (this._oDrillDownButton) {
			this._oDrillDownButton.setVisible(bFlag);
		}
	};

	SmartChart.prototype._triggerSearchInPopover = function(oEvent, oList) {

		var parameters, i, sTitle, sTooltip, sValue, aItems;

		if (!oEvent || !oList) {
			return;
		}

		parameters = oEvent.getParameters();
		if (!parameters) {
			return;
		}

		sValue = parameters.newValue ? parameters.newValue.toLowerCase() : "";

		if (this._oChart) {
			aItems = oList.getItems();
			for (i = 0; i < aItems.length; i++) {

				sTooltip = aItems[i].getTooltip();
				sTitle = aItems[i].getTitle();

				if ((sTitle && (sTitle.toLowerCase().indexOf(sValue) > -1)) || (sTooltip && (sTooltip.toLowerCase().indexOf(sValue) > -1))) {
					aItems[i].setVisible(true);
				} else {
					aItems[i].setVisible(false);
				}
			}
		}
	};

	SmartChart.prototype._drillDown = function(oEvent) {
		jQuery.sap.require("sap.m.Bar");
		jQuery.sap.require("sap.m.List");
		jQuery.sap.require("sap.m.ListType");
		jQuery.sap.require("sap.m.SearchField");
		jQuery.sap.require("sap.m.PlacementType");
		jQuery.sap.require("sap.m.StandardListItem");
		jQuery.sap.require("sap.m.ResponsivePopover");

		var that = this, oPopover, aIgnoreDimensions, aDimensions, oDimension, oListItem, oList, oSubHeader, oSearchField, i, sTooltip;

		if (this._oChart) {

			oList = new sap.m.List({
				mode: sap.m.ListMode.SingleSelectMaster,
				selectionChange: function(oEvent) {
					if (oEvent && oEvent.mParameters && oEvent.mParameters.listItem) {

						if (oEvent.mParameters.listItem.getType() === sap.m.ListType.Inactive) {
							return;
						}

						var oDimension = oEvent.mParameters.listItem.data("dim");
						if (oDimension) {
							that._oChart.drillDown(oDimension);
						}
					}

					oPopover.close();
				}
			});

			oSubHeader = new sap.m.Bar();
			oSearchField = new sap.m.SearchField({
				placeholder: this._oRb.getText("CHART_DRILLDOWN_SEARCH")
			});
			oSearchField.attachLiveChange(function(oEvent) {
				that._triggerSearchInPopover(oEvent, oList);
			});
			oSubHeader.addContentRight(oSearchField);

			oPopover = new sap.m.ResponsivePopover({
				title: this._oRb.getText("CHART_DRILLDOWN_TITLE"),
				contentWidth: "25rem",
				contentHeight: "20rem",
				placement: sap.m.PlacementType.Bottom,
				subHeader: oSubHeader
			});

			oPopover.addContent(oList);

			aIgnoreDimensions = this._oChart.getVisibleDimensions();
			aDimensions = this._getSortedDimensions();

			if (aDimensions.length < 7) {
				oSubHeader.setVisible(false);
			}

			for (i = 0; i < aDimensions.length; i++) {

				if (aIgnoreDimensions.indexOf(aDimensions[i].getName()) > -1) {
					continue;
				}

				oDimension = aDimensions[i];
				oListItem = new sap.m.StandardListItem({
					title: oDimension.getLabel(),
					type: sap.m.ListType.Active
				});

				oListItem.data("dim", oDimension);

				sTooltip = this._getFieldTooltip(oDimension.name);
				if (sTooltip) {
					oListItem.setTooltip(sTooltip);
				}

				if (aIgnoreDimensions.indexOf(aDimensions[i].getName()) > -1) {
					oListItem.setType(sap.m.ListType.Inactive);
				}

				oList.addItem(oListItem);
			}

			oPopover.openBy(oEvent.getSource());
		}
	};

	/**
	 * adds the header line to the toolbar
	 * 
	 * @private
	 */
	SmartChart.prototype._addHeaderToToolbar = function() {
		if (this.getHeader()) {
			if (!this._headerText) {
				this._headerText = new Text();
				this._headerText.addStyleClass("sapMH4Style");
				this._headerText.addStyleClass("sapUiCompSmartChartHeader");
			}
			this._refreshHeaderText();
			this._oToolbar.insertContent(this._headerText, 0);
		} else if (this._headerText) {
			this._oToolbar.removeContent(this._headerText);
		}
	};

	/**
	 * adds a separator between header and variantmanagement to the toolbar
	 * 
	 * @private
	 */
	SmartChart.prototype._addSeparatorToToolbar = function() {
		if (this.getHeader() && this.getUseVariantManagement()) {
			this._oSeparator = new ToolbarSeparator();
			this._oToolbar.insertContent(this._oSeparator, 0);
			// Also set the height to 3rem when no height is explicitly specified
			if (!this._oToolbar.getHeight()) {
				this._oToolbar.setHeight("3rem");
			}
		} else if (this._oSeparator) {
			this._oToolbar.removeContent(this._oSeparator);
		}
	};

	/**
	 * adds the VarientManagement to the toolbar
	 * 
	 * @private
	 */
	SmartChart.prototype._addVariantManagementToToolbar = function() {
		if (this.getUseVariantManagement()) {
			this._oToolbar.insertContent(this._oVariantManagement, 0);
		} else if (this._oVariantManagement) {
			this._oToolbar.removeContent(this._oVariantManagement);
		}
	};

	/**
	 * adds a spacer to the toolbar
	 * 
	 * @private
	 */
	SmartChart.prototype._addSpacerToToolbar = function() {
		if (this._indexOfSpacerOnToolbar() === -1) {
			this._oToolbar.addContent(new ToolbarSpacer());
		}
	};

	SmartChart.prototype._indexOfSpacerOnToolbar = function() {
		var aItems = this._oToolbar.getContent(), i, iLength;
		if (aItems) {
			iLength = aItems.length;
			i = 0;
			for (i; i < iLength; i++) {
				if (aItems[i] instanceof ToolbarSpacer) {
					return i;
				}
			}
		}

		return -1;
	};

	/**
	 * adds the Personalisation button to the toolbar
	 * 
	 * @private
	 */
	SmartChart.prototype._addPersonalisationToToolbar = function() {
		if (this.getUseChartPersonalisation()) {
			if (!this._oChartPersonalisationButton) {
				this._oChartPersonalisationButton = new OverflowToolbarButton(this.getId() + "-btnPersonalisation", {
					// type: sap.m.ButtonType.Default,
					icon: "sap-icon://action-settings",
					tooltip: this._oRb.getText("CHART_PERSOBTN_TOOLTIP"),
					press: jQuery.proxy(function(oEvent) {
						this._oPersController.openDialog({
							dimeasure: {
								visible: true,
								payload: {
									availableChartTypes: this._getAllChartTypes()
								}
							},
							sort: {
								visible: true
							},
							filter: {
								visible: true
							}
						});
					}, this)
				});
			}
			this._oToolbar.addContent(this._oChartPersonalisationButton);
		} else if (this._oChartPersonalisationButton) {
			this._oToolbar.removeContent(this._oChartPersonalisationButton);
		}
	};

	SmartChart.prototype._addChartTypeToToolbar = function() {

// preparation for the new requirements
		this._oChartTypeButton = this._createChartTypeButton();
		this._oToolbar.addContent(this._oChartTypeButton);
	};

	SmartChart.prototype._createChartTypeComboBox = function() {
		var that = this;

		var oItemTemplate = new Item({
			key: "{$smartChartTypes>key}",
			text: "{$smartChartTypes>text}"
		});

		var oComboBox = new ComboBox({
			enabled: false,
			items: {
				path: "$smartChartTypes>/items",
				template: oItemTemplate
			}
		});

		oComboBox.attachSelectionChange(null, function() {
			that._setChartType(oComboBox.getSelectedItem().getKey());
		});

		return oComboBox;
	};

	SmartChart.prototype._createChartTypeButton = function() {
		var that = this;

		var oButton = new ToggleButton({
			enabled: false,
			press: function(oEvent) {
				this.setPressed(true);
				that._displayChartTypes(oEvent);
			}
		});

		this._enreachButton(this._oChart.getChartType());

		return oButton;
	};

	SmartChart.prototype._displayChartTypes = function(oEvent) {
		jQuery.sap.require("sap.m.Bar");
		jQuery.sap.require("sap.m.List");
		jQuery.sap.require("sap.m.ListType");
		jQuery.sap.require("sap.ui.core.ListItem");
		jQuery.sap.require("sap.m.SearchField");
		jQuery.sap.require("sap.m.PlacementType");
		jQuery.sap.require("sap.m.StandardListItem");
		jQuery.sap.require("sap.m.ResponsivePopover");

		var that = this, oPopover, oList, oSubHeader, oSearchField;

		if (this._oChart && oEvent) {

			var oButton = oEvent.getSource();

			var oItemTemplate = new sap.m.StandardListItem({
				title: "{$smartChartTypes>text}",
				icon: "{$smartChartTypes>icon}",
				selected: "{$smartChartTypes>selected}"
			});

			oList = new sap.m.List({
				mode: sap.m.ListMode.SingleSelectMaster,
				items: {
					path: "$smartChartTypes>/items",
					template: oItemTemplate
				},
				selectionChange: function(oEvent) {
					if (oEvent && oEvent.mParameters && oEvent.mParameters.listItem) {
						var oBinding = oEvent.mParameters.listItem.getBinding("title");
						if (oBinding) {
							var oCtx = oBinding.getContext();
							if (oCtx) {
								var oObj = oCtx.getObject();
								if (oObj && oObj.key) {
									that._setChartType(oObj.key);
									that._enreachButton(oObj.key, oObj.text);
								}
							}
						}
					}

					oButton.setPressed(false);
					oPopover.close();
				}
			});

			oSubHeader = new sap.m.Bar();
			oSearchField = new sap.m.SearchField({
				placeholder: this._oRb.getText("CHART_TYPE_SEARCH")
			});
			oSearchField.attachLiveChange(function(oEvent) {
				that._triggerSearchInPopover(oEvent, oList);
			});
			oSubHeader.addContentRight(oSearchField);

			oPopover = new sap.m.ResponsivePopover({
				title: this._oRb.getText("CHART_TYPE_TITLE"),
				contentWidth: "25rem",
				contentHeight: "20rem",
				placement: sap.m.PlacementType.Bottom,
				subHeader: oSubHeader
			});
			oPopover.setModel(this.getModel("$smartChartTypes"), "$smartChartTypes");

			oPopover.addContent(oList);

			if (oList.getItems().length < 7) {
				oSubHeader.setVisible(false);
			}

			oPopover.openBy(oButton);
		}
	};

	SmartChart.prototype._selectCurrentChartType = function(oList) {

		var sSelectedChartTypeKey = this._oChart.getChartType();

		var oItem, aItems = oList.getItems();
		for (var i = 0; i < aItems.length; i++) {

			oItem = aItems[i];
			if (oItem) {
				var oBinding = oItem.getBinding("title");
				if (oBinding) {
					var oCtx = oBinding.getContext();
					if (oCtx) {
						var oObj = oCtx.getObject();
						if (oObj && oObj.key && (oObj.key === sSelectedChartTypeKey)) {
							oList.setSelectedItem(oItem);
							return;
						}
					}
				}
			}
		}
	};

	var mMatchingIcon = {
		"bar": "sap-icon://horizontal-bar-chart",
		"bullet": "sap-icon://horizontal-bullet-chart",
		"bubble": "sap-icon://bubble-chart",
		"column": "sap-icon://vertical-bar-chart",
		"combination": "sap-icon://business-objects-experience",
		"dual_bar": "sap-icon://horizontal-bar-chart",
		"dual_column": "sap-icon://vertical-bar-chart",
		"dual_combination": "sap-icon://business-objects-experience",
		"dual_line": "sap-icon://line-chart",
		"dual_stacked_bar": "sap-icon://full-stacked-chart",
		"dual_stacked_column": "sap-icon://vertical-stacked-chart",
		"dual_stacked_combination": "sap-icon://business-objects-experience",
		"donut": "sap-icon://donut-chart",
		"heatmap": "sap-icon://heatmap-chart",
		"horizontal_stacked_combination": "sap-icon://business-objects-experience",
		"line": "sap-icon://line-chart",
		"pie": "sap-icon://pie-chart",
		"scatter": "sap-icon://scatter-chart",
		"stacked_bar": "sap-icon://full-stacked-chart",
		"stacked_column": "sap-icon://vertical-stacked-chart",
		"stacked_combination": "sap-icon://business-objects-experience",
		"treemap": "sap-icon://Chart-Tree-Map", // probably has to change
		"vertical_bullet": "sap-icon://vertical-bullet-chart",
		"100_dual_stacked_bar": "sap-icon://full-stacked-chart",
		"100_dual_stacked_column": "sap-icon://vertical-stacked-chart",
		"100_stacked_bar": "sap-icon://full-stacked-chart",
		"100_stacked_column": "sap-icon://full-stacked-column-chart"
	};

	SmartChart.prototype._getMatchingIcon = function(sCharType) {
		var sIcon = mMatchingIcon[sCharType];
		if (!sIcon) {
			sIcon = "";
		}

		return sIcon;
	};

	SmartChart.prototype._enreachButton = function(sKey, sText) {

		if (!this._oChartTypeButton) {
			return;
		}

		if (sText === undefined) {

			sText = sKey;
			var oKey = this._retrieveChartTypeDescription(sKey);
			if (oKey && oKey.text) {
				sText = oKey.text;
			}
		}

		var sSelectedChartTypeIcon = this._getMatchingIcon(sKey);
		this._oChartTypeButton.setIcon(sSelectedChartTypeIcon ? sSelectedChartTypeIcon : "sap-icon://vertical-bar-chart");
		this._oChartTypeButton.setTooltip(this._oRb.getText("CHART_TYPE_TOOLTIP", [
			sText
		]));
	};

	SmartChart.prototype._updateAvailableChartType = function() {
		var that = this, oModel, mData, aItems = [];

		oModel = this.getModel("$smartChartTypes");
		if (!oModel) {
			return;
		}

		mData = {
			items: aItems
		};

		var sSelectedChartType = this._oChart.getChartType();
		var sSelectedChartTypeDescription = "";
		this._getAvailableChartTypes().forEach(function(chartType) {

			var oItem = {
				key: chartType.key,
				text: chartType.text,
				icon: that._getMatchingIcon(chartType.key),
				selected: sSelectedChartType === chartType.key
			};

			aItems.push(oItem);

			if (oItem.selected) {
				sSelectedChartTypeDescription = oItem.text;
			}
		});

		oModel.setData(mData);

		if (this._oChartTypeButton) {
			if (!this._oChartTypeButton.getEnabled()) {
				this._oChartTypeButton.setEnabled(true);
			}

			this._enreachButton(sSelectedChartType, sSelectedChartTypeDescription);
		}
	};

	/**
	 * creates the personalization controller if not yet done
	 * 
	 * @private
	 */
	SmartChart.prototype._createPersonalizationController = function() {
		if (this._oPersController || !this.getUseChartPersonalisation()) {
			return;
		}

		var oSettings = this.data("p13nDialogSettings");
		if (typeof oSettings === "string") {
			try {
				oSettings = JSON.parse(oSettings);
			} catch (e) {
				oSettings = null;
				// Invalid JSON!
			}
		}

		oSettings = this._setIgnoreFromPersonalisationToSettings(oSettings);

		oSettings = oSettings || {};

		jQuery.sap.require("sap.ui.comp.personalization.Controller");
		var oChartWrapper = PersoUtil.createChartWrapper(this._oChart, this._oChart.data("p13nData"));
		if (this.$() && this.$().closest(".sapUiSizeCompact").length > 0) {
			this._oChart.addStyleClass("sapUiSizeCompact");
		}

		this._oPersController = new sap.ui.comp.personalization.Controller({
			table: oChartWrapper,
			setting: oSettings,
			resetToInitialTableState: !this.getUseVariantManagement(),
			afterP13nModelDataChange: jQuery.proxy(this._personalisationModelDataChange, this)
		});
	};

	/**
	 * adds the ignoreFromPersonalisation fields to the given setting
	 * 
	 * @param {object} oSettings the former settings object
	 * @private
	 * @returns {object} the changed settings object
	 */
	SmartChart.prototype._setIgnoreFromPersonalisationToSettings = function(oSettings) {
		var aIgnoreFields = PersoUtil.createArrayFromString(this.getIgnoreFromPersonalisation());
		if (aIgnoreFields.length) {
			if (!oSettings) {
				oSettings = {};
			}

			var fSetArray = function(sSubName) {
				if (!oSettings[sSubName]) {
					oSettings[sSubName] = {};
				}
				oSettings[sSubName].ignoreColumnKeys = aIgnoreFields;
			};

			fSetArray("dimeasure");
			fSetArray("filter");
			fSetArray("sort");
		}
		return oSettings;
	};

	/**
	 * eventhandler for personalisation changed
	 * 
	 * @param {object} oEvent The event arguments
	 * @private
	 */
	SmartChart.prototype._personalisationModelDataChange = function(oEvent) {
		this._oCurrentVariant = oEvent.getParameter("persistentData");
		if (this._bApplyingVariant) {
			return;
		}
		var oChangeInfo = oEvent.getParameter("changeType");
		var changeStatus = this._getChangeStatus(oChangeInfo);

		if (changeStatus === sap.ui.comp.personalization.ChangeType.Unchanged) {
			return;
		}

		if (!this.getUseVariantManagement()) {
			this._persistPersonalisation();
		} else if (this._oVariantManagement) {
			this._oVariantManagement.currentVariantSetModified(true);
		}

		if (changeStatus === sap.ui.comp.personalization.ChangeType.TableChanged) {

			if (this._oCurrentVariant.dimeasure && this._oCurrentVariant.dimeasure.chartTypeKey) {

				this._updateAvailableChartType();

			}

			if (this._oSemanticalNavButton) {
				this._oSemanticalNavButton.setEnabled(false);
			}
		} else if (changeStatus === sap.ui.comp.personalization.ChangeType.ModelChanged) {
			// Rebind Chart only if data was set on it once or no smartFilter is attached!
			if (this._bIsChartBound || !this._oSmartFilter) {
				this._reBindChart();
			} else {
				this._showOverlay(true);
			}
		}
	};

	/**
	 * returns the current filter and sorting options from the table personalisation/variants
	 * 
	 * @private
	 * @param {object} oChangeInfo The change info given by the personalization controller
	 * @returns {sap.ui.comp.personalization.ChangeType} the merged change status
	 */
	SmartChart.prototype._getChangeStatus = function(oChangeInfo) {
		if (!oChangeInfo) {
			// change info not provided return ModelChanged to indicate that we need to update everything internally
			return sap.ui.comp.personalization.ChangeType.ModelChanged;
		}

		if (oChangeInfo.sort === sap.ui.comp.personalization.ChangeType.ModelChanged || oChangeInfo.filter === sap.ui.comp.personalization.ChangeType.ModelChanged || oChangeInfo.dimeasure === sap.ui.comp.personalization.ChangeType.ModelChanged || oChangeInfo.group === sap.ui.comp.personalization.ChangeType.ModelChanged) {
			// model has changed and was not applied to table
			return sap.ui.comp.personalization.ChangeType.ModelChanged;
		}

		if (oChangeInfo.sort === sap.ui.comp.personalization.ChangeType.TableChanged || oChangeInfo.filter === sap.ui.comp.personalization.ChangeType.TableChanged || oChangeInfo.dimeasure === sap.ui.comp.personalization.ChangeType.TableChanged || oChangeInfo.group === sap.ui.comp.personalization.ChangeType.TableChanged) {
			// change was already applied to table
			return sap.ui.comp.personalization.ChangeType.TableChanged;
		}

		return sap.ui.comp.personalization.ChangeType.Unchanged;
	};

	/**
	 * The entity set name in the OData metadata against which the chart must be bound.
	 * 
	 * @param {string} sEntitySetName The entity set
	 * @public
	 */
	SmartChart.prototype.setEntitySet = function(sEntitySetName) {
		this.setProperty("entitySet", sEntitySetName);
		this._initialiseMetadata();
	};

	/**
	 * It could happen that the entity type information is set already in the view, but there is no model attached yet. This method is called once the
	 * model is set on the parent and can be used to initialise the metadata, from the model, and finally create the chart controls.
	 * 
	 * @private
	 */
	SmartChart.prototype.propagateProperties = function() {
		VBox.prototype.propagateProperties.apply(this, arguments);
		this._initialiseMetadata();
	};

	/**
	 * Initialises the OData metadata necessary to create the chart
	 * 
	 * @private
	 */
	SmartChart.prototype._initialiseMetadata = function() {
		if (!this.bIsInitialised) {
			ODataModelUtil.handleModelInit(this, this._onMetadataInitialised);
		}
	};

	/**
	 * Called once the necessary Model metadata is available
	 * 
	 * @private
	 */
	SmartChart.prototype._onMetadataInitialised = function() {
		this._bMetaModelLoadAttached = false;
		if (!this.bIsInitialised) {
			this._createChartProvider();
			if (this._oChartProvider) {
				this._oChartViewMetadata = this._oChartProvider.getChartViewMetadata();
				if (this._oChartViewMetadata) {

					// Indicates the control is initialised and can be used in the initialise event/otherwise!
					this.bIsInitialised = true;
					this._listenToSmartFilter();
					this._createVariantManagementControl(); // creates VariantMngmntCtrl if useVariantManagement OR useChartPersonalisation is true.
					// Control is only added to toolbar if useVariantManagement is set otherwise it acts as
					// hidden persistance helper
					this._assignData();

					this._createContent();

					this._createToolbarContent();

					this._createPersonalizationController();

					this.fireInitialise();
					if (this.getEnableAutoBinding()) {
						if (this._oSmartFilter && this._oSmartFilter.isPending()) {
							this._oSmartFilter.search();
						} else {
							this._reBindChart();
						}
					}
				}
			}
		}
	};

	/**
	 * Creates an instance of the chart provider
	 * 
	 * @private
	 */
	SmartChart.prototype._createChartProvider = function() {
		var oModel, sEntitySetName;
		sEntitySetName = this.getEntitySet();
		oModel = this.getModel();

		// The SmartChart might also needs to work for non ODataModel models; hence we now create the chart independent
		// of ODataModel.
		if (oModel && !this._bChartCreated) {
			this._aAlwaysSelect = [];
			this._createToolbar();
			this._createChart();
			this._bChartCreated = true;
		}
		if (oModel && sEntitySetName) {
			this._oChartProvider = new ChartProvider({
				entitySet: sEntitySetName,
				ignoredFields: this.getIgnoredFields(),
				dateFormatSettings: this.data("dateFormatSettings"),
				currencyFormatSettings: this.data("currencyFormatSettings"),
				defaultDropDownDisplayBehaviour: this.data("defaultDimensionDisplayBehaviour"),
				useSmartField: this.data("useSmartField"),
				enableInResultForLineItem: this.data("enableInResultForLineItem"),
				model: oModel
			});
		}
	};

	/**
	 * Listen to changes on the corresponding SmartFilter (if any)
	 * 
	 * @private
	 */
	SmartChart.prototype._listenToSmartFilter = function() {
		var sSmartFilterId = null;
		// Register for SmartFilter Search
		sSmartFilterId = this.getSmartFilterId();

		this._oSmartFilter = this._findControl(sSmartFilterId);

		if (this._oSmartFilter) {
			this._oSmartFilter.attachSearch(this._reBindChart, this);
			this._oSmartFilter.attachFilterChange(this._showOverlay, this, true);
			this._oSmartFilter.attachCancel(this._showOverlay, this, false);
		}
	};

	SmartChart.prototype._renderOverlay = function(bShow) {

		if (this._oChart) {

			var $this = this._oChart.$(), $overlay = $this.find(".sapUiCompSmartChartOverlay");
			if (bShow && $overlay.length === 0) {
				$overlay = jQuery("<div>").addClass("sapUiOverlay sapUiCompSmartChartOverlay").css("z-index", "1");
				$this.append($overlay);
			} else if (!bShow) {
				$overlay.remove();
			}
		}
	};

	/**
	 * sets the ShowOverlay property on the inner chart, fires the ShowOverlay event
	 * 
	 * @param {boolean} bShow true to display the overlay, otherwise false
	 * @private
	 */
	SmartChart.prototype._showOverlay = function(bShow) {
		if (bShow) {
			var oOverlay = {
				show: true
			};
			this.fireShowOverlay({
				overlay: oOverlay
			});
			bShow = oOverlay.show;
		}

		this._renderOverlay(bShow);
	};

	/**
	 * searches for a certain control by its ID
	 * 
	 * @param {string} sId the control's ID
	 * @returns {sap.ui.core.Control} The control found by the given Id
	 * @private
	 */
	SmartChart.prototype._findControl = function(sId) {
		var oResultControl, oView;
		if (sId) {
			// Try to get SmartFilter from Id
			oResultControl = sap.ui.getCore().byId(sId);

			// Try to get SmartFilter from parent View!
			if (!oResultControl) {
				oView = this._getView();

				if (oView) {
					oResultControl = oView.byId(sId);
				}
			}
		}

		return oResultControl;
	};

	/**
	 * searches for the controls view
	 * 
	 * @returns {sap.ui.core.mvc.View} The found parental View
	 * @private
	 */
	SmartChart.prototype._getView = function() {
		if (!this._oView) {
			var oObj = this.getParent();
			while (oObj) {
				if (oObj instanceof sap.ui.core.mvc.View) {
					this._oView = oObj;
					break;
				}
				oObj = oObj.getParent();
			}
		}
		return this._oView;
	};

	/**
	 * This can be used to trigger binding on the chart used in the SmartChart
	 * 
	 * @protected
	 */
	SmartChart.prototype.rebindChart = function() {
		this._reBindChart();
	};

	/**
	 * Re-binds the chart
	 * 
	 * @private
	 */
	SmartChart.prototype._reBindChart = function() {
		var sRequestAtLeastFields, aAlwaysSelect, aSelect, mChartPersonalisationData, aSmartFilters, aProcessedFilters = [], aFilters, oExcludeFilters, aSorters, mParameters = {}, mBindingParams = {
			preventChartBind: false
		};

		mChartPersonalisationData = this._getChartPersonalisationData() || {};

		aFilters = mChartPersonalisationData.filters;
		oExcludeFilters = mChartPersonalisationData.excludeFilters;
		aSorters = mChartPersonalisationData.sorters;

		// Get Filters and parameters from SmartFilter
		if (this._oSmartFilter) {
			aSmartFilters = this._oSmartFilter.getFilters();
			mParameters = this._oSmartFilter.getParameters() || {};
		}

		// If filters from SmartFilter exist --> process them first with SmartChart exclude filters
		// since we need to manually AND multiple multi filters!
		if (aSmartFilters && aSmartFilters.length) {
			if (oExcludeFilters) {
				aProcessedFilters = [
					new sap.ui.model.Filter([
						aSmartFilters[0], oExcludeFilters
					], true)
				];
			} else {
				aProcessedFilters = aSmartFilters;
			}
		} else if (oExcludeFilters) {
			aProcessedFilters = [
				oExcludeFilters
			];
		}
		// Combine the resulting processed filters with SmartChart include filters
		if (aFilters) {
			aFilters = aProcessedFilters.concat(aFilters);
		} else {
			aFilters = aProcessedFilters;
		}

		sRequestAtLeastFields = this.getRequestAtLeastFields();
		if (sRequestAtLeastFields) {
			aAlwaysSelect = sRequestAtLeastFields.split(",");
		} else {
			aAlwaysSelect = [];
		}
		aAlwaysSelect.concat(this._aAlwaysSelect);
		// aSelect = this._oChart.getVisibleDimensions().concat(this._oChart.getVisibleMeasures());
		// handle fields that shall always be selected
		if (!aSelect || !aSelect.length) {
			aSelect = aAlwaysSelect;
		} else {
			for (var i = 0; i < aAlwaysSelect.length; i++) {
				if (aSelect.indexOf(aAlwaysSelect[i]) < 0) {
					aSelect.push(aAlwaysSelect[i]);
				}
			}
		}
		if (aSelect && aSelect.length) {
			mParameters["select"] = aSelect.toString();
		}

		// Enable some default parameters
		mParameters["entitySet"] = this.getEntitySet();
		if (!aSorters) {
			aSorters = [];
		}

		mBindingParams.filters = aFilters;
		mBindingParams.sorter = aSorters;
		mBindingParams.parameters = mParameters;

		// fire event to enable user modification of certain binding options (Ex: Filters)
		this.fireBeforeRebindChart({
			bindingParams: mBindingParams
		});

		if (!mBindingParams.preventChartBind) {
			aSorters = mBindingParams.sorter;
			aFilters = mBindingParams.filters;

			this._oChart.setBusy(true);

			this._bDataLoadPending = true;
			this._oChart.bindData({
				path: this.getChartBindingPath() || ("/" + this.getEntitySet()),
				parameters: mParameters,
				filters: aFilters,
				sorter: aSorters,
				events: {
					dataReceived: function(mEventParams) {

						// AnalyticalBinding fires dataReceived too early
						if (mEventParams && mEventParams.getParameter && mEventParams.getParameter("__simulateAsyncAnalyticalBinding")) {
							return;
						}

						this._onDataLoadComplete(mEventParams, true);
						// notify any listeners
						this.fireDataReceived();
					}.bind(this),
					change: this._onDataLoadComplete.bind(this)
				}
			});

			this._showOverlay(false);

			// Flag to indicate if Chart was bound (data fetch triggered) at least once
			this._bIsChartBound = true;
		}
	};

	SmartChart.prototype._onDataLoadComplete = function(mEventParams, bForceUpdate) {

		if (this._oSemanticalNavButton) {
			this._oSemanticalNavButton.setEnabled(false);
		}

		if (this._bDataLoadPending || bForceUpdate) {
			this._bDataLoadPending = false;

			this._updateAvailableChartType();
			this._oChart.setBusy(false);
		}
	};

	SmartChart.prototype._assignData = function() {
		if (this._oChartViewMetadata && this._oChart) {
			if (this._oChartViewMetadata.measureFields && (this._oChartViewMetadata.measureFields.length > 0)) {
				this._oChart.setVisibleMeasures(this._oChartViewMetadata.measureFields);
			}

			if (this._oChartViewMetadata.dimensionFields && (this._oChartViewMetadata.dimensionFields.length > 0)) {
				this._oChart.setVisibleDimensions(this._oChartViewMetadata.dimensionFields);
			}

			if (!this.getChartType() && this._oChartViewMetadata.chartType) {
				this._setChartType(this._oChartViewMetadata.chartType);
			}

			if (this._oChartViewMetadata.semantics === "aggregate") {
				this._oChart.setIsAnalytical(true);
			}
		}
	};

	SmartChart.prototype._createP13nObject = function(oField) {

		return {
			columnKey: oField.name,
			leadingProperty: oField.name, // used to fetch data, by adding this to $select param of OData request
			additionalProperty: oField.additionalProperty, // additional data to fetch in $select
			sortProperty: oField.sortable ? oField.name : undefined,
			filterProperty: oField.filterable ? oField.name : undefined,
			type: oField.filterType,
			maxLength: oField.maxLength,
			precision: oField.precision,
			scale: oField.scale,
			isMeasure: oField.isMeasure,
			isDimension: oField.isDimension,
			aggregationRole: oField.aggregationRole,
			label: oField.fieldLabel,
			tooltip: oField.quickInfo
		};

	};

	/**
	 * Creates the content based on the metadata/configuration
	 * 
	 * @private
	 */
	SmartChart.prototype._createContent = function() {

		jQuery.sap.require("sap.ui.comp.util.FormatUtil");

		var i, iLen = 0, oField, oChartObject, mProperties, aSortFilterableItems = [], oP13nDataObj, that = this;

		iLen = this._oChartViewMetadata.fields.length;
		for (i = 0; i < iLen; i++) {

			oChartObject = null;

			oField = this._oChartViewMetadata.fields[i];

			oP13nDataObj = this._createP13nObject(oField);

			mProperties = {
				name: oField.name,
				label: oField.fieldLabel
			};
			if (oField.inResult) {
				this._aAlwaysSelect.push(oField.name);
			}

			if (oField.isDimension) {
				oChartObject = new Dimension(mProperties);
				this._oChart.addDimension(oChartObject);

				if (oField.description) {
					oChartObject.setTextProperty(oField.description);

					/* eslint-disable no-loop-func */
					oChartObject.setTextFormatter(function(sKey, sText) {
						var sName = this.getIdentity();
						var sDisplayBehaviour = that._getDisplayBehaviour(sName);
						return sap.ui.comp.util.FormatUtil.getFormattedExpressionFromDisplayBehaviour(sDisplayBehaviour, sKey, sText);
					});
					/* eslint-enable no-loop-func */
				}

			} else if (oField.isMeasure) {
				oChartObject = new Measure(mProperties);
				this._oChart.addMeasure(oChartObject);

				if (oField.unit) {
					oChartObject.setUnitBinding(oField.unit);
				}
			} else if (oField.sortable || oField.filterable) {
				aSortFilterableItems.push(oP13nDataObj);
			}

			if (oChartObject) {
				if (oField.role) {
					oChartObject.setRole(oField.role);
				}
				oChartObject.data("p13nData", oP13nDataObj);
			}
		}

		if (this._oChart) {
			this._oChart.data("p13nData", aSortFilterableItems);
		}
	};

	SmartChart.prototype._getDisplayBehaviour = function(sName) {

		var oField = this._getField(sName);
		if (oField) {
			return oField.displayBehaviour;
		}

		return "";
	};

	SmartChart.prototype._getField = function(sName) {
		var oField, i, iLen;

		if (sName && this._oChartViewMetadata && this._oChartViewMetadata.fields) {
			iLen = this._oChartViewMetadata.fields.length;
			for (i = 0; i < iLen; i++) {
				oField = this._oChartViewMetadata.fields[i];
				if (oField.name === sName) {
					return oField;
				}
			}
		}

		return null;
	};
	/**
	 * Creates a Chart based on the configuration, if necessary. This also prepares the methods to be used based on the chart type.
	 * 
	 * @private
	 */
	SmartChart.prototype._createChart = function() {
		var aContent = this.getItems(), iLen = aContent ? aContent.length : 0, oChart;
		// Check if a Chart already exists in the content (Ex: from view.xml)
		while (iLen--) {
			oChart = aContent[iLen];
			if (oChart instanceof Chart) {
				break;
			}
			oChart = null;
		}
		// If a Chart exists use it, else create one!
		if (oChart) {
			this._oChart = oChart;
		} else {
			this._oChart = new Chart({
				uiConfig: {
					applicationSet: 'fiori'
				},
				vizProperties: {
					title: {
						text: ''
					}
				},
				selectionMode: this.getSelectionMode(),
				width: "100%"
			});

			this.insertItem(this._oChart, 2);
		}

		if (!this._oChart.getLayoutData()) {
			this._oChart.setLayoutData(new sap.m.FlexItemData({
				growFactor: 1,
				baseSize: "0%"
			}));
		}

		this._setChartType(this.getChartType());

		this._createTooltipOrPopover();
	};

	/**
	 * Returns the chart object used internally.
	 * 
	 * @public
	 * @returns {object} The chart
	 */
	SmartChart.prototype.getChart = function() {
		return this._oChart;
	};

	SmartChart.prototype._getChartTypes = function() {
		var mChartTypes;
		try {
			mChartTypes = sap.chart.api.getChartTypes(); // Chart.getChartTypes();
		} catch (ex) {
			mChartTypes = {};
			jQuery.sap.log.error("sap.chart.api..getChartTypes throws an exception.\n" + ex.toString());
		}

		return mChartTypes;
	};

	SmartChart.prototype._getAvailableChartTypes = function() {
		var i, sKey, aAvailableChartTypes = [], aChartTypes, mChartTypes = {}, aIgnoredChartTypes;

		if (this._oChart) {

			aIgnoredChartTypes = PersoUtil.createArrayFromString(this.getIgnoredChartTypes());

			mChartTypes = this._getChartTypes();
			aChartTypes = this._oChart.getAvailableChartTypes().available;
			if (aChartTypes) {
				for (i = 0; i < aChartTypes.length; i++) {
					sKey = aChartTypes[i].chart;
					if (aIgnoredChartTypes.indexOf(sKey) < 0) {
						aAvailableChartTypes.push({
							key: sKey,
							text: mChartTypes[sKey]
						});
					}
				}
			}
		}

		return aAvailableChartTypes;
	};

	SmartChart.prototype._getAllChartTypes = function() {
		var sKey, aAllChartTypes = [], mChartTypes, aIgnoredChartTypes;

		aIgnoredChartTypes = PersoUtil.createArrayFromString(this.getIgnoredChartTypes());

		mChartTypes = this._getChartTypes();

		for (sKey in mChartTypes) {
			if (sKey) {
				if (aIgnoredChartTypes.indexOf(sKey) < 0) {
					aAllChartTypes.push({
						key: sKey,
						text: mChartTypes[sKey]
					});
				}
			}
		}

		return aAllChartTypes;
	};

	SmartChart.prototype._retrieveChartTypeDescription = function(sCharType) {
		var mChartTypes = this._getChartTypes();
		return ({
			key: sCharType,
			text: mChartTypes[sCharType]
		});
	};

	SmartChart.prototype._setChartType = function(sChartType) {

		if (this._oChart) {
			this._oChart.setChartType(sChartType);
		}
	};

	SmartChart.prototype._getDimensions = function() {
		var aDimensions = [];

		if (this._oChart) {
			aDimensions = this._oChart.getDimensions();
		}

		return aDimensions;
	};

	SmartChart.prototype._getVisibleDimensions = function() {
		var aVisibleDimensions = [];

		if (this._oChart) {
			aVisibleDimensions = this._oChart.getVisibleDimensions();
		}

		return aVisibleDimensions;
	};

	SmartChart.prototype._getMeasures = function() {
		var aMeasures = [];

		if (this._oChart) {
			aMeasures = this._oChart.getMeasures();
		}

		return aMeasures;
	};

	SmartChart.prototype._getVisibleMeasures = function() {
		var aVisibleMeasures = [];

		if (this._oChart) {
			aVisibleMeasures = this._oChart.getVisibleMeasures();
		}

		return aVisibleMeasures;
	};

	SmartChart.prototype._getSortedDimensions = function() {
		var aDimensions = [];
		if (this._oChart) {
			aDimensions = this._oChart.getDimensions();
			if (aDimensions) {
				aDimensions.sort(function(a, b) {
					return a.getLabel().localeCompare(b.getLabel());
				});
			}
		}

		return aDimensions;
	};

	/**
	 * Interface function for the SmartVariantManagement control that returns the currently used variant data.
	 * 
	 * @public
	 * @returns {json} The currently used variant
	 */
	SmartChart.prototype.fetchVariant = function() {
		if (this._oCurrentVariant === "STANDARD" || this._oCurrentVariant === null) {
			return {};
		}

		return this._oCurrentVariant;
	};

	/**
	 * Interface function for SmartVariantManagement control that applies the current variant.
	 * 
	 * @param {Object} oVariantJSON The variant JSON
	 * @param {string} sContext Describes the context in which the variant has been applied
	 * @public
	 */
	SmartChart.prototype.applyVariant = function(oVariantJSON, sContext) {
		this._oCurrentVariant = oVariantJSON;
		if (this._oCurrentVariant === "STANDARD") {
			this._oCurrentVariant = null;
		}

		// Context STANDARD here specifies that this is a custom application variant for Globalisation/Industry!
		// This would be called just once in the beginning!
		if (sContext === "STANDARD") {
			this._oApplicationDefaultVariant = this._oCurrentVariant;
		}
		// if an application default variant exists --> extend all the other variants based on this!
		// Changes to the industry should be taken over --> but first we only take over non conflicting changes
		// if the user already has some changes --> just use those
		if (this._oApplicationDefaultVariant && !sContext) {
			this._oCurrentVariant = jQuery.extend(true, {}, this._oApplicationDefaultVariant, oVariantJSON);
		}

		// Set instance flag to indicate that we are currently in the process of applying the changes
		this._bApplyingVariant = true;

		if (this._oPersController) {
			if (this._oCurrentVariant === null || jQuery.isEmptyObject(this._oCurrentVariant)) {
				this._oPersController.resetPersonalization(sap.ui.comp.personalization.ResetType.ResetFull);
			} else {
				this._oPersController.setPersonalizationData(this._oCurrentVariant);
			}
		}

		// Rebind Chart only if data was set on it once or no smartFilter is attached!
		if (this._bIsChartBound || !this._oSmartFilter) {
			this._reBindChart();
		} else {
			this._showOverlay(true);
		}

		// Clear apply variant flag!
		this._bApplyingVariant = false;

		this.fireAfterVariantApply({
			currentVariantId: this.getCurrentVariantId()
		});
	};

	SmartChart.prototype._getFieldTooltip = function(sKey) {
		var oField = this._getFieldByKey(sKey);
		if (oField) {
			return oField.quickInfo;
		}

		return "";
	};
	SmartChart.prototype._getFieldByKey = function(sKey) {

		var i, oField = null;

		if (this._oChartViewMetadata && this._oChartViewMetadata.fields) {
			for (i = 0; i < this._oChartViewMetadata.fields.length; i++) {

				oField = this._oChartViewMetadata.fields[i];
				if (sKey === oField.name) {
					return oField;
				}
			}

			return null;
		}
	};

	/**
	 * Returns the column for the given column key
	 * 
	 * @param {array} aArray list of chart objects
	 * @param {string} sKey - the column key for the required column
	 * @returns {object} The found column or null
	 * @private
	 */
	SmartChart.prototype._getByKey = function(aArray, sKey) {
		var i, iLength, oCharObj, oCustomData;

		if (aArray) {
			iLength = aArray.length;
			for (i = 0; i < iLength; i++) {
				oCharObj = aArray[i];
				oCustomData = oCharObj.data("p13nData");
				if (oCustomData && oCustomData.columnKey === sKey) {
					return oCharObj;
				}
			}
		}

		return null;
	};

	SmartChart.prototype._getDimensionByKey = function(sKey) {
		if (this._oChart) {
			return this._getByKey(this._oChart.getDimensions(), sKey);
		}

		return null;
	};

	SmartChart.prototype._getMeasureByKey = function(sKey) {
		if (this._oChart) {
			return this._getByKey(this._oChart.getMeasures(), sKey);
		}

		return null;
	};

	SmartChart.prototype._getChartObjByKey = function(sKey) {
		var oChartObj = this._getDimensionByKey(sKey);
		if (!oChartObj) {
			oChartObj = this._getMeasureByKey(sKey);
		}

		return oChartObj;
	};

	/**
	 * Retrieves the path for the specified property and column key from the array of table columns
	 * 
	 * @param {string} sColumnKey - the column key specified on the table
	 * @param {string} sProperty - the property path that needs to be retrieved from the column
	 * @returns {string} The path that can be used by sorters, filters etc.
	 * @private
	 */
	SmartChart.prototype._getPathFromColumnKeyAndProperty = function(sColumnKey, sProperty) {
		var sPath = null, oChartObj, oCustomData;
		oChartObj = this._getChartObjByKey(sColumnKey);

		// Retrieve path from the property
		if (oChartObj) {
			oCustomData = oChartObj.data("p13nData");
			if (oCustomData) {
				sPath = oCustomData[sProperty];
			}
		}

		return sPath;
	};

	/**
	 * returns the current filter and sorting options from the table personalisation/variants
	 * 
	 * @private
	 * @returns {object} current variant's filter and sorting options
	 */
	/**
	 * returns the current filter and sorting options from the table personalisation/variants
	 * 
	 * @private
	 * @returns {object} current variant's filter and sorting options
	 */
	SmartChart.prototype._getChartPersonalisationData = function() {
		if (!this._oCurrentVariant) {
			return null;
		}
		var aSorters = [], aFilters = [], aExcludeFilters = [], oExcludeFilters, aSortData, sPath;

		// Sort handling
		if (this._oCurrentVariant.sort) {
			aSortData = this._oCurrentVariant.sort.sortItems;
		} else {
			aSortData = this._aInitialSorters;
		}

		if (aSortData) {
			aSortData.forEach(function(oModelItem) {
				var bDescending = oModelItem.operation === "Descending"; // sap.m.P13nConditionOperation.Descending;
				sPath = oModelItem.columnKey; // this._getPathFromColumnKeyAndProperty(oModelItem.columnKey, "sortProperty");
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));

			}, this);
		}

		// Filter Handling
		if (this._oCurrentVariant.filter) {
			this._oCurrentVariant.filter.filterItems.forEach(function(oModelItem) {
				var oValue1 = oModelItem.value1, oValue2 = oModelItem.value2;
				// Filter path has be re-calculated below
				sPath = oModelItem.columnKey; // this._getPathFromColumnKeyAndProperty(oModelItem.columnKey, "filterProperty");

				if (oValue1 instanceof Date && this._oChartProvider && this._oChartProvider.getIsUTCDateHandlingEnabled()) {
					oValue1 = FilterProvider.getDateInUTCOffset(oValue1);
					oValue2 = oValue2 ? FilterProvider.getDateInUTCOffset(oValue2) : oValue2;
				}
				if (oModelItem.exclude) {
					aExcludeFilters.push(new Filter(sPath, FilterOperator.NE, oValue1));
				} else {
					aFilters.push(new Filter(sPath, oModelItem.operation, oValue1, oValue2));
				}
			}, this);

			if (aExcludeFilters.length) {
				oExcludeFilters = new Filter(aExcludeFilters, true);
			}
		}

		return {
			filters: aFilters,
			excludeFilters: oExcludeFilters,
			sorters: aSorters
		};
	};

	/**
	 * triggers (hidden) VariantManagementControl to persist personalisation this function is called in case no VariantManagementControl is used
	 * 
	 * @private
	 */
	SmartChart.prototype._persistPersonalisation = function() {
		var that = this;
		if (this._oVariantManagement) {
			this._oVariantManagement.getVariantsInfo(function(aVariants) {
				var sPersonalisationVariantKey = null;
				if (aVariants && aVariants.length > 0) {
					sPersonalisationVariantKey = aVariants[0].key;
				}

				var bOverwrite = sPersonalisationVariantKey !== null;

				var oParams = {
					name: "Personalisation",
					global: false,
					overwrite: bOverwrite,
					key: sPersonalisationVariantKey,
					def: true
				};
				that._oVariantManagement.fireSave(oParams);
			});
		}
	};

	/**
	 * Returns the ID of the currently selected variant.
	 * 
	 * @public
	 * @returns {string} ID of the currently selected variant
	 */
	SmartChart.prototype.getCurrentVariantId = function() {
		var sKey = "";

		if (this._oVariantManagement) {
			sKey = this._oVariantManagement.getCurrentVariantId();
		}

		return sKey;
	};

	/**
	 * Applies the current variant based on the sVariantId parameter. If an empty string or null or undefined have been passed, the standard variant
	 * will be used. The standard variant will also be used if the passed sVariantId cannot be found. If the flexibility variant, the content for the
	 * standard variant, or the personalizable control cannot be obtained, no changes will be made.
	 * 
	 * @public
	 * @param {string} sVariantId ID of the currently selected variant
	 */
	SmartChart.prototype.setCurrentVariantId = function(sVariantId) {
		if (this._oVariantManagement) {
			this._oVariantManagement.setCurrentVariantId(sVariantId);
		} else {
			jQuery.sap.log.error("sap.ui.comp.smartchart.SmartChart.prototype.setCurrentVariantId: VariantManagement does not exist");
		}
	};

	SmartChart.prototype._adjustHeight = function() {

		if (this._oChart) {
			var iToolbarHeight = 0, iHeight = this.getDomRef().offsetHeight;
			if (iHeight === 0) {
				return;
			}

			if (this._oToolbar && this._oToolbar.getDomRef()) {
				iToolbarHeight = this._oToolbar.getDomRef().offsetHeight;
			}

			// CORRECTION VALUE FOR CHART
			var iCorrection = 0;
// if (Device.system.desktop) {
// iCorrection = this.bFullScreen ? 0 : 30;
// }
			this._oChart.setHeight((iHeight - iToolbarHeight - iCorrection) + "px");
		}
	};

	SmartChart.prototype.setFullScreen = function(bValue, bForced) {
		if (!this.oFullScreenButton || (bValue === this.bFullScreen && !bForced)) {
			return;
		}
		this.bFullScreen = bValue;
		if (this.bFullScreen) {
			this.oFullScreenButton.setTooltip(this._oRb.getText("CHART_MINIMIZEBTN_TOOLTIP"));
			this.oFullScreenButton.setIcon("sap-icon://exit-full-screen");
			this._enterFullScreen();
		} else {
			this.oFullScreenButton.setTooltip(this._oRb.getText("CHART_MAXIMIZEBTN_TOOLTIP"));
			this.oFullScreenButton.setIcon("sap-icon://full-screen");
			this._exitFullScreen();
		}
	};

	SmartChart.prototype._enterFullScreen = function() {
		jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
		this._oScrollEnablement = new sap.ui.core.delegate.ScrollEnablement(this, this.getId() + '-wrapper', {
			horizontal: true,
			vertical: true
		});
		if (!this._oPopup) {
			this._oPopup = new sap.ui.core.Popup({
				modal: true,
				shadow: false,
				autoClose: false
			});
		}
		this.$content = this.$();
		if (this.$content) {
			this.$tempNode = jQuery('<div></div>');
			this.$content.before(this.$tempNode);
			this._$overlay = jQuery("<div id='" + jQuery.sap.uid() + "'></div>");

			this._$overlay.css("top", "0px");
			this._$overlay.css("left", "0px");
			this._$overlay.css("width", "100%");
			this._$overlay.css("height", "100%");
			this._$overlay.append(this.$content);
			this._oPopup.setContent(this._$overlay);
		} else {
			jQuery.sap.log.warn('Overlay: content does not exist or contains more than one child');
		}
		this._oToolbar.setDesign(ToolbarDesign.Solid);
		this._oPopup.open(200, null, jQuery('body'));
	};

	SmartChart.prototype._exitFullScreen = function() {
		if (!this.$tempNode) {
			return;
		}
		if (this._oScrollEnablement) {
			this._oScrollEnablement.destroy();
			this._oScrollEnablement = null;
		}
		this.$tempNode.replaceWith(this.$content);
		this._oToolbar.setDesign(ToolbarDesign.Auto);
		this._oPopup.close();
		this._$overlay.remove();
	};

	/**
	 * Cleans up the control.
	 * 
	 * @public
	 */
	SmartChart.prototype.exit = function() {

		this._oRb = null;

		if (this._oSmartFilter) {
			this._oSmartFilter.detachSearch(this._reBindChart, this);
			this._oSmartFilter.detachFilterChange(this._showOverlay, this);
			this._oSmartFilter.detachCancel(this._showOverlay, this);
		}

		if (this._oChartProvider && this._oChartProvider.destroy) {
			this._oChartProvider.destroy();
		}
		this._oChartProvider = null;

		if (this._oPersController && this._oPersController.destroy) {
			this._oPersController.destroy();
		}

		this._oPersController = null;
		if (this._oVariantManagement && this._oVariantManagement.destroy) {
			this._oVariantManagement.destroy();
		}
		this._oVariantManagement = null;

		this._destroyPopover();

		if (this._oPopup) {
			this._oPopup.destroy();
			this._oPopup = null;
		}

		if (Device.system.desktop && this.sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		} else {
			Device.orientation.detachHandler(this._adjustHeight, this);
			Device.resize.detachHandler(this._adjustHeight, this);
		}

		this._oCurrentVariant = null;
		this._oApplicationDefaultVariant = null;
		this._oChartViewMetadata = null;
		this._aAlwaysSelect = null;
		this._oSmartFilter = null;
		this._oToolbar = null;
		this._oChartPersonalisationButton = null;
		this._oView = null;
		this._oChart = null;
	};

	return SmartChart;

}, /* bExport= */true);
