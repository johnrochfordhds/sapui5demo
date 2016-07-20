// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview This file contains miscellaneous utility functions.
 */

(function () {
    "use strict";
    /*global dispatchEvent, document, jQuery, localStorage, sap */

    // ensure that sap.ushell exists
    jQuery.sap.declare("sap.ovp.cards.AnnotationHelper");

    sap.ovp.cards.AnnotationHelper = {};
    sap.ovp.cards.AnnotationHelper.formatFunctions = {count: 0};
    sap.ovp.cards.AnnotationHelper.NumberFormatFunctions = {};

    sap.ovp.cards.AnnotationHelper.criticalityConstants = {
        StateValues : {
            None : "None",
            Negative : "Error",
            Critical : "Warning",
            Positive : "Success"
        },
        ColorValues : {
            None : "Neutral",
            Negative : "Error",
            Critical : "Critical",
            Positive : "Good"
        }
    };

    function getCacheEntry(iContext, sKey) {
        if (iContext.getSetting) {
            var oCache = iContext.getSetting("_ovpCache");
            return oCache[sKey];
        }
        return undefined;
    }

    function setCacheEntry(iContext, sKey, oValue) {
        if (iContext.getSetting) {
            var oCache = iContext.getSetting("_ovpCache");
            oCache[sKey] = oValue;
        }
    }

    function criticality2state(criticality, oCriticalityConfigValues) {
        var sState = oCriticalityConfigValues.None;
        if (criticality && criticality.EnumMember) {
            var val = criticality.EnumMember;
            if (endsWith(val, 'Negative')) {
                sState = oCriticalityConfigValues.Negative;
            } else if (endsWith(val, 'Critical')) {
                sState = oCriticalityConfigValues.Critical;
            } else if (endsWith(val, 'Positive')) {
                sState = oCriticalityConfigValues.Positive;
            }
        }
        return sState;
    }

    function endsWith(sString, sSuffix) {
        return sString && sString.indexOf(sSuffix, sString.length - sSuffix.length) !== -1;
    }

    function generateCriticalityCalculationStateFunction(criticalityCalculation, oCriticalityConfigValues) {

        return function (value) {

            value = Number(value);
            var sDirection = criticalityCalculation.ImprovementDirection.EnumMember;
            var oCriticality = {};
            var deviationLow = getNumberValue(criticalityCalculation.DeviationRangeLowValue);
            var deviationHigh = getNumberValue(criticalityCalculation.DeviationRangeHighValue);
            var toleranceLow = getNumberValue(criticalityCalculation.ToleranceRangeLowValue);
            var toleranceHigh = getNumberValue(criticalityCalculation.ToleranceRangeHighValue);
            if (endsWith(sDirection, "Minimize") || endsWith(sDirection, "Minimizing")) {
                if (value <= toleranceHigh) {
                    oCriticality.EnumMember = "Positive";
                } else if (value > deviationHigh) {
                    oCriticality.EnumMember = "Negative";
                } else {
                    oCriticality.EnumMember = "Critical";
                }
            } else if (endsWith(sDirection, "Maximize") || endsWith(sDirection, "Maximizing")) {
                if (value >= toleranceLow) {
                    oCriticality.EnumMember = "Positive";
                } else if (value < deviationLow) {
                    oCriticality.EnumMember = "Negative";
                } else {
                    oCriticality.EnumMember = "Critical";
                }
            } else if (endsWith(sDirection, "Target")) {
                if (value >= toleranceLow && value <= toleranceHigh) {
                    oCriticality.EnumMember = "Positive";
                } else if (value < deviationLow || value > deviationHigh) {
                    oCriticality.EnumMember = "Negative";
                } else {
                    oCriticality.EnumMember = "Critical";
                }
            }

            return criticality2state(oCriticality, oCriticalityConfigValues);
        };
    }

    function getSortedDataFields(iContext, aCollection) {
        var sCacheKey = iContext.getPath() + "-DataFields-Sorted";
        var aSortedFields = getCacheEntry(iContext, sCacheKey);
        if (!aSortedFields) {
            var aDataPoints = getSortedDataPoints(iContext, aCollection);
            var aDataPointsValues = aDataPoints.map(function (oDataPoint) {
                return oDataPoint.Value.Path;
            });
            aDataPointsValues = aDataPointsValues.filter(function (element) {
                return !!element;
            });
            aSortedFields = aCollection.filter(function (item) {
                if (item.RecordType === "com.sap.vocabularies.UI.v1.DataField" && aDataPointsValues.indexOf(item.Value.Path) === -1) {
                    return true;
                }
                return false;
            });
            sortCollectionByImportance(aSortedFields);
            setCacheEntry(iContext, sCacheKey, aSortedFields);
        }
        return aSortedFields;
    }

    function getSortedDataPoints(iContext, aCollection) {
        var sCacheKey = iContext.getPath() + "-DataPoints-Sorted";
        var aSortedFields = getCacheEntry(iContext, sCacheKey);
        if (!aSortedFields) {
            aSortedFields = aCollection.filter(isDataFieldForAnnotation);
            sortCollectionByImportance(aSortedFields);
            var sEntityTypePath;
            for (var i = 0; i < aSortedFields.length; i++) {
                sEntityTypePath = iContext.getPath().substr(0, iContext.getPath().lastIndexOf("/") + 1);
                aSortedFields[i] = iContext.getModel().getProperty(getTargetPathForDataFieldForAnnotation(sEntityTypePath,aSortedFields[i]));
                sEntityTypePath = "";
            }
            setCacheEntry(iContext, sCacheKey, aSortedFields);
        }
        return aSortedFields;
    }

    function isDataFieldForAnnotation(oItem) {
        if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"
            &&
            oItem.Target.AnnotationPath.match(/@com.sap.vocabularies.UI.v1.DataPoint.*/)) {
            return true;
        }
        return false;
    }

    function getTargetPathForDataFieldForAnnotation(sEntityTypePath, oDataFieldForAnnotation) {
        if (sEntityTypePath && !endsWith(sEntityTypePath,'/')) {
            sEntityTypePath += '/';
        }
        return sEntityTypePath + oDataFieldForAnnotation.Target.AnnotationPath.slice(1);
    }

    function getImportance(oDataField) {
        var sImportance;
        if (oDataField["com.sap.vocabularies.UI.v1.Importance"]) {
            sImportance = oDataField["com.sap.vocabularies.UI.v1.Importance"].EnumMember;
        }
        return sImportance;
    }

    function sortCollectionByImportance(aCollection) {
        aCollection.sort(function (a, b) {
            var aImportance = getImportance(a),
                bImportance = getImportance(b);

            if (aImportance === bImportance) {
                return 0;
            }

            if (aImportance === "com.sap.vocabularies.UI.v1.ImportanceType/High") {
                return -1;
            } else if (bImportance === "com.sap.vocabularies.UI.v1.ImportanceType/High") {
                return 1;
            } else if (aImportance === "com.sap.vocabularies.UI.v1.ImportanceType/Medium") {
                return -1;
            } else if (bImportance === "com.sap.vocabularies.UI.v1.ImportanceType/Medium") {
                return 1;
            } else if (aImportance === "com.sap.vocabularies.UI.v1.ImportanceType/Low") {
                return -1;
            } else if (bImportance === "com.sap.vocabularies.UI.v1.ImportanceType/Low") {
                return 1;
            }
            return -1;
        });
        return aCollection;
    }

    function formatDataField(iContext, aCollection, index) {
        var item = getSortedDataFields(iContext, aCollection)[index];
        if (item) {
            return formatField(iContext, item);
        }
        return "";
    }

    function getDataFieldName(iContext, aCollection, index) {
        var item = getSortedDataFields(iContext, aCollection)[index];

        if (item) {
            return item.Label.String;
        }
        return "";
    }

    function getDataPointName(iContext, aCollection, index) {
        var item = getSortedDataPoints(iContext, aCollection)[index];

        if (item && item.Title) {
            return item.Title.String;
        }
        return "";
    }

    function formatDataPoint(iContext, aCollection, index) {
        var item = getSortedDataPoints(iContext, aCollection)[index];
        if (!item) {
            return "";
        }

        var oModel = iContext.getSetting('ovpCardProperties');
        var oEntityType = oModel.getProperty("/entityType");
        var oMetaModel = oModel.getProperty("/metaModel");

        return _formatDataPoint(iContext, item, oEntityType, oMetaModel);
    }

    function _formatDataPoint(iContext, oItem, oEntityType, oMetaModel) {

        if (!oItem || !oItem.Value) {
            return "";
        }

        var oEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, oItem.Value.Path);
        //Support sap:text attribute
        if (oEntityTypeProperty && oEntityTypeProperty["sap:text"]) {
            oEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, oEntityTypeProperty["sap:text"]);
            oItem = {Value: {Path: oEntityTypeProperty.name}};
        }
        return formatField(iContext, oItem);
    }

    function formatField(iContext, item, bDontIncludeUOM, bIncludeOnlyUOM) {

        if (item.Value.Apply) {
            return sap.ui.model.odata.AnnotationHelper.format(iContext, item.Value);
        }

        var oModel = iContext.getSetting('ovpCardProperties');
        var oEntityType = oModel.getProperty("/entityType");
        var oMetaModel = oModel.getProperty("/metaModel");

        return _formatField(iContext, item, oEntityType, oMetaModel, bDontIncludeUOM, bIncludeOnlyUOM);
    }

    function _formatField(iContext, oItem, oEntityType, oMetaModel, bDontIncludeUOM, bIncludeOnlyUOM) {

        if (oItem.Value.Apply) {
            return sap.ui.model.odata.AnnotationHelper.format(iContext, oItem.Value);
        }

        var oEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, oItem.Value.Path);
        var result = "";
        var functionName;

        if (!bIncludeOnlyUOM) {

            //Support association
            if (oItem.Value.Path.split("/").length > 1) {
                oEntityTypeProperty = getNavigationSuffix(oMetaModel, oEntityType, oItem.Value.Path);
            }

            if (!oEntityTypeProperty) {
                return "";
            }

            //Item has ValueFormat annotation
            if (oItem.ValueFormat && oItem.ValueFormat.NumberOfFractionalDigits) {
                functionName = getNumberFormatFunctionName(oItem.ValueFormat.NumberOfFractionalDigits.Int);
                result = "{path:'" + oItem.Value.Path + "', formatter: '" + functionName + "'}";
            } else if (oEntityTypeProperty["scale"]) {
                //If there is no value format annotation, we will use the metadata scale property
                functionName = getNumberFormatFunctionName(oEntityTypeProperty["scale"]);
                result = "{path:'" + oEntityTypeProperty.name + "', formatter: '" + functionName + "'}";
            } else {
                result = sap.ui.model.odata.AnnotationHelper.format(iContext, oItem.Value);
            }
        }

        if (!bDontIncludeUOM) {
            //Add currency using path or string
            if (oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"]) {
                var oCurrency = oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"];
                if (oCurrency.Path) {
                    result = result + " {path: '" + oCurrency.Path + "'}";
                } else if (oCurrency.String) {
                    result = result + " " + oCurrency.String;
                }
            }

            //Add unit using path or string
            if (oEntityTypeProperty["Org.OData.Measures.V1.Unit"]) {
                var oUnit = oEntityTypeProperty["Org.OData.Measures.V1.Unit"];
                if (oUnit.Path) {
                    result = result + " {path: '" + oUnit.Path + "'}";
                } else if (oUnit.String) {
                    result = result + " " + oUnit.String;
                }
            }
        }

        if (result[0] === " "){
            result = result.substring(1);
        }

        return result;
    }

    function getNumberFormatFunctionName(numberOfFractionalDigits) {
        var functionName = "formatNumberCalculation" + numberOfFractionalDigits;
        if (!sap.ovp.cards.AnnotationHelper.NumberFormatFunctions[functionName]) {
            sap.ovp.cards.AnnotationHelper.NumberFormatFunctions[functionName] = generateNumberFormatFunc(Number(numberOfFractionalDigits));
        }
        return "sap.ovp.cards.AnnotationHelper.NumberFormatFunctions." + functionName;
    }

    function generateNumberFormatFunc(numOfFragmentDigit) {
        return function (value) {
            jQuery.sap.require("sap.ui.core.format.NumberFormat");
            var formatNumber = sap.ui.core.format.NumberFormat.getFloatInstance({
                style: 'short',
                showMeasure: false,
                minFractionDigits: numOfFragmentDigit,
                maxFractionDigits: numOfFragmentDigit
            });
            return formatNumber.format(Number(value));
        };
    }

    function getNavigationSuffix(oMetaModel, oEntityType, sProperty) {
        var aParts = sProperty.split("/");

        if (aParts.length > 1) {
            for (var i = 0; i < (aParts.length - 1); i++) {
                var oAssociationEnd = oMetaModel.getODataAssociationEnd(oEntityType, aParts[i]);
                if (oAssociationEnd) {
                    oEntityType = oMetaModel.getODataEntityType(oAssociationEnd.type);
                }
            }

            return oMetaModel.getODataProperty(oEntityType, aParts[aParts.length - 1]);
        }
    }

    function formatDataPointState(iContext, aCollection, index) {
        var aDataPoints = getSortedDataPoints(iContext, aCollection);
        var sState = "None";
        if (aDataPoints.length > index) {
            var item = aDataPoints[index];
           sState = formatDataPointToValue(iContext, item, sap.ovp.cards.AnnotationHelper.criticalityConstants.StateValues);
        }
        return sState;
    }

    function formatDataPointToValue(iContext, oDataPoint, oCriticalityConfigValues) {
        var sState = oCriticalityConfigValues.None;
        if (oDataPoint.Criticality) {
            sState = criticality2state(oDataPoint.Criticality, oCriticalityConfigValues);
        } else if (oDataPoint.CriticalityCalculation) {
            var sFormattedPath = sap.ui.model.odata.AnnotationHelper.format(iContext, oDataPoint.Value);
            var sPath = sFormattedPath.match(/path *: *'.*?',/g);
            if (sPath) {
                var fFormatFunc = generateCriticalityCalculationStateFunction(oDataPoint.CriticalityCalculation, oCriticalityConfigValues);
                sap.ovp.cards.AnnotationHelper.formatFunctions.count++;
                var fName = "formatCriticalityCalculation" + sap.ovp.cards.AnnotationHelper.formatFunctions.count;
                sap.ovp.cards.AnnotationHelper.formatFunctions[fName] = fFormatFunc;
                sState = "{" + sPath + " formatter: 'sap.ovp.cards.AnnotationHelper.formatFunctions." + fName + "'}";
            }
        }

        return sState;
    }

    function getNavigationPrefix(oMetaModel, oEntityType, sProperty) {
        var sExpand = "";
        var aParts = sProperty.split("/");

        if (aParts.length > 1) {
            for (var i = 0; i < (aParts.length - 1); i++) {
                var oAssociationEnd = oMetaModel.getODataAssociationEnd(oEntityType, aParts[i]);
                if (oAssociationEnd) {
                    oEntityType = oMetaModel.getODataEntityType(oAssociationEnd.type);
                    if (sExpand) {
                        sExpand = sExpand + "/";
                    }
                    sExpand = sExpand + aParts[i];
                } else {
                    return sExpand;
                }
            }
        }

        return sExpand;
    }

    sap.ovp.cards.AnnotationHelper.formatField = function (iContext, oItem) {
        return formatField(iContext,oItem);
    };

    /*
     * This formatter method parses the List-Card List's items aggregation path in the Model.
     * The returned path may contain also sorter definition (for the List) sorting is defined
     * appropriately via respected Annotations.
     *
     * @param iContext
     * @param itemsPath
     * @returns List-Card List's items aggregation path in the Model
     */
    sap.ovp.cards.AnnotationHelper.formatItems = function (iContext, oEntitySet) {
        var oModel = iContext.getSetting('ovpCardProperties');

        var bAddODataSelect = oModel.getProperty("/addODataSelect");
        var oMetaModel = oModel.getProperty("/metaModel");
        var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
        var oSelectionVariant = oEntityType[oModel.getProperty('/selectionAnnotationPath')];
        var oPresentationVariant = oEntityType[oModel.getProperty('/presentationAnnotationPath')];
        var sEntitySetPath = "/" + oEntitySet.name;
        var aAnnotationsPath = Array.prototype.slice.call(arguments, 2);

        //check if entity set needs parameters
        // if selection-annotations path is supplied - we need to resolve it in order to resolve the full entity-set path
        if (oSelectionVariant) {
            if (oSelectionVariant && oSelectionVariant.Parameters) {
                // in case we have UI.SelectionVariant annotation defined on the entityType including Parameters - we need to resolve the entity-set path to include it
                sEntitySetPath = sap.ovp.cards.AnnotationHelper.resolveParameterizedEntitySet(iContext.getSetting('dataModel'), oEntitySet, oSelectionVariant);
            }
        }

        var result = "{path: '" + sEntitySetPath + "', length: " + getItemsLength(oModel);


        //prepare the select fields in case flag is on
        var aSelectFields = [];
        if (bAddODataSelect) {
            aSelectFields = getSelectFields(iContext, oMetaModel, oEntityType, aAnnotationsPath);
        }
        //prepare the expand list if navigation properties are used
        var aExpand = getExpandList(oMetaModel, oEntityType, aAnnotationsPath);

        //add select and expand parameters to the binding info string if needed
        if (aSelectFields.length > 0 || aExpand.length > 0) {
            result = result + ", parameters: {";
            if (aSelectFields.length > 0) {
                result = result + "select: '" + aSelectFields.join(',') + "'";
            }

            if (aExpand.length > 0) {
                if (aSelectFields.length > 0) {
                    result = result + ", ";
                }
                result = result + "expand: '" + aExpand.join(',') + "'";
            }
            result = result + "}";
        }

        //apply sorters information
        var aSorters = getSorters(oModel, oPresentationVariant);
        if (aSorters.length > 0) {
            result = result + ", sorter:" + JSON.stringify(aSorters);
        }

        //apply filters information
        var aFilters = getFilters(oModel, oSelectionVariant);
        if (aFilters.length > 0) {
            result = result + ", filters:" + JSON.stringify(aFilters);
        }
        result = result + "}";

        // returning the parsed path for the Card's items-aggregation binding
        return result;
    };

    /**
     * returns an array of navigation properties prefixes to be used in an odata $expand parameter
     *
     * @param oMetaModel - metamodel to get the annotations to query
     * @param oEntityType - the relevant entityType
     * @param aAnnotationsPath - an array of annotation path to check
     * @returns {Array} of navigation properties prefixes to be used in an odata $expand parameter
     */
    function getExpandList(oMetaModel, oEntityType, aAnnotationsPath) {
        var aExpand = [];
        var sAnnotationPath, oBindingContext, aColl, sExpand;

        //loop over the annotation paths
        for (var i = 0; i < aAnnotationsPath.length; i++) {
            if (!aAnnotationsPath[i]) {
                continue;
            }
            sAnnotationPath = oEntityType.$path + "/" + aAnnotationsPath[i];
            oBindingContext = oMetaModel.createBindingContext(sAnnotationPath);
            aColl = oBindingContext.getObject();
            //if the annotationPath does not exists there is no BindingContext
            aColl = aColl ? aColl : [];
            for (var j = 0; j < aColl.length; j++) {
                if (aColl[j].Value && aColl[j].Value.Path) {
                    sExpand = getNavigationPrefix(oMetaModel, oEntityType, aColl[j].Value.Path);
                    if (sExpand && aExpand.indexOf(sExpand) === -1) {
                        aExpand.push(sExpand);
                    }
                }
            }
        }
        return aExpand;
    }

    /**
     * returns an array of properties paths to be used in an odata $select parameter
     *
     * @param oMetaModel - metamodel to get the annotations to query
     * @param oEntityType - the relevant entityType
     * @param aAnnotationsPath - an array of annotation path to check
     * @returns {Array} of properties paths to be used in an odata $select parameter
     */
    function getSelectFields(iContext, oMetaModel, oEntityType, aAnnotationsPath) {

        var aSelectFields = [];
        var sAnnotationPath, oBindingContext, aColl;

        //loop over the annotation paths
        for (var i = 0; i < aAnnotationsPath.length; i++) {
            if (!aAnnotationsPath[i]) {
                continue;
            }
            sAnnotationPath = oEntityType.$path + "/" + aAnnotationsPath[i];
            oBindingContext = oMetaModel.createBindingContext(sAnnotationPath);
            aColl = oBindingContext.getObject();
            //if the annotationPath does not exists there is no BindingContext
            aColl = aColl ? aColl : [];

            var oItem;
            var aItemValue;
            var sFormattedField;
            var sRecordType;
            for (var j = 0; j < aColl.length; j++) {

                aItemValue = [];
                oItem = aColl[j];
                sFormattedField = "";

                sRecordType = oItem.RecordType;

                if (sRecordType === "com.sap.vocabularies.UI.v1.DataField") {
                    // in case of a DataField we format the field to get biding string
                    sFormattedField = _formatField(iContext,oItem,oEntityType,oMetaModel);

                } else if (sRecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {

                    // in case of DataFieldForAnnotation we resolve the DataPoint target path of the DataField and format the field to get biding string
                    var sTargetPath = getTargetPathForDataFieldForAnnotation(oEntityType.$path, oItem);
                    sFormattedField = _formatDataPoint(iContext, oMetaModel.getProperty(sTargetPath), oEntityType, oMetaModel);

                } else if (sRecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" && oItem.Url) {

                    // format the URL ONLY IN CASE NO UrlRef member resides under it
                    var sFormattedUrl;
                    if (!oItem.Url.UrlRef) {
                        sFormattedUrl = sap.ui.model.odata.AnnotationHelper.format(iContext, oItem.Url);
                    }

                    // meaning binding which needs to be evaluated at runtime
                    if (sFormattedUrl && sFormattedUrl.substring(0,2) === "{=") {
                        sFormattedField = sFormattedUrl;
                    }
                }

                // if we have found a relevant binding-info-string this iteration then parse it to get binded properties
                if (sFormattedField) {
                    aItemValue = getPropertiesFromBindingString(sFormattedField);
                }

                if (aItemValue && aItemValue.length > 0) {
                    // for each property found we check if has sap:unit and sap:text
                    var sItemValue;
                    for (var k = 0; k < aItemValue.length; k++) {
                        sItemValue = aItemValue[k];

                        // if this property is found for the first time - look for its unit and text properties as well
                        if (!aSelectFields[sItemValue]) {

                            aSelectFields[sItemValue] = true;

                            // checking if we need to add also the sap:unit property of the field's value
                            var sUnitPropName = getUnitColumn(sItemValue, oEntityType);
                            if (sUnitPropName && sUnitPropName !== sItemValue) {
                                aSelectFields[sUnitPropName] = true;
                            }

                            // checking if we need to add also the sap:text property of the field's value
                            var sTextPropName = getTextPropertyForEntityProperty(oMetaModel, oEntityType, sItemValue);
                            if (sTextPropName && sTextPropName !== sItemValue) {
                                aSelectFields[sTextPropName] = true;
                            }
                        }
                    }
                }
            }
        }
        // return all relevant property names
        return Object.keys(aSelectFields);
    }

    function getPropertiesFromBindingString(sBinding) {

        var regexBindingEvaluation = /\${([a-zA-Z0-9|\/]*)/g;
        var regexBindingNoPath = /[^[{]*[a-zA-Z0-9]/g;
        var regexBindingPath = /path *\: *\'([a-zA-Z0-9]+)*\'/g;

        var regex, index, matches = [];

        if (sBinding.substring(0, 2) === "{=") {
            /*
             meaning binding string looks like "{= <rest of the binding string>}"
             which is a binding which needs to be evaluated using some supported function
             properties appear as ${propertyName} inside the string
             */
            regex = regexBindingEvaluation;

            /* index is 1 as each match found by this regular expression (by invoking regex.exec(string) below) */
            /* is an array of 2 items, for example ["${Address}", "Address"] so we need the 2nd result each match found */
            index = 1;

        } else if (sBinding.indexOf("path") !== -1) {

            /* In a scenario where binding contains string like "{propertyName} {path:'propertyName'}" */
            /* Here we get the properties without path and add it to array matches*/
            var matchWithNoPath = regexBindingNoPath.exec(sBinding);
            while (matchWithNoPath) {
                if (matchWithNoPath[0].indexOf("path") === -1) {
                    matches.push(matchWithNoPath[0]);
                }
                matchWithNoPath = regexBindingNoPath.exec(sBinding);
            }

            /* meaning binding contains string like "{path:'propertyName'}" */
            regex = regexBindingPath;

            /* index is 1 as each match found by this regular expression (by invoking regex.exec(string) below) */
            /* is an array of 2 items, for example ["{path: 'Address'}", "Address"] so we need the 2nd result each match found */
            index = 1;

        } else {
            /* meaning binding contains string like "{'propertyName'}" */
            regex = regexBindingNoPath;

            /* index is 0 as each match found by this regular expression (by invoking regex.exec(string) below) */
            /* is an array of one item, for example ["Address"] so we need the 1st result each match found */
            index = 0;
        }

        var match = regex.exec(sBinding);
        while (match) {
            if (match[index]) {
                matches.push(match[index]);
            }
            match = regex.exec(sBinding);
        }
        return matches;
    }

    /**
     * return the sorters that need to be applyed on an aggregation
     *
     * @param ovpCardProperties - card properties model which might contains sort configurations
     * @param oPresentationVariant - optional presentation variant annotation with SortOrder configuration
     * @returns {Array} of model sorters
     */
    function getSorters(ovpCardProperties, oPresentationVariant) {
        var aSorters = [];
        var oSorter, bDescending;

        //get the configured sorter if exist and append them to the sorters array
        var sPropertyPath = ovpCardProperties.getProperty("/sortBy");
        if (sPropertyPath) {
            // If sorting is enabled by card configuration
            var sSortOrder = ovpCardProperties.getProperty('/sortOrder');
            if (sSortOrder && sSortOrder.toLowerCase() !== 'descending') {
                bDescending = false;
            } else {
                bDescending = true;
            }
            oSorter = {
                path: sPropertyPath,
                descending: bDescending
            };
            aSorters.push(oSorter);
        }

        //get the sorters from the presentation variant annotations if exists
        var aSortOrder = oPresentationVariant && oPresentationVariant.SortOrder || undefined;
        var oSortOrder, sPropertyPath;
        if (aSortOrder) {
            for (var i = 0; i < aSortOrder.length; i++) {
                oSortOrder = aSortOrder[i];
                sPropertyPath = oSortOrder.Property.PropertyPath;
                bDescending = getBooleanValue(oSortOrder.Descending, true);
                oSorter = {
                    path: sPropertyPath,
                    descending: bDescending
                };
                aSorters.push(oSorter);
            }
        }

        return aSorters;
    }


    sap.ovp.cards.AnnotationHelper.getCardFilters = function (ovpCardProperties) {
        var oEntityType = ovpCardProperties.getProperty('/entityType');
        var oSelectionVariant = oEntityType[ovpCardProperties.getProperty('/selectionAnnotationPath')];

        return getFilters(ovpCardProperties, oSelectionVariant);
    };

    /**
     * return the filters that need to be applyed on an aggregation
     *
     * @param ovpCardProperties - card properties model which might contains filters configurations
     * @param oSelectionVariant - optional selection variant annotation with SelectOptions configuration
     * @returns {Array} of model filters
     */
    function getFilters(ovpCardProperties, oSelectionVariant) {
        var aFilters = [];
        //get the configured filters if exist and append them to the filter array
        var aConfigFilters = ovpCardProperties.getProperty("/filters");
        if (aConfigFilters) {
            aFilters = aFilters.concat(aConfigFilters);
        }

        //get the filters from the selection variant annotations if exists
        var aSelectOptions = oSelectionVariant && oSelectionVariant.SelectOptions;
        var oSelectOption, sPropertyPath, oRange;
        if (aSelectOptions) {
            for (var i = 0; i < aSelectOptions.length; i++) {
                oSelectOption = aSelectOptions[i];
                sPropertyPath = oSelectOption.PropertyName.PropertyPath;
                //a select option might contains more then one filter in the Ranges array
                for (var j = 0; j < oSelectOption.Ranges.length; j++) {
                    oRange = oSelectOption.Ranges[j];
                    if (oRange.Sign.EnumMember === "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I") {
                        //create the filter. the Low value is mandatory
                        var oFilter = {
                            path: sPropertyPath,
                            operator: oRange.Option.EnumMember.split("/")[1],
                            value1: getPrimitiveValue(oRange.Low),
                            value2: getPrimitiveValue(oRange.High)
                        };
                        //append the filter to the filters array
                        aFilters.push(oFilter);
                    }
                }
            }
        }

        return aFilters;
    }

    function getBooleanValue(oValue, bDefault) {
        if (oValue && oValue.Boolean) {
            if (oValue.Boolean.toLowerCase() === "true") {
                return true;
            } else if (oValue.Boolean.toLowerCase() === "false") {
                return false;
            }
        }
        return bDefault;
    }

    function getNumberValue(oValue) {
        var value;

        if (oValue) {
            if (oValue.String) {
                value = Number(oValue.String);
            } else if (oValue.Int) {
                value = Number(oValue.Int);
            } else if (oValue.Decimal) {
                value = Number(oValue.Decimal);
            } else if (oValue.Double) {
                value = Number(oValue.Double);
            } else if (oValue.Single) {
                value = Number(oValue.Single);
            }
        }

        return value;
    }

    function getPrimitiveValue(oValue) {
        var value;

        if (oValue) {
            if (oValue.String) {
                value = oValue.String;
            } else if (oValue.Boolean) {
                value = getBooleanValue(oValue);
            } else {
                value = getNumberValue(oValue);
            }
        }

        return value;
    }


    //This object is responsive for devices
    //the id build by Type-ListType-flavor
    var ITEM_LENGTH = {
        "List_condensed": {phone: 5, tablet: 5, desktop: 5},
        "List_extended": {phone: 3, tablet: 3, desktop: 3},
        "List_condensed_bar": {phone: 5, tablet: 5, desktop: 5},
        "List_extended_bar": {phone: 3, tablet: 3, desktop: 3},
        "Table": {phone: 5, tablet: 5, desktop: 5},
        "Stack_simple": {phone: 20, tablet: 20, desktop: 20},
        "Stack_complex": {phone: 5, tablet: 5, desktop: 5}
    };

    function getItemsLength(oOvpCardPropertiesModel) {
        var type = oOvpCardPropertiesModel.getProperty('/contentFragment');
        var listType = oOvpCardPropertiesModel.getProperty('/listType');
        var flavor = oOvpCardPropertiesModel.getProperty('/listFlavor');
        var oItemSizes;

        var device = "desktop";

        //get current device
        if (sap.ui.Device.system.phone) {
            device = "phone";
        } else if (sap.ui.Device.system.tablet) {
            device = "tablet";
        }

        //check the current card type and get the sizes objects
        if (type == "sap.ovp.cards.list.List") {
            if (listType == "extended") {
                if (flavor == "bar") {
                    oItemSizes = ITEM_LENGTH["List_extended_bar"];
                } else {
                    oItemSizes = ITEM_LENGTH["List_extended"];
                }
            } else if (flavor == "bar") {
                oItemSizes = ITEM_LENGTH["List_condensed_bar"];
            } else {
                oItemSizes = ITEM_LENGTH["List_condensed"];
            }
        } else if (type == "sap.ovp.cards.table.Table") {
            oItemSizes = ITEM_LENGTH["Table"];
        } else if (type == "sap.ovp.cards.stack.Stack") {

            if (oOvpCardPropertiesModel.getProperty('/objectStreamCardsNavigationProperty')) {
                oItemSizes = ITEM_LENGTH["Stack_complex"];
            } else {
                oItemSizes = ITEM_LENGTH["Stack_simple"];
            }
        }

        if (oItemSizes) {
            return oItemSizes[device];
        }

        return 5;
    }

    sap.ovp.cards.AnnotationHelper.formatUrl = function (iContext, sUrl) {
        if (sUrl.charAt(0) === '/' || sUrl.indexOf("http") === 0) {
            return sUrl;
        }
        var sBaseUrl = iContext.getModel().getProperty("/baseUrl");
        if (sBaseUrl) {
            return sBaseUrl + "/" + sUrl;
        }
        return sUrl;
    };

    sap.ovp.cards.AnnotationHelper.getDataPointsCount = function (iContext, aCollection) {
        var aDataPoints = getSortedDataPoints(iContext, aCollection);
        return aDataPoints.length;
    };

    sap.ovp.cards.AnnotationHelper.getFirstDataPointValue = function (iContext, aCollection) {
        return sap.ovp.cards.AnnotationHelper.getDataPointValue(iContext, aCollection, 0);
    };

    sap.ovp.cards.AnnotationHelper.getSecondDataPointValue = function (iContext, aCollection) {
        return sap.ovp.cards.AnnotationHelper.getDataPointValue(iContext, aCollection, 1);
    };

    sap.ovp.cards.AnnotationHelper.getDataPointValue = function (iContext, aCollection, index) {
        var aDataPoints = getSortedDataPoints(iContext, aCollection),
            oDataPoint = aDataPoints[index];

        if (oDataPoint && oDataPoint.Value && oDataPoint.Value.Path) {
            return oDataPoint.Value.Path;
        }
        return "";
    };

    sap.ovp.cards.AnnotationHelper.getFirstDataFieldName = function (iContext, aCollection) {
        return getDataFieldName(iContext, aCollection, 0);
    };

    sap.ovp.cards.AnnotationHelper.getSecondDataFieldName = function (iContext, aCollection) {
        return getDataFieldName(iContext, aCollection, 1);
    };

    sap.ovp.cards.AnnotationHelper.getThirdDataFieldName = function (iContext, aCollection) {
        return getDataFieldName(iContext, aCollection, 2);
    };

    sap.ovp.cards.AnnotationHelper.formatFirstDataFieldValue = function (iContext, aCollection) {
        return formatDataField(iContext, aCollection, 0);
    };

    sap.ovp.cards.AnnotationHelper.formatSecondDataFieldValue = function (iContext, aCollection) {
        return formatDataField(iContext, aCollection, 1);
    };

    sap.ovp.cards.AnnotationHelper.formatThirdDataFieldValue = function (iContext, aCollection) {
        return formatDataField(iContext, aCollection, 2);
    };

    sap.ovp.cards.AnnotationHelper.formatFourthDataFieldValue = function (iContext, aCollection) {
        return formatDataField(iContext, aCollection, 3);
    };

    sap.ovp.cards.AnnotationHelper.formatFifthDataFieldValue = function (iContext, aCollection) {
        return formatDataField(iContext, aCollection, 4);
    };

    sap.ovp.cards.AnnotationHelper.formatSixthDataFieldValue = function (iContext, aCollection) {
        return formatDataField(iContext, aCollection, 5);
    };

    sap.ovp.cards.AnnotationHelper.getFirstDataPointName = function (iContext, aCollection) {
        return getDataPointName(iContext, aCollection, 0);
    };

    sap.ovp.cards.AnnotationHelper.getSecondDataPointName = function (iContext, aCollection) {
        return getDataPointName(iContext, aCollection, 1);
    };

    sap.ovp.cards.AnnotationHelper.getThirdDataPointName = function (iContext, aCollection) {
        return getDataPointName(iContext, aCollection, 2);
    };

    sap.ovp.cards.AnnotationHelper.formatFirstDataPointValue = function (iContext, aCollection) {
        return formatDataPoint(iContext, aCollection, 0);
    };

    sap.ovp.cards.AnnotationHelper.formatSecondDataPointValue = function (iContext, aCollection) {
        return formatDataPoint(iContext, aCollection, 1);
    };

    sap.ovp.cards.AnnotationHelper.formatThirdDataPointValue = function (iContext, aCollection) {
        return formatDataPoint(iContext, aCollection, 2);
    };

    sap.ovp.cards.AnnotationHelper.formatFirstDataPointState = function (iContext, aCollection) {
        return formatDataPointState(iContext, aCollection, 0);
    };

    sap.ovp.cards.AnnotationHelper.formatSecondDataPointState = function (iContext, aCollection) {
        return formatDataPointState(iContext, aCollection, 1);
    };

    sap.ovp.cards.AnnotationHelper.formatThirdDataPointState = function (iContext, aCollection) {
        return formatDataPointState(iContext, aCollection, 2);
    };

    sap.ovp.cards.AnnotationHelper.formatKPIHeaderState = function (iContext, oDataPoint) {
        return formatDataPointToValue(iContext, oDataPoint, sap.ovp.cards.AnnotationHelper.criticalityConstants.ColorValues);
    };

    /*
     * @param iContext
     * @returns 0 for false - there are no actions for this context
     *          1 for true - there are actions for this context
     *          does not return actual boolean - so we won't need to parse the result in the xml
     */
    sap.ovp.cards.AnnotationHelper.hasActions = function (iContext, aCollection) {
        var oItem;
        for (var i = 0; i < aCollection.length; i++){
            oItem = aCollection[i];
            if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
                oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
                oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl"){
                return 1;
            }
        }
        return 0;
    };

    sap.ovp.cards.AnnotationHelper.isFirstDataPointPercentageUnit = function (iContext, aCollection) {
        var oDataPoint = getSortedDataPoints(iContext, aCollection)[0];

        if (oDataPoint && oDataPoint.Value && oDataPoint.Value.Path) {
            var sEntityTypePath = iContext.getPath().substr(0, iContext.getPath().lastIndexOf("/") + 1);
            var oModel = iContext.getModel();
            var oEntityType = oModel.getProperty(sEntityTypePath);
            var oProperty = oModel.getODataProperty(oEntityType, oDataPoint.Value.Path);
            if (oProperty && oProperty["Org.OData.Measures.V1.Unit"]) {
                return oProperty["Org.OData.Measures.V1.Unit"].String === "%";
            }
        }
        return false;
    };

    sap.ovp.cards.AnnotationHelper.resolveEntityTypePath = function (oAnnotationPathContext) {
        var sAnnotationPath = oAnnotationPathContext.getObject();
        var oModel = oAnnotationPathContext.getModel();
        var oMetaModel = oModel.getProperty("/metaModel");
        var oEntitySet = oMetaModel.getODataEntitySet(oModel.getProperty("/entitySet"));
        var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
        sAnnotationPath = oEntityType.$path + "/" + sAnnotationPath;
        return oMetaModel.createBindingContext(sAnnotationPath);
    };

    sap.ovp.cards.AnnotationHelper.resolveParameterizedEntitySet = function (oDataModel, oEntitySet, oSelectionVariant) {

        jQuery.sap.require("sap.ui.model.analytics.odata4analytics");
        var path = "";
        var o4a = new sap.ui.model.analytics.odata4analytics.Model(sap.ui.model.analytics.odata4analytics.Model.ReferenceByModel(oDataModel));
        var queryResult = o4a.findQueryResultByName(oEntitySet.name);
        var queryResultRequest = new sap.ui.model.analytics.odata4analytics.QueryResultRequest(queryResult);
        var parameterization = queryResult.getParameterization();

        if (parameterization) {
            queryResultRequest.setParameterizationRequest(new sap.ui.model.analytics.odata4analytics.ParameterizationRequest(parameterization));
            jQuery.each(oSelectionVariant.Parameters, function () {
                if (this.RecordType === "com.sap.vocabularies.UI.v1.IntervalParameter") {
                    queryResultRequest.getParameterizationRequest().setParameterValue(
                        this.PropertyName.PropertyPath,
                        this.PropertyValueFrom.String,
                        this.PropertyValueTo.String
                    );
                } else {
                    queryResultRequest.getParameterizationRequest().setParameterValue(
                        this.PropertyName.PropertyPath,
                        this.PropertyValue.String
                    );
                }
            });
        }

        try {
            path = queryResultRequest.getURIToQueryResultEntitySet();
        } catch (exception) {
            queryResult = queryResultRequest.getQueryResult();
            path = "/" + queryResult.getEntitySet().getQName();
            jQuery.sap.log.error("getEntitySetPathWithParameters", "binding path with parameters failed - " + exception
                || exception.message);
        }
        return path;
    };

    sap.ovp.cards.AnnotationHelper.getAssociationObject = function (oModel, sAssociation, ns) {
        // find a nicer way of getting association set entry in meta model
        var aAssociations = oModel.getServiceMetadata().dataServices.schema[0].association;
        for (var i = 0; i < aAssociations.length; i++) {
            if (ns + "." + aAssociations[i].name === sAssociation) {
                return aAssociations[i];
            }
        }
    };


    /**************************** Formatters & Helpers for KPI-Header logic  ****************************/

    /* Returns binding path for singleton */
    sap.ovp.cards.AnnotationHelper.getAggregateNumber = function (iContext, oEntitySet, oDataPoint, oSelectionVariant) {
        var measure = oDataPoint.Value.Path;
        var ret = "";
        var bParams = oSelectionVariant && oSelectionVariant.Parameters;
        var filtersString = "";

        if (bParams) {
            var dataModel = iContext.getSetting("dataModel");
            var path = sap.ovp.cards.AnnotationHelper.resolveParameterizedEntitySet(dataModel, oEntitySet, oSelectionVariant);
            ret += "{path: '" + path + "'";
        } else {
            ret += "{path: '/" + oEntitySet.name + "'";
        }

        ret += ", length: 1";
        var oOvpCardSettings = iContext.getSetting('ovpCardProperties');
        var oEntityType = oOvpCardSettings.getProperty("/entityType");
        var unitColumn = getUnitColumn(measure, oEntityType);
        var aFilters = getFilters(oOvpCardSettings, oSelectionVariant);

        if (aFilters.length > 0) {
            filtersString += ", filters: " + JSON.stringify(aFilters);
        }

        var selectArr = [];
        selectArr.push(measure);
        if (unitColumn) {
            selectArr.push(unitColumn);
        }
        if (oDataPoint.TrendCalculation && oDataPoint.TrendCalculation.ReferenceValue && oDataPoint.TrendCalculation.ReferenceValue.Path) {
            selectArr.push(oDataPoint.TrendCalculation.ReferenceValue.Path);
        }

        return ret + ", parameters:{select:'" + selectArr.join(",") + "'}" + filtersString + "}";
    };


    /* Creates binding path for NumericContent value */
    sap.ovp.cards.AnnotationHelper.formThePathForAggregateNumber = function (iContext, dataPoint) {
        if (!dataPoint || !dataPoint.Value || !dataPoint.Value.Path) {
            return "";
        }

        return formatField(iContext, dataPoint, true, false);
    };


    /* Creates binding path for trend icon */
    sap.ovp.cards.AnnotationHelper.formThePathForTrendIcon = function (dataPoint) {
        if (!dataPoint || !dataPoint.Value || !dataPoint.Value.Path || !dataPoint.TrendCalculation) {
            return "";
        }

        if (dataPoint.TrendCalculation &&
            dataPoint.TrendCalculation.ReferenceValue &&
            dataPoint.TrendCalculation.ReferenceValue.Path) {
            return "{parts: [{path:'" + dataPoint.Value.Path + "'}, {path:'" + dataPoint.TrendCalculation.ReferenceValue.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.returnTrendDirection'}";
        } else {
            return "{parts: [{path:'" + dataPoint.Value.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.returnTrendDirection'}";
        }
    };

    /* Formatter for Trend Direction for Header */
    sap.ovp.cards.AnnotationHelper.returnTrendDirection = function (aggregateValue, referenceValue) {
        aggregateValue = Number(aggregateValue);
        var ovpModel = this.getModel("ovpCardProperties");
        if (!ovpModel) {
            return;
        }
        var fullQualifier = ovpModel.getProperty("/dataPointAnnotationPath");
        var dataPoint = ovpModel.getProperty("/entityType")[fullQualifier];
        var finalReferenceValue, upDifference, downDifference;

        if (dataPoint.TrendCalculation.ReferenceValue) {
            if (dataPoint.TrendCalculation.ReferenceValue.Path) {
                finalReferenceValue = Number(referenceValue);
            } else {
                finalReferenceValue = getNumberValue(dataPoint.TrendCalculation.ReferenceValue);
            }
        }
        if (dataPoint.TrendCalculation.UpDifference) {
            upDifference = getNumberValue(dataPoint.TrendCalculation.UpDifference);
        }
        if (dataPoint.TrendCalculation.DownDifference) {
            downDifference = getNumberValue(dataPoint.TrendCalculation.DownDifference);
        }
        if (!dataPoint.TrendCalculation.UpDifference && (aggregateValue - finalReferenceValue >= 0)) {
            return "Up";
        }
        if (!dataPoint.TrendCalculation.DownDifference && (aggregateValue - finalReferenceValue <= 0)) {
            return "Down";
        }

        if (finalReferenceValue && upDifference && (aggregateValue - finalReferenceValue >= upDifference)) {
            return "Up";
        }
        if (finalReferenceValue && downDifference && (aggregateValue - finalReferenceValue <= downDifference)) {
            return "Down";
        }
    };

    /* Creates binding path for UOM placeholder */
    sap.ovp.cards.AnnotationHelper.formThePathForUOM = function (iContext, dataPoint) {
        if (!dataPoint || !dataPoint.Value || !dataPoint.Value.Path) {
            return "";
        }

        return formatField(iContext, dataPoint, false, true);
    };


    /* Creates binding path for % change */
    sap.ovp.cards.AnnotationHelper.formPathForPercentageChange = function (dataPoint) {
        if (!dataPoint || !dataPoint.TrendCalculation || !dataPoint.TrendCalculation.ReferenceValue) {
            return "";
        }
        if (dataPoint.TrendCalculation.ReferenceValue.Path) {
            return "{parts: [{path:'" + dataPoint.Value.Path + "'}, {path:'" + dataPoint.TrendCalculation.ReferenceValue.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.returnPercentageChange'}";
        } else {
            return "{parts: [{path:'" + dataPoint.Value.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.returnPercentageChange'}";
        }
    };


    /* Formatter for % change for Header */
    sap.ovp.cards.AnnotationHelper.returnPercentageChange = function (aggregateValue, referenceValuePath) {
        jQuery.sap.require("sap.ui.core.format.NumberFormat");
        var ret = "";
        aggregateValue = Number(aggregateValue);
        var ovpModel = this.getModel("ovpCardProperties");
        if (!ovpModel) {
            return ret;
        }
        var fullQualifier = ovpModel.getProperty("/dataPointAnnotationPath");
        var dataPoint = ovpModel.getProperty("/entityType")[fullQualifier];
        var referenceValue;
        if (!dataPoint.TrendCalculation) {
            return ret;
        }
        if (dataPoint.TrendCalculation.ReferenceValue) {
            if (dataPoint.TrendCalculation.ReferenceValue.String) {
                referenceValue = Number(dataPoint.TrendCalculation.ReferenceValue.String);
            }
            if (dataPoint.TrendCalculation.ReferenceValue.Path) {
                referenceValue = Number(referenceValuePath);
            }
            if (!referenceValue || referenceValue == 0) {
                return ret;
            }
            var percentNumber = ((Number(aggregateValue) - referenceValue) / referenceValue);
            var percentFormatter = sap.ui.core.format.NumberFormat.getPercentInstance({
                style: 'short',
                minFractionDigits: 2,
                maxFractionDigits: 2
            });
         
            return percentFormatter.format(percentNumber);
        }
    };


    /*
     * Reads groupBy from annotation and prepares comma separated list
     */
    sap.ovp.cards.AnnotationHelper.listGroupBy = function (oPresentationVariant) {
        var result = "";
        var bPV = oPresentationVariant && oPresentationVariant.GroupBy;
        if (!bPV) {
            return result;
        }

        var metaModel = this.getModel('ovpCardProperties').getProperty("/metaModel");
        var oEntityType = this.getModel('ovpCardProperties').getProperty("/entityType");
        var groupByList;

        if (oPresentationVariant.GroupBy.constructor === Array) {
            groupByList = oPresentationVariant.GroupBy;
        } else if (!oPresentationVariant.GroupBy.Collection) {
            return result;
        } else {
            groupByList = oPresentationVariant.GroupBy.Collection;
        }


        var propVal;
        jQuery.each(groupByList, function () {

            propVal = getLabelForEntityProperty(metaModel, oEntityType, this.PropertyPath);
            if (!propVal) {
                return;
            }

            result += propVal;
            result += ", ";
        });
        if (result[result.length - 1] === " " && result[result.length - 2] === ",") {
            result = result.substring(0, result.length - 2);
        }
        return result == "" ? "" : sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("By", [result]);
    };

    /*
    * returns the string for the filter-by values of the KPI Header
    * */
    sap.ovp.cards.AnnotationHelper.formTheFilterByString = function(iContext, oSelectionVariant) {
        var oCardPropsModel = iContext.getSetting('ovpCardProperties');
        var oEntityType = oCardPropsModel.getProperty("/entityType");
        var oMetaModel = oCardPropsModel.getProperty("/metaModel");
        var aFilters = getFilters(oCardPropsModel, oSelectionVariant);
        var sProp;
        var sTextPropKey;

        //Clean from Filter array all the filters with sap-text that the filter array contains there sap-text
        for (var i = 0; i < aFilters.length; i++ ) {
            sProp = aFilters[i].path;
            sTextPropKey = getTextPropertyForEntityProperty(oMetaModel, oEntityType, sProp);

            //Check if there is sap-text, in case there is checks that the Filter array contains it
            if (sTextPropKey !== sProp) {
                for (var j = 0; j < aFilters.length; j++ ) {

                    // if there is sap test - we won't show the original filter (instead we will show the sap-text) and we clean it from the array
                    if ((aFilters[j].path == sTextPropKey)){
                        aFilters.splice(i, 1);
                        break;
                    }
                }
            }
        }
        // build the filter string
        return generateStringForFilters(aFilters);
    };

    /************************ METADATA PARSERS ************************/

    function generateStringForFilters(aFilters) {
        var aFormatterFilters = [];

        for (var i = 0; i < aFilters.length; i++ ) {
            aFormatterFilters.push(generateSingleFilter(aFilters[i]));
        }

        return aFormatterFilters.join(', ');
    }

    function generateSingleFilter(oFilter) {
        var bNotOperator = false;
        var sFormattedFilter = oFilter.value1;

        if (oFilter.operator[0] === "N") {
            bNotOperator = true;
        }

        if (oFilter.value2) {
            sFormattedFilter += " - " + oFilter.value2;
        }

        if (bNotOperator) {
            sFormattedFilter = sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("kpiHeader_Filter_NotOperator", [sFormattedFilter]);
        }

        return sFormattedFilter;
    }


    /* Returns column name that contains the unit for the measure */
    function getUnitColumn (measure, oEntityType) {
        var properties = oEntityType.property;
        for (var i = 0, len = properties.length; i < len; i++) {
            if (properties[i].name == measure) {
                if (properties[i].hasOwnProperty("sap:unit")) {
                    return properties[i]["sap:unit"];
                }
                break;
            }
        }
        return null;
    }

    function getLabelForEntityProperty(oMetadata, oEntityType, sPropertyName) {
        return getAttributeValueForEntityProperty(oMetadata, oEntityType,
            sPropertyName, "com.sap.vocabularies.Common.v1.Label");
    }

    function getTextPropertyForEntityProperty(oMetamodel, oEntityType, sPropertyName) {
        return getAttributeValueForEntityProperty(oMetamodel, oEntityType,
            sPropertyName, "sap:text");
    }

    function getAttributeValueForEntityProperty(oMetamodel, oEntityType, sPropertyName, sAttributeName) {
        var oProp = oMetamodel.getODataProperty(oEntityType, sPropertyName);
        if (!oProp) {
            jQuery.sap.log.error("No Property Found for with Name '" + sPropertyName
                + " For Entity-Type '" + oEntityType.name + "'");
            return;
        }
        var oPropAttVal = oProp[sAttributeName];
        if (oPropAttVal) {
            if (sAttributeName === "com.sap.vocabularies.Common.v1.Label") {
                return oPropAttVal.String;
            }
            return oPropAttVal;
        }

        return oProp.name;
    }

    sap.ovp.cards.AnnotationHelper._criticality2state = criticality2state;
    sap.ovp.cards.AnnotationHelper._generateCriticalityCalculationStateFunction = generateCriticalityCalculationStateFunction;
    sap.ovp.cards.AnnotationHelper._getPropertiesFromBindingString = getPropertiesFromBindingString;
    sap.ovp.cards.AnnotationHelper.sortCollectionByImportance = sortCollectionByImportance;

    sap.ovp.cards.AnnotationHelper.formatField.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formThePathForAggregateNumber.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formThePathForUOM.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formTheFilterByString.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getAggregateNumber.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getFirstDataFieldName.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getSecondDataFieldName.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getThirdDataFieldName.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatFirstDataFieldValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatSecondDataFieldValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatThirdDataFieldValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatFourthDataFieldValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatFifthDataFieldValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatSixthDataFieldValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getDataPointsCount.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getFirstDataPointName.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getSecondDataPointName.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getThirdDataPointName.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatFirstDataPointValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatSecondDataPointValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatThirdDataPointValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatFirstDataPointState.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatSecondDataPointState.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatThirdDataPointState.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatKPIHeaderState.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatItems.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.formatUrl.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.hasActions.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getFirstDataPointValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.getSecondDataPointValue.requiresIContext = true;
    sap.ovp.cards.AnnotationHelper.isFirstDataPointPercentageUnit.requiresIContext = true;

}());
