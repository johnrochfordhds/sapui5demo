/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides FilterController
sap.ui.define([
	'jquery.sap.global', './BaseController', 'sap/m/library', './Util', './ChartWrapper'
], function(jQuery, BaseController, library, Util, ChartWrapper) {
	"use strict";

	/**
	 * The FilterController can be used to...
	 * 
	 * @class Table Personalization Controller
	 * @extends sap.ui.comp.personalization.BaseController
	 * @author SAP
	 * @version 1.25.0-SNAPSHOT
	 * @alias sap.ui.comp.personalization.FilterController
	 */
	var FilterController = BaseController.extend("sap.ui.comp.personalization.FilterController",
	/** @lends sap.ui.comp.personalization.FilterController */
	{
		constructor: function(sId, mSettings) {
			BaseController.apply(this, arguments);
			this.setType(sap.m.P13nPanelType.filter);
		},
		metadata: {
			events: {
				afterFilterModelDataChange: {}
			}
		}
	});

	FilterController.prototype.setTable = function(oTable) {
		BaseController.prototype.setTable.apply(this, arguments);

		if (oTable instanceof sap.ui.table.Table) {
			oTable.detachFilter(this._onFilter, this);
			oTable.attachFilter(this._onFilter, this);
		}
		if (oTable instanceof ChartWrapper) {
			var oChart = oTable.getChartObject();
			oChart.detachDrilledDown(this._onDrilledDown, this);
			oChart.attachDrilledDown(this._onDrilledDown, this);
			oChart.detachDrilledUp(this._onDrilledUp, this);
			oChart.attachDrilledUp(this._onDrilledUp, this);
		}
	};

	FilterController.prototype.getTitleText = function() {
		return sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("PERSODIALOG_TAB_FILTER");
	};

	sap.ui.comp.personalization.FilterController.prototype._getTable2Json = function() {
		var oJsonData = this.createPersistentStructure();
		var oTable = this.getTable();
		if (oTable) {
			// This is not complete but the best we can do - problem is that the filter is not extractable from other table instances.
			if (oTable instanceof sap.ui.table.Table) {
				oTable.getColumns().forEach(function(oColumn) {
					if (Util.isColumnIgnored(oColumn, this.getIgnoreColumnKeys())) {
						return;
					}
					if (oColumn.getFiltered()) {
						// Note: value2 is not supported by sap.ui.table.Column yet
						oJsonData.filter.filterItems.push({
							columnKey: Util.getColumnKey(oColumn),
							operation: oColumn.getFilterOperator(),
							value1: oColumn.getFilterValue(),
							value2: "" // The Column API does not provide method for 'value2'
						});
					}
				}, this);
			}
		}
		return oJsonData;
	};

	FilterController.prototype.syncTable2TransientModel = function() {
		var oTable = this.getTable();
		var aItems = [];

		if (oTable) {
			var aBoolean, aValues, oBoolType;

			if (oTable.getModel() instanceof sap.ui.model.odata.ODataModel || oTable.getModel() instanceof sap.ui.model.odata.v2.ODataModel) {
				jQuery.sap.require("sap.ui.model.odata.type.Boolean");
				oBoolType = new sap.ui.model.odata.type.Boolean();
			} else {
				if (oTable.getModel() instanceof sap.ui.model.Model) {
					jQuery.sap.require("sap.ui.model.type.Boolean");
					oBoolType = new sap.ui.model.type.Boolean();
				}
			}

			if (oBoolType) {
				aBoolean = [
					"", oBoolType.formatValue(false, "string"), oBoolType.formatValue(true, "string")
				];
			}

			if (oTable instanceof sap.ui.table.Table) {
				oTable.getColumns().forEach(function(oColumn) {
					if (Util.isColumnIgnored(oColumn, this.getIgnoreColumnKeys())) {
						return;
					}
					if (Util.isFilterable(oColumn)) {
						if (Util.getColumnType(oColumn) === "boolean") {
							aValues = Util._getCustomProperty(oColumn, "values") || aBoolean;
						}
						aItems.push({
							columnKey: Util.getColumnKey(oColumn),
							text: oColumn.getLabel().getText(),
							tooltip: (oColumn.getTooltip() instanceof sap.ui.core.TooltipBase) ? oColumn.getTooltip().getTooltip_Text() : oColumn.getTooltip_Text(),
							maxLength: Util._getCustomProperty(oColumn, "maxLength"),
							precision: Util._getCustomProperty(oColumn, "precision"),
							scale: Util._getCustomProperty(oColumn, "scale"),
							type: Util.getColumnType(oColumn),
							values: aValues
						});
					}
				}, this);
			} else if (oTable instanceof sap.m.Table) {
				oTable.getColumns().forEach(function(oColumn) {
					if (Util.isColumnIgnored(oColumn, this.getIgnoreColumnKeys())) {
						return;
					}
					if (Util.getColumnType(oColumn) === "boolean") {
						aValues = Util._getCustomProperty(oColumn, "values") || aBoolean;
					}
					if (Util.isFilterable(oColumn)) {
						aItems.push({
							columnKey: Util.getColumnKey(oColumn),
							text: oColumn.getHeader().getText(),
							tooltip: (oColumn.getHeader().getTooltip() instanceof sap.ui.core.TooltipBase) ? oColumn.getHeader().getTooltip().getTooltip_Text() : oColumn.getHeader().getTooltip_Text(),
							maxLength: Util._getCustomProperty(oColumn, "maxLength"),
							precision: Util._getCustomProperty(oColumn, "precision"),
							scale: Util._getCustomProperty(oColumn, "scale"),
							type: Util.getColumnType(oColumn),
							values: aValues
						});
					}
				}, this);
			} else if (oTable instanceof sap.ui.comp.personalization.ChartWrapper) {
				oTable.getColumns().forEach(function(oColumn) {
					if (Util.isColumnIgnored(oColumn, this.getIgnoreColumnKeys())) {
						return;
					}
					if (Util.isFilterable(oColumn)) {
						aItems.push({
							columnKey: Util.getColumnKey(oColumn),
							text: oColumn.getLabel(),
							tooltip: (oColumn.getTooltip() instanceof sap.ui.core.TooltipBase) ? oColumn.getTooltip().getTooltip_Text() : oColumn.getTooltip_Text(),
							maxLength: Util._getCustomProperty(oColumn, "maxLength"),
							precision: Util._getCustomProperty(oColumn, "precision"),
							scale: Util._getCustomProperty(oColumn, "scale"),
							type: Util.getColumnType(oColumn),
							values: aValues
						});
					}
				}, this);
			}
		}

		Util.sortItemsByText(aItems);

		// check if Items was changed at all and take over if it was changed
		var oItemsBefore = this.getModel("$sapuicomppersonalizationBaseController").getData().transientData.filter.items;
		if (jQuery(aItems).not(oItemsBefore).length !== 0 || jQuery(oItemsBefore).not(aItems).length !== 0) {
			this.getModel("$sapuicomppersonalizationBaseController").getData().transientData.filter.items = aItems;
		}
	};

	FilterController.prototype._onFilter = function(oEvent) {
		// TODO: implement this method. Currently SmartTable does not support filtering directly on the table, only via
		// personalization dialog

		// this.fireBeforePotentialTableChange();
		// var oColumn = oEvent.getParameter("column");
		// var sValue = oEvent.getParameter("value");

		// if (!bColumnAdded) {
		// this._sort.sortItems = [];
		// this._sort.sortItems.push({createModelDataFromTable
		// key : "0",
		// columnKey : oColumn.getId(),
		// operation : sSortOrder
		// });
		// }
		// this.fireAfterPotentialTableChange();

		// this.fireAfterFilterModelDataChange();
	};

	FilterController.prototype._onDrilledDown = function(oEvent) {
		this._updateModel(oEvent.getSource());
	};

	FilterController.prototype._onDrilledUp = function(oEvent) {
		this._updateModel(oEvent.getSource());
	};

	FilterController.prototype._updateModel = function(oChart) {
		var oModel = this.getModel("$sapuicomppersonalizationBaseController");
		var oData = oModel.getData();
		var aColumns = this.getTable().getColumns();

		this.fireBeforePotentialTableChange();

		// Remove all 'chart' specific filters
		oData.persistentData.filter.filterItems = oData.persistentData.filter.filterItems.filter(function(oFilterItem) {
			return oFilterItem.source !== "chart";
		});

		// Add all 'chart' specific filters
		oChart.getVisibleDimensions().forEach(function(sDimensionName) {
			this._addSelectedFilterForDimensions(oChart, sDimensionName, oData, aColumns);
		}, this);
		oModel.refresh();

		this.fireAfterPotentialTableChange();

		this.fireAfterFilterModelDataChange();
	};

	FilterController.prototype._addSelectedFilterForDimensions = function(oChart, sSelectedDimension, oData, aColumns) {
		var that = this;
		var fTakeFilters = function(oFilter) {
			if (!oFilter) {
				return;
			}
			if (oFilter && oFilter.sPath && oFilter.sOperator) {
				var oColumn = Util.getColumn(oFilter.sPath, aColumns);
				if (!oColumn) {
					return;
				}
				if (Util.isColumnIgnored(oColumn, that.getIgnoreColumnKeys())) {
					return;
				}
				var oFilterItem = {
					columnKey: oFilter.sPath,
					operation: oFilter.sOperator,
					value1: oFilter.oValue1,
					value2: oFilter.oValue2,
					source: "chart"
				};
				if (that._hasSemanticEqual(oFilterItem, oData.persistentData.filter.filterItems)) {
					return;
				}
				oData.persistentData.filter.filterItems.push(oFilterItem);
			}
			if (oFilter.aFilters) {
				oFilter.aFilters.forEach(function(oFilter_) {
					fTakeFilters(oFilter_);
				});
			}
		};

		oChart._drillStateStack.forEach(function(oStack) {
			if (oStack.dimensions.indexOf(sSelectedDimension) > -1) {
				fTakeFilters(oStack.filter);
			}
		});
	};

	FilterController.prototype._hasSemanticEqual = function(oFilterItem, aFilterItems) {
		if (!oFilterItem || !aFilterItems.length) {
			return false;
		}
		var aEqualFilterItems = aFilterItems.filter(function(oFilterItem_) {
			for ( var property in oFilterItem) {
				if (oFilterItem[property] !== oFilterItem_[property]) {
					return false;
				}
			}
			return true;
		});
		return aEqualFilterItems.length > 0;
	};

	FilterController.prototype._hasTableFilterableColumns = function() {
		var oTable = this.getTable();
		if (!oTable) {
			return false;
		}

		var bHasFiltering = false;
		oTable.getColumns().some(function(oColumn) {
			if (Util.isFilterable(oColumn)) {
				bHasFiltering = true;
				return true;
			}
		});
		return bHasFiltering;
	};

	FilterController.prototype.getPanel = function(oPayload) {

		sap.ui.getCore().loadLibrary("sap.m");

		jQuery.sap.require("sap/m/P13nFilterPanel");
		jQuery.sap.require("sap/m/P13nItem");
		jQuery.sap.require("sap/m/P13nFilterItem");

		if (!this._hasTableFilterableColumns()) {
			return null;
		}
		if (oPayload && oPayload.column) {
			var sColumnKey = Util.getColumnKey(oPayload.column);
			if (sColumnKey) {

				var aItems = this.getModel("$sapuicomppersonalizationBaseController").getData().transientData.filter.items;

				aItems.forEach(function(oItem, iIndex) {
					oItem["isDefault"] = oItem.columnKey === sColumnKey;
				}, this);
			}
		}
		var that = this;
		var oPanel = new sap.m.P13nFilterPanel({
			containerQuery: true,
			title: this.getTitleText(),
			items: {
				path: "$sapmP13nPanel>/transientData/filter/items",
				template: new sap.m.P13nItem({
					columnKey: '{$sapmP13nPanel>columnKey}',
					text: "{$sapmP13nPanel>text}",
					tooltip: "{$sapmP13nPanel>tooltip}",
					maxLength: "{$sapmP13nPanel>maxLength}",
					precision: "{$sapmP13nPanel>precision}",
					scale: "{$sapmP13nPanel>scale}",
					type: "{$sapmP13nPanel>type}",
					isDefault: "{$sapmP13nPanel>isDefault}",
					values: "{$sapmP13nPanel>values}"
				})
			},
			filterItems: {
				path: "$sapmP13nPanel>/persistentData/filter/filterItems",
				template: new sap.m.P13nFilterItem({
					key: "{$sapmP13nPanel>key}",
					columnKey: "{$sapmP13nPanel>columnKey}",
					exclude: "{$sapmP13nPanel>exclude}",
					operation: "{$sapmP13nPanel>operation}",
					value1: "{$sapmP13nPanel>value1}",
					value2: "{$sapmP13nPanel>value2}"
				})
			},
			beforeNavigationTo: that.setModelFunction()
		});

		oPanel.attachAddFilterItem(function(oEvent) {
			var oData = this.getModel("$sapuicomppersonalizationBaseController").getData();
			var params = oEvent.getParameters();
			var oFilterItem = {
				columnKey: params.filterItemData.getColumnKey(),
				operation: params.filterItemData.getOperation(),
				exclude: params.filterItemData.getExclude(),
				value1: params.filterItemData.getValue1(),
				value2: params.filterItemData.getValue2()
			};
			if (params.index > -1) {
				oData.persistentData.filter.filterItems.splice(params.index, 0, oFilterItem);
			} else {
				oData.persistentData.filter.filterItems.push(oFilterItem);
			}
			this.getModel("$sapuicomppersonalizationBaseController").setData(oData, true);
		}, this);

		oPanel.attachRemoveFilterItem(function(oEvent) {
			var params = oEvent.getParameters();
			var oData = this.getModel("$sapuicomppersonalizationBaseController").getData();
			if (params.index > -1) {
				oData.persistentData.filter.filterItems.splice(params.index, 1);
				this.getModel("$sapuicomppersonalizationBaseController").setData(oData, true);
			}
		}, this);

		return oPanel;
	};

	// sap.ui.comp.personalization.FilterController.prototype.onBeforeSubmit = function() {
	// };

	FilterController.prototype.syncJsonModel2Table = function(oJsonModel) {
		var oTable = this.getTable();
		var aColumns = oTable.getColumns();
		var aColumnsUnfiltered = jQuery.extend(true, [], aColumns);

		this.fireBeforePotentialTableChange();

		if (oTable instanceof sap.ui.table.Table) {
			oJsonModel.filter.filterItems.forEach(function(oFilterItem) {
				var oColumn = Util.getColumn(oFilterItem.columnKey, aColumns);
				if (oColumn) {
					if (!oColumn.getFiltered()) {
						oColumn.setFiltered(true);
					}
					aColumnsUnfiltered.splice(aColumnsUnfiltered.indexOf(oColumn), 1);
				}
			});

			aColumnsUnfiltered.forEach(function(oColumn) {
				if (oColumn && oColumn.getFiltered()) {
					oColumn.setFiltered(false);
				}
			});
		}

		this.fireAfterPotentialTableChange();
	};

	/**
	 * Operations on filter are processed sometime directly at the table and sometime not. In case that something has been changed via Personalization
	 * Dialog the consumer of the Personalization Dialog has to apply filtering at the table. In case that filter has been changed via user
	 * interaction at table, the change is instantly applied at the table.
	 */
	FilterController.prototype.getChangeType = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataCompare || !oPersistentDataCompare.filter || !oPersistentDataCompare.filter.filterItems) {
			return sap.ui.comp.personalization.ChangeType.Unchanged;
		}

		if (oPersistentDataCompare && oPersistentDataCompare.filter && oPersistentDataCompare.filter.filterItems) {
			oPersistentDataCompare.filter.filterItems.forEach(function(oFilterItem) {
				delete oFilterItem.key;
				delete oFilterItem.source;
			});
		}
		if (oPersistentDataBase && oPersistentDataBase.filter && oPersistentDataBase.filter.filterItems) {
			oPersistentDataBase.filter.filterItems.forEach(function(oFilterItem) {
				delete oFilterItem.key;
				delete oFilterItem.source;
			});
		}
		var bIsDirty = JSON.stringify(oPersistentDataBase.filter.filterItems) !== JSON.stringify(oPersistentDataCompare.filter.filterItems);

		return bIsDirty ? sap.ui.comp.personalization.ChangeType.ModelChanged : sap.ui.comp.personalization.ChangeType.Unchanged;
	};

	/**
	 * Result is XOR based difference = CurrentModelData - oPersistentDataCompare
	 * 
	 * @param {object} oPersistentDataCompare JSON object. Note: if sortItems is [] then it means that all sortItems have been deleted
	 * @returns {object} JSON object or null
	 */
	FilterController.prototype.getChangeData = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataBase || !oPersistentDataBase.filter || !oPersistentDataBase.filter.filterItems) {
			return this.createPersistentStructure();
		}

		if (oPersistentDataCompare && oPersistentDataCompare.filter && oPersistentDataCompare.filter.filterItems) {
			oPersistentDataCompare.filter.filterItems.forEach(function(oFilterItem) {
				delete oFilterItem.key;
				delete oFilterItem.source;
			});
		}
		if (oPersistentDataBase && oPersistentDataBase.filter && oPersistentDataBase.filter.filterItems) {
			oPersistentDataBase.filter.filterItems.forEach(function(oFilterItem) {
				delete oFilterItem.key;
				delete oFilterItem.source;
			});
		}

		if (!oPersistentDataCompare || !oPersistentDataCompare.filter || !oPersistentDataCompare.filter.filterItems) {
			return {
				filter: Util.copy(oPersistentDataBase.filter)
			};
		}

		if (JSON.stringify(oPersistentDataBase.filter.filterItems) !== JSON.stringify(oPersistentDataCompare.filter.filterItems)) {
			return {
				filter: Util.copy(oPersistentDataBase.filter)
			};
		}
		return null;
	};

	/**
	 * @param {object} oPersistentDataBase: JSON object to which different properties from JSON oPersistentDataCompare are added
	 * @param {object} oPersistentDataCompare: JSON object from where the different properties are added to oPersistentDataBase. Note: if filterItems
	 *        is [] then it means that all filterItems have been deleted
	 * @returns {object} JSON object as union result of oPersistentDataBase and oPersistentDataCompare
	 */
	FilterController.prototype.getUnionData = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataBase || !oPersistentDataBase.filter || !oPersistentDataBase.filter.filterItems) {
			return this.createPersistentStructure();
		}

		if (!oPersistentDataCompare || !oPersistentDataCompare.filter || !oPersistentDataCompare.filter.filterItems) {
			return {
				filter: Util.copy(oPersistentDataBase.filter)
			};
		}

		return {
			filter: Util.copy(oPersistentDataCompare.filter)
		};
	};

	/**
	 * Cleans up before destruction.
	 * 
	 * @private
	 */
	FilterController.prototype.exit = function() {
		BaseController.prototype.exit.apply(this, arguments);

		var oTable = this.getTable();
		if (oTable && oTable instanceof sap.ui.table.Table) {
			oTable.detachFilter(this._onFilter, this);
		}
		if (oTable && oTable instanceof ChartWrapper) {
			var oChart = oTable.getChartObject();
			oChart.detachDrilledDown(this._onDrilledDown, this);
			oChart.detachDrilledUp(this._onDrilledUp, this);
		}
	};

	return FilterController;

}, /* bExport= */true);
