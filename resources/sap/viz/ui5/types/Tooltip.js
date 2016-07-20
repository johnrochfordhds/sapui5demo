/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/viz/library','sap/viz/ui5/core/BaseStructuredType'],function(l,B){"use strict";var T=B.extend("sap.viz.ui5.types.Tooltip",{metadata:{library:"sap.viz",properties:{preRender:{type:"any",defaultValue:null},postRender:{type:"any",defaultValue:null},visible:{type:"boolean",defaultValue:true},drawingEffect:{type:"sap.viz.ui5.types.Tooltip_drawingEffect",defaultValue:sap.viz.ui5.types.Tooltip_drawingEffect.normal,deprecated:true},formatString:{type:"any[]",defaultValue:null},layinChart:{type:"boolean",defaultValue:true}},aggregations:{background:{type:"sap.viz.ui5.types.Tooltip_background",multiple:false},footerLabel:{type:"sap.viz.ui5.types.Tooltip_footerLabel",multiple:false,deprecated:true},separationLine:{type:"sap.viz.ui5.types.Tooltip_separationLine",multiple:false,deprecated:true},bodyDimensionLabel:{type:"sap.viz.ui5.types.Tooltip_bodyDimensionLabel",multiple:false,deprecated:true},bodyDimensionValue:{type:"sap.viz.ui5.types.Tooltip_bodyDimensionValue",multiple:false,deprecated:true},bodyMeasureLabel:{type:"sap.viz.ui5.types.Tooltip_bodyMeasureLabel",multiple:false,deprecated:true},bodyMeasureValue:{type:"sap.viz.ui5.types.Tooltip_bodyMeasureValue",multiple:false,deprecated:true},closeButton:{type:"sap.viz.ui5.types.Tooltip_closeButton",multiple:false,deprecated:true}}}});return T;});
