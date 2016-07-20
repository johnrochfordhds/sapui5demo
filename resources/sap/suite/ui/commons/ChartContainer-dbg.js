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

// Provides control sap.suite.ui.commons.ChartContainer.
jQuery.sap.declare("sap.suite.ui.commons.ChartContainer");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ChartContainer.
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
 * <li>{@link #getShowPersonalization showPersonalization} : boolean (default: false)</li>
 * <li>{@link #getShowFullScreen showFullScreen} : boolean (default: false)</li>
 * <li>{@link #getFullScreen fullScreen} : boolean (default: false)</li>
 * <li>{@link #getShowLegend showLegend} : boolean (default: true)</li>
 * <li>{@link #getTitle title} : string (default: '')</li>
 * <li>{@link #getSelectorGroupLabel selectorGroupLabel} : string</li>
 * <li>{@link #getAutoAdjustHeight autoAdjustHeight} : boolean (default: false)</li>
 * <li>{@link #getShowZoom showZoom} : boolean (default: true)</li>
 * <li>{@link #getShowLegendButton showLegendButton} : boolean (default: true)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getDimensionSelectors dimensionSelectors} : sap.ui.core.Control[]</li>
 * <li>{@link #getContent content} <strong>(default aggregation)</strong> : sap.suite.ui.commons.ChartContainerContent[]</li>
 * <li>{@link #getCustomIcons customIcons} : sap.ui.core.Icon[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.ChartContainer#event:personalizationPress personalizationPress} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.ChartContainer#event:contentChange contentChange} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.ChartContainer#event:customZoomInPress customZoomInPress} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.ChartContainer#event:customZoomOutPress customZoomOutPress} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Provides a toolbar with generic functions for tables and charts based on the VizFrame control like zoom, display in fullscreen mode, toggle the legend, switch between chart types, and changes of the chart dimension. The controls of the content aggregation are positioned below the toolbar. Additional functions can be added to the toolbar with the customIcons aggregation.
 * @extends sap.ui.core.Control
 * @version 1.36.8
 *
 * @constructor
 * @public
 * @name sap.suite.ui.commons.ChartContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.ChartContainer", { metadata : {

	publicMethods : [
		// methods
		"switchChart", "updateChartContainer", "getSelectedContent"
	],
	library : "sap.suite.ui.commons",
	properties : {
		"showPersonalization" : {type : "boolean", group : "Misc", defaultValue : false},
		"showFullScreen" : {type : "boolean", group : "Misc", defaultValue : false},
		"fullScreen" : {type : "boolean", group : "Misc", defaultValue : false},
		"showLegend" : {type : "boolean", group : "Misc", defaultValue : true},
		"title" : {type : "string", group : "Misc", defaultValue : ''},
		"selectorGroupLabel" : {type : "string", group : "Misc", defaultValue : null, deprecated: true},
		"autoAdjustHeight" : {type : "boolean", group : "Misc", defaultValue : false},
		"showZoom" : {type : "boolean", group : "Misc", defaultValue : true},
		"showLegendButton" : {type : "boolean", group : "Misc", defaultValue : true}
	},
	defaultAggregation : "content",
	aggregations : {
		"dimensionSelectors" : {type : "sap.ui.core.Control", multiple : true, singularName : "dimensionSelector"}, 
		"content" : {type : "sap.suite.ui.commons.ChartContainerContent", multiple : true, singularName : "content"}, 
		"toolBar" : {type : "sap.m.OverflowToolbar", multiple : false, visibility : "hidden"}, 
		"customIcons" : {type : "sap.ui.core.Icon", multiple : true, singularName : "customIcon"}
	},
	events : {
		"personalizationPress" : {}, 
		"contentChange" : {}, 
		"customZoomInPress" : {}, 
		"customZoomOutPress" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.ChartContainer with name <code>sClassName</code> 
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
 * @name sap.suite.ui.commons.ChartContainer.extend
 * @function
 */

sap.suite.ui.commons.ChartContainer.M_EVENTS = {'personalizationPress':'personalizationPress','contentChange':'contentChange','customZoomInPress':'customZoomInPress','customZoomOutPress':'customZoomOutPress'};


/**
 * Getter for property <code>showPersonalization</code>.
 * Set to true to display the personalization icon. Set to false to hide it.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>showPersonalization</code>
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getShowPersonalization
 * @function
 */

/**
 * Setter for property <code>showPersonalization</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bShowPersonalization  new value for property <code>showPersonalization</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#setShowPersonalization
 * @function
 */


/**
 * Getter for property <code>showFullScreen</code>.
 * Set to true to display the full screen icon. Set to false to hide it.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>showFullScreen</code>
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getShowFullScreen
 * @function
 */

/**
 * Setter for property <code>showFullScreen</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bShowFullScreen  new value for property <code>showFullScreen</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#setShowFullScreen
 * @function
 */


/**
 * Getter for property <code>fullScreen</code>.
 * Display the chart and the toolbar in full screen or normal mode.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>fullScreen</code>
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getFullScreen
 * @function
 */

/**
 * Setter for property <code>fullScreen</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bFullScreen  new value for property <code>fullScreen</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#setFullScreen
 * @function
 */


/**
 * Getter for property <code>showLegend</code>.
 * Set to true to display the charts' legends. Set to false to hide them.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showLegend</code>
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getShowLegend
 * @function
 */

/**
 * Setter for property <code>showLegend</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowLegend  new value for property <code>showLegend</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#setShowLegend
 * @function
 */


/**
 * Getter for property <code>title</code>.
 * String shown if there are no dimensions to display.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>title</code>
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getTitle
 * @function
 */

/**
 * Setter for property <code>title</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTitle  new value for property <code>title</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#setTitle
 * @function
 */


/**
 * Getter for property <code>selectorGroupLabel</code>.
 * Custom Label for Selectors Group.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>selectorGroupLabel</code>
 * @public
 * @deprecated Since version 1.32.0. 
 * Obsolete property as sap.m.Toolbar is replaced by sap.m.OverflowToolbar.
 * @name sap.suite.ui.commons.ChartContainer#getSelectorGroupLabel
 * @function
 */

/**
 * Setter for property <code>selectorGroupLabel</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sSelectorGroupLabel  new value for property <code>selectorGroupLabel</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.32.0. 
 * Obsolete property as sap.m.Toolbar is replaced by sap.m.OverflowToolbar.
 * @name sap.suite.ui.commons.ChartContainer#setSelectorGroupLabel
 * @function
 */


/**
 * Getter for property <code>autoAdjustHeight</code>.
 * Determine whether to stretch the chart height to the maximum possible height of ChartContainer's parent container. As a prerequisite, the parent container needs to have a fixed value height or be able to determine height from its parent.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>autoAdjustHeight</code>
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getAutoAdjustHeight
 * @function
 */

/**
 * Setter for property <code>autoAdjustHeight</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bAutoAdjustHeight  new value for property <code>autoAdjustHeight</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#setAutoAdjustHeight
 * @function
 */


/**
 * Getter for property <code>showZoom</code>.
 * Set to true to display zoom icons. Set to false to hide them.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showZoom</code>
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getShowZoom
 * @function
 */

/**
 * Setter for property <code>showZoom</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowZoom  new value for property <code>showZoom</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#setShowZoom
 * @function
 */


/**
 * Getter for property <code>showLegendButton</code>.
 * Set to true/false to display/hide a button for controlling the visbility of the chart's legend.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showLegendButton</code>
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getShowLegendButton
 * @function
 */

/**
 * Setter for property <code>showLegendButton</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowLegendButton  new value for property <code>showLegendButton</code>
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#setShowLegendButton
 * @function
 */


/**
 * Getter for aggregation <code>dimensionSelectors</code>.<br/>
 * Dimension Selects.
 * 
 * @return {sap.ui.core.Control[]}
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getDimensionSelectors
 * @function
 */


/**
 * Inserts a dimensionSelector into the aggregation named <code>dimensionSelectors</code>.
 *
 * @param {sap.ui.core.Control}
 *          oDimensionSelector the dimensionSelector to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the dimensionSelector should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the dimensionSelector is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the dimensionSelector is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#insertDimensionSelector
 * @function
 */

/**
 * Adds some dimensionSelector <code>oDimensionSelector</code> 
 * to the aggregation named <code>dimensionSelectors</code>.
 *
 * @param {sap.ui.core.Control}
 *            oDimensionSelector the dimensionSelector to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#addDimensionSelector
 * @function
 */

/**
 * Removes an dimensionSelector from the aggregation named <code>dimensionSelectors</code>.
 *
 * @param {int | string | sap.ui.core.Control} vDimensionSelector the dimensionSelector to remove or its index or id
 * @return {sap.ui.core.Control} the removed dimensionSelector or null
 * @public
 * @name sap.suite.ui.commons.ChartContainer#removeDimensionSelector
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dimensionSelectors</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.core.Control[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.ChartContainer#removeAllDimensionSelectors
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.core.Control</code> in the aggregation named <code>dimensionSelectors</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.core.Control}
 *            oDimensionSelector the dimensionSelector whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.ChartContainer#indexOfDimensionSelector
 * @function
 */
	

/**
 * Destroys all the dimensionSelectors in the aggregation 
 * named <code>dimensionSelectors</code>.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#destroyDimensionSelectors
 * @function
 */


/**
 * Getter for aggregation <code>content</code>.<br/>
 * ChartToolBar Content aggregation. Only vizFrame, sap.m.Table and sap.ui.table.Table can be embedded.
 * If not specified explicitly, the rendering order of the charts is determined by the sequence of contents provided by the application via this aggregation. That means, per default the first chart of the aggregation will be rendered within the container.
 * 
 * <strong>Note</strong>: this is the default aggregation for ChartContainer.
 * @return {sap.suite.ui.commons.ChartContainerContent[]}
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getContent
 * @function
 */


/**
 * Inserts a content into the aggregation named <code>content</code>.
 *
 * @param {sap.suite.ui.commons.ChartContainerContent}
 *          oContent the content to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the content should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the content is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the content is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#insertContent
 * @function
 */

/**
 * Adds some content <code>oContent</code> 
 * to the aggregation named <code>content</code>.
 *
 * @param {sap.suite.ui.commons.ChartContainerContent}
 *            oContent the content to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#addContent
 * @function
 */

/**
 * Removes an content from the aggregation named <code>content</code>.
 *
 * @param {int | string | sap.suite.ui.commons.ChartContainerContent} vContent the content to remove or its index or id
 * @return {sap.suite.ui.commons.ChartContainerContent} the removed content or null
 * @public
 * @name sap.suite.ui.commons.ChartContainer#removeContent
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>content</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.ChartContainerContent[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.ChartContainer#removeAllContent
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.ChartContainerContent</code> in the aggregation named <code>content</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.ChartContainerContent}
 *            oContent the content whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.ChartContainer#indexOfContent
 * @function
 */
	

/**
 * Destroys all the content in the aggregation 
 * named <code>content</code>.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#destroyContent
 * @function
 */


/**
 * Getter for aggregation <code>customIcons</code>.<br/>
 * This aggregation contains the custom icons that should be displayed additionally on the toolbar.
 * It is not guaranteed that the same instance of the sap.ui.core.Icon control will be used within the toolbar,
 * but the toolbar will contain a sap.m.OverflowToolbarButton with an icon property equal to the src property
 * of the sap.ui.core.Icon provided in the aggregation.
 * If a press event is triggered by the icon displayed on the toolbar, then the press handler of
 * the original sap.ui.core.Icon control is used. The instance of the control, that has triggered the press event,
 * can be accessed using the "controlReference" parameter of the event object.
 * 
 * @return {sap.ui.core.Icon[]}
 * @public
 * @name sap.suite.ui.commons.ChartContainer#getCustomIcons
 * @function
 */


/**
 * Inserts a customIcon into the aggregation named <code>customIcons</code>.
 *
 * @param {sap.ui.core.Icon}
 *          oCustomIcon the customIcon to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the customIcon should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the customIcon is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the customIcon is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#insertCustomIcon
 * @function
 */

/**
 * Adds some customIcon <code>oCustomIcon</code> 
 * to the aggregation named <code>customIcons</code>.
 *
 * @param {sap.ui.core.Icon}
 *            oCustomIcon the customIcon to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#addCustomIcon
 * @function
 */

/**
 * Removes an customIcon from the aggregation named <code>customIcons</code>.
 *
 * @param {int | string | sap.ui.core.Icon} vCustomIcon the customIcon to remove or its index or id
 * @return {sap.ui.core.Icon} the removed customIcon or null
 * @public
 * @name sap.suite.ui.commons.ChartContainer#removeCustomIcon
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>customIcons</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.core.Icon[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.ChartContainer#removeAllCustomIcons
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.core.Icon</code> in the aggregation named <code>customIcons</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.core.Icon}
 *            oCustomIcon the customIcon whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.ChartContainer#indexOfCustomIcon
 * @function
 */
	

/**
 * Destroys all the customIcons in the aggregation 
 * named <code>customIcons</code>.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#destroyCustomIcons
 * @function
 */


/**
 * Event fired when a user clicks on the personalization icon.
 *
 * @name sap.suite.ui.commons.ChartContainer#personalizationPress
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'personalizationPress' event of this <code>sap.suite.ui.commons.ChartContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.ChartContainer</code>.<br/> itself. 
 *  
 * Event fired when a user clicks on the personalization icon.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.ChartContainer</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#attachPersonalizationPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'personalizationPress' event of this <code>sap.suite.ui.commons.ChartContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#detachPersonalizationPress
 * @function
 */

/**
 * Fire event personalizationPress to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.ChartContainer#firePersonalizationPress
 * @function
 */


/**
 * Event fired when a user changes the displayed content.
 *
 * @name sap.suite.ui.commons.ChartContainer#contentChange
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.selectedItemId Id of the selected item.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contentChange' event of this <code>sap.suite.ui.commons.ChartContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.ChartContainer</code>.<br/> itself. 
 *  
 * Event fired when a user changes the displayed content.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.ChartContainer</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#attachContentChange
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contentChange' event of this <code>sap.suite.ui.commons.ChartContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#detachContentChange
 * @function
 */

/**
 * Fire event contentChange to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'selectedItemId' of type <code>string</code> Id of the selected item.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.ChartContainer#fireContentChange
 * @function
 */


/**
 * Custom event for zoom in.
 *
 * @name sap.suite.ui.commons.ChartContainer#customZoomInPress
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'customZoomInPress' event of this <code>sap.suite.ui.commons.ChartContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.ChartContainer</code>.<br/> itself. 
 *  
 * Custom event for zoom in.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.ChartContainer</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#attachCustomZoomInPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'customZoomInPress' event of this <code>sap.suite.ui.commons.ChartContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#detachCustomZoomInPress
 * @function
 */

/**
 * Fire event customZoomInPress to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.ChartContainer#fireCustomZoomInPress
 * @function
 */


/**
 * Custom event for zoom out.
 *
 * @name sap.suite.ui.commons.ChartContainer#customZoomOutPress
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'customZoomOutPress' event of this <code>sap.suite.ui.commons.ChartContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.ChartContainer</code>.<br/> itself. 
 *  
 * Custom event for zoom out.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.ChartContainer</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#attachCustomZoomOutPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'customZoomOutPress' event of this <code>sap.suite.ui.commons.ChartContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ChartContainer#detachCustomZoomOutPress
 * @function
 */

/**
 * Fire event customZoomOutPress to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.ChartContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.ChartContainer#fireCustomZoomOutPress
 * @function
 */


/**
 * Switch display content in the container.
 *
 * @name sap.suite.ui.commons.ChartContainer#switchChart
 * @function
 * @type sap.suite.ui.commons.ChartContainerContent
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Update ChartContainer rerendering all its contents.
 *
 * @name sap.suite.ui.commons.ChartContainer#updateChartContainer
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Returns the currently selected content control.
 *
 * @name sap.suite.ui.commons.ChartContainer#getSelectedContent
 * @function
 * @type sap.ui.core.Control
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/suite/ui/commons/ChartContainer.js
jQuery.sap.require("sap.m.Button");
jQuery.sap.require("sap.m.Select");
jQuery.sap.require("sap.ui.core.ResizeHandler");
jQuery.sap.require("sap.ui.Device");
jQuery.sap.require("sap.m.OverflowToolbarButton");
jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
sap.ui.getCore().loadLibrary("sap.viz");

/////////////////////////// PUBLIC SECTION ///////////////////////////

sap.suite.ui.commons.ChartContainer.prototype.setFullScreen = function(fullscreen){
	if (this._firstTime) {
		// can't set the full screen and toggle since dom is not loaded yet
		return;
	}
	if (this.getFullScreen() == fullscreen) { //check setter is overridden, if not, no need to set the property
		return;
	}
	var fullScreen = this.getProperty("fullScreen");
	if (fullScreen !== fullscreen) {
		this._toggleFullScreen();
	}
};

/**
 * Switch currently viewed content (causes rerendering)
 *
 * @public
 * @param {sap.ui.core.Control} chart The new content (Chart or Table) to be displayed
 */
sap.suite.ui.commons.ChartContainer.prototype.switchChart = function(chart) {
	this._setSelectedContent(chart);
	// fire the change event with id of the newly selected item..
	this.rerender(); //invalidate();
};

sap.suite.ui.commons.ChartContainer.prototype.setTitle = function(value) {
	this._oChartTitle.setText(value);
	this.setProperty("title", value, true);
};

sap.suite.ui.commons.ChartContainer.prototype.setShowLegendButton = function(value) {
	//no need to re-set the property to the same value as before
	if (this.getShowLegendButton() === value) {
		return;
	}
	this.setProperty("showLegendButton", value, false);
	if (!this.getShowLegendButton()) {
		this.setShowLegend(false);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.setShowLegend = function(value) {
	this.setProperty("showLegend", value, false);

	//propagate to all charts
	var aContents = this.getAggregation("content");

	if (aContents) {
		for (var i = 0; i < aContents.length; i++) {
			var innerChart = aContents[i].getContent();
			if (jQuery.isFunction(innerChart.setLegendVisible)) {
				innerChart.setLegendVisible(value);
			} else {
				jQuery.sap.log.info("ChartContainer: chart id " + innerChart.getId() + " is missing the setVizProperties property");
			}
		}
	}
};

sap.suite.ui.commons.ChartContainer.prototype.addAggregation = function(sAggregationName, oObject, bSuppressInvalidate) {
	if (sAggregationName === "dimensionSelectors") {
		return this.addDimensionSelector(oObject);
	} else {
		return sap.ui.base.ManagedObject.prototype.addAggregation.apply(this, arguments);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.getAggregation = function(sAggregationName, oDefaultForCreation) {
	if (sAggregationName === "dimensionSelectors") {
		return this.getDimensionSelectors();
	} else {
		return sap.ui.base.ManagedObject.prototype.getAggregation.apply(this, arguments);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.indexOfAggregation = function(sAggregationName, oObject) {
	if (sAggregationName === "dimensionSelectors") {
		return this.indexOfDimensionSelector(oObject);
	} else {
		return sap.ui.base.ManagedObject.prototype.indexOfAggregation.apply(this, arguments);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.insertAggregation = function(sAggregationName, oObject, iIndex, bSuppressInvalidate) {
	if (sAggregationName === "dimensionSelectors") {
		return this.insertDimensionSelector(oObject, iIndex);
	} else {
		return sap.ui.base.ManagedObject.prototype.insertAggregation.apply(this, arguments);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.destroyAggregation = function(sAggregationName, bSuppressInvalidate) {
	if (sAggregationName === "dimensionSelectors") {
		return this.destroyDimensionSelectors();
	} else {
		return sap.ui.base.ManagedObject.prototype.destroyAggregation.apply(this, arguments);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.removeAggregation = function(sAggregationName, vObject, bSuppressInvalidate) {
	if (sAggregationName === "dimensionSelectors") {
		return this.removeDimensionSelector(vObject);
	} else {
		return sap.ui.base.ManagedObject.prototype.removeAggregation.apply(this, arguments);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.removeAllAggregation = function(sAggregationName, bSuppressInvalidate) {
	if (sAggregationName === "dimensionSelectors") {
		return this.removeAllDimensionSelectors();
	} else {
		return sap.ui.base.ManagedObject.prototype.removeAllAggregation.apply(this, arguments);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.addDimensionSelector = function(obj) {
	this._dimSelectorsAll.push(obj);
	return this;
};

sap.suite.ui.commons.ChartContainer.prototype.getDimensionSelectors = function() {
	return this._dimSelectorsAll;
};

sap.suite.ui.commons.ChartContainer.prototype.indexOfDimensionSelector = function(oDimensionSelector) {
	for (var i = 0; i < this._dimSelectorsAll.length; i++) {
		if (this._dimSelectorsAll[i] === oDimensionSelector) {
			return i;
		}
	}
	return -1;
};

sap.suite.ui.commons.ChartContainer.prototype.insertDimensionSelector = function(oDimensionSelector, iIndex) {
	if (!oDimensionSelector) {
		return this;
	}
	var i;
	if (iIndex < 0) {
		i = 0;
	} else if (iIndex > this._dimSelectorsAll.length) {
		i = this._dimSelectorsAll.length;
	} else {
		i = iIndex;
	}
	if (i !== iIndex) {
		jQuery.sap.log.warning("ManagedObject.insertAggregation: index '" + iIndex + "' out of range [0," + this._dimSelectorsAll.length + "], forced to " + i);
	}
	this._dimSelectorsAll.splice(i, 0, oDimensionSelector);
	return this;
};

sap.suite.ui.commons.ChartContainer.prototype.destroyDimensionSelectors = function() {
	if (this._oToolBar) {
		for (var i = 0; i < this._dimSelectorsAll.length; i++) {
			if (this._dimSelectorsAll[i]) {
				this._oToolBar.removeContent(this._dimSelectorsAll[i]);
				this._dimSelectorsAll[i].destroy();
			}
		}
	}
	this._dimSelectorsAll = [];
	return this;
};

sap.suite.ui.commons.ChartContainer.prototype.removeDimensionSelector = function(vDimensionSelector) {
	if (this._oToolBar) {
		this._oToolBar.removeContent(vDimensionSelector);
	}
	if (!vDimensionSelector) {
		return null;
	} else {
		var index = this.indexOfDimensionSelector(vDimensionSelector);
		if (index === -1) {
			return null;
		} else {
			var aReturn = this._dimSelectorsAll.splice(index, 1);
			return aReturn[0];
		}
	}
};

sap.suite.ui.commons.ChartContainer.prototype.removeAllDimensionSelectors = function() {
	var aReturn = this._dimSelectorsAll.slice();
	if (this._oToolBar) {
		for (var i = 0; i < this._dimSelectorsAll.length; i++) {
			if (this._dimSelectorsAll[i]) {
				this._oToolBar.removeContent(this._dimSelectorsAll[i]);
			}
		}
	}
	this._dimSelectorsAll = [];
	return aReturn;
};

sap.suite.ui.commons.ChartContainer.prototype.addContent = function(obj) {
	this.addAggregation("content", obj);
	this._chartContentChange = true;
};

sap.suite.ui.commons.ChartContainer.prototype.insertContent = function(obj, index) {
	this.insertAggregation("content", obj, index);
	this._chartContentChange = true;
};

/**
 * @deprecated Not used anymore
 */
sap.suite.ui.commons.ChartContainer.prototype.updateContent = function() {
	this.updateAggregation("content");
	this._chartContentChange = true;
};

/**
 * Updates ChartContainer and rerenders all its contents.
 *
 * @public
 */
sap.suite.ui.commons.ChartContainer.prototype.updateChartContainer = function() {
	this._chartContentChange = true;
	this.rerender();
};

/**
 * Set selectorGroupLabel without causing a rerendering of the ChartContainer
 * @deprecated
 * @param {String} selectorGroupLabel The new selectorGroupLabel to be set
 */
sap.suite.ui.commons.ChartContainer.prototype.setSelectorGroupLabel = function(selectorGroupLabel) {
	this.setProperty("selectorGroupLabel", selectorGroupLabel, true);
};

/**
 * Returns the currently selected content control.
 *
 * @public
 * @return {sap.ui.core.Control} The currently selected content
 */
sap.suite.ui.commons.ChartContainer.prototype.getSelectedContent = function() {
	return this._oSelectedContent;
};

/**
 * Returns the currently instance of the delegate to other controls.
 *
 * @public
 * @return {sap.ui.core.delegate.ScrollEnablement} The currently instance of the delegate
 */
sap.suite.ui.commons.ChartContainer.prototype.getScrollDelegate = function() {
	return this._oScrollEnablement;
};
////////////////////////// Life cycle methods ///////////////////////////

sap.suite.ui.commons.ChartContainer.prototype.init = function() {
	var that = this;
	this._bValue = null;
	this._firstTime = true;
	this._aChartIcons = [];
	this._selectedChart = null;
	this._dimSelectorsAll = [];
	this._customIconsAll = [];
	this._oShowLegendButton = null;
	this._oActiveChartButton = null;
	this._oSelectedContent = null;
	this._bSegmentedButtonSaveSelectState = false;
	this._mOriginalVizFrameHeights = {};

	this.oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

	//Right side..

	//Full screen button
	this._oFullScreenButton = new sap.m.OverflowToolbarButton({
		icon : "sap-icon://full-screen",
		type : sap.m.ButtonType.Transparent,
		text : this.oResBundle.getText("CHARTCONTAINER_FULLSCREEN"),
		tooltip : this.oResBundle.getText("CHARTCONTAINER_FULLSCREEN"),
		press: function() {
			that._bSegmentedButtonSaveSelectState = true;
			that._toggleFullScreen();
		}
	});

	//Popup for chart content
	this._oPopup = new sap.ui.core.Popup({
		modal : true,
		shadow : false,
		autoClose : false
	});

	//legend button
	this._oShowLegendButton = new sap.m.OverflowToolbarButton({
		icon : "sap-icon://legend",
		type : sap.m.ButtonType.Transparent,
		text : this.oResBundle.getText("CHARTCONTAINER_LEGEND"),
		tooltip : this.oResBundle.getText("CHARTCONTAINER_LEGEND"),
		press: function() {
			that._bSegmentedButtonSaveSelectState = true;
			that._onLegendButtonPress();
		}
	});

	//personalization button
	this._oPersonalizationButton = new sap.m.OverflowToolbarButton({
		icon : "sap-icon://action-settings",
		type : sap.m.ButtonType.Transparent,
		text : this.oResBundle.getText("CHARTCONTAINER_PERSONALIZE"),
		tooltip : this.oResBundle.getText("CHARTCONTAINER_PERSONALIZE"),
		press: function() {
			that._oPersonalizationPress();
		}
	});

	//zoom in button
	this._oZoomInButton = new sap.m.OverflowToolbarButton({
		icon : "sap-icon://zoom-in",
		type : sap.m.ButtonType.Transparent,
		text : this.oResBundle.getText("CHARTCONTAINER_ZOOMIN"),
		tooltip : this.oResBundle.getText("CHARTCONTAINER_ZOOMIN"),
		press: function() {
			that._zoom(true);
		}
	});

	//zoom out button
	this._oZoomOutButton = new sap.m.OverflowToolbarButton({
		icon : "sap-icon://zoom-out",
		type : sap.m.ButtonType.Transparent,
		text : this.oResBundle.getText("CHARTCONTAINER_ZOOMOUT"),
		tooltip : this.oResBundle.getText("CHARTCONTAINER_ZOOMOUT"),
		press: function() {
			that._zoom(false);
		}
	});

	//segmentedButton for chart and table
	this._oChartSegmentedButton = new sap.m.SegmentedButton({
		select: function(oEvent) {
			var sChartId = oEvent.getParameter("button").getCustomData()[0].getValue();
			that._bSegmentedButtonSaveSelectState = true;
			that._switchChart(sChartId);
		}
	});

	//Left side...
	//display title if no dimensionselectors
	this._oChartTitle = new sap.m.Label();

	//overflow toolbar
	this._oToolBar = new sap.m.OverflowToolbar({
	// Use ToolBarDesign.Auto
		content : [new sap.m.ToolbarSpacer()],
		width: "auto"
	});
	this.setAggregation("toolBar", this._oToolBar);

	this._currentRangeName = sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;
	sap.ui.Device.media.attachHandler(this._handleMediaChange, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD);

	this.sResizeListenerId = null;
	if (jQuery.device.is.desktop) {
		this.sResizeListenerId = sap.ui.core.ResizeHandler.register(this, jQuery.proxy(this._performHeightChanges, this));
	} else {
		sap.ui.Device.orientation.attachHandler(this._performHeightChanges, this);
		sap.ui.Device.resize.attachHandler(this._performHeightChanges, this);
	}
};

sap.suite.ui.commons.ChartContainer.prototype.onAfterRendering = function() {
	var that = this;
	if ((this.sResizeListenerId === null) && (jQuery.device.is.desktop)) {
		this.sResizeListenerId = sap.ui.core.ResizeHandler.register(this, jQuery.proxy(this._performHeightChanges, this));
	}
	if (this.getAutoAdjustHeight() || this.getFullScreen()) {
		//fix the flickering issue when switch chart in full screen mode
		jQuery.sap.delayedCall(500, this, function() {
			that._performHeightChanges();
		});
	}
	var bVizFrameSelected = this.getSelectedContent() && this.getSelectedContent().getContent() instanceof sap.viz.ui5.controls.VizFrame;
	this._oScrollEnablement = new sap.ui.core.delegate.ScrollEnablement(this, this.getId() + "-wrapper", {
		horizontal : !bVizFrameSelected,
		vertical : !bVizFrameSelected
	});
	this._firstTime = false;
};

sap.suite.ui.commons.ChartContainer.prototype.onBeforeRendering = function() {
	var onPress = function(oEvent, oData) {
		oData.icon.firePress({
			controlReference : oEvent.getSource()
		});
	};
	if (this._chartContentChange || this._firstTime) {
		this._chartChange();
	}
	if (this.getAggregation("customIcons") && this.getAggregation("customIcons").length > 0) {
		if (this._customIconsAll.length === 0) {
			for (var i = 0; i < this.getAggregation("customIcons").length; i++) {
				var oIcon = this.getAggregation("customIcons")[i];
				var oButton = new sap.m.OverflowToolbarButton({
					icon : oIcon.getSrc(),
					text : oIcon.getTooltip(),
					tooltip : oIcon.getTooltip(),
					type : sap.m.ButtonType.Transparent,
					width : "3rem"
				});
				oButton.attachPress({
					icon : oIcon
				}, onPress);
				this._customIconsAll.push(oButton);
			}
		}
	} else {
		this._customIconsAll = [];
	}
	this._adjustDisplay();
};

sap.suite.ui.commons.ChartContainer.prototype.exit = function() {
	sap.ui.Device.media.detachHandler(this._handleMediaChange, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
	if (this._oFullScreenButton) {
		this._oFullScreenButton.destroy();
		this._oFullScreenButton = undefined;
	}
	if (this._oPopup) {
		this._oPopup.destroy();
		this._oPopup = undefined;
	}
	if (this._oShowLegendButton) {
		this._oShowLegendButton.destroy();
		this._oShowLegendButton = undefined;
	}
	if (this._oPersonalizationButton) {
		this._oPersonalizationButton.destroy();
		this._oPersonalizationButton = undefined;
	}
	if (this._oActiveChartButton) {
		this._oActiveChartButton.destroy();
		this._oActiveChartButton = undefined;
	}
	if (this._oChartSegmentedButton) {
		this._oChartSegmentedButton.destroy();
		this._oChartSegmentedButton = undefined;
	}
	if (this._oSelectedContent) {
		this._oSelectedContent.destroy();
		this._oSelectedContent = undefined;
	}
	if (this._oToolBar) {
		this._oToolBar.destroy();
		this._oToolBar = undefined;
	}
	if (this._dimSelectorsAll) {
		for (var i = 0; i < this._dimSelectorsAll.length; i++){
			if (this._dimSelectorsAll[i]) {
				this._dimSelectorsAll[i].destroy();
			}
		}
		this._dimSelectorsAll = undefined;
	}
	if (this._oScrollEnablement) {
		this._oScrollEnablement.destroy();
		this._oScrollEnablement = undefined;
	}
	if (jQuery.device.is.desktop && this.sResizeListenerId) {
		sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);
		this.sResizeListenerId = null;
	} else {
		sap.ui.Device.orientation.detachHandler(this._performHeightChanges, this);
		sap.ui.Device.resize.detachHandler(this._performHeightChanges, this);
	}
	if (this._oZoomInButton) {
		this._oZoomInButton.destroy();
		this._oZoomInButton = undefined;
	}
	if (this._oZoomOutButton) {
		this._oZoomOutButton.destroy();
		this._oZoomOutButton = undefined;
	}
};

////////////////////////// PRIVATE SECTION ///////////////////////////

/**
 * Toggle normal and full screen mode
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._toggleFullScreen = function() {
	var bFullScreen,
		sId,
		sHeight,
		aContent,
		oObjectContent;

	bFullScreen = this.getProperty("fullScreen");
	if (bFullScreen) {
		aContent = this.getAggregation("content");
		this._closeFullScreen();
		this.setProperty("fullScreen", false, true);
		for (var i = 0; i < aContent.length; i++) {
			oObjectContent = aContent[i].getContent();
			oObjectContent.setWidth("100%");
			sHeight = this._mOriginalVizFrameHeights[oObjectContent.getId()];
			if (sHeight) {
				oObjectContent.setHeight(sHeight);
			}
		}
		this.invalidate();
	} else {
		//fix chart disappear when toggle chart with full screen button
		//by surpressing the invalid for the setProperty, this delay shouldn't be needed.
		this._openFullScreen();
		this.setProperty("fullScreen", true, true);
	}
	var sIcon = (bFullScreen ? "sap-icon://full-screen" : "sap-icon://exit-full-screen");
	this._oFullScreenButton.setIcon(sIcon);
	this._oFullScreenButton.focus();
};

/**
 * Open chartcontainer content with Full Screen
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._openFullScreen = function() {
	this.$content = this.$();
	if (this.$content) {
		this.$tempNode = jQuery("<div></div>"); // id='" + this.$content.attr("id")+"-overlay"+ "'
		this.$content.before(this.$tempNode);
		this._$overlay = jQuery("<div id='" + jQuery.sap.uid() + "'></div>");
		this._$overlay.addClass("sapSuiteUiCommonsChartContainerOverlay");
		this._$overlay.append(this.$content);
		this._oPopup.setContent(this._$overlay);
	} else {
		jQuery.sap.log.warn("Overlay: content does not exist or contains more than one child");
	}
	this._oPopup.open(200, null, jQuery("body"));
};

/**
 * Close Full Screen and return to normal mode
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._closeFullScreen = function() {
	if (this._oScrollEnablement !== null) {
		this._oScrollEnablement.destroy();
		this._oScrollEnablement = null;
	}
	this.$tempNode.replaceWith(this.$content);
	this._oToolBar.setDesign(sap.m.ToolbarDesign.Auto);
	this._oPopup.close();
	this._$overlay.remove();
};

/**
 * Height change when toggle full and normal mode
 * Mobile swap between portrait and landscape will execute height change too
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._performHeightChanges = function() {
	var $this,
		iChartContainerHeight,
		iToolBarHeight,
		iToolbarBottomBorder,
		iNewChartHeight,
		iExistingChartHeight,
		oInnerChart;

	if (this.getAutoAdjustHeight() || this.getFullScreen()) {
		$this = this.$();
		// Only adjust height after both toolbar and chart are rendered in DOM
		if (($this.find('.sapSuiteUiCommonsChartContainerToolBarArea').children()[0]) && ($this.find('.sapSuiteUiCommonsChartContainerChartArea').children()[0])) {
			iChartContainerHeight = $this.height();
			iToolBarHeight = $this.find('.sapSuiteUiCommonsChartContainerToolBarArea').children()[0].clientHeight;
			iToolbarBottomBorder = Math.round(parseFloat($this.find('.sapSuiteUiCommonsChartContainerToolBarArea').children().css("border-bottom")));
			if (isNaN(iToolbarBottomBorder)) {
				iToolbarBottomBorder = 0;
			}
			iNewChartHeight = iChartContainerHeight - iToolBarHeight - iToolbarBottomBorder;
			iExistingChartHeight = $this.find('.sapSuiteUiCommonsChartContainerChartArea').children()[0].clientHeight;
			oInnerChart = this.getSelectedContent().getContent();
			if ((oInnerChart instanceof sap.viz.ui5.controls.VizFrame) || (sap.chart && sap.chart.Chart && oInnerChart instanceof sap.chart.Chart)) {
				if (iNewChartHeight > 0 && iNewChartHeight !== iExistingChartHeight) {
					this._rememberOriginalHeight(oInnerChart);
					oInnerChart.setHeight(iNewChartHeight + "px");
				}
			} else if (oInnerChart.getDomRef().offsetWidth !== this.getDomRef().clientWidth) {
				// For table/non-vizFrame case, if width changes during resize event, force a rerender to have it fit 100% width
				this.rerender();
			}
		}
	}
};

/**
 * In the fullscreen mode it is necessary to remember the original height of the current chart
 * to be able to restore it later on in non fullscreen mode
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._rememberOriginalHeight = function(chart) {
	var sId,
		sHeight;

	sId = chart.getId();
	if (jQuery.isFunction(chart.getHeight)) {
		sHeight = chart.getHeight();
	} else {
		sHeight = 0;
	}
	this._mOriginalVizFrameHeights[sId] = sHeight;
};

/**
 * Legend button pressed
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._onLegendButtonPress = function() {
	if (this.getSelectedContent()) {
		var selectedChart = this.getSelectedContent().getContent();
		//only support if content has legendVisible property
		if (jQuery.isFunction(selectedChart.getLegendVisible)) {
			var legendOn = selectedChart.getLegendVisible();
			selectedChart.setLegendVisible(!legendOn);
			this.setShowLegend(!legendOn);
		} else {
			this.setShowLegend(!this.getShowLegend());
		}
	} else {
		this.setShowLegend(!this.getShowLegend());
	}
};

/**
 * Personalization button pressed
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._oPersonalizationPress = function() {
	this.firePersonalizationPress();
};

/**
 * Switch Chart - i.e. default with bubble chart and click bar chart button
 *
 * @private
 * @param {String} chartId The ID of the chart to be searched
 */
sap.suite.ui.commons.ChartContainer.prototype._switchChart = function(chartId) {

	var oChart = this._findChartById(chartId);

	this._setSelectedContent(oChart);

	this.fireContentChange({
		selectedItemId : chartId
	}); // fire the change event with id of the newly selected item..
	this.rerender(); //invalidate();
};

/**
 * Collect all charts
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._chartChange = function() {
	var aCharts = this.getContent();
	this._destroyButtons(this._aChartIcons);
	this._aChartIcons = [];
	if (this.getContent().length === 0) {
		this._oChartSegmentedButton.removeAllButtons();
		this._setDefaultOnSegmentedButton();
		this.switchChart(null);
	}
	if (aCharts) {
		for (var i = 0; i < aCharts.length; i++) {
			var innerChart = aCharts[i].getContent();
			// In case the content is not visible, skip this content.
			if (!aCharts[i].getVisible()) {
				continue;
			}
			if (innerChart.setVizProperties) {
				innerChart.setVizProperties({
					legend : {
						visible : this.getShowLegend()
					},
					sizeLegend : {
						visible : this.getShowLegend()
					}
				});
			}
			if (innerChart.setWidth) {
				innerChart.setWidth("100%");
			}
			if (jQuery.isFunction(innerChart.setHeight) && this._mOriginalVizFrameHeights[innerChart.getId()]) {
				innerChart.setHeight(this._mOriginalVizFrameHeights[innerChart.getId()]);
			}
			var oButtonIcon = new sap.m.Button({
				icon : aCharts[i].getIcon(),
				type : sap.m.ButtonType.Transparent,
				//fix the chart button and chart itself disappear when switch chart in full screen mode
				width: "3rem",
				tooltip : aCharts[i].getTitle(),
				customData : [new sap.ui.core.CustomData({
					key : 'chartId',
					value : innerChart.getId()
				})],
				press : jQuery.proxy(function(oEvent) {
					var sChartId = oEvent.getSource().getCustomData()[0].getValue();
					this._switchChart(sChartId);
				}, this)
			});
			this._aChartIcons.push(oButtonIcon);

			if (i === 0) {
				this._setSelectedContent(aCharts[i]);
				this._oActiveChartButton = oButtonIcon;
			}
		}
	}
	this._chartContentChange = false;
};

/**
 * Set selected content
 * @param {sap.ui.core.Control} obj The object to be set as currently viewed
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._setSelectedContent = function(obj) {
	if (obj === null) {
		this._oShowLegendButton.setVisible(false);
		return;
	}
	var oChart = obj.getContent();
	var sChartId = oChart.getId();
	var oRelatedButton = null;
	for (var i = 0; !oRelatedButton && i < this._aChartIcons.length; i++) {
		if (this._aChartIcons[i].getCustomData()[0].getValue() === sChartId &&
				oChart.getVisible() === true) {
			oRelatedButton = this._aChartIcons[i];
			this._oChartSegmentedButton.setSelectedButton(oRelatedButton);
			break;
		}
	}
	//show/hide the showLegend buttons
	var bShowChart = (oChart instanceof sap.viz.ui5.controls.VizFrame) || (jQuery.isFunction(oChart.setLegendVisible)); //hide legend icon if table, show if chart
	if (this.getShowLegendButton()){
		this._oShowLegendButton.setVisible(bShowChart);
	}
	var bShowZoom = (this.getShowZoom()) && (sap.ui.Device.system.desktop) && (oChart instanceof sap.viz.ui5.controls.VizFrame);
	this._oZoomInButton.setVisible(bShowZoom);
	this._oZoomOutButton.setVisible(bShowZoom);
	this._oSelectedContent = obj;
};

/**
 * Get chart inside the content aggregation by id
 *
 * @private
 * @param {String} id The ID of the content control being searched for
 * @returns {sap.ui.core.Control} The object found or null
 */
sap.suite.ui.commons.ChartContainer.prototype._findChartById = function(id) {
	var aObjects = this.getAggregation("content");
	if (aObjects) {
		for (var i = 0; i < aObjects.length; i++) {
			if (aObjects[i].getContent().getId() === id) {
				return aObjects[i];
			}
		}
	}
	return null;
};

/**
 * Adjusts customizable icons of overflow toolbar, displays chart buttons
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._adjustIconsDisplay = function() {
	for (var i = 0; i < this._customIconsAll.length; i++ )	{
		this._oToolBar.addContent(this._customIconsAll[i]);
	}
	if (!this._firstTime) {
		this._oChartSegmentedButton.removeAllButtons();
	}

	var iLength = this._aChartIcons.length;
	if (iLength > 1) {
		for (var i = 0; i < iLength; i++) {
			this._oChartSegmentedButton.addButton(this._aChartIcons[i]);
		}
		this._oToolBar.addContent(this._oChartSegmentedButton);
	}

	if (this.getShowLegendButton()){
		this._oToolBar.addContent(this._oShowLegendButton);
	}
	if (this.getShowPersonalization()) {
		this._oToolBar.addContent(this._oPersonalizationButton);
	}
	if (this.getShowZoom() && (sap.ui.Device.system.desktop)) {
		this._oToolBar.addContent(this._oZoomInButton);
		this._oToolBar.addContent(this._oZoomOutButton);
	}
	if (this.getShowFullScreen()) {
		this._oToolBar.addContent(this._oFullScreenButton);
	}
};

/**
 * The first button inside the segmented button is only set as default if the
 * user did not click explicitly on another button inside the segmented button
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._setDefaultOnSegmentedButton = function() {
	if (!this._bSegmentedButtonSaveSelectState) {
		this._oChartSegmentedButton.setSelectedButton(null);
	}
	this._bSegmentedButtonSaveSelectState = false;
};

/**
 * Adjust dimensionselector display
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._adjustSelectorDisplay = function() {
	var dimensionSelectors = this.getDimensionSelectors();
	if (dimensionSelectors.length === 0) {
		this._oChartTitle.setVisible(true);
		this._oToolBar.addContent(this._oChartTitle);
		return;
	}

	for (var i = 0; i < dimensionSelectors.length; i++) {
		if (jQuery.isFunction(dimensionSelectors[i].setAutoAdjustWidth)) {
			dimensionSelectors[i].setAutoAdjustWidth(true);
		}
		this._oToolBar.insertContent(dimensionSelectors[i], i);
	}
};

/**
 * Adjust toolbar dimensionselector, customicons, buttons ...
 *
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._adjustDisplay = function() {
	this._oToolBar.removeAllContent();
	this._adjustSelectorDisplay();
	this._oToolBar.addContent(new sap.m.ToolbarSpacer());
	this._adjustIconsDisplay();
};

/**
 * @param  {sap.ui.base.Event} evt The SAPUI5 Event Object
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._handleMediaChange = function(evt) {
	this._currentRangeName = sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;
	this._adjustDisplay();
};

/**
 * Zoom in or out ChartContainer content
 *
 * @param {Boolean} zoomin Set to true to perform zoom-in action. Set to false (or omit) to zoom out.
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._zoom = function(zoomin) {
	var oChart = this.getSelectedContent().getContent();
	if (oChart instanceof sap.viz.ui5.controls.VizFrame) {
		if (zoomin) {
			oChart.zoom({"direction": "in"});
		} else {
			oChart.zoom({"direction": "out"});
		}
	}
	if (zoomin){
		this.fireCustomZoomInPress();
	} else {
		this.fireCustomZoomOutPress();
	}
};

/**
 * Buttons which are not needed anymore are destroyed here.
 *
 * @param {sap.ui.core.Control[]} buttons The buttons which need to be destroyed.
 * @private
 */
sap.suite.ui.commons.ChartContainer.prototype._destroyButtons = function(buttons) {
	buttons.forEach(function(oButton) {
		oButton.destroy();
	});
};
