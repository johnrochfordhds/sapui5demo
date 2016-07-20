/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartmicrochart.SmartBulletMicroChart.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', 'sap/suite/ui/microchart/library', 'sap/ui/comp/providers/ChartProvider', 'sap/suite/ui/microchart/BulletMicroChart'],
	function(jQuery, library, MicroChartLibrary, ChartProvider, BulletMicroChart) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.comp.smartmicrochart/SmartBulletMicroChart.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SmartBulletMicroChart control creates a BulletMicroChart based on OData metadata
	 *				and the configuration specified. The entitySet attribute must be specified to use the control.
	 *				This attribute is used to fetch fields from OData metadata, from which Micro Bullet Chart UI
	 *				will be generated; it can also be used to fetch the actual chart data.<br>
	 *				<b><i>Note:</i></b><br>
	 *				Most of the attributes/properties are not dynamic and cannot be changed once the control has been
	 *				initialized.
	 * @extends sap.suite.ui.microchart.BulletMicroChart
	 * @version 1.36.12
	 * @experimental Since 1.34.0 This is currently under development. The API could be changed at any point in time.
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartmicrochart.SmartBulletMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartBulletMicroChart = BulletMicroChart.extend("sap.ui.comp.smartmicrochart.SmartBulletMicroChart", /** @lends sap.ui.comp.smartmicrochart.SmartBulletMicroChart.prototype */ {
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * The entity set name from which to fetch data and generate the columns. Note that this is not a dynamic UI5 property
				 */
				entitySet: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * ID of the corresponding SmartFilter control; When specified, the SmartBulletMicroChart searches for the SmartFilter (also in the closest
				 * parent View) and attaches to the relevant events of the SmartFilter; to fetch data, show overlay etc.
				 */
				smartFilterId: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * CSV of fields that must be ignored in the OData metadata by the SmartBulletMicroChart control.<br>
				 * <i>Note:</i><br>
				 * No validation is done. Please ensure that you do not add spaces or special characters.
				 */
				ignoredFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * CSV of fields that is not shown in the personalization dialog.<br>
				 * <i>Note:</i><br>
				 * No validation is done. Please ensure that you do not add spaces or special characters.
				 */
				ignoreFromPersonalisation: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specifies the type of Chart to be created in the SmartBulletMicroChart control.
				 */
				chartType: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The useVariantManagement attribute can be set to true or false depending on whether you want to use variants. As a prerequisite you
				 * need to specify the persistencyKey property.
				 */
				useVariantManagement: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * The useChartPersonalisation attribute can be set to true or false depending on whether you want to define personalized chart
				 * settings. If you want to persist the chart personalization, you need to specify the persistencyKey property.
				 */
				useChartPersonalisation: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
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
				 * Retrieves or sets the current variant.
				 */
				currentVariantId: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * When set to true, this enables automatic binding of the chart using the chartBindingPath (if it exists) or entitySet property. This
				 * happens just after the <code>initialise</code> event has been fired.
				 */
				enableAutoBinding: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * This attribute can be used to specify the path that is used during the binding of the chart. If not specified, the entitySet
				 * attribute is used instead. (used only if binding is established internally/automatically - See enableAutoBinding)
				 */
				chartBindingPath: {
					type: "string",
					group: "Misc",
					defaultValue: null
				}
			},
			/*aggregations: {

			},*/
			events: {

				/**
				 * Event fired once the control has been initialised.
				 */
				initialise: {},

				/**
				 * Event fired just before the binding is being done.
				 *
				 * @param {object} [bindingParams] the bindingParams object contains filters, sorters and other binding related information for the chart.
				 * @param {boolean} [bindingParams.preventChartBind] can be set to true by the listener to prevent binding from being done
				 * @param {object} [bindingParams.filters] the combined filter array containing a set of sap.ui.model.Filter instances from SmartBulletMicroChart and SmartFilter - can be modified by users to influence filtering
				 * @param {object} [bindingParams.sorter] an array containing a set of sap.ui.model.Sorter instances from SmartBulletMicroChart (personalisation) - can be modified by users to influence sorting
				 */
				beforeRebindChart: {},

				/**
				 * Event fired after variant management in the SmartBulletMicroChart has been initialised.
				 */
				afterVariantInitialise: {},

				/**
				 * Event fired after a variant has been saved. This event can be used to retrieve the ID of the saved variant.
				 *
				 * @param {string} [currentVariantId] id of the currently selected variant
				 */
				afterVariantSave: {},

				/**
				 * Event fired after a variant has been applied.
				 *
				 * @param {string} [currentVariantId] id of the currently selected variant
				 */
				afterVariantApply: {},

				/**
				 * Event fired just before the overlay is being shown.
				 *
				 * @param {object} [overlay] the overlay object contains information related to the chart's overlay.
				 * @param {boolean} [overlay.show] can be set to false by the listener to prevent the overlay being shown.
				 */
				showOverlay: {}
			}
		}
	});

	/**
	 * The entity set name from OData metadata, with which the chart should be bound to
	 *
	 * @param {string} sEntitySetName The entity set
	 * @public
	 */
	SmartBulletMicroChart.prototype.setEntitySet = function(sEntitySetName) {
		this.setProperty("entitySet", sEntitySetName);
		this._initialiseMetadata();
	};

	/**
	 * It could happen that the entity type information is set already in the view, but there is no model attached yet. This method is called once the
	 * model is set on the parent and can be used to initialise the metadata, from the model, and finally create the chart controls.
	 *
	 * @private
	 */
	SmartBulletMicroChart.prototype.propagateProperties = function() {
		BulletMicroChart.prototype.propagateProperties.apply(this, arguments);
		this._initialiseMetadata();
	};

	/**
	 * initialises the OData metadata necessary to create the chart
	 *
	 * @private
	 */
	SmartBulletMicroChart.prototype._initialiseMetadata = function() {
		if (!this._bIsInitialised) {
			var oModel = this.getModel();
			if (oModel) {
				// Check if ODataMetaModel was loaded
				// If not, delay the creation of chart content/helpers until ODataMetaModel is loaded!
				// Do this only for async ODataModel
				if (oModel.bLoadMetadataAsync && oModel.getMetaModel() && oModel.getMetaModel().loaded) {
					if (!this._bMetaModelLoadAttached) {
						// wait for the ODataMetaModel loaded promise to be resolved
						oModel.getMetaModel().loaded().then(this._onMetadataInitialised.bind(this));
						this._bMetaModelLoadAttached = true;
					}
				} else {
					// Could be a non ODataModel or a synchronous ODataModel --> just create the necessary helpers
					this._onMetadataInitialised();
				}
			}
		}
	};

	/**
	 * Creates an instance of the chart provider
	 *
	 * @private
	 */
	SmartBulletMicroChart.prototype._createChartProvider = function() {
		var oModel, sEntitySetName;
		sEntitySetName = this.getEntitySet();
		oModel = this.getModel();

		// The SmartBulletMicroChart might also needs to work for non ODataModel models; hence we now create the chart independent
		// of ODataModel.
		if (oModel && !this._bChartCreated) {
//			this._aAlwaysSelect = [];
//			this._createToolbar();
//			this._createChart();
			this._bChartCreated = true;
		}
		if (oModel && sEntitySetName) {
			this._oChartProvider = new ChartProvider({
				entitySet: sEntitySetName,
				ignoredFields: this.getIgnoredFields(),
				dateFormatSettings: this.data("dateFormatSettings"),
				currencyFormatSettings: this.data("currencyFormatSettings"),
				defaultDropDownDisplayBehaviour: this.data("defaultDropDownDisplayBehaviour"),
				useSmartField: this.data("useSmartField"),
				enableInResultForLineItem: this.data("enableInResultForLineItem"),
				model: oModel
			});
		}
	};


	/**
	 * Called once the necessary Model metadata is available
	 *
	 * @private
	 */
	SmartBulletMicroChart.prototype._onMetadataInitialised = function() {
		this._bMetaModelLoadAttached = false;
		if (!this._bIsInitialised) {
			this._createChartProvider();
			if (this._oChartProvider) {
				this._oChartViewMetadata = this._oChartProvider.getChartViewMetadata();
				if (this._oChartViewMetadata) {

					// Indicates the control is initialised and can be used in the initialise event/otherwise!
					this._bIsInitialised = true;
					this._assignData();
					this.fireInitialise();
				}
			}
		}
	};

	SmartBulletMicroChart.prototype._assignData = function() {
		if (this._oChartViewMetadata) {
			if (this._oChartViewMetadata.fields && (this._oChartViewMetadata.fields.length > 0)) {
				this._aMeasures = jQuery.grep(this._oChartViewMetadata.fields, function(value, i) {
		            return value.isMeasure;
		        });

				this._aDimensions = jQuery.grep(this._oChartViewMetadata.fields, function(value, i) {
		            return value.isDimension;
		        });

				if (this._aMeasures[0] !== null && this._aMeasures[0].dataPoint !== null){
					var oActualValue = this._aMeasures[0].dataPoint;

					if (oActualValue.valueFormat !== null){
						this.setProperty("scale", oActualValue.valueFormat.scalefactor, true);
					}

					this.setProperty("showActualValue", oActualValue.showActualValue, true);
					this.setProperty("showDeltaValue", oActualValue.showDeltaValue, true);
					this.setProperty("showValueMarker", oActualValue.showValueMarker, true);
					this.setProperty("mode", oActualValue.mode, true);
					this.setProperty("actualValueLabel", oActualValue.actualValueLabel, true);
					this.setProperty("deltaValueLabel", oActualValue.deltaValueLabel, true);
					this.setProperty("targetValueLabel", oActualValue.targetValueLabel, true);
				}
				if (this._aMeasures[1] !== null && this._aMeasures[1].dataPoint !== null){
					var oTargetValue = this._aMeasures[1].dataPoint;

					this.setProperty("targetValue", oTargetValue.value, true);
					this.setProperty("showTargetValue", oTargetValue.showTargetValue, true);
				}
				if (this._aMeasures[2] !== null && this._aMeasures[2].dataPoint !== null){
					var oForeCastValue = this._aMeasures[2].dataPoint;

					this.setProperty("forecastValue", oForeCastValue.value, true);

					if (oForeCastValue.valueRange !== null){
						this.setProperty("minValue", oForeCastValue.valueRange.minValue, true);
						this.setProperty("maxValue", oForeCastValue.valueRange.maxValue, true);
					}
				}
				this.invalidate();
			}
		}
	};

	// **
	// * This file defines behavior for the control,
	// */

	return SmartBulletMicroChart;

});