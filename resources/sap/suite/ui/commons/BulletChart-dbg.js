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

// Provides control sap.suite.ui.commons.BulletChart.
jQuery.sap.declare("sap.suite.ui.commons.BulletChart");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new BulletChart.
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
 * <li>{@link #getMode mode} : sap.suite.ui.commons.BulletChartMode (default: sap.suite.ui.commons.BulletChartMode.Actual)</li>
 * <li>{@link #getScale scale} : string</li>
 * <li>{@link #getForecastValue forecastValue} : float</li>
 * <li>{@link #getTargetValue targetValue} : float</li>
 * <li>{@link #getMinValue minValue} : float</li>
 * <li>{@link #getMaxValue maxValue} : float</li>
 * <li>{@link #getShowActualValue showActualValue} : boolean (default: true)</li>
 * <li>{@link #getShowDeltaValue showDeltaValue} : boolean (default: false)</li>
 * <li>{@link #getShowTargetValue showTargetValue} : boolean (default: true)</li>
 * <li>{@link #getShowValueMarker showValueMarker} : boolean (default: false)</li>
 * <li>{@link #getActualValueLabel actualValueLabel} : string</li>
 * <li>{@link #getDeltaValueLabel deltaValueLabel} : string</li>
 * <li>{@link #getTargetValueLabel targetValueLabel} : string</li>
 * <li>{@link #getWidth width} : string</li>
 * <li>{@link #getScaleColor scaleColor} : sap.suite.ui.commons.CommonBackground (default: sap.suite.ui.commons.CommonBackground.MediumLight)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getActual actual} : sap.suite.ui.commons.BulletChartData</li>
 * <li>{@link #getThresholds thresholds} : sap.suite.ui.commons.BulletChartData[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.BulletChart#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Chart that displays an actual value as a horizontal bar in semantic color on the top of the background bar, the numeric value, the scaling factor, along with the thresholds, and a target value as vertical bars.
 * @extends sap.ui.core.Control
 * @version 1.36.8
 *
 * @constructor
 * @public
 * @deprecated Since version 1.34. 
 * Deprecated. sap.suite.ui.microchart.BulletMicroChart should be used.
 * @name sap.suite.ui.commons.BulletChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.BulletChart", { metadata : {

	deprecated : true,
	library : "sap.suite.ui.commons",
	properties : {
		"size" : {type : "sap.suite.ui.commons.InfoTileSize", group : "Misc", defaultValue : sap.suite.ui.commons.InfoTileSize.Auto},
		"mode" : {type : "sap.suite.ui.commons.BulletChartMode", group : "Misc", defaultValue : sap.suite.ui.commons.BulletChartMode.Actual},
		"scale" : {type : "string", group : "Misc", defaultValue : null},
		"forecastValue" : {type : "float", group : "Misc", defaultValue : null},
		"targetValue" : {type : "float", group : "Misc", defaultValue : null},
		"minValue" : {type : "float", group : "Misc", defaultValue : null},
		"maxValue" : {type : "float", group : "Misc", defaultValue : null},
		"showActualValue" : {type : "boolean", group : "Misc", defaultValue : true},
		"showDeltaValue" : {type : "boolean", group : "Misc", defaultValue : false},
		"showTargetValue" : {type : "boolean", group : "Misc", defaultValue : true},
		"showValueMarker" : {type : "boolean", group : "Misc", defaultValue : false},
		"actualValueLabel" : {type : "string", group : "Misc", defaultValue : null},
		"deltaValueLabel" : {type : "string", group : "Misc", defaultValue : null},
		"targetValueLabel" : {type : "string", group : "Misc", defaultValue : null},
		"width" : {type : "string", group : "Misc", defaultValue : null},
		"scaleColor" : {type : "sap.suite.ui.commons.CommonBackground", group : "Misc", defaultValue : sap.suite.ui.commons.CommonBackground.MediumLight}
	},
	aggregations : {
		"actual" : {type : "sap.suite.ui.commons.BulletChartData", multiple : false}, 
		"thresholds" : {type : "sap.suite.ui.commons.BulletChartData", multiple : true, singularName : "threshold"}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.BulletChart with name <code>sClassName</code> 
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
 * @name sap.suite.ui.commons.BulletChart.extend
 * @function
 */

sap.suite.ui.commons.BulletChart.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>size</code>.
 * The size of the chart. If not set, the default size is applied based on the size of the device tile.
 *
 * Default value is <code>Auto</code>
 *
 * @return {sap.suite.ui.commons.InfoTileSize} the value of property <code>size</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is <code>Auto</code> 
 *
 * @param {sap.suite.ui.commons.InfoTileSize} oSize  new value for property <code>size</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setSize
 * @function
 */


/**
 * Getter for property <code>mode</code>.
 * The mode of displaying the actual value itself or the delta between the actual value and the target value. If not set, the actual value is displayed.
 *
 * Default value is <code>Actual</code>
 *
 * @return {sap.suite.ui.commons.BulletChartMode} the value of property <code>mode</code>
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#getMode
 * @function
 */

/**
 * Setter for property <code>mode</code>.
 *
 * Default value is <code>Actual</code> 
 *
 * @param {sap.suite.ui.commons.BulletChartMode} oMode  new value for property <code>mode</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#setMode
 * @function
 */


/**
 * Getter for property <code>scale</code>.
 * The scaling suffix that is added to the actual and target values.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>scale</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getScale
 * @function
 */

/**
 * Setter for property <code>scale</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sScale  new value for property <code>scale</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setScale
 * @function
 */


/**
 * Getter for property <code>forecastValue</code>.
 * The forecast value that is displayed in Actual mode only. If set, the forecast value bar appears in the background of the actual value bar.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>forecastValue</code>
 * @public
 * @since 1.21
 * @name sap.suite.ui.commons.BulletChart#getForecastValue
 * @function
 */

/**
 * Setter for property <code>forecastValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fForecastValue  new value for property <code>forecastValue</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.21
 * @name sap.suite.ui.commons.BulletChart#setForecastValue
 * @function
 */


/**
 * Getter for property <code>targetValue</code>.
 * The target value that is displayed as a black vertical bar.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>targetValue</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getTargetValue
 * @function
 */

/**
 * Setter for property <code>targetValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fTargetValue  new value for property <code>targetValue</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setTargetValue
 * @function
 */


/**
 * Getter for property <code>minValue</code>.
 * The minimum scale value for the bar chart used for defining a fixed size of the scale in different instances of this control.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>minValue</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getMinValue
 * @function
 */

/**
 * Setter for property <code>minValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fMinValue  new value for property <code>minValue</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setMinValue
 * @function
 */


/**
 * Getter for property <code>maxValue</code>.
 * The maximum scale value for the bar chart used for defining a fixed size of the scale in different instances of this control.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {float} the value of property <code>maxValue</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getMaxValue
 * @function
 */

/**
 * Setter for property <code>maxValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {float} fMaxValue  new value for property <code>maxValue</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setMaxValue
 * @function
 */


/**
 * Getter for property <code>showActualValue</code>.
 * If set to true, shows the numeric actual value. This property works in Actual mode only.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showActualValue</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getShowActualValue
 * @function
 */

/**
 * Setter for property <code>showActualValue</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowActualValue  new value for property <code>showActualValue</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setShowActualValue
 * @function
 */


/**
 * Getter for property <code>showDeltaValue</code>.
 * If set to true, shows the calculated delta value instead of the numeric actual value regardless of the showActualValue setting. This property works in Delta mode only.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>showDeltaValue</code>
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#getShowDeltaValue
 * @function
 */

/**
 * Setter for property <code>showDeltaValue</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bShowDeltaValue  new value for property <code>showDeltaValue</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#setShowDeltaValue
 * @function
 */


/**
 * Getter for property <code>showTargetValue</code>.
 * If set to true, shows the numeric target value.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showTargetValue</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getShowTargetValue
 * @function
 */

/**
 * Setter for property <code>showTargetValue</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowTargetValue  new value for property <code>showTargetValue</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setShowTargetValue
 * @function
 */


/**
 * Getter for property <code>showValueMarker</code>.
 * If set to true, shows the value marker.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>showValueMarker</code>
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#getShowValueMarker
 * @function
 */

/**
 * Setter for property <code>showValueMarker</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bShowValueMarker  new value for property <code>showValueMarker</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#setShowValueMarker
 * @function
 */


/**
 * Getter for property <code>actualValueLabel</code>.
 * If set, displays a specified label instead of the numeric actual value.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>actualValueLabel</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getActualValueLabel
 * @function
 */

/**
 * Setter for property <code>actualValueLabel</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sActualValueLabel  new value for property <code>actualValueLabel</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setActualValueLabel
 * @function
 */


/**
 * Getter for property <code>deltaValueLabel</code>.
 * If set, displays a specified label instead of the calculated numeric delta value.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>deltaValueLabel</code>
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#getDeltaValueLabel
 * @function
 */

/**
 * Setter for property <code>deltaValueLabel</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDeltaValueLabel  new value for property <code>deltaValueLabel</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#setDeltaValueLabel
 * @function
 */


/**
 * Getter for property <code>targetValueLabel</code>.
 * If set, displays a specified label instead of the numeric target value.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>targetValueLabel</code>
 * @public
 * @name sap.suite.ui.commons.BulletChart#getTargetValueLabel
 * @function
 */

/**
 * Setter for property <code>targetValueLabel</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTargetValueLabel  new value for property <code>targetValueLabel</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setTargetValueLabel
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * The width of the chart. If it is not set, the size of the control is defined by the size property.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>width</code>
 * @public
 * @since 1.22
 * @name sap.suite.ui.commons.BulletChart#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sWidth  new value for property <code>width</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.22
 * @name sap.suite.ui.commons.BulletChart#setWidth
 * @function
 */


/**
 * Getter for property <code>scaleColor</code>.
 * The background color of the scale.
 *
 * Default value is <code>MediumLight</code>
 *
 * @return {sap.suite.ui.commons.CommonBackground} the value of property <code>scaleColor</code>
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#getScaleColor
 * @function
 */

/**
 * Setter for property <code>scaleColor</code>.
 *
 * Default value is <code>MediumLight</code> 
 *
 * @param {sap.suite.ui.commons.CommonBackground} oScaleColor  new value for property <code>scaleColor</code>
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @since 1.23
 * @name sap.suite.ui.commons.BulletChart#setScaleColor
 * @function
 */


/**
 * Getter for aggregation <code>actual</code>.<br/>
 * The bullet chart actual data.
 * 
 * @return {sap.suite.ui.commons.BulletChartData}
 * @public
 * @name sap.suite.ui.commons.BulletChart#getActual
 * @function
 */


/**
 * Setter for the aggregated <code>actual</code>.
 * @param {sap.suite.ui.commons.BulletChartData} oActual
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#setActual
 * @function
 */
	

/**
 * Destroys the actual in the aggregation 
 * named <code>actual</code>.
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#destroyActual
 * @function
 */


/**
 * Getter for aggregation <code>thresholds</code>.<br/>
 * The bullet chart thresholds data.
 * 
 * @return {sap.suite.ui.commons.BulletChartData[]}
 * @public
 * @name sap.suite.ui.commons.BulletChart#getThresholds
 * @function
 */


/**
 * Inserts a threshold into the aggregation named <code>thresholds</code>.
 *
 * @param {sap.suite.ui.commons.BulletChartData}
 *          oThreshold the threshold to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the threshold should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the threshold is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the threshold is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#insertThreshold
 * @function
 */

/**
 * Adds some threshold <code>oThreshold</code> 
 * to the aggregation named <code>thresholds</code>.
 *
 * @param {sap.suite.ui.commons.BulletChartData}
 *            oThreshold the threshold to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#addThreshold
 * @function
 */

/**
 * Removes an threshold from the aggregation named <code>thresholds</code>.
 *
 * @param {int | string | sap.suite.ui.commons.BulletChartData} vThreshold the threshold to remove or its index or id
 * @return {sap.suite.ui.commons.BulletChartData} the removed threshold or null
 * @public
 * @name sap.suite.ui.commons.BulletChart#removeThreshold
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>thresholds</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.BulletChartData[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.BulletChart#removeAllThresholds
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.BulletChartData</code> in the aggregation named <code>thresholds</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.BulletChartData}
 *            oThreshold the threshold whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.BulletChart#indexOfThreshold
 * @function
 */
	

/**
 * Destroys all the thresholds in the aggregation 
 * named <code>thresholds</code>.
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#destroyThresholds
 * @function
 */


/**
 * The event is fired when the user chooses the bullet chart.
 *
 * @name sap.suite.ui.commons.BulletChart#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.suite.ui.commons.BulletChart</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.BulletChart</code>.<br/> itself. 
 *  
 * The event is fired when the user chooses the bullet chart.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.BulletChart</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.suite.ui.commons.BulletChart</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.BulletChart#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.BulletChart} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.BulletChart#firePress
 * @function
 */

// Start of sap/suite/ui/commons/BulletChart.js
/*!
 * ${copyright}
 */

jQuery.sap.require("sap.suite.ui.microchart.BulletMicroChart");

sap.suite.ui.microchart.BulletMicroChart.extend("sap.suite.ui.commons.BulletChart", /** @lends sap.suite.ui.commons.BulletChart.prototype */ {
  metadata : {
    library : "sap.suite.ui.commons"
  }
});