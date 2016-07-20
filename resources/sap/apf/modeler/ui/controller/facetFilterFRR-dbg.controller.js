/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
sap.ui.define([ "sap/apf/modeler/ui/controller/requestOptions" ], function(BaseController) {
	"use strict";
	return BaseController.extend("sap.apf.modeler.ui.controller.facetFilterFRR", {
		// Called on initialization of the view and sets the static texts for all controls in UI
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("vhSource"));
			oController.byId("idEntityLabel").setText(oTextReader("vhEntity"));
			oController.byId("idSelectPropertiesLabel").setText(oTextReader("vhSelectProperties"));
		},
		// Triggered when use same as VHR is selected in facet filter view. Also triggered when use VHR is selected and VHR source, entity and select property changes
		handleCopy : function() {
			var oController = this;
			oController.setDetailData();
		},
		// Triggered when visibility is changed in facet filter view to clear/set values in FRR view 
		clearFRRFields : function() {
			var oController = this;
			oController.clearSource();
			oController.setDetailData();
		},
		// Triggered when use same as VHR selection is changed in facet filter view to enable/disable controls in FRR view
		enableOrDisableView : function() {
			var bEnable = true, oController = this;
			if (oController.oParentObject.getUseSameRequestForValueHelpAndFilterResolution() === true) {
				bEnable = false;
			}
			oController.byId("idSource").setEnabled(bEnable);
			oController.byId("idEntity").setEnabled(bEnable);
			oController.byId("idSelectProperties").setEnabled(bEnable);
		},
		// returns filter resolution service
		getSource : function() {
			var oController = this;
			return oController.oParentObject.getServiceOfFilterResolution();
		},
		// returns all entity sets in a service
		getAllEntities : function(sSource) {
			var oController = this;
			return oController.oConfigurationEditor.getAllEntitySetsOfService(sSource);
		},
		// returns filter resolution entity set
		getEntity : function() {
			var oController = this;
			return oController.oParentObject.getEntitySetOfFilterResolution();
		},
		// returns all properties in a particular entity set of a service
		getAllEntitySetProperties : function(sSource, sEntitySet) {
			var oController = this;
			return oController.oConfigurationEditor.getAllPropertiesOfEntitySet(sSource, sEntitySet);
		},
		// clearSource clears filter resolution service. It calls clears entity to clear filter resolution entity as well. Clear entity calls clear select properties on FRR
		clearSource : function() {
			var oController = this;
			oController.oParentObject.setServiceOfFilterResolution(undefined);
			oController.clearEntity();
		},
		clearEntity : function() {
			var oController = this;
			oController.oParentObject.setEntitySetOfFilterResolution(undefined);
			oController.clearSelectProperties();
		},
		clearSelectProperties : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getSelectPropertiesOfFilterResolution();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeSelectPropertyOfFilterResolution(property);
			});
		},
		// updates filter resolution service
		updateSource : function(sSource) {
			var oController = this;
			oController.oParentObject.setServiceOfFilterResolution(sSource);
		},
		// updates filter resolution entity set
		updateEntity : function(sEntity) {
			var oController = this;
			oController.oParentObject.setEntitySetOfFilterResolution(sEntity);
		},
		// updates filter resolution select properties
		updateSelectProperties : function(aSelectProperties) {
			var oController = this;
			oController.clearSelectProperties();
			aSelectProperties.forEach(function(property) {
				oController.oParentObject.addSelectPropertyOfFilterResolution(property);
			});
		},
		// returns filter resolution select properties
		getSelectProperties : function() {
			var oController = this;
			return oController.oParentObject.getSelectPropertiesOfFilterResolution();
		},
		// returns the current validation state of sub view
		getValidationState : function() {
			var oController = this;
			return oController.viewValidator.getValidationState();
		}
	});
});
