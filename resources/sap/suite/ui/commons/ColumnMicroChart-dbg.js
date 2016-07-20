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

// Provides control sap.suite.ui.commons.ColumnMicroChart.
jQuery.sap.declare("sap.suite.ui.commons.ColumnMicroChart");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ColumnMicroChart.
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
 * <li>{@link #getSize size} : sap.suite.ui.commons.InfoTileSize (default: sap.suite.ui.commons.InfoTileSize.Auto)</li>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
 * <li>{@link #getHeight height} : sap.ui.core.CSSSize</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getColumns columns} : sap.suite.ui.commons.ColumnData[]</li>
 * <li>{@link #getLeftTopLabel leftTopLabel} : sap.suite.ui.commons.ColumnMicroChartLabel</li>
 * <li>{@link #getRightTopLabel rightTopLabel} : sap.suite.ui.commons.ColumnMicroChartLabel</li>
 * <li>{@link #getLeftBottomLabel leftBottomLabel} : sap.suite.ui.commons.ColumnMicroChartLabel</li>
 * <li>{@link #getRightBottomLabel rightBottomLabel} : sap.suite.ui.commons.ColumnMicroChartLabel</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.ColumnMicroChart#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * This control shows a column chart.
 * @extends sap.ui.core.Control
 * @version 1.36.8
 *
 * @constructor
 * @public
 * @deprecated Since version 1.34. 
 * Deprecated. sap.suite.ui.microchart.ColumnMicroChart should be used.
 * @name sap.suite.ui.commons.ColumnMicroChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.ColumnMicroChart", { metadata : {

	deprecated : true,
	library : "sap.suite.ui.commons",
	properties : {
		"size" : {type : "sap.suite.ui.commons.InfoTileSize", group : "Misc", defaultValue : sap.suite.ui.commons.InfoTileSize.Auto},
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
		"height" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null}
	},
	aggregations : {
		"columns" : {type : "sap.suite.ui.commons.ColumnData", multiple : true, singularName : "column"}, 
		"leftTopLabel" : {type : "sap.suite.ui.commons.ColumnMicroChartLabel", multiple : false}, 
		"rightTopLabel" : {type : "sap.suite.ui.commons.ColumnMicroChartLabel", multiple : false}, 
		"leftBottomLabel" : {type : "sap.suite.ui.commons.ColumnMicroChartLabel", multiple : false}, 
		"rightBottomLabel" : {type : "sap.suite.ui.commons.ColumnMicroChartLabel", multiple : false}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.ColumnMicroChart with name <code>sClassName</code> 
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
 * @name sap.suite.ui.commons.ColumnMicroChart.extend
 * @function
 */

sap.suite.ui.commons.ColumnMicroChart.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>size</code>.
 * Updates the size of the chart. If not set then the default size is applied based on the device tile.
 *
 * Default value is <code>Auto</code>
 *
 * @return {sap.suite.ui.commons.InfoTileSize} the value of property <code>size</code>
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is <code>Auto</code> 
 *
 * @param {sap.suite.ui.commons.InfoTileSize} oSize  new value for property <code>size</code>
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#setSize
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * The width of the chart. If it is not set, the width of the control is defined by the size property.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#setWidth
 * @function
 */


/**
 * Getter for property <code>height</code>.
 * The height of the chart. If it is not set, the height of the control is defined by the size property.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>height</code>
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#getHeight
 * @function
 */

/**
 * Setter for property <code>height</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sHeight  new value for property <code>height</code>
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#setHeight
 * @function
 */


/**
 * Getter for aggregation <code>columns</code>.<br/>
 * The column chart data.
 * 
 * @return {sap.suite.ui.commons.ColumnData[]}
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#getColumns
 * @function
 */


/**
 * Inserts a column into the aggregation named <code>columns</code>.
 *
 * @param {sap.suite.ui.commons.ColumnData}
 *          oColumn the column to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the column should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the column is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the column is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#insertColumn
 * @function
 */

/**
 * Adds some column <code>oColumn</code> 
 * to the aggregation named <code>columns</code>.
 *
 * @param {sap.suite.ui.commons.ColumnData}
 *            oColumn the column to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#addColumn
 * @function
 */

/**
 * Removes an column from the aggregation named <code>columns</code>.
 *
 * @param {int | string | sap.suite.ui.commons.ColumnData} vColumn the column to remove or its index or id
 * @return {sap.suite.ui.commons.ColumnData} the removed column or null
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#removeColumn
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>columns</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.ColumnData[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#removeAllColumns
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.ColumnData</code> in the aggregation named <code>columns</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.ColumnData}
 *            oColumn the column whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#indexOfColumn
 * @function
 */
	

/**
 * Destroys all the columns in the aggregation 
 * named <code>columns</code>.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#destroyColumns
 * @function
 */


/**
 * Getter for aggregation <code>leftTopLabel</code>.<br/>
 * The label on the left top corner of the chart.
 * 
 * @return {sap.suite.ui.commons.ColumnMicroChartLabel}
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#getLeftTopLabel
 * @function
 */


/**
 * Setter for the aggregated <code>leftTopLabel</code>.
 * @param {sap.suite.ui.commons.ColumnMicroChartLabel} oLeftTopLabel
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#setLeftTopLabel
 * @function
 */
	

/**
 * Destroys the leftTopLabel in the aggregation 
 * named <code>leftTopLabel</code>.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#destroyLeftTopLabel
 * @function
 */


/**
 * Getter for aggregation <code>rightTopLabel</code>.<br/>
 * The label on the right top corner of the chart.
 * 
 * @return {sap.suite.ui.commons.ColumnMicroChartLabel}
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#getRightTopLabel
 * @function
 */


/**
 * Setter for the aggregated <code>rightTopLabel</code>.
 * @param {sap.suite.ui.commons.ColumnMicroChartLabel} oRightTopLabel
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#setRightTopLabel
 * @function
 */
	

/**
 * Destroys the rightTopLabel in the aggregation 
 * named <code>rightTopLabel</code>.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#destroyRightTopLabel
 * @function
 */


/**
 * Getter for aggregation <code>leftBottomLabel</code>.<br/>
 * The label on the left bottom corner of the chart.
 * 
 * @return {sap.suite.ui.commons.ColumnMicroChartLabel}
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#getLeftBottomLabel
 * @function
 */


/**
 * Setter for the aggregated <code>leftBottomLabel</code>.
 * @param {sap.suite.ui.commons.ColumnMicroChartLabel} oLeftBottomLabel
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#setLeftBottomLabel
 * @function
 */
	

/**
 * Destroys the leftBottomLabel in the aggregation 
 * named <code>leftBottomLabel</code>.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#destroyLeftBottomLabel
 * @function
 */


/**
 * Getter for aggregation <code>rightBottomLabel</code>.<br/>
 * The label on the right bottom corner of the chart.
 * 
 * @return {sap.suite.ui.commons.ColumnMicroChartLabel}
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#getRightBottomLabel
 * @function
 */


/**
 * Setter for the aggregated <code>rightBottomLabel</code>.
 * @param {sap.suite.ui.commons.ColumnMicroChartLabel} oRightBottomLabel
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#setRightBottomLabel
 * @function
 */
	

/**
 * Destroys the rightBottomLabel in the aggregation 
 * named <code>rightBottomLabel</code>.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.28
 * @name sap.suite.ui.commons.ColumnMicroChart#destroyRightBottomLabel
 * @function
 */


/**
 * The event is fired when the user chooses the column chart.
 *
 * @name sap.suite.ui.commons.ColumnMicroChart#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.suite.ui.commons.ColumnMicroChart</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.ColumnMicroChart</code>.<br/> itself. 
 *  
 * The event is fired when the user chooses the column chart.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.ColumnMicroChart</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.suite.ui.commons.ColumnMicroChart</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.ColumnMicroChart#firePress
 * @function
 */

// Start of sap/suite/ui/commons/ColumnMicroChart.js
/*!
 * ${copyright}
 */

jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChart");

sap.suite.ui.microchart.ColumnMicroChart.extend("sap.suite.ui.commons.ColumnMicroChart", /** @lends sap.suite.ui.commons.ColumnMicroChart.prototype */ {
  metadata : {
    library : "sap.suite.ui.commons"
  }
});