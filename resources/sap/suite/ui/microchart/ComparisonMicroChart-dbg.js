/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.suite.ui.microchart.ComparisonMicroChart.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new ComparisonMicroChart control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Illustrates values as colored bar charts with title, numeric value, and scaling factor in the content area. This control replaces the deprecated sap.suite.ui.commons.ComparisonChart.
	 * @extends sap.ui.core.Control
	 *
	 * @version 1.36.12
	 *
	 * @public
	 * @alias sap.suite.ui.microchart.ComparisonMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ComparisonMicroChart = Control.extend("sap.suite.ui.microchart.ComparisonMicroChart", /** @lends sap.suite.ui.microchart.ComparisonMicroChart.prototype */ { metadata : {

		library: "sap.suite.ui.microchart",
		properties: {
			/**
			 * The size of the microchart. If not set, the default size is applied based on the size of the device tile.
			 */
			size: {type: "sap.m.Size", group: "Misc", defaultValue: "Auto"},

			/**
			 * The scaling suffix that is added to the actual and target values.
			 */
			scale: {type: "string", group: "Misc", defaultValue: ""},

			/**
			 * The width of the chart. If it is not set, the size of the control is defined by the size property.
			 */
			width: {type: "sap.ui.core.CSSSize", group: "Misc"},

			/**
			 * The view of the chart. If not set, the Normal view is used by default.
			 */
			view: {type: "sap.suite.ui.microchart.ComparisonMicroChartViewType", group: "Appearance", defaultValue: "Normal"},

			/**
			 * The color palette for the chart. If this property is set, semantic colors defined in ComparisonData are ignored. Colors from the palette are assigned to each bar consequentially. When all the palette colors are used, assignment of the colors begins from the first palette color.
			 */
			colorPalette: {type: "string[]", group: "Appearance", defaultValue: []},

			/**
			 * If it is set to true, the height of the control is defined by its content.
			 */
			shrinkable: {type: "boolean", group: "Misc", defaultValue: "false"},

			/**
			 * Height of the chart.
			 */
			height: {type: "sap.ui.core.CSSSize", group: "Appearance"}
		},
		aggregations: {
			/**
			 * The comparison chart bar data.
			 */
			data: {type: "sap.suite.ui.microchart.ComparisonMicroChartData", multiple: true}
		},
		events: {
			/**
			 * The event is fired when the user chooses the comparison microchart.
			 */
			press : {}
		}
	}});

	ComparisonMicroChart.prototype.init = function(){
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");
		this.setTooltip("{AltText}");
	};

	/**
	 * Calculates the width in percents of chart bars' elements accordingly with provided chart values.
	 *
	 * @returns {Array} array of calculated values for each chart bar.
	 * @private
	 */
	ComparisonMicroChart.prototype._calculateChartData = function() {
		var aResult = [];
		var aData = this.getData();
		var iCount = aData.length;
		var iMaxValue = 0;
		var iMinValue = 0;
		var iTotal;
		var iMaxPercent;
		var iMinPercent;
		var i;

		for (i = 0; i < iCount; i++) {
			var iDataValue = isNaN(aData[i].getValue()) ? 0 : aData[i].getValue();
			iMaxValue = Math.max(iMaxValue, iDataValue);
			iMinValue = Math.min(iMinValue, iDataValue);
		}

		iTotal = iMaxValue - iMinValue;
		iMaxPercent = (iTotal == 0) ? 0 : Math.round(iMaxValue * 100 / iTotal);

		if (iMaxPercent == 0 && iMaxValue != 0) {
			iMaxPercent = 1;
		} else if (iMaxPercent == 100 && iMinValue != 0) {
			iMaxPercent = 99;
		}

		iMinPercent = 100 - iMaxPercent;

		for (i = 0; i < iCount; i++) {
			var oItem = {};
			var iDataVal = isNaN(aData[i].getValue()) ? 0 : aData[i].getValue();

			oItem.value = (iTotal == 0) ? 0 : Math.round(iDataVal * 100 / iTotal);

			if (oItem.value == 0 && iDataVal != 0) {
				oItem.value = (iDataVal > 0) ? 1 : -1;
			} else if (oItem.value == 100) {
				oItem.value = iMaxPercent;
			} else if (oItem.value == -100) {
				oItem.value = -iMinPercent;
			}

			if (oItem.value >= 0) {
				oItem.negativeNoValue = iMinPercent;
				oItem.positiveNoValue = iMaxPercent - oItem.value;
			} else {
				oItem.value = -oItem.value;
				oItem.negativeNoValue = iMinPercent - oItem.value;
				oItem.positiveNoValue = iMaxPercent;
			}

			aResult.push(oItem);
		}

		return aResult;
	};

	ComparisonMicroChart.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
		sap.ui.core.Control.prototype.attachEvent.call(this, sEventId, oData, fnFunction, oListener);
		if (this.hasListeners("press")) {
			this.$().attr("tabindex", 0).addClass("sapSuiteUiMicroChartPointer");
		}

		return this;
	};

	ComparisonMicroChart.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
		sap.ui.core.Control.prototype.detachEvent.call(this, sEventId, fnFunction, oListener);
		if (!this.hasListeners("press")) {
			this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	ComparisonMicroChart.prototype._getLocalizedColorMeaning = function(sColor) {
		return this._oRb.getText(("SEMANTIC_COLOR_" + sColor).toUpperCase());
	};

	ComparisonMicroChart.prototype.getAltText = function() {
		var sScale = this.getScale();
		var sAltText = "";

		for (var i = 0; i < this.getData().length; i++) {
			var oBar = this.getData()[i];
			var sMeaning = (this.getColorPalette().length) ? "" : this._getLocalizedColorMeaning(oBar.getColor());
			sAltText += ((i == 0) ? "" : "\n") + oBar.getTitle() + " " + (oBar.getDisplayValue() ? oBar.getDisplayValue() : oBar.getValue()) + sScale + " " + sMeaning;
		}

		return sAltText;
	};

	ComparisonMicroChart.prototype.getTooltip_AsString  = function() {
		var oTooltip = this.getTooltip();
		var sTooltip = this.getAltText();

		if (typeof oTooltip === "string" || oTooltip instanceof String) {
			sTooltip = oTooltip.split("{AltText}").join(sTooltip).split("((AltText))").join(sTooltip);
			return sTooltip;
		}
		return oTooltip ? oTooltip : "";
	};

	ComparisonMicroChart.prototype._adjustBars = function() {
		var iHeight = parseFloat(this.$().css("height"));
		var iBarCount = this.getData().length;
		var aBarContainers = this.$().find(".sapSuiteCmpChartItem");
		var iMinH = parseFloat(aBarContainers.css("min-height"));
		var iMaxH = parseFloat(aBarContainers.css("max-height"));
		var iBarContHeight;

		if (iBarCount != 0) {
			iBarContHeight = iHeight / iBarCount;

			if (iBarContHeight > iMaxH) {
				iBarContHeight = iMaxH;
			} else if (iBarContHeight < iMinH) {
				iBarContHeight = iMinH;
			}

			aBarContainers.css("height", iBarContHeight);

			if (this.getView() === "Wide" ) {
				this.$().find(".sapSuiteCmpChartBar>div").css("height", (iBarContHeight * 79 / 42) + "%");

			} else if (this.getView() === "Normal") {
				this.$().find(".sapSuiteCmpChartBar>div").css("height", (iBarContHeight - 19) + "%");
			}

			var iChartsHeightDelta = (iHeight - iBarContHeight * iBarCount) / 2;
			if (iChartsHeightDelta > 0) {
				jQuery(aBarContainers[0]).css("margin-top", iChartsHeightDelta + 7 + "px");
			}
		}
	};

	ComparisonMicroChart.prototype.onAfterRendering = function() {
		if (this.getHeight() != "") {
			var that = this;
			sap.ui.Device.media.attachHandler(function(){
				that._adjustBars();
			});
			this._adjustBars();
		}

	};

	ComparisonMicroChart.prototype._getBarAltText = function(iBarIndex) {
			var sScale = this.getScale();
			var oBar = this.getData()[iBarIndex];
			var sMeaning = (this.getColorPalette().length) ? "" : this._getLocalizedColorMeaning(oBar.getColor());
			return oBar.getTitle() + " " + (oBar.getDisplayValue() ? oBar.getDisplayValue() : oBar.getValue()) + sScale + " " + sMeaning;
	};

	ComparisonMicroChart.prototype.onsaptabnext = function(oEvent) {
		var oLast = this.$().find(":focusable").last();	// last tabstop in the control
		if (oLast) {
			this._bIgnoreFocusEvt = true;
			oLast.get(0).focus();
		}
	};

	ComparisonMicroChart.prototype.onsaptabprevious = function(oEvent) {
		if (oEvent.target.id != oEvent.currentTarget.id) {
			var oFirst = this.$().find(":focusable").first();	// first tabstop in the control
			if (oFirst) {
				oFirst.get(0).focus();
			}
		}
	};

	ComparisonMicroChart.prototype.ontap = function(oEvent) {
		if (sap.ui.Device.browser.edge) {
			this.onclick(oEvent);
		}
	};

	ComparisonMicroChart.prototype.onclick = function(oEvent) {
		if (!this.fireBarPress(oEvent)) {
			if (sap.ui.Device.browser.internet_explorer || sap.ui.Device.browser.edge) {
				this.$().focus();
			}
			this.firePress();
		}
	};

	ComparisonMicroChart.prototype.onkeydown = function(oEvent) {
		switch (oEvent.keyCode) {
			case jQuery.sap.KeyCodes.SPACE:
				oEvent.preventDefault();
				break;

			case jQuery.sap.KeyCodes.ARROW_LEFT:
			case jQuery.sap.KeyCodes.ARROW_UP:
				var oFocusables = this.$().find(":focusable");	// all tabstops in the control
				var iThis = oFocusables.index(oEvent.target);  // focused element index
				if (oFocusables.length > 0) {
					oFocusables.eq(iThis - 1).get(0).focus();	// previous tab stop element
					oEvent.preventDefault();
					oEvent.stopPropagation();
				}
				break;

			case jQuery.sap.KeyCodes.ARROW_DOWN:
			case jQuery.sap.KeyCodes.ARROW_RIGHT:
				var oFocusable = this.$().find(":focusable");	// all tabstops in the control
				var iThisEl = oFocusable.index(oEvent.target);  // focused element index
				if (oFocusable.length > 0) {
					oFocusable.eq((iThisEl + 1 < oFocusable.length) ? iThisEl + 1 : 0).get(0).focus();	// next tab stop element
					oEvent.preventDefault();
					oEvent.stopPropagation();
				}
				break;
			default:
		}
	};

	ComparisonMicroChart.prototype.onkeyup = function(oEvent) {
		if (oEvent.which == jQuery.sap.KeyCodes.ENTER || oEvent.which == jQuery.sap.KeyCodes.SPACE) {
			if (!this.fireBarPress(oEvent)) {
				this.firePress();
				oEvent.preventDefault();
			}
		}
	};

	ComparisonMicroChart.prototype.fireBarPress = function(oEvent) {
		var oBar = jQuery(oEvent.target);
		if (oBar && oBar.attr("data-bar-index")) {
			var iIndex = parseInt(oBar.attr("data-bar-index"), 10);
			var oComparisonData = this.getData()[iIndex];
			if (oComparisonData) {
				oComparisonData.firePress();
				oEvent.preventDefault();
				oEvent.stopPropagation();
				if (sap.ui.Device.browser.internet_explorer) {
					jQuery.sap.byId(this.getId() + "-chart-item-bar-" + iIndex).focus();
				}
				return true;
			}
		}
		return false;
	};


	ComparisonMicroChart.prototype.setBarPressable = function(iBarIndex, bPressable) {
		if (bPressable) {
			var sBarAltText = this._getBarAltText(iBarIndex);
			jQuery.sap.byId(this.getId() + "-chart-item-bar-" + iBarIndex).addClass("sapSuiteUiMicroChartPointer").attr("tabindex", 0).attr("title", sBarAltText).attr("role", "presentation").attr("aria-label", sBarAltText);
		} else {
			jQuery.sap.byId(this.getId() + "-chart-item-bar-" + iBarIndex).removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer").removeAttr("title").removeAttr("role").removeAttr("aria-label");
		}
	};

	ComparisonMicroChart.prototype.onfocusin = function(oEvent) {
		if (this._bIgnoreFocusEvt) {
			this._bIgnoreFocusEvt = false;
			return;
		}
		if (this.getId() + "-hidden" == oEvent.target.id) {
			this.$().focus();
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	return ComparisonMicroChart;

});
