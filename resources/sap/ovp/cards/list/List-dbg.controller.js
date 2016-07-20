(function () {
    "use strict";
    /*global sap, jQuery */

    sap.ui.controller("sap.ovp.cards.list.List", {
        maxValue: -1,
        counter: 0,
        arrayLength: 0,
        onInit: function () {
            this.counter = 0;
        },

        onListItemPress: function (oEvent) {
            var aNavigationFields = this.getEntityNavigationEntries(oEvent.getSource().getBindingContext(), this.getCardPropertiesModel().getProperty("/annotationPath"));
            this.doNavigation(oEvent.getSource().getBindingContext(), aNavigationFields[0]);
        },

        normalizeValueToPercentage: function (value) {
            var oEntityType = this.getEntityType(),
                sAnnotationPath = this.getCardPropertiesModel().getProperty("/annotationPath"),
                aRecords = oEntityType[sAnnotationPath],
                context = this.getMetaModel().createBindingContext(oEntityType.$path + "/" + sAnnotationPath);
            if (sap.ovp.cards.AnnotationHelper.isFirstDataPointPercentageUnit(context, aRecords)) {
                var iPercent = parseInt(value, 10);
                return iPercent <= 100 ? iPercent : 100;
            }
            var maxV = this._getMaxValue();
            if (this.counter == this.arrayLength) {
                this.counter = 0;
                this.maxValue = -1;
            }
            if (value > maxV) {
                return 100;
            } else {
                var iValue = (parseInt(value, 10) * 100) / maxV;
                if (iValue != 0) {
                    return iValue;
                } else { //if the value is 0 we want to show some minimal value in the bar
                    return 0.5;
                }
            }
        },

        _getMaxValue: function () {
            this.counter++;
            if (this.maxValue != -1) {
                return this.maxValue;
            }
            var oEntityType = this.getEntityType(),
                sAnnotationPath = this.getCardPropertiesModel().getProperty("/annotationPath"),
                aRecords = oEntityType[sAnnotationPath],
                context = this.getMetaModel().createBindingContext(oEntityType.$path + "/" + sAnnotationPath);
            var dataPointValue = sap.ovp.cards.AnnotationHelper.getFirstDataPointValue(context, aRecords);
            var barList = this.getView().byId("ovpList"),
                listItems = barList.getBinding("items"),
                itemsContextsArray = listItems.getCurrentContexts();
            this.arrayLength = itemsContextsArray.length;

            for (var i = 0; i < itemsContextsArray.length; i++) {
                if (parseInt(itemsContextsArray[i].getObject()[dataPointValue], 10) > this.maxValue) {
                    this.maxValue = parseInt(itemsContextsArray[i].getObject()[dataPointValue], 10);
                }
            }
            return this.maxValue;
        },

        /**
         * Gets the card items binding object for the count footer
         */
        getCardItemsBinding: function() {
            var list = this.getView().byId("ovpList");
            return list.getBinding("items");
        }


    });
})();
