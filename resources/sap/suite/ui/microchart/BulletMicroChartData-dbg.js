/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.suite.ui.microchart.BulletMicroChartData.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";

	/**
	 * Constructor for a new BulletMicroChartData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Contains the thresholds data.
	 * @extends sap.ui.core.Element
	 *
	 * @version 1.36.12
	 *
	 * @constructor
	 * @public
	 * @alias sap.suite.ui.microchart.BulletMicroChartData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var BulletMicroChartData = Element.extend("sap.suite.ui.microchart.BulletMicroChartData", /** @lends sap.suite.ui.microchart.BulletMicroChartData.prototype */ { metadata : {
		library: "sap.suite.ui.microchart",
		properties: {
			/**
			 * The actual value.
			 */
			value: {type: "float", group: "Misc", defaultValue: "0"},

			/**
			 * The semantic color of the actual value.
			 */
			color: {type: "sap.m.ValueColor", group: "Misc", defaultValue: "Neutral"}
		}
	}});
	
	
	BulletMicroChartData.prototype.setValue = function(fValue, bSuppressInvalidate) {
		this._isValueSet = this._fnIsNumber(fValue);
		return this.setProperty("value", this._isValueSet ? fValue : NaN, bSuppressInvalidate);
	};
	
	BulletMicroChartData.prototype._fnIsNumber = function(n) {
		return typeof n == 'number' && !isNaN(n) && isFinite(n);
	};
	
	BulletMicroChartData.prototype.clone = function(sIdSuffix, aLocalIds, oOptions) {
		var oClone = sap.ui.core.Control.prototype.clone.apply(this, arguments);
		oClone._isValueSet = this._isValueSet;
		return oClone;
	};
	
	return BulletMicroChartData;

});