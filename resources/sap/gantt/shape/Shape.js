/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element","sap/gantt/misc/Utility","sap/gantt/misc/Format","sap/ui/core/Core","sap/ui/core/format/NumberFormat"],function(E,U,F,C,N){"use strict";var S=E.extend("sap.gantt.shape.Shape",{metadata:{"abstract":true,properties:{tag:{type:"string"},category:{type:"string",defaultValue:sap.gantt.shape.ShapeCategory.InRowShape},htmlClass:{type:"string"},isDuration:{type:"boolean",defaultValue:false},time:{type:"string"},endTime:{type:"string"},title:{type:"string"},ariaLabel:{type:"string"},xBias:{type:"number",defaultValue:0},yBias:{type:"number",defaultValue:0},fill:{type:"sap.gantt.ValueSVGPaintServer"},strokeOpacity:{type:"number",defaultValue:1},fillOpacity:{type:"number",defaultValue:1},stroke:{type:"sap.gantt.ValueSVGPaintServer"},strokeWidth:{type:"number",defaultValue:2},strokeDasharray:{type:"string"},clipPath:{type:"string"},transform:{type:"string"},filter:{type:"string"},enableDnD:{type:"boolean",defaultValue:false},enableSelection:{type:"boolean",defaultValue:true},rowYCenter:{type:"number",defaultValue:7.5},rotationCenter:{type:"array"},rotationAngle:{type:"number"},isBulk:{type:"boolean",defaultValue:false},arrayAttribute:{type:"string"},timeFilterAttribute:{type:"string"},endTimeFilterAttribute:{type:"string"}},aggregations:{selectedShape:{type:"sap.gantt.shape.SelectedShape",multiple:false}}}});S.prototype.init=function(){var r=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",r.getText("ARIA_SHAPE"));this.mShapeConfig=null;this.mLocaleConfig=null;this.mChartInstance=null;};S.prototype.getTag=function(d){return this._configFirst("tag",d);};S.prototype.getCategory=function(d){return this._configFirst("category",d);};S.prototype.getHtmlClass=function(d){return this._configFirst("htmlClass",d);};S.prototype.getIsDuration=function(d){return this._configFirst("isDuration",d);};S.prototype.getTime=function(d){return this._configFirst("time",d);};S.prototype.getEndTime=function(d){return this._configFirst("endTime",d);};S.prototype.getTitle=function(d){return this._configFirst("title",d);};S.prototype.getAriaLabel=function(d){return this._configFirst("ariaLabel",d);};S.prototype.getXBias=function(d){if(C.getConfiguration().getRTL()===true){return 0-this._configFirst("xBias",d);}else{return this._configFirst("xBias",d);}};S.prototype.getYBias=function(d){return this._configFirst("yBias",d,true);};S.prototype.getFill=function(d,r){return this._configFirst("fill",d);};S.prototype.getStrokeOpacity=function(d){return this._configFirst("strokeOpacity",d);};S.prototype.getFillOpacity=function(d){return this._configFirst("fillOpacity",d);};S.prototype.getStroke=function(d){return this._configFirst("stroke",d);};S.prototype.getStrokeWidth=function(d){return this._configFirst("strokeWidth",d,true);};S.prototype.getStrokeDasharray=function(d){return this._configFirst("strokeDasharray",d);};S.prototype.getClipPath=function(d){return this._configFirst("clipPath",d);};S.prototype.getTransform=function(d,r){if(this.mShapeConfig.hasShapeProperty("transform")){return this._configFirst("transform",d);}var R=[];this._translate(d,r,R);this._rotate(d,r,R);if(R.length>0){return R.join(" ");}};S.prototype._rotate=function(d,r,R){var c=this.getRotationCenter(d,r),n=this.getRotationAngle(d,r);if(c&&c.length===2&&n){R.push("rotate("+n+" "+c[0]+" "+c[1]+")");}};S.prototype._translate=function(d,r,R){var n=this.getXBias(d,r),a=this.getYBias(d,r);if(n||a){n=n?n:0;a=a?a:0;R.push("translate("+n+" "+a+")");}};S.prototype.getFilter=function(d){return this._configFirst("filter",d);};S.prototype.getEnableDnD=function(d){return this._configFirst("enableDnD",d);};S.prototype.getEnableSelection=function(d){return this._configFirst("enableSelection",d);};S.prototype.getRotationAngle=function(d){return this._rtlRotation(this._configFirst("rotationAngle",d));};S.prototype._rtlRotation=function(n){if(n>0||n<0){if(C.getConfiguration().getRTL()){return 360-n;}else{return n;}}};S.prototype.getRowYCenter=function(d,r){if(this.mShapeConfig.hasShapeProperty("rowYCenter")){return this._configFirst("rowYCenter",d);}if(r){return r.y+r.rowHeight/2;}else{return this.getProperty("rowYCenter");}};S.prototype.getRotationCenter=function(d,r){if(this.mShapeConfig.hasShapeProperty("rotationCenter")){return this._configFirst("rotationCenter",d);}return this._getCenter(d,r);};S.prototype._getCenter=function(d,r,e){var a=this.mChartInstance.getAxisTime();var t=e?this.getEndTime(d,r):this.getTime(d,r);if(!t){return undefined;}var n=a.timeToView(F.abapTimestampToDate(t));if(!n&&!n==0){n=a.timeToView(0);}var b=this.getRowYCenter(d,r);return[n,b];};S.prototype.getIsBulk=function(d){return this._configFirst("isBulk",d);};S.prototype.getArrayAttribute=function(d){return this._configFirst("arrayAttribute",d);};S.prototype.getTimeFilterAttribute=function(d){return this._configFirst("timeFilterAttribute",d);};S.prototype.getEndTimeFilterAttribute=function(d){return this._configFirst("endTimeFilterAttribute",d);};S.prototype._configFirst=function(a,d,s){var p=null;if(this.mShapeConfig.hasShapeProperty(a)){var c=this.mShapeConfig.getShapeProperty(a);if(typeof c==="string"){p=this._formatting(d,a,c);}else{p=c;}}else{p=this.getProperty(a);}if(s){var m=this.mChartInstance.getSapUiSizeClass();p=U.scaleBySapUiSize(m,p);}return p;};S.prototype.getShapeViewBoundary=function(){var s=this.mChartInstance._oStatusSet;if(s&&s.aViewBoundary){return s.aViewBoundary;}return null;};S.prototype._formatting=function(d,a,A){if(!A){return"";}this._attributeNameBindingMap=this._attributeNameBindingMap||{};if(!this._attributeNameBindingMap[a]){this._attributeNameBindingMap[a]=this._resolveAttributeMap(A);}return this._formatFromResolvedAttributeMap(d,a);};S.prototype._resolveAttributeMap=function(a){var r=[];var m=a.match(/[^\{\}]*(\{.*?\})?/g);m.pop();m.forEach(function(v,i,A){var o={},s=v.split("{");if(s[0].length>0){o.leadingText=s[0];}if(s[1]){s=s[1].split("}")[0].split(":");if(s[0].length>0){o.attributeName=s[0].trim().split("/");}if(s[1]){o.attributeType=s[1].trim();}}r.push(o);});return r;};S.prototype._formatFromResolvedAttributeMap=function(d,a){var A=this._attributeNameBindingMap[a],r=[],p,v;if(A){A.forEach(function(P,i){p=P.leadingText;if(P.attributeName){v=d;P.attributeName.forEach(function(s,i){v=v[s];});if(p){p=p+this._formatValue(v,P.attributeType);}else{p=this._formatValue(v,P.attributeType);}}r.push(p);}.bind(this));}if(r.length===1){return r[0];}return r.join("");};S.prototype._formatValue=function(a,t){var l=this.mLocaleConfig,r=a;switch(t){case"Number":r=this._formatNumber(a);break;case"Timestamp":if(l!=undefined){r=F.abapTimestampToTimeLabel(a,l);}break;default:if(r===undefined||r===null){r="";}break;}return r;};S.prototype._formatNumber=function(n,d){var r="";if(d!==undefined){r=N.getFloatInstance({minFractionDigits:d,maxFractionDigits:d}).format(n);}else{r=N.getFloatInstance().format(n);}return r;};return S;},true);
