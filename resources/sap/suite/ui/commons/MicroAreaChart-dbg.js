/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.suite.ui.commons.MicroAreaChart.
jQuery.sap.declare("sap.suite.ui.commons.MicroAreaChart");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new MicroAreaChart.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize (default: '200px')</li>
 * <li>{@link #getHeight height} : sap.ui.core.CSSSize (default: '190px')</li>
 * <li>{@link #getMaxXValue maxXValue} : float</li>
 * <li>{@link #getMinXValue minXValue} : float</li>
 * <li>{@link #getMaxYValue maxYValue} : float</li>
 * <li>{@link #getMinYValue minYValue} : float</li>
 * <li>{@link #getView view} : sap.suite.ui.commons.MicroAreaChartView (default: sap.suite.ui.commons.MicroAreaChartView.Normal)</li>
 * <li>{@link #getColorPalette colorPalette} : string[] (default: [])</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getChart chart} : sap.suite.ui.commons.MicroAreaChartItem</li>
 * <li>{@link #getMaxThreshold maxThreshold} : sap.suite.ui.commons.MicroAreaChartItem</li>
 * <li>{@link #getInnerMaxThreshold innerMaxThreshold} : sap.suite.ui.commons.MicroAreaChartItem</li>
 * <li>{@link #getInnerMinThreshold innerMinThreshold} : sap.suite.ui.commons.MicroAreaChartItem</li>
 * <li>{@link #getMinThreshold minThreshold} : sap.suite.ui.commons.MicroAreaChartItem</li>
 * <li>{@link #getTarget target} : sap.suite.ui.commons.MicroAreaChartItem</li>
 * <li>{@link #getFirstXLabel firstXLabel} : sap.suite.ui.commons.MicroAreaChartLabel</li>
 * <li>{@link #getFirstYLabel firstYLabel} : sap.suite.ui.commons.MicroAreaChartLabel</li>
 * <li>{@link #getLastXLabel lastXLabel} : sap.suite.ui.commons.MicroAreaChartLabel</li>
 * <li>{@link #getLastYLabel lastYLabel} : sap.suite.ui.commons.MicroAreaChartLabel</li>
 * <li>{@link #getMaxLabel maxLabel} : sap.suite.ui.commons.MicroAreaChartLabel</li>
 * <li>{@link #getMinLabel minLabel} : sap.suite.ui.commons.MicroAreaChartLabel</li>
 * <li>{@link #getLines lines} : sap.suite.ui.commons.MicroAreaChartItem[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.MicroAreaChart#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * This control displays the history of values as a line mini chart or an area mini chart.
 * @extends sap.ui.core.Control
 * @version 1.36.8
 *
 * @constructor
 * @public
 * @deprecated Since version 1.34. 
 * Deprecated. sap.suite.ui.microchart.AreaMicroChart should be used.
 * @name sap.suite.ui.commons.MicroAreaChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.MicroAreaChart", { metadata : {

	deprecated : true,
	library : "sap.suite.ui.commons",
	properties : {
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '200px'},
		"height" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '190px'},
		"maxXValue" : {type : "float", group : "Misc", defaultValue : null},
		"minXValue" : {type : "float", group : "Misc", defaultValue : null},
		"maxYValue" : {type : "float", group : "Misc", defaultValue : null},
		"minYValue" : {type : "float", group : "Misc", defaultValue : null},
		"view" : {type : "sap.suite.ui.commons.MicroAreaChartView", group : "Appearance", defaultValue : sap.suite.ui.commons.MicroAreaChartView.Normal},
		"colorPalette" : {type : "string[]", group : "Misc", defaultValue : []}
	},
	aggregations : {
		"chart" : {type : "sap.suite.ui.commons.MicroAreaChartItem", multiple : false}, 
		"maxThreshold" : {type : "sap.suite.ui.commons.MicroAreaChartItem", multiple : false}, 
		"innerMaxThreshold" : {type : "sap.suite.ui.commons.MicroAreaChartItem", multiple : false}, 
		"innerMinThreshold" : {type : "sap.suite.ui.commons.MicroAreaChartItem", multiple : false}, 
		"minThreshold" : {type : "sap.suite.ui.commons.MicroAreaChartItem", multiple : false}, 
		"target" : {type : "sap.suite.ui.commons.MicroAreaChartItem", multiple : false}, 
		"firstXLabel" : {type : "sap.suite.ui.commons.MicroAreaChartLabel", multiple : false}, 
		"firstYLabel" : {type : "sap.suite.ui.commons.MicroAreaChartLabel", multiple : false}, 
		"lastXLabel" : {type : "sap.suite.ui.commons.MicroAreaChartLabel", multiple : false}, 
		"lastYLabel" : {type : "sap.suite.ui.commons.MicroAreaChartLabel", multiple : false}, 
		"maxLabel" : {type : "sap.suite.ui.commons.MicroAreaChartLabel", multiple : false}, 
		"minLabel" : {type : "sap.suite.ui.commons.MicroAreaChartLabel", multiple : false}, 
		"lines" : {type : "sap.suite.ui.commons.MicroAreaChartItem", multiple : true, singularName : "line"}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.MicroAreaChart with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.suite.ui.commons.MicroAreaChart.extend
 * @function
 */

sap.suite.ui.commons.MicroAreaChart.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>width</code>.
 * The width of the chart.
 *
 * Default value is <code>200px</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is <code>200px</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setWidth
 * @function
 */


/**
 * Getter for property <code>height</code>.
 * The height of the chart.
 *
 * Default value is <code>190px</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>height</code>
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getHeight
 * @function
 */

/**
 * Setter for property <code>height</code>.
 *
 * Default value is <code>190px</code> 
 *
 * @param {sap.ui.core.CSSSize} sHeight  new value for property <code>height</code>
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setHeight
 * @function
 */


/**
 * Getter for property <code>maxXValue</code>.
 * If this property is set it indicates the value X axis ends with.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>maxXValue</code>
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getMaxXValue
 * @function
 */

/**
 * Setter for property <code>maxXValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fMaxXValue  new value for property <code>maxXValue</code>
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setMaxXValue
 * @function
 */


/**
 * Getter for property <code>minXValue</code>.
 * If this property is set it indicates the value X axis starts with.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>minXValue</code>
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getMinXValue
 * @function
 */

/**
 * Setter for property <code>minXValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fMinXValue  new value for property <code>minXValue</code>
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setMinXValue
 * @function
 */


/**
 * Getter for property <code>maxYValue</code>.
 * If this property is set it indicates the value Y axis ends with.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>maxYValue</code>
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getMaxYValue
 * @function
 */

/**
 * Setter for property <code>maxYValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fMaxYValue  new value for property <code>maxYValue</code>
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setMaxYValue
 * @function
 */


/**
 * Getter for property <code>minYValue</code>.
 * If this property is set it indicates the value Y axis starts with.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>minYValue</code>
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getMinYValue
 * @function
 */

/**
 * Setter for property <code>minYValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fMinYValue  new value for property <code>minYValue</code>
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setMinYValue
 * @function
 */


/**
 * Getter for property <code>view</code>.
 * The view of the chart.
 *
 * Default value is <code>Normal</code>
 *
 * @return {sap.suite.ui.commons.MicroAreaChartView} the value of property <code>view</code>
 * @public
 * @since 1.25
 * @name sap.suite.ui.commons.MicroAreaChart#getView
 * @function
 */

/**
 * Setter for property <code>view</code>.
 *
 * Default value is <code>Normal</code> 
 *
 * @param {sap.suite.ui.commons.MicroAreaChartView} oView  new value for property <code>view</code>
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.25
 * @name sap.suite.ui.commons.MicroAreaChart#setView
 * @function
 */


/**
 * Getter for property <code>colorPalette</code>.
 * The color palette for the chart. If this property is set, semantic colors defined in MicroAreaChartItem are ignored. Colors from the palette are assigned to each line consequentially. When all the palette colors are used, assignment of the colors begins from the first palette color.
 *
 * Default value is <code>[]</code>
 *
 * @return {string[]} the value of property <code>colorPalette</code>
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#getColorPalette
 * @function
 */

/**
 * Setter for property <code>colorPalette</code>.
 *
 * Default value is <code>[]</code> 
 *
 * @param {string[]} aColorPalette  new value for property <code>colorPalette</code>
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#setColorPalette
 * @function
 */


/**
 * Getter for aggregation <code>chart</code>.<br/>
 * The configuration of the actual values line. The color property defines the color of the line. Points are rendered in the same sequence as in this aggregation.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartItem}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getChart
 * @function
 */


/**
 * Setter for the aggregated <code>chart</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartItem} oChart
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setChart
 * @function
 */
	

/**
 * Destroys the chart in the aggregation 
 * named <code>chart</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyChart
 * @function
 */


/**
 * Getter for aggregation <code>maxThreshold</code>.<br/>
 * The configuration of the max threshold area. The color property defines the color of the area above the max threshold line. Points are rendered in the same sequence as in this aggregation.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartItem}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getMaxThreshold
 * @function
 */


/**
 * Setter for the aggregated <code>maxThreshold</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartItem} oMaxThreshold
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setMaxThreshold
 * @function
 */
	

/**
 * Destroys the maxThreshold in the aggregation 
 * named <code>maxThreshold</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyMaxThreshold
 * @function
 */


/**
 * Getter for aggregation <code>innerMaxThreshold</code>.<br/>
 * The configuration of the upper line of the inner threshold area. The color property defines the color of the area between inner thresholds. For rendering of the inner threshold area, both innerMaxThreshold and innerMinThreshold aggregations must be defined. Points are rendered in the same sequence as in this aggregation.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartItem}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getInnerMaxThreshold
 * @function
 */


/**
 * Setter for the aggregated <code>innerMaxThreshold</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartItem} oInnerMaxThreshold
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setInnerMaxThreshold
 * @function
 */
	

/**
 * Destroys the innerMaxThreshold in the aggregation 
 * named <code>innerMaxThreshold</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyInnerMaxThreshold
 * @function
 */


/**
 * Getter for aggregation <code>innerMinThreshold</code>.<br/>
 * The configuration of the bottom line of the inner threshold area. The color property is ignored. For rendering of the inner threshold area, both innerMaxThreshold and innerMinThreshold aggregations must be defined. Points are rendered in the same sequence as in this aggregation.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartItem}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getInnerMinThreshold
 * @function
 */


/**
 * Setter for the aggregated <code>innerMinThreshold</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartItem} oInnerMinThreshold
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setInnerMinThreshold
 * @function
 */
	

/**
 * Destroys the innerMinThreshold in the aggregation 
 * named <code>innerMinThreshold</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyInnerMinThreshold
 * @function
 */


/**
 * Getter for aggregation <code>minThreshold</code>.<br/>
 * The configuration of the min threshold area. The color property defines the color of the area below the min threshold line. Points are rendered in the same sequence as in this aggregation.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartItem}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getMinThreshold
 * @function
 */


/**
 * Setter for the aggregated <code>minThreshold</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartItem} oMinThreshold
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setMinThreshold
 * @function
 */
	

/**
 * Destroys the minThreshold in the aggregation 
 * named <code>minThreshold</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyMinThreshold
 * @function
 */


/**
 * Getter for aggregation <code>target</code>.<br/>
 * The configuration of the target values line. The color property defines the color of the line. Points are rendered in the same sequence as in this aggregation.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartItem}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getTarget
 * @function
 */


/**
 * Setter for the aggregated <code>target</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartItem} oTarget
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setTarget
 * @function
 */
	

/**
 * Destroys the target in the aggregation 
 * named <code>target</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyTarget
 * @function
 */


/**
 * Getter for aggregation <code>firstXLabel</code>.<br/>
 * The label on X axis for the first point of the chart.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartLabel}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getFirstXLabel
 * @function
 */


/**
 * Setter for the aggregated <code>firstXLabel</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartLabel} oFirstXLabel
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setFirstXLabel
 * @function
 */
	

/**
 * Destroys the firstXLabel in the aggregation 
 * named <code>firstXLabel</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyFirstXLabel
 * @function
 */


/**
 * Getter for aggregation <code>firstYLabel</code>.<br/>
 * The label on Y axis for the first point of the chart.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartLabel}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getFirstYLabel
 * @function
 */


/**
 * Setter for the aggregated <code>firstYLabel</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartLabel} oFirstYLabel
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setFirstYLabel
 * @function
 */
	

/**
 * Destroys the firstYLabel in the aggregation 
 * named <code>firstYLabel</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyFirstYLabel
 * @function
 */


/**
 * Getter for aggregation <code>lastXLabel</code>.<br/>
 * The label on X axis for the last point of the chart.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartLabel}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getLastXLabel
 * @function
 */


/**
 * Setter for the aggregated <code>lastXLabel</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartLabel} oLastXLabel
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setLastXLabel
 * @function
 */
	

/**
 * Destroys the lastXLabel in the aggregation 
 * named <code>lastXLabel</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyLastXLabel
 * @function
 */


/**
 * Getter for aggregation <code>lastYLabel</code>.<br/>
 * The label on Y axis for the last point of the chart.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartLabel}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getLastYLabel
 * @function
 */


/**
 * Setter for the aggregated <code>lastYLabel</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartLabel} oLastYLabel
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setLastYLabel
 * @function
 */
	

/**
 * Destroys the lastYLabel in the aggregation 
 * named <code>lastYLabel</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyLastYLabel
 * @function
 */


/**
 * Getter for aggregation <code>maxLabel</code>.<br/>
 * The label for the maximum point of the chart.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartLabel}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getMaxLabel
 * @function
 */


/**
 * Setter for the aggregated <code>maxLabel</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartLabel} oMaxLabel
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setMaxLabel
 * @function
 */
	

/**
 * Destroys the maxLabel in the aggregation 
 * named <code>maxLabel</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyMaxLabel
 * @function
 */


/**
 * Getter for aggregation <code>minLabel</code>.<br/>
 * The label for the minimum point of the chart.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartLabel}
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#getMinLabel
 * @function
 */


/**
 * Setter for the aggregated <code>minLabel</code>.
 * @param {sap.suite.ui.commons.MicroAreaChartLabel} oMinLabel
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#setMinLabel
 * @function
 */
	

/**
 * Destroys the minLabel in the aggregation 
 * named <code>minLabel</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#destroyMinLabel
 * @function
 */


/**
 * Getter for aggregation <code>lines</code>.<br/>
 * The set of lines.
 * 
 * @return {sap.suite.ui.commons.MicroAreaChartItem[]}
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#getLines
 * @function
 */


/**
 * Inserts a line into the aggregation named <code>lines</code>.
 *
 * @param {sap.suite.ui.commons.MicroAreaChartItem}
 *          oLine the line to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the line should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the line is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the line is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#insertLine
 * @function
 */

/**
 * Adds some line <code>oLine</code> 
 * to the aggregation named <code>lines</code>.
 *
 * @param {sap.suite.ui.commons.MicroAreaChartItem}
 *            oLine the line to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#addLine
 * @function
 */

/**
 * Removes an line from the aggregation named <code>lines</code>.
 *
 * @param {int | string | sap.suite.ui.commons.MicroAreaChartItem} vLine the line to remove or its index or id
 * @return {sap.suite.ui.commons.MicroAreaChartItem} the removed line or null
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#removeLine
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>lines</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.MicroAreaChartItem[]} an array of the removed elements (might be empty)
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#removeAllLines
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.MicroAreaChartItem</code> in the aggregation named <code>lines</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.MicroAreaChartItem}
 *            oLine the line whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#indexOfLine
 * @function
 */
	

/**
 * Destroys all the lines in the aggregation 
 * named <code>lines</code>.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.29
 * @name sap.suite.ui.commons.MicroAreaChart#destroyLines
 * @function
 */


/**
 * The event is fired when the user chooses the micro area chart.
 *
 * @name sap.suite.ui.commons.MicroAreaChart#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.suite.ui.commons.MicroAreaChart</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.MicroAreaChart</code>.<br/> itself. 
 *  
 * The event is fired when the user chooses the micro area chart.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.MicroAreaChart</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.suite.ui.commons.MicroAreaChart</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.MicroAreaChart#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.MicroAreaChart} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.MicroAreaChart#firePress
 * @function
 */

// Start of sap/suite/ui/commons/MicroAreaChart.js
/*!
 * ${copyright}
 */

jQuery.sap.require("sap.suite.ui.microchart.AreaMicroChart");

sap.suite.ui.microchart.AreaMicroChart.extend("sap.suite.ui.commons.MicroAreaChart", /** @lends sap.suite.ui.commons.MicroAreaChart.prototype */ {
  metadata : {
    library : "sap.suite.ui.commons"
  }
});