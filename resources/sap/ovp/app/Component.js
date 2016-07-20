(function(){"use strict";jQuery.sap.declare("sap.ovp.app.Component");jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");sap.ui.core.UIComponent.extend("sap.ovp.app.Component",{metadata:{routing:{config:{routerClass:sap.ui.core.routing.Router},targets:{},routes:[]},properties:{"cardContainerFragment":{"type":"string","defaultValue":"sap.ovp.app.CardContainer"}},version:"1.36.12",library:"sap.ovp.app",dependencies:{libs:["sap.m","sap.ui.comp","sap.uxap"],components:[]},config:{fullWidth:true,hideLightBackground:true}},_addModelsMeasurements:function(){var m=this.oModels;var M,s;for(s in m){M=this.getModel(s);if(M.getMetaModel()){this._addModelMeasurements(M,s);}}},_addModelMeasurements:function(m,M){var i="ovp:ModelLoading-"+M;var I="ovp:ModelBatchCall-"+M+":";jQuery.sap.measure.start(i,"Component createContent -> MetaData loaded","ovp");m.getMetaModel().loaded().then(function(){jQuery.sap.measure.end(i);});m.attachBatchRequestSent(function(e){jQuery.sap.measure.start(I+e.getParameter("ID"),"BatchRequestSent -> BatchRequestCompleted","ovp");});m.attachBatchRequestCompleted(function(e){jQuery.sap.measure.end(I+e.getParameter("ID"));});},getOvpConfig:function(){var o;var e=[];var m=this.getMetadata();while(m&&m.getComponentName()!=="sap.ovp.app"){o=m.getManifestEntry("sap.ovp");if(o){e.unshift(o);}m=m.getParent();}e.unshift({});e.unshift(true);o=jQuery.extend.apply(jQuery,e);return o;},createXMLView:function(o){jQuery.sap.measure.start("ovp:AppCreateContent","OVP app Component createContent","ovp");this._addModelsMeasurements();this.getRouter().initialize();var a=this.getMetadata().getManifestEntry("sap.app");var u=this.getMetadata().getManifestEntry("sap.ui");var i=jQuery.sap.getObject("icons.icon",undefined,u);var c=this.getMetadata().getComponentName();o.baseUrl=jQuery.sap.getModulePath(c);var b=new sap.ui.model.json.JSONModel(o);b.setProperty("/title",jQuery.sap.getObject("title",undefined,a));b.setProperty("/description",jQuery.sap.getObject("description",undefined,a));b.setProperty("/cardContainerFragment",this.getCardContainerFragment());if(i){if(i.indexOf("sap-icon")<0&&i.charAt(0)!=='/'){i=o.baseUrl+"/"+i;}b.setProperty("/icon",i);}var C=o.cards;var d=[];var e;for(var f in C){if(C.hasOwnProperty(f)&&C[f]){e=C[f];e.id=f;d.push(e);}}d.sort(function(g,h){if(g.id<h.id){return-1;}else if(g.id>h.id){return 1;}else{return 0;}});b.setProperty("/cards",d);this.setModel(b,"ui");var F=this.getModel(o.globalFilterModel);this.setModel(F);var E=F.getMetaModel().getODataEntityType(F.getMetaModel().oModel.oData.dataServices.schema[0].namespace+"."+o.globalFilterEntityType,true);var v=sap.ui.view({height:"100%",preprocessors:{xml:{bindingContexts:{ui:b.createBindingContext("/"),meta:F.getMetaModel().createBindingContext(E)},models:{ui:b,meta:F.getMetaModel()}}},type:sap.ui.core.mvc.ViewType.XML,viewName:"sap.ovp.app.Main"});jQuery.sap.measure.end("ovp:AppCreateContent");return v;},setContainer:function(){var o=this.getOvpConfig();var f=this.getModel(o.globalFilterModel);sap.ui.core.UIComponent.prototype.setContainer.apply(this,arguments);if(f){f.getMetaModel().loaded().then(function(){this.runAsOwner(function(){var v=this.createXMLView(o);this.setAggregation("rootControl",v);this.getUIArea().invalidate();}.bind(this));}.bind(this));}}});}());