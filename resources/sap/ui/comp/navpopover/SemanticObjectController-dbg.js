/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.navpopover.SemanticObjectController.
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Element', 'sap/ui/comp/personalization/Util'
], function(jQuery, library, Element, PersonalizationUtil) {
	"use strict";

	/**
	 * Constructor for a new navpopover/SemanticObjectController.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SemanticObjectController allows the user to register against semantic object navigation events as well as define semantic objects
	 *        which should be ignored.
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.navpopover.SemanticObjectController
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SemanticObjectController = Element.extend("sap.ui.comp.navpopover.SemanticObjectController", /** @lends sap.ui.comp.navpopover.SemanticObjectController.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Comma-separated list of field names that must not be displayed as links.
				 * 
				 * @since 1.28.0
				 */
				ignoredFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If set to <code>true</code>, the SemanticObjectController will retrieve all navigation targets once and will disable links for
				 * which no targets were found. Setting this value to <code>true</code> will trigger an additional roundtrip.
				 * 
				 * @since 1.28.0
				 */
				prefetchNavigationTargets: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Maps the field names to the related semantic objects. When accessing this property for the first time, the mapping will be
				 * calculated from the metadata within the provided model.
				 * 
				 * @since 1.28.0
				 */
				fieldSemanticObjectMap: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The name of the entity set used. If <code>entitySet</code> has not been defined, the SemanticObjectController tries to retrieve
				 * the name from its parents. <b>Note:</b> This is not a dynamic UI5 property.
				 * 
				 * @since 1.28.0
				 */
				entitySet: {
					type: "string",
					group: "Misc",
					defaultValue: null
				}
			},
			events: {

				/**
				 * After the navigation targets have been retrieved, <code>navigationTargetsObtained</code> is fired and makes it possible you to
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
						 * The ID of the control that fires this event. If <code>navigationTargetsObtained</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is also the SmartLink's ID. If
						 * <code>navigationTargetsObtained</code> is registered on the SemanticObjectController, <code>originalId</code> helps to
						 * identify the original SmartLink control which triggered the event.
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
						 * calculated using binding context of given source object (such as SmartLink).</li>
						 * <li>{sap.ui.comp.navpopover.LinkData} oMainNavigation The main navigation object. If empty, property
						 * <code>mainNavigation</code> will be used.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData[]} aAvailableActions Array containing the cross-application navigation links. If
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
				 * Event is fired before the navigation popover opens and before navigation target links are retrieved. Event can be used to change
				 * the parameters used to retrieve the navigation targets. In case of SmartLink, <code>beforePopoverOpens</code> is fired after the
				 * link has been clicked.
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
						 * The ID of the control that fires this event. If <code>beforePopoverOpens</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is also the SmartLink's ID. If the
						 * <code>beforePopoverOpens</code> is registered on the SemanticObjectController, <code>originalId</code> helps to
						 * identify the original SmartLink control which triggered the event.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function triggers the retrieval of navigation targets and leads to the opening of the navigation popover.
						 * Signatures: <code>open()</code> If <code>beforePopoverOpens</code> has been registered, <code>open</code> function
						 * has to be called manually in order to open the navigation popover.
						 */
						open: {
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
				navigate: {
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
						 * The ID of the control that fires this event. If <code>navigate</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is the SmartLink's ID. If <code>navigate</code> is
						 * registered on the SemanticObjectController, <code>originalId</code> helps to identify the original SmartLink control
						 * which triggered the event.
						 */
						originalId: {
							type: "string"
						}
					}
				},

				/**
				 * If the property <code>prefechtNavigationTargets</code> is set to <code>true</code>, event <code>prefetchDone</code>
				 * is fired after all navigation targets have been retrieved.
				 * 
				 * @since 1.28.0
				 */
				prefetchDone: {
					parameters: {
						/**
						 * A map containing all semantic objects as keys for which at least one navigation target has been found. The value for each
						 * semantic object key is an array containing the available actions found for this semantic object.
						 */
						semanticObjects: {
							type: "object"
						}
					}
				}
			}
		}
	});

	SemanticObjectController.prototype.init = function() {
		this._proxyOnBeforePopoverOpens = jQuery.proxy(this._onBeforePopoverOpens, this);
		this._proxyOnTargetsObtained = jQuery.proxy(this._onTargetsObtained, this);
		this._proxyOnNavigate = jQuery.proxy(this._onNavigate, this);
		this._aRegisteredControls = [];
		this._aIgnoredSegmanticObjects = [];
	};

	/**
	 * Adds the given control from the SemanticObjectControler and registers all relevant events
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink} oSemanticSmartControl the SmartLink which should be added.
	 * @public
	 */
	SemanticObjectController.prototype.registerControl = function(oSemanticSmartControl) {
		if (oSemanticSmartControl.attachBeforePopoverOpens && !oSemanticSmartControl.hasListeners("beforePopoverOpens")) {
			oSemanticSmartControl.attachBeforePopoverOpens(this._proxyOnBeforePopoverOpens);
		}
		if (oSemanticSmartControl.attachNavigationTargetsObtained && !oSemanticSmartControl.hasListeners("navigationTargetsObtained")) {
			oSemanticSmartControl.attachNavigationTargetsObtained(this._proxyOnTargetsObtained);
		}

		if (oSemanticSmartControl.attachInnerNavigate && !oSemanticSmartControl.hasListeners("innerNavigate")) {
			oSemanticSmartControl.attachInnerNavigate(this._proxyOnNavigate);
		}

		this.setIgnoredState(oSemanticSmartControl);
		this._aRegisteredControls.push(oSemanticSmartControl);
	};

	/**
	 * Removes the given control from the SemanticObjectControler and unregisters all relevant events
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink} oSemanticSmartControl the SmartLink which should be removed.
	 * @public
	 */
	SemanticObjectController.prototype.unregisterControl = function(oSemanticSmartControl) {
		if (oSemanticSmartControl.detachBeforePopoverOpens) {
			oSemanticSmartControl.detachBeforePopoverOpens(this._proxyOnBeforePopoverOpens);
		}
		if (oSemanticSmartControl.detachNavigationTargetsObtained) {
			oSemanticSmartControl.detachNavigationTargetsObtained(this._proxyOnTargetsObtained);
		}

		if (oSemanticSmartControl.detachInnerNavigate) {
			oSemanticSmartControl.detachInnerNavigate(this._proxyOnNavigate);
		}

		this._aRegisteredControls.pop(oSemanticSmartControl);
	};

	/**
	 * Eventhandler before navigation popover opens
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onBeforePopoverOpens = function(oEvent) {
		var oParameters = oEvent.getParameters();

		if (this.hasListeners("beforePopoverOpens")) {
			this.fireBeforePopoverOpens({
				semanticObject: oParameters.semanticObject,
				semanticAttributes: oParameters.semanticAttributes,
				setSemanticAttributes: oParameters.setSemanticAttributes,
				setAppStateKey: oParameters.setAppStateKey,
				originalId: oParameters.originalId,
				open: oParameters.open
			});
		} else {
			oParameters.open();
		}
	};

	/**
	 * Eventhandler after navigation targets have been retrieved.
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onTargetsObtained = function(oEvent) {
		var oParameters = oEvent.getParameters();
		if (this.hasListeners("navigationTargetsObtained")) {
			var oSource = oEvent.getSource();
			this.fireNavigationTargetsObtained({
				semanticObject: oSource.getSemanticObject(),
				semanticAttributes: oSource.getSemanticAttributes(),
				actions: oParameters.actions,
				mainNavigation: oParameters.mainNavigation,
				ownNavigation: oParameters.ownNavigation,
				originalId: oParameters.originalId,
				show: oParameters.show
			});
		} else {
			oParameters.show();
		}
	};

	/**
	 * Eventhandler after navigation has been triggered.
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onNavigate = function(oEvent) {
		var oParameters = oEvent.getParameters();
		this.fireNavigate({
			text: oParameters.text,
			href: oParameters.href,
			originalId: oParameters.originalId,
			semanticObject: oParameters.semanticObject,
			semanticAttributes: oParameters.semanticAttributes
		});
	};

	/**
	 * Checks if the given SmartLink should be enabled or disabled and sets the state
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink} oSmartLink the SmartLink which should be enabled or disabled.
	 * @public
	 */
	SemanticObjectController.prototype.setIgnoredState = function(oSmartLink) {
		if (oSmartLink instanceof sap.ui.comp.navpopover.SmartLink) {
			var bIsIgnored = this._fieldIsIgnored(oSmartLink.getFieldName()) || !this._linkIsAvailable(oSmartLink.getSemanticObject());
			oSmartLink.setIgnoreLinkRendering(bIsIgnored);
		}
	};

	/**
	 * Checks if the given fieldname is within the ignored list
	 * 
	 * @param {string} sFieldName the fieldname.
	 * @returns {boolean} true if the field is ignored
	 * @private
	 */
	SemanticObjectController.prototype._fieldIsIgnored = function(sFieldName) {
		return this._aIgnoredSegmanticObjects.indexOf(sFieldName) > -1;
	};

	/**
	 * Checks if the given semantic object name has a navigation link
	 * 
	 * @param {string} sSemanticObject the SemanticObject.
	 * @returns {boolean} true if the semantic object has known navigation links
	 * @private
	 */
	SemanticObjectController.prototype._linkIsAvailable = function(sSemanticObject) {
		if (this._oAvailableLinks) {
			if (!this._oAvailableLinks[sSemanticObject]) {
				return false;
			}
		}
		return true;
	};

	SemanticObjectController.prototype.setIgnoredFields = function(sIgnoredFields) {
		this._aIgnoredSegmanticObjects = PersonalizationUtil.createArrayFromString(sIgnoredFields);
		this.setProperty("ignoredFields", sIgnoredFields);
		this._evaluateEnableState();
	};

	SemanticObjectController.prototype.setPrefetchNavigationTargets = function(bPrefetch) {
		this.setProperty("prefetchNavigationTargets", bPrefetch);

		if (bPrefetch) {
			this._prefetchNavigationTargets();
		} else {
			this._oAvailableLinks = null;
			this._evaluateEnableState();
		}
	};

	SemanticObjectController.prototype.getFieldSemanticObjectMap = function() {
		var oMap = this.getProperty("fieldSemanticObjectMap");
		if (oMap) {
			return oMap;
		}

		if (!this.getEntitySet()) {
			jQuery.sap.log.warning("FieldSemanticObjectMap is not set on SemanticObjectController, retrieval without EntitySet not possible");
			return null;
		}

		jQuery.sap.require("sap.ui.comp.odata.MetadataAnalyser");
		var oMetadataAnalyzer = new sap.ui.comp.odata.MetadataAnalyser(this.getModel());
		oMap = oMetadataAnalyzer.getFieldSemanticObjectMap(this.getEntitySet());
		if (oMap) {
			this.setProperty("fieldSemanticObjectMap", oMap, true);
		}

		return oMap;
	};

	SemanticObjectController.prototype.getEntitySet = function() {
		var sEntitySet = this.getProperty("entitySet");
		if (sEntitySet) {
			return sEntitySet;
		}

		var oParent = this.getParent();
		while (oParent) {
			if (oParent.getEntitySet) {
				sEntitySet = oParent.getEntitySet();
				if (sEntitySet) {
					this.setProperty("entitySet", sEntitySet, true);
					break;
				}
			}
			oParent = oParent.getParent();
		}

		return sEntitySet;
	};

	/**
	 * Retrieves all navigation targets to identify semantic objects for which a link should be displayed
	 * 
	 * @private
	 */
	SemanticObjectController.prototype._prefetchNavigationTargets = function() {
		var fGetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
		if (!fGetService) {
			return;
		}

		this._oAvailableLinks = {};
		var oCrossAppNav = fGetService("CrossApplicationNavigation");
		var oURLParsing = fGetService("URLParsing");
		var oPromise = oCrossAppNav.getSemanticObjectLinks('');

		oPromise.fail(jQuery.proxy(function() {
			// activate links by removing empty AvailableLinks map
			this._oAvailableLinks = null;
			jQuery.sap.log.error("'getSemanticObjectLinks' failed");
			this._evaluateEnableState();
		}, this));

		oPromise.done(jQuery.proxy(function(aLinks) {
			var i, iLength;
			if (aLinks && aLinks.length) {
				iLength = aLinks.length;
				for (i = 0; i < iLength; i++) {
					var sId = aLinks[i].intent;
					var oShellHash = oURLParsing.parseShellHash(sId);
					if (oShellHash && oShellHash.semanticObject) {
						this._addActionToSemanticObject(oShellHash.semanticObject, oShellHash.action);
					}
				}
			}
			this._evaluateEnableState();
			this.firePrefetchDone({
				semanticObjects: this._oAvailableLinks
			});
		}, this));
	};

	/**
	 * adds the given action to the action list of the given semantic object
	 * 
	 * @param {string} sSemanticObject the SemanticObject.
	 * @param {string} sAction the Action.
	 * @private
	 */
	SemanticObjectController.prototype._addActionToSemanticObject = function(sSemanticObject, sAction) {
		if (!this._oAvailableLinks[sSemanticObject]) {
			this._oAvailableLinks[sSemanticObject] = [];
		}

		this._oAvailableLinks[sSemanticObject].push(sAction);
	};

	/**
	 * Loops over all registered controls and evaluates if their enabled or not
	 * 
	 * @private
	 */
	SemanticObjectController.prototype._evaluateEnableState = function() {
		for (var i = 0, iLength = this._aRegisteredControls.length; i < iLength; i++) {
			this.setIgnoredState(this._aRegisteredControls[i]);
		}
	};

	return SemanticObjectController;

}, /* bExport= */true);
