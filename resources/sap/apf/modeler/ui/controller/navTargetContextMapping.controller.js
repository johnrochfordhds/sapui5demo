/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/controller/requestOptions"],function(B){"use strict";return B.extend("sap.apf.modeler.ui.controller.navTargetContextMapping",{setDisplayText:function(){var c=this;var t=c.getView().getViewData().oTextReader;c.byId("idSourceLabel").setText(t("source"));c.byId("idEntityLabel").setText(t("entity"));c.byId("idSelectPropertiesLabel").setText(t("mappedProperties"));},getSource:function(){var c=this;return c.oParentObject.getFilterMappingService();},getAllEntities:function(s){var c=this;return c.oConfigurationEditor.getAllEntitySetsOfService(s);},getEntity:function(){var c=this;return c.oParentObject.getFilterMappingEntitySet();},getAllEntitySetProperties:function(s,e){var c=this;return c.oConfigurationEditor.getAllPropertiesOfEntitySet(s,e);},clearSource:function(){var c=this;c.oParentObject.setFilterMappingService(undefined);c.clearEntity();},clearEntity:function(){var c=this;c.oParentObject.setFilterMappingEntitySet(undefined);c.clearSelectProperties();},clearSelectProperties:function(){var c=this;var o=c.oParentObject.getFilterMappingTargetProperties();o.forEach(function(p){c.oParentObject.removeFilterMappingTargetProperty(p);});},updateSource:function(s){var c=this;c.oParentObject.setFilterMappingService(s);},updateEntity:function(e){var c=this;c.oParentObject.setFilterMappingEntitySet(e);},updateSelectProperties:function(s){var c=this;c.clearSelectProperties();s.forEach(function(p){c.oParentObject.addFilterMappingTargetProperty(p);});},getSelectProperties:function(){var c=this;return c.oParentObject.getFilterMappingTargetProperties();},getValidationState:function(){var c=this;return c.viewValidator.getValidationState();}});});