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

// Provides control sap.suite.ui.commons.NumericContent.
jQuery.sap.declare("sap.suite.ui.commons.NumericContent");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new NumericContent.
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
 * <li>{@link #getValue value} : string</li>
 * <li>{@link #getScale scale} : string</li>
 * <li>{@link #getValueColor valueColor} : sap.suite.ui.commons.InfoTileValueColor (default: sap.suite.ui.commons.InfoTileValueColor.Neutral)</li>
 * <li>{@link #getIndicator indicator} : sap.suite.ui.commons.DeviationIndicator (default: sap.suite.ui.commons.DeviationIndicator.None)</li>
 * <li>{@link #getState state} : sap.suite.ui.commons.LoadState (default: sap.suite.ui.commons.LoadState.Loaded)</li>
 * <li>{@link #getAnimateTextChange animateTextChange} : boolean (default: true)</li>
 * <li>{@link #getFormatterValue formatterValue} : boolean (default: false)</li>
 * <li>{@link #getTruncateValueTo truncateValueTo} : int (default: 4)</li>
 * <li>{@link #getIcon icon} : sap.ui.core.URI</li>
 * <li>{@link #getNullifyValue nullifyValue} : boolean (default: true)</li>
 * <li>{@link #getIconDescription iconDescription} : string</li>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
 * <li>{@link #getWithMargin withMargin} : boolean (default: true)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.NumericContent#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * NumericContent to be used in tile or in other place where need to show numeric values with sematic colors and deviations.
 * @extends sap.ui.core.Control
 * @version 1.36.8
 *
 * @constructor
 * @public
 * @deprecated Since version 1.34. 
 * Deprecated. Moved to openui5.
 * @name sap.suite.ui.commons.NumericContent
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.NumericContent", { metadata : {

	deprecated : true,
	library : "sap.suite.ui.commons",
	properties : {
		"size" : {type : "sap.suite.ui.commons.InfoTileSize", group : "Misc", defaultValue : sap.suite.ui.commons.InfoTileSize.Auto},
		"value" : {type : "string", group : "Misc", defaultValue : null},
		"scale" : {type : "string", group : "Misc", defaultValue : null},
		"valueColor" : {type : "sap.suite.ui.commons.InfoTileValueColor", group : "Misc", defaultValue : sap.suite.ui.commons.InfoTileValueColor.Neutral},
		"indicator" : {type : "sap.suite.ui.commons.DeviationIndicator", group : "Misc", defaultValue : sap.suite.ui.commons.DeviationIndicator.None},
		"state" : {type : "sap.suite.ui.commons.LoadState", group : "Misc", defaultValue : sap.suite.ui.commons.LoadState.Loaded},
		"animateTextChange" : {type : "boolean", group : "Misc", defaultValue : true},
		"formatterValue" : {type : "boolean", group : "Misc", defaultValue : false},
		"truncateValueTo" : {type : "int", group : "Misc", defaultValue : 4},
		"icon" : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
		"nullifyValue" : {type : "boolean", group : "Misc", defaultValue : true},
		"iconDescription" : {type : "string", group : "Misc", defaultValue : null},
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
		"withMargin" : {type : "boolean", group : "Appearance", defaultValue : true}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.NumericContent with name <code>sClassName</code> 
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
 * @name sap.suite.ui.commons.NumericContent.extend
 * @function
 */

sap.suite.ui.commons.NumericContent.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>size</code>.
 * Updates the size of the chart. If not set then the default size is applied based on the device tile.
 *
 * Default value is <code>Auto</code>
 *
 * @return {sap.suite.ui.commons.InfoTileSize} the value of property <code>size</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is <code>Auto</code> 
 *
 * @param {sap.suite.ui.commons.InfoTileSize} oSize  new value for property <code>size</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setSize
 * @function
 */


/**
 * Getter for property <code>value</code>.
 * The actual value.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>value</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getValue
 * @function
 */

/**
 * Setter for property <code>value</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sValue  new value for property <code>value</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setValue
 * @function
 */


/**
 * Getter for property <code>scale</code>.
 * The scaling prefix. Financial characters can be used for currencies and counters. The SI prefixes can be used for units. If the scaling prefix contains more than three characters, only the first three characters are displayed.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>scale</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getScale
 * @function
 */

/**
 * Setter for property <code>scale</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sScale  new value for property <code>scale</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setScale
 * @function
 */


/**
 * Getter for property <code>valueColor</code>.
 * The semantic color of the value.
 *
 * Default value is <code>Neutral</code>
 *
 * @return {sap.suite.ui.commons.InfoTileValueColor} the value of property <code>valueColor</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getValueColor
 * @function
 */

/**
 * Setter for property <code>valueColor</code>.
 *
 * Default value is <code>Neutral</code> 
 *
 * @param {sap.suite.ui.commons.InfoTileValueColor} oValueColor  new value for property <code>valueColor</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setValueColor
 * @function
 */


/**
 * Getter for property <code>indicator</code>.
 * The indicator arrow that shows value deviation.
 *
 * Default value is <code>None</code>
 *
 * @return {sap.suite.ui.commons.DeviationIndicator} the value of property <code>indicator</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getIndicator
 * @function
 */

/**
 * Setter for property <code>indicator</code>.
 *
 * Default value is <code>None</code> 
 *
 * @param {sap.suite.ui.commons.DeviationIndicator} oIndicator  new value for property <code>indicator</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setIndicator
 * @function
 */


/**
 * Getter for property <code>state</code>.
 * Indicates the load status.
 *
 * Default value is <code>Loaded</code>
 *
 * @return {sap.suite.ui.commons.LoadState} the value of property <code>state</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getState
 * @function
 */

/**
 * Setter for property <code>state</code>.
 *
 * Default value is <code>Loaded</code> 
 *
 * @param {sap.suite.ui.commons.LoadState} oState  new value for property <code>state</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setState
 * @function
 */


/**
 * Getter for property <code>animateTextChange</code>.
 * If set to true, the change of the value will be animated.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>animateTextChange</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getAnimateTextChange
 * @function
 */

/**
 * Setter for property <code>animateTextChange</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bAnimateTextChange  new value for property <code>animateTextChange</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setAnimateTextChange
 * @function
 */


/**
 * Getter for property <code>formatterValue</code>.
 * If set to true, the value parameter contains a numeric value and scale. If set to false (default), the value parameter contains a numeric value only.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>formatterValue</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getFormatterValue
 * @function
 */

/**
 * Setter for property <code>formatterValue</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bFormatterValue  new value for property <code>formatterValue</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setFormatterValue
 * @function
 */


/**
 * Getter for property <code>truncateValueTo</code>.
 * The number of characters to display for the value property.
 *
 * Default value is <code>4</code>
 *
 * @return {int} the value of property <code>truncateValueTo</code>
 * @public
 * @name sap.suite.ui.commons.NumericContent#getTruncateValueTo
 * @function
 */

/**
 * Setter for property <code>truncateValueTo</code>.
 *
 * Default value is <code>4</code> 
 *
 * @param {int} iTruncateValueTo  new value for property <code>truncateValueTo</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#setTruncateValueTo
 * @function
 */


/**
 * Getter for property <code>icon</code>.
 * The icon to be displayed as a graphical element within the control. This can be an image or an icon from the icon font.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>icon</code>
 * @public
 * @since 1.21
 * @name sap.suite.ui.commons.NumericContent#getIcon
 * @function
 */

/**
 * Setter for property <code>icon</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sIcon  new value for property <code>icon</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @since 1.21
 * @name sap.suite.ui.commons.NumericContent#setIcon
 * @function
 */


/**
 * Getter for property <code>nullifyValue</code>.
 * If set to true, the omitted value property is set to 0.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>nullifyValue</code>
 * @public
 * @since 1.21
 * @name sap.suite.ui.commons.NumericContent#getNullifyValue
 * @function
 */

/**
 * Setter for property <code>nullifyValue</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bNullifyValue  new value for property <code>nullifyValue</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @since 1.21
 * @name sap.suite.ui.commons.NumericContent#setNullifyValue
 * @function
 */


/**
 * Getter for property <code>iconDescription</code>.
 * Description of an icon that is used in the tooltip.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>iconDescription</code>
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.NumericContent#getIconDescription
 * @function
 */

/**
 * Setter for property <code>iconDescription</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sIconDescription  new value for property <code>iconDescription</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.NumericContent#setIconDescription
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
 * @since 1.25
 * @name sap.suite.ui.commons.NumericContent#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @since 1.25
 * @name sap.suite.ui.commons.NumericContent#setWidth
 * @function
 */


/**
 * Getter for property <code>withMargin</code>.
 * If the value is set to false, the content will fit to the whole size of the control.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>withMargin</code>
 * @public
 * @since 1.31
 * @name sap.suite.ui.commons.NumericContent#getWithMargin
 * @function
 */

/**
 * Setter for property <code>withMargin</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bWithMargin  new value for property <code>withMargin</code>
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @since 1.31
 * @name sap.suite.ui.commons.NumericContent#setWithMargin
 * @function
 */


/**
 * The event is fired when the user chooses the numeric content.
 *
 * @name sap.suite.ui.commons.NumericContent#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.suite.ui.commons.NumericContent</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.NumericContent</code>.<br/> itself. 
 *  
 * The event is fired when the user chooses the numeric content.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.NumericContent</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.suite.ui.commons.NumericContent</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.NumericContent#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.NumericContent} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.NumericContent#firePress
 * @function
 */

// Start of sap/suite/ui/commons/NumericContent.js
/*!
 * ${copyright}
 */

jQuery.sap.require("sap.m.NumericContent");

sap.m.NumericContent.extend("sap.suite.ui.commons.NumericContent", /** @lends sap.suite.ui.commons.NumericContent.prototype */ {
  metadata : {
    library : "sap.suite.ui.commons"
  }
});
