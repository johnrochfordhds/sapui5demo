/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.viewValidator");
/**
* @class category
* @memberOf sap.apf.modeler.ui.controller
* @name category
* @description controller for view.category
*/
(function() {
	"use strict";
	var oParams, oTextReader, oConfigurationHandler, oConfigurationEditor, oTextPool, oCategory, viewValidatorForCategory;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	//Enables 'Auto Complete Feature' to the input fields in the view
	function _enableAutoComplete(oController) {
		var oInputControl = oController.byId("idCategoryTitle");
		var oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oTextPool);
		var oDependenciesForText = {
			oTranslationFormat : sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE,
			type : "text"
		};
		oTextPoolHelper.setAutoCompleteOn(oInputControl, oDependenciesForText);
	}
	// Sets static texts in UI
	function _setDisplayText(oController) {
		oController.byId("idCategoryBasicData").setTitle(oTextReader("categoryData"));
		oController.byId("idCategoryTitleLabel").setText(oTextReader("categoryTitle"));
		oController.byId("idCategoryTitle").setPlaceholder(oTextReader("newCategory"));
		oController.byId("idTotalStepsLabel").setText(oTextReader("totalSteps"));
	}
	// creates/ retrieves the category object
	function _retrieveOrCreateCategoryObject(oController) {
		var sCategoryId;
		if (oParams && oParams.arguments && oParams.arguments.categoryId) {
			oCategory = oConfigurationEditor.getCategory(oParams.arguments.categoryId);
		}
		if (!nullObjectChecker.checkIsNotUndefined(oCategory)) {
			sCategoryId = oConfigurationEditor.setCategory();
			oCategory = oConfigurationEditor.getCategory(sCategoryId);
			_updateTreeNodeOnCategory(oController);
		}
	}
	// Updates the tree child node (category) with given category title
	function _updateTreeNodeOnCategory(oController, oCategoryTitle) {
		var oCategoryInfo = {
			id : oCategory.getId(),
			icon : "sap-icon://open-folder"
		};
		if (oCategoryTitle) {
			delete oCategoryInfo.icon;
			oCategoryInfo.name = oCategoryTitle;
		}
		oController.getView().getViewData().updateSelectedNode(oCategoryInfo);
	}
	// updates the bread crumb with current category title
	function _updateBreadCrumbOnCategoryChange(oController, oCategoryTitle) {
		var sTitle = oTextReader("category") + ": " + oCategoryTitle;
		oController.getView().getViewData().updateTitleAndBreadCrumb(sTitle);
	}
	function _setCategoryTitle(oController) {
		// In case of a new Category do not set a label
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oConfigurationEditor.getCategory(oParams.arguments.categoryId))) {
			return;
		}
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oCategory.labelKey) && oTextPool.get(oCategory.labelKey)) {
			oController.byId("idCategoryTitle").setValue(oTextPool.get(oCategory.labelKey).TextElementDescription);
		} else {
			oController.byId("idCategoryTitle").setValue(oCategory.getId());
		}
	}
	function _setTotalSteps(oController) {
		var nSteps = oConfigurationEditor.getCategoryStepAssignments(oCategory.getId()).length;
		oController.byId("idTotalSteps").setValue(nSteps);
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.category", {
		/**
		* @public
		* @function
		* @name sap.apf.modeler.ui.controller.category#onInit
		* @description Called on initialization of the view.
		* Sets the static texts for all controls in UI.
		* Adds style classes to all UI controls.
		* Prepares dependencies.
		* Sets dynamic text for input controls
		* */
		onInit : function() {
			var oController = this;
			var oViewData = oController.getView().getViewData();
			oTextReader = oViewData.getText;
			oParams = oViewData.oParams;
			oConfigurationHandler = oViewData.oConfigurationHandler;
			oTextPool = oConfigurationHandler.getTextPool();
			oConfigurationEditor = oViewData.oConfigurationEditor;
			if (!oConfigurationEditor) {
				oConfigurationHandler.loadConfiguration(oParams.arguments.configId, function(configurationEditor) {
					oConfigurationEditor = configurationEditor;
				});
			}
			viewValidatorForCategory = new sap.apf.modeler.ui.utils.ViewValidator(oController.getView());
			_setDisplayText(oController);
			_enableAutoComplete(oController);
			_retrieveOrCreateCategoryObject(oController);
			oController.setDetailData();
			viewValidatorForCategory.addField("idCategoryTitle");
		},
		// Sets dynamic texts for controls
		setDetailData : function() {
			var oController = this;
			_setCategoryTitle(oController);
			_setTotalSteps(oController);
		},
		// Handler for change event on chartTypes dropdown
		handleChangeDetailValue : function(oEvent) { //event handler to check if any value is changed in the category form
			var oController = this, sCategoryTitleId, categoryObj;
			var sCategoryTitle = oController.byId("idCategoryTitle").getValue().trim();
			var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sCategoryTitle)) {
				sCategoryTitleId = oTextPool.setText(sCategoryTitle, oTranslationFormat);
				categoryObj = {
					labelKey : sCategoryTitleId
				};
				oConfigurationEditor.setCategory(categoryObj, oCategory.getId());
				_updateTreeNodeOnCategory(oController, sCategoryTitle);
				_updateBreadCrumbOnCategoryChange(oController, sCategoryTitle);
			}
			oConfigurationEditor.setIsUnsaved();
		},
		// Updates category object and config editor on reset
		updateSubViewInstancesOnReset : function(oConfigEditor) {
			oConfigurationEditor = oConfigEditor;
			oCategory = oConfigurationEditor.getCategory(oCategory.getId());
		},
		//Getter for getting the current validation state of sub view
		getValidationState : function() {
			return viewValidatorForCategory.getValidationState();
		},
		onExit : function() {
			viewValidatorForCategory = null;
		}
	});
})();
