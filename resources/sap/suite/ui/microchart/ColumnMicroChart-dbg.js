/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.suite.ui.microchart.Example.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new ColumnMicroChart control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Compares different values which are represented as vertical bars. This control replaces the deprecated sap.suite.ui.commons.ColumnMicroChart.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.36.12
	 *
	 * @public
	 * @alias sap.suite.ui.microchart.ColumnMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ColumnMicroChart = Control.extend("sap.suite.ui.microchart.ColumnMicroChart", /** @lends sap.suite.ui.microchart.ColumnMicroChart.prototype */ {
		metadata: {
			library: "sap.suite.ui.microchart",
			properties: {
				/**
				 * Updates the size of the chart. If not set then the default size is applied based on the device tile.
				 */
				size: {group: "Misc", type: "sap.m.Size", defaultValue: "Auto"},

				/**
				 * The width of the chart. If it is not set, the width of the control is defined by the size property.
				 */
				width: {group: "Misc", type: "sap.ui.core.CSSSize"},

				/**
				 * The height of the chart. If it is not set, the height of the control is defined by the size property.
				 */
				height: {group: "Misc", type: "sap.ui.core.CSSSize"}
			},

			events : {

				/**
				 * The event is fired when the user chooses the column chart.
				 */
				press : {}
			},
			aggregations: {

				/**
				 * The column chart data.
				 */
				columns: { multiple: true, type: "sap.suite.ui.microchart.ColumnMicroChartData", defaultValue : null},

				/**
				 * The label on the left top corner of the chart.
				 */
				leftTopLabel: {  multiple: false, type: "sap.suite.ui.microchart.ColumnMicroChartLabel", defaultValue : null},

				/**
				 * The label on the right top corner of the chart.
				 */
				rightTopLabel: { multiple: false, type: "sap.suite.ui.microchart.ColumnMicroChartLabel", defaultValue : null},

				/**
				 * The label on the left bottom corner of the chart.
				 */
				leftBottomLabel: { multiple: false, type: "sap.suite.ui.microchart.ColumnMicroChartLabel", defaultValue: null},

				/**
				 * The label on the right bottom corner of the chart.
				 */
				rightBottomLabel: { multiple: false, type: "sap.suite.ui.microchart.ColumnMicroChartLabel", defaultValue : null}
			}
		}
	});

	ColumnMicroChart.prototype.init = function(){
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");
		this.setTooltip("{AltText}");
	};

	ColumnMicroChart.prototype.onAfterRendering = function() {
		if (this._sChartResizeHandlerId) {
			sap.ui.core.ResizeHandler.deregister(this._sChartResizeHandlerId);
		}

	    this._sChartResizeHandlerId = sap.ui.core.ResizeHandler.register(jQuery.sap.domById(this.getId()),  jQuery.proxy(this._calcColumns, this));
		this._fChartWidth = undefined;
		this._fChartHeight = undefined;
		this._aBars = [];

		var iColumnsNum = this.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this._aBars.push({});
		}

		this._calcColumns();
	};

	ColumnMicroChart.prototype.exit = function() {
		sap.ui.core.ResizeHandler.deregister(this._sChartResizeHandlerId);
	};

	ColumnMicroChart.prototype._calcColumns = function() {
		var iColumnsNum = this.getColumns().length;
		if (iColumnsNum) {
			var fChartWidth = parseFloat(this.$().css("width"));
			if (fChartWidth != this._fChartWidth) {
				this._fChartWidth = fChartWidth;

				var iColumnMargin = 0;
				var oBar;
				if (iColumnsNum > 1) {
					oBar = jQuery.sap.byId(this.getId() + "-bar-1");
					var bRtl = sap.ui.getCore().getConfiguration().getRTL();
					iColumnMargin = parseInt(oBar.css("margin-" + (bRtl ? "right" : "left")), 10);
				} else {
					oBar = jQuery.sap.byId(this.getId() + "-bar-0");
				}

				var iColumMinWidth = parseInt(oBar.css("min-width"), 10);

				this._calcColumnsWidth(iColumnMargin, iColumMinWidth, fChartWidth, this._aBars);
			}

			var fChartHeight = parseFloat(this.$().css("height"));
			if (fChartHeight != this._fChartHeight) {
				this._fChartHeight = fChartHeight;
				this._calcColumnsHeight(fChartHeight, this._aBars);
			}

			for (var i = 0; i < iColumnsNum; i++) {
				jQuery.sap.byId(this.getId() + "-bar-" + i).css(this._aBars[i]);
			}

			if (this._aBars.overflow) {
				jQuery.sap.log.warning(this.toString() + " Chart overflow",  "Some columns were not rendered");
			}
		}
	};

	ColumnMicroChart.prototype._calcColumnsWidth = function(iColumnMargin, iColumMinWidth, fChartWidth, aBars) {
		var iColumnsNum = this.getColumns().length;
		var iVisibleColumnsNum = Math.floor((fChartWidth + iColumnMargin) / (iColumMinWidth + iColumnMargin));
		var iColumnWidth = Math.floor((fChartWidth + iColumnMargin) / Math.min(iVisibleColumnsNum, iColumnsNum)) - iColumnMargin;

		var sColumnWidth = iColumnWidth + "px";

		for (var i = 0; i < iColumnsNum; i++) {
			if (i < iVisibleColumnsNum) {
				aBars[i].width = sColumnWidth;
				aBars[i].display = "inline-block";
			} else {
				aBars[i].display = "none";
			}
		}

		aBars.overflow = iVisibleColumnsNum != iColumnsNum;
	};

	ColumnMicroChart.prototype._calcColumnsHeight = function(fChartHeight, aBars) {
		var iClmnsNum = this.getColumns().length;

		var fMaxVal, fMinVal, fValue;
		fMaxVal = fMinVal = 0;

		for (var i = 0; i < iClmnsNum; i++) {
			var oClmn = this.getColumns()[i];
			if (fMaxVal < oClmn.getValue()) {
				fMaxVal = oClmn.getValue();
			} else if (fMinVal > oClmn.getValue()) {
				fMinVal = oClmn.getValue();
			}
		}

		var fDelta = fMaxVal - fMinVal;
		var fOnePxVal = fDelta / fChartHeight;

		var fDownShift, fTopShift;
		fDownShift = fTopShift = 0;

		for (var iCl = 0; iCl < iClmnsNum; iCl++) {
			fValue = this.getColumns()[iCl].getValue();

			if (Math.abs(fValue) < fOnePxVal) {
				if (fValue >= 0) {
					if (fValue == fMaxVal) {
						fTopShift = fOnePxVal - fValue;
					}
				} else if (fValue == fMinVal) {
					fDownShift = fOnePxVal + fValue;
				}
			}
		}

		if (fTopShift) {
			fMaxVal += fTopShift;
			fMinVal -= fTopShift;
		}

		if (fDownShift) {
			fMaxVal -= fDownShift;
			fMinVal += fDownShift;
		}

		var fNegativeOnePxVal =  0 - fOnePxVal;

		for (var iClmn = 0; iClmn < iClmnsNum; iClmn++) {
			fValue = this.getColumns()[iClmn].getValue();
			var fCalcVal = fValue;

			if (fValue >= 0) {
				fCalcVal = Math.max(fCalcVal + fTopShift - fDownShift, fOnePxVal);
			} else {
				fCalcVal = Math.min(fCalcVal + fTopShift - fDownShift, fNegativeOnePxVal);
			}

			aBars[iClmn].value = fCalcVal;
		}

		function calcPersent(fValue) {
			return (fValue / fDelta * 100).toFixed(2) + "%";
		}

		var fZeroLine = calcPersent(fMaxVal);

		for (var iCol = 0; iCol < iClmnsNum; iCol++) {
			fValue = aBars[iCol].value;
			aBars[iCol].top = (fValue < 0) ? fZeroLine : calcPersent(fMaxVal - fValue);
			aBars[iCol].height = calcPersent(Math.abs(fValue));
		}
	};

	ColumnMicroChart.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
		sap.ui.core.Control.prototype.attachEvent.call(this, sEventId, oData, fnFunction, oListener);
		if (this.hasListeners("press")) {
			this.$().attr("tabindex", 0).addClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	ColumnMicroChart.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
		sap.ui.core.Control.prototype.detachEvent.call(this, sEventId, fnFunction, oListener);
		if (!this.hasListeners("press")) {
			this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	ColumnMicroChart.prototype.getLocalizedColorMeaning = function(sColor) {
		if (sColor) {
			return this._oRb.getText(("SEMANTIC_COLOR_" + sColor).toUpperCase());
		}
	};

	ColumnMicroChart.prototype.getAltText = function() {
		var sAltText = "";
		var bIsFirst = true;
		var oLeftTopLabel = this.getLeftTopLabel();
		var oRightTopLabel = this.getRightTopLabel();
		var oLeftBtmLabel = this.getLeftBottomLabel();
		var oRightBtmLabel = this.getRightBottomLabel();

		var sColor;

		if (oLeftTopLabel && oLeftTopLabel.getLabel() || oLeftBtmLabel && oLeftBtmLabel.getLabel()) {
			if (oLeftTopLabel) {
				sColor = oLeftTopLabel.getColor();
			} else if (oLeftBtmLabel){
				sColor = oLeftBtmLabel.getColor();
			} else {
				sColor = "";
			}

			sAltText += (bIsFirst ? "" : "\n") + this._oRb.getText(("COLUMNMICROCHART_START")) + ": " + (oLeftBtmLabel ? oLeftBtmLabel.getLabel() + " " : "")
				+ (oLeftTopLabel ? oLeftTopLabel.getLabel() + " " : "") + this.getLocalizedColorMeaning(sColor);
			bIsFirst = false;
		}

		if (oRightTopLabel && oRightTopLabel.getLabel() || oRightBtmLabel && oRightBtmLabel.getLabel()) {
			if (oRightTopLabel) {
				sColor = oRightTopLabel.getColor();
			} else if (oRightBtmLabel){
				sColor = oRightBtmLabel.getColor();
			} else {
				sColor = "";
			}

			sAltText += (bIsFirst ? "" : "\n") + this._oRb.getText(("COLUMNMICROCHART_END")) + ": " + (oRightBtmLabel ? oRightBtmLabel.getLabel() + " " : "")
				+ (oRightTopLabel ? oRightTopLabel.getLabel() + " " : "") + this.getLocalizedColorMeaning(sColor);
			bIsFirst = false;
		}

		var aColumns = this.getColumns();
		for (var i = 0; i < aColumns.length; i++) {
			var oBar = aColumns[i];
			var sMeaning = this.getLocalizedColorMeaning(oBar.getColor());
			sAltText += ((!bIsFirst || i != 0) ? "\n" : "") + oBar.getLabel() + " " + oBar.getValue() + " " + sMeaning;
		}

		return sAltText;
	};

	ColumnMicroChart.prototype.getTooltip_AsString  = function() {
		var oTooltip = this.getTooltip();
		var sTooltip = this.getAltText();

		if (typeof oTooltip === "string" || oTooltip instanceof String) {
			sTooltip = oTooltip.split("{AltText}").join(sTooltip).split("((AltText))").join(sTooltip);
			return sTooltip;
		}
		return oTooltip ? oTooltip : "";
	};

	ColumnMicroChart.prototype.ontap = function(oEvent) {
		if (sap.ui.Device.browser.edge) {
			this.onclick(oEvent);
		}
	};

	ColumnMicroChart.prototype.onclick = function(oEvent) {
		if (!this.fireBarPress(oEvent)) {
			if (sap.ui.Device.browser.internet_explorer || sap.ui.Device.browser.edge) {
				this.$().focus();
			}
			this.firePress();
	    }
	};

	ColumnMicroChart.prototype.onkeydown = function(oEvent) {
		var iThis, oFocusables;
		switch (oEvent.keyCode) {
			case jQuery.sap.KeyCodes.SPACE:
				oEvent.preventDefault();
				break;

			case jQuery.sap.KeyCodes.ARROW_LEFT:
			case jQuery.sap.KeyCodes.ARROW_UP:
				oFocusables = this.$().find(":focusable"); // all tabstops in the control
				iThis = oFocusables.index(oEvent.target);  // focused element index
				if (oFocusables.length > 0) {
					oFocusables.eq(iThis - 1).get(0).focus();	// previous tab stop element
					oEvent.preventDefault();
					oEvent.stopPropagation();
				}
				break;

			case jQuery.sap.KeyCodes.ARROW_DOWN:
			case jQuery.sap.KeyCodes.ARROW_RIGHT:
				oFocusables = this.$().find(":focusable"); // all tabstops in the control
				iThis = oFocusables.index(oEvent.target);  // focused element index
				if (oFocusables.length > 0) {
					oFocusables.eq((iThis + 1 < oFocusables.length) ? iThis + 1 : 0).get(0).focus(); // next tab stop element
					oEvent.preventDefault();
					oEvent.stopPropagation();
				}
				break;
			default:
		}
	};

	ColumnMicroChart.prototype.onkeyup = function(oEvent) {
	    if (oEvent.which == jQuery.sap.KeyCodes.ENTER || oEvent.which == jQuery.sap.KeyCodes.SPACE) {
	        if (!this.fireBarPress(oEvent)) {
		        this.firePress();
		        oEvent.preventDefault();
		    }
	    }
	};


	ColumnMicroChart.prototype.fireBarPress = function(oEvent) {
		var oBar = jQuery(oEvent.target);
		if (oBar && oBar.attr("data-bar-index")) {
			var iIndex = parseInt(oBar.attr("data-bar-index"), 10);
			var oCmcData = this.getColumns()[iIndex];
			if (oCmcData) {
				oCmcData.firePress();
				oEvent.preventDefault();
				oEvent.stopPropagation();
				if (sap.ui.Device.browser.internet_explorer) {
					oBar.focus();
				}
				return true;
			}
		}
		return false;
	};

	ColumnMicroChart.prototype._getBarAltText = function(iBarIndex) {
		var oBar = this.getColumns()[iBarIndex];
		var sMeaning = this.getLocalizedColorMeaning(oBar.getColor());
		return oBar.getLabel() + " " + oBar.getValue() + " " + sMeaning;
	};

	ColumnMicroChart.prototype.setBarPressable = function(iBarIndex, bPressable) {
		if (bPressable) {
			var sBarAltText = this._getBarAltText(iBarIndex);
			jQuery.sap.byId(this.getId() + "-bar-" + iBarIndex).addClass("sapSuiteUiMicroChartPointer").attr("tabindex", 0).attr("title", sBarAltText).attr("role", "presentation").attr("aria-label", sBarAltText);
		} else {
			jQuery.sap.byId(this.getId() + "-bar-" + iBarIndex).removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer").removeAttr("title").removeAttr("role").removeAttr("aria-label");
		}
	};

	ColumnMicroChart.prototype.onsaptabnext = function(oEvent) {
		var oLast = this.$().find(":focusable").last();  // last tabstop in the control
		if (oLast) {
			this._bIgnoreFocusEvt = true;
			oLast.get(0).focus();
		}
	};

	ColumnMicroChart.prototype.onsaptabprevious = function(oEvent) {
		if (oEvent.target.id != oEvent.currentTarget.id) {
			var oFirst = this.$().find(":focusable").first(); // first tabstop in the control
			if (oFirst) {
				oFirst.get(0).focus();
			}
		}
	};

	ColumnMicroChart.prototype.onfocusin = function(oEvent) {
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
	return ColumnMicroChart;

});
