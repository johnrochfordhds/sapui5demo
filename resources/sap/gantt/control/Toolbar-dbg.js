/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Control", "sap/ui/core/Core", "sap/m/OverflowToolbar", "sap/m/OverflowToolbarLayoutData", "sap/m/OverflowToolbarPriority", "sap/m/ToolbarSpacer", "sap/m/FlexBox", "sap/m/FlexDirection", "sap/m/FlexJustifyContent",
	"sap/m/Button", "sap/m/ButtonType", "sap/m/SegmentedButton", "sap/m/Select", 
	"sap/ui/core/Item", "sap/m/ViewSettingsDialog", "sap/m/ViewSettingsCustomTab", "sap/m/PlacementType",
	"sap/m/CheckBox", "sap/ui/core/Orientation", "./AssociateContainer", "sap/gantt/legend/LegendContainer", "sap/gantt/misc/Utility", "sap/m/Slider", "sap/m/Popover"
], function (Control, Core, OverflowToolbar, OverflowToolbarLayoutData, OverflowToolbarPriority, ToolbarSpacer, FlexBox, FlexDirection, FlexJustifyContent,
		Button, ButtonType, SegmentedButton, Select, CoreItem, ViewSettingsDialog, ViewSettingsCustomTab, PlacementType, CheckBox,
		Orientation, AssociateContainer, LegendContainer, Utility, Slider, Popover) {
	"use strict";

	var Toolbar = Control.extend("sap.gantt.control.Toolbar", {
		metadata : {
			properties : {
				width : {type : "CSSSize", defaultValue: "100%"},
				height : {type : "CSSSize", defaultValue: "100%"},
				type: {type: "string", defaultValue: sap.gantt.control.ToolbarType.Global},
				sourceId:{type: "string"},
				zoomRate:{type: "float"},
				zoomInfo: {type: "object"},
				sliderStep: {type: "int"},
				enableTimeScrollSync: {type: "boolean", defaultValue: true},
				enableRowScrollSync: {type: "boolean", defaultValue: false},
				enableCursorLine: {type: "boolean", defaultValue: true},
				enableNowLine: {type: "boolean", defaultValue: true},
				enableVerticalLine: {type: "boolean", defaultValue: true},
				/*
				 * Configuration property.
				 */
				modes: {
					type: "array",
					defaultValue: [sap.gantt.config.DEFAULT_MODE]
				},
				mode: {
					type: "string",
					defaultValue: sap.gantt.config.DEFAULT_MODE_KEY
				},
				/*
				 * Configuration property.
				 */
				toolbarSchemes: {
					type: "array",
					defaultValue: [
						sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME,
						sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME,
						sap.gantt.config.EMPTY_TOOLBAR_SCHEME
					]
				},
				/*
				 * Configuration property.
				 */
				hierarchies: {
					type: "array", 
					defaultValue: [sap.gantt.config.DEFAULT_HIERARCHY]
				},
				/*
				 * Configuration property.
				 */
				containerLayouts: {
					type: "array",
					defaultValue: [
						sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT,
						sap.gantt.config.DEFAULT_CONTAINER_DUAL_LAYOUT
					]
				}
			},
			aggregations : {
				legend: {type: "sap.ui.core.Control", multiple: false, visibility: "public"},
				customToolbarItems: {type: "sap.ui.core.Control", multiple: true, visibility: "public", singularName: "customToolbarItem"},
				_toolbar : {type: "sap.m.OverflowToolbar", multiple: false, visibility: "hidden"}
			},
			events: {
				sourceChange: {
					parameters: {
						id: {type: "string"}
					}
				},
				layoutChange: {
					parameters: {
						id: {type: "string"},
						value: {type: "string"}
					}
				},
				expandChartChange: {
					parameters: {
						action: {type: "string"},
						expandedChartSchemes: {type: "[]"}
					}
				},
				expandTreeChange: {
					parameters: {
						action: {type: "string"}
					}
				},
				zoomRateChange: {
					parameters:{
						zoomRate: {type : "float"}
					}
				},
				settingsChange: {
					parameters: {
						id: {type: "string"},
						value: {type: "boolean"}
					}
				},
				modeChange: {
					parameters: {
						mode: {type: "string"}
					}
				}
			}
		}
	});
	
	// shrinkable class name
	Toolbar.ToolbarItemPosition = {
		Left: "Left",
		Right: "Right"
	};

	Toolbar.prototype.init = function() {
		this._oToolbar = new OverflowToolbar({
			width: "auto",
			design: sap.m.ToolbarDesign.Auto
		});
		this.setAggregation("_toolbar", this._oToolbar, true);

		this._initCustomToolbarInfo();

		this._oModesConfigMap = {};
		this._oModesConfigMap[sap.gantt.config.DEFAULT_MODE_KEY] = sap.gantt.config.DEFAULT_MODE;

		this._oToolbarSchemeConfigMap = {};
		this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY] = sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME;
		this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY] = sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME;
		this._oToolbarSchemeConfigMap[sap.gantt.config.EMPTY_TOOLBAR_SCHEME_KEY] = sap.gantt.config.EMPTY_TOOLBAR_SCHEME;

		this._oHierarchyConfigMap = {};
		this._oHierarchyConfigMap[sap.gantt.config.DEFAULT_HIERARCHY_KEY] = sap.gantt.config.DEFAULT_HIERARCHY;

		this._oContainerLayoutConfigMap = {};
		this._oContainerLayoutConfigMap[sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY] = sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT;
		this._oContainerLayoutConfigMap[sap.gantt.config.DEFAULT_CONTAINER_DUAL_LAYOUT_KEY] = sap.gantt.config.DEFAULT_CONTAINER_DUAL_LAYOUT;

		this._oZoomSlider = null;
		this._iLastChartWidth = -1;
		
		this._iCustomItemInsertIndex = -1;
		this._aCustomItems = [];

		// iLiveChangeTimer is used to accumulate zoomRate change event in order to reduce shapes drawing cycle
		this._iLiveChangeTimer = -1;

		this._aTimers = [];
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.gantt");

	};

	Toolbar.prototype._initCustomToolbarInfo = function(){
		this._oItemConfiguration = {
			Left: [],
			Right: []
		};
		// pos 0 is list left controls, 1 is list of right controls
		this._oAllCustomItems = {
			Left: [],
			Right: []
		};
		this._iCustomItemInsertIndex = -1;
		this._aCustomItems = [];
	};

	/*
	 * This method happens after init run. It receives config from constructor.
	 * If it's a binding, the super method would resolve binding, and the right
	 * timing to access properties is after super call and before returning.
	 */
	Toolbar.prototype.applySettings = function (mSettings, oScope){
		if (this.getSourceId() && this.getType()) {
			this._resetAllCompositeControls();
		}

		var oRetVal = Control.prototype.applySettings.apply(this, arguments);
		return oRetVal;
	};

	Toolbar.prototype.setLegend = function (oLegendContainer){
		this.setAggregation("legend", oLegendContainer);

		if (!this._oLegendPop) {
			this._oLegendPop = new Popover({
				placement: PlacementType.Bottom,
				showArrow: false,
				showHeader: false
			});
		}

		if (oLegendContainer) {
			this._oLegendPop.removeAllContent();
			this._oLegendPop.addContent(oLegendContainer);
			var iOffsetX;
			if (Core.getConfiguration().getRTL() === true) {
				iOffsetX = 100;
			} else {
				var oLegend = sap.ui.getCore().byId(oLegendContainer.getContent());
				iOffsetX = 100 - parseInt(oLegend.getWidth(), 10);
			}
			this._oLegendPop.setOffsetX(iOffsetX);
		}
	};


	Toolbar.prototype.setZoomInfo = function(oZoomInfo) {
		if (oZoomInfo && oZoomInfo.iChartWidth > 0 && this._oZoomSlider) {
			var fMinZoomRate = oZoomInfo.determinedByChartWidth.fMinRate > oZoomInfo.determinedByConfig.fMinRate ?
					oZoomInfo.determinedByChartWidth.fMinRate : oZoomInfo.determinedByConfig.fMinRate,
			fMaxZoomRate = oZoomInfo.determinedByConfig.fMaxRate,
			fSuitableZoomRate = oZoomInfo.determinedByChartWidth.fSuitableRate ?
					oZoomInfo.determinedByChartWidth.fSuitableRate :
					oZoomInfo.determinedByConfig.fRate;

			var fFinalZoomRate = fSuitableZoomRate,
				oZoomSlider = this._oZoomSlider,
				iLastChartWidth = this._iLastChartWidth;

			oZoomSlider.setMin(Math.log(fMinZoomRate));
			oZoomSlider.setMax(Math.log(fMaxZoomRate));
			var fZoomRate = this.getProperty("zoomRate");
			if (fZoomRate && fZoomRate > 0) {
				fFinalZoomRate = fZoomRate;
			} else {
				if (iLastChartWidth === -1) {
					// the Last chart Width is -1 which is set in init method indicates that
					// This is the first time load, use the default suitable zoom rate
					fFinalZoomRate = fSuitableZoomRate;
				} else if (iLastChartWidth !== oZoomInfo.iChartWidth) {
					fFinalZoomRate = fMinZoomRate;
				}
				fFinalZoomRate = Math.max(fFinalZoomRate, oZoomSlider.getMin());
				fFinalZoomRate = Math.min(fFinalZoomRate, oZoomSlider.getMax());
				this.setProperty("zoomRate", fFinalZoomRate);
			}
			this.setProperty("zoomInfo", oZoomInfo);

			oZoomSlider.setValue(Math.log(fFinalZoomRate));
			oZoomSlider.setStep((oZoomSlider.getMax() - oZoomSlider.getMin()) / this.getSliderStep());
			this.fireZoomRateChange({ zoomRate: fFinalZoomRate});
			this._iLastChartWidth = oZoomInfo.iChartWidth;
			
		}
		return this;
	};

	Toolbar.prototype.setMode = function(sMode) {
		this.setProperty("mode", sMode);
		//update mode button value, when the toolbar is empty, then there is no _oModeSegmentButton.
		if (this._oModeSegmentButton) {
			this._oModeSegmentButton.setSelectedButton(this._oModeButtonMap[sMode]);
		}
		return this;
	};

	Toolbar.prototype.setHierarchies = function (aHierarchies) {
		this.setProperty("hierarchies", aHierarchies);
		this._oHierarchyConfigMap = {};
		if (aHierarchies) {
			for (var i = 0; i < aHierarchies.length; i++) {
				this._oHierarchyConfigMap[aHierarchies[i].getKey()] = aHierarchies[i];
			}
		}
		this._resetAllCompositeControls();
		return this;
	};

	Toolbar.prototype.setContainerLayouts = function (aContainerLayouts) {
		this.setProperty("containerLayouts", aContainerLayouts);
		this._oContainerLayoutConfigMap = {};
		if (aContainerLayouts) {
			for (var i = 0; i < aContainerLayouts.length; i++) {
				this._oContainerLayoutConfigMap[aContainerLayouts[i].getKey()] = aContainerLayouts[i];
			}
		}
		this._resetAllCompositeControls();
		return this;
	};

	Toolbar.prototype.setModes = function (aModes) {
		this.setProperty("modes", aModes);
		this._oModesConfigMap = {};
		if (aModes) {
			for (var i = 0; i < aModes.length; i++) {
				this._oModesConfigMap[aModes[i].getKey()] = aModes[i];
			}
		}
		return this;
	};

	Toolbar.prototype.setToolbarDesign = function (sToolbarDesign) {
		this._oToolbar.setDesign(sToolbarDesign);
		return this;
	};
	Toolbar.prototype.setToolbarSchemes = function (aToolbarSchemes) {
		this.setProperty("toolbarSchemes", aToolbarSchemes);
		this._oToolbarSchemeConfigMap = {};
		if (aToolbarSchemes) {
			for (var i = 0; i < aToolbarSchemes.length; i++) {
				this._oToolbarSchemeConfigMap[aToolbarSchemes[i].getKey()] = aToolbarSchemes[i];
			}
		}
		this._resetAllCompositeControls();
		return this;
	};

	Toolbar.prototype.setSourceId = function (sSourceId) {
		this.setProperty("sourceId", sSourceId);
		this._resetAllCompositeControls();
		return this;
	};

	Toolbar.prototype.setType = function (sType) {
		this.setProperty("type", sType);
		this._resetAllCompositeControls();
		return this;
	};

	Toolbar.prototype.addCustomToolbarItem = function (oCustomToolbarItem) {

		if (this._iCustomItemInsertIndex == -1) {
			// -1 means no other items found, so put the item at first!
			// and move the index cursor to next
			this._oToolbar.insertContent(oCustomToolbarItem, 0);
			this._iCustomItemInsertIndex++;

		} else {
			this._oToolbar.insertContent(oCustomToolbarItem, this._iCustomItemInsertIndex + 1);
			this._iCustomItemInsertIndex++;
		}
		this._aCustomItems.push(oCustomToolbarItem);
		return this;
	};

	Toolbar.prototype.insertCustomToolbarItem = function (oCustomToolbarItem, iIndex) {

		var iMaxLength = this._aCustomItems.length;
		if (iIndex >= iMaxLength) {
			iIndex = iMaxLength;
		}
		if (this._iCustomItemInsertIndex === -1) {
			//-1 means no other items found, put the item at first
			this._oToolbar.insertContent(oCustomToolbarItem, 0);
			this._aCustomItems.push(oCustomToolbarItem);
		} else {
			//this._iCustomItemInsertIndex - this._aCustomItems.length + 1 is the start position of the custom item
			this._oToolbar.insertContent(oCustomToolbarItem, this._iCustomItemInsertIndex - this._aCustomItems.length + 1 + iIndex);
			this._aCustomItems.splice(iIndex, 0, oCustomToolbarItem);
		}
		this._iCustomItemInsertIndex++;
		return this;
	};

	Toolbar.prototype.removeCustomToolbarItem = function (vCustomToolbarItem) {
		if (this._aCustomItems.length === 0) {
			return this._aCustomItems;
		}
		if ((typeof vCustomToolbarItem) === "number") {
			var iCustomItemCount = this._aCustomItems.length;
			var iRemoveCustomIndex = vCustomToolbarItem > iCustomItemCount ? iCustomItemCount : vCustomToolbarItem;
			this._oToolbar.removeContent(this._iCustomItemInsertIndex - iCustomItemCount + iRemoveCustomIndex + 1);
			this._iCustomItemInsertIndex--;
			return this._aCustomItems.splice(iRemoveCustomIndex, 1);
		} else if (vCustomToolbarItem) {
			this._oToolbar.removeContent(vCustomToolbarItem);
			this._iCustomItemInsertIndex--;
			return this._aCustomItems.splice(jQuery.inArray(vCustomToolbarItem, this._aCustomItems), 1);
		}
	};

	Toolbar.prototype.removeAllCustomToolbarItems = function () {
		var aRemovedItems = [];
		for (var iIndex = 0; iIndex < this._aCustomItems.length; iIndex++) {
			aRemovedItems.push(this._oToolbar.removeContent(this._aCustomItems[iIndex]));
		}
		this._iCustomItemInsertIndex = this._iCustomItemInsertIndex - this._aCustomItems.length;
		this._aCustomItems.splice(0, this._aCustomItems.length);
		return aRemovedItems;
	};

	Toolbar.prototype._resetAllCompositeControls = function() {
		// determine this._sToolbarSchemeKey, this._sInitMode and this._oToolbarScheme
		this._determineToolbarSchemeConfig(this.getSourceId());
		this._destroyCompositeControls();
		if (!this._sToolbarSchemeKey) {
			return;
		}
		// sort group config into this._oItemConfiguration
		this._resolvePositions();

		var iIndex,
			oContent,
			sLeft = Toolbar.ToolbarItemPosition.Left,
			sRight = Toolbar.ToolbarItemPosition.Right;
		var aLeftItemsConfig = this._oItemConfiguration[sLeft];
		for (iIndex = 0; iIndex < aLeftItemsConfig.length; iIndex++) {
			if (aLeftItemsConfig[iIndex]) {
				// the index might come consecutive 
				this._createCompositeControl(sLeft, iIndex, aLeftItemsConfig[iIndex]);
			}
		}
		
		var aRightItemsConfig = this._oItemConfiguration[sRight];
		for (iIndex = 0; iIndex < aRightItemsConfig.length; iIndex++) {
			if (aRightItemsConfig[iIndex]) {
				this._createCompositeControl(sRight, iIndex, aRightItemsConfig[iIndex]);
			}
		}
		
		var fnAddToolbarContent = function (oContent) {
			if (jQuery.isArray(oContent)) {
				for (var m = 0; m < oContent.length; m++) {
					this._oToolbar.addContent(oContent[m]);
				}
			} else if (oContent) {
				this._oToolbar.addContent(oContent);
			}
		};

		// add left items
		for (iIndex = 0; iIndex < this._oAllCustomItems[sLeft].length; iIndex++) {
			oContent = this._oAllCustomItems[sLeft][iIndex];
			fnAddToolbarContent.call(this, oContent);
		}
		// add spacer
		if (this._oAllCustomItems[sLeft].length !== 0 || this._oAllCustomItems[sRight].length !== 0) {
			this._oToolbar.addContent(new ToolbarSpacer());
		}
		// add right items, reverse order
		for (iIndex = this._oAllCustomItems[sRight].length - 1; iIndex >= 0; iIndex--) {
			oContent = this._oAllCustomItems[sRight][iIndex];
			fnAddToolbarContent.call(this, oContent);
		}
		
		var oZoomInfo = this.getProperty("zoomInfo");
		if (oZoomInfo) {
			this.setZoomInfo(oZoomInfo);
		}
	};

	Toolbar.prototype.getAllToolbarItems = function () {
		return this._oToolbar.getContent();
	};

	Toolbar.prototype._determineToolbarSchemeConfig = function (sSourceId) {
		this._sToolbarSchemeKey = null;
		// determine toolbarSchemeId
		if (this.getType() === sap.gantt.control.ToolbarType.Global && this._oContainerLayoutConfigMap[sSourceId]) {
			this._sToolbarSchemeKey = this._oContainerLayoutConfigMap[sSourceId].getToolbarSchemeKey();
			this._sInitMode = this.getMode() != sap.gantt.config.DEFAULT_MODE_KEY ? this.getMode() : this._oContainerLayoutConfigMap[sSourceId].getActiveModeKey();
		} else if (this.getType() === sap.gantt.control.ToolbarType.Local && this._oHierarchyConfigMap[sSourceId]) {
			this._sToolbarSchemeKey = this._oHierarchyConfigMap[sSourceId].getToolbarSchemeKey();
			this._sInitMode = this.getMode() != sap.gantt.config.DEFAULT_MODE_KEY ? this.getMode() : this._oHierarchyConfigMap[sSourceId].getActiveModeKey();
		}
		// determine toolbar scheme config
		this._oToolbarScheme = this._oToolbarSchemeConfigMap[this._sToolbarSchemeKey];
		if (this._oToolbarScheme && this._oToolbarScheme.getProperty("toolbarDesign")) {
			this.setToolbarDesign(this._oToolbarScheme.getProperty("toolbarDesign"));
		}
	};

	Toolbar.prototype._destroyCompositeControls = function() {
		this._oToolbar.removeAllContent();
		this._initCustomToolbarInfo();
	};
	
	Toolbar.prototype._resolvePositions = function() {
		if (this._oToolbarScheme) {
			jQuery.each(this._oToolbarScheme.getMetadata().getAllProperties(), function (sProperty) {
				if (sProperty !== "key" && sProperty !== "toolbarDesign") {
					var oProperty = this._oToolbarScheme.getProperty(sProperty);
					if (oProperty) {
						var oPosition = this._parsePosition(oProperty.getPosition());
						this._oItemConfiguration[oPosition.position][oPosition.idx] = $.extend({}, {groupId: sProperty}, oProperty);
					}
				}
			}.bind(this));
			
			var oSchemeConfiguration = this._oItemConfiguration;
			var aAlignments = Object.keys(oSchemeConfiguration);
			aAlignments.forEach(function(sAlignmentKey) {
				var aSchemes = oSchemeConfiguration[sAlignmentKey],
					newSchemes = [];
				
				var aSchemeSortedKeys = Object.keys(aSchemes).sort();
				aSchemeSortedKeys.forEach(function(sSchemeKey, aSelf) {
					newSchemes.push(aSchemes[sSchemeKey]);
				});
				
				oSchemeConfiguration[sAlignmentKey] = newSchemes;
			});
		}
		
	};

	Toolbar.prototype._parsePosition = function(sPosition) {
		return {
			position: sPosition.toUpperCase().substr(0, 1) === "L" ? Toolbar.ToolbarItemPosition.Left : Toolbar.ToolbarItemPosition.Right,
			idx: parseInt(sPosition.substr(1, sPosition.length - 1), 10)
		};
	};

	Toolbar.prototype._createCompositeControl = function(sPosition, iIndex, oGroupConfig) {
		var vControl;
		switch (oGroupConfig.groupId) {
			case "sourceSelect":
				vControl = this._genSourceSelectGroup(oGroupConfig);
				break;
			case "layout":
				vControl = this._genLayoutGroup(oGroupConfig);
				break;
			case "expandChart":
				vControl = this._genExpandChartGroup(oGroupConfig);
				break;
			case "expandTree":
				vControl = this._genExpandTreeGroup(oGroupConfig);
				break;
			case "customToolbarItems":
				vControl = this._genCustomToolbarItemGroup(sPosition, oGroupConfig);
				break;
			case "mode":
				vControl = this._genModeButtonGroup(oGroupConfig);
				break;
			case "timeZoom":
				vControl = this._genZoomSliderGroupControls(oGroupConfig);
				break;
			case "legend":
				vControl = this._genLegend(oGroupConfig);
				break;
			case "settings":
				vControl = this._genSettings(oGroupConfig);
				break;
			default:
				break;
		}
		if (vControl) {
			this._oAllCustomItems[sPosition] = this._oAllCustomItems[sPosition].concat(vControl);
		}
	};

	Toolbar.prototype._genSourceSelectGroup = function(oGroupConfig) {
		var sSourceId = this.getSourceId();
		// that is toolbar itself
		var that = this;
		var aSource;

		this._oSourceSelectBox = new Select({
			layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
			width: "200px",
			change: function (oEvent) {
				var oItem = oEvent.getParameter("selectedItem");
				var oSourceConfig = oItem.oSourceConfig;
				that.fireSourceChange({
					id: oItem.getKey(),
					config: oSourceConfig
				});
			}
		});

		switch (this.getType()){
			case sap.gantt.control.ToolbarType.Global:
				aSource = this.getContainerLayouts();
				this._oSourceSelectBox.setTooltip(this._oRb.getText("TLTP_GLOBAL_HIERARCHY_RESOURCES"));
				break;
			case sap.gantt.control.ToolbarType.Local:
				aSource = this.getHierarchies();
				this._oSourceSelectBox.setTooltip(this._oRb.getText("TLTP_LOCAL_HIERARCHY_RESOURCES"));
				break;
			default:
				return null;
		}

		var oCoreItem;
		for (var iIndex = 0; iIndex < aSource.length; iIndex++) {
			oCoreItem = new CoreItem({
				key: aSource[iIndex].getKey(),
				text: aSource[iIndex].getText()
			});
			oCoreItem.oSourceConfig = aSource[iIndex];
			this._oSourceSelectBox.addItem(oCoreItem);

			if (oCoreItem.getKey() === sSourceId) {
				this._oSourceSelectBox.setSelectedItem(oCoreItem);
			}
		}

		return this._oSourceSelectBox;
	};

	Toolbar.prototype._genLayoutGroup = function(oGroupConfig) {
		if (this.getType === "LOCAL") {
			return null;
		}

		var that = this,
			aHierarchies = this.getHierarchies(),
			oCoreItem,
			i;

		// addGanttChart Select
		this._oAddGanttChartSelect = new Select({
			icon : "sap-icon://add",
			type: sap.m.SelectType.IconOnly,
			autoAdjustWidth: true,
			tooltip: this._oRb.getText("TLTP_ADD_GANTTCHART"),
			forceSelection: false,
			layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
			change: function (oEvent) {
				if (oEvent.getParameter("selectedItem")) {
					that.fireLayoutChange({
						id: "add",
						value: {
							hierarchyKey: oEvent.getParameter("selectedItem").getKey(),
							hierarchyConfig: oEvent.getParameter("selectedItem").data("hierarchyConfig")
						}
					});
					oEvent.getSource().setSelectedItemId("");
				}
			}
		});
		// add items if exist
		if (aHierarchies && aHierarchies.length > 0) {
			for (i = 0; i < aHierarchies.length; i++) {
				oCoreItem = new CoreItem({
					text: aHierarchies[i].getText(),
					key: aHierarchies[i].getKey()
				});
				oCoreItem.data("hierarchyConfig", aHierarchies[i]);
				this._oAddGanttChartSelect.addItem(oCoreItem);
			}
		}

		// lessGanttChartSelect
		this._oLessGanttChartSelect = new Select({
			icon: "sap-icon://less",
			type: sap.m.SelectType.IconOnly,
			tooltip: this._oRb.getText("TLTP_REMOVE_GANTTCHART"),
			autoAdjustWidth: true,
			forceSelection: false,
			layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
			change: function (oEvent) {
				if (oEvent.getParameter("selectedItem")) {
					that.fireLayoutChange({
						id: "less",
						value: {
							hierarchyKey: oEvent.getParameter("selectedItem").getKey(),
							hierarchyConfig: oEvent.getParameter("selectedItem").data("hierarchyConfig"),
							ganttChartIndex: oEvent.getParameter("selectedItem").data("ganttChartIndex")
						}
					});
				}
			}
		});
		this._oLessGanttChartSelect.addEventDelegate({
			onclick: this._fillLessGanttChartSelectItem
		}, this);

		// VH Layout Button
		var sIcon = this._oContainerLayoutConfigMap[this.getSourceId()].getOrientation() === Orientation.Vertical ?
				"sap-icon://resize-vertical" : "sap-icon://resize-horizontal";
		this._oVHButton = new Button({
			icon: sIcon,
			tooltip: this._oRb.getText("TLTP_SWITCH_GANTTCHART"),
			type: oGroupConfig.getEnableRichStyle() ? ButtonType.Emphasized : ButtonType.Default,
			layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
			press: function (oEvent) {
				switch (this.getIcon()){
					case "sap-icon://resize-vertical":
						this.setIcon("sap-icon://resize-horizontal");
						that.fireLayoutChange({
							id: "orientation",
							value: Orientation.Horizontal
						});
						break;
					case "sap-icon://resize-horizontal":
						this.setIcon("sap-icon://resize-vertical");
						that.fireLayoutChange({
							id: "orientation",
							value: Orientation.Vertical
						});
						break;
					default:
						break;
				}
			}
		});

		// Segmented Button
		this._oLayoutButton = [this._oAddGanttChartSelect, this._oLessGanttChartSelect, this._oVHButton];

		return this._oLayoutButton;
	};
	
	Toolbar.prototype._fillLessGanttChartSelectItem = function () {
		var aGanttCharts = this.data("holder").getGanttCharts(),
			oItem;

		this._oLessGanttChartSelect.removeAllItems();
		if (aGanttCharts && aGanttCharts.length > 0) {
			for (var i = 0; i < aGanttCharts.length; i++) {
				oItem = new CoreItem({
					text: this._oHierarchyConfigMap[aGanttCharts[i].getHierarchyKey()].getText(),
					key: aGanttCharts[i].getHierarchyKey()
				});
				oItem.data("hierarchyConfig",
						this._oHierarchyConfigMap[aGanttCharts[i].getHierarchyKey()]);
				oItem.data("ganttChartIndex", i);
				this._oLessGanttChartSelect.insertItem(oItem, i);
			}
		}
	};

	Toolbar.prototype._genExpandChartGroup = function (oGroupConfig) {
		this._aChartExpandButtons = [];

		var fnPressEventHanlder =  function(oEvent) {
			this.fireExpandChartChange({
				isExpand: oEvent.getSource().data("isExpand"),
				expandedChartSchemes: oEvent.getSource().data("chartSchemeKeys")
			});
		};

		var aExpandChartButtonConfig = oGroupConfig.getExpandCharts(),
			oButton;
		for (var i = 0; i < aExpandChartButtonConfig.length; i++) {
			var oConfig = aExpandChartButtonConfig[i];
			
			oButton = new Button({
				icon: oConfig.getIcon(),
				tooltip: oConfig.getTooltip(),
				layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
				press: fnPressEventHanlder.bind(this),
				type: oGroupConfig.getEnableRichType() && oConfig.getIsExpand() ?
						ButtonType.Emphasized : ButtonType.Default,
				customData : [
					new sap.ui.core.CustomData({
						key : "isExpand",
						value : oConfig.getIsExpand()
					}),
					new sap.ui.core.CustomData({
						key : "chartSchemeKeys",
						value : oConfig.getChartSchemeKeys()
					})
				]
			});
			if (oGroupConfig.getShowArrowText()) {
				oButton.setText(oConfig.getIsExpand() ? "ꜜ" : "ꜛ");
				//"￬" : "￪",// "⬇" : "⬆",//"⤓" : "⤒",//"⇊" : "⇈",//"↓" : "↑", //"⇩" : "⇧"
			}
			this._aChartExpandButtons.push(oButton);
		}
		return this._aChartExpandButtons;
	};

	Toolbar.prototype._genCustomToolbarItemGroup = function (sPosition, oGroupConfig) {

		if (this._iCustomItemInsertIndex === -1) {
			// Because the order had been sorted, the position for the custom tool bar item
			// is right after the previous items.
			var iTotalBeforeLength = this._oAllCustomItems[sPosition].length;
			if (iTotalBeforeLength === 0) {
				// If there is no item at all before custom items, set the cursor to -1
				// It's not only an index but also a flag to indicate the current situation.
				this._iCustomItemInsertIndex = -1;
			} else {
				// Otherwise, the position is the end of the previous items.
				this._iCustomItemInsertIndex = iTotalBeforeLength - 1;
			}
		}
		return this._aCustomItems;
	};

	Toolbar.prototype._genExpandTreeGroup = function (oGroupConfig) {
		var that = this; // tool bar itself
		this._oTreeGroup = [new Button({
				icon: "sap-icon://expand",
				tooltip: this._oRb.getText("TLTP_EXPAND"),
				layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
				press: function (oEvent) {
					that.fireExpandTreeChange({
						action: "expand"
					});
				}
			}), new Button({
				icon: "sap-icon://collapse",
				tooltip: this._oRb.getText("TLTP_COLLAPSE"),
				layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
				press: function (oEvent) {
					that.fireExpandTreeChange({
						action: "collapse"
					});
				}
			})];
		return this._oTreeGroup;
	};

	Toolbar.prototype._genModeButtonGroup = function (oGroupConfig) {
		var fnModeButtonGroupSelectHandler = function(oEvent) {
			var selected = oEvent.getParameter("button");
			this.fireModeChange({
				mode: selected.data("mode")
			});
		};
		this._oModeSegmentButton = new SegmentedButton({select: fnModeButtonGroupSelectHandler.bind(this)});
		this._oModeButtonMap = {};	
		var fnJqueryeachFunction =  function (iIndex, sMode) {
			if (this._oModesConfigMap[sMode]) {
				var oButton = new Button({
					icon: this._oModesConfigMap[sMode].getIcon(),
					activeIcon: this._oModesConfigMap[sMode].getActiveIcon(),
					tooltip: this._oModesConfigMap[sMode].getText(),
					layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
					customData : [
						new sap.ui.core.CustomData({
							key : "mode",
							value : sMode
						})
					]
				});
				this._oModeButtonMap[sMode] = oButton;
				this._oModeSegmentButton.addButton(oButton);
			}
		};
		jQuery.each(oGroupConfig.getModeKeys(), fnJqueryeachFunction.bind(this));
		if (this._sInitMode) {
			this._oModeSegmentButton.setSelectedButton(this._oModeButtonMap[this._sInitMode]);
		}
		return this._oModeSegmentButton;
	};


	Toolbar.prototype._genZoomSliderGroupControls = function (oGroupConfig) {
		

		var oLayoutData = new OverflowToolbarLayoutData({
			priority: oGroupConfig.getOverflowPriority()
		});

		var fnCalculateZoomRate = function(fSliderValue) {
			return Math.pow(Math.E, fSliderValue);
		};

		var fnFireZoomRateChange = function(fZoomRate) {
			jQuery.sap.clearDelayedCall(this._iLiveChangeTimer);
			this._iLiveChangeTimer = -1;

			var fLastZoomRate = this.getZoomRate();
			this.setProperty("zoomRate", fZoomRate);
			if (fZoomRate === fLastZoomRate) {
				return ;
			}

			this.fireZoomRateChange({ zoomRate: fZoomRate });
			jQuery.sap.log.debug("Toolbar Zoom Rate was changed, zoomRate is: " + fZoomRate);
		};

		var oZoomSlider = new Slider({
			width: "200px",
			layoutData: oLayoutData,
			liveChange: function(oEvent) {
				var fZoomRate = fnCalculateZoomRate(oEvent.getSource().getValue());
				// Clear the previous accumulated event
				jQuery.sap.clearDelayedCall(this._iLiveChangeTimer);
				this._iLiveChangeTimer = jQuery.sap.delayedCall(200, this, fnFireZoomRateChange, [fZoomRate]);
			}.bind(this)
		});

		var fnZoomButtonPressHandler = function(bZoomIn) {
			return function(oEvent){
				var fZoomRate = 0.0, 
					sSliderValue = 0.0;
				if (bZoomIn) {
					sSliderValue = this._oZoomSlider.stepUp(1).getValue();
				} else {
					sSliderValue = this._oZoomSlider.stepDown(1).getValue();
				}
				fZoomRate = fnCalculateZoomRate(sSliderValue);
				this._oZoomSlider.setValue(Math.log(fZoomRate));

				this._iLiveChangeTimer = jQuery.sap.delayedCall(200, this, fnFireZoomRateChange, [fZoomRate]);
			};
		};

		var oZoomInButton = new sap.m.Button({
			icon: "sap-icon://zoom-in",
			tooltip: this._oRb.getText("TLTP_SLIDER_ZOOM_IN"),
			layoutData: oLayoutData.clone(),
			press: fnZoomButtonPressHandler(true /**bZoomIn*/).bind(this)
		});

		var oZoomOutButton = new Button({
			icon: "sap-icon://zoom-out",
			tooltip: this._oRb.getText("TLTP_SLIDER_ZOOM_OUT"),
			layoutData: oLayoutData.clone(),
			press: fnZoomButtonPressHandler(false /**bZoomIn*/).bind(this)
		});
		this._oZoomSlider = oZoomSlider;
		return [oZoomInButton, oZoomSlider, oZoomOutButton];
	};

	Toolbar.prototype._genLegend = function (oGroupConfig) {
		if (!this._oLegendPop) {
			this._oLegendPop = new Popover({
				placement: PlacementType.Bottom,
				showArrow: false,
				showHeader: false
			});
		}

		if (this.getLegend()) {
			this._oLegendPop.removeAllContent();
			this._oLegendPop.addContent(this.getLegend());
		}
		
		this._oLegendButton = new Button({
			icon: "sap-icon://legend",
			tooltip: this._oRb.getText("TLTP_SHOW_LEGEND"),
			layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
			press: function (oEvent) {
				var oLegendPop = this._oLegendPop;
				if (oLegendPop.isOpen()){
					oLegendPop.close();
				} else {
					oLegendPop.openBy(this._oLegendButton);
				}
			}.bind(this)
		});
		return this._oLegendButton;
	};

	Toolbar.prototype._genSettings = function (oGroupConfig) {
		var aSettingGroupItems = oGroupConfig.getItems() || [];

		var that = this;

		var aAllSettingItems = aSettingGroupItems.map(function(oGroupItem){
			return new CheckBox({
				name: oGroupItem.getKey(),
				text: oGroupItem.getDisplayText(),
				tooltip: oGroupItem.getTooltip(),
				selected: oGroupItem.getChecked()
			}).addStyleClass("sapUiSettingBoxItem");
		});

		// Need set the old setting state on the toolbar instance for reference
		this._aOldSettingState = aAllSettingItems.map(function(oItem){
			return oItem.getSelected();
		});
		
		this._setSettingItemStates(aAllSettingItems);
		
		this._oSettingsBox = new FlexBox({
			direction: FlexDirection.Column,
			items: aAllSettingItems
		}).addStyleClass("sapUiSettingBox");

		this._oSettingsDialog = new ViewSettingsDialog({
			title: this._oRb.getText("SETTINGS_DIALOG_TITLE"),
			customTabs: [new ViewSettingsCustomTab({content: this._oSettingsBox})],
			confirm: function() {
				var aSettingItems = /*that.aSharedSettingItemStatus ? 
						that.aSharedSettingItemStatus : */this._oSettingsBox.getItems();
				var parameters = [];
				for (var i = 0; i < aSettingItems.length; i++) {
					parameters.push({
						id: aSettingItems[i].getName(),
						value: aSettingItems[i].getSelected()
					});
					that._aOldSettingState[i] = aSettingItems[i].getSelected();
				}
				//store the custom setting item status in toolbar to keep the data consistency when switching views
				that.aCustomSettingItems = that._getCustomSettingItems(aSettingItems);
				this.fireSettingsChange(parameters);
			}.bind(this),
			cancel: function() {
				// when cancel, the selected state should be restored when reopen
				that._setSettingItemStates(aAllSettingItems);
				that._restoreCustomOldStates(aAllSettingItems);
			}
		});
		
		this._oSettingsButton = new Button({
			icon: "sap-icon://action-settings",
			tooltip: this._oRb.getText("TLTP_CHANGE_SETTINGS"),
			layoutData: new OverflowToolbarLayoutData({priority: oGroupConfig.getOverflowPriority()}),
			press: function (oEvent) {
				this._oSettingsDialog.open();
			}.bind(this)
		});

		return this._oSettingsButton;
	};
	
	Toolbar.prototype._setSettingItemStates = function (aAllSettingItems) {
		for (var i = 0; i < aAllSettingItems.length; i++) {
			switch (aAllSettingItems[i].getName()) {
			case sap.gantt.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY:
				aAllSettingItems[i].setSelected(this.getEnableNowLine());
				break;
			case sap.gantt.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY:
				aAllSettingItems[i].setSelected(this.getEnableCursorLine());
				break;
			case sap.gantt.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY:
				aAllSettingItems[i].setSelected(this.getEnableVerticalLine());
				break;
			case sap.gantt.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY:
				aAllSettingItems[i].setSelected(this.getEnableTimeScrollSync());
				break;
			case sap.gantt.config.SETTING_ITEM_ROW_SCROLL_SYNC_KEY:
				aAllSettingItems[i].setSelected(this.getEnableRowScrollSync());
				break;
			default:
				this._handleCustomSettingItemStates(aAllSettingItems[i]);
				break;
			}
		}
	};
	//need to loop and find custom setting items and set them here
	Toolbar.prototype._handleCustomSettingItemStates = function (settingItem) {
		if (this.aCustomSettingItems && this.aCustomSettingItems.length > 0) {
			for (var j = 0; j < this.aCustomSettingItems.length; j++) {
				if (settingItem.getName() === this.aCustomSettingItems[j].getName()) {
					settingItem.setSelected(this.aCustomSettingItems[j].getSelected());
					break;
				}
			}
		}
	};
	//need to restore the old custom setting item status if canceled.
	Toolbar.prototype._restoreCustomOldStates = function (aAllSettingItems) {
		var settingItemLength = sap.gantt.config.DEFAULT_TOOLBAR_SETTING_ITEMS.length;
		for (var i = settingItemLength; i < aAllSettingItems.length; i++){
			aAllSettingItems[i].setSelected(this._aOldSettingState[i]);
		}

	};
	
	Toolbar.prototype._getCustomSettingItems = function (aSettingItems) {
		var customSettingItems = [];
		var settingItemLength = sap.gantt.config.DEFAULT_TOOLBAR_SETTING_ITEMS.length;
		for (var i = settingItemLength; i < aSettingItems.length; i++){
			customSettingItems.push(aSettingItems[i]);
		}
		return customSettingItems;
	};

	Toolbar.prototype.getToolbarSchemeKey = function () {
		return this._sToolbarSchemeKey;
	};
	
	Toolbar.prototype.setEnableNowLine = function(bEnableNowLine) {
		this.setProperty("enableNowLine", bEnableNowLine);
		if (this._oSettingsBox && this._oSettingsBox.getItems().length > 0) {
			this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY, bEnableNowLine);
		}
		return this;
	};
	
	Toolbar.prototype.setEnableCursorLine = function(bEnableCursorLine) {
		this.setProperty("enableCursorLine", bEnableCursorLine);
		if (this._oSettingsBox && this._oSettingsBox.getItems().length > 0) {
			this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY, bEnableCursorLine);
		}
		return this;
	};
	
	Toolbar.prototype.setEnableVerticalLine = function(bEnableVerticalLine) {
		this.setProperty("enableVerticalLine", bEnableVerticalLine);
		if (this._oSettingsBox && this._oSettingsBox.getItems().length > 0) {
			this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY, bEnableVerticalLine);
		}
		return this;
	};
	
	Toolbar.prototype.setEnableRowScrollSync = function(bEnableRowScrollSync) {
		this.setProperty("enableRowScrollSync", bEnableRowScrollSync);
		if (this._oSettingsBox && this._oSettingsBox.getItems().length > 0) {
			this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ROW_SCROLL_SYNC_KEY, bEnableRowScrollSync);
		}
		return this;
	};
	
	Toolbar.prototype.setEnableTimeScrollSync = function(bEnableTimeScrollSync) {
		this.setProperty("enableTimeScrollSync", bEnableTimeScrollSync);
		if (this._oSettingsBox && this._oSettingsBox.getItems().length > 0) {
			this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY, bEnableTimeScrollSync);
		}
		return this;
	};
	
	Toolbar.prototype._setSettingItemProperties = function(settingItemKey, settingItemStatus) {
		var settingItems = this._oSettingsBox.getItems();
		for (var i = 0; i < settingItems.length; i++) {
			if (settingItems[i].getName() === settingItemKey) {
				settingItems[i].setSelected(settingItemStatus);
				break;
			}	
		}
	};

	Toolbar.prototype.exit = function () {
		if (this._oLegendPop) {
			this._oLegendPop.destroy(false);
		}
		if (this._oSettingsPop) {
			this._oSettingsPop.destroy(false);
		}
	};

	return Toolbar;
}, true);
