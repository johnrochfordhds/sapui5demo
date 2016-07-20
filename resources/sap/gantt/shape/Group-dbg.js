/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/shape/Shape"
], function (Shape) {
	"use strict";
	
	/**
	 * Creates and initializes a new Group class.
	 * 
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * 
	 * @class 
	 * Group shape class using SVG tag 'group'. It is a container shape. Any other shapes can be aggregated under a group.
	 * 
	 * <p>
	 * See {@link http://www.w3.org/TR/SVG/struct.html#Groups SVG specification 1.1 for 'group' element} for
	 * more information about the HTML tag.<br/><br/>
	 * </p>
	 * 
	 * @extend sap.gantt.shape.Shape
	 * 
	 * @author SAP SE
	 * @version 1.36.8
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.shape.Group
	 */
	var Group = Shape.extend("sap.gantt.shape.Group", /** @lends sap.gantt.shape.Group.prototype */ {
		metadata: {
			properties: {
				tag: {type: "string", defaultValue: "g"},
				RLSAnchors: {type: "array"}
			},
			aggregations: {
				
				/**
				 * 
				 */
				shapes: {type: "sap.gantt.shape.Shape", multiple: true, singularName: "shape"}
			}
		}
	});
	
	/**
	 * Gets the value of property <code>tag</code>.
	 * 
	 * SVG tag name of the shape.
	 * See {@link http://www.w3.org/TR/SVG/shapes.html SVG 1.1 specification for shapes}.<br/>
	 * <b>Note:</b> We do not recommend that you change this value using a configuration or coding.
	 * 
	 * @name sap.gantt.shape.Group.prototype.getTag
	 * @function
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and the row data.
	 * @return {string} Value of property <code>tag</code>.
	 * @public
	 */
	
	/**
	 * To enable connections between in-row shapes, a custom Group class has to be implemented that extends <code>sap.gantt.shape.Group</code>.
	 * Additionally, the <code>getRLSAnchors</code> method has to be implemented for the Relationship class to know the coordinates of the connection points.
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and the row data.
	 * @return {object} Coordinates of the "from" shape (start) and "to" shape (end)
	 * @public
	 */
	Group.prototype.getRLSAnchors = function (oData){
		return this._configFirst("RLSAnchors", oData);
	};
	
	return Group;
}, true);
