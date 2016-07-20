/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/shape/Rectangle", "sap/gantt/misc/Utility", "sap/ui/core/Core"
], function(Rectangle, Utility, Core){
	"use strict";

	/**
	 * Creates and initializes a new RowBackgroundRectangle class.
	 * 
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings of the new control
	 * 
	 * @class 
	 * RowBackgroundRectangle shape class using SVG tag 'rect'. It's used to represent rows' background rectangle in the tree table of a Gantt chart.
	 * 
	 * @extends sap.gantt.shape.Rectangle
	 * 
	 * @author SAP SE
	 * @version 1.36.8
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.shape.ext.RowBackgroundRectangle
	 */
	var RowBackgroundRectangle = Rectangle.extend("sap.gantt.shape.ext.RowBackgroundRectangle", /** @lends sap.gantt.shape.ext.RowBackgroundRectangle.prototype */ {
		metadata: {
			properties: {
				isBulk: {type: "boolean", defaultValue: true},
				enableSelection: {type: "boolean", defaultValue: false}
			}
		}
	});

	/**
	 * Gets the value of property <code>isBulk</code>.
	 * 
	 * <p>
	 * For performance reasons, Gantt charts perform filtering of data using timestamp. For a background rectangle shape which only needs to draw once in visible areas, set this flag to true.
	 * </p>
	 * 
	 * @name sap.gantt.shape.ext.RowBackgroundRectangle.prototype.getIsBulk
	 * @function
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {boolean} Value of property <code>isBulk</code>.
	 * @public
	 */

	/**
	 * Gets the value of property <code>fill</code>.
	 * 
	 * <p> 
	 * Standard SVG 'fill' attribute.
	 * See {@link http://www.w3.org/TR/SVG/painting.html#FillProperty SVG 1.1 specification for 'fill'}.
	 * <b>Note:</b> You can provide fill with HTML colors and the URL reference to a paint server. Paint server definitions can be retrieved from paint servers rendered by
	 * {@link sap.gantt.GanttChartContainer}, {@link sap.gantt.GanttChartWithTable}, or {@link sap.gantt.GanttChart}.
	 * </p>
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {string} Value of property <code>fill</code>.
	 * @public
	 */
	RowBackgroundRectangle.prototype.getFill = function(oData, oRowInfo) {
		if (this.mShapeConfig.hasShapeProperty("fill")){
			return this._configFirst("fill", oData);
		}
		
		var oChartSchemeMap = this.mChartInstance._oChartSchemesConfigMap;
		var oChartScheme = (oChartSchemeMap && oChartSchemeMap[oRowInfo.chartScheme]) ? oChartSchemeMap[oRowInfo.chartScheme] : undefined;
		if (oChartScheme && oChartScheme.getBackgroundColor()) {
			return oChartScheme.getBackgroundColor();
		}
		return "none";
	};

	/**
	 * Gets the value of property <code>strokeWidth</code>.
	 * 
	 * <p>
	 * Standard SVG 'stroke-width' attribute.
	 * See {@link http://www.w3.org/TR/SVG/painting.html#StrokeWidthProperty SVG 1.1 specification for 'stroke-width'}.
	 * </p>
	 * <p>The default value is 0.</p>
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {number} Value of property <code>strokeWidth</code>.
	 * @public
	 */
	RowBackgroundRectangle.prototype.getStrokeWidth = function(oData, oRowInfo) {
		if (this.mShapeConfig.hasShapeProperty("strokeWidth")) {
			return this._configFirst("strokeWidth", oData);
		}

		return 0;
	};

	/**
	 * Gets the value of property <code>x</code>.
	 * 
	 * <p>
	 * x coordinate of the top-left point of a rectangle.
	 * See {@link http://www.w3.org/TR/SVG/shapes.html#RectElementXAttribute SVG 1.1 specification for the 'x' attribute of 'rect'}.
	 * 
	 * Your application should not configure this value. Instead, the getter calculates the value of x by using the initial coordinate 
	 * of the view boundary for visible areas in a Gantt chart.
	 * </p>
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {number} Value of property <code>x</code>.
	 * @public
	 */
	RowBackgroundRectangle.prototype.getX = function(oData, oRowInfo) {
		if (this.mShapeConfig.hasShapeProperty("x")) {
			return this._configFirst("x", oData);
		}
		
		var aViewRange = this.getShapeViewBoundary();
		if (aViewRange){
			return aViewRange[0];
		}
		return 0;
	};

	/**
	 * Gets the value of property <code>y</code>.
	 * 
	 * <p>
	 * y coordinate of the top-left point of a rectangle.
	 * See {@link http://www.w3.org/TR/SVG/shapes.html#RectElementYAttribute SVG 1.1 specification for the 'y' attribute of 'rect'}.
	 * 
	 * Your application should not configure this value. Instead, the getter calculates the value of y by using parameter <code>oRowInfo</code>.
	 * </p>
	 * <p>The default value is the y coordinate of the row plus 1px, which is the width of the stroke.</p>
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {number} Value of property <code>y</code>.
	 * @public
	 */
	RowBackgroundRectangle.prototype.getY = function(oData, oRowInfo) {
		if (this.mShapeConfig.hasShapeProperty("y")) {
			return this._configFirst("y", oData);
		}
		
		return oRowInfo.y + 1;
	};

	/**
	 * Gets the value of property <code>width</code>.
	 * 
	 * <p>
	 * Width of a rectangle.
	 * See {@link http://www.w3.org/TR/SVG/shapes.html#RectElementWidthAttribute SVG 1.1 specification for the 'width' attribute of 'rect'}.
	 * 
	 * Your application should not configure this value. Instead, the getter calculates the value of width by using the view boundary for visible areas in a Gantt chart.
	 * If your application overwrites the getter using configuration or code, accurate results cannot be guaranteed.
	 * </p>
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {number} Value of property <code>width</code>.
	 * @public
	 */
	RowBackgroundRectangle.prototype.getWidth = function(oData, oRowInfo) {
		if (this.mShapeConfig.hasShapeProperty("width")) {
			return this._configFirst("width", oData);
		}
		
		var aViewRange = this.getShapeViewBoundary();
		if (aViewRange){
			return aViewRange[1] - aViewRange[0];
		}
		return 0;
	};

	/**
	 * Gets the value of property <code>height</code>.
	 * 
	 * <p>
	 * Height of a rectangle.
	 * See {@link http://www.w3.org/TR/SVG/shapes.html#RectElementHeightAttribute SVG 1.1 specification for the 'height' attribute of 'rect'}.
	 * </p>
	 * <p>The default value is the height of the row minus 1px, which is the width of stroke.</p>
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {number} Value of property <code>height</code>.
	 * @public
	 */
	RowBackgroundRectangle.prototype.getHeight = function(oData, oRowInfo) {
		if (this.mShapeConfig.hasShapeProperty("height")) {
			return this._configFirst("height", oData);
		}
		
		return oRowInfo.rowHeight - 1;
	};

	/**
	 * Filter all data in visible areas to get valid rows' data, only these valid rows must have a background rectangle drawn, 
	 * which is filled in a certain color.
	 * 
	 * @param {array} aRowDatas data of all rows in visible areas.
	 * @return {array} data of valid rows that must have a background rectangle drawn.
	 * @public
	 */
	RowBackgroundRectangle.prototype.filterValidData = function(aRowDatas) {
		if (aRowDatas.length > 0){
			var oChart = this.mChartInstance;
			var oChartSchemeMap = oChart._oChartSchemesConfigMap;
			var oObjectTypeMap = oChart._oObjectTypesConfigMap;
			return $.grep(aRowDatas, function(oValue, iIndex) {
				var oChartScheme;
				if (oValue.__group) {
					oChartScheme = (oChartSchemeMap && oChartSchemeMap[oValue.__group]) ? oChartSchemeMap[oValue.__group] : undefined;
				} else {
					var oObjectType = (oObjectTypeMap && oObjectTypeMap[oValue.type]) ? oObjectTypeMap[oValue.type] : undefined;
					if (oObjectType) {
						oChartScheme = (oChartSchemeMap && oChartSchemeMap[oObjectType.getMainChartSchemeKey()]) ? oChartSchemeMap[oObjectType.getMainChartSchemeKey()] : undefined;
					}
				}
				if (oChartScheme && oChartScheme.getBackgroundColor()) {
					return oValue;
				}
			});
		}
		return aRowDatas;
	};
	
	/**
	 * Indicates whether your application must use HtmlClass to decide the color of background.
	 * If the theme is sap_bluecrystal, the application can use custom configuration value for fill property, but if the theme is sap_hcb,
	 * the application must use HtmlClass instead.
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {boolean} Value indicates whether HtmlClass must be used to decide the color of the background.
	 */
	RowBackgroundRectangle.prototype.getHtmlClass = function(oData, oRowInfo) {
		if (Core.getConfiguration().getTheme() === "sap_hcb") {
			return true;
		}
		return false;
	};

	return RowBackgroundRectangle;
}, true);
