/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

// Provides control sap.ui.vbm.FeatureCollection.
sap.ui.define([
	'sap/ui/core/theming/Parameters', './GeoJsonLayer', './library'
], function(Parameters, GeoJsonLayer, library) {
	"use strict";

	/**
	 * Constructor for a new FeatureCollection.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class FeatureCollection aggregation container. A FeatureCollection can render the content of an assigned GeoJSON. The naming is associated to
	 *        the GeoJSON standard. All features found in the GeoJSON are rendered as separated objects. From the possible feature types only
	 *        <ul>
	 *        <li>Polygon and
	 *        <li>Multipolygon
	 *        </ul>
	 *        are supported so far. The feature type support will be extended in the upcoming releases.<br>
	 *        All features from the GeoJSON will be rendered with the given default colors and are inactive. They do not react on mouse over, except
	 *        with tooltip, or raise any events on click or right click.<br>
	 *        By adding <i>Feature elements</i> to the items aggregation you can make the match (by id) feature from the GeoJSON interactive and give
	 *        it alternative colors.
	 * @extends sap.ui.vbm.GeoJsonLayer
	 * @constructor
	 * @public
	 * @alias sap.ui.vbm.FeatureCollection
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FeatureCollection = GeoJsonLayer.extend("sap.ui.vbm.FeatureCollection", /** @lends sap.ui.vbm.FeatureCollection.prototype */
	{
		metadata: {

			library: "sap.ui.vbm",
			properties: {},
			defaultAggregation: "items",
			aggregations: {

				/**
				 * Feature object aggregation
				 */
				items: {
					type: "sap.ui.vbm.Feature",
					multiple: true,
					singularName: "item"
				}
			},
			events: {

				/**
				 * The event is raised when there is a click action on an aggregated Feature. Clicks on other Features from the GeoJSON are ignored.
				 */
				click: {
					parameters: {
						/**
						 * Id of clicked Feature
						 */
						featureId: {
							type: "string"
						}
					}
				},

				/**
				 * The event is raised when there is a right click or a tap and hold action on an aggregated Feature. Clicks on other Features from
				 * the GeoJSON are ignored.
				 */
				contextMenu: {
					parameters: {
						/**
						 * Id of clicked Feature
						 */
						featureId: {
							type: "string"
						}
					}
				}
			}
		}
	});

	// /**
	// * This file defines behavior for the control,
	// */

	// ...........................................................................//
	// model creators............................................................//

	FeatureCollection.prototype.getDataObjects = function() {
		if (this.mbGeoJSONDirty) {
			this._triggerFeatureCreation();
		}

		// apply the feature properties to the vbi datacontext.....................//
		// do a clone of the original data, to be able to handle complete....//
		// model changes..........................................................//

		var aElements = [], aPolys = [], aLines = [], aPoints = [];
		jQuery.extend(aElements, this.mFeatureColl); // shallow copy of array -> need to copy elements before change!

		var oOverlayMap = {};
		if (aElements.length) {
			// create lookup for overlayed features..................................//
			var aOverlayFeatures = this.getItems();
			for (var nJ = 0, len = aOverlayFeatures ? aOverlayFeatures.length : 0, item; nJ < len; ++nJ) {
				item = aOverlayFeatures[nJ];
				oOverlayMap[item.getFeatureId()] = item;
			}
		}

		// iterate over feature table.............................................//
		for (var nK = 0, oElement, oOverlay, tmp; nK < aElements.length; ++nK) {
			oElement = aElements[nK];

			if ((oOverlay = oOverlayMap[oElement.K])) {
				// Overlay found, apply properties.....................................//
				// do not change original element -> make copy first!
				var oCopy = {};
				jQuery.extend(oCopy, oElement);
				oElement = aElements[nK] = oCopy;
				// apply changes
				oElement.C = oOverlay.getColor();
				if ((tmp = oOverlay.getTooltip())) {
					oElement.TT = tmp;
				}
			}
			switch (oElement.type) {
				case "Polygon":
				case "MultiPolygon":
					aPolys.push(oElement);
					break;
				case "LineString":
				case "MultiLineString":
					aLines.push(oElement);
					break;
				case "Point":
				case "MultiPoint":
					aPoints.push(oElement);
					break;
				default:
					jQuery.sap.log.error("FeatureCollection: Unknown feature type: " + oElement.type);
			}
		}

		return [
			{
				"name": this.getId() + "_Polys",
				"type": "N",
				"E": aPolys
			}, {
				"name": this.getId() + "_Lines",
				"type": "N",
				"E": aLines
			}, {
				"name": this.getId() + "_Points",
				"type": "N",
				"E": aPoints
			}
		];
	};

	FeatureCollection.prototype.getDataRemoveObjects = function() {
		return [
			{
				"name": this.getId() + "_Polys",
				"type": "N"
			}, {
				"name": this.getId() + "_Lines",
				"type": "N"
			}, {
				"name": this.getId() + "_Points",
				"type": "N"
			}
		];
	};

	/**
	 * Returns Properties for Features like name, bounding box, and midpoint
	 * 
	 * @param {string[]} aFeatureIds Array of Feature Ids. The Feature Id must match the GeoJSON tag.
	 * @returns {array} Array of Feature Information Objects. Each object in the array has the properties BBox: Bounding Box for the Feature in format
	 *          "lonMin;latMin;lonMax;latMax", Midpoint: Centerpoint for Feature in format "lon;lat", Name: Name of the Feature, and Properties: Array
	 *          of name-value-pairs associated with the Feature
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FeatureCollection.prototype.getFeaturesInfo = function(aFeatureIds) {
		var result = [];
		for (var nJ = 0, len = aFeatureIds.length, featureId; nJ < len; ++nJ) {
			featureId = aFeatureIds[nJ];
			result[featureId] = {};
			result[featureId].BBox = this.mFeatureBBox[featureId];
			result[featureId].Midpoint = [
				(this.mFeatureBBox[featureId][0] + this.mFeatureBBox[featureId][1]) / 2, (this.mFeatureBBox[featureId][2] + this.mFeatureBBox[featureId][3]) / 2
			];
			result[featureId].Name = this.mNames[featureId];
			result[featureId].Properties = this.mFeatureProps[featureId];
		}
		return result;
	};

	FeatureCollection.prototype.handleEvent = function(event) {
		var s = event.Action.name;

		var funcname = "fire" + s[0].toUpperCase() + s.slice(1);

		// first we try to get the event on a FeatureCollection instance......................//
		var oOverlay, sInstance = event.Action.instance;
		if ((oOverlay = this.findInstance(sInstance))) {

			if (oOverlay.mEventRegistry[s]) {
				if (s === "click") {
					oOverlay.mClickGeoPos = event.Action.AddActionProperties.AddActionProperty[0]['#'];
				}
				if (s === "contextMenu") {
					oOverlay.mClickPos = [
						event.Action.Params.Param[0]['#'], event.Action.Params.Param[1]['#']
					];
					// create an empty menu
					jQuery.sap.require("sap.ui.unified.Menu");

					if (this.oParent.mVBIContext.m_Menus) {
						this.oParent.mVBIContext.m_Menus.deleteMenu("DynContextMenu");
					}

					var oMenuObject = new sap.ui.unified.Menu();
					oMenuObject.vbi_data = {};
					oMenuObject.vbi_data.menuRef = "CTM";
					oMenuObject.vbi_data.VBIName = "DynContextMenu";

					// fire the contextMenu..................................................//
					oOverlay.fireContextMenu({
						menu: oMenuObject
					});
				} else if (s === "handleMoved") {
					oOverlay[funcname]({
						data: event
					});
				} else {
					oOverlay[funcname]({});
				}
			}
		}
		// check wether event is registered on Feature Collection and fire in case of
		if (this.mEventRegistry[s]) {
			this[funcname]({
				featureId: sInstance.split(".")[1]
			});
		}
	};

	/**
	 * open a Detail Window
	 * 
	 * @param {sap.ui.vbm.Feature} oFeature VO instance for which the Detail Window should be opened
	 * @param {object} oParams Parameter object
	 * @param {string} oParams.caption Text for Detail Window caption
	 * @param {string} oParams.offsetX position offset in x-direction from the anchor point
	 * @param {string} oParams.offsetY position offset in y-direction from the anchor point
	 * @returns {void}
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FeatureCollection.prototype.openDetailWindow = function(oFeature, oParams) {
		var oParent = this.getParent();
		oParent.mDTWindowCxt.bUseClickPos = true;
		oParent.mDTWindowCxt.open = true;
		oParent.mDTWindowCxt.src = oFeature;
		oParent.mDTWindowCxt.key = oFeature.getFeatureId();
		oParent.mDTWindowCxt.params = oParams;
		oParent.m_bWindowsDirty = true;
		oParent.invalidate(this);
	};

	/**
	 * open the context menu
	 * 
	 * @param {sap.ui.vbm.Feature} oFeature VO instance for which the Detail Window should be opened
	 * @param {object} oMenu the context menu to be opened
	 * @returns {void}
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FeatureCollection.prototype.openContextMenu = function(oFeature, oMenu) {
		this.oParent.openContextMenu("Area", oFeature, oMenu);
	};

	FeatureCollection.prototype.handleChangedData = function(aElements) {
		if (aElements && aElements.length) {
			for (var nI = 0, oElement, oInst; nI < aElements.length; ++nI) {
				oElement = aElements[nI];
				oInst = this.findInstance(oElement.K);
				if (oInst) {
					oInst.handleChangedData(oElement);
				}
			}
		}
	};

	return FeatureCollection;

});
