/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// This control displays the history of values as a line mini chart or an area mini chart.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";

	/**
	 * Constructor for a new ColumnMicroChartData control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Defines the column chart data.
	 * @extends sap.ui.core.Control
	 *
	 * @version 1.36.12
	 *
	 * @public
	 * @alias sap.suite.ui.microchart.ColumnMicroChartData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ColumnMicroChartData = Element.extend("sap.suite.ui.microchart.ColumnMicroChartData", /** @lends sap.suite.ui.microchart.ColumnMicroChartData.prototype */ {
		metadata : {
			library : "sap.suite.ui.microchart",
			properties : {

				/**
				 * The graphic element color.
				 */
				color: { group: "Misc", type: "sap.m.ValueColor", defaultValue: "Neutral" },

				/**
				 * The line title.
				 */
				label: {type : "string", group : "Misc", defaultValue : "" },
				
				/**
				 * The actual value.
				 */
				value: {type: "float", group : "Misc"}
			},
			events: {
				/**
				 * The event is fired when the user chooses the column data.
				 */
				press: {}
			}
		}
	});

	ColumnMicroChartData.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
		sap.ui.core.Control.prototype.attachEvent.call(this, sEventId, oData, fnFunction, oListener);
		if (this.getParent()) {
			this.getParent().setBarPressable(this.getParent().getColumns().indexOf(this), true);
		}
		return this;
	};

	ColumnMicroChartData.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
		sap.ui.core.Control.prototype.detachEvent.call(this, sEventId, fnFunction, oListener);
		if (this.getParent()) {
			this.getParent().setBarPressable(this.getParent().getColumns().indexOf(this), false);
		}
		return this;
	};
	
	return ColumnMicroChartData;

});