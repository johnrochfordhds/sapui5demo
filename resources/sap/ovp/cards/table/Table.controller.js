(function(){"use strict";sap.ui.controller("sap.ovp.cards.table.Table",{onInit:function(){},onColumnListItemPress:function(e){var n=this.getEntityNavigationEntries(e.getSource().getBindingContext(),this.getCardPropertiesModel().getProperty("/annotationPath"));this.doNavigation(e.getSource().getBindingContext(),n[0]);},getCardItemsBinding:function(){var t=this.getView().byId("ovpTable");return t.getBinding("items");}});})();