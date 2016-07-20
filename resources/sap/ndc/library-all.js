jQuery.sap.declare('sap.ndc.library-all');if(!jQuery.sap.isDeclared('sap.ndc.BarcodeScanner')){
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2016 SAP SE. All rights reserved
    
 */
jQuery.sap.declare('sap.ndc.BarcodeScanner');jQuery.sap.require('jquery.sap.global');sap.ui.define("sap/ndc/BarcodeScanner",['jquery.sap.global'],function(q){"use strict";var B=(function(){var D="sap.ndc.BarcodeScanDialog";document.addEventListener("settingsDone",i);document.addEventListener("SettingCompleted",i);document.addEventListener("mockSettingsDone",i);var a={},s,S=new sap.ui.model.json.JSONModel({available:false}),o=null,b={},r=true,R=new sap.ui.model.resource.ResourceModel({bundleName:"sap.ndc.messagebundle"});function g(){try{s=cordova.plugins.barcodeScanner;if(s){q.sap.log.debug("Cordova BarcodeScanner plugin is available!");}else{S.setProperty("/available",false);q.sap.log.error("BarcodeScanner: cordova.plugins.barcodeScanner is not available");}}catch(e){q.sap.log.info("BarcodeScanner: cordova.plugins is not available");return;}}function i(){s=null;S.setProperty("/available",true);if(sap.Settings===undefined){q.sap.log.debug("No sap.Settings. No feature vector available.");g();}else if(sap.Settings&&typeof sap.Settings.isFeatureEnabled==="function"){sap.Settings.isFeatureEnabled("cordova.plugins.barcodeScanner",function(e){if(e){g();}else{S.setProperty("/available",false);q.sap.log.warning("BarcodeScanner: Feature disabled");}},function(){q.sap.log.warning("BarcodeScanner: Feature check failed");});}else{q.sap.log.warning("BarcodeScanner: Feature vector (sap.Settings.isFeatureEnabled) is not available");}}function c(f,l){var d;b.onSuccess=f;b.onLiveUpdate=l;if(!o){d=new sap.ui.model.json.JSONModel();o=sap.ui.xmlfragment(D,{onOK:function(e){a.closeScanDialog();if(typeof b.onSuccess==="function"){b.onSuccess({text:d.getProperty("/barcode"),cancelled:false});}},onCancel:function(e){a.closeScanDialog();if(typeof b.onSuccess==="function"){b.onSuccess({text:d.getProperty("/barcode"),cancelled:true});}},onLiveChange:function(e){if(typeof b.onLiveUpdate==="function"){b.onLiveUpdate({newValue:e.getParameter("newValue")});}},onAfterOpen:function(e){e.getSource().getContent()[0].focus();}});o.setModel(d);o.setModel(R,"i18n");}return o;}a.scan=function(f,F,l){var d;if(!r){q.sap.log.error("Barcode scanning is already in progress.");return;}r=false;if(S.getProperty("/available")==true&&s==null){g();}if(s){s.scan(function(e){if(e.cancelled==="false"||!e.cancelled){e.cancelled=false;if(typeof f==="function"){f(e);}}else{d=c(f,l);d.getModel().setProperty("/barcode","");d.getModel().setProperty("/isNoScanner",false);d.open();}r=true;},function(e){q.sap.log.error("Barcode scanning failed.");if(typeof F==="function"){F(e);}r=true;});}else{d=c(f,l);d.getModel().setProperty("/barcode","");d.getModel().setProperty("/isNoScanner",true);d.open();}};a.closeScanDialog=function(){if(o){o.close();r=true;}};a.getStatusModel=function(){return S;};i();return a;}());return B;},true);};if(!jQuery.sap.isDeclared('sap.ndc.BarcodeScannerButtonRenderer')){jQuery.sap.declare('sap.ndc.BarcodeScannerButtonRenderer');jQuery.sap.require('jquery.sap.global');sap.ui.define("sap/ndc/BarcodeScannerButtonRenderer",['jquery.sap.global'],function(q){"use strict";var B={};B.render=function(r,c){if(!c.getVisible()){return;}r.write("<span");r.writeControlData(c);r.write(">");r.renderControl(c.getAggregation("_btn"));r.write("</span>");};return B;},true);};if(!jQuery.sap.isDeclared('sap.ndc.library')){jQuery.sap.declare('sap.ndc.library');jQuery.sap.require('jquery.sap.global');jQuery.sap.require('sap.m.library');jQuery.sap.require('sap.ui.core.library');sap.ui.define("sap/ndc/library",['jquery.sap.global','sap/m/library','sap/ui/core/library'],function(q,l,a){"use strict";sap.ui.getCore().initLibrary({name:"sap.ndc",dependencies:["sap.ui.core","sap.m"],types:[],interfaces:[],controls:["sap.ndc.BarcodeScannerButton"],elements:[],noLibraryCSS:true,version:"1.36.12"});return sap.ndc;},false);};if(!jQuery.sap.isDeclared('sap.ndc.BarcodeScannerButton')){jQuery.sap.declare('sap.ndc.BarcodeScannerButton');jQuery.sap.require('jquery.sap.global');jQuery.sap.require('sap.ui.core.Control');sap.ui.define("sap/ndc/BarcodeScannerButton",['jquery.sap.global','./BarcodeScanner','./library','sap/ui/core/Control'],function(q,B,l,C){"use strict";var a=C.extend("sap.ndc.BarcodeScannerButton",{metadata:{library:"sap.ndc",properties:{provideFallback:{type:"boolean",defaultValue:true},visible:{type:"boolean",defaultValue:true},width:{type:"sap.ui.core.CSSSize",defaultValue:null}},aggregations:{_btn:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{scanSuccess:{parameters:{text:{type:"string"},format:{type:"string"},cancelled:{type:"boolean"}}},scanFail:{},inputLiveUpdate:{parameters:{newValue:{type:"string"}}}}}});a.prototype.init=function(){var b;this.setAggregation("_btn",new sap.m.Button({icon:"sap-icon://bar-code",press:q.proxy(this._onBtnPressed,this)}));b=B.getStatusModel();this.setModel(b,"status");};a.prototype._onBtnPressed=function(e){B.scan(q.proxy(this._onScanSuccess,this),q.proxy(this._onScanFail,this),q.proxy(this._onInputLiveUpdate,this));};a.prototype._onScanSuccess=function(A){this.fireScanSuccess(A);};a.prototype._onScanFail=function(A){this.fireScanFail(A);};a.prototype._onInputLiveUpdate=function(A){this.fireInputLiveUpdate(A);};a.prototype.setProvideFallback=function(f){var v=this.getProvideFallback();var b;f=!!f;if(v!==f){this.setProperty("provideFallback",f);b=this.getAggregation("_btn");if(f){b.unbindProperty("visible");b.setVisible(true);}else{b.bindProperty("visible","status>/available");}}return this;};a.prototype.setWidth=function(w){this.setProperty("width",w,true);this.getAggregation("_btn").setWidth(this.getWidth());return this;};return a;},true);};
