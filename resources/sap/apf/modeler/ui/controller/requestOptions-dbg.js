/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.viewValidator");
/**
* @class requestOptions
* @name requestOptions
* @description General controller for VHR, FRR and navigation target
* 			   The ViewData for this view needs the following parameters:
*  			   getCalatogServiceUri()- api to fetch uri
*  			   oConfigurationHandler - Handler for configuration
*  			   oConfigurationEditor -  manages the facet filter object
*  			   oTextReader - Method to getText
*  			   oParentObject - Object from which the controller gets instantiated
*/
sap.ui.define([ "sap/ui/core/mvc/Controller" ], function(Controller) {
	"use strict";
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	// Adds 'Auto Complete Feature' to the input field source in the view using sap.apf.modeler.ui.utils.TextPoolHelper
	function _enableAutoComplete(oController) {
		var oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oController.getView().getViewData().oConfigurationHandler.getTextPool());
		//auto complete for source
		var oDependenciesForService = {
			oConfigurationEditor : oController.oConfigurationEditor,
			type : "service"
		};
		oTextPoolHelper.setAutoCompleteOn(oController.byId("idSource"), oDependenciesForService);
	}
	// Sets source on init or change
	function _setSource(oController) {
		var sSource = oController.getSource();
		// Default state
		oController.byId("idSource").setValue("");
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false);
			return;
		}
		// setValue
		oController.byId("idSource").setValue(sSource);
		oController.addOrRemoveMandatoryFieldsAndRequiredFlag(true);
	}
	// Sets entity set on init or change
	function _setEntity(oController) {
		var oModelForEntity, sSource, sEntitySet, aAllEntities;
		sSource = oController.byId("idSource").getValue();
		// Default State
		oController.byId("idEntity").setModel(null);
		oController.byId("idEntity").clearSelection();
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
			return;
		}
		if (!oController.oConfigurationEditor.registerService(sSource)) {
			return;
		}
		aAllEntities = oController.getAllEntities(sSource);
		// setModel
		oModelForEntity = optionsValueModelBuilder.convert(aAllEntities);
		oController.byId("idEntity").setModel(oModelForEntity);
		sEntitySet = oController.getEntity();
		// setSelectedKey as 0th entity -> in case new parent object(no entity available for new parent object)/ in case of change of source(if old entity is not present in the entities of new source)
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sEntitySet) || aAllEntities.indexOf(sEntitySet) === -1) {
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aAllEntities)) {
				sEntitySet = oController.getAllEntities(sSource)[0];
			}
		}
		oController.byId("idEntity").setSelectedKey(sEntitySet);
	}
	// Sets select properties on init or change
	function _setSelectProperties(oController) {
		var sSource, sEntitySet, aSelectProperties, aProperties, oModelForSelectProps, aCommonProps;
		sSource = oController.byId("idSource").getValue();
		// Default state
		oController.byId("idSelectProperties").setModel(null);
		oController.byId("idSelectProperties").setSelectedKeys([]);
		// if no source nothing to set
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
			return;
		}
		sEntitySet = oController.byId("idEntity").getSelectedKey();
		// if no entity nothing to set
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sEntitySet)) {
			return;
		}
		// setModel
		aProperties = oController.getAllEntitySetProperties(sSource, sEntitySet);
		oModelForSelectProps = optionsValueModelBuilder.convert(aProperties);
		oController.byId("idSelectProperties").setModel(oModelForSelectProps);
		// setSelectedKeys
		// scenario:
		// 1. common properties in case of existing filter, intersection between already available select properties on parent object and all properties on entity/source
		// 2. common properties in case of new filter, intersection between already available select properties on parent object and all properties on entity/source is empty
		// 			implies that there is nothing to set.
		aSelectProperties = oController.getSelectProperties();
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aSelectProperties)) {
			aCommonProps = _getIntersection(aSelectProperties, aProperties);
			aSelectProperties = aCommonProps;
		}
		oController.byId("idSelectProperties").setSelectedKeys(aSelectProperties);
	}
	// attaches events to the current view.
	function _attachEvents(oController) {
		oController.byId("idSource").attachEvent("selectService", oController.handleSelectionOfService.bind(oController));
	}
	// Determines and returns intersection of existing properties and total entity set
	function _getIntersection(aExistingProps, aTotalSet) {
		var resultedIntersection = [];
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aExistingProps) || !nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aTotalSet)) {
			return resultedIntersection;
		}
		// intersection logic
		aExistingProps.forEach(function(property) {
			if (aTotalSet.indexOf(property) !== -1) {
				resultedIntersection.push(property);
			}
		});
		return resultedIntersection;
	}
	return Controller.extend("sap.apf.modeler.ui.controller.requestOptions", {
		viewValidator : {},
		oConfigurationEditor : {},
		oParentObject : {},
		// Called on initialization of the sub view and set the static texts and data for all controls in sub view
		onInit : function() {
			var oController = this;
			oController.viewValidator = new sap.apf.modeler.ui.utils.ViewValidator(oController.getView());
			oController.oConfigurationEditor = oController.getView().getViewData().oConfigurationEditor;
			oController.oParentObject = oController.getView().getViewData().oParentObject;
			_enableAutoComplete(oController);
			oController.setDetailData();
			oController.setDisplayText();
			_attachEvents(oController);
		},
		// Called on initialization of the view to set data on fields of sub view
		setDetailData : function() {
			var oController = this;
			_setSource(oController);
			_setEntity(oController);
			_setSelectProperties(oController);
		},
		// Called on reset of parent object in order to update parent object instance and configuration editor instance
		updateSubViewInstancesOnReset : function(oEvent) {
			var oController = this;
			oController.oConfigurationEditor = oEvent.mParameters[0];
			oController.oParentObject = oEvent.mParameters[1];
			oController.setDetailData();
		},
		//Stub to be implemented in sub views to set display text of controls
		setDisplayText : function() {
		},
		// Updates service of sub view and later entity and select properties if needed and fires relevant events if implemented by sub view
		handleChangeForSource : function() {
			var oController = this, sEntity, aSelectProperties;
			var sSource = oController.byId("idSource").getValue().trim();
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource) && oController.oConfigurationEditor.registerService(sSource)) {
				oController.addOrRemoveMandatoryFieldsAndRequiredFlag(true);
				oController.updateSource(sSource);
			} else {
				oController.clearSource();
				oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false);
			}
			_setEntity(oController);
			sEntity = oController.byId("idEntity").getSelectedKey();
			oController.updateEntity(sEntity);
			_setSelectProperties(oController);
			aSelectProperties = oController.byId("idSelectProperties").getSelectedKeys();
			oController.updateSelectProperties(aSelectProperties);
			oController.oConfigurationEditor.setIsUnsaved();
			oController.fireRelevantEvents();
		},
		// Updates entity set of sub view and later select properties if needed and fires relevant events if implemented by sub view
		handleChangeForEntity : function() {
			var oController = this, sEntity, aSelectProperties;
			sEntity = oController.byId("idEntity").getSelectedKey();
			oController.updateEntity(sEntity);
			_setSelectProperties(oController);
			aSelectProperties = oController.byId("idSelectProperties").getSelectedKeys();
			oController.updateSelectProperties(aSelectProperties);
			oController.oConfigurationEditor.setIsUnsaved();
			oController.fireRelevantEvents();
		},
		// Updates select properties of sub view and later fires relevant events if implemented by sub view
		handleChangeForSelectProperty : function() {
			var oController = this;
			var aSelectProperties = oController.byId("idSelectProperties").getSelectedKeys();
			oController.updateSelectProperties(aSelectProperties);
			oController.oConfigurationEditor.setIsUnsaved();
			oController.fireRelevantEvents();
		},
		//Stub to be implemented in sub views in case of any events to be handled on change of source, entity set or select properties
		fireRelevantEvents : function() {
		},
		// Adds/removes required tag to entity set and select properties fields and accepts a boolean to determine required
		addOrRemoveMandatoryFieldsAndRequiredFlag : function(bRequired) {
			var oController = this;
			oController.byId("idEntityLabel").setRequired(bRequired);
			oController.byId("idSelectPropertiesLabel").setRequired(bRequired);
			if (bRequired) {
				oController.viewValidator.addFields([ "idEntity", "idSelectProperties" ]);
			} else {
				oController.viewValidator.removeFields([ "idEntity", "idSelectProperties" ]);
			}
		},
		// Handles Service selection from the Select Dialog
		handleSelectionOfService : function(oEvent) {
			var selectedService = oEvent.getParameters()[0];
			oEvent.getSource().setValue(selectedService);
			// Event is getting trigered by service control
			oEvent.getSource().fireEvent("change");
		},
		// Handles Opening of Value Help Request Dialog.
		handleShowValueHelpRequest : function(oEvent) {
			var oController = this;
			var oViewData = {
				oTextReader : oController.getView().getViewData().oTextReader,
				// passing the source of control from which the event got triggered
				parentControl : oEvent.getSource(),
				getCalatogServiceUri : oController.getView().getViewData().getCalatogServiceUri
			};
			sap.ui.view({
				id : oController.createId("idCatalogServiceView"),
				viewName : "sap.apf.modeler.ui.view.catalogService",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : oViewData
			});
		},
		// Stubs to be implemented in sub views depending on sub view logic
		getSource : function() {
		},
		getAllEntities : function(sSource) {
		},
		getAllEntitySetProperties : function(sSource, sEntitySet) {
		},
		getEntity : function() {
		},
		clearSource : function() {
		},
		clearEntity : function() {
		},
		clearSelectProperties : function() {
		},
		updateSource : function(sSource) {
		},
		updateEntity : function(sEntity) {
		},
		updateSelectProperties : function(aSelectProperties) {
		},
		getSelectProperties : function() {
		}
	});
});
