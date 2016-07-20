/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartform.Layout.
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Element'
], function(jQuery, library, Element) {
	"use strict";

	/**
	 * Constructor for a new smartform/Layout.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class Layout settings to adjust ResponsiveGridLayout.
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartform.Layout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Layout = Element.extend("sap.ui.comp.smartform.Layout", /** @lends sap.ui.comp.smartform.Layout.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Default span for labels in large size. This span is only used if more than 1 container is in one line, if only 1 container is in
				 * the line the labelSpanM value is used.
				 */
				labelSpanL: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Default span for labels in medium size. This property is used for full size containers. If more than one Container is in one line,
				 * labelSpanL is used.
				 */
				labelSpanM: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Default span for labels in small size.
				 */
				labelSpanS: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Number of grid cells that are empty at the end of each line on large size.
				 */
				emptySpanL: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Number of grid cells that are empty at the end of each line on medium size.
				 */
				emptySpanM: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Number of grid cells that are empty at the end of each line on small size.
				 */
				emptySpanS: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Number of columns for large size.<br>
				 * The number of columns for large size must not be smaller than the number of columns for medium size.
				 */
				columnsL: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Number of columns for medium size.
				 */
				columnsM: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If the SmartForm contains only one single Group and this property is set, the Group is displayed using the full size of the
				 * SmartForm. In this case the properties columnsL and columnsM are ignored.<br>
				 * In all other cases the Group is displayed in the size of one column.
				 *
				 * @since 1.34.1
				 */
				singleGroupFullSize: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Breakpoint (in pixel) between Medium size and Large size.
				 */
				breakpointL: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * reakpoint (in pixel) between Small size and Medium size.
				 */
				breakpointM: {
					type: "int",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * A string type that represents Grid's span values for large, medium and small screens. Allowed values are separated by space Letters
				 * L, M or S followed by number of columns from 1 to 12 that the container has to take, for example: "L2 M4 S6", "M12", "s10" or "l4
				 * m4". Note that the parameters has to be provided in the order large medium small.<br>
				 * The value set here will be set to all group elements when used with horizontal layout (smart form property useHorizontalLayout)
				 */
				gridDataSpan: {
					type: "sap.ui.layout.GridSpan",
					group: "Misc",
					defaultValue: ""
				}
			}
		}
	});

	return Layout;

}, /* bExport= */true);