/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/drawer/Drawer", "sap/gantt/misc/Utility","sap/gantt/misc/Format",
	// 3rd party lib
	"sap/ui/thirdparty/d3"
], function (Drawer, Utility, Format) {
	"use strict";

	var ShapeInRow = Drawer.extend("sap.gantt.drawer.ShapeInRow", {

		/**
		 * Constructor of ShapInRow
		 */
		constructor: function() {
			// for fewer normalize color value purpose only
			this._mValueColors = {};
		}
	});

	/*
	 * oShape is the shape instance which already have data collected.
	 */
	ShapeInRow.prototype.drawSvg = function (aSvgNode, oShape, oAxisTime, oAxisOrdinal, oStatusSet) {
		// temp save param
		this._oAxisTime = oAxisTime;
		this._oAxisOrdinal = oAxisOrdinal;
		this._oStatusSet = oStatusSet;
		// create top g
		var aShapeTopG = aSvgNode.select("." + oShape.getId() + "-top");
		if (aShapeTopG.empty()) {
			aShapeTopG = aSvgNode.append("g")
				.classed(oShape.getId() + "-top", true);
		}
		// bind data to row g
		var aRowG = aShapeTopG.selectAll("." + oShape.getId() + "-row")
			.data(oShape.dataSet);
		aRowG.enter().append("g")
			.classed(oShape.getId() + "-row", true);
		aRowG.exit().remove();
		// draw
		if (!aRowG.empty()) {
			this._recursiveDraw(aRowG, oShape);
		}
	};

	ShapeInRow.prototype._recursiveDraw = function (aGroup, oShape, sData) {
		var that = this;
		var aShape = aGroup.selectAll("." + oShape.getId())
			.data(function (d) {
				return that._bindRowData(d, sData, this, oShape);
			});

		this._drawPerTag(aShape, oShape);
		this._drawInsertTitle(aGroup, oShape);
	};

	ShapeInRow.prototype._bindRowData = function (oData, sData, oNode, oShape) {
		var aViewRange = this._oStatusSet && this._oStatusSet.aViewBoundary ? this._oStatusSet.aViewBoundary : undefined;
		var isBulk = oShape.getIsBulk();
		var oFilterParam, i;
		
		if (oData) {
			var aRetVal = [];
			if (oData.shapeData) {  // top shapes
				if (!(oData.shapeData instanceof Array)) {
					aRetVal = aRetVal.concat(oData.shapeData);
				} else {
					for (i = 0; i < oData.shapeData.length; i++) {
						if (oData.shapeData[i]) {
							oFilterParam = {};
							oFilterParam.oShape = oShape;
							oFilterParam.objectInfo = oData.objectInfoRef;
							oFilterParam.dShapeData = oData.shapeData[i];
							oFilterParam.aViewRange = aViewRange;
							if (!isBulk && (aViewRange !== undefined) && this._filterDataVisibleRange(oFilterParam)) {
								continue;
							}
							aRetVal = aRetVal.concat(oData.shapeData[i]);
						}
					}
				}
			} else if (sData && oData[sData]) {	// aggregated shapes and special attribute is identified
				if (oData[sData].length) { // is array
					for (i = 0; i < oData[sData].length; i++) {
						oFilterParam = {};
						oFilterParam.oShape = oShape;
						oFilterParam.objectInfo = oData.objectInfoRef;
						oFilterParam.dShapeData = oData[sData][i];
						oFilterParam.aViewRange = aViewRange;
						if (!isBulk && (aViewRange !== undefined) && this._filterDataVisibleRange(oFilterParam)) {
							continue;
						}
						aRetVal.push(oData[sData][i]);
					}
				} else {
					aRetVal.push(oData[sData]);
				}
			} else if (oData){	// inherigate parent data
				aRetVal = aRetVal.concat(oData);
			}
			//if the shape has a filterValidData method, filter valid data for the shape
			if (oShape.filterValidData && (aRetVal.length > 0)) {
				aRetVal = oShape.filterValidData(aRetVal);
			}
			return aRetVal;
		}
	};
	
	ShapeInRow.prototype._filterDataVisibleRange = function (oFilterParam) {
		var oAxisTime = this._oAxisTime;
		var oAxisOrdinal = this._oAxisOrdinal;
		var aViewRange = oFilterParam.aViewRange;
	
		var isDuration = oFilterParam.oShape.getIsDuration(oFilterParam.dShapeData);
		if (isDuration) {
			var startTime = oAxisTime.timeToView(Format.abapTimestampToDate(oFilterParam.oShape.getTime(oFilterParam.dShapeData, undefined, oAxisTime, oAxisOrdinal, oFilterParam.objectInfo)));
			var endTime = oAxisTime.timeToView(Format.abapTimestampToDate(oFilterParam.oShape.getEndTime(oFilterParam.dShapeData, undefined, oAxisTime, oAxisOrdinal, oFilterParam.objectInfo)));
			if (this._oStatusSet.bRTL === true){
				return (endTime > aViewRange[1]) || (startTime < aViewRange[0]);
			}else {
				return (endTime < aViewRange[0]) || (startTime > aViewRange[1]);
			}
		} else {
			var time = oAxisTime.timeToView(Format.abapTimestampToDate(oFilterParam.oShape.getTime(oFilterParam.dShapeData, undefined, oAxisTime, oAxisOrdinal, oFilterParam.objectInfo)));
			return (time > aViewRange[1]) || (time < aViewRange[0]);
		}
		return false;
	};

	ShapeInRow.prototype._drawPerTag = function (aShape, oShape) {
		switch (oShape.getTag()) {
			case "g":
				this._drawGroup(aShape, oShape);
				break;
			case "line":
				this._drawLine(aShape, oShape);
				break;
			case "rect":
				this._drawRect(aShape, oShape);
				break;
			case "text":
				this._drawText(aShape, oShape);
				break;
			case "path":
				this._drawPath(aShape, oShape);
				break;
			case "clippath":
				this._drawClipPath(aShape, oShape);
				break;
			case "image":
				this._drawImage(aShape, oShape);
				break;
			case "polygon":
				this._drawPolygon(aShape, oShape);
				break;
			case "polyline":
				this._drawPolyline(aShape, oShape);
				break;
			case "circle":
				this._drawCircle(aShape, oShape);
				break;
			default:
				break;
		}
	};

	ShapeInRow.prototype._drawGroup = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("g")
			.classed(oShape.getId(), true);

		aShape
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			});

		aShape.exit().remove();

		var aAggregationShapes = oShape.getShapes();
		if (aAggregationShapes && aAggregationShapes.length > 0) {
			for (var i = 0; i < aAggregationShapes.length; i++) {
				this._recursiveDraw(aShape, aAggregationShapes[i], aAggregationShapes[i].mShapeConfig.getShapeDataName());
			}
		}
	};

	ShapeInRow.prototype._drawLine = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("line")
			.classed(oShape.getId(), true);

		aShape
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.attr("x1", function (d) {
				return oShape.getX1(d, fFindObjectInfo(this, oShape));
			})
			.attr("y1", function (d) {
				return oShape.getY1(d, fFindObjectInfo(this, oShape));
			})
			.attr("x2", function (d) {
				return oShape.getX2(d, fFindObjectInfo(this, oShape));
			})
			.attr("y2", function (d) {
				return oShape.getY2(d, fFindObjectInfo(this, oShape));
			})
			.attr("filter",function(d) {
				return oShape.getFilter(d, fFindObjectInfo(this, oShape));
			})
			.attr("transform", function (d) {
				return oShape.getTransform(d, fFindObjectInfo(this, oShape));
			})
			.attr("aria-label", function (d) {
				return oShape.getAriaLabel(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("stroke-width", function (d) {
				return oShape.getStrokeWidth(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke-dasharray", function (d) {
				return oShape.getStrokeDasharray(d, fFindObjectInfo(this, oShape));
			})
			.attr("fill-opacity", function (d) {
				return oShape.getFillOpacity(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke-opacity", function (d) {
				return oShape.getStrokeOpacity(d, fFindObjectInfo(this, oShape));
			});

		aShape.exit().remove();
	};

	ShapeInRow.prototype._drawRect = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("rect")
			.classed(oShape.getId(), true);

		aShape
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			// for expand background
			.classed("sapGanttExpandChartBG", function (d) {
				return oShape.getHtmlClass(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.classed("enableClone", function (d) {
				return oShape.getEnableDnD(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.attr("x", function (d) {
				return oShape.getX(d, fFindObjectInfo(this, oShape));
			})
			.attr("y", function (d) {
				return oShape.getY(d, fFindObjectInfo(this, oShape));
			})
			.attr("width", function (d) {
				return oShape.getWidth(d, fFindObjectInfo(this, oShape));
			})
			.attr("height", function (d) {
				return oShape.getHeight(d, fFindObjectInfo(this, oShape));
			})
			.attr("fill", this.determineValue("fill", oShape))
			.attr("rx", function (d) {
				return oShape.getRx(d, fFindObjectInfo(this, oShape));
			})
			.attr("ry", function (d) {
				return oShape.getRy(d, fFindObjectInfo(this, oShape));
			})
			.attr("filter",function(d) {
				return oShape.getFilter(d, fFindObjectInfo(this, oShape));
			})
			.attr("transform", function (d) {
				return oShape.getTransform(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("stroke-width", function (d) {
				return oShape.getStrokeWidth(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke-dasharray", function (d) {
				return oShape.getStrokeDasharray(d, fFindObjectInfo(this, oShape));
			})
			.attr("fill-opacity", function (d) {
				return oShape.getFillOpacity(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke-opacity", function (d) {
				return oShape.getStrokeOpacity(d, fFindObjectInfo(this, oShape));
			})
			.attr("clip-path", function (d) {
				return oShape.getClipPath(d, fFindObjectInfo(this, oShape));
			})
			.attr("aria-label", function (d) {
				return oShape.getAriaLabel(d, fFindObjectInfo(this, oShape));
			});

		aShape.exit().remove();
	};

	ShapeInRow.prototype._drawText = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;
		var that = this;

		aShape.enter().append("text")
			.classed(oShape.getId(), true);
		aShape
			.classed("sapGanttShapeSvgText", true)
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.attr("x", function (d) {
				return oShape.getX(d, fFindObjectInfo(this, oShape));
			})
			.attr("y", function (d) {
				return oShape.getY(d, fFindObjectInfo(this, oShape));
			})
			.attr("text-anchor", function (d) {
				return oShape.getTextAnchor(d, fFindObjectInfo(this, oShape));
			})
			.attr("font-size", function (d) {
				return oShape.getFontSize(d, fFindObjectInfo(this, oShape));
			})
			.attr("fill", this.determineValue("fill", oShape))
			.attr("filter",function(d) {
				return oShape.getFilter(d, fFindObjectInfo(this, oShape));
			})
			.attr("transform", function (d) {
				return oShape.getTransform(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("stroke-width", function (d) {
				return oShape.getStrokeWidth(d, fFindObjectInfo(this, oShape));
			})
			.text(function (d) {
				return oShape.getText(d, fFindObjectInfo(this, oShape));
			}).each(function (d) { // wrapping, truncating
				var oSelf = d3.select(this);
				oSelf.selectAll("tspan").remove();
				var nWrapWidth = oShape.getWrapWidth(d, fFindObjectInfo(this, oShape));
				var nTruncateWidth = oShape.getTruncateWidth(d, fFindObjectInfo(this, oShape));
				if (nTruncateWidth > -1) { // do truncating
					that._textTruncate(d, oSelf, nTruncateWidth, oShape.getEllipsisWidth(d, fFindObjectInfo(this, oShape)));
				} else if (nWrapWidth > -1) { // do wrapping
					that._textWrap(d, this, nWrapWidth, oShape.getWrapDy(d, fFindObjectInfo(this, oShape)));
				}
			});

		aShape.exit().remove();
	};
	
	ShapeInRow.prototype._textTruncate = function (oData, oSelf, nTruncateWidth, nEllipsisWidth) {
		var nTextLength = oSelf.node().getComputedTextLength();
		
		if (nTextLength > nTruncateWidth) { // truncate needed
			var sText = oSelf.text(),
				nTargetLength,
				bEllipsisAppear;
			
			if (nEllipsisWidth > -1 && nEllipsisWidth < nTruncateWidth) { // ellipsis enabled
				bEllipsisAppear = true;
				nTargetLength = nTruncateWidth - nEllipsisWidth;
			} else { // ellipsis disabled
				bEllipsisAppear = false;
				nTargetLength = nTruncateWidth;
			}
			
			// truncate
			while ( (nTextLength > nTargetLength && sText.length > 0)) {
				sText = sText.slice(0, -1); // truncate last char
				oSelf.text(sText);
				nTextLength = oSelf.node().getComputedTextLength();
			}
			
			// add ellipsis if determined to be needed
			if (bEllipsisAppear) {
				if (sap.ui.Device.browser.name === "cr"){
					//Chrome's textlength is rendered differently to ie and ff. If the textlength specified in tspan and the direction is RTL, 
					//then text length is applied to whole text element 
					oSelf.append("tspan")
						.text("...")
						.attr("textLength", oSelf.node().getComputedTextLength())
						.attr("lengthAdjust", "spacingAndGlyphs");
				} else {
					oSelf.append("tspan")
					.text("...")
					.attr("textLength", nEllipsisWidth)
					.attr("lengthAdjust", "spacingAndGlyphs");
				
				}
			}
		}
	};
	
	ShapeInRow.prototype._textWrap = function (oData, oSelf, nWrapWidth, nWrapDy) {
		//var nTextLength = oSelf.node().getComputedTextLength();
		
		//if (nTextLength > nWrapWidth) { // wrap needed
			// tokenize the text
			// connect tokens in tspan, and check against nWrapWidth
			// create tspan with dy = nWrapDy
		//}
	};

	ShapeInRow.prototype._drawPath = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("path")
			.classed(oShape.getId(), true);

		aShape
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.attr("d", function (d) {
				return oShape.getD(d, fFindObjectInfo(this, oShape));
			})
			.attr("fill", this.determineValue("fill", oShape))
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("stroke-width", function (d) {
				return oShape.getStrokeWidth(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke-dasharray", function (d) {
				return oShape.getStrokeDasharray(d, fFindObjectInfo(this, oShape));
			})
			.attr("fill-opacity", function (d) {
				if (oShape.getIsClosed(d, fFindObjectInfo(this, oShape))) {
					return oShape.getFillOpacity(d, fFindObjectInfo(this, oShape));
				}
			})
			.attr("stroke-opacity", function (d) {
				if (oShape.getIsClosed(d, fFindObjectInfo(this, oShape))) {
					return oShape.getStrokeOpacity(d, fFindObjectInfo(this, oShape));
				}
			})
			.attr("transform", function (d) {
				return oShape.getTransform(d, fFindObjectInfo(this, oShape));
			})
			.attr("filter",function(d) {
				return oShape.getFilter(d, fFindObjectInfo(this, oShape));
			})			
			.attr("aria-label", function (d) {
				return oShape.getAriaLabel(d, fFindObjectInfo(this, oShape));
			});

		aShape.exit().remove();
	};

	ShapeInRow.prototype._drawClipPath = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("clipPath")
			.classed(oShape.getId(), true);
		
		aShape.selectAll("path").remove();
		
		aShape.attr("id", function (d) {  // Jean TODO: id is important for clip path, but why use htmlClass attribute?
			return oShape.getHtmlClass(d, fFindObjectInfo(this, oShape));
		});

		// Jean TODO: why getPaths()[0] ? should loop and generate all, then .apend("path") should be detached from enter();
		aShape.append("path")
			.attr("d", function (d) {
				return oShape.getPaths()[0].getD(d, fFindObjectInfo(this, oShape));
			});
		
		aShape.exit().remove();
	};

	ShapeInRow.prototype._drawImage = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("image")
			.classed(oShape.getId(), true);

		aShape
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.attr("xlink:href", function (d) {
				return oShape.getImage(d, fFindObjectInfo(this, oShape));
			})
			.attr("x", function (d) {
				return oShape.getX(d, fFindObjectInfo(this, oShape));
			})
			.attr("y", function (d) {
				return oShape.getY(d, fFindObjectInfo(this, oShape));
			})
			.attr("width", function (d) {
				return oShape.getWidth(d, fFindObjectInfo(this, oShape));
			})
			.attr("height", function (d) {
				return oShape.getHeight(d, fFindObjectInfo(this, oShape));
			})
			.attr("filter",function(d) {
				return oShape.getFilter(d, fFindObjectInfo(this, oShape));
			})
			.attr("transform", function (d) {
				return oShape.getTransform(d, fFindObjectInfo(this, oShape));
			})			
			.attr("aria-label", function (d) {
				return oShape.getAriaLabel(d, fFindObjectInfo(this, oShape));
			});

		aShape.exit().remove();
	};

	ShapeInRow.prototype._drawPolygon = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("polygon")
			.classed(oShape.getId(), true);

		aShape
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.attr("fill", this.determineValue("fill", oShape))
			.attr("fill-opacity", function (d) {
				return oShape.getFillOpacity(d, fFindObjectInfo(this, oShape));
			})
			.attr("points", function (d) {
				return oShape.getPoints(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke-width", function (d) {
				return oShape.getStrokeWidth(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("filter",function(d) {
				return oShape.getFilter(d, fFindObjectInfo(this, oShape));
			})
			.attr("transform", function (d) {
				return oShape.getTransform(d, fFindObjectInfo(this, oShape));
			})
			.attr("aria-label", function (d) {
				return oShape.getAriaLabel(d, fFindObjectInfo(this, oShape));
			});

		aShape.exit().remove();
	};
	
	ShapeInRow.prototype._drawPolyline = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("polyline")
			.classed(oShape.getId(), true);
		aShape
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.attr("fill", this.determineValue("fill", oShape))
			.attr("fill-opacity", function (d) {
				return oShape.getFillOpacity(d, fFindObjectInfo(this, oShape));
			})
			.attr("points", function (d) {
				return oShape.getPoints(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke-width", function (d) {
				return oShape.getStrokeWidth(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("filter",function(d) {
				return oShape.getFilter(d, fFindObjectInfo(this, oShape));
			})
			.attr("transform", function (d) {
				return oShape.getTransform(d, fFindObjectInfo(this, oShape));
			})
			.attr("aria-label", function (d) {
				return oShape.getAriaLabel(d, fFindObjectInfo(this, oShape));
			});

		aShape.exit().remove();
	};
	
	ShapeInRow.prototype._drawCircle = function (aShape, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		aShape.enter().append("circle")
			.classed(oShape.getId(), true);

		aShape
			.classed("hasTitle", function (d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape)) ? true : false;
			})
			.attr("fill", this.determineValue("fill", oShape))
			.attr("fill-opacity", function (d) {
				return oShape.getFillOpacity(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke-width", function (d) {
				return oShape.getStrokeWidth(d, fFindObjectInfo(this, oShape));
			})
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("filter",function(d) {
				return oShape.getFilter(d, fFindObjectInfo(this, oShape));
			})
			.attr("transform", function (d) {
				return oShape.getTransform(d, fFindObjectInfo(this, oShape));
			})
			.attr("aria-label", function (d) {
				return oShape.getAriaLabel(d, fFindObjectInfo(this, oShape));
			})
			.attr("cx", function (d) {
				return oShape.getCx(d, fFindObjectInfo(this, oShape));
			})
			.attr("cy", function (d) {
				return oShape.getCy(d, fFindObjectInfo(this, oShape));
			})
			.attr("r", function (d) {
				return oShape.getR(d, fFindObjectInfo(this, oShape));
			});

		aShape.exit().remove();
	};

	ShapeInRow.prototype._drawInsertTitle = function (aGroup, oShape) {
		var fFindObjectInfo = this._findObjectInfo;

		var aShape = aGroup.selectAll("." + oShape.getId() + ".hasTitle");
		aShape.select("title").remove();
		aShape.insert("title", ":first-child")
			.text(function(d) {
				return oShape.getTitle(d, fFindObjectInfo(this, oShape));
			});
	};

	ShapeInRow.prototype._findObjectInfo = function (oNode, oShape, isSelectedShape) {
		var oTargetNode = oNode;
		while (!oTargetNode.__data__.objectInfoRef) {
			oTargetNode = oTargetNode.parentNode;
		}
		return oTargetNode.__data__.objectInfoRef;
	};

	ShapeInRow.prototype.determineValue = function(sAttr, oShape) {
		var that = this;
		return function(d) {
			var sAttrValue = null;
			if (sAttr === "fill") {
				sAttrValue = oShape.getFill(d, that._findObjectInfo(this, oShape));
			} else if (sAttr === "stroke") {
				sAttrValue = oShape.getStroke(d, that._findObjectInfo(this, oShape));
			}
			var sFoundColor = that._mValueColors[sAttrValue];
			if (sAttrValue && !sFoundColor) {
				// if attribute has value but no paint server value
				sFoundColor = sap.gantt.ValueSVGPaintServer.normalize(sAttrValue);
				that._mValueColors[sAttrValue] = sFoundColor;
			}
			return sFoundColor;
		};
	};

	ShapeInRow.prototype.destroySvg = function (aSvgNode, oShape) {};

	return ShapeInRow;
}, true);
