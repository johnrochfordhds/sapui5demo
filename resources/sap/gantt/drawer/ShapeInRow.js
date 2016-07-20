/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/drawer/Drawer","sap/gantt/misc/Utility","sap/gantt/misc/Format","sap/ui/thirdparty/d3"],function(D,U,F){"use strict";var S=D.extend("sap.gantt.drawer.ShapeInRow",{constructor:function(){this._mValueColors={};}});S.prototype.drawSvg=function(s,o,a,A,b){this._oAxisTime=a;this._oAxisOrdinal=A;this._oStatusSet=b;var c=s.select("."+o.getId()+"-top");if(c.empty()){c=s.append("g").classed(o.getId()+"-top",true);}var r=c.selectAll("."+o.getId()+"-row").data(o.dataSet);r.enter().append("g").classed(o.getId()+"-row",true);r.exit().remove();if(!r.empty()){this._recursiveDraw(r,o);}};S.prototype._recursiveDraw=function(g,s,a){var t=this;var b=g.selectAll("."+s.getId()).data(function(d){return t._bindRowData(d,a,this,s);});this._drawPerTag(b,s);this._drawInsertTitle(g,s);};S.prototype._bindRowData=function(d,s,n,o){var v=this._oStatusSet&&this._oStatusSet.aViewBoundary?this._oStatusSet.aViewBoundary:undefined;var a=o.getIsBulk();var f,i;if(d){var r=[];if(d.shapeData){if(!(d.shapeData instanceof Array)){r=r.concat(d.shapeData);}else{for(i=0;i<d.shapeData.length;i++){if(d.shapeData[i]){f={};f.oShape=o;f.objectInfo=d.objectInfoRef;f.dShapeData=d.shapeData[i];f.aViewRange=v;if(!a&&(v!==undefined)&&this._filterDataVisibleRange(f)){continue;}r=r.concat(d.shapeData[i]);}}}}else if(s&&d[s]){if(d[s].length){for(i=0;i<d[s].length;i++){f={};f.oShape=o;f.objectInfo=d.objectInfoRef;f.dShapeData=d[s][i];f.aViewRange=v;if(!a&&(v!==undefined)&&this._filterDataVisibleRange(f)){continue;}r.push(d[s][i]);}}else{r.push(d[s]);}}else if(d){r=r.concat(d);}if(o.filterValidData&&(r.length>0)){r=o.filterValidData(r);}return r;}};S.prototype._filterDataVisibleRange=function(f){var a=this._oAxisTime;var A=this._oAxisOrdinal;var v=f.aViewRange;var i=f.oShape.getIsDuration(f.dShapeData);if(i){var s=a.timeToView(F.abapTimestampToDate(f.oShape.getTime(f.dShapeData,undefined,a,A,f.objectInfo)));var e=a.timeToView(F.abapTimestampToDate(f.oShape.getEndTime(f.dShapeData,undefined,a,A,f.objectInfo)));if(this._oStatusSet.bRTL===true){return(e>v[1])||(s<v[0]);}else{return(e<v[0])||(s>v[1]);}}else{var t=a.timeToView(F.abapTimestampToDate(f.oShape.getTime(f.dShapeData,undefined,a,A,f.objectInfo)));return(t>v[1])||(t<v[0]);}return false;};S.prototype._drawPerTag=function(s,o){switch(o.getTag()){case"g":this._drawGroup(s,o);break;case"line":this._drawLine(s,o);break;case"rect":this._drawRect(s,o);break;case"text":this._drawText(s,o);break;case"path":this._drawPath(s,o);break;case"clippath":this._drawClipPath(s,o);break;case"image":this._drawImage(s,o);break;case"polygon":this._drawPolygon(s,o);break;case"polyline":this._drawPolyline(s,o);break;case"circle":this._drawCircle(s,o);break;default:break;}};S.prototype._drawGroup=function(s,o){var f=this._findObjectInfo;s.enter().append("g").classed(o.getId(),true);s.classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;});s.exit().remove();var a=o.getShapes();if(a&&a.length>0){for(var i=0;i<a.length;i++){this._recursiveDraw(s,a[i],a[i].mShapeConfig.getShapeDataName());}}};S.prototype._drawLine=function(s,o){var f=this._findObjectInfo;s.enter().append("line").classed(o.getId(),true);s.classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;}).attr("x1",function(d){return o.getX1(d,f(this,o));}).attr("y1",function(d){return o.getY1(d,f(this,o));}).attr("x2",function(d){return o.getX2(d,f(this,o));}).attr("y2",function(d){return o.getY2(d,f(this,o));}).attr("filter",function(d){return o.getFilter(d,f(this,o));}).attr("transform",function(d){return o.getTransform(d,f(this,o));}).attr("aria-label",function(d){return o.getAriaLabel(d,f(this,o));}).attr("stroke",this.determineValue("stroke",o)).attr("stroke-width",function(d){return o.getStrokeWidth(d,f(this,o));}).attr("stroke-dasharray",function(d){return o.getStrokeDasharray(d,f(this,o));}).attr("fill-opacity",function(d){return o.getFillOpacity(d,f(this,o));}).attr("stroke-opacity",function(d){return o.getStrokeOpacity(d,f(this,o));});s.exit().remove();};S.prototype._drawRect=function(s,o){var f=this._findObjectInfo;s.enter().append("rect").classed(o.getId(),true);s.classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;}).classed("sapGanttExpandChartBG",function(d){return o.getHtmlClass(d,f(this,o))?true:false;}).classed("enableClone",function(d){return o.getEnableDnD(d,f(this,o))?true:false;}).attr("x",function(d){return o.getX(d,f(this,o));}).attr("y",function(d){return o.getY(d,f(this,o));}).attr("width",function(d){return o.getWidth(d,f(this,o));}).attr("height",function(d){return o.getHeight(d,f(this,o));}).attr("fill",this.determineValue("fill",o)).attr("rx",function(d){return o.getRx(d,f(this,o));}).attr("ry",function(d){return o.getRy(d,f(this,o));}).attr("filter",function(d){return o.getFilter(d,f(this,o));}).attr("transform",function(d){return o.getTransform(d,f(this,o));}).attr("stroke",this.determineValue("stroke",o)).attr("stroke-width",function(d){return o.getStrokeWidth(d,f(this,o));}).attr("stroke-dasharray",function(d){return o.getStrokeDasharray(d,f(this,o));}).attr("fill-opacity",function(d){return o.getFillOpacity(d,f(this,o));}).attr("stroke-opacity",function(d){return o.getStrokeOpacity(d,f(this,o));}).attr("clip-path",function(d){return o.getClipPath(d,f(this,o));}).attr("aria-label",function(d){return o.getAriaLabel(d,f(this,o));});s.exit().remove();};S.prototype._drawText=function(s,o){var f=this._findObjectInfo;var t=this;s.enter().append("text").classed(o.getId(),true);s.classed("sapGanttShapeSvgText",true).classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;}).attr("x",function(d){return o.getX(d,f(this,o));}).attr("y",function(d){return o.getY(d,f(this,o));}).attr("text-anchor",function(d){return o.getTextAnchor(d,f(this,o));}).attr("font-size",function(d){return o.getFontSize(d,f(this,o));}).attr("fill",this.determineValue("fill",o)).attr("filter",function(d){return o.getFilter(d,f(this,o));}).attr("transform",function(d){return o.getTransform(d,f(this,o));}).attr("stroke",this.determineValue("stroke",o)).attr("stroke-width",function(d){return o.getStrokeWidth(d,f(this,o));}).text(function(d){return o.getText(d,f(this,o));}).each(function(d){var a=d3.select(this);a.selectAll("tspan").remove();var n=o.getWrapWidth(d,f(this,o));var b=o.getTruncateWidth(d,f(this,o));if(b>-1){t._textTruncate(d,a,b,o.getEllipsisWidth(d,f(this,o)));}else if(n>-1){t._textWrap(d,this,n,o.getWrapDy(d,f(this,o)));}});s.exit().remove();};S.prototype._textTruncate=function(d,s,n,a){var b=s.node().getComputedTextLength();if(b>n){var t=s.text(),c,e;if(a>-1&&a<n){e=true;c=n-a;}else{e=false;c=n;}while((b>c&&t.length>0)){t=t.slice(0,-1);s.text(t);b=s.node().getComputedTextLength();}if(e){if(sap.ui.Device.browser.name==="cr"){s.append("tspan").text("...").attr("textLength",s.node().getComputedTextLength()).attr("lengthAdjust","spacingAndGlyphs");}else{s.append("tspan").text("...").attr("textLength",a).attr("lengthAdjust","spacingAndGlyphs");}}}};S.prototype._textWrap=function(d,s,n,a){};S.prototype._drawPath=function(s,o){var f=this._findObjectInfo;s.enter().append("path").classed(o.getId(),true);s.classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;}).attr("d",function(d){return o.getD(d,f(this,o));}).attr("fill",this.determineValue("fill",o)).attr("stroke",this.determineValue("stroke",o)).attr("stroke-width",function(d){return o.getStrokeWidth(d,f(this,o));}).attr("stroke-dasharray",function(d){return o.getStrokeDasharray(d,f(this,o));}).attr("fill-opacity",function(d){if(o.getIsClosed(d,f(this,o))){return o.getFillOpacity(d,f(this,o));}}).attr("stroke-opacity",function(d){if(o.getIsClosed(d,f(this,o))){return o.getStrokeOpacity(d,f(this,o));}}).attr("transform",function(d){return o.getTransform(d,f(this,o));}).attr("filter",function(d){return o.getFilter(d,f(this,o));}).attr("aria-label",function(d){return o.getAriaLabel(d,f(this,o));});s.exit().remove();};S.prototype._drawClipPath=function(s,o){var f=this._findObjectInfo;s.enter().append("clipPath").classed(o.getId(),true);s.selectAll("path").remove();s.attr("id",function(d){return o.getHtmlClass(d,f(this,o));});s.append("path").attr("d",function(d){return o.getPaths()[0].getD(d,f(this,o));});s.exit().remove();};S.prototype._drawImage=function(s,o){var f=this._findObjectInfo;s.enter().append("image").classed(o.getId(),true);s.classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;}).attr("xlink:href",function(d){return o.getImage(d,f(this,o));}).attr("x",function(d){return o.getX(d,f(this,o));}).attr("y",function(d){return o.getY(d,f(this,o));}).attr("width",function(d){return o.getWidth(d,f(this,o));}).attr("height",function(d){return o.getHeight(d,f(this,o));}).attr("filter",function(d){return o.getFilter(d,f(this,o));}).attr("transform",function(d){return o.getTransform(d,f(this,o));}).attr("aria-label",function(d){return o.getAriaLabel(d,f(this,o));});s.exit().remove();};S.prototype._drawPolygon=function(s,o){var f=this._findObjectInfo;s.enter().append("polygon").classed(o.getId(),true);s.classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;}).attr("fill",this.determineValue("fill",o)).attr("fill-opacity",function(d){return o.getFillOpacity(d,f(this,o));}).attr("points",function(d){return o.getPoints(d,f(this,o));}).attr("stroke-width",function(d){return o.getStrokeWidth(d,f(this,o));}).attr("stroke",this.determineValue("stroke",o)).attr("filter",function(d){return o.getFilter(d,f(this,o));}).attr("transform",function(d){return o.getTransform(d,f(this,o));}).attr("aria-label",function(d){return o.getAriaLabel(d,f(this,o));});s.exit().remove();};S.prototype._drawPolyline=function(s,o){var f=this._findObjectInfo;s.enter().append("polyline").classed(o.getId(),true);s.classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;}).attr("fill",this.determineValue("fill",o)).attr("fill-opacity",function(d){return o.getFillOpacity(d,f(this,o));}).attr("points",function(d){return o.getPoints(d,f(this,o));}).attr("stroke-width",function(d){return o.getStrokeWidth(d,f(this,o));}).attr("stroke",this.determineValue("stroke",o)).attr("filter",function(d){return o.getFilter(d,f(this,o));}).attr("transform",function(d){return o.getTransform(d,f(this,o));}).attr("aria-label",function(d){return o.getAriaLabel(d,f(this,o));});s.exit().remove();};S.prototype._drawCircle=function(s,o){var f=this._findObjectInfo;s.enter().append("circle").classed(o.getId(),true);s.classed("hasTitle",function(d){return o.getTitle(d,f(this,o))?true:false;}).attr("fill",this.determineValue("fill",o)).attr("fill-opacity",function(d){return o.getFillOpacity(d,f(this,o));}).attr("stroke-width",function(d){return o.getStrokeWidth(d,f(this,o));}).attr("stroke",this.determineValue("stroke",o)).attr("filter",function(d){return o.getFilter(d,f(this,o));}).attr("transform",function(d){return o.getTransform(d,f(this,o));}).attr("aria-label",function(d){return o.getAriaLabel(d,f(this,o));}).attr("cx",function(d){return o.getCx(d,f(this,o));}).attr("cy",function(d){return o.getCy(d,f(this,o));}).attr("r",function(d){return o.getR(d,f(this,o));});s.exit().remove();};S.prototype._drawInsertTitle=function(g,s){var f=this._findObjectInfo;var a=g.selectAll("."+s.getId()+".hasTitle");a.select("title").remove();a.insert("title",":first-child").text(function(d){return s.getTitle(d,f(this,s));});};S.prototype._findObjectInfo=function(n,s,i){var t=n;while(!t.__data__.objectInfoRef){t=t.parentNode;}return t.__data__.objectInfoRef;};S.prototype.determineValue=function(a,s){var t=this;return function(d){var A=null;if(a==="fill"){A=s.getFill(d,t._findObjectInfo(this,s));}else if(a==="stroke"){A=s.getStroke(d,t._findObjectInfo(this,s));}var f=t._mValueColors[A];if(A&&!f){f=sap.gantt.ValueSVGPaintServer.normalize(A);t._mValueColors[A]=f;}return f;};};S.prototype.destroySvg=function(s,o){};return S;},true);
