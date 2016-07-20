(function () {
    "use strict";
    jQuery.sap.declare("sap.ovp.cards.CommonUtils");
    sap.ovp.cards.CommonUtils = {
        app : undefined,
        navigationHandler : undefined,

        enable : function(app, oNavHandler) {
            this.app = app;
            this.navigationHandler = oNavHandler;
        },

        getApp : function() {
            return this.app;
        },

        getNavigationHandler : function() {
            return this.navigationHandler;
        }
    };
}());