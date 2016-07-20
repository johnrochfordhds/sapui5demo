sap.ui.define([
	"sap/gantt/drawer/Drawer", "sap/gantt/misc/Utility","sap/gantt/misc/Format",
	// 3rd party lib
	"sap/ui/thirdparty/d3"
], function (Drawer, Utility, Format) {
	"use strict";

	var ListLegend = Drawer.extend("sap.gantt.drawer.ListLegend");
	
	ListLegend.prototype._drawPerTag = function (aShape, oShape) {
		var oLegend = oShape.mChartInstance;

		if (oShape.getIsDuration()) {
			oShape.setTime(oLegend.TIME_RANGE[0]);
			oShape.setEndTime(oLegend.TIME_RANGE[1]);
		} else {
			oShape.setTime(oLegend.TIME);
		}
	
		oShape.setRowYCenter(oLegend._getScaledLegendHeight() / 2);
		
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
//			case "clippath":
//				this._drawClipPath(aShape, oShape);
//				break;
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

	ListLegend.prototype._drawGroup = function (aShape, oShape) {
		var oGroup = aShape.append("g");

		var aAggregationShapes = oShape.getShapes();
		if (aAggregationShapes && aAggregationShapes.length > 0) {
			for (var i = 0; i < aAggregationShapes.length; i++) {
				this._drawPerTag(oGroup, aAggregationShapes[i]);
			}
		}
	};

	ListLegend.prototype._drawLine = function (aShape, oShape) {
		aShape.append("line")
			.attr("x1", oShape.getX1())
			.attr("y1", oShape.getY1())
			.attr("x2", oShape.getX2())
			.attr("y2", oShape.getY2())
			.attr("filter", oShape.getFilter())
			.attr("aria-label", oShape.getAriaLabel())
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("stroke-width", oShape.getStrokeWidth())
			.attr("stroke-dasharray", oShape.getStrokeDasharray())
			.attr("fill-opacity", oShape.getFillOpacity())
			.attr("stroke-opacity", oShape.getStrokeOpacity())
			.attr("transform", oShape.getTransform());
	};

	ListLegend.prototype._drawRect = function (aShape, oShape) {
//		var oRowInfo = {
//			y: 0,
//			rowHeight: oShape.mChartInstance._getScaledLegendHeight()
//		};
		aShape.append("rect")
			.attr("x", oShape.getX())
			.attr("y", oShape.getY(/*null, oRowInfo*/))
			.attr("width", oShape.getWidth())
			.attr("height", oShape.getHeight(/*null, oRowInfo*/))
			.attr("fill", this.determineValue("fill", oShape))
			.attr("rx", oShape.getRx())
			.attr("ry", oShape.getRy())
			.attr("filter", oShape.getFilter())
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("stroke-width", oShape.getStrokeWidth())
			.attr("stroke-dasharray", oShape.getStrokeDasharray())
			.attr("fill-opacity", oShape.getFillOpacity())
			.attr("stroke-opacity", oShape.getStrokeOpacity())
			.attr("aria-label", oShape.getAriaLabel())
			.attr("transform", oShape.getTransform());
	};

	ListLegend.prototype._drawText = function (aShape, oShape) {
		aShape.append("text")
			.attr("x", oShape.getX())//oShape.mChartInstance.getLegendWidth() / 2)
			.attr("y", oShape.getRowYCenter())
			.attr("text-anchor", "middle")
			.attr("font-size", oShape.getFontSize())
			.attr("fill", this.determineValue("fill", oShape))
			.attr("filter", oShape.getFilter())
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("stroke-width", oShape.getStrokeWidth())
			.attr("alignment-baseline", "central")
			.attr("font-family", oShape.getFontFamily())
			.text(oShape.getText())
			.attr("transform", oShape.getTransform());
	};

	ListLegend.prototype._drawPath = function (aShape, oShape) {
		function fOpacity() {
			if (oShape.getIsClosed()) {
				return oShape.getFillOpacity();
			}
		}
		function sOpacity() {
			if (oShape.getIsClosed()) {
				return oShape.getStrokeOpacity();
			}
		}
				
		aShape.append("path")
			.attr("d", oShape.getD())
			.attr("fill", this.determineValue("fill", oShape))
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("stroke-width", oShape.getStrokeWidth())
			.attr("stroke-dasharray", oShape.getStrokeDasharray())
			.attr("fill-opacity", fOpacity())
			.attr("stroke-opacity", sOpacity())
			.attr("filter", oShape.getFilter())			
			.attr("aria-label", oShape.getAriaLabel())
			.attr("transform", oShape.getTransform());
	};

//	ListLegend.prototype._drawClipPath = function (aShape, oShape) {
////		var fFindObjectInfo = this._findObjectInfo;
//
//		aShape/*.enter()*/.append("clipPath")
//			.classed(oShape.getId(), true)
////			.attr("id", oShape.getHtmlClass())
//			.append("path");
//
//		// Jean TODO: why getPaths()[0] ? should loop and generate all, then .apend("path") should be detached from enter();
//		aShape.selectAll("path")
//			.attr("d", oShape.getPaths()[0].getD4Area());
//	};

	ListLegend.prototype._drawImage = function (aShape, oShape) {
		aShape.append("image")
			.attr("xlink:href", oShape.getImage())
			.attr("x", oShape.getX() - oShape.getWidth() / 2)
			.attr("y", oShape.getY())
			.attr("width", oShape.getWidth())
			.attr("height", oShape.getHeight())
			.attr("filter", oShape.getFilter())
			.attr("aria-label", oShape.getAriaLabel())
			.attr("transform", oShape.getTransform());
	};

	ListLegend.prototype._drawPolygon = function (aShape, oShape) {
		aShape.append("polygon")
			.attr("fill", this.determineValue("fill", oShape))
			.attr("points", oShape.getPoints())
			.attr("stroke-width", oShape.getStrokeWidth())
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("filter", oShape.getFilter())
			.attr("aria-label", oShape.getAriaLabel())
			.attr("transform", oShape.getTransform());
	};
	
	ListLegend.prototype._drawPolyline = function (aShape, oShape) {
		aShape.append("polyline")
			.attr("fill", this.determineValue("fill", oShape))
			.attr("points", oShape.getPoints())
			.attr("stroke-width", oShape.getStrokeWidth())
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("filter", oShape.getFilter())
			.attr("aria-label", oShape.getAriaLabel())
			.attr("transform", oShape.getTransform());
	};
	
	ListLegend.prototype._drawCircle = function (aShape, oShape) {
		aShape.append("circle")
			.attr("fill", this.determineValue("fill", oShape))
			.attr("stroke-width", oShape.getStrokeWidth())
			.attr("stroke", this.determineValue("stroke", oShape))
			.attr("filter", oShape.getFilter())
			.attr("aria-label", oShape.getAriaLabel())
			.attr("cx", oShape.getCx())
			.attr("cy", oShape.getCy())
			.attr("r", oShape.getR())
			.attr("transform", oShape.getTransform());
	};

	ListLegend.prototype.determineValue = function(sAttr, oShape) {
		var sAttrValue = null;
		if (sAttr === "fill") {
			sAttrValue = oShape.getFill();
		} else if (sAttr === "stroke") {
			sAttrValue = oShape.getStroke();
		}
		return sap.gantt.ValueSVGPaintServer.normalize(sAttrValue);
	};
	return ListLegend;
	
}, true);
