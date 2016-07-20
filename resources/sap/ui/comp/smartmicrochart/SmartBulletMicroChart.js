/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/library','sap/suite/ui/microchart/library','sap/ui/comp/providers/ChartProvider','sap/suite/ui/microchart/BulletMicroChart'],function(q,l,M,C,B){"use strict";var S=B.extend("sap.ui.comp.smartmicrochart.SmartBulletMicroChart",{metadata:{library:"sap.ui.comp",properties:{entitySet:{type:"string",group:"Misc",defaultValue:null},smartFilterId:{type:"string",group:"Misc",defaultValue:null},ignoredFields:{type:"string",group:"Misc",defaultValue:null},ignoreFromPersonalisation:{type:"string",group:"Misc",defaultValue:null},chartType:{type:"string",group:"Misc",defaultValue:null},useVariantManagement:{type:"boolean",group:"Misc",defaultValue:true},useChartPersonalisation:{type:"boolean",group:"Misc",defaultValue:true},persistencyKey:{type:"string",group:"Misc",defaultValue:null},currentVariantId:{type:"string",group:"Misc",defaultValue:null},enableAutoBinding:{type:"boolean",group:"Misc",defaultValue:false},chartBindingPath:{type:"string",group:"Misc",defaultValue:null}},events:{initialise:{},beforeRebindChart:{},afterVariantInitialise:{},afterVariantSave:{},afterVariantApply:{},showOverlay:{}}}});S.prototype.setEntitySet=function(e){this.setProperty("entitySet",e);this._initialiseMetadata();};S.prototype.propagateProperties=function(){B.prototype.propagateProperties.apply(this,arguments);this._initialiseMetadata();};S.prototype._initialiseMetadata=function(){if(!this._bIsInitialised){var m=this.getModel();if(m){if(m.bLoadMetadataAsync&&m.getMetaModel()&&m.getMetaModel().loaded){if(!this._bMetaModelLoadAttached){m.getMetaModel().loaded().then(this._onMetadataInitialised.bind(this));this._bMetaModelLoadAttached=true;}}else{this._onMetadataInitialised();}}}};S.prototype._createChartProvider=function(){var m,e;e=this.getEntitySet();m=this.getModel();if(m&&!this._bChartCreated){this._bChartCreated=true;}if(m&&e){this._oChartProvider=new C({entitySet:e,ignoredFields:this.getIgnoredFields(),dateFormatSettings:this.data("dateFormatSettings"),currencyFormatSettings:this.data("currencyFormatSettings"),defaultDropDownDisplayBehaviour:this.data("defaultDropDownDisplayBehaviour"),useSmartField:this.data("useSmartField"),enableInResultForLineItem:this.data("enableInResultForLineItem"),model:m});}};S.prototype._onMetadataInitialised=function(){this._bMetaModelLoadAttached=false;if(!this._bIsInitialised){this._createChartProvider();if(this._oChartProvider){this._oChartViewMetadata=this._oChartProvider.getChartViewMetadata();if(this._oChartViewMetadata){this._bIsInitialised=true;this._assignData();this.fireInitialise();}}}};S.prototype._assignData=function(){if(this._oChartViewMetadata){if(this._oChartViewMetadata.fields&&(this._oChartViewMetadata.fields.length>0)){this._aMeasures=q.grep(this._oChartViewMetadata.fields,function(v,i){return v.isMeasure;});this._aDimensions=q.grep(this._oChartViewMetadata.fields,function(v,i){return v.isDimension;});if(this._aMeasures[0]!==null&&this._aMeasures[0].dataPoint!==null){var a=this._aMeasures[0].dataPoint;if(a.valueFormat!==null){this.setProperty("scale",a.valueFormat.scalefactor,true);}this.setProperty("showActualValue",a.showActualValue,true);this.setProperty("showDeltaValue",a.showDeltaValue,true);this.setProperty("showValueMarker",a.showValueMarker,true);this.setProperty("mode",a.mode,true);this.setProperty("actualValueLabel",a.actualValueLabel,true);this.setProperty("deltaValueLabel",a.deltaValueLabel,true);this.setProperty("targetValueLabel",a.targetValueLabel,true);}if(this._aMeasures[1]!==null&&this._aMeasures[1].dataPoint!==null){var t=this._aMeasures[1].dataPoint;this.setProperty("targetValue",t.value,true);this.setProperty("showTargetValue",t.showTargetValue,true);}if(this._aMeasures[2]!==null&&this._aMeasures[2].dataPoint!==null){var f=this._aMeasures[2].dataPoint;this.setProperty("forecastValue",f.value,true);if(f.valueRange!==null){this.setProperty("minValue",f.valueRange.minValue,true);this.setProperty("maxValue",f.valueRange.maxValue,true);}}this.invalidate();}}};return S;});
