/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/drawer/Drawer", "sap/gantt/misc/Utility", "sap/ui/core/Core",
	// 3rd party lib
	"sap/ui/thirdparty/d3"
], function (Drawer, Utility, Core) {
	"use strict";

	var SelectionPanel = Drawer.extend("sap.gantt.drawer.SelectionPanel");
	
	SelectionPanel.prototype.drawSvg = function (aTableSvg, aSelectionSvg, aData, oGanttChartWithTable) {
		// temp save param
		this._oGanttChartWithTable = oGanttChartWithTable;
		// create top g
		
//		append row_g
		if (aData.length == 0){
			return null;
		}
		
		var dummyData = [];
		
		for (var i = 0; i < aData.length; i++){
			if (aData[i].data.__dummy && !aData[i].data.previousNodeNum && !aData[i].data.afterNodeNum){
				dummyData.push(aData[i]);
			}
		}
		

		var aTableRowG = aTableSvg.selectAll(".selectionpanel").data(dummyData);
		aTableRowG.enter().append("g").classed("selectionpanel",true);
		aTableRowG.exit().remove();
		
		var aSelectionRowG = aSelectionSvg.selectAll(".selectionpanel").data(dummyData);
		aSelectionRowG.enter().append("g").classed("selectionpanel",true);
		aSelectionRowG.exit().remove();
		
		// draw
		if (!aTableRowG.empty() && !aSelectionRowG.empty()) {
			var iSelectionWidth = $(aSelectionSvg[0][0]).width();
			var iTableWidth = $(aTableSvg[0][0]).width();
			this._drawExpandedBackground(aSelectionSvg,iSelectionWidth);
			this._drawExpandedBackground(aTableSvg,iTableWidth);
			this._drawExpandedContent(aTableSvg, iTableWidth);
		}
	};

	SelectionPanel.prototype._drawExpandedBackground = function (aSvg, iWidth) {		
		aSvg.selectAll(".selectionpanel").selectAll("rect").remove();
		aSvg.selectAll(".selectionpanel").append("rect").classed("sapGanttExpandChartBG",true)
			.attr("x", function (d) {
				return 0;
			})
			.attr("y", function (d) {
				return d.y;
			})
			.attr("height", function (d) {
				// -1 just for show parent container border 
				return d.rowHeight - 1;
			})
			.attr("width", function (d) {
				// -1 just for show parent container border
				return iWidth - 1;
			});
		
	};
	
	SelectionPanel.prototype._drawExpandedContent = function (aSvg, iWidth) {
		aSvg.selectAll(".selectionpanel").selectAll("g").remove();

		var that = this;
		aSvg.selectAll(".selectionpanel").append("g").classed("sapGanttExpandChartContent",true);
		var gShape = aSvg.selectAll(".sapGanttExpandChartContent");
		var filterGroup = gShape.filter(function(d, i) { return d.index === 1; });
		filterGroup.append("image")
		.classed("hasTitle", function (d) {
			return "image";
		})
		.attr("xlink:href", function (d) {
			return d.icon;
		})
		.attr("x", function (d) {
			if (Core.getConfiguration().getRTL() === true) {
				//right width to the parent container for RTL mode
				return iWidth - 19 - 16;
			} else {
				//left width to the parent container
				return 19;
			}
			
		})
		.attr("y", function (d) {
			//top height to parent container
			return d.y + 4.25;
		})
		.attr("width", function (d) {
			//icon width
			return 16;
		})
		.attr("height", function (d) {
			//icon height
			return 16;
		});

		filterGroup.append("text")
		.attr("x", function (d) {
			if (Core.getConfiguration().getRTL() === true) {
				//right width to the parent container for RTL mode
				return iWidth - 93 + 56;
			} else {
				//left width to the parent container
				return 38;
			}
			
		})
		.attr("y", function (d) {
			//top height to parent container
			return d.y + 16.5;
		})
		.attr("font-size", function (d) {
			return "0.75em";
		})
		.text(function (d) {
			return d.name;
		});
		filterGroup.append("g")
					.attr("transform", function(d){
						var sInitialX = 0, sInitialY = d.y + 7;
						if (Core.getConfiguration().getRTL() === true) {
							//right width to the parent container for RTL mode
							sInitialX =  iWidth - 93 - 4;
						} else {
							//left width to the parent container, plus half width of the close button
							sInitialX =  93 + 8;
						}
						return "translate(" + sInitialX + "," + sInitialY + ")";
					});
		filterGroup.select("g").append("path")
			.classed("sapGanttExpandChartCloseButton", true)
			.attr("d", "M1 0 h3 v4 h4 v3 h-4 v4 h-3 v-4 h-4 v-3 h4 v-4 z")
			.attr("transform", "rotate(45)")
			.on("click", function (d) {
				var aChartScheme = [];
				aChartScheme.push(d.chartScheme);
				var oBinding = that._oGanttChartWithTable._oTT.getBinding("rows");
				var aRows = oBinding.getContexts(0, oBinding.getLength());
				for (var i = 0; i < aRows.length; i++) {
					var oContext = aRows[i].getProperty();
					if (oContext && d.data.parentData && oContext.id == d.data.parentData.id) {
						that._oGanttChartWithTable.fireEvent("collapseDummyRow",{isExpand : false, expandedChartSchemes: aChartScheme, aExpandedIndices : [i]});
					}
				}
			});
		var aClosePath = filterGroup.selectAll("path");
		aClosePath.select("title").remove();
		aClosePath.insert("title", ":first-child")
		.text(function(d) {
			return sap.ui.getCore().getLibraryResourceBundle("sap.gantt").getText("TLTP_CLOSE");
		});
	};

	return SelectionPanel;
},true);
