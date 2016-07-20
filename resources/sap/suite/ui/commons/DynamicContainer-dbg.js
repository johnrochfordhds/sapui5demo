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

// Provides control sap.suite.ui.commons.DynamicContainer.
jQuery.sap.declare("sap.suite.ui.commons.DynamicContainer");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new DynamicContainer.
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
 * <li>{@link #getDisplayTime displayTime} : int (default: 5000)</li>
 * <li>{@link #getTransitionTime transitionTime} : int (default: 500)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getTiles tiles} : sap.suite.ui.commons.GenericTile[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * The control that displays multiple GenericTile controls as changing slides.
 * @extends sap.ui.core.Control
 * @version 1.36.8
 *
 * @constructor
 * @public
 * @deprecated Since version 1.34. 
 * Deprecated. Moved to openui5.
 * @name sap.suite.ui.commons.DynamicContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.DynamicContainer", { metadata : {

	deprecated : true,
	library : "sap.suite.ui.commons",
	properties : {
		"displayTime" : {type : "int", group : "Appearance", defaultValue : 5000},
		"transitionTime" : {type : "int", group : "Appearance", defaultValue : 500}
	},
	aggregations : {
		"tiles" : {type : "sap.suite.ui.commons.GenericTile", multiple : true, singularName : "tile"}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.DynamicContainer with name <code>sClassName</code> 
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
 * @name sap.suite.ui.commons.DynamicContainer.extend
 * @function
 */


/**
 * Getter for property <code>displayTime</code>.
 * The time of the slide display in milliseconds.
 *
 * Default value is <code>5000</code>
 *
 * @return {int} the value of property <code>displayTime</code>
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#getDisplayTime
 * @function
 */

/**
 * Setter for property <code>displayTime</code>.
 *
 * Default value is <code>5000</code> 
 *
 * @param {int} iDisplayTime  new value for property <code>displayTime</code>
 * @return {sap.suite.ui.commons.DynamicContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#setDisplayTime
 * @function
 */


/**
 * Getter for property <code>transitionTime</code>.
 * The time of the slide changing in milliseconds.
 *
 * Default value is <code>500</code>
 *
 * @return {int} the value of property <code>transitionTime</code>
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#getTransitionTime
 * @function
 */

/**
 * Setter for property <code>transitionTime</code>.
 *
 * Default value is <code>500</code> 
 *
 * @param {int} iTransitionTime  new value for property <code>transitionTime</code>
 * @return {sap.suite.ui.commons.DynamicContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#setTransitionTime
 * @function
 */


/**
 * Getter for aggregation <code>tiles</code>.<br/>
 * The set of Generic Tiles to be shown in the control.
 * 
 * @return {sap.suite.ui.commons.GenericTile[]}
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#getTiles
 * @function
 */


/**
 * Inserts a tile into the aggregation named <code>tiles</code>.
 *
 * @param {sap.suite.ui.commons.GenericTile}
 *          oTile the tile to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the tile should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the tile is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the tile is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.DynamicContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#insertTile
 * @function
 */

/**
 * Adds some tile <code>oTile</code> 
 * to the aggregation named <code>tiles</code>.
 *
 * @param {sap.suite.ui.commons.GenericTile}
 *            oTile the tile to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.DynamicContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#addTile
 * @function
 */

/**
 * Removes an tile from the aggregation named <code>tiles</code>.
 *
 * @param {int | string | sap.suite.ui.commons.GenericTile} vTile the tile to remove or its index or id
 * @return {sap.suite.ui.commons.GenericTile} the removed tile or null
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#removeTile
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>tiles</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.GenericTile[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#removeAllTiles
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.GenericTile</code> in the aggregation named <code>tiles</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.GenericTile}
 *            oTile the tile whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#indexOfTile
 * @function
 */
	

/**
 * Destroys all the tiles in the aggregation 
 * named <code>tiles</code>.
 * @return {sap.suite.ui.commons.DynamicContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.DynamicContainer#destroyTiles
 * @function
 */

// Start of sap/suite/ui/commons/DynamicContainer.js
/*!
 * ${copyright}
 */

jQuery.sap.require("sap.m.SlideTile");

sap.m.SlideTile.extend("sap.suite.ui.commons.DynamicContainer", /** @lends sap.suite.ui.commons.DynamicContainer.prototype */ {
  metadata : {
    library : "sap.suite.ui.commons"
  }
});