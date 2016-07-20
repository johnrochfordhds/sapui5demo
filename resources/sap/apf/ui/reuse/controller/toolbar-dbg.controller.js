/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
*@class toolbar
*@name toolbar
*@memberOf sap.apf.ui.reuse.controller
*@description controller for view.toolbar
*/
/* globals window, setTimeout, input */
sap.ui.controller("sap.apf.ui.reuse.controller.toolbar", {
	/**
	*@this {sap.apf.ui.reuse.controller.toolbar}
	*/
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method resetAnalysisPath
	*@description Refresh carousel on new Analysis path 
	 */
	resetAnalysisPath : function() {
		this.oUiApi.getAnalysisPath().getCarousel().getController().removeAllSteps();
		this.oCoreApi.resetPath();
		this.oUiApi.getAnalysisPath().getController().isNewPath = true;
		this.oStartFilterHandler.resetAll(); //Reset method available on startFilterHandler
		this.oUiApi.contextChanged(true);
		this.oUiApi.getAnalysisPath().getController().refreshAnalysisPath();
		this.oCoreApi.setDirtyState(false);
		this.oCoreApi.setPathName('');
		this.oUiApi.getAnalysisPath().getController().setPathTitle();
		this.oUiApi.getAnalysisPath().getCarousel().rerender();
	},
	onInit : function() {
		this.view = this.getView();
		if (sap.ui.Device.system.desktop) {
			this.view.addStyleClass("sapUiSizeCompact");
		}
		this.oViewData = this.getView().getViewData();
		this.oCoreApi = this.oViewData.oCoreApi;
		this.oSerializationMediator = this.oViewData.oSerializationMediator;
		this.oUiApi = this.oViewData.uiApi;
		this.oStartFilterHandler = this.oViewData.oStartFilterHandler;
		this.oPrintHelper = new sap.apf.ui.utils.PrintHelper(this.oViewData);
		this.bIsPathGalleryWithDelete = false;
		this.oPathGalleryDialog = {};
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method addCompactStyleClassForDialog
	*@param Dialog Instance on which style class has to be applied
	*@description Sets compact mode for dialogs when application is running in desktop
	*/
	addCompactStyleClassForDialog : function(oDialog) {
		if (sap.ui.Device.system.desktop) {
			oDialog.addStyleClass("sapUiSizeCompact");
		}
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method onSaveAndSaveAsPress
	*@param {boolean} Boolean to determine whether Save or Save As button is pressed from the toolbar
	*@description Opens the save dialog when Save or SaveAs button is pressed from the toolbar
	*/
	onSaveAndSaveAsPress : function(bSaveAs) {
		var self = this;
		if (self.oCoreApi.getSteps().length !== 0) {
			self.oUiApi.getLayoutView().setBusy(true);
			self.oCoreApi.readPaths(function(respObj, metaData, msgObj) {
				var paths = respObj.paths;
				if (metaData !== undefined) {
					self.getView().maxNumberOfSteps = metaData.getEntityTypeMetadata().maximumNumberOfSteps;
					self.getView().maxNumberOfPaths = metaData.getEntityTypeMetadata().maxOccurs;
				}
				if (msgObj === undefined && (typeof respObj === "object")) {
					self.getSaveDialog(bSaveAs, function() {
					}, paths);
				} else {
					var oMessageObject = self.oCoreApi.createMessageObject({
						code : "6005",
						aParameters : []
					});
					oMessageObject.setPrevious(msgObj);
					self.oCoreApi.putMessage(oMessageObject);
				}
				self.oUiApi.getLayoutView().setBusy(false);
			});
		} else {
			self.getDialogForNoPathAdded();
		}
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method open dialog for showing saved paths
	*@param {Boolean} Boolean to determine whether path gallery with delete mode has to be opened or not. if bIsPathGalleryWithDelete === true then open pathgallery with delete mode
	*@description Opens an overlay which holds saved analysis Paths
	*@see sap.apf.ui.view.pathGallery
	*/
	openPathGallery : function(bIsPathGalleryWithDelete) {
		var jsonData = {};
		var self = this;
		var i, oMessageObject;
		self.oCoreApi.readPaths(function(data, metaData, msgObj) {
			if (msgObj === undefined && (typeof data === "object")) {
				var galleryData = data.paths;
				for(i = 0; i < galleryData.length; i++) {
					var noOfSteps = galleryData[i].StructuredAnalysisPath.steps.length;
					var utcDate = galleryData[i].LastChangeUTCDateTime;
					var numberPattern = /\d+/g;
					var timeStamp = parseInt(utcDate.match(numberPattern)[0], 10);
					var date = ((new Date(timeStamp)).toString()).split(' ');
					var dateToShow = date[1] + "-" + date[2] + "-" + date[3];
					galleryData[i].title = galleryData[i].AnalysisPathName;
					galleryData[i].guid = galleryData[i].AnalysisPath;
					galleryData[i].StructuredAnalysisPath.noOfSteps = noOfSteps;
					galleryData[i].description = dateToShow + "  -   (" + self.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
					galleryData[i].summary = galleryData[i].AnalysisPathName + "- (" + dateToShow + ") - (" + self.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
				}
				jsonData = {
					GalleryElements : galleryData
				};
				if (bIsPathGalleryWithDelete) {
					self.openSavedPathGallery(jsonData, self, "deleteAnalysisPath");
				} else {
					self.openSavedPathGallery(jsonData, self, "pathGallery");
				}
				self.oUiApi.getLayoutView().setBusy(false);
			} else {
				oMessageObject = self.oCoreApi.createMessageObject({
					code : "6005",
					aParameters : []
				});
				oMessageObject.setPrevious(msgObj);
				self.oCoreApi.putMessage(oMessageObject);
				self.oUiApi.getLayoutView().setBusy(false);
			}
		});
	},
	openSavedPathGallery : function(jsonData, context, viewName) {
		if (!context.oPathGalleryDialog[viewName]) {
			context.oPathGalleryDialog[viewName] = new sap.ui.view({
				type : sap.ui.core.mvc.ViewType.JS,
				viewName : "sap.apf.ui.reuse.view." + viewName,
				viewData : {
					oInject : context.oViewData
				}
			});
		}
		context.oPathGalleryDialog[viewName].getViewData().jsonData = jsonData;
		var pathGalleryDialog = context.oPathGalleryDialog[viewName].getController().oDialog;
		if ((!pathGalleryDialog) || (pathGalleryDialog && !pathGalleryDialog.isOpen())) {
			context.oPathGalleryDialog[viewName].getController().openPathGallery();
		}
	},
	doPrint : function() {
		var oPrint = this.oPrintHelper;
		oPrint.doPrint();
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method getSaveDialog
	*@description Getter for save dialog. Opens a new dialog for saving analysis Path
	*@param {object} reset callback for save 
	 */
	getSaveDialog : function(bSaveAs, reset, aPath) {
		var self = this;
		var hintText = this.oCoreApi.getTextNotHtmlEncoded("saveName");
		var savedAPNameExist = this.oUiApi.getAnalysisPath().oSavedPathName.getTitle();
		var oModelPath = new sap.ui.model.json.JSONModel();
		oModelPath.setData(aPath);
		if (savedAPNameExist) {
			if (this.oCoreApi.isDirty()) {
				savedAPNameExist = savedAPNameExist.split('*')[1];
			}
		}
		this.oInput = new sap.m.Input({
			type : sap.m.InputType.Text,
			placeholder : hintText,
			showSuggestion : true,
			suggestionItems : {
				path : "/",
				template : new sap.ui.core.Item({
					text : "{AnalysisPathName}",
					additionalText : "{AnalysisPath}"
				}),
				showValueHelp : true,
				valueHelpRequest : function(evt) {
					var handleClose = function(evt) {
						var oSelectedItem = evt.getParameter("selectedItem");
						if (oSelectedItem) {
							input.setValue(oSelectedItem.getTitle());
						}
						evt.getSource().getBinding("items").filter([]);
					};
				}
			}
		}).addStyleClass("saveStyle");
		this.oInput.setModel(oModelPath);
		//destroy the input assisted items
		if (!bSaveAs) {
			this.oInput.destroySuggestionItems();
		}
		this.oInput.attachEvent("click", function(oEvent) {
			jQuery(oEvent.currentTarget).attr('value', '');
		});
		//Save input field validation
		this.oInput.attachLiveChange(function(data) {
			var val = this.getValue();
			var dialog = self.saveDialog;
			var regEx = new RegExp("[*]", "g");
			if (val === "") {
				dialog.getBeginButton().setEnabled(false);
			}
			if ((val.match(regEx) !== null)) {
				dialog.getBeginButton().setEnabled(false);
				dialog.setSubHeader(new sap.m.Bar({
					contentMiddle : new sap.m.Text({
						text : this.oCoreApi.getTextNotHtmlEncoded('invalid-entry')
					})
				}));
				this.setValueState(sap.ui.core.ValueState.Error);
				return false;
			} else {
				dialog.getBeginButton().setEnabled(true);
				dialog.destroySubHeader();
				this.setValueState(sap.ui.core.ValueState.None);
			}
			if (val.trim() !== "") {
				dialog.getBeginButton().setEnabled(true);
				dialog.destroySubHeader();
			} else {
				dialog.getBeginButton().setEnabled(false);
				dialog.setSubHeader(new sap.m.Bar({
					contentMiddle : new sap.m.Text({
						text : self.oCoreApi.getTextNotHtmlEncoded('enter-valid-path-name')
					})
				}));
			}
		});
		//setting existing path name in input field
		if (savedAPNameExist !== (self.oCoreApi.getTextNotHtmlEncoded("unsaved"))) {
			this.oInput.setValue(savedAPNameExist);
		}
		this.analysisPathName = (self.oInput.getValue()).trim();
		//TODO Condition below to be changed to check for fragment newMessageDialog similar to open path gallery or delete path dialogs
		if (self.saveDialog === undefined || self.saveDialog && self.saveDialog.bIsDestroyed) {
			self.saveDialog = new sap.m.Dialog({
				type : sap.m.DialogType.Standard,
				title : self.oCoreApi.getTextNotHtmlEncoded("save-analysis-path"),
				beginButton : new sap.m.Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("ok"),
					enabled : false,
					press : function() {
						self.saveDialog.getBeginButton().setEnabled(false);
						self.saveDialog.getEndButton().setEnabled(false);
						var analysisPathName = (self.oInput.getValue()).trim();
						self.saveAnalysisPath(analysisPathName, reset, bSaveAs);
						self.saveDialog.close();
					}
				}),
				endButton : new sap.m.Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("cancel"),
					press : function() {
						self.saveDialog.close();
					}
				}),
				afterClose : function() {
					self.oUiApi.getLayoutView().setBusy(false);
					self.saveDialog.destroy();
				}
			});
			self.saveDialog.addContent(this.oInput);
			this.addCompactStyleClassForDialog(self.saveDialog);
			// conditional opening of save dialog(save/saveAs)
			if (this.oInput.getValue() === savedAPNameExist) {
				self.saveDialog.getBeginButton().setEnabled(true);
			}
		}
		//open only if steps are present in the path
		if (self.oCoreApi.getSteps().length >= 1) {
			if (!bSaveAs && savedAPNameExist === (self.oCoreApi.getTextNotHtmlEncoded("unsaved"))) {
				if (!self.saveDialog || (self.saveDialog && !self.saveDialog.isOpen()))
					self.saveDialog.open();
			} else if (bSaveAs) {
				if (!self.saveDialog || (self.saveDialog && !self.saveDialog.isOpen()))
					self.saveDialog.open();
			} else {
				self.saveAnalysisPath(savedAPNameExist, reset, bSaveAs);
			}
		}
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method doOkOnNewAnalysisPath
	*@description Executes operations on click of "Ok" button of New Analysis Path dialog
	*/
	doOkOnNewAnalysisPath : function() {
		var self = this;
		this.isOpen = false;
		self.oCoreApi.readPaths(function(respObj, metaData, msgObj) {
			var bSaveAs = true;
			var paths = respObj.paths;
			if (metaData !== undefined) {
				self.getView().maxNumberOfSteps = metaData.getEntityTypeMetadata().maximumNumberOfSteps;
				self.getView().maxNumberOfPaths = metaData.getEntityTypeMetadata().maxOccurs;
			}
			if (msgObj === undefined && (typeof respObj === "object")) {
				self.getSaveDialog(bSaveAs, function() {
					self.resetAnalysisPath();
					//					sap.apf.ui.createApplicationLayout();
				}, paths);
			} else {
				var oMessageObject = self.oCoreApi.createMessageObject({
					code : "6005",
					aParameters : []
				});
				oMessageObject.setPrevious(msgObj);
				self.oCoreApi.putMessage(oMessageObject);
			}
		});
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method doOkOnOpenAnalysisPath
	*@description Executes operations on click of "Ok" btton of Open Analysis Path dialog
	*/
	doOkOnOpenAnalysisPath : function(bIsPathGalleryWithDelete) {
		var self = this;
		this.isOpen = true;
		this.bIsPathGalleryWithDelete = bIsPathGalleryWithDelete;
		self.oCoreApi.readPaths(function(respObj, metaData, msgObj) {
			var bSaveAs = true;
			var paths = respObj.paths;
			if (metaData !== undefined) {
				self.getView().maxNumberOfSteps = metaData.getEntityTypeMetadata().maximumNumberOfSteps;
				self.getView().maxNumberOfPaths = metaData.getEntityTypeMetadata().maxOccurs;
			}
			if (msgObj === undefined && (typeof respObj === "object")) {
				self.getSaveDialog(bSaveAs, function() {
					return;
				}, paths);
			} else {
				var oMessageObject = self.oCoreApi.createMessageObject({
					code : "6005",
					aParameters : []
				});
				oMessageObject.setPrevious(msgObj);
				self.oCoreApi.putMessage(oMessageObject);
			}
		});
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method getNewAnalysisPathDialog
	*@description Getter for New Analysis Path dialog 
	 */
	getNewAnalysisPathDialog : function() {
		var self = this;
		if (this.oCoreApi.isDirty() && self.oCoreApi.getSteps().length !== 0) {
			self.newDialog = new sap.m.Dialog({
				type : sap.m.DialogType.Standard,
				title : self.oCoreApi.getTextNotHtmlEncoded("newPath"),
				content : new sap.m.Text({
					text : self.oCoreApi.getTextNotHtmlEncoded("analysis-path-not-saved")
				}).addStyleClass("textStyle"),
				beginButton : new sap.m.Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("yes"),
					press : function() {
						self.doOkOnNewAnalysisPath();
						self.newDialog.close();
					}
				}),
				endButton : new sap.m.Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("no"),
					press : function() {
						self.resetAnalysisPath();
						self.newDialog.close();
					}
				}),
				afterClose : function() {
					self.oUiApi.getLayoutView().setBusy(false);
					self.newDialog.destroy();
				}
			});
			this.addCompactStyleClassForDialog(self.newDialog);
			self.newDialog.open();
		} else {
			this.resetAnalysisPath();
		}
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method getOpenDialog
	*@description Getter for New Analysis Path dialog
	*/
	getOpenDialog : function(bIsPathGalleryWithDelete) {
		var self = this;
		self.newOpenDilog = new sap.m.Dialog({
			type : sap.m.DialogType.Standard,
			title : self.oCoreApi.getTextNotHtmlEncoded("newPath"),
			content : new sap.m.Text({
				text : self.oCoreApi.getTextNotHtmlEncoded("analysis-path-not-saved")
			}).addStyleClass("textStyle"),
			beginButton : new sap.m.Button({
				text : self.oCoreApi.getTextNotHtmlEncoded("yes"),
				press : function() {
					self.doOkOnOpenAnalysisPath(self.bIsPathGalleryWithDelete);
					self.newOpenDilog.close();
				}
			}),
			endButton : new sap.m.Button({
				text : self.oCoreApi.getTextNotHtmlEncoded("no"),
				press : function() {
					self.resetAnalysisPath();
					self.openPathGallery(self.bIsPathGalleryWithDelete);
					self.newOpenDilog.close();
				}
			}),
			afterClose : function() {
				self.oUiApi.getLayoutView().setBusy(false);
				self.newOpenDilog.destroy();
			}
		});
		this.addCompactStyleClassForDialog(self.newOpenDilog);
		self.newOpenDilog.open();
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method getConfirmDelDialog
	*@description confirm dialog before deleting path
	*@param {object} sectionDom Returns to DOM object on which the delete is called 
	 */
	getConfirmDelDialog : function(oListInfo) {
		var self = this;
		var pathName = oListInfo.sPathName;
		self.delConfirmDialog = new sap.m.Dialog({
			type : sap.m.DialogType.Standard,
			title : self.oCoreApi.getTextNotHtmlEncoded("delPath"),
			content : new sap.m.Text({
				text : self.oCoreApi.getTextNotHtmlEncoded("do-you-want-to-delete-analysis-path", [ "'" + pathName + "'" ])
			}).addStyleClass("textStyle"),
			beginButton : new sap.m.Button({
				text : self.oCoreApi.getTextNotHtmlEncoded("yes"),
				press : function() {
					self.oUiApi.getAnalysisPath().getPathGalleryWithDeleteMode().getController().deleteSavedPath(pathName, oListInfo);
					self.delConfirmDialog.close();
				}
			}),
			endButton : new sap.m.Button({
				text : self.oCoreApi.getTextNotHtmlEncoded("no"),
				press : function() {
					self.delConfirmDialog.close();
				}
			}),
			afterClose : function() {
				self.oUiApi.getLayoutView().setBusy(false);
				self.delConfirmDialog.destroy();
			}
		});
		this.addCompactStyleClassForDialog(self.delConfirmDialog);
		self.delConfirmDialog.open();
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method getConfirmDelDialog
	*@description confirm dialog before overwriting path
	*/
	getConfirmDialog : function(oParam) {
		var self = this;
		var opt = oParam || {};
		var options = {
			success : opt.success || function() {
				return;
			},
			fail : opt.fail || function() {
				return;
			},
			msg : opt.msg || ""
		};
		self.confirmDialog = new sap.m.Dialog({
			title : self.oCoreApi.getTextNotHtmlEncoded("caution"),
			type : sap.m.DialogType.Standard,
			content : new sap.m.Text({
				text : options.msg
			}).addStyleClass("textStyle"),
			beginButton : new sap.m.Button({
				text : self.oCoreApi.getTextNotHtmlEncoded("yes"),
				press : function() {
					//fnCallback = options.success();
					self.overWriteAnalysisPath();
					self.confirmDialog.close();
				}
			}),
			endButton : new sap.m.Button({
				text : self.oCoreApi.getTextNotHtmlEncoded("no"),
				press : function() {
					var bSaveAs = true;
					var aData = self.oInput.getModel().getData();
					//fnCallback = options.success()
					self.getSaveDialog(bSaveAs, function() {
						return;
					}, aData);
					self.confirmDialog.close();
				}
			}),
			afterClose : function() {
				self.oUiApi.getLayoutView().setBusy(false);
				self.confirmDialog.destroy();
			}
		});
		this.addCompactStyleClassForDialog(self.confirmDialog);
		self.confirmDialog.open();
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method getErrorMessageDialog
	*@description Getter for save dialog. Opens a new dialog for saving analysis Path
	*@param {string} errorText Text to be shown in case of an error
	*/
	getErrorMessageDialog : function(msg) {
		var self = this;
		self.errorMsgDialog = new sap.m.Dialog({
			title : self.oCoreApi.getTextNotHtmlEncoded("error"),
			type : sap.m.DialogType.Message,
			content : new sap.m.Text({
				text : msg
			}).addStyleClass("textStyle"),
			beginButton : new sap.m.Button({
				text : self.oCoreApi.getTextNotHtmlEncoded("ok"),
				press : function() {
					var fncallback = function() {
						return;
					};
					if (fncallback) {
						setTimeout(function() {
							self.callbackforSave(fncallback);
						}, 200);
					}
					self.errorMsgDialog.close();
				}
			}),
			afterClose : function() {
				self.oUiApi.getLayoutView().setBusy(false);
				self.errorMsgDialog.destroy();
			}
		});
		this.addCompactStyleClassForDialog(self.errorMsgDialog);
		self.errorMsgDialog.open();
	},
	callbackforSave : function(fncallback) {
		fncallback();
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.toolbar
	*@method onOpenAnalysisPath
	*@param {boolean} Boolean to determine whether path gallery with delete mode has to be opened or not
	*@description On click event of open button in Menu Popover
	*/
	onOpenPathGallery : function(bIsPathGalleryWithDelete) {
		if (this.oCoreApi.isDirty() && this.oCoreApi.getSteps().length !== 0) {
			this.getOpenDialog(bIsPathGalleryWithDelete);
		} else {
			this.openPathGallery(bIsPathGalleryWithDelete);
		}
		this.isOpen = false;
	},
	saveAnalysisPath : function(analysisPathName, fncallback, bSaveAs) {
		var self = this;
		this.saveCallback = fncallback;
		this.analysisPathName = analysisPathName; //Encodes the special characters
		this.aData = self.oInput.getModel().getData();
		var boolUpdatePath = false;
		this.guid = "";
		var steps = self.oCoreApi.getSteps();
		//Check if path or steps exceeds the limit
		if (this.aData.length > this.getView().maxNumberOfPaths) {
			this.getErrorMessageDialog(self.oCoreApi.getTextNotHtmlEncoded("no-of-paths-exceeded"));
			return false;
		} else if (steps.length > this.getView().maxNumberOfSteps) {
			this.getErrorMessageDialog(self.oCoreApi.getTextNotHtmlEncoded("no-of-steps-exceeded"));
			return false;
		}
		var i;
		for(i = 0; i < this.aData.length; i++) {
			var decodePathName = this.aData[i].AnalysisPathName;
			if (this.analysisPathName === decodePathName) {
				boolUpdatePath = true;
				this.guid = this.aData[i].AnalysisPath;
				break;
			}
		}
		if (!boolUpdatePath) {
			self.oSerializationMediator.savePath(self.analysisPathName, function(respObj, metaData, msgObj) {
				if (msgObj === undefined && (typeof respObj === "object")) {
					self.oCoreApi.setDirtyState(false);
					self.oUiApi.getAnalysisPath().getController().setPathTitle();
					var message = self.oCoreApi.getTextNotHtmlEncoded("path-saved-successfully", [ "'" + self.analysisPathName + "'" ]);
					self.getSuccessToast(self.analysisPathName, message);
					if (typeof self.saveCallback === "function") {
						self.saveCallback();
					}
				} else {
					var oMessageObject = self.oCoreApi.createMessageObject({
						code : "6006",
						aParameters : [ self.analysisPathName ]
					});
					oMessageObject.setPrevious(msgObj);
					self.oCoreApi.putMessage(oMessageObject);
				}
			});
		} else {
			var pathName;
			if (this.oCoreApi.isDirty() && this.oCoreApi.getSteps().length !== 0) {
				pathName = self.oUiApi.getAnalysisPath().oSavedPathName.getTitle().slice(1, self.oUiApi.getAnalysisPath().oSavedPathName.getTitle().length);
			} else {
				pathName = self.oUiApi.getAnalysisPath().oSavedPathName.getTitle();
			}
			if (!bSaveAs && pathName === self.analysisPathName) {
				self.overWriteAnalysisPath();
			} else {
				this.getConfirmDialog({
					msg : self.oCoreApi.getTextNotHtmlEncoded("path-exists", [ "'" + self.analysisPathName + "'" ])
				});
			}
			boolUpdatePath = false;
		}
	},
	getSuccessToast : function(pathName, message) {
		var self = this;
		var msg = message;
		sap.m.MessageToast.show(msg, {
			width : "20em"
		});
		if (self.isOpen && self.bIsPathGalleryWithDelete) {
			self.openPathGallery(self.bIsPathGalleryWithDelete);
		} else if (self.isOpen) {
			self.openPathGallery();
		}
	},
	overWriteAnalysisPath : function() {
		var self = this;
		var pathNameVal = this.analysisPathName;
		var guidVal = this.guid;
		self.oSerializationMediator.savePath(guidVal, pathNameVal, function(oResponse, metaData, msgObj) {
			if (msgObj === undefined && (typeof oResponse === "object")) {
				self.oCoreApi.setDirtyState(false);
				self.oUiApi.getAnalysisPath().getController().setPathTitle();
				var message = self.oCoreApi.getTextNotHtmlEncoded("path-updated-successfully", [ "'" + pathNameVal + "'" ]);
				if (self.saveDialog && self.saveDialog.isOpen()) {
					self.saveDialog.close();
				}
				self.getSuccessToast(pathNameVal, message);
				if (typeof self.saveCallback === "function") {
					self.saveCallback();
				}
			} else {
				var oMessageObject = self.oCoreApi.createMessageObject({
					code : "6007",
					aParameters : [ pathNameVal ]
				});
				oMessageObject.setPrevious(msgObj);
				self.oCoreApi.putMessage(oMessageObject);
			}
		});
	},
	getDialogForNoPathAdded : function() {
		var self = this;
		var msg = self.oCoreApi.getTextNotHtmlEncoded("noStepInPath");
		self.noPathAddedDialog = new sap.m.Dialog({
			title : self.oCoreApi.getTextNotHtmlEncoded("alert"),
			type : sap.m.DialogType.Message,
			contentWidth : jQuery(window).height() * 0.2 + "px", // height and width for the dialog relative to the window
			contentHeight : jQuery(window).height() * 0.2 + "px",
			content : new sap.m.Text({
				text : msg
			}).addStyleClass("textStyle"),
			beginButton : new sap.m.Button({
				text : self.oCoreApi.getTextNotHtmlEncoded("ok"),
				press : function() {
					self.noPathAddedDialog.close();
				}
			}),
			afterClose : function() {
				self.oUiApi.getLayoutView().setBusy(false);
				self.noPathAddedDialog.destroy();
			}
		});
		this.addCompactStyleClassForDialog(self.noPathAddedDialog);
		self.noPathAddedDialog.open();
	}
});