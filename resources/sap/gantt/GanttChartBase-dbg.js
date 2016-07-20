/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'jquery.sap.global', './library', 'sap/ui/core/Control',
	"./misc/Utility", "./config/TimeHorizon"
], function (jQuery, library, Control, Utility, TimeHorizon) {
	"use strict";

	/**
	 * Creates and initializes a new Gantt chart.
	 * 
	 * @param {string} [sId] ID for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * 
	 * @class 
	 * Base class for all Gantt charts.
	 * 
	 * <p>This base class defines:
	 * <ul>
	 * 		<li>Basic properties and aggregations.</li>
	 * 		<li>Metadata required integrate with GanttChartContainer.</li>
	 * </ul>
	 * sap.gantt provides two basic implementations of <code>GanttChartBase</code>:
	 * <ul>
	 * 		<li><code>sap.gantt.GanttChart</code> - A chart area that contains rows along the vertical axis and a time scale along the horizontal axis.</li>
	 * 		<li><code>sap.gantt.GanttChartWithTable</code> - A tree table and a chart area separated by a splitter with rows synchronized.</li>
	 * </ul>
	 * </p>
	 * 
	 * @extends sap.ui.core.Control
	 * @abstract
	 * 
	 * @author SAP SE
	 * @version 1.36.8
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.GanttChartBase
	 */
	var GanttChartBase = Control.extend("sap.gantt.GanttChartBase", /** @lends sap.gantt.GanttChartBase.prototype */ {
		metadata: {
			"abstract": true,
			library: "sap.gantt",
			
			properties: {
				
				/**
				 * Width of the control.
				 */
				width: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},
				
				/**
				 * Height of the control.
				 */
				height: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},
				
				/**
				 * Switch to show and hide the cursor line that follows the cursor.
				 */
				enableCursorLine: {type: "boolean", defaultValue: true},
				
				/**
				 * Switch to show and hide the present time indicator
				 */
				enableNowLine: {type: "boolean", defaultValue: true},
				
				/**
				 * Switch to show and hide vertical lines representing intervals along the time axis
				 */
				enableVerticalLine: {type: "boolean", defaultValue: true},
				
				/**
				 * Zoom level in float.
				 * 
				 * This property allows application developers to control the zoom level. 
				 * When GanttChart is embedded in <code>sap.gantt.GanttChartContainer</code>, you do not have to manage this property.
				 */
				timeZoomRate: {type: "float", defaultValue: 1},
				
				/**
				 * Current mode of the Gantt chart.
				 * 
				 * If no value is provided, GanttChart uses a default mode key.
				 */
				mode: {type: "string", defaultValue: sap.gantt.config.DEFAULT_MODE_KEY},
				
				/**
				 * Selection mode for GanttChart
				 * 
				 * This property controls whether multiToggle or multi-selection mode is enabled for the tree table and
				 * for shapes. It may also affect the visual appearance, such as whether check boxes are available for selection.
				 */
				selectionMode: {type : "sap.gantt.SelectionMode", defaultValue : sap.gantt.SelectionMode.MultiWithKeyboard},
				
				/**
				 * If the implementation contains a selection panel, this is the initial width.
				 * 
				 * In the current library, <code>sap.gantt.GanttChart</code> does not have a selection panel. 
				 * <code>sap.gantt.GanttChart</code> has a selection panel implemented by <code>sap.ui.table.TreeTable</code>.
				 */
				selectionPanelSize: {type: "sap.ui.core.CSSSize", defaultValue: "30%"},
				
				/**
				 * Current hierarchy key referencing from configuration property <code>hierarchies</code>.
				 * 
				 * If <code>source select group</code> is enabled in the Gantt chart toolbar, the current hierarchy name referenced from <code>hierarchies</code>
				 * by this property is shown.
				 * For applications that do not require this function, this property can be ignored and a default value is used.
				 */
				hierarchyKey: {type: "string", defaultValue: sap.gantt.config.DEFAULT_HIERARCHY_KEY},

				/**
				 * SVG reusable element definitions.
				 * 
				 * If this property is provided, the paint server definition of the SVG is rendered. Method <code>getDefString()</code> should be
				 * implemented by all paint server classes that are passed in in this property.
				 */
				svgDefs: {type: "sap.gantt.def.SvgDefs", defaultValue: null},

				/**
				 * Configuration of the time axis.
				 *
				 * Planning horizon, initial horizon, and zoom level can be configured with this property. If not provided, a default
				 * configuration is provided.
				 */
				timeAxis: {type: "sap.gantt.config.TimeAxis", defaultValue: sap.gantt.config.DEFAULT_TIME_AXIS},
				
				/**
				 * Configuration of available modes.
				 *
				 * List of available modes. To apply modes to toolbar and shapes, further configuration is needed. If not provided, a default
				 * configuration is provided.
				 */
				modes: {type: "array", defaultValue: sap.gantt.config.DEFAULT_MODES},
				
				/**
				 * Configuration of toolbar schemes.
				 *
				 * List of available toolbar shcemes. If not provided, a default configuration is provided.
				 */
				toolbarSchemes: {type: "array", defaultValue: sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEMES},
				
				/**
				 * Configuration of hierarchies.
				 *
				 * List of available hierarchies. If not provided, a default configuration is provided.
				 */
				hierarchies: {type: "array", defaultValue: sap.gantt.config.DEFAULT_HIERARCHYS},
				
				/**
				 * Configuration of object types.
				 *
				 * List of available object types. If not provided, a default configuration is provided.
				 */
				objectTypes: {type: "array", defaultValue: sap.gantt.config.DEFAULT_OBJECT_TYPES},
				
				/**
				 * Configuration of chart schemes.
				 *
				 * List of available chart schemes. If not provided, a default configuration is provided.
				 */
				chartSchemes: {type: "array", defaultValue: sap.gantt.config.DEFAULT_CHART_SCHEMES},

				/**
				 * Configuration of locale settings.
				 *
				 * Most locale settings can be configured in sap.ui.configuration objects. Only the time zone and day-light-saving time option
				 * are provided by locale settings.
				 */
				locale: {type: "sap.gantt.config.Locale", defaultValue: sap.gantt.config.DEFAULT_LOCALE_CET},
				
				/**
				 * Configuration of shape data names.
				 * 
				 * List of available shape data names. This configuration must be provided if SVG graphics are needed.
				 */
				shapeDataNames: {type: "array", defaultValue: []},
				
				/**
				 * Configuration of shape data against shape classes.
				 *
				 * List of available shapes. The shapes configured in this list are initialized inside <code>sap.gantt.GanttChartBase</code>.
				 * Note that for JSON data binding, this configuration supports deep structured data structures. For ODATA binding, only one level is supported.
				 */
				shapes: {type: "array", defaultValue: []}
			},
			
			aggregations: {

				/**
				 * Rows of <code>sap.gantt.GanttChartBase</code>
				 *
				 * This aggregation is delegated to <code>sap.gantt.table.TreeTable</code>. Rows are provide a base for
				 * shapes with a category of <code>"InRowShape"</code>. The configuration in property <code>shapes</code>
				 * determines how the shapes are drawn.
				 */
				rows: {type: "sap.ui.core.Control", multiple: true, singularName: "row", bindable: "bindable", visibility: "public"},
					
				/**
				 * Relationships of shapes carried by rows.
				 *
				 * Similar to rows, this aggregation does not request templates either. Relationships are a special shape with a category of 
				 * <code>"crossRowShape"</code>. How relationships are drawn is also specified in configuration property <code>shapes</code>.
				 */
				relationships: {type: "sap.ui.core.Control", multiple: true, bindable: "bindable", visibility: "public"},
				
				/**
				 * Paint servers consumed by special shape <code>sap.gantt.shape.cal.Calendar</code>.
				 *
				 * This aggregation is designed to improve performance of calendar shapes. Rows usually share a similar definition with calendar shapes.
				 * It is possible to define a Calendar paint server to draw only one rectangle for each row. Notes for classes extended from
				 * <code>sap.gantt.def.cal.CalendarDef</code>: Different from property <code>paintServerDefs</code>, paint servers defined here must
				 * implement method <code>getDefNode()</code> instead of method <code>getDefString()</code>.
				 */	
				calendarDef: {type: "sap.gantt.def.cal.CalendarDefs", multiple: false, bindable: "bindable", visibility: "public"}
			},
			
			events: {
				
				/**
				 * Event fired when the hierarchy key has changed in the Gantt chart toolbar.
				 */
				ganttChartSwitchRequested: {
					parameters: {
						/**
						 * Target hierarchy key.
						 */
						hierarchyKey: {type: "string"}
					}
				},
				
				/**
				 * Splitter (if exists) resized.
				 *
				 * If a splitter exists and synchronization is needed with other Gantt charts in the container, use this event. 
				 * You can listen for this event and obtain <code>zoomInfo</code>.
				 *
				 */
				splitterResize: {
					parameters : {
						/**
						 * ID of the source control.
						 */
						id : {type : "string"},

						/**
						 * Old size in the form of [height, width].
						 */
						oldSizes : {type : "int[]"},

						/**
						 * New size in the form of [height, width].
						 */
						newSizes : {type : "int[]"},

						/**
						 * Zoom information.
						 *
						 * This object contains all related information for the listener to get the current zoom level of the time axis.
						 * Usually <code>zoomInfo</code> contains the following information:
						 * <ul>
						 * 	<li><code>"base"</code> - Base for zooming calculation.
						 *		<ul>
						 * 			<li><code>"sGranularity"</code>: "4day", - Zoom level that is used to calculate the zoom base; it is taken from timeAxis.granularity.</li>
						 * 			<li><code>"fScale"</code>: 3840000 - Base scale determined by zoomStrategy level and now().</li>
						 * 		</ul>
						 * 	</li>
						 * 	<li><code>"determinedByConfig"</code> - Zoom level calculated by configuration <code>timeAxis</code>.
						 * 		<ul>
						 * 			<li><code>"fRate"</code>: 1, - Zoom rate determined by configuration timeAxis.granularity.</li>
						 * 			<li><code>"fMaxRate"</code>: 384, - Maximum zoom rate determined by configuration timeAxis.finestGranularity.</li>
						 * 			<li><code>"fMinRate"</code>: 0.02197802197802198 - Minimum zoom rate determined by configuration timeAxis.coarsestGranularity.</li>
						 * 		</ul>
						 * 	</li>
						 * 	<li><code>"determinedByChartWidth"</code> - Zoom level calculated by the SVG width.
						 * 		<ul>
						 * 			<li><code>"fMinRate"</code>: 0.0279009617614573, - Minimum zoom rate determined by the chart width and configuration timeAxis.planHorizon.</li>
						 * 			<li><code>"fSuitableRate"</code>: 0.5078804440909039 - Suitable zoom rate determined by the chart width and configuration timeAxis.initHorizon.</li>
						 * 		</ul>					 
						 * 	</li>
						 * 	<li><code>iChartWidth</code>: 417 - Chart width in pixel.</li>
						 * </ul>
						 */
						zoomInfo: {type: "object"}
					}
				},
				
				/**
				 * Horizontal (time axis) scroll.
				 *
				 * If the horizontal scroll bar exists and synchronization is needed with other Gantt charts in the container, use this event. 
				 */
				horizontalScroll: {
					parameters: {
						/**
						 * Scroll steps.
						 */
						scrollSteps: {type: "int"}
					}
				},
				
				/**
				 * Vertical (row axis) scroll.
				 *
				 * If the vertical scroll bar exists and synchronization is needed with other Gantt charts in the container, use this event. 
				 */
				verticalScroll: {
					parameters: {
						/**
						 * Scroll steps.
						 */
						scrollSteps: {type: "int"}
					}
				},

				/**
				 * Event is fired when a mouse-hover occurs in the graphic part.
				 */
				chartMouseOver: {
					parameters: {
						/**
						 * Row object information of the current mouse point.
						 */
						objectInfo: {type: "object"},

						/**
						 * Leading row object information. null when it is the main row at current mouse point; main row information if it is one of multiple expanded rows.
						 */
						leadingRowInfo: {type: "object"},

						/**
						 * Timestamp of the current mouse point.
						 */
						timestamp: {type: "string"},

						/**
						 * ID of SVG.
						 */
						svgId: {type: "string"},

						/**
						 * [x, y] Coordinate of the current mouse point in the SVG coordinate system.
						 */
						svgCoordinate: {type: "int[]"},

						/**
						 * Effective mode. It can be the current Gantt Chart mode or the mode derived from the chart scheme mode.
						 */
						effectingMode: {type: "string"},

						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}
					}
				},
				
				/**
				 * Event fired when the chart is double-clicked
				 */
				chartDoubleClick: {
					parameters:{
						/**
						 * Row object information of the current mouse point.
						 */
						objectInfo: {type: "object"},

						/**
						 * Leading row object information. null when it is the main row at current mouse point; main row information if it is one of multiple expanded rows.
						 */
						leadingRowInfo: {type: "object"},

						/**
						 * Timestamp of the current mouse point.
						 */
						timestamp: {type: "string"},

						/**
						 * ID of SVG.
						 */
						svgId: {type: "string"},

						/**
						 * [x, y] Coordinate of the current mouse point in the SVG coordinate system.
						 */
						svgCoordinate: {type: "int[]"},

						/**
						 * Effective mode. It can be the current Gantt Chart mode or the mode derived from the chart scheme mode.
						 */
						effectingMode: {type: "string"},

						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}
					}
				},
				
				/**
				 * Event fired when the chart is right-clicked
				 */
				chartRightClick: {
					parameters:{
						/**
						 * Row object information of the current mouse point.
						 */
						objectInfo: {type: "object"},

						/**
						 * Leading row object information. null when it is the main row at current mouse point; main row information if it is one of multiple expanded rows.
						 */
						leadingRowInfo: {type: "object"},

						/**
						 * Timestamp of the current mouse point.
						 */
						timestamp: {type: "string"},

						/**
						 * ID of SVG.
						 */
						svgId: {type: "string"},

						/**
						 * [x, y] Coordinate of the current mouse point in the SVG coordinate system.
						 */
						svgCoordinate: {type: "int[]"},

						/**
						 * Effective mode. It can be the current Gantt Chart mode or a mode derived from the chart scheme mode.
						 */
						effectingMode: {type: "string"},

						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}
					}
				},
				
				//Be used in Gantt to handle dragging shapes between different ganttCharts
				chartDragEnter: {
					parameters: {
						originEvent: {type: "object"}
					}
				},
				
				//Be used in Gantt to handle dragging shapes between different ganttCharts
				chartDragLeave: {
					parameters: {
						originEvent: {type: "object"},
						draggingSource: {type: "object"}
					}
				},
				
				/**
				 * Event fired when the selection status of rows changes.
				 */
				rowSelectionChange: {
					parameters: {
						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}
					}
				
				},
				
				/**
				 * Event fired when the selection status of relationships changes.
				 */
				relationshipSelectionChange: {
					parameters: {
						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}
					}
				},
				
				/**
				 * Event fired when the selection status of shapes changes.
				 */
				shapeSelectionChange: {
					parameters: {
						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}
					}
				},
				
				/**
				 * Event fired when a drag-and-drop occurs on one or more selected shapes.
				 */
				shapeDragEnd: {
					parameters: {
						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"},

						/**
						 * List of source shape data.
						 */
						sourceShapeData: {type: "object[]"},

						/**
						 * Source SVG ID.
						 */
						sourceSvgId: {type: "string"},

						/**
						 * List of target shape data. Sorted by shape level.
						 */
						targetData: {type: "object[]"},

						/**
						 * Target SVG ID.
						 */
						targetSvgId: {type: "string"}
					}
				}
				
			}
		}
	});
	
	// enable calling 'bindAggregation("rows")' without a factory
	GanttChartBase.getMetadata().getAllAggregations()["rows"]._doesNotRequireFactory = true;
	// enable calling 'bindAggrgation("rows")' without a factory
	GanttChartBase.getMetadata().getAllAggregations()["relationships"]._doesNotRequireFactory = true;
	
	/**
	 * Jumps to a given time.
	 * 
	 * This method sets the position of the visible area to a certain timestamp. It can be used to implement the function of
	 * Jump To First, Jump To Last, and Jump To Current.
	 * 
	 * A Redraw of SVG is triggered.
	 * 
	 * @name sap.gantt.GanttChartBase.prototype.jumpToPosition
	 * @function
	 * 
	 * @param {timestamp} vDate Accepted value is a 14-digit timestamp or a Date object.
	 * @public
	 */

	/**
	 * Provides the Ordinal Axis that is used to draw the SVG graphic.
	 *
	 * This method is intended to allow access to the ordinal axis. Do not change the ordinal axis.
	 * All subclasses must provide implementations.
	 *
	 * @name sap.gantt.GanttChartBase.prototype.getAxisOrdinal
	 * @function
	 *
	 * @return {sap.gantt.misc.AxisOrdinal} Returns the axis ordinal instance.
	 * @public
	 */

	/**
	 * Provides the Time Axis that is used to draw the SVG graphic.
	 *
	 * This method is intended to allow access to the time axis. Do not change the time axis.
	 * All subclasses must provide implementations.
	 *
	 * @name sap.gantt.GanttChartBase.prototype.getAxisTime
	 * @function
	 *
	 * @return {sap.gantt.misc.AxisTime} Returns the axis time instance.
	 * @public
	 */

	/**
	 * Notify that the data source had changed.
	 * 
	 * @protected
	 */
	GanttChartBase.prototype.notifySourceChange = function(){

	};
	
	return GanttChartBase;
}, true);
