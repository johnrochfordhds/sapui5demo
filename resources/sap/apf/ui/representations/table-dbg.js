/* SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.table");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require('sap.apf.ui.utils.formatter');
jQuery.sap.require("sap.apf.ui.representations.BaseUI5ChartRepresentation");
(function() {
	'use strict';
	//select the items in the table which are passed as parameter
	function _selectItemsInTable(aSelectedItems) {
		oTableWithoutHeaders.removeSelections();// remove all the selections , so that older values are not retained
		aSelectedItems.forEach(function(item) {
			oTableWithoutHeaders.setSelectedItem(item);
		});
	}
	//clear the filters from the UI5Charthelper and also from APF filters
	function _clearFilters(oTableInstance) {
		oTableInstance.UI5ChartHelper.filterValues = [];
		oTableInstance.setFilter(oTableInstance.oApi.createFilter());
	}
	//creates the filter values from the filters
	function _getFilterTremsFromTableSelection(oTableInstance) {
		var sRequiredFilterProperty = oTableInstance.getFilter().getInternalFilter().getProperties()[0]; // read the required property in the table
		var aFilterTerms = oTableInstance.getFilter().getInternalFilter().getFilterTermsForProperty(sRequiredFilterProperty); //read the filter terms
		var aFilterValues = aFilterTerms.map(function(term) {
			return term.getValue();
		});
		return aFilterValues;
	}
	//read the filters and select the rows in table. Also read the selected items where selection is enabled, creates the filters from selections
	function _drawSelection(oEvent) {
		var aFilterValues = [], sRequiredFilterProperty;
		var aCurrentSelectedItem = oEvent.getParameters("listItems").listItems; // store the current selected item for which selection event is triggered
		if (this.UI5ChartHelper) { // if the UI5ChartHelper is available , then only filters would be present
			var aInternalFilters = this.getFilter().getInternalFilter().getProperties();
			aFilterValues = aInternalFilters.length > 0 ? _getFilterTremsFromTableSelection(this) : []; // if there are filters then get the filters or it will be an empty array
			sRequiredFilterProperty = aInternalFilters[0]; // read the required property in the table	
			aFilters = aFilterValues; //update the filters for the table , for the selection count. In case of selection coming from charts
		}
		//enable the selection mode in the table based on the required filter availability
		var selectionMode = this.oParameter.requiredFilters.length > 0 ? "MultiSelect" : "None";
		oTableWithoutHeaders.setMode(selectionMode);
		if (oEvent.getId() === "selectionChange") { //if the explicit selection is made on the table, selectionChanged event is triggered
			var isSelectionChanged = true;// boolean to indicate if the selection changed API is triggered just once 
			var newAddedFilters = [];
			sRequiredFilterProperty = aInternalFilters[0] || this.parameter.requiredFilters[0]; //read the required filter from the internal filter or the required filters (when table is created, the internal filter wont be available)  
			var sCurrentRequiredFilter = aCurrentSelectedItem[0].getBindingContext().getProperty(this.parameter.requiredFilters[0]);//required filter from current selected item
			//toggle the selection in table
			if (aCurrentSelectedItem[0].isSelected()) {
				newAddedFilters.push(sCurrentRequiredFilter); // if new item is selected, add it to the new added filter array
			} else {
				var indexOfToggledItem = aFilterValues.indexOf(sCurrentRequiredFilter);
				if (indexOfToggledItem !== -1) { // if item is deselected, find the index of item and remove it from array
					aFilterValues.splice(indexOfToggledItem, 1);
				}
			}
			aFilterValues = aFilterValues.concat(newAddedFilters.filter(function(item) { // merge the unique filters into an array
				return aFilterValues.indexOf(item) < 0;
			}));
			aFilters = aFilterValues;//update the filters for the table , for the selection count. In case of selection event
			if (isSelectionChanged) { // if the selection has changed and selectionChanged event has to be triggered
				_clearFilters(this); // clear the filters first, so that older values are not retained on the UI5ChartHelper filetr values
				this.filter = this.UI5ChartHelper.getFilterFromSelection(aFilterValues);
				this.oApi.getActiveStep().getSelectedRepresentation().UI5ChartHelper.filterValues = this.UI5ChartHelper.filterValues; // assign the filter values from table to the selected representation 
				this.oApi.selectionChanged(); // trigger the selection change event
			} else {
				isSelectionChanged = true;// make the boolean true, so that the selectionChanges API is triggered
			}
		}
		//read the filter directly in case of updateFinished event
		var aAllSelectionInTable = oEvent.getSource().getItems().filter(function(item) { // selection in table which are based on the result filter values
			var reqFilterValue = item.getBindingContext().getProperty(sRequiredFilterProperty);
			return aFilterValues.indexOf(reqFilterValue) !== -1;
		});
		_selectItemsInTable(aAllSelectionInTable);
	}
	//reads the filters and selects the rows in print of table
	function _drawSelectionForPrint(oTableInstance) {
		var aFilterValues = _getFilterTremsFromTableSelection(oTableInstance);
		var sRequiredFilterProperty = oTableInstance.getFilter().getInternalFilter().getProperties()[0]; // read the required property in the table
		var aSelectedListItems = oPrintTable.getItems().filter(function(item) {
			var reqFilterValue = item.getBindingContext().getProperty(sRequiredFilterProperty);
			return aFilterValues.indexOf(reqFilterValue) !== -1;
		});
		var selectionMode = oTableInstance.oParameter.requiredFilters.length > 0 ? "MultiSelect" : "None";
		oPrintTable.setMode(selectionMode);
		return aSelectedListItems;
	}
	var oFormatter, aFilters, tableFields, tableColumns, isAlternateRepresentation, oTableWithoutHeaders, oTableWithHeaders, oPrintTable, aTableData = [];
	var eventsFired, skipAction, skip, topValue, triggerBool;
	var oTableDataModel = new sap.ui.model.json.JSONModel();
	oTableDataModel.setSizeLimit(10000);
	/**
	 * @class table constructor.
	 * @param oApi,oParameters
	 * defines parameters required for chart such as Dimension/Measures.
	 * @returns table object
	 */
	sap.apf.ui.representations.table = function(oApi, oParameters) {
		this.oParameter = oParameters;
		sap.apf.ui.representations.BaseUI5ChartRepresentation.apply(this, [ oApi, oParameters ]);
		isAlternateRepresentation = oParameters.isAlternateRepresentation;
		this.alternateRepresentation = oParameters.defaultListConfigurationTypeID;
		this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION; //the type is read from step toolbar and step container
		triggerBool = false;
		eventsFired = 0;
		skipAction = 0;
		skip = 0;
		topValue = 10;
		aFilters = [];
		this.aDataResponse = [];// getData in the base class reads the value of data response from this
	};
	sap.apf.ui.representations.table.prototype = Object.create(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype);
	sap.apf.ui.representations.table.prototype.constructor = sap.apf.ui.representations.table;// Set the "constructor" property to refer to table
	/**
	 * @method setData
	 * @param aDataResponse - Response from oData service
	 * @param metadata - Metadata of the oData service
	 * @description Public API which Fetches the data from oData service and updates the selection if present
	 */
	sap.apf.ui.representations.table.prototype.setData = function(aDataResponse, metadata) {
		var self = this;
		if (skipAction === 0) {
			if (triggerBool) { //if pagination is triggered
				aDataResponse.map(function(dataRow) {
					self.aDataResponse.push(dataRow);// for pagination , append the data to the existing data set
				});
				skipAction++;
			} else { //if the data is being loaded for first time
				skip = 0;
				topValue = 100;//initially 100 records should be fetched
				aTableData = [];
				self.aDataResponse = aDataResponse; // For new table, read only 100 data set
			}
		}
		aTableData = self.aDataResponse || [];
		if (!metadata) {
			this.oMessageObject = this.oApi.createMessageObject({
				code : "6004",
				aParameters : [ this.oApi.getTextNotHtmlEncoded("step") ]
			});
			this.oApi.putMessage(this.oMessageObject);
		} else { //if metadata is available
			this.metadata = metadata; // assign the metadata to be used in the table representation
			oFormatter = new sap.apf.ui.utils.formatter({ // formatter for the value formatting
				getEventCallback : this.oApi.getEventCallback.bind(this.oApi),
				getTextNotHtmlEncoded : this.oApi.getTextNotHtmlEncoded
			}, metadata, aDataResponse);
			this.UI5ChartHelper.metadata = metadata;
		}
	};
	/**
	* @method createDataset
	* @description Intantiates the dataset to be consumed by the table
	* Also formats the column value which has to be displayed in the table
	*/
	sap.apf.ui.representations.table.prototype.createDataset = function() {
		tableFields = [];
		tableColumns = {
			name : [],
			value : []
		};
		tableFields = this.oParameter.dimensions.concat(this.oParameter.measures).length ? this.oParameter.dimensions.concat(this.oParameter.measures) : this.oParameter.properties; // read the table properties if available , else Concatenate dimensions & measures
		aTableData = this.getData();
		if (aTableData.length !== 0) {
			for(var i = 0; i < tableFields.length; i++) {
				tableColumns.value[i] = tableFields[i].fieldName;
				var name = "";
				var defaultLabel = this.metadata.getPropertyMetadata(tableFields[i].fieldName).label || this.metadata.getPropertyMetadata(tableFields[i].fieldName).name;
				var sUnitValue = "";
				if (this.metadata !== undefined && this.metadata.getPropertyMetadata(tableFields[i].fieldName).unit !== undefined) {
					var sUnitReference = this.metadata.getPropertyMetadata(tableFields[i].fieldName).unit;
					sUnitValue = this.getData()[0][sUnitReference]; // take value of unit from firts data set
					name = tableFields[i].fieldDesc === undefined || !this.oApi.getTextNotHtmlEncoded(tableFields[i].fieldDesc).length ? defaultLabel + " (" + sUnitValue + ")" : this.oApi.getTextNotHtmlEncoded(tableFields[i].fieldDesc) + " ("
							+ sUnitValue + ")";
					tableColumns.name[i] = name;
				} else {
					tableColumns.name[i] = tableFields[i].fieldDesc === undefined || !this.oApi.getTextNotHtmlEncoded(tableFields[i].fieldDesc).length ? defaultLabel : this.oApi.getTextNotHtmlEncoded(tableFields[i].fieldDesc);
				}
			}
		}
	};
	/**
	* @method getSelectionFromChart
	* @returns the selected items in the table.
	*/
	sap.apf.ui.representations.table.prototype.getSelectionFromChart = function() {
		var aSelection = oTableWithoutHeaders.getSelectedItems();
		return aSelection;
	};
	/**
	* @method getSelections
	* @description This method helps in determining the selection count, text and id of selected data of a representation
	* @returns the filter selections of the current representation.
	*/
	sap.apf.ui.representations.table.prototype.getSelections = function() {
		var aSelection = [];
		if (aFilters) {
			aFilters.forEach(function(filter) {
				aSelection.push({
					id : filter,
					text : filter
				});
			});
		}
		return aSelection;
	};
	/**
	* @method getRequestOptions
	* @description provide optional filter properties for odata request URL such as pagging, sorting etc
	*/
	sap.apf.ui.representations.table.prototype.getRequestOptions = function() {
		if (!triggerBool) {
			topValue = 100;
			skip = 0;
			skipAction = 0;
		}
		var requestObj = {
			paging : {
				top : topValue,
				skip : skip,
				inlineCount : true
			}
		};
		var orderByArray;
		if (this.sortProperty !== undefined) {
			orderByArray = [ {
				property : this.sortProperty,
				descending : this.sortOrderIsDescending
			} ];
			requestObj.orderby = orderByArray;
		} else {
			if (this.getParameter().orderby && this.getParameter().orderby.length) {
				var aOrderbyProps = this.getParameter().orderby.map(function(oOrderby) {
					return {
						property : oOrderby.property,
						descending : !oOrderby.ascending
					};
				});
				requestObj.orderby = aOrderbyProps;
			}
		}
		return requestObj;
	};
	/**
	 * @method getMainContent
	 * @param oStepTitle - title of the main chart
	 * @param width - width of the main chart
	 * @param height - height of the main chart       
	 * @description draws Main chart into the Chart area
	 */
	sap.apf.ui.representations.table.prototype.getMainContent = function(oStepTitle, height, width) {
		var self = this;
		this.createDataset();
		var oMessageObject;
		if (!oStepTitle) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "title", this.oApi.getTextNotHtmlEncoded("step") ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		if (tableFields.length === 0) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "dimensions", oStepTitle ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		if (!aTableData || aTableData.length === 0) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6000",
				aParameters : [ oStepTitle ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		var chartWidth = (width || 1000) + "px";
		var columnCells = [];
		var indexForColumn;
		var fnCellValue = function(index) {
			return function(columnValue) {
				if (self.metadata === undefined) {
					return columnValue;
				} else {
					var formatedColumnValue;
					if (tableColumns.value[index] && columnValue) {
						formatedColumnValue = oFormatter.getFormattedValue(tableColumns.value[index], columnValue);
					}
					if (formatedColumnValue !== undefined) {
						return formatedColumnValue;
					} else {
						return columnValue;
					}
				}
			};
		};
		var tableCellValues;
		for(indexForColumn = 0; indexForColumn < tableColumns.name.length; indexForColumn++) {
			tableCellValues = new sap.m.Text().bindText(tableColumns.value[indexForColumn], fnCellValue(indexForColumn), sap.ui.model.BindingMode.OneWay);
			columnCells.push(tableCellValues);
		}
		var columnsWithHeaders = [], columnsWithoutHeaders = [];
		var columnNameWithHeaders, columnNameWithoutHeaders;
		var indexTableColumn;
		for(indexTableColumn = 0; indexTableColumn < tableColumns.name.length; indexTableColumn++) {
			columnNameWithHeaders = new sap.m.Column({
				header : new sap.m.Text({
					text : tableColumns.name[indexTableColumn]
				})
			});
			columnsWithHeaders.push(columnNameWithHeaders);
			columnNameWithoutHeaders = new sap.m.Column();
			columnsWithoutHeaders.push(columnNameWithoutHeaders);
		}
		// Table with Headers
		oTableWithHeaders = new sap.m.Table({
			headerText : oStepTitle,
			showNoData : false,
			columns : columnsWithHeaders
		}).addStyleClass("tableWithHeaders");
		// Table without Headers (built to get scroll only on the data part)
		oTableWithoutHeaders = new sap.m.Table({
			columns : columnsWithoutHeaders,
			items : {
				path : "/tableData",
				template : new sap.m.ColumnListItem({
					cells : columnCells
				})
			},
			selectionChange : _drawSelection.bind(self)
		});
		oTableDataModel.setData({
			tableData : aTableData
		});
		oTableWithHeaders.setModel(oTableDataModel);
		oTableWithoutHeaders.setModel(oTableDataModel);
		oTableWithoutHeaders.attachUpdateFinished(_drawSelection.bind(self));
		var handleConfirm = function(oEvent) {
			var param = oEvent.getParameters();
			oTableWithoutHeaders.setBusy(true);
			skipAction = 0;
			self.sortProperty = param.sortItem.getKey();
			self.orderby = self.sortOrderIsDescending = param.sortDescending;
			topValue = 100;
			skip = 0;
			var sorter = [];
			if (param.sortItem) {
				if (isAlternateRepresentation) {
					var oTableBinding = oTableWithoutHeaders.getBinding("items");
					sorter.push(new sap.ui.model.Sorter(self.sortProperty, self.sortOrderIsDescending));
					oTableBinding.sort(sorter);
					oTableWithoutHeaders.setBusy(false);
					return;
				}
				self.oApi.updatePath(function(oStep, bStepChanged) {
					if (oStep === self.oApi.getActiveStep()) {
						oTableDataModel.setData({
							tableData : aTableData
						});
						oTableWithoutHeaders.rerender();
						oTableWithoutHeaders.setBusy(false);
					}
				});
			}
		};
		this.viewSettingsDialog = new sap.m.ViewSettingsDialog({// sort of table using ViewSettingsDialog
			confirm : handleConfirm
		});
		var columnIndex;
		for(columnIndex = 0; columnIndex < oTableWithHeaders.getColumns().length; columnIndex++) {
			var oItem = new sap.m.ViewSettingsItem({
				text : tableColumns.name[columnIndex],
				key : tableColumns.value[columnIndex]
			});
			this.viewSettingsDialog.addSortItem(oItem);
		}
		var sortItemIndex;
		if (this.sortProperty === undefined && this.sortOrderIsDescending === undefined) {// Set default values of radio buttons in view settings dialog
			if (this.getParameter().orderby && this.getParameter().orderby.length) {
				for(sortItemIndex = 0; sortItemIndex < this.viewSettingsDialog.getSortItems().length; sortItemIndex++) {
					if (this.getParameter().orderby[0].property === this.viewSettingsDialog.getSortItems()[sortItemIndex].getKey()) {
						this.viewSettingsDialog.setSelectedSortItem(this.viewSettingsDialog.getSortItems()[sortItemIndex]);
						this.viewSettingsDialog.setSortDescending(!this.getParameter().orderby[0].ascending);
					}
				}
			} else {
				this.viewSettingsDialog.setSelectedSortItem(this.viewSettingsDialog.getSortItems()[0]);// by default set the first value in sort field and sort order
				this.viewSettingsDialog.setSortDescending(false);
			}
		} else {
			for(sortItemIndex = 0; sortItemIndex < this.viewSettingsDialog.getSortItems().length; sortItemIndex++) {
				if (this.sortProperty === this.viewSettingsDialog.getSortItems()[sortItemIndex].getKey()) {
					this.viewSettingsDialog.setSelectedSortItem(this.viewSettingsDialog.getSortItems()[sortItemIndex]);
				}
			}
			this.viewSettingsDialog.setSortDescending(this.sortOrderIsDescending);
			var sorter = [];
			if (isAlternateRepresentation) {
				var oTableBinding = oTableWithoutHeaders.getBinding("items");
				sorter.push(new sap.ui.model.Sorter(this.sortProperty, this.sortOrderIsDescending));
				oTableBinding.sort(sorter);
			}
		}
		var fieldIndex;
		if (this.metadata !== undefined) {// aligning amount fields
			for(fieldIndex = 0; fieldIndex < tableColumns.name.length; fieldIndex++) {
				var oMetadata = this.metadata.getPropertyMetadata(tableColumns.value[fieldIndex]);
				if (oMetadata.unit) {
					var amountCol = oTableWithoutHeaders.getColumns()[fieldIndex];
					amountCol.setHAlign(sap.ui.core.TextAlign.Right);
				}
			}
		}
		var scrollContainer = new sap.m.ScrollContainer({// Scroll container for table without headers(to get vertical scroll on  data part used for pagination
			content : oTableWithoutHeaders,
			height : "480px",
			horizontal : false,
			vertical : true
		}).addStyleClass("tableWithoutHeaders");
		var loadMoreLink = new sap.m.Link({
			text : "More"
		}).addStyleClass("loadMoreLink");
		var scrollContainer1 = new sap.m.ScrollContainer({// Scroll container to hold table with headers and scroll container containing table without headers
			content : [ oTableWithHeaders, scrollContainer ],
			width : chartWidth,
			horizontal : true,
			vertical : false
		}).addStyleClass("scrollContainer");
		oTableDataModel.setSizeLimit(10000); // Set the size of data response to 10000 records
		oTableWithHeaders.addEventDelegate({//Event delegate to bind pagination action
			onAfterRendering : function() {
				jQuery(".scrollContainer > div:first-child").css({// For IE-Full width for alternate representation
					"display" : "table",
					"width" : "inherit"
				});
				var scrollContainerHeight;
				if (this.offsetTop === undefined) {
					this.offsetTop = jQuery(".tableWithoutHeaders").offset().top;
				}
				if (jQuery(".tableWithoutHeaders").offset().top !== this.offsetTop) {// fullscreen
					scrollContainerHeight = ((window.innerHeight - jQuery('.tableWithoutHeaders').offset().top)) + "px";
				} else {
					scrollContainerHeight = ((window.innerHeight - jQuery('.tableWithoutHeaders').offset().top) - (jQuery(".applicationFooter").height()) - 20) + "px";
				}
				document.querySelector('.tableWithoutHeaders').style.cssText += "height : " + scrollContainerHeight;
				var dLoadMoreLink = sap.ui.getCore().getRenderManager().getHTML(loadMoreLink);
				sap.ui.Device.orientation.attachHandler(function() {// TODO for height issue on orientation change
					scrollContainer1.rerender();
				});
				var oActiveStep = self.oApi.getActiveStep();
				if (oActiveStep.getSelectedRepresentation().bIsAlternateView === undefined || oActiveStep.getSelectedRepresentation().bIsAlternateView === false) {// Check if alternate representation else don't paginate
					if (sap.ui.Device.browser.mobile) {
						if (aTableData.length > 0) {// Add More Button for Mobile Device for
							jQuery(jQuery(".tableWithoutHeaders > div:first-child")).append(dLoadMoreLink);
						}
						loadMoreLink.attachPress(function() {
							if (!jQuery(".openToggleImage").length && (aTableData.length > 0)) {
								if (eventsFired === 0) {
									triggerPagination();
									skipAction = 0;
									eventsFired++;
									jQuery(".loadMoreLink").remove();
									jQuery(jQuery(".tableWithoutHeaders > div:first-child")).append(dLoadMoreLink);
								}
							} else {
								jQuery(".loadMoreLink").remove();
							}
						});
					} else {
						jQuery('.tableWithoutHeaders').on("scroll", function() {// Mouse scroll, Mouse Down and Mouse Up Events for desktop
							var self = jQuery(this);
							var scrollTop = self.prop("scrollTop");
							var scrollHeight = self.prop("scrollHeight");
							var offsetHeight = self.prop("offsetHeight");
							var contentHeight = scrollHeight - offsetHeight - 5;
							if ((contentHeight <= scrollTop) && !jQuery(".openToggleImage").length && (aTableData.length > 0)) {
								if (eventsFired === 0) {
									triggerPagination();
									skipAction = 0;
									eventsFired++;
								}
							}
						});
					}
				}
				var triggerPagination = function() {
					oTableWithoutHeaders.setBusy(true);
					sap.ui.getCore().applyChanges();
					var oData = oTableDataModel.getData();
					skip = oData.tableData.length; // already fetched data should be skipped
					topValue = 10;
					triggerBool = true;
					self.oApi.updatePath(function(oStep, bStepChanged) {
						if (oStep === self.oApi.getActiveStep()) {
							oTableDataModel.setData(oData);
							oTableWithoutHeaders.rerender();
							oTableWithoutHeaders.setBusy(false);
							eventsFired = 0;
						}
					});
				};
			}
		});
		return new sap.ui.layout.VerticalLayout({
			content : [ scrollContainer1 ]
		});
	};
	/**
	 * @method getThumbnailContent
	 * @description draws Thumbnail for the current chart and returns to the calling object
	 * @returns thumbnail object for column
	 */
	sap.apf.ui.representations.table.prototype.getThumbnailContent = function() {
		var oThumbnailContent;
		if (this.aDataResponse !== undefined && this.aDataResponse.length !== 0) {
			var image = new sap.ui.core.Icon({
				src : "sap-icon://table-chart",
				size : "70px"
			}).addStyleClass('thumbnailTableImage');
			oThumbnailContent = image;
		} else {
			var noDataText = new sap.m.Text({
				text : this.oApi.getTextNotHtmlEncoded("noDataText")
			}).addStyleClass('noDataText');
			oThumbnailContent = new sap.ui.layout.VerticalLayout({
				content : noDataText
			});
		}
		return oThumbnailContent;
	};
	/**
	 * @method removeAllSelection
	 * @description removes all Selection from Chart
	 */
	sap.apf.ui.representations.table.prototype.removeAllSelection = function() {
		_clearFilters(this);
		aFilters = [];//clear the filters
		oTableWithoutHeaders.removeSelections();
		this.oApi.getActiveStep().getSelectedRepresentation().UI5ChartHelper.filterValues = []; // reset the filter values from table to the selected representation
		this.oApi.selectionChanged();
	};
	/**
	 * @method getPrintContent
	 * @param oStepTitle
	 * title of the step
	 * @description gets the printable content of the representation
	 */
	sap.apf.ui.representations.table.prototype.getPrintContent = function(oStepTitle) {
		var self = this;
		this.createDataset();
		var oPrintTableModel = new sap.ui.model.json.JSONModel();
		oPrintTableModel.setData({
			tableData : aTableData
		});
		var i;
		var columns = [];
		for(i = 0; i < tableColumns.name.length; i++) {
			this.columnName = new sap.m.Column({
				width : "75px",
				header : new sap.m.Label({
					text : tableColumns.name[i]
				})
			});
			columns.push(this.columnName);
		}
		var columnCells = [];
		var fnColumnValue = function(index) {
			return function(columnValue) {
				if (self.metadata === undefined) {
					return columnValue;
				} else {
					var oMetadata = self.metadata.getPropertyMetadata(tableColumns.value[index]);
					if (oMetadata.dataType.type === "Edm.DateTime") {
						if (columnValue === null) {
							return "-";
						}
						var dateFormat = new Date(parseInt(columnValue.slice(6, columnValue.length - 2), 10));
						dateFormat = dateFormat.toLocaleDateString();
						if (dateFormat === "Invalid Date") {
							return "-";
						}
						return dateFormat;
					}
					if (oMetadata.unit) {
						if (columnValue === null) {
							return "-";
						}
						var currencyMetadata = self.metadata.getPropertyMetadata(oMetadata.unit);
						if (currencyMetadata.semantics === "currency-code") {
							var precision = aTableData[0][oMetadata.scale];
							columnValue = parseFloat(columnValue, 10).toFixed(precision).toString();
							var store = columnValue.split(".");
							var amountValue = parseFloat(store[0]).toLocaleString();
							var sample = 0.1;
							sample = sample.toLocaleString();
							if (amountValue.split(sample.substring(1, 2)).length > 1) {
								amountValue = amountValue.split(sample.substring(1, 2))[0];
							}
							amountValue = amountValue.concat(sample.substring(1, 2), store[1]);
							return amountValue;
						}
					} else {
						return columnValue;
					}
				}
			};
		};
		var tableCellValues;
		for(i = 0; i < tableColumns.name.length; i++) {
			tableCellValues = new sap.m.Text().bindText(tableColumns.value[i], fnColumnValue(i), sap.ui.model.BindingMode.OneWay);
			columnCells.push(tableCellValues);
		}
		oPrintTable = new sap.m.Table({
			headerText : oStepTitle,
			headerDesign : sap.m.ListHeaderDesign.Standard,
			columns : columns,
			items : {
				path : "/tableData",
				template : new sap.m.ColumnListItem({
					cells : columnCells
				})
			}
		});
		if (this.metadata !== undefined) {// aligning amount fields
			for(i = 0; i < tableColumns.name.length; i++) {
				var oMetadata = this.metadata.getPropertyMetadata(tableColumns.value[i]);
				if (oMetadata.unit) {
					var amountCol = oPrintTable.getColumns()[i];
					amountCol.setHAlign(sap.ui.core.TextAlign.Right);
				}
			}
		}
		oPrintTable.setModel(oPrintTableModel);
		var aSelectedListItems = _drawSelectionForPrint(this);// set the selections on table
		return {
			oTableForPrint : new sap.ui.layout.VerticalLayout({
				content : [ oPrintTable ]
			}),
			aSelectedListItems : aSelectedListItems
		};
	};
}());