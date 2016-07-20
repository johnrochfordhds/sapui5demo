/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.facetFilterListHandler');
sap.apf.ui.utils.FacetFilterListHandler=function(c,u,C,f){"use strict";function _(){var m=c.createMessageObject({code:"6010",aParameters:[c.getTextNotHtmlEncoded(C.getLabel())]});c.putMessage(m);}this.getFacetFilterListData=function(){var s,F;var o=jQuery.Deferred();var a=C.getValues();a.then(function(b,n){if(b===null||b.length===0){_();o.reject([]);}else{s=C.getAliasNameIfExistsElsePropertyName()||C.getPropertyName();C.getMetadata().then(function(p){F={oCoreApi:c,oUiApi:u,oPropertyMetadata:p,sSelectProperty:s};o.resolve({aFilterValues:b,oFilterRestrictionPropagationPromiseForValues:n,oFormatterArgs:F});});}},function(e){_();o.reject([]);});return o.promise();};this.getSelectedFFValues=function(){var F=jQuery.Deferred();var a=C.getSelectedValues();a.then(function(s,n){F.resolve({aSelectedFilterValues:s,oFilterRestrictionPropagationPromiseForSelectedValues:n});},function(e){_();F.resolve([]);});return F.promise();};this.setSelectedFFValues=function(F){C.setSelectedValues(F);};};
