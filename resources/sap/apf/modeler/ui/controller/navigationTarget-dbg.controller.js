jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.viewValidator");
jQuery.sap.require("sap.apf.modeler.ui.utils.staticValuesBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
/**
* @class navigationTarget
* @name navigationTarget
* @description navigation target controller of modeler
* 			   The ViewData for this view needs the following parameters:
*  			   getCalatogServiceUri()- api to fetch uri
*  			   updateSelectedNode - Updates the tree node with ID of new face filter
*  			   updateTitleAndBreadCrumb - Updates the title of facet filter in breadcrumb
*  			   oParams - Object contains URL Context
*  			   oConfigurationHandler - Handler for configuration
*  			   oConfigurationEditor -  manages the facet filter object
*  			   getAllAvailableSemanticObjects - getter method to get the semantic objects 
*  			   getSemanticActions - getter method to get the list of actions for the given semantic object
* 			   setNavigationTargetName - To set the updated description of the navigation target to the table
*  			   createMessageObject - Method to create the message object
*/
(function() {
	"use strict";
	var oParams, oTextReader, oTextPool, oConfigurationHandler, oConfigurationEditor, oNavTarget, viewValidatorForNavigationTarget, oNavTargetViewData;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	function _setDisplayText(oController) {
		oController.byId("idNavigationTargetHeaderLabel").setTitle(oTextReader("basicData"));
		oController.byId("idSemanticObjectLabel").setText(oTextReader("semanticObject"));
		oController.byId("idActionLabel").setText(oTextReader("action"));
		oController.byId("idDescriptionLabel").setText(oTextReader("navigationTargetTitle"));
		oController.byId("idNavigationTargetTypeHeaderLabel").setTitle(oTextReader("navigationTargetType"));
		oController.byId("idNavigationTargetTypeLabel").setText(oTextReader("assignmentType"));
		oController.byId("idAssignedStepsLabel").setText(oTextReader("assignedSteps"));
		oController.byId("idContextMapping").setTitle(oTextReader("contextMapping"));
	}
	function _retrieveOrCreateNavTargetObject(oController) {
		var navigationTargetId;
		if (oParams && oParams.arguments && oParams.arguments.navTargetId) {
			oNavTarget = oConfigurationEditor.getNavigationTarget(oParams.arguments.navTargetId);
		}
		if (!nullObjectChecker.checkIsNotUndefined(oNavTarget)) {
			navigationTargetId = oConfigurationEditor.createNavigationTarget();
			oNavTarget = oConfigurationEditor.getNavigationTarget(navigationTargetId);
			_updateTreeNode(oController);
		}
	}
	function _instantiateSubView(oController) {
		var requestOptionsContextMappingController, oContextMappingView;
		var oViewData = {
			oTextReader : oTextReader,
			oConfigurationHandler : oConfigurationHandler,
			oConfigurationEditor : oConfigurationEditor,
			oParentObject : oNavTarget,
			getCalatogServiceUri: oController.getView().getViewData().getCalatogServiceUri
		};
		requestOptionsContextMappingController = new sap.ui.controller("sap.apf.modeler.ui.controller.navTargetContextMapping");
		oContextMappingView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oController.createId("idContextMappingView"),
			viewData : oViewData,
			controller : requestOptionsContextMappingController
		});
		//To be fired to update subView of context mapping and config editor instances after reset
		oController.getView().attachEvent("updateSubViewInstancesOnResetEvent", oContextMappingView.getController().updateSubViewInstancesOnReset.bind(oContextMappingView.getController()));
		oContextMappingView.addStyleClass("requestFFForm");
		oController.byId("idContextMappingVBox").insertItem(oContextMappingView);
	}
	function _setSemanticObject(oController) {
		var oPromise = jQuery.Deferred();
		oNavTargetViewData.getAllAvailableSemanticObjects(function(semanticObjects, messageObject) {
			if (messageObject === undefined) {
				var oModel = optionsValueModelBuilder.prepareModel(semanticObjects, semanticObjects.length);
				oController.byId("idSemanticObjectField").setModel(oModel);
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oNavTarget.getSemanticObject())) {
					oController.byId("idSemanticObjectField").setValue(oNavTarget.getSemanticObject());
				}
				oPromise.resolve();
			} else {
				_createMessageObject(oController, messageObject, "11504");
			}
		});
		return oPromise.promise();
	}
	function _setAction(oController) {
		var oModel, oPromise;
		oPromise = jQuery.Deferred();
		oModel = optionsValueModelBuilder.prepareModel([], 0);
		oController.byId("idActionField").setModel(oModel);
		_setDescription(undefined, oController);
		_setActionModel(oController).then(function(aSemanticActions) {
			oPromise.resolve(aSemanticActions);
		});
		oController.byId("idActionField").setValue(oNavTarget.getAction());
		return oPromise.promise();
	}
	function _setActionModel(oController) {
		var oModel, sSemanticObject, oPromise, oPromiseToUpdateDescription;
		oPromiseToUpdateDescription = new jQuery.Deferred();
		sSemanticObject = oNavTarget.getSemanticObject();
		if (nullObjectChecker.checkIsNotUndefined(sSemanticObject)) {
			oPromise = oNavTargetViewData.getSemanticActions(sSemanticObject);//Promise based call to get the list of actions for the given semantic object
			oPromise.then(function(aSemanticActions) {//Once promise is done populate action model
				oModel = optionsValueModelBuilder.prepareModel(aSemanticActions.semanticActions, aSemanticActions.semanticActions.length);
				oController.byId("idActionField").setModel(oModel);
				oPromiseToUpdateDescription.resolve(aSemanticActions);
			}, function(messageObject) {
				_createMessageObject(oController, messageObject, "11505");
			});
		}
		return oPromiseToUpdateDescription.promise();
	}
	function _setDescription(aSemanticActions, oController) {
		var sTitle, sText, i;
		var aActions = aSemanticActions ? aSemanticActions : oController.byId("idActionField").getModel().getData().Objects;
		if (nullObjectChecker.checkIsNotNullOrBlank(oController.byId("idActionField").getValue())) {
			for(i = 0; i < aActions.length; i++) {
				if (aActions[i].id === oNavTarget.getAction()) {
					sTitle = aActions[i].text;
					break;
				}
			}
		}
		sText = sTitle ? sTitle : oNavTarget.getSemanticObject(); //If action is from list of actions, get action's description; If action is from user input use semantic object as description
		oController.byId("idDescription").setValue(sText);
	}
	function _setNavTargetType(oController) {
		var staticValuesBuilder = new sap.apf.modeler.ui.utils.staticValuesBuilder(oTextReader);
		var aNavTargetTypes = staticValuesBuilder.getNavTargetTypeData();
		var oModelForNavTargetType = optionsValueModelBuilder.convert(aNavTargetTypes, aNavTargetTypes.length);
		oController.byId("idNavigationTargetTypeField").setModel(oModelForNavTargetType);
		var navTargetType = oNavTarget.isStepSpecific() ? oTextReader("stepSpecific") : oTextReader("globalNavTargets");
		oController.byId("idNavigationTargetTypeField").setSelectedKey(navTargetType);
	}
	function _setAssignedSteps(oController) {
		var navTargetType = oNavTarget.isStepSpecific() ? oTextReader("stepSpecific") : oTextReader("globalNavTargets");
		if (navTargetType === oTextReader("stepSpecific")) {
			_setVisibilityOfAssignedStepsControls(oController, true);
			var aAssignedStepData = [];
			var aSteps = oConfigurationEditor.getSteps();//Get all steps in the configuration
			for( var i = 0; i < aSteps.length; i++) {
				var oStepDetails = {};
				oStepDetails.stepKey = aSteps[i].getId();
				oStepDetails.stepName = oTextPool.get(aSteps[i].getTitleId()).TextElementDescription;
				aAssignedStepData.push(oStepDetails);
			}
			var oModel = optionsValueModelBuilder.prepareModel(aAssignedStepData, aAssignedStepData.length);
			oController.byId("idAssignedStepsCombo").setModel(oModel);
			var aAssignedStepIds = oConfigurationEditor.getStepsAssignedToNavigationTarget(oNavTarget.getId());//Get all assigned steps to the navigation target and set them as selected
			oController.byId("idAssignedStepsCombo").setSelectedKeys(aAssignedStepIds);
		}
	}
	function _updateTreeNode(oController) {
		var oNavTargetInfo = {
			id : oNavTarget.getId(),
			icon : oNavTarget.isGlobal() ? "sap-icon://BusinessSuiteInAppSymbols/icon-where-used" : "sap-icon://pushpin-off"
		};
		if (oController.byId("idDescription").getValue()) {
			oNavTargetInfo.name = oController.byId("idDescription").getValue();
		}
		oNavTargetViewData.updateSelectedNode(oNavTargetInfo);
	}
	function _updateFormTitleAndBreadCrumb(oController) {
		var sFormTitle = oTextReader("navigationTarget") + ": " + oController.byId("idDescription").getValue();
		oNavTargetViewData.updateTitleAndBreadCrumb(sFormTitle);
	}
	function _updateNavTargetTextTable(oController) {//called on handle change of action and semantic object
		var navTargetData = {
			key : oNavTarget.getId(),
			value : oController.byId("idDescription").getValue()
		};
		oNavTargetViewData.setNavigationTargetName(navTargetData);//Set the updated description of the navigation target to the table
	}
	function _setVisibilityOfAssignedStepsControls(oController, bIsVisible) {
		oController.byId("idAssignedStepsLabel").setVisible(bIsVisible);
		oController.byId("idAssignedStepsCombo").setVisible(bIsVisible);
	}
	function _createMessageObject(oController, oMsgObj, sMsgCode) {
		var oMessageObject = oNavTargetViewData.createMessageObject({
			code : sMsgCode
		});
		oMessageObject.setPrevious(oMsgObj);
		oNavTargetViewData.putMessage(oMessageObject);
	}
	function _removeNavTargetsFromAssignedSteps() {
		var assignedSteps = oConfigurationEditor.getStepsAssignedToNavigationTarget(oNavTarget.getId());
		for( var index = 0; index < assignedSteps.length; index++) {
			var oStep = oConfigurationEditor.getStep(assignedSteps[index]);
			oStep.removeNavigationTarget(oNavTarget.getId());
		}
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.navigationTarget", {
		onInit : function() {
			var oController = this;
			oNavTargetViewData = oController.getView().getViewData();
			oConfigurationHandler = oNavTargetViewData.oConfigurationHandler;
			oConfigurationEditor = oNavTargetViewData.oConfigurationEditor;
			oTextPool = oConfigurationHandler.getTextPool();
			oTextReader = oNavTargetViewData.getText;
			oParams = oNavTargetViewData.oParams;
			if (!oConfigurationEditor) {
				oConfigurationHandler.loadConfiguration(oParams.arguments.configId, function(configurationEditor) {
					oConfigurationEditor = configurationEditor;
				});
			}
			_setDisplayText(oController);
			viewValidatorForNavigationTarget = new sap.apf.modeler.ui.utils.ViewValidator(oController.getView());
			viewValidatorForNavigationTarget.addFields([ "idSemanticObjectField", "idActionField" ]);
			_retrieveOrCreateNavTargetObject(oController);
			_instantiateSubView(oController);
			oController.setDetailData();
		},
		setDetailData : function() {
			var oController = this;
			_setSemanticObject(oController).then(function() {
				_setAction(oController).then(function(aSemanticActions) {
					_setDescription(aSemanticActions.semanticActions, oController);
				});
			});
			_setNavTargetType(oController);
			_setAssignedSteps(oController);
		},
		// Updates navigation target object and config editor on reset
		updateSubViewInstancesOnReset : function(oConfigEditor) {
			var oController = this;
			oConfigurationEditor = oConfigEditor;
			oNavTarget = oConfigurationEditor.getNavigationTarget(oNavTarget.getId());
			oController.getView().fireEvent("updateSubViewInstancesOnResetEvent", [ oConfigurationEditor, oNavTarget ]);
		},
		handleChangeSemanticObjectValue : function(oEvent) {
			var sSemanticObject, oController = this;
			sSemanticObject = oEvent.getParameter("value").trim();
			if (nullObjectChecker.checkIsNotNullOrBlank(sSemanticObject)) {
				oNavTarget.setSemanticObject(sSemanticObject);
				_setActionModel(oController).then(function(aSemanticActions) {
					if (aSemanticActions.semanticActions.length > 0) {
						oNavTarget.setAction(oController.byId("idActionField").getModel().getData().Objects[0].id);
						oController.byId("idActionField").setSelectedKey(aSemanticActions.semanticActions[0].id);
					} else {
						oController.byId("idActionField").setValue("");
					}
					_setDescription(aSemanticActions.semanticActions, oController);
					_updateTreeNode(oController);
					_updateFormTitleAndBreadCrumb(oController);
					_updateNavTargetTextTable(oController);
				});
			}
			oConfigurationEditor.setIsUnsaved();
		},
		handleChangeofAction : function(oEvent) {
			var sAction, oController = this;
			sAction = oEvent.getParameter("value");
			if (nullObjectChecker.checkIsNotNullOrBlank(sAction)) {
				oNavTarget.setAction(sAction);
			}
			_setDescription(undefined, oController);
			_updateTreeNode(oController);
			_updateFormTitleAndBreadCrumb(oController);
			_updateNavTargetTextTable(oController);
			oConfigurationEditor.setIsUnsaved();
		},
		handleChangeOfNavigationTargetType : function() {
			var oController = this;
			oConfigurationEditor.setIsUnsaved();
			var navTargetType = oController.byId("idNavigationTargetTypeField").getSelectedKey();
			if (navTargetType === oTextReader("stepSpecific")) {
				oNavTarget.setStepSpecific();
				_setAssignedSteps(oController);
			} else {
				oNavTarget.setGlobal();
				_setVisibilityOfAssignedStepsControls(oController, false);
				oController.byId("idAssignedStepsCombo").setSelectedKeys([]);//Clear the selected keys
				_removeNavTargetsFromAssignedSteps();
			}
			_updateTreeNode(oController, this.byId("idDescription").getValue());
		},
		handleChangeForAssignedSteps : function() {
			var oController = this;
			oConfigurationEditor.setIsUnsaved();
			var assignedSteps = oController.byId("idAssignedStepsCombo").getSelectedKeys();
			var previousAssignedSteps = oConfigurationEditor.getStepsAssignedToNavigationTarget(oNavTarget.getId());
			previousAssignedSteps.forEach(function(sStepId) { //Remove the navigation target from all the old steps it was assigned to and are unselected now
				if (assignedSteps.indexOf(sStepId) === -1) {
					var oStep = oConfigurationEditor.getStep(sStepId);
					oStep.removeNavigationTarget(oNavTarget.getId());
				}
			});
			assignedSteps.forEach(function(sStepId) {
				if (previousAssignedSteps.indexOf(sStepId) === -1) { //Add the navigation target to the steps it was assigned to
					var oStep = oConfigurationEditor.getStep(sStepId);
					oStep.addNavigationTarget(oNavTarget.getId());
				}
			});
		},
		getValidationState : function() {
			var oController = this;
			return viewValidatorForNavigationTarget.getValidationState() && oController.byId("idContextMappingView").getController().getValidationState();
		},
		onExit : function() {
			var oController = this;
			oController.byId("idContextMappingView").destroy();
		}
	});
}());