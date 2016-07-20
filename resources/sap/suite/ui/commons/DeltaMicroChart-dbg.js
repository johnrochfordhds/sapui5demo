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

// Provides control sap.suite.ui.commons.DeltaMicroChart.
jQuery.sap.declare("sap.suite.ui.commons.DeltaMicroChart");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new DeltaMicroChart.
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
 * <li>{@link #getValue1 value1} : float</li>
 * <li>{@link #getValue2 value2} : float</li>
 * <li>{@link #getTitle1 title1} : string</li>
 * <li>{@link #getTitle2 title2} : string</li>
 * <li>{@link #getDisplayValue1 displayValue1} : string</li>
 * <li>{@link #getDisplayValue2 displayValue2} : string</li>
 * <li>{@link #getDeltaDisplayValue deltaDisplayValue} : string</li>
 * <li>{@link #getColor color} : sap.suite.ui.commons.InfoTileValueColor (default: sap.suite.ui.commons.InfoTileValueColor.Neutral)</li>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
 * <li>{@link #getSize size} : sap.suite.ui.commons.InfoTileSize (default: sap.suite.ui.commons.InfoTileSize.Auto)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.DeltaMicroChart#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * This control displays a delta of two values as a chart.
 * @extends sap.ui.core.Control
 * @version 1.36.8
 *
 * @constructor
 * @public
 * @deprecated Since version 1.34. 
 * Deprecated. sap.suite.ui.microchart.DeltaMicroChart should be used.
 * @name sap.suite.ui.commons.DeltaMicroChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.DeltaMicroChart", { metadata : {

	deprecated : true,
	library : "sap.suite.ui.commons",
	properties : {
		"value1" : {type : "float", group : "Misc", defaultValue : null},
		"value2" : {type : "float", group : "Misc", defaultValue : null},
		"title1" : {type : "string", group : "Misc", defaultValue : null},
		"title2" : {type : "string", group : "Misc", defaultValue : null},
		"displayValue1" : {type : "string", group : "Misc", defaultValue : null},
		"displayValue2" : {type : "string", group : "Misc", defaultValue : null},
		"deltaDisplayValue" : {type : "string", group : "Misc", defaultValue : null},
		"color" : {type : "sap.suite.ui.commons.InfoTileValueColor", group : "Misc", defaultValue : sap.suite.ui.commons.InfoTileValueColor.Neutral},
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
		"size" : {type : "sap.suite.ui.commons.InfoTileSize", group : "Misc", defaultValue : sap.suite.ui.commons.InfoTileSize.Auto}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.DeltaMicroChart with name <code>sClassName</code> 
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
 * @name sap.suite.ui.commons.DeltaMicroChart.extend
 * @function
 */

sap.suite.ui.commons.DeltaMicroChart.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>value1</code>.
 * The first value for delta calculation.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>value1</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getValue1
 * @function
 */

/**
 * Setter for property <code>value1</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fValue1  new value for property <code>value1</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setValue1
 * @function
 */


/**
 * Getter for property <code>value2</code>.
 * The second value for delta calculation.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>value2</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getValue2
 * @function
 */

/**
 * Setter for property <code>value2</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fValue2  new value for property <code>value2</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setValue2
 * @function
 */


/**
 * Getter for property <code>title1</code>.
 * The first value title.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>title1</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getTitle1
 * @function
 */

/**
 * Setter for property <code>title1</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTitle1  new value for property <code>title1</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setTitle1
 * @function
 */


/**
 * Getter for property <code>title2</code>.
 * The second value title.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>title2</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getTitle2
 * @function
 */

/**
 * Setter for property <code>title2</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTitle2  new value for property <code>title2</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setTitle2
 * @function
 */


/**
 * Getter for property <code>displayValue1</code>.
 * If this property is set, it is rendered instead of value1.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>displayValue1</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getDisplayValue1
 * @function
 */

/**
 * Setter for property <code>displayValue1</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDisplayValue1  new value for property <code>displayValue1</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setDisplayValue1
 * @function
 */


/**
 * Getter for property <code>displayValue2</code>.
 * If this property is set, it is rendered instead of value2.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>displayValue2</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getDisplayValue2
 * @function
 */

/**
 * Setter for property <code>displayValue2</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDisplayValue2  new value for property <code>displayValue2</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setDisplayValue2
 * @function
 */


/**
 * Getter for property <code>deltaDisplayValue</code>.
 * If this property is set, it is rendered instead of a calculated delta.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>deltaDisplayValue</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getDeltaDisplayValue
 * @function
 */

/**
 * Setter for property <code>deltaDisplayValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDeltaDisplayValue  new value for property <code>deltaDisplayValue</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setDeltaDisplayValue
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * The semantic color of the delta value.
 *
 * Default value is <code>Neutral</code>
 *
 * @return {sap.suite.ui.commons.InfoTileValueColor} the value of property <code>color</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is <code>Neutral</code> 
 *
 * @param {sap.suite.ui.commons.InfoTileValueColor} oColor  new value for property <code>color</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setColor
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * The width of the chart.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setWidth
 * @function
 */


/**
 * Getter for property <code>size</code>.
 * The size of the chart. If is not set, the default size is applied based on the device type.
 *
 * Default value is <code>Auto</code>
 *
 * @return {sap.suite.ui.commons.InfoTileSize} the value of property <code>size</code>
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is <code>Auto</code> 
 *
 * @param {sap.suite.ui.commons.InfoTileSize} oSize  new value for property <code>size</code>
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#setSize
 * @function
 */


/**
 * The event is fired when the user chooses the delta micro chart.
 *
 * @name sap.suite.ui.commons.DeltaMicroChart#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.suite.ui.commons.DeltaMicroChart</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.DeltaMicroChart</code>.<br/> itself. 
 *  
 * The event is fired when the user chooses the delta micro chart.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.DeltaMicroChart</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.suite.ui.commons.DeltaMicroChart</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DeltaMicroChart#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.DeltaMicroChart} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.DeltaMicroChart#firePress
 * @function
 */

// Start of sap/suite/ui/commons/DeltaMicroChart.js
/*!
 * ${copyright}
 */

jQuery.sap.require("sap.suite.ui.microchart.DeltaMicroChart");

sap.suite.ui.microchart.DeltaMicroChart.extend("sap.suite.ui.commons.DeltaMicroChart", /** @lends sap.suite.ui.commons.DeltaMicroChart.prototype */ {
  metadata : {
    library : "sap.suite.ui.commons"
  }
});