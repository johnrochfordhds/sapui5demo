/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.navpopover.NavigationPopoverHandler.
sap.ui.define([
	'jquery.sap.global', "sap/ui/base/ManagedObject", 'sap/ui/comp/navpopover/LinkData'
], function(jQuery, ManagedObject, LinkData) {
	"use strict";

	/**
	 * Constructor for a new navpopover/NavigationPopoverHandler.
	 * 
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class The NavigationPopoverHandler control uses a semantic object to display
	 *        {@link sap.ui.comp.navpopover.NavigationPopover NavigationPopover} for further navigation steps.
	 * @extends sap.ui.base.ManagedObject
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.navpopover.NavigationPopoverHandler
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var NavigationPopoverHandler = ManagedObject.extend("sap.ui.comp.navpopover.NavigationPopoverHandler", /** @lends sap.ui.comp.navpopover.NavigationPopoverHandler.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * The semantic object which is used to fill the navigation popover.
				 */
				semanticObject: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The semantic object controller controls events for several NavigationPopoverHandler controls. If the controller is not manually
				 * set, the NavigationPopoverHandler tries to find a SemanticObjectController in the parent hierarchy.0
				 */
				semanticObjectController: {
					type: "any",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The metadata fieldname for this NavigationPopoverHandler.
				 */
				fieldName: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The semantic objects's display name.
				 */
				semanticObjectLabel: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If set to 'false', the NavigationPopoverHandler will not replace its field name with the according semantic object name during the
				 * calculation of the semantic attributes. This enables the usage of several NavigationPopoverHandlers on the same semantic object.
				 */
				mapFieldToSemanticObject: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				}
			},
			associations: {
				/**
				 * The parent control.
				 */
				control: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			events: {

				/**
				 * Event is fired before the semantic object navigation popup opens and before navigation targets are getting retrieved. Event can be
				 * used to set the required business attributes.
				 * 
				 * @since 1.28.0
				 */
				beforePopoverOpens: {
					parameters: {
						/**
						 * The semantic object for which the navigation targets must be retrieved.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * Map containing the semantic attributes calculated based on the binding that will be used to retrieve the navigation
						 * targets.
						 */
						semanticAttributes: {
							type: "object"
						},

						/**
						 * The ID of the NavigationPopoverHandler.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function enables you to define a changed semantic attributes map. Signatures:
						 * <code>setSemanticAttributes(oSemanticAttributesMap)</code> Parameter:
						 * <ul>
						 * <li>{object} oSemanticAttributesMap - The new map containing the semantic attributes to be used.</li>
						 * </ul>
						 */
						setSemanticAttributes: {
							type: "function"
						},

						/**
						 * This callback function sets an application state key that is used over the cross-application navigation. Signatures:
						 * <code>setAppStateKey(sAppStateKey)</code> Parameter:
						 * <ul>
						 * <li>{string} sAppStateKey - The application state key.</li>
						 * </ul>
						 */
						setAppStateKey: {
							type: "function"
						},

						/**
						 * This callback function triggers the retrieval of navigation targets and results in the opening of the navigation popover.
						 * Signatures: <code>open()</code> If the beforePopoverOpens event has been registered, the 'open' function has to be called
						 * in order to open the navigation popover.
						 */
						open: {
							type: "function"
						}
					}
				},

				/**
				 * Event is fired after navigation targets for a semantic object have been retrieved. The event can be used to change the navigation
				 * targets.
				 * 
				 * @since 1.28.0
				 */
				navigationTargetsObtained: {
					parameters: {
						/**
						 * Array of available navigation targets. Each entry in this array contains a 'text' and 'href' property.
						 */
						actions: {
							type: "sap.ui.comp.navpopover.LinkData[]"
						},

						/**
						 * The main navigation, containing a 'text' and 'href' property.
						 */
						mainNavigation: {
							type: "sap.ui.comp.navpopover.LinkData"
						},

						/**
						 * The navigation object for the current application, containing a 'text' and 'href' property. This navigation option is by
						 * default not visible on the popover.
						 */
						ownNavigation: {
							type: "sap.ui.comp.navpopover.LinkData"
						},

						/**
						 * The semantic object for which the navigation targets have been retrieved.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * The ID of the NavigationPopoverHandler.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function shows the actual navigation popover. Signatures: <code>show()</code>
						 *  <code>show(oMainNavigation, aAvailableActions, oExtraContent)</code>
						 *  <code>show(sMainNavigationId, oMainNavigation, aAvailableActions, oExtraContent)</code>
						 * Parameters:
						 * <ul>
						 * <li>{string} sMainNavigationId - The visible text for the main navigation. If empty, the navigationPopover will try to get
						 * the ID from the given sourceObject.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData} oMainNavigation - The main navigation link data containing a 'text" and 'href'
						 * property.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData[]} aAvailableActions - Array containing the cross application navigation links.</li>
						 * <li>{sap.ui.core.Control} oExtraContent - Custom control that will be placed on the popover.</li>
						 * </ul>
						 * If the navigationTargetsObtained event has been registered, the 'show' function has to be called in order to open the
						 * navigation popover.
						 */
						show: {
							type: "function"
						}
					}
				},

				/**
				 * This event is fired after a navigation link on the navigation popover has been clicked. This event is only fired, if the user
				 * left-clicks the link. Right-clicking the link and selecting 'Open in New Window' etc. in the context menu does not fire the event.
				 * 
				 * @since 1.28.0
				 */
				innerNavigate: {
					parameters: {
						/**
						 * The UI text shown in the clicked link.
						 */
						text: {
							type: "string"
						},

						/**
						 * The navigation target of the clicked link.
						 */
						href: {
							type: "string"
						},

						/**
						 * The semantic object used to retrieve this target.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * Map containing the semantic attributes used to retrieve this target.
						 */
						semanticAttributes: {
							type: "object"
						},

						/**
						 * The ID of the NavigationPopoverHandler.
						 */
						originalId: {
							type: "string"
						}
					}
				}
			}
		}
	});

	NavigationPopoverHandler.prototype.init = function() {
		this._oSemanticAttributes = null;
	};

	NavigationPopoverHandler.prototype.setSemanticObjectLabel = function(sLabel) {

		this.setProperty("semanticObjectLabel", sLabel);

		if (this._oPopover) {
			this._oPopover.setTitle(sLabel);
		}
	};

	/**
	 * Eventhandler for link's press event
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	NavigationPopoverHandler.prototype._handlePressed = function(oEvent) {
		if (this._processingPressed) {
			window.console.warn("SmartLink is still processing last press event. This press event is omitted.");
			return; // avoid multiple link press events while data is still fetched
		}

		this._processingPressed = true;

		var sAppStateKey;
		this._calculateSemanticAttributes();

		var that = this;
		var fOpen = function() {
			that._createPopover();

			that._oPopover.setTitle(that.getSemanticObjectLabel());
			that._oPopover.setSemanticObjectName(that.getSemanticObject());

			if (that._oSemanticAttributes) {
				that._oPopover.setSemanticAttributes(that._oSemanticAttributes);
			}

			if (sAppStateKey) {
				that._oPopover.setAppStateKey(sAppStateKey);
			}

			that._oPopover.retrieveNavTargets();
		};

		if (this.hasListeners("beforePopoverOpens")) {
			this.fireBeforePopoverOpens({
				semanticObject: this.getSemanticObject(),
				semanticAttributes: that._oSemanticAttributes,
				setSemanticAttributes: function(oMap) {
					that._oSemanticAttributes = oMap;
				},
				setAppStateKey: function(sKey) {
					sAppStateKey = sKey;
				},
				originalId: this.getId(),
				open: fOpen
			});
		} else {
			fOpen();
		}
	};

	/**
	 * Eventhandler for NavigationPopover's targetObtained event, exposes event or - if not registered - directly opens the dialog
	 * 
	 * @private
	 */
	NavigationPopoverHandler.prototype._onTargetsObtainedOpenDialog = function() {
		var that = this;

		if (!this._oPopover.getMainNavigation()) { // main navigation could not be resolved, so only set link text as MainNavigation
			this._oPopover.setMainNavigation(new LinkData({
				text: this.getSemanticObjectLabel()
			}));
		}

		this.fireNavigationTargetsObtained({
			actions: this._oPopover.getAvailableActions(),
			mainNavigation: this._oPopover.getMainNavigation(),
			ownNavigation: this._oPopover.getOwnNavigation(),
			semanticObject: this.getSemanticObject(),
			semanticAttributes: this.getSemanticAttributes(),
			originalId: this.getId(),
			show: function(sMainNavigationId, oMainNavigation, aAvailableActions, oExtraContent) {
				if (sMainNavigationId != null && typeof sMainNavigationId === "string") {
					that._oPopover.setMainNavigationId(sMainNavigationId);
				} else {
					oExtraContent = aAvailableActions;
					aAvailableActions = oMainNavigation;
					oMainNavigation = sMainNavigationId;
				}

				if (oMainNavigation) {
					that._oPopover.setMainNavigation(oMainNavigation);
				}

				if (aAvailableActions) {
					that._oPopover.removeAllAvailableActions();
					if (aAvailableActions && aAvailableActions.length) {
						var i, length = aAvailableActions.length;
						for (i = 0; i < length; i++) {
							that._oPopover.addAvailableAction(aAvailableActions[i]);
						}
					}
				}

				if (oExtraContent) {
					that._oPopover.setExtraContent(oExtraContent);
				}

				that._oPopover.show();
				that._processingPressed = false;
			}
		});

		if (!this.hasListeners("navigationTargetsObtained")) {
			this._oPopover.show();
			this._processingPressed = false;
		}
	};

	/**
	 * Eventhandler for NavigationPopover's navigate event, exposes event
	 * 
	 * @param {object} oEvent - the event parameters
	 * @private
	 */
	NavigationPopoverHandler.prototype._onInnerNavigate = function(oEvent) {
		var aParameters = oEvent.getParameters();
		this.fireInnerNavigate({
			text: aParameters.text,
			href: aParameters.href,
			originalId: this.getId(),
			semanticObject: this.getSemanticObject(),
			semanticAttributes: this.getSemanticAttributes()
		});
	};

	/**
	 * Creates the NavigationPopover.
	 * 
	 * @private
	 */
	NavigationPopoverHandler.prototype._createPopover = function() {

		if (this._oPopover) {
			this._oPopover.destroy();
			this._oPopover = null;
		}

		if (!this._oPopover) {
			var oComponent = this._getComponent();
			jQuery.sap.require("sap.ui.comp.navpopover.NavigationPopover");
			var NavigationPopover = sap.ui.require("sap/ui/comp/navpopover/NavigationPopover");
			this._oPopover = new NavigationPopover({
				title: this.getSemanticObjectLabel(),
				semanticObjectName: this.getSemanticObject(),
				targetsObtained: jQuery.proxy(this._onTargetsObtainedOpenDialog, this),
				navigate: jQuery.proxy(this._onInnerNavigate, this),
				component: oComponent
			});

			this._oPopover.setSource(this._getControl());
		}
	};

	NavigationPopoverHandler.prototype._getControl = function() {
		var sHostingControlId = this.getControl();
		if (sHostingControlId) {
			return sap.ui.getCore().byId(sHostingControlId);
		}

		return null;
	};

	/**
	 * Finds the parental component.
	 * 
	 * @private
	 * @returns {sap.ui.core.Component} the found parental component or null
	 */
	NavigationPopoverHandler.prototype._getComponent = function() {

		var oHostingControl = this._getControl();
		if (oHostingControl) {

			var oParent = oHostingControl.getParent();
			while (oParent) {

				if (oParent instanceof sap.ui.core.Component) {
					return oParent;
				}
				oParent = oParent.getParent();
			}
		}

		return null;
	};

	/**
	 * Gets the current binding context and creates a copied map where all empty and unnecessary data is deleted from.
	 * 
	 * @private
	 */
	NavigationPopoverHandler.prototype._calculateSemanticAttributes = function() {
		var oResult = null;
		var oContext = this.getBindingContext();
		if (oContext) {
			oResult = {};
			var oSourceObject = oContext.getObject(oContext.getPath());
			var oKey, oValue;
			var that = this;
			var fMap;

			if (this.getMapFieldToSemanticObject()) { // map all available fields to their semanticObjects
				fMap = function(oKey) {
					return that._mapFieldToSemanticObject(oKey);
				};
			} else { // map all available fields to their semanticObjects excluding NavigationPopoverHandler's own SemanticObject
				var sSemanticObject = this.getSemanticObject();
				fMap = function(oKey) {
					var sFoundSemanticObject = that._mapFieldToSemanticObject(oKey);
					if (sFoundSemanticObject === sSemanticObject) {
						return oKey;
					}
					return sFoundSemanticObject;
				};
			}

			// copy the source object and ignore empty values / metadata
			for (oKey in oSourceObject) {
				if (oKey !== "__metadata") {
					oValue = oSourceObject[oKey];
					if (oValue) {
						oKey = fMap(oKey);
						oResult[oKey] = oValue;
					}
				}
			}
		}

		this._oSemanticAttributes = oResult;
	};

	/**
	 * Gets the semantic object calculated at the last Link press event
	 * 
	 * @returns {object} Map containing the copy of the available binding context.
	 * @public
	 */
	NavigationPopoverHandler.prototype.getSemanticAttributes = function() {
		if (this._oSemanticAttributes === null) {
			this._calculateSemanticAttributes();
		}
		return this._oSemanticAttributes;
	};

	/**
	 * Maps the given field to the corresponding semantic object if available
	 * 
	 * @param {string} oField - the field name which should be mapped to a semantic object;
	 * @returns {string} The corresponding semantic object, or if semantic object is not available, the original field.
	 * @private
	 */
	NavigationPopoverHandler.prototype._mapFieldToSemanticObject = function(oField) {
		var oSOController = this.getSemanticObjectController();
		if (oSOController) {
			var oMap = oSOController.getFieldSemanticObjectMap();
			if (oMap) {
				var oSemanticObject = oMap[oField];
				if (oSemanticObject) {
					return oSemanticObject;
				}
			}
		}
		return oField;
	};

	NavigationPopoverHandler.prototype.setFieldName = function(sFieldName) {
		this.setProperty("fieldName", sFieldName);

		var oSemanticController = this.getSemanticObjectController();
		if (oSemanticController) {
			oSemanticController.setIgnoredState(this);
		}
	};

	NavigationPopoverHandler.prototype.setSemanticObjectController = function(oController) {
		var oOldController = this.getProperty("semanticObjectController");
		if (oOldController) {
			oOldController.unregisterControl(this);
		}

		this.setProperty("semanticObjectController", oController, true);

		if (oController) {
			oController.registerControl(this);
		}
	};

	NavigationPopoverHandler.prototype.getSemanticObjectController = function() {
		var oController = this.getProperty("semanticObjectController");

		if (!oController) {

			var oParent = this.getParent();
			while (oParent) {
				if (oParent.getSemanticObjectController) {
					oController = oParent.getSemanticObjectController();
					if (oController) {
						this.setSemanticObjectController(oController);
						break;
					}
				}

				oParent = oParent.getParent();
			}
		}

		return oController;
	};

	/**
	 * Gets the current value assigned to the field with the NavigationPopoverHandler's semantic object name.
	 * 
	 * @returns {object} The semantic object's value.
	 * @public
	 */
	NavigationPopoverHandler.prototype.getSemanticObjectValue = function() {
		var oSemanticAttributes = this.getSemanticAttributes();
		if (oSemanticAttributes) {
			var sSemanticObjectName = this.getSemanticObject();
			return oSemanticAttributes[sSemanticObjectName];
		}

		return null;
	};

	NavigationPopoverHandler.prototype.exit = function() {
		this.setSemanticObjectController(null); // disconnect from SemanticObjectController
		if (this._oPopover) {
			this._oPopover.destroy();
			this._oPopover = null;
		}
	};

	return NavigationPopoverHandler;

}, /* bExport= */true);
