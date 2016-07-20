/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
sap.ui.define([ "sap/apf/modeler/ui/controller/requestOptions" ], function(BaseController) {
	"use strict";
	return BaseController.extend("sap.apf.modeler.ui.controller.facetFilterVHR", {
		// Called on initialization of the view. Sets the static texts for all controls in UI
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("vhSource"));
			oController.byId("idEntityLabel").setText(oTextReader("vhEntity"));
			oController.byId("idSelectPropertiesLabel").setText(oTextReader("vhSelectProperties"));
		},
		// Triggered when visibility is changed in facet filter view to clear/set values in FRR view 
		clearVHRFields : function(oEvent) {
			var oController = this;
			oController.clearSource();
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false, oEvent);
			oController.setDetailData();
		},
		// Adds the service, entity, properties fields for VHR after rendering
		onAfterRendering : function() {
			var oController = this;
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(true);
		},
		// Triggered when use same as VHR is selected in facet filter view and when changes are made in VHR source, entity set or select properties to update FRR View with same values as VHR
		fireRelevantEvents : function() {
			var oController = this;
			if (oController.oParentObject.getUseSameRequestForValueHelpAndFilterResolution()) {
				oController.getView().fireEvent("useSameAsVHREvent");
			}
		},
		// Adds/removes required tag to entity set and select properties fields and accepts a boolean to determine required
		addOrRemoveMandatoryFieldsAndRequiredFlag : function(bRequired, oEvent) {
			var oController = this;
			if (bRequired === false && oEvent === undefined) {
				return;
			}
			oController.byId("idSourceLabel").setRequired(bRequired);
			oController.byId("idEntityLabel").setRequired(bRequired);
			oController.byId("idSelectPropertiesLabel").setRequired(bRequired);
			if (bRequired) {
				oController.viewValidator.addFields([ "idSource", "idEntity", "idSelectProperties" ]);
			} else {
				oController.viewValidator.removeFields([ "idSource", "idEntity", "idSelectProperties" ]);
			}
		},
		// returns value help service
		getSource : function() {
			var oController = this;
			return oController.oParentObject.getServiceOfValueHelp();
		},
		// returns all entity sets in a service
		getAllEntities : function(sSource) {
			var oController = this;
			return oController.oConfigurationEditor.getAllEntitySetsOfService(sSource);
		},
		// returns value help entity set
		getEntity : function() {
			var oController = this;
			return oController.oParentObject.getEntitySetOfValueHelp();
		},
		// returns all properties in a particular entity set of a service
		getAllEntitySetProperties : function(sSource, sEntitySet) {
			var oController = this;
			return oController.oConfigurationEditor.getAllPropertiesOfEntitySet(sSource, sEntitySet);
		},
		// clearSource clears value help service. It calls clears entity to clear value help entity as well. Clear entity calls clear select properties on VHR
		clearSource : function() {
			var oController = this;
			oController.oParentObject.setServiceOfValueHelp(undefined);
			oController.clearEntity();
		},
		clearEntity : function() {
			var oController = this;
			oController.oParentObject.setEntitySetOfValueHelp(undefined);
			oController.clearSelectProperties();
		},
		clearSelectProperties : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getSelectPropertiesOfValueHelp();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeSelectPropertyOfValueHelp(property);
			});
		},
		// updates value help service
		updateSource : function(sSource) {
			var oController = this;
			oController.oParentObject.setServiceOfValueHelp(sSource);
		},
		// updates value help entity set
		updateEntity : function(sEntity) {
			var oController = this;
			oController.oParentObject.setEntitySetOfValueHelp(sEntity);
		},
		// updates value help select properties
		updateSelectProperties : function(aSelectProperties) {
			var oController = this;
			oController.clearSelectProperties();
			aSelectProperties.forEach(function(property) {
				oController.oParentObject.addSelectPropertyOfValueHelp(property);
			});
		},
		// returns value help select properties
		getSelectProperties : function() {
			var oController = this;
			return oController.oParentObject.getSelectPropertiesOfValueHelp();
		},
		// returns the current validation state of sub view
		getValidationState : function() {
			var oController = this;
			return oController.viewValidator.getValidationState();
		}
	});
});
