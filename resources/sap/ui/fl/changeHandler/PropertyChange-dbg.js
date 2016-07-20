/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

/*global sap */

sap.ui.define(["jquery.sap.global", "sap/ui/fl/changeHandler/Base", "sap/ui/fl/Utils"], function(jQuery, Base, FlexUtils) {
	"use strict";

	/**
	 * Change handler for setting properties on controls
	 *
	 * @constructor
	 * @alias sap.ui.fl.changeHandler.PropertyChange
	 * @author SAP SE
	 * @version 1.36.12
	 * @since 1.36
	 * @private
	 * @experimental Since 1.36. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var PropertyChange = function() {
	};

	PropertyChange.prototype = jQuery.sap.newObject(Base.prototype);

	/**
	 * Changes the properties on the given control
	 *
	 * @param {object} oChange - change object with instructions to be applied on the control
	 * @param {object} oControl - the control which has been determined by the selector id
	 * @public
	 * @name sap.ui.fl.changeHandler.PropertyChange#applyChange
	 */
	PropertyChange.prototype.applyChange = function(oChange, oControl) {

		try {
			var oDef = oChange.getDefinition();

			var propertyName = oDef.content.property;
			var propertyMetadata = oControl.getMetadata().getAllProperties()[propertyName];
			var propertySetter = propertyMetadata._sMutator;

			oControl[propertySetter](oDef.content.newValue);
		} catch (ex) {
			throw new Error("Applying property changes failed: " +  ex);
		}

	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {object} oChange change object to be completed
	 * @param {object} oSpecificChangeInfo with attribute property which contains an array which holds objects which have attributes
	 * 				   id and index - id is the id of the field to property and index the new position of the field in the smart form group
	 * @public
	 * @name sap.ui.fl.changeHandler.PropertyChange#completeChangeContent
	 */
	PropertyChange.prototype.completeChangeContent = function(oChange, oSpecificChangeInfo) {

		var oChangeJson = oChange.getDefinition();

		if (oSpecificChangeInfo.content) {

			oChangeJson.content = oSpecificChangeInfo.content;

		} else {

			throw new Error("oSpecificChangeInfo attribute required");

		}

	};

	return PropertyChange;
}, /* bExport= */true);
