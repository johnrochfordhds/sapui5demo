/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/controller/requestOptions"],function(B){"use strict";return B.extend("sap.apf.modeler.ui.controller.facetFilterFRR",{setDisplayText:function(){var c=this;var t=c.getView().getViewData().oTextReader;c.byId("idSourceLabel").setText(t("vhSource"));c.byId("idEntityLabel").setText(t("vhEntity"));c.byId("idSelectPropertiesLabel").setText(t("vhSelectProperties"));},handleCopy:function(){var c=this;c.setDetailData();},clearFRRFields:function(){var c=this;c.clearSource();c.setDetailData();},enableOrDisableView:function(){var e=true,c=this;if(c.oParentObject.getUseSameRequestForValueHelpAndFilterResolution()===true){e=false;}c.byId("idSource").setEnabled(e);c.byId("idEntity").setEnabled(e);c.byId("idSelectProperties").setEnabled(e);},getSource:function(){var c=this;return c.oParentObject.getServiceOfFilterResolution();},getAllEntities:function(s){var c=this;return c.oConfigurationEditor.getAllEntitySetsOfService(s);},getEntity:function(){var c=this;return c.oParentObject.getEntitySetOfFilterResolution();},getAllEntitySetProperties:function(s,e){var c=this;return c.oConfigurationEditor.getAllPropertiesOfEntitySet(s,e);},clearSource:function(){var c=this;c.oParentObject.setServiceOfFilterResolution(undefined);c.clearEntity();},clearEntity:function(){var c=this;c.oParentObject.setEntitySetOfFilterResolution(undefined);c.clearSelectProperties();},clearSelectProperties:function(){var c=this;var o=c.oParentObject.getSelectPropertiesOfFilterResolution();o.forEach(function(p){c.oParentObject.removeSelectPropertyOfFilterResolution(p);});},updateSource:function(s){var c=this;c.oParentObject.setServiceOfFilterResolution(s);},updateEntity:function(e){var c=this;c.oParentObject.setEntitySetOfFilterResolution(e);},updateSelectProperties:function(s){var c=this;c.clearSelectProperties();s.forEach(function(p){c.oParentObject.addSelectPropertyOfFilterResolution(p);});},getSelectProperties:function(){var c=this;return c.oParentObject.getSelectPropertiesOfFilterResolution();},getValidationState:function(){var c=this;return c.viewValidator.getValidationState();}});});
