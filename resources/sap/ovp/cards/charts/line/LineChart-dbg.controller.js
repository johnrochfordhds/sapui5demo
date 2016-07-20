(function () {
	"use strict";
	/*global sap, jQuery */

	sap.ui.controller("sap.ovp.cards.charts.line.LineChart", {
		onInit: function () {
			sap.ovp.cards.charts.Utils.formatChartYaxis();
			var vizFrame = this.getView().byId("lineChartCard");
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
		onBeforeRendering : function() {
			sap.ovp.cards.charts.Utils.validateCardConfiguration(this);
			var vizFrame = this.getView().byId("lineChartCard");
			if (!vizFrame) {
				jQuery.sap.log.error(sap.ovp.cards.charts.Utils.constants.ERROR_NO_CHART +
						": (" + this.getView().getId() + ")");
			} else {
				vizFrame.addEventDelegate(this.delegate1, vizFrame);
				var binding = vizFrame.getDataset().getBinding("data");
				binding.attachDataReceived(jQuery.proxy(this.onDataReceived, this));
				sap.ovp.cards.charts.Utils.validateMeasuresDimensions(vizFrame, "Line");
			}
		},
		onDataReceived: function(oEvent) {
			var vizFrame = this.getView().byId("lineChartCard");
			sap.ovp.cards.charts.Utils.hideDateTimeAxis(vizFrame, "categoryAxis");
			sap.ovp.cards.charts.Utils.checkNoData(oEvent, this.getCardContentContainer(), vizFrame);
			vizFrame.addEventDelegate(this.delegate2, vizFrame);


		}
	});
})();
