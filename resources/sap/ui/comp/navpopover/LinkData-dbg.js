/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.navpopover.LinkData.
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Element'
], function(jQuery, library, Element) {
	"use strict";

	/**
	 * Constructor for a new navpopover/LinkData.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class Stores display text together with a navigation target hyperlink.<br>
	 *        The LinkData class is used by {@link sap.ui.comp.navpopover.SmartLink SmartLink} and
	 *        {@link sap.ui.comp.navpopover.SemanticObjectController SemanticObjectController} to define the visible links on
	 *        {@link sap.ui.comp.navpopover.NavigationPopover NavigationPopover}.
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.navpopover.LinkData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var LinkData = Element.extend("sap.ui.comp.navpopover.LinkData", /** @lends sap.ui.comp.navpopover.LinkData.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Text which can be displayed on the UI
				 *
				 * @since 1.28.0
				 */
				text: {
					type: "string",
					defaultValue: null
				},

				/**
				 * Destination link for a navigation operation in internal format. <b>Note</b>: The link will be encoded before it is shown in external
				 * format using the <code>hrefForExternal</code> method of the CrossApplicationNavigation service.
				 *
				 * @since 1.28.0
				 */
				href: {
					type: "string",
					defaultValue: null
				},

				/**
				 * The standard values for the <code>target</code> property are: _self, _top, _blank, _parent, _search. Alternatively, a frame name
				 * can be entered. This property is only used if the <code>href</code> property is set.
				 */
				target: {
					type: "string",
					defaultValue: null
				}
			}
		}
	});

	return LinkData;

}, /* bExport= */true);
