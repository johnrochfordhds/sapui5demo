/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

/**
 * JSON-based DataBinding TreeTable Helper Class
 *
 * It's designed only for expand chart which
 * requires to add extra rows to draw vary shapes. TreeTable control haven't provide
 * decent API allows user to manipulate tree nodes, so here we decided to do it by
 * ourself via changing data in order to change tree hierarchy
 *
 * @private
 */

// Provides class sap.gantt.misc.TreeTableHelper
sap.ui.define([
	"jquery.sap.global", "sap/ui/model/FilterProcessor", "sap/ui/model/Filter",
	"sap/ui/model/SorterProcessor", "sap/ui/model/Sorter", "sap/ui/model/Context"
], function(jQuery, FilterProcessor, Filter, SorterProcessor, Sorter, Context) {
	"use strict";

	var TreeTableHelper = function() {};
	TreeTableHelper.JSONDataKey = "originJSONData";

	/**
	 * Add dummy data to the JSON based model. 
	 * 
	 * {
	 *   1: [{__group: 'foo'}, {__group: 'foo'}],
	 *   2: [{__group: 'bar'}, {__group: 'bar'}]
	 * }
	 * @param {sap.ui.table.Table} oTable the tree table instance
	 * @param {object} oDummyData dummy data which contain selected index and array of data
	 * @param {bRestoreSelection} bRestoreSelection whether restore previous table row selection
	 */
	TreeTableHelper.addDummyData = function(oTable, oDummyData, bRestoreSelection){

		var aAllContexts = [];
		if (bRestoreSelection) {
			// record all selected rows before adding dummy data
			aAllContexts = oTable.getSelectedIndices().map(function(iIndex){
				return TreeTableHelper._buildContextMap(oTable, iIndex, null, null);
			});
		}

		var aContexts = this._contextIndexMap(oTable, oDummyData);

		if (aContexts && aContexts.length > 0){
			for (var i = 0; i < aContexts.length; i++ ) {
				var oContext = aContexts[i];
				this._addDummyDataToChildren(oTable, oContext);
			}
		}
		
		TreeTableHelper._updateModalBinding(aContexts);
		
		if (bRestoreSelection) {
			this._restoreSelectedIndices(oTable, aAllContexts);
		}
	};

	TreeTableHelper.removeDummyDataFromSelectedIndices = function(oTable, aSelectedIndices, sGroup) {

		// record all selected rows before removing dummy data
		var aAllContexts = oTable.getSelectedIndices().map(function(iIndex){
			return TreeTableHelper._buildContextMap(oTable, iIndex, null, null);
		});

		aSelectedIndices = (aSelectedIndices || []).sort(function(a, b) { return a - b; });
		var aContexts = aSelectedIndices.map(function(iIndex){
			return TreeTableHelper._buildContextMap(oTable, iIndex, null, sGroup);
		});

		for (var i = 0; i < aContexts.length; i++ ) {
			this._removeDummyDataFromSelectedIndex(oTable, aContexts[i]);
		}

		TreeTableHelper._updateModalBinding(aContexts);

		this._restoreSelectedIndices(oTable, aAllContexts);
		
	};

	TreeTableHelper.isDummyRow = function(oTable, iSelectedIndex) {
		var oContext = oTable.getContextByIndex(iSelectedIndex);
		if (oContext) {
			var oSelectedObject = oContext.getObject();
			return !!oSelectedObject.__dummy;
		} else {
			return false;
		}
	};
	
	TreeTableHelper.isMultipleSpanMainRow = function(oTable, iSelectedIndex, bRowInTable) {
		var iIndex;
		
		if (!bRowInTable){
			var oRow = oTable.getRows()[iSelectedIndex];
			if (oRow){
				iIndex = oRow.getIndex();
			} else {
				return false;
			}
		} else {
			iIndex = iSelectedIndex;
		}
		
		var oContext = oTable.getContextByIndex(iIndex);
		if (oContext) {
			var oSelectedObject = oContext.getObject();
			if (oSelectedObject && oSelectedObject.previousNodeNum !== undefined && oSelectedObject.afterNodeNum !== undefined){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	
	TreeTableHelper.getMultipleSpanMainRowGroupIndices = function(oTable, iSelectedIndex, bRowInTable) {
		
		if (this.isMultipleSpanMainRow(oTable, iSelectedIndex, bRowInTable)){
			var iIndex;
			
			if (!bRowInTable){
				var oRow = oTable.getRows()[iSelectedIndex];
				if (oRow){
					iIndex = oRow.getIndex();
				} else {
					return false;
				}
			} else {
				iIndex = iSelectedIndex;
			}
			
			var currentSelectedObject = oTable.getContextByIndex(iIndex).getObject();
			var startIndex = iSelectedIndex - currentSelectedObject.previousNodeNum;
			var endIndex = iSelectedIndex + currentSelectedObject.afterNodeNum;
			
			var mainRowGroup = [];
			for (var i = startIndex; i <= endIndex; i++){
				mainRowGroup.push(i);
			}
			return mainRowGroup;
		} else {
			return null;
		}
	};

	TreeTableHelper.getContextObject = function(oTable, iSelectedIndex) {
		var oContext = oTable.getContextByIndex(iSelectedIndex);
		if (oContext) {
			return oContext.getObject();
		}	
	};
	
	TreeTableHelper.toggleOpenStateWithRowIndex = function(oTable, iSelectedIndex, bExpanded) {
		var oContext = oTable.getContextByIndex(iSelectedIndex),
			oModel = oContext.getModel(),
			oSelectedObject = oContext.getObject(),
			sParentBindingPath = this._getParentBindingPath(oContext),
			aParentNodes = oContext.getObject(sParentBindingPath);

		var aArrayNames = this._getBindingParameterArrayNames(oTable);

		if (bExpanded) {
			// when expanded, collect the dummy rows below the current level and put them into children
			// start right below from the selected object and collect dummy rows
			// So means remove the parent level first then add into children.

			var oLengthInfo = this._collectNumberOfSiblingDummyData(oSelectedObject, aParentNodes, null /**sGroup*/);

			// remove the selected object level dummy rows
			var aRemovedsData = this._removeSiblingDummyData(oSelectedObject, aParentNodes, null /**sGroup*/);
			this._addDummyDataToChildrenInBatch(oTable, iSelectedIndex, aRemovedsData);

			jQuery.sap.log.info("Move " + oLengthInfo.length + " rows out to its parent level");

		} else {

			// when collapse,  move the dummy children one level up
			var aRemovedRows = this._removeChildrenDummyData(oSelectedObject, aArrayNames, null /**sGroup*/);

			// Prepend the removed dummy rows to the parents
			var iStartIndex = jQuery.inArray(oSelectedObject, aParentNodes);
			aParentNodes.splice.apply(aParentNodes, [iStartIndex + 1, 0].concat(aRemovedRows));

			jQuery.sap.log.info("Move " + aRemovedRows.length + " rows into its children");
		}

		oModel.updateBindings(false/**bForceUpdate*/);
		var aSelectedIndices = oTable.getSelectedIndices();
		oTable.clearSelection();
		aSelectedIndices.forEach(function(iIndex){
			oTable.addSelectionInterval(iIndex, iIndex);
		});
	};

	TreeTableHelper.filter = function(oEvent) {
		oEvent.preventDefault();

		var oTable = oEvent.getSource(),
			aColumns = oTable.getColumns(),
			oBinding = oTable.getBinding("rows"),
			oModel = oBinding.getModel();

		// Clear all dummy data and row selection if necessary
		oTable.clearSelection();
		TreeTableHelper.clearAllDummyData(oTable);

		var oColumn = oEvent.getParameter('column'),
			sValue = oEvent.getParameter('value');
		if (sValue) {
			oColumn.setFiltered(true);
			oColumn.setFilterValue(sValue);
		} else {
			oColumn.setFiltered(false);
			oColumn.setFilterValue(null);
		}

		if (!oTable.data(TreeTableHelper.JSONDataKey)) {
			var oTableModelData = oModel.getProperty(oBinding.getPath());
			oTable.data(TreeTableHelper.JSONDataKey, jQuery.extend(true /**deepCopy*/, {}, oTableModelData));
		}

		// Before to get UNFILTERED contexts, set the origin data back to table and update bindings
		// Otherwise it will get partially filtered contexts
		oModel.setProperty(oBinding.getPath(), jQuery.extend(true, {}, oTable.data(TreeTableHelper.JSONDataKey)), null, true);
		oModel.updateBindings(false);

		var aUnProcessedContext = TreeTableHelper._getRecursiveContexts(oBinding);

		// get filtered columns;
		var aFilters = aColumns.filter(function(oColumn){
			return oColumn.getFiltered();
		}).map(function(oColumn){
			return oColumn._getFilter();
		});
		// get sorted columns
		var aSorters = aColumns.filter(function(oColumn){
			return oColumn.getSorted();
		}).map(function(oColumn){
			return new Sorter(oColumn.getSortProperty(), oColumn.getSortOrder() === sap.ui.table.SortOrder.Descending);
		});

		var aProcessedContext = [],
			aProcessedData;
		if (aFilters.length > 0) {
			aProcessedContext = FilterProcessor.apply(aUnProcessedContext, aFilters, function(vRef, sPath) {
				var oObject = vRef.getObject();
				var oValue = oObject[sPath];

				if (oValue != undefined && typeof oValue !== "string" && !(oValue instanceof Date)){
					oValue = (oValue).toString();
				}

				return oValue;
			});
			aProcessedData = TreeTableHelper._parseDataFromContexts(oTable, aProcessedContext);
			oModel.setProperty(oBinding.getPath(), aProcessedData);
			oModel.updateBindings(false);
		} else {
			// If no filter, copy the data back from origin JSON object, otherwise filter cycle will modify
			// the original json data because of variable reference
			aProcessedData = jQuery.extend(true, {}, oTable.data(TreeTableHelper.JSONDataKey));
			aProcessedContext = aUnProcessedContext;
		}
		if (aSorters.length > 0) {
			var aSortedContext = TreeTableHelper._getSortedRecursiveContexts(oBinding, aSorters, 5);
			aProcessedData = TreeTableHelper._parseDataFromContexts(oTable, aSortedContext);
		}
		// Update Data in model
		oModel.setProperty(oBinding.getPath(), aProcessedData);
		jQuery.sap.log.info("Table filter " + oColumn + ' value is '  + sValue);
	};
	
	TreeTableHelper._sortContexts = function(aContexts, oSorter) {
		var aNewSorters = jQuery.isArray(oSorter) ? oSorter : [oSorter];
		return SorterProcessor.apply(aContexts, aNewSorters, function(oContext, sPath){
			return oContext.getObject()[sPath];
		});
	};

	TreeTableHelper.sort = function(oEvent){
		oEvent.preventDefault();
		var oColumn = oEvent.getParameter('column'),
			sSortOrder = oEvent.getParameter('sortOrder');

		var oTable = oEvent.getSource(),
			aColumns = oTable.getColumns(),
			oBinding = oTable.getBinding("rows"),
			oModel = oBinding.getModel();

		// Clear all dummy data if necessary
		oTable.clearSelection();
		TreeTableHelper.clearAllDummyData(oTable);

		aColumns.forEach(function(oColumn){
			oColumn.setSorted(false);
			oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
		});

		oColumn.setSorted(true);
		oColumn.setSortOrder(sSortOrder);

		var oNewSorter = new Sorter(oColumn.getSortProperty(), sSortOrder === sap.ui.table.SortOrder.Descending);

		var aSortedContexts = TreeTableHelper._getSortedRecursiveContexts(oBinding, oNewSorter, 5);
		var aSortedData = this._parseDataFromContexts(oTable, aSortedContexts);

		oModel.setProperty(oBinding.getPath(), aSortedData);
	};
	
	TreeTableHelper.clearAllDummyData = function (oTable){
		var oBinding = oTable.getBinding("rows"),
			iBindingLength = oBinding.getLength(),
			aIndicesToRemoveDummyData = [];
		
		var iTargetIndex;
		for (var i = 0; i < iBindingLength; i++){
			if (!this.isDummyRow(oTable, i)){
				iTargetIndex = i;
			} else if (aIndicesToRemoveDummyData.indexOf(iTargetIndex) === -1){
					aIndicesToRemoveDummyData.push(iTargetIndex);
			}
			
		}
		
		if (aIndicesToRemoveDummyData.length > 0){
			var aContexts = aIndicesToRemoveDummyData.map(function(iIndex){
				return TreeTableHelper._buildContextMap(oTable, iIndex, null);
			});

			for (var j = 0; j < aContexts.length; j++ ) {
				this._removeDummyDataFromSelectedIndex(oTable, aContexts[j]);
			}

			TreeTableHelper._updateModalBinding(aContexts);
		}
		
	};
	
	TreeTableHelper._parseDataFromContexts = function(oTable ,aContexts){
		var oBinding = oTable.getBinding("rows"),
			//oOriginData = jQuery.extend({},oTable.data("originJSONData")),
			oOriginData = jQuery.extend({},oBinding.getModel().getProperty(oBinding.getPath())),
			oResultData = null,
			sBindingRootPath = oBinding.getPath();
			
		if (aContexts.length === 0){
			return {};
		}
		
		// paths for same context in origin data and in result data are often different, must build 
		// the mapping to track the context and check if the context has already in the result.
		var oMatchedPathsMapping = {
				aOriginPathChain : [],
				sHittedOnPath : null, // hitted on origin path
				aMappingChain : [] //use a array to track the path in result data
		};
		
		var aArrayNames = this._getBindingParameterArrayNames(oTable);
		
		for (var i = 0; i < aContexts.length; i++){
			var sPath = aContexts[i].getPath(),
				sRelevantPath = sPath.replace(sBindingRootPath, ""),
				aPathFragment = sRelevantPath.split("/");
			
			aPathFragment.pop();
			var sParentPath = aPathFragment.join("/");
			
			var oCurrentContextData = jQuery.extend({}, this._getObjFromPath(oOriginData, sRelevantPath)),
				oInsertTargetData = this._getObjFromPath(oResultData, oMatchedPathsMapping[sParentPath]);
			if (oInsertTargetData === null){
				//if can't find the target, build the data frame and maintain the mapping
				oResultData = this._buildDataFormOriginData(oResultData, oOriginData, sParentPath, oMatchedPathsMapping);
				oInsertTargetData = this._getObjFromPath(oResultData, oMatchedPathsMapping[sParentPath]);
			}
			
			//check the mapping, if the node is already in the result then we omit it
			if (!oMatchedPathsMapping[sRelevantPath]){
				
				oInsertTargetData.push(oCurrentContextData);
				
				oMatchedPathsMapping.aOriginPathChain = sRelevantPath.split("/");
				oMatchedPathsMapping.sHittedOnPath = sParentPath;
				oMatchedPathsMapping.aMappingChain = [oInsertTargetData.length - 1];
				this._updateMapping(oMatchedPathsMapping);
				
				for (var j = 0; j < aArrayNames.length; j++){
					if (oCurrentContextData[aArrayNames[j]]){
						oCurrentContextData[aArrayNames[j]] = [];
						
						oMatchedPathsMapping.aOriginPathChain = sRelevantPath.split("/");
						oMatchedPathsMapping.sHittedOnPath = sParentPath;
						oMatchedPathsMapping.aMappingChain = [oInsertTargetData.length - 1];
						oMatchedPathsMapping.aOriginPathChain.push(aArrayNames[j]);
						oMatchedPathsMapping.aMappingChain.push(aArrayNames[j]);
						this._updateMapping(oMatchedPathsMapping);
						
					}
				}
				
			}
			
		}
		
		return oResultData;
	};
	
	TreeTableHelper._buildDataFormOriginData = function (oTargetData, oOringinData, sPath, oPathMapping){
		//we should build the data by node level but array level, just because array always belongs to a node
		var aPathFragment = sPath.split("/");
		oPathMapping.aOriginPathChain = jQuery.extend([],aPathFragment);
		
		var sArrayNameFragment = aPathFragment.pop(),
			sNodePath = aPathFragment.join("/"),
			oTempData = jQuery.extend({}, this._getObjFromPath(oOringinData, sNodePath));
		
		// use "X" as a placeholder, will be changed dynamically according the result data path
		oPathMapping.aMappingChain.push("X"); 
		oPathMapping.aMappingChain.push(sArrayNameFragment);
		
		oTempData[sArrayNameFragment] = [];
		oTargetData = this._buildDataRecursive(oTargetData, oOringinData, sNodePath, oTempData, oPathMapping);
		
		this._updateMapping(oPathMapping);
		return oTargetData;
	};
	
	TreeTableHelper._buildDataRecursive = function (oTargetData, oOringinData, sNodePath, oCurrentData, oPathMapping){
		if (sNodePath === ""){
			//means here is the root of the data.
			oPathMapping.aMappingChain[0] = "";
			if (!oPathMapping[""]){
				oPathMapping[""] = "";
			}
			return oCurrentData;
		} else {
			var aPathFragment = sNodePath.split("/");
				aPathFragment.pop();
			var sParentPath =  aPathFragment.join("/"),
				sPreviousArrayNameFragment = aPathFragment.pop(),
				sPreviousNodePath = aPathFragment.join("/"),
				oTempData = jQuery.extend({}, this._getObjFromPath(oOringinData, sPreviousNodePath));
			
			//check if the node already exist in oTargetData
			var oInsertTargetData = this._getObjFromPath(oTargetData, oPathMapping[sPreviousNodePath]);
			if (oInsertTargetData !== null){
				//hit the target node
				oInsertTargetData[sPreviousArrayNameFragment].push(oCurrentData);
				
				oPathMapping.sHittedOnPath = sParentPath;
				oPathMapping.aMappingChain[0] = oInsertTargetData[sPreviousArrayNameFragment].length - 1;
				
				return oTargetData;
			} else {
				//miss the target, build data frame again.
				oTempData[sPreviousArrayNameFragment] = [];
				oTempData[sPreviousArrayNameFragment].push(oCurrentData);
				
				//because we miss the target, so this node must be the first node in the array
				oPathMapping.aMappingChain[0] = "0";
				
				oPathMapping.aMappingChain.unshift(sPreviousArrayNameFragment);
				oPathMapping.aMappingChain.unshift("X");
				return this._buildDataRecursive(oTargetData, oOringinData, sPreviousNodePath, oTempData, oPathMapping);
			}
		}
		
	};
	
	TreeTableHelper._updateMapping = function(oPathMapping){
		var sOriginPath = "",
			sHittedPath = "";
		
		if (oPathMapping.sHittedOnPath !== null){
			
			sOriginPath = oPathMapping.sHittedOnPath;
			sHittedPath = oPathMapping[oPathMapping.sHittedOnPath];
			
			var aHittedPathFragment = sHittedPath.split("/");
			var iLength = oPathMapping.aOriginPathChain.length - aHittedPathFragment.length,
				iBaseIndex = aHittedPathFragment.length;
				
			for (var i = 0; i < iLength; i++){
				sOriginPath = sOriginPath + "/" + oPathMapping.aOriginPathChain[i + iBaseIndex];
				sHittedPath = sHittedPath + "/" + oPathMapping.aMappingChain[i];
				oPathMapping[sOriginPath] = sHittedPath;
			}
		
		} else if (oPathMapping.aOriginPathChain.length === oPathMapping.aMappingChain.length){
			
			for (var j = 0; j < oPathMapping.aMappingChain.length; j++){
				if (oPathMapping.aMappingChain[j] !== ""){
					sOriginPath = sOriginPath + "/" + oPathMapping.aOriginPathChain[j];
					sHittedPath = sHittedPath + "/" + oPathMapping.aMappingChain[j];
					oPathMapping[sOriginPath] = sHittedPath;
				}
			}
		}
		
		//reset the mapping
		oPathMapping.aOriginPathChain = [];
		oPathMapping.sHittedOnPath = null;
		oPathMapping.aMappingChain = [];
	};
	
	TreeTableHelper._getObjFromPath = function(oObj, sPath){
		if (oObj === null || sPath === undefined){
			return null;
		} else if (sPath == ""){
			return oObj;
		}
		
		var aPathFragment = sPath.split("/"),
			oResult = oObj,
			bMatched = false;
		
		for (var i = 0; i < aPathFragment.length; i++){
			if (aPathFragment[i] !== ""){
				if (oResult[aPathFragment[i]] !== undefined){
					bMatched = true;
					oResult = oResult[aPathFragment[i]];
				} else {
					bMatched = false;
					return null;
				}
			}
		}
		
		if (bMatched){
			return oResult;
		} else {
			return null;
		}
		
	};

	// It get the data from the selected row, if it's expanded, remove children dummy data,
	// otherwise, remove the selected row sibling dummy data
	TreeTableHelper._removeDummyDataFromSelectedIndex = function(oTable, oContextParam) {

		var sGroup = oContextParam.group || null;

		var bExpanded = oContextParam.expanded,
			oSelectedObject = oContextParam.object,
			aParentNodes = oContextParam.parentObject;

		var aArrayNames = this._getBindingParameterArrayNames(oTable);

		if (bExpanded) {
			// if the current selected node is expanded, means the dummy rows is in the children
			this._removeChildrenDummyData(oSelectedObject, aArrayNames, sGroup);
		} else {
			// remove the selected object level dummy rows
			this._removeSiblingDummyData(oSelectedObject, aParentNodes, sGroup);
			// Update the Model with the updated data
		}
		jQuery.sap.log.info("Remove dummy rows for selecting row");

	};


	TreeTableHelper._addDummyDataToChildren = function(oTable, oContextParam) {

		// By default, Dummy data has two keys __dummy and __group, __group uses to
		// identify a group of dummy data
		var aDummyData = oContextParam.dummyData;
		aDummyData.forEach(function(oItem, iIndex, aArray){
			aArray[iIndex] = jQuery.extend({__group: null}, oItem, {__dummy: true});
		});

		var aArrayNames = this._getBindingParameterArrayNames(oTable);

		var oSelectedObject = oContextParam.object;

		// You are not allowed to add dummy data on dummy row
		if (oSelectedObject && oSelectedObject.__dummy) {
			return;
		}

		var bExpanded = oTable.isExpanded(oContextParam.oldIndex);
		var sFirstGroupId = aDummyData[0].__group; // aDummyData should contain same group
		var bDoesGroupDummyExist = false;

		aArrayNames.forEach(function(sName){
			var aChildrenData = oSelectedObject[sName];
			if (aChildrenData && bExpanded) {
				// the data node might not exist at all, check it here
				var iInsertIndex = -1;

				// It used to find the last dummy data index
				jQuery.each(aChildrenData, function(iIndex, oChild){
					if (oChild.__group === sFirstGroupId) {
						bDoesGroupDummyExist = true;
					}

					if (iIndex === 0 && !!oChild.__dummy === false){
						// if the first element is non dummy then that's the position to insert
						iInsertIndex = 0;
					} else if (!!oChild.__dummy === true){
						// otherwise continue to loop
						iInsertIndex = iIndex;
					}
					return false;
				});

				if (iInsertIndex == -1 || iInsertIndex == 0){
					// previous no dummy data, insert from the first
					iInsertIndex = 0;
				} else {
					// if not the first row, need to insert AFTER the found dummy element
					iInsertIndex += 1;
				}

				if (!bDoesGroupDummyExist) {
					aChildrenData.splice.apply(aChildrenData, [iInsertIndex, 0].concat(aDummyData));
				}
			} else {
				// node might not exist, need append dummy data to siblings
				jQuery.sap.log.warning("parameter " + sName + " data node doesn not exist");

				var aParentNodes = oContextParam.parentObject;

				var iFoundIndex = jQuery.inArray(oSelectedObject, aParentNodes);
				if (iFoundIndex >= 0) {
					// start from the next row
					var iIterateStartIndex = iFoundIndex + 1;

					while (aParentNodes[iIterateStartIndex] && aParentNodes[iIterateStartIndex].__dummy) {
						if (aParentNodes[iIterateStartIndex].__group === sFirstGroupId) {
							bDoesGroupDummyExist = true;
						}
						iIterateStartIndex++;
					}
					
					if (!bDoesGroupDummyExist) {
						aParentNodes.splice.apply(aParentNodes, [iIterateStartIndex, 0].concat(aDummyData));
					}
				}
			}
		});

	};

	TreeTableHelper._addDummyDataToChildrenInBatch = function(oTable, iSelectedIndex, aDummyData) {

		var aArrayNames = this._getBindingParameterArrayNames(oTable);

		var oContext = oTable.getContextByIndex(iSelectedIndex),
			oSelectedObject = oContext.getObject();

		aArrayNames.forEach(function(sName){
			var aChildrenData = oSelectedObject[sName];
			if (aChildrenData) {
				 aChildrenData.unshift.apply(aChildrenData, aDummyData);
			} else {
				// node might not exist
				jQuery.sap.log.warning("parameter " + sName + " data node doesn not exist");
			}
		});
	};

	TreeTableHelper._getBindingParameterArrayNames = function(oTable) {
		return oTable.getBindingInfo("rows").parameters.arrayNames;
	};

	TreeTableHelper._getParentBindingPath = function(oContext) {
		var aParentPaths = oContext.getPath().split("/");
		aParentPaths.pop();
		return aParentPaths.join("/");
	};

	TreeTableHelper._removeSiblingDummyData = function(oSelectedObject, aParentNodes, sGroup) {
		var oLengthInfo = this._collectNumberOfSiblingDummyData(oSelectedObject, aParentNodes, sGroup);
		// Remove the dummy rows
		return aParentNodes.splice(oLengthInfo.index + 1, oLengthInfo.length);
	};

	TreeTableHelper._removeChildrenDummyData = function(oSelectedObject, aArrayNames, sGroup) {

		var aRemovedRows = [];
		aArrayNames.forEach(function(sName){
			var aChildrenData = oSelectedObject[sName];
			if (aChildrenData) {

				// collect the start index and number of data need to be removed
				var iStartIndex = -1,
					iCount = 0;

				jQuery.each(aChildrenData, function(iIndex, oChild){
					if (oChild.__dummy && (oChild.__group === sGroup || sGroup === null)){
						if (iStartIndex === -1) {
							iStartIndex = iIndex;
						}
						iCount++;
						return true;
					} else if (oChild.__dummy){
						// the Node is a dummy row, so continue here
						return true;
					} else {
						// It means the row is not dummy, stop iteration here!!
						return false;
					}
				});

				if (iStartIndex !== -1 && iCount > 0){
					// if found need removed data
					aRemovedRows.push.apply(aRemovedRows, aChildrenData.splice(iStartIndex, iCount));
				}
			} else {
				// node might not exist
				jQuery.sap.log.info("NO dummy rows were found");
			}
		});
		return aRemovedRows;
	};

	/// This is collect the number of same level dummy rows.
	TreeTableHelper._collectNumberOfSiblingDummyData = function(oSelectedObject, aParentNodes, sGroup) {
		var iNumberOfDummyRow = 0;
		var iFoundGroupIndex = -1;

		var iFoundIndex = jQuery.inArray(oSelectedObject, aParentNodes);
		if (iFoundIndex >= 0) {
			// start from the next row
			var iIterateStartIndex = iFoundIndex + 1;
			var oNode = aParentNodes[iIterateStartIndex];
			while (oNode && oNode.__dummy) {
				if (oNode.__group == sGroup || sGroup === null) {
					iNumberOfDummyRow++;
					if (iFoundGroupIndex == -1) {
						// it identify the index position to change the dummy data
						iFoundGroupIndex = iIterateStartIndex;
					}
				}
				iIterateStartIndex++;
				oNode = aParentNodes[iIterateStartIndex];
			}
		}
		if (iFoundGroupIndex != -1){
			// Found the index in siblings, start from previous index
			iFoundGroupIndex -= 1;
		}
		var result = {
			index: iFoundGroupIndex,
			length: iNumberOfDummyRow
		};

		return result;
	};
	
	TreeTableHelper._restoreSelectedIndices = function(oTable, aContexts) {

		if (aContexts.length === 0) {
			// do nothing if no selected index
			return;
		}

		jQuery.sap.delayedCall(100, oTable, function(){

			oTable.clearSelection();

			aContexts.forEach(function(oContext){
				var oBinding = oTable.getBinding("rows");

				if (oBinding && oBinding.findNode) {
					var iLength = oBinding.getLength();
					for (var iIndex = 0; iIndex < iLength; iIndex++) {
						var oNode = oBinding.findNode(iIndex);
						if (jQuery.sap.equal(oNode.context.getObject(), oContext.object, 1 /**Nested Level*/)) {
							oTable.addSelectionInterval(iIndex, iIndex);
							break;
						}
					}
				}

			});
		});
	};
	
	TreeTableHelper._contextIndexMap = function (oTable, oDummyData) {
		var aSelectedIndices = Object.keys(oDummyData).map(function(iKey){ return parseInt(iKey, 10); }).sort(function(a, b) { return a - b; });
		return aSelectedIndices.map(function(iIndex){
			return TreeTableHelper._buildContextMap(oTable, iIndex, oDummyData, null);
		});
	};
	
	TreeTableHelper._buildContextMap = function(oTable, iSelectedIndex, oDummyData, sGroup) {
		var oContext = oTable.getContextByIndex(iSelectedIndex),
			oModel = oContext.getModel();
		var sParentPath = TreeTableHelper._getParentBindingPath(oContext),
			aParentObjects = oModel.getProperty(sParentPath);
		var bExpanded = false;
		var oBinding = oTable.getBinding("rows");
		if (oBinding.hasChildren && oBinding.hasChildren(oContext)) {
			bExpanded = oTable.isExpanded(iSelectedIndex);
		}
		var oContextMap = {
			oldIndex: iSelectedIndex,
			path: oContext.getPath(),
			object: oContext.getObject(),
			parentObject : aParentObjects,
			context:  oContext,
			expanded: bExpanded
		};
		
		if (oDummyData && oDummyData[iSelectedIndex]) {
			oContextMap.dummyData = oDummyData[iSelectedIndex];
		}
		
		if (sGroup) {
			oContextMap.group = sGroup;
		}
		return oContextMap;
	};
	
	TreeTableHelper._updateModalBinding = function(aContexts) {
		var bUpdateOnce = false;
		for (var iIndex = 0; iIndex < aContexts.length; iIndex++) {
			if (bUpdateOnce) {
				break;
			} else {
				var oContextMapItem = aContexts[iIndex];
				oContextMapItem.context.getModel().updateBindings(false/**bForceUpdate*/);
				bUpdateOnce = true;
			}
		}
	};

	TreeTableHelper._getRecursiveContexts = function(oBinding){
		var aRetContext = [];

		var aRootContexts = oBinding.getRootContexts(0, oBinding.getLength());
		var fnRecursive = function(aContexts) {
			var aNodeContexts = [];
			aContexts.forEach(function(oContext){
				aNodeContexts = aNodeContexts.concat(oContext);
				var iChildCount = oBinding.getChildCount(oContext),
					bHasChild = iChildCount > 0,
					aChildContexts = [];
				if (bHasChild) {
					aChildContexts = oBinding.getNodeContexts(oContext, 0, iChildCount);
					aNodeContexts = aNodeContexts.concat(fnRecursive(aChildContexts));
				}
			});
			return aNodeContexts;
		};
		aRetContext = fnRecursive(aRootContexts);
		return aRetContext;
	};

	TreeTableHelper._getSortedRecursiveContexts = function(oBinding, oSorter, iLevel) {
		iLevel = iLevel ? iLevel : 1;
		var aRetContext = [];
		var aRootContexts = oBinding.getRootContexts(0, oBinding.getLength());

		aRetContext.push(aRootContexts);

		var fnGetChildren = function(aContexts) {
			var aNodeContexts = [];
			aContexts.forEach(function(oContext){
				var iChildCount = oBinding.getChildCount(oContext),
					bHasChild = iChildCount > 0;
				if (bHasChild) {
					var aChildContexts = oBinding.getNodeContexts(oContext, 0, iChildCount);
					aNodeContexts = aNodeContexts.concat(aChildContexts);
				}
			});
			return aNodeContexts;
		};

		var aStartContexts = aRootContexts;
		while (aRetContext.length <= iLevel) {
			// meet the sort level
			var aChildren = fnGetChildren(aStartContexts);
			if (aChildren.length === 0) {
				break;
			} else {
				aRetContext.push(aChildren);
			}
			aStartContexts = aChildren;
		}

		var aFinalContexts = [];
		for (var iIndex = 0; iIndex < aRetContext.length; iIndex++) {
			var aSortedContexts = TreeTableHelper._sortContexts(aRetContext[iIndex], oSorter);
			aFinalContexts = aFinalContexts.concat(aSortedContexts);
		}

		return aFinalContexts;
	};

	return TreeTableHelper;

}, /* bExport= */true);
