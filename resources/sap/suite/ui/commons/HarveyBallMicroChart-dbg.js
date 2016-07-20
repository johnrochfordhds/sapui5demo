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

// Provides control sap.suite.ui.commons.HarveyBallMicroChart.
jQuery.sap.declare("sap.suite.ui.commons.HarveyBallMicroChart");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new HarveyBallMicroChart.
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
 * <li>{@link #getTotal total} : float (default: 0)</li>
 * <li>{@link #getTotalLabel totalLabel} : string</li>
 * <li>{@link #getTotalScale totalScale} : string</li>
 * <li>{@link #getFormattedLabel formattedLabel} : boolean (default: false)</li>
 * <li>{@link #getShowTotal showTotal} : boolean (default: true)</li>
 * <li>{@link #getShowFractions showFractions} : boolean (default: true)</li>
 * <li>{@link #getSize size} : sap.suite.ui.commons.InfoTileSize (default: sap.suite.ui.commons.InfoTileSize.Auto)</li>
 * <li>{@link #getColorPalette colorPalette} : string[] (default: [])</li>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getItems items} : sap.suite.ui.commons.HarveyBallMicroChartItem[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.HarveyBallMicroChart#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * This chart shows the part comparative to total.
 * @extends sap.ui.core.Control
 * @version 1.36.8
 *
 * @constructor
 * @public
 * @deprecated Since version 1.34. 
 * Deprecated. sap.suite.ui.microchart.HarveyBallMicroChart should be used.
 * @name sap.suite.ui.commons.HarveyBallMicroChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.HarveyBallMicroChart", { metadata : {

	deprecated : true,
	library : "sap.suite.ui.commons",
	properties : {
		"total" : {type : "float", group : "Misc", defaultValue : 0},
		"totalLabel" : {type : "string", group : "Misc", defaultValue : null},
		"totalScale" : {type : "string", group : "Misc", defaultValue : null},
		"formattedLabel" : {type : "boolean", group : "Misc", defaultValue : false},
		"showTotal" : {type : "boolean", group : "Misc", defaultValue : true},
		"showFractions" : {type : "boolean", group : "Misc", defaultValue : true},
		"size" : {type : "sap.suite.ui.commons.InfoTileSize", group : "Misc", defaultValue : sap.suite.ui.commons.InfoTileSize.Auto},
		"colorPalette" : {type : "string[]", group : "Misc", defaultValue : []},
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null}
	},
	aggregations : {
		"items" : {type : "sap.suite.ui.commons.HarveyBallMicroChartItem", multiple : true, singularName : "item"}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.HarveyBallMicroChart with name <code>sClassName</code> 
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
 * @name sap.suite.ui.commons.HarveyBallMicroChart.extend
 * @function
 */

sap.suite.ui.commons.HarveyBallMicroChart.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>total</code>.
 * The total value. This is taken as 360 degrees value on the chart.
 *
 * Default value is <code>0</code>
 *
 * @return {float} the value of property <code>total</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getTotal
 * @function
 */

/**
 * Setter for property <code>total</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {float} fTotal  new value for property <code>total</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setTotal
 * @function
 */


/**
 * Getter for property <code>totalLabel</code>.
 * The total label. If specified, it is displayed instead of the total value.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>totalLabel</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getTotalLabel
 * @function
 */

/**
 * Setter for property <code>totalLabel</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTotalLabel  new value for property <code>totalLabel</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setTotalLabel
 * @function
 */


/**
 * Getter for property <code>totalScale</code>.
 * The scaling factor that is displayed next to the total value.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>totalScale</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getTotalScale
 * @function
 */

/**
 * Setter for property <code>totalScale</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTotalScale  new value for property <code>totalScale</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setTotalScale
 * @function
 */


/**
 * Getter for property <code>formattedLabel</code>.
 * If set to true, the totalLabel parameter is considered as the combination of the total value and its scaling factor. The default value is false. It means that the total value and the scaling factor are defined separately by the total and the totalScale properties accordingly.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>formattedLabel</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getFormattedLabel
 * @function
 */

/**
 * Setter for property <code>formattedLabel</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bFormattedLabel  new value for property <code>formattedLabel</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setFormattedLabel
 * @function
 */


/**
 * Getter for property <code>showTotal</code>.
 * If it is set to true, the total value is displayed next to the chart. The default setting is true.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showTotal</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getShowTotal
 * @function
 */

/**
 * Setter for property <code>showTotal</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowTotal  new value for property <code>showTotal</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setShowTotal
 * @function
 */


/**
 * Getter for property <code>showFractions</code>.
 * If it is set to true, the fraction values are displayed next to the chart. The default setting is true.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showFractions</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getShowFractions
 * @function
 */

/**
 * Setter for property <code>showFractions</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowFractions  new value for property <code>showFractions</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setShowFractions
 * @function
 */


/**
 * Getter for property <code>size</code>.
 * The size of the chart. If it is not set, the default size is applied based on the device type.
 *
 * Default value is <code>Auto</code>
 *
 * @return {sap.suite.ui.commons.InfoTileSize} the value of property <code>size</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is <code>Auto</code> 
 *
 * @param {sap.suite.ui.commons.InfoTileSize} oSize  new value for property <code>size</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setSize
 * @function
 */


/**
 * Getter for property <code>colorPalette</code>.
 * The color palette for the chart. If this property is set, semantic colors defined in HarveyBallMicroChart are ignored. Colors from the palette are assigned to each slice consequentially. When all the palette colors are used, assignment of the colors begins from the first palette color.
 *
 * Default value is <code>[]</code>
 *
 * @return {string[]} the value of property <code>colorPalette</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getColorPalette
 * @function
 */

/**
 * Setter for property <code>colorPalette</code>.
 *
 * Default value is <code>[]</code> 
 *
 * @param {string[]} aColorPalette  new value for property <code>colorPalette</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setColorPalette
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * The width of the chart. If it is not set, the size of the control is defined by the size property.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#setWidth
 * @function
 */


/**
 * Getter for aggregation <code>items</code>.<br/>
 * The pie chart slices.
 * 
 * @return {sap.suite.ui.commons.HarveyBallMicroChartItem[]}
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#getItems
 * @function
 */


/**
 * Inserts a item into the aggregation named <code>items</code>.
 *
 * @param {sap.suite.ui.commons.HarveyBallMicroChartItem}
 *          oItem the item to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the item should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the item is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the item is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#insertItem
 * @function
 */

/**
 * Adds some item <code>oItem</code> 
 * to the aggregation named <code>items</code>.
 *
 * @param {sap.suite.ui.commons.HarveyBallMicroChartItem}
 *            oItem the item to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#addItem
 * @function
 */

/**
 * Removes an item from the aggregation named <code>items</code>.
 *
 * @param {int | string | sap.suite.ui.commons.HarveyBallMicroChartItem} vItem the item to remove or its index or id
 * @return {sap.suite.ui.commons.HarveyBallMicroChartItem} the removed item or null
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#removeItem
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>items</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.HarveyBallMicroChartItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#removeAllItems
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.HarveyBallMicroChartItem</code> in the aggregation named <code>items</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.HarveyBallMicroChartItem}
 *            oItem the item whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#indexOfItem
 * @function
 */
	

/**
 * Destroys all the items in the aggregation 
 * named <code>items</code>.
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#destroyItems
 * @function
 */


/**
 * The event is fired when the user chooses the control.
 *
 * @name sap.suite.ui.commons.HarveyBallMicroChart#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.suite.ui.commons.HarveyBallMicroChart</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.HarveyBallMicroChart</code>.<br/> itself. 
 *  
 * The event is fired when the user chooses the control.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.HarveyBallMicroChart</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.suite.ui.commons.HarveyBallMicroChart</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.HarveyBallMicroChart#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.HarveyBallMicroChart} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.HarveyBallMicroChart#firePress
 * @function
 */

// Start of sap/suite/ui/commons/HarveyBallMicroChart.js
/*!
 * ${copyright}
 */

jQuery.sap.require("sap.suite.ui.microchart.HarveyBallMicroChart");

sap.suite.ui.microchart.HarveyBallMicroChart.extend("sap.suite.ui.commons.HarveyBallMicroChart", /** @lends sap.suite.ui.commons.HarveyBallMicroChart.prototype */ {
  metadata : {
    library : "sap.suite.ui.commons"
  }
});