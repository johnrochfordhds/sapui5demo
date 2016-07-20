/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.BulletChart");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.BulletChart",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"mode":{type:"sap.suite.ui.commons.BulletChartMode",group:"Misc",defaultValue:sap.suite.ui.commons.BulletChartMode.Actual},"scale":{type:"string",group:"Misc",defaultValue:null},"forecastValue":{type:"float",group:"Misc",defaultValue:null},"targetValue":{type:"float",group:"Misc",defaultValue:null},"minValue":{type:"float",group:"Misc",defaultValue:null},"maxValue":{type:"float",group:"Misc",defaultValue:null},"showActualValue":{type:"boolean",group:"Misc",defaultValue:true},"showDeltaValue":{type:"boolean",group:"Misc",defaultValue:false},"showTargetValue":{type:"boolean",group:"Misc",defaultValue:true},"showValueMarker":{type:"boolean",group:"Misc",defaultValue:false},"actualValueLabel":{type:"string",group:"Misc",defaultValue:null},"deltaValueLabel":{type:"string",group:"Misc",defaultValue:null},"targetValueLabel":{type:"string",group:"Misc",defaultValue:null},"width":{type:"string",group:"Misc",defaultValue:null},"scaleColor":{type:"sap.suite.ui.commons.CommonBackground",group:"Misc",defaultValue:sap.suite.ui.commons.CommonBackground.MediumLight}},aggregations:{"actual":{type:"sap.suite.ui.commons.BulletChartData",multiple:false},"thresholds":{type:"sap.suite.ui.commons.BulletChartData",multiple:true,singularName:"threshold"}},events:{"press":{}}}});sap.suite.ui.commons.BulletChart.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.BulletMicroChart");sap.suite.ui.microchart.BulletMicroChart.extend("sap.suite.ui.commons.BulletChart",{metadata:{library:"sap.suite.ui.commons"}});
