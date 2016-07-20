/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.navpopover.SmartLink.
sap.ui.define([
	'jquery.sap.global', 'sap/m/Link', 'sap/m/LinkRenderer', 'sap/ui/comp/navpopover/LinkData'
], function(jQuery, Link, LinkRenderer, LinkData) {
	"use strict";

	/**
	 * Constructor for a new navpopover/SmartLink.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class The SmartLink control uses a semantic object to display {@link sap.ui.comp.navpopover.NavigationPopover NavigationPopover} for further
	 *        navigation steps.
	 * @extends sap.m.Link
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.navpopover.SmartLink
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartLink = Link.extend("sap.ui.comp.navpopover.SmartLink", /** @lends sap.ui.comp.navpopover.SmartLink.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Name of semantic object which is used to fill the navigation popover.
				 *
				 * @since 1.28.0
				 */
				semanticObject: {
					type: "string",
					defaultValue: null
				},

				/**
				 * The semantic object controller controls events for several SmartLink controls. If the controller is not set manually, it tries to
				 * find a SemanticObjectController in its parent hierarchy.
				 *
				 * @since 1.28.0
				 */
				semanticObjectController: {
					type: "any",
					defaultValue: null
				},

				/**
				 * The metadata field name for this SmartLink control.
				 *
				 * @since 1.28.0
				 */
				fieldName: {
					type: "string",
					defaultValue: null
				},

				/**
				 * Shown label of semantic object.
				 *
				 * @since 1.28.0
				 */
				semanticObjectLabel: {
					type: "string",
					defaultValue: null
				},

				/**
				 * Function that enables the SmartLink control to create an alternative control, which is displayed if no navigation targets are
				 * available. The function has no parameters and has to return an instance of sap.ui.core.Control.
				 *
				 * @since 1.28.0
				 */
				createControlCallback: {
					type: "object",
					defaultValue: null
				},

				/**
				 * If set to <code>false</code>, the SmartLink control will not replace its field name with the according
				 * <code>semanticObject</code> property during the calculation of the semantic attributes. This enables the usage of several
				 * SmartLinks on the same semantic object.
				 */
				mapFieldToSemanticObject: {
					type: "boolean",
					defaultValue: true
				},

				/**
				 * If set to <code>true</code>, the SmartLink control will render the <code>innerControl</code> or the control provided by
				 * <code>createControlCallback</code> instead of the actual link. This is used for example by the SemanticObjectController if this
				 * SmartLink is listed in its <code>ignoredFields</code> or no navigation targets were found during prefetch.
				 *
				 * @since 1.28.0
				 */
				ignoreLinkRendering: {
					type: "boolean",
					defaultValue: false
				}
			},
			aggregations: {

				/**
				 * Control that is displayed instead of SmartLink, if the SmartLink is disabled (for example, if no navigation targets are available).
				 * If <code>innerControl</code> is not provided, the SmartLink control tries to create one with property
				 * <code>createControlCallback</code>.
				 *
				 * @since 1.28.0
				 */
				innerControl: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			events: {

				/**
				 * Event is fired before the navigation popover opens and before navigation target links are getting retrieved. Event can be used to
				 * change the parameters used to retrieve the navigation targets. In case of SmartLink, the <code>beforePopoverOpens</code> is fired
				 * after the link has been clicked.
				 *
				 * @since 1.28.0
				 */
				beforePopoverOpens: {
					parameters: {
						/**
						 * The semantic object for which the navigation targets will be retrieved.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * Map containing the semantic attributes calculated from the binding that will be used to retrieve the navigation targets.
						 * targets.
						 */
						semanticAttributes: {
							type: "object"
						},

						/**
						 * This callback function enables you to define a changed semantic attributes map. Signatures:
						 * <code>setSemanticAttributes(oSemanticAttributesMap)</code> Parameter:
						 * <ul>
						 * <li>{object} oSemanticAttributesMap New map containing the semantic attributes to be used.</li>
						 * </ul>
						 */
						setSemanticAttributes: {
							type: "function"
						},

						/**
						 * This callback function sets an application state key that is used over the cross-application navigation. Signatures:
						 * <code>setAppStateKey(sAppStateKey)</code> Parameter:
						 * <ul>
						 * <li>{string} sAppStateKey</li>
						 * </ul>
						 */
						setAppStateKey: {
							type: "function"
						},

						/**
						 * The ID of the SmartLink.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function triggers the retrieval of navigation targets and leads to the opening of the navigation popover.
						 * Signatures: <code>open()</code> If the <code>beforePopoverOpens</code> has been registered, the <code>open</code>
						 * function has to be called manually in order to open the navigation popover.
						 */
						open: {
							type: "function"
						}
					}
				},

				/**
				 * After the navigation targets are retrieved, <code>navigationTargetsObtained</code> is fired and provides the possibility to
				 * change the targets.
				 *
				 * @since 1.28.0
				 */
				navigationTargetsObtained: {
					parameters: {
						/**
						 * The main navigation object.
						 */
						mainNavigation: {
							type: "sap.ui.comp.navpopover.LinkData"
						},

						/**
						 * Array of available navigation target objects.
						 */
						actions: {
							type: "sap.ui.comp.navpopover.LinkData[]"
						},

						/**
						 * The navigation object for the own application. This navigation option is by default not visible on the popover.
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
						 * The ID of the SmartLink.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function shows the actual navigation popover. If the <code>navigationTargetsObtained</code> has been
						 * registered, the <code>show</code> function has to be called manually in order to open the navigation popover. Signatures:
						 * <code>show()</code>
						 *  <code>show(oMainNavigation, aAvailableActions, oExtraContent)</code>
						 *  <code>show(sMainNavigationId, oMainNavigation, aAvailableActions, oExtraContent)</code>
						 * Parameters:
						 * <ul>
						 * <li>{string} sMainNavigationId The visible text for the main navigation section. If empty, the main navigation ID is
						 * calculated using binding context of given source object (for example SmartLink).</li>
						 * <li>{sap.ui.comp.navpopover.LinkData} oMainNavigation The main navigation object. If empty, property
						 * <code>mainNavigation</code> will be used.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData[]} aAvailableActions Array containing the cross application navigation links. If
						 * empty, property <code>actions</code> will be used.</li>
						 * <li>{sap.ui.core.Control} oExtraContent Control that will be displayed in extra content section on the popover.</li>
						 * </ul>
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
						 * The ID of the SmartLink.
						 */
						originalId: {
							type: "string"
						}
					}
				}
			}
		},
		renderer: function(oRm, oControl) {
			var bRenderLink = true;

			if (oControl.getIgnoreLinkRendering()) {
				var oReplaceControl = oControl._getInnerControl();
				if (oReplaceControl) {
					oRm.write("<div ");
					oRm.writeControlData(oControl);
					oRm.writeClasses();
					oRm.write(">");

					oRm.renderControl(oReplaceControl);

					oRm.write("</div>");

					bRenderLink = false;
				}
			}

			if (bRenderLink) {
				LinkRenderer.render.call(LinkRenderer, oRm, oControl);
			}
		}
	});

	SmartLink.prototype.init = function() {
		// sap.m.Link.prototype.init.call(this);
		this.attachPress(this._linkPressed);
		this.addStyleClass("sapUiCompSmartLink");
		this._oSemanticAttributes = null;
	};

	/**
	 * Eventhandler for link's press event
	 *
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SmartLink.prototype._linkPressed = function(oEvent) {
		if (this._processingLinkPressed) {
			window.console.warn("SmartLink is still processing last press event. This press event is omitted.");
			return; // avoid multiple link press events while data is still fetched
		}

		if (this.getIgnoreLinkRendering()) {
			window.console.warn("SmartLink should ignore link rendering. Press event is omitted.");
			return; // actual link is not rendered -> ignore press event
		}

		this._processingLinkPressed = true;

		var sAppStateKey;
		this._oSemanticAttributes = this._calculateSemanticAttributes();

		var that = this;
		var fOpen = function() {
			that._createPopover();

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
	SmartLink.prototype._onTargetsObtainedOpenDialog = function() {
		var that = this;

		if (!this._oPopover.getMainNavigation()) { // main navigation could not be resolved, so only set link text as MainNavigation
			this._oPopover.setMainNavigation(new LinkData({
				text: this.getText()
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
				that._processingLinkPressed = false;
			}
		});

		if (!this.hasListeners("navigationTargetsObtained")) {
			this._oPopover.show();
			this._processingLinkPressed = false;
		}
	};

	/**
	 * Eventhandler for NavigationPopover's navigate event, exposes event
	 *
	 * @param {object} oEvent - the event parameters
	 * @private
	 */
	SmartLink.prototype._onInnerNavigate = function(oEvent) {
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
	SmartLink.prototype._createPopover = function() {
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

			this._oPopover.setSource(this);
		}
	};

	/**
	 * Finds the parental component.
	 *
	 * @private
	 * @returns {sap.ui.core.Component} the found parental component or null
	 */
	SmartLink.prototype._getComponent = function() {
		var oParent = this.getParent();
		while (oParent) {

			if (oParent instanceof sap.ui.core.Component) {
				return oParent;
			}
			oParent = oParent.getParent();
		}

		return null;
	};

	/**
	 * Gets the current binding context and creates a copied map where all empty and unnecessary data is deleted from.
	 *
	 * @private
	 */
	SmartLink.prototype._calculateSemanticAttributes = function() {
		var oContext = this.getBindingContext();
		if (!oContext) {
			return null;
		}

		var oBinding = this.getBinding("text");
		var sCurrentField = oBinding.getPath();

		var oResult = {};
		var oContext = oContext.getObject(oContext.getPath());
		for ( var sAttributeName in oContext) {
			// Ignore metadata
			if (sAttributeName === "__metadata") {
				continue;
			}
			// Ignore empty values
			if (!oContext[sAttributeName]) {
				continue;
			}

			// Map attribute name by semantic object name
			var sSemanticObjectName = this._mapFieldToSemanticObject(sAttributeName);
			if (sAttributeName === sCurrentField && this.getSemanticObject()) {
				sSemanticObjectName = this.getSemanticObject();
			}

			// Map all available attribute fields to their semanticObjects excluding SmartLink's own SemanticObject
			if (sSemanticObjectName === this.getSemanticObject() && !this.getMapFieldToSemanticObject()) {
				sSemanticObjectName = sAttributeName;
			}

			// If more then one attribute fields maps to the same semantic object we take the value of the current binding path.
			var oAttributeValue = oContext[sAttributeName];
			if (oResult[sSemanticObjectName]) {
				if (oContext[sCurrentField]) {
					oAttributeValue = oContext[sCurrentField];
				}
			}

			// Copy the value replacing the attribute name by semantic object name
			oResult[sSemanticObjectName] = oAttributeValue;
		}

		return oResult;
	};

	/**
	 * Gets the semantic object calculated at the last Link press event
	 *
	 * @returns {object} Map containing the copy of the available binding context.
	 * @public
	 */
	SmartLink.prototype.getSemanticAttributes = function() {
		if (this._oSemanticAttributes === null) {
			this._oSemanticAttributes = this._calculateSemanticAttributes();
		}
		return this._oSemanticAttributes;
	};

	/**
	 * Maps the given field name to the corresponding semantic object.
	 *
	 * @param {string} sFieldName The field name which should be mapped to a semantic object
	 * @returns {string} Corresponding semantic object, or the original field name if semantic object is not available.
	 * @private
	 */
	SmartLink.prototype._mapFieldToSemanticObject = function(sFieldName) {
		var oSOController = this.getSemanticObjectController();
		if (!oSOController) {
			return sFieldName;
		}
		var oMap = oSOController.getFieldSemanticObjectMap();
		if (!oMap) {
			return sFieldName;
		}
		return oMap[sFieldName] || sFieldName;
	};

	SmartLink.prototype.setFieldName = function(sFieldName) {
		this.setProperty("fieldName", sFieldName);

		var oSemanticController = this.getSemanticObjectController();
		if (oSemanticController) {
			oSemanticController.setIgnoredState(this);
		}
	};

	// BCP 1670108744: when semanticObjectController is set first then semanticObject is still not known in the step where ignoredState is determined
	SmartLink.prototype.setSemanticObject = function(sSemanticObject) {
		this.setProperty("semanticObject", sSemanticObject, true);

		var oSemanticObjectController = this.getSemanticObjectController();
		if (oSemanticObjectController) {
			oSemanticObjectController.setIgnoredState(this);
		}
	};

	SmartLink.prototype.setSemanticObjectController = function(oController) {
		var oOldController = this.getProperty("semanticObjectController");
		if (oOldController) {
			oOldController.unregisterControl(this);
		}

		this.setProperty("semanticObjectController", oController, true);
		if (oController) {
			oController.registerControl(this);
		}
		this._oSemanticAttributes = null;
	};

	SmartLink.prototype.getSemanticObjectController = function() {
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
	 * Gets the current value assigned to the field with the SmartLink's semantic object name.
	 *
	 * @returns {object} The semantic object's value.
	 * @public
	 */
	SmartLink.prototype.getSemanticObjectValue = function() {
		var oSemanticAttributes = this.getSemanticAttributes();
		if (oSemanticAttributes) {
			var sSemanticObjectName = this.getSemanticObject();
			return oSemanticAttributes[sSemanticObjectName];
		}

		return null;
	};

	SmartLink.prototype.setText = function(sText) {
		if (this._isRenderingInnerControl()) {
			// SmartLink renders inner control => overwrite base setText as it changes the DOM directly
			this.setProperty("text", sText, true);
		} else {
			Link.prototype.setText.call(this, sText);
		}
	};

	SmartLink.prototype._isRenderingInnerControl = function() {
		return this.getIgnoreLinkRendering() && this._getInnerControl() != null;
	};

	/**
	 * Gets the inner control which is provided by the CreateControlCallback
	 *
	 * @returns {sap.ui.core.Control} The control.
	 * @private
	 */
	SmartLink.prototype._getInnerControl = function() {
		var oInnerControl = this.getAggregation("innerControl");
		if (!oInnerControl) {
			var fCreate = this.getCreateControlCallback();
			if (fCreate) {
				oInnerControl = fCreate();
				this.setAggregation("innerControl", oInnerControl, true);
			}
		}

		return oInnerControl;
	};

	/**
	 * Gets the inner control's value, if no inner control is available, the SmartLink's text will be returned
	 *
	 * @returns {object} the value
	 * @public
	 */
	SmartLink.prototype.getInnerControlValue = function() {
		if (this._isRenderingInnerControl()) {
			var oInnerControl = this._getInnerControl();

			if (oInnerControl) {
				if (oInnerControl.getText) {
					return oInnerControl.getText();
				}

				if (oInnerControl.getValue) {
					return oInnerControl.getValue();
				}
			}
		}

		return this.getText();
	};

	/**
	 * Called before rendering
	 */
	SmartLink.prototype.onBeforeRendering = function() {
		// ensure that the semantic object controller exists, do this first as retrieving the SemanticObjectController can lead to setting the
		// ignoreLinkRendering flag
		this.getSemanticObjectController();

		// if link should not be rendered, but no inner control is available, deactivate SmartLink
		if (this.getIgnoreLinkRendering() && this._getInnerControl() == null) {
			this.setEnabled(false);
		} else {
			this.setEnabled(true);
		}
	};

	SmartLink.prototype.exit = function() {
		this.setSemanticObjectController(null); // disconnect from SemanticObjectController
	};

	return SmartLink;

}, /* bExport= */true);
