/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/misc/Format"], function (Format) {
	"use strict";

	var Utility = {};

	/*
	 * This method will do necessary check when you assign parameters,
	 * the check includes:
	 * 1. type check - if type of inputParam does not match defaultParam,
	 * defaultParam will be returned;
	 * 2. value check - if inputParam is undefined,
	 * defaultParam will be returned.
	 */
	Utility.assign = function (inputParam, defaultParam) {
		if (typeof (inputParam) !== typeof (defaultParam)) {
			return defaultParam;
		} else if ((typeof inputParam === "undefined") || inputParam === null) {
			return defaultParam;
		} else {
			return inputParam;
		}
	};

	/*
	 * for JSON object
	 */
	Utility.assignDeep = function (inputObj, defaultObj) {
		if (!inputObj && !defaultObj) {
			return null;
		} else if (inputObj && !defaultObj) {
			return inputObj;
		} else if (!inputObj && defaultObj) {
			return defaultObj;
		} else if (typeof (inputObj) === "object" && typeof (defaultObj) === "object") {
			var retVal = inputObj;
			for (var attr in defaultObj) {
				if (typeof (retVal[attr]) !== "boolean" && !retVal[attr]) {
					retVal[attr] = defaultObj[attr];
				} else if (typeof (defaultObj[attr]) === "object" && typeof (retVal[attr]) === "object") {
					retVal[attr] = this.assignDeep(retVal[attr], defaultObj[attr]);
				}
			}
			return retVal;
		} else {
			return inputObj;
		}
	};

	/**
	 * This method is used to generate an UID for each row object or shapes.
	 * The UID structure will be like this PATH:objectId|DATA:objectType[id]|SCHEME:objectScheme,
	 * For Row object, the uid should contain PATH part and SCHEME part. for shape object,  the uid
	 * should contain PATH part and DATA part, usually shape object doesn't have SCHEME part and row
	 * object doesn't have DATA part.
	 * 
	 * @param {array} [aDataArray] A data array to generate UID.	
	 * @param {object} [oObjectTypesMap] A map for object configuration information.	
	 * @param {array} [aShapeDataNames] An array stored the names of shape data.	
	 * @param {string} [parentUid] The parent uid for children uid generation.
	 */
	Utility.generateRowUid = function (aDataArray, oObjectTypesMap, aShapeDataNames, parentUid) {
		jQuery.each(aDataArray, function (k, v) {
			v.uid = v.id;
			if (parentUid) {
				v.uid = parentUid + "|" + v.uid;
			} else if (v.bindingObj && v.bindingObj.findNode) {
				var oNode = v.bindingObj.findNode(v.rowIndex);
				while (oNode.parent && oNode.level > 0) {
					oNode = oNode.parent;
					v.uid = oNode.context.getObject().id + "|" + v.uid;
				}
			}
			//generate row uid
			v.uid = "PATH:" + v.uid + "|SCHEME:" + v.chartScheme + "[" + v.index + "]";
			//generate uids for other arrays e.g order, activity
			for (var i = 0; i < aShapeDataNames.length; i++) {
				var sDataName = aShapeDataNames[i];
				if (sDataName in v.data) {
					for (var j = 0; j < v.data[sDataName].length; j++) {
						var obj = v.data[sDataName][j];
						//if obj doesn't have id, just set j as it's id to avoid undefined id
						if (obj.id === undefined) {
							obj.id = j;
						}
						obj.uid = v.uid + "|DATA:" + sDataName + "[" + obj.id + "]";
					}
				}
			}
			
		});
	};
	
	/*
	 * Generate uids for relationships
	 */
	Utility.generateUidByShapeDataName = function (aDataArray, sShapeDataName) {
		if (sShapeDataName === undefined) {
			sShapeDataName = "relationship";
		}
		for (var i = 0; i < aDataArray.length; i++) {
			if (aDataArray[i].id === undefined) {
				aDataArray[i].id = i;
			}
			aDataArray[i].uid = "|DATA:" + sShapeDataName + "[" + aDataArray[i].id + "]";
		}
	};
	
	/**
	 * This method iterates dataSet and save elements into the map, the key is 'id' of each element and the value is the element itself.
	 * When an element has children, traverse the children and use parent's 'id' plus "." plus child's 'id' as the key.
	 * For example, dataSet is like below which contains two elements and one of the elements has a child.
	 *        [
	 *            {
	 * 				id: 1
	 * 				children: [
	 * 					{
	 * 						id: 2
	 * 					}
	 * 				]
	 * 			},
	 *            {
	 * 				id: 3
	 * 			}
	 *        ]
	 * Then the map will be,
	 *        {
	 * 			"1" : {}
	 * 			"1.2": {}
	 * 			"3": {}
	 * 		}
	 * Notice that the key of children elements are path of ids which indicate both the children's id and their parent's id.
	 * @param {object} [dataSet]
	 *            The object array which contains all objects in the visible area including the hierarchy and chart.
	 * @param {object} [map]
	 *            The idPath map which is initially empty and is to be constructed by this method.
	 * @param {string} [parentId]
	 *            ID of parent element
	 * @returns {object} [relPath]
	 * 			  The returned object map
	 */
	Utility.generateObjectPathToObjectMap = function (dataSet, map, parentId) {
		var relPath;
		for (var i in dataSet) {
			var obj = dataSet[i],id;
			if (obj.objectInfoRef) {
				id = obj.objectInfoRef.data.id;
				obj = obj.objectInfoRef;
			} else {
				id = obj.data.id;
			}
			
			if (parentId && parentId != "") {
				id = parentId.concat(".").concat(id);
			}
			map[id] = obj;

			if (obj.children && obj.children.length > 0) {
				relPath = this.generateObjectPathToObjectMap(obj.children, map, id);
			}
		}
		return relPath;
	};
	
	/**
	 * This method is used to parse data type by the given uid.
	 * @param {string} [uid] uid
	 * @returns {string} [dataType] The date type if any match	  
	 */
	Utility.getDataTypeByUid = function (uid) {
		if (uid !== null && uid !== undefined) {
			var pattern = new RegExp("\\|DATA:", "");
			var secondPattern = new RegExp("\\[", "");

			var firstMatches = pattern.exec(uid);
			var lastMatches = secondPattern.exec(uid);
			var dataType = null;
			if ((firstMatches !== null) && (lastMatches !== null)) {
				dataType = uid.substring(firstMatches.index + 6, lastMatches.index);
			}
			if (dataType) {
				return dataType;
			} else {
				return undefined;
			}
		}
		return undefined;
	};
	
	/**
	 * This method is used to get object id by the given uid.
	 * @param {string} [uid] uid
	 * @param {boolean} [isRowUid] value is true if the uid is a row uid, or is false	
	 * @returns {string} [objectId] The object id parsed from the uid	
	 */
	Utility.getObjectIdByUid = function (uid, isRowUid) {
		if (uid !== null && uid !== undefined) {
			var pattern = new RegExp("PATH:", "");
			var secondPattern, objectId;
			if (isRowUid) {
				secondPattern = new RegExp("\\|SCHEME:", "");
			} else {
				secondPattern = new RegExp("\\|DATA:", "");
			}
			var firstMatches = pattern.exec(uid);
			var lastMatches = secondPattern.exec(uid);

			if ((firstMatches !== null) && (lastMatches !== null)) {
				objectId = uid.substring(firstMatches.index + 5, lastMatches.index);
			}
			if (objectId) {
				return objectId;
			} else {
				return undefined;
			}
		}
		return undefined;
	};

	Utility.abapTsToDate = function (sTimeStamp) {
		if (typeof sTimeStamp === "string" && sTimeStamp.length >= 6) {
			return new Date(sTimeStamp.substr(0, 4),
				parseInt(sTimeStamp.substr(4, 2), 0) - 1,
				sTimeStamp.substr(6, 2),
				sTimeStamp.substr(8, 2),
				sTimeStamp.substr(10, 2),
				sTimeStamp.substr(12, 2));
		}
		return null;
	};
	/**
	 * Scale size value according to current sapUiSize css setting.
	 * 
	 * @param {string} sMode Sap ui size mode.
	 * @param {number} nCompactValue Number to be scaled.
	 * @return {number} Scaled value.
	 * @protected
	 */
	Utility.scaleBySapUiSize = function (sMode, nCompactValue) {
		switch (sMode){
		case "sapUiSizeCozy":
			return nCompactValue * 1.5;
		case "sapUiSizeCondensed":
			return nCompactValue * 0.78;
		default:
			return nCompactValue;
		}
	};
	/**
	 * Determine the active SAP UI size class.
	 * 
	 * @return {string} SAP UI size class name.
	 */
	Utility.findSapUiSizeClass = function (oControl) {
		var $rootDiv, $sizeDef;
		if (oControl) {
			$rootDiv = oControl.$();
		} else {
			$rootDiv = jQuery("body");
		}

		if ($rootDiv) {
			$sizeDef = $rootDiv.closest(".sapUiSizeCompact,.sapUiSizeCondensed,.sapUiSizeCozy");
			if ($sizeDef.hasClass("sapUiSizeCondensed")) { // over-write Compact
				return "sapUiSizeCondensed";
			} else if ($sizeDef.hasClass("sapUiSizeCompact")) {
				return "sapUiSizeCompact";
			} else if ($sizeDef.hasClass("sapUiSizeCozy")) {
				return "sapUiSizeCozy";
			}
		}
	};
	

	return Utility;
}, /* bExport= */ true);
