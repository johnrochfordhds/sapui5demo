(function () {
	"use strict";
	/*global sap, jQuery */

	sap.ui.controller("sap.ovp.cards.charts.donut.DonutChart", {
		onInit: function() {
			var vizFrame = this.getView().byId("donutChartCard");
			if (vizFrame) {
			vizFrame.attachBrowserEvent("click", this.onHeaderClick.bind(this));
			}
			this.delegate1 = {
					onBeforeRendering: function(){
						this.setBusy(true);
					}
				};
						
			this.delegate2 = {
					onAfterRendering: function(){
						this.setBusy(false);
					}
				};
		},
		onBeforeRendering: function () {
			var utils = sap.ovp.cards.charts.Utils;
			utils.validateCardConfiguration(this);
			var measureArrNames = [];
			var dimensionArrayNames = [];
			var vizFrame = this.getView().byId("donutChartCard");
			if (!vizFrame) {
				jQuery.sap.log.error(utils.constants.ERROR_NO_CHART +
						": (" + this.getView().getId() + ")");
			} else {
				vizFrame.addEventDelegate(this.delegate1, vizFrame);
				var binding = vizFrame.getDataset().getBinding("data");
				binding.attachDataReceived(jQuery.proxy(this.onDataReceived, this));
				sap.ovp.cards.charts.Utils.validateMeasuresDimensions(vizFrame, "Donut");
				var entityTypeObject = this.getCardPropertiesModel().getProperty("/entityType");
				var columnLabels = utils.getAllColumnLabels(entityTypeObject);
				var measuresArr = vizFrame.getDataset().getMeasures();
				var dimensionsArr = vizFrame.getDataset().getDimensions();
	
				measureArrNames.push(measuresArr[0].getName());
				var dimensionName = columnLabels[dimensionsArr[0].getName()];
				dimensionArrayNames.push(dimensionName ? dimensionName : dimensionsArr[0].getName());

				vizFrame.removeAllFeeds();
				vizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "size",
					'type': "Measure",
					'values': measureArrNames
				}));
				vizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "color",
					'type': "Dimension",
					'values': dimensionArrayNames
				}));
	
				vizFrame.setVizProperties({
					size:{
						title:{
							visible:false
						}
					},
					color:{
						title:{
							visible:false
						}
					},
					legend: {
						isScrollable: false
					},
	
					title: {
						visible: false
					},
					interaction:{
						noninteractiveMode: true,
						selectability: {
							legendSelection: false,
							axisLabelSelection: false,
							mode: "NONE",
							plotLassoSelection: false,
							plotStdSelection: false
						}
					}
				});
				utils.formatChartYaxis();
			}
		},
		onDataReceived: function(oEvent) {
			var vizFrame = this.getView().byId("donutChartCard");
			vizFrame.addEventDelegate(this.delegate2, vizFrame);
			sap.ovp.cards.charts.Utils.checkNoData(oEvent, this.getCardContentContainer(), vizFrame);
		}
	});
})();
