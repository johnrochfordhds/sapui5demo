/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/Element'
], function (jQuery, Element) {
	"use strict";
	/**
	 * Creates and initializes a new toolbar scheme
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Defines the Toolbar scheme
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.36.8
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.config.ToolbarScheme
	 */
	var ToolbarScheme = Element.extend("sap.gantt.config.ToolbarScheme", /** @lends sap.gantt.config.ToolbarScheme.prototype */ {
		metadata: {
			properties: {
				/**
				 * Unique key of the toolbar scheme
				 */
				key: {type: "string", defaultValue: null},
				/**
				 * Toolbar group for selecting a source
				 */
				sourceSelect: {type: "sap.gantt.config.ToolbarGroup", defaultValue: null},
				/**
				 * Toolbar group for the Gantt chart layout
				 */
				layout: {type: "sap.gantt.config.LayoutGroup", defaultValue: null},
				/**
				 * Toolbar group for custom toolbar items
				 */
				customToolbarItems: {type: "sap.gantt.config.ToolbarGroup", defaultValue: null},
				/**
				 * Toolbar group for expanding a chart
				 */
				expandChart: {type: "sap.gantt.config.ExpandChartGroup", defaultValue: null},
				/**
				 * Toolbar group for expanding nodes of a tree table
				 */
				expandTree: {type: "sap.gantt.config.ToolbarGroup", defaultValue: null},
				/**
				 * Toolbar group for the time zoom
				 */
				timeZoom: {type: "sap.gantt.config.ToolbarGroup", defaultValue: null},
				/**
				 * Toolbar group for legend
				 */
				legend: {type: "sap.gantt.config.ToolbarGroup", defaultValue: null},
				/**
				 * See {@link sap.gantt.config.SettingGroup}
				 */
				settings: {type: "sap.gantt.config.SettingGroup", defaultValue: null},
				/**
				 * See {@link sap.gantt.config.ModeGroup}
				 */
				mode: {type: "sap.gantt.config.ModeGroup", defaultValue: null},
				/**
				 * Toolbar design. See {@link sap.m.ToolbarDesign}
				 */
				toolbarDesign: {type: "string", defaultValue: sap.m.ToolbarDesign.Auto}
			}
		}
	});
	
	return ToolbarScheme;
}, true);