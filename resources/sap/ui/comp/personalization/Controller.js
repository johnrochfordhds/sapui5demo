/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','./ColumnsController','./FilterController','./GroupController','./SortController','./DimeasureController','./Util','sap/ui/comp/library','./ChartWrapper'],function(q,M,C,F,G,S,D,U,a,b){"use strict";var c=M.extend("sap.ui.comp.personalization.Controller",{constructor:function(i,s){M.apply(this,arguments);},metadata:{publicMethods:["setPersonalizationData"],properties:{setting:{type:"object",defaultValue:null},resetToInitialTableState:{type:"boolean",defaultValue:true}},associations:{table:{type:"object",multiple:false}},events:{beforePotentialTableChange:{},afterPotentialTableChange:{},afterP13nModelDataChange:{parameters:{changeReason:{type:"sap.ui.comp.personalization.ResetType"},persistentData:{type:"object"},changeData:{type:"object"},changeType:{type:"sap.ui.comp.personalization.ChangeType"},changeTypeVariant:{type:"sap.ui.comp.personalization.ChangeType"}}}},library:"sap.ui.comp"}});c.prototype.setSetting=function(s){s=this.validateProperty("setting",s);this.setProperty("setting",s,true);if(!s){return this;}if(!this.getTable()){this._bSettingPending=true;return this;}this._mergeSettingCurrentBy(s);this._removeUnsupportedNamespaces();this._checkIgnoredColumnKeys();this._masterSync(c.SyncReason.NewSetting,null);return this;};c.prototype._mergeSettingCurrentBy=function(s){for(var t in s){if(s[t].visible===false){delete this._oSettingCurrent[t];continue;}if(this._oSettingCurrent[t]&&this._oSettingCurrent[t].visible===true){this._oSettingCurrent[t].controller=s[t].controller?s[t].controller:this._oSettingCurrent[t].controller;this._oSettingCurrent[t].payload=s[t].payload?s[t].payload:undefined;this._oSettingCurrent[t].ignoreColumnKeys=s[t].ignoreColumnKeys?s[t].ignoreColumnKeys:[];this._oSettingCurrent[t].triggerModelChangeOnColumnInvisible=s[t].triggerModelChangeOnColumnInvisible?s[t].triggerModelChangeOnColumnInvisible:undefined;}else{this._oSettingCurrent[t]={visible:s[t].visible,controller:s[t].controller?s[t].controller:undefined,payload:s[t].payload?s[t].payload:undefined,ignoreColumnKeys:s[t].ignoreColumnKeys?s[t].ignoreColumnKeys:[],triggerModelChangeOnColumnInvisible:s[t].triggerModelChangeOnColumnInvisible?s[t].triggerModelChangeOnColumnInvisible:undefined};}}};c.prototype._mixSetting=function(s,o){if(!o){return s;}for(var t in o){if(o[t].visible&&s[t]&&s[t].visible){o[t].controller=s[t].controller;o[t].payload=o[t].payload?o[t].payload:s[t].payload;}}return o;};c.prototype.setTable=function(t){this.setAssociation("table",t);if(!t){return this;}if(t instanceof b){this._oSettingCurrent=U.copy(this._oSettingOriginalChart);}else{this._oSettingCurrent=U.copy(this._oSettingOriginalTable);}if(this._bSettingPending){this._bSettingPending=false;this._mergeSettingCurrentBy(this.getSetting());}this._oInitialVisiblePanelType=this._getInitialVisiblePanelType();this._removeUnsupportedNamespaces();this._checkIgnoredColumnKeys();if(!U.isConsistent(this.getTable().getColumns())){throw"The table instance provided contain some columns for which a columnKey is provided, some for which a columnKey is not provided. This is not allowed ! ";}this._masterSync(c.SyncReason.NewTable,null);return this;};c.prototype.getTable=function(){var t=this.getAssociation("table");if(typeof t==="string"){t=sap.ui.getCore().byId(t);}return t;};c.prototype.getModel=function(){return this._oModel;};c.prototype.init=function(){var t=this;this._oDialog=null;this._oPayload=null;this._oPersistentDataRestore=null;this._oPersistentDataCurrentVariant=null;this._oPersistentDataAlreadyKnown=null;this._oPersistentDataBeforeOpen=null;this._oModel=null;this._aColumnKeysOfDateType=[];this._bSettingPending=false;this._aColumnKeysOfBooleanType=[];this._aColumnKeysOfTimeType=[];this._oSettingOriginalTable={columns:{controller:new C({afterColumnsModelDataChange:function(e){t._fireChangeEvent();},beforePotentialTableChange:function(e){t.fireBeforePotentialTableChange();},afterPotentialTableChange:function(e){t.fireAfterPotentialTableChange();}}),visible:true},sort:{controller:new S({afterSortModelDataChange:function(e){t._fireChangeEvent();},beforePotentialTableChange:function(e){t.fireBeforePotentialTableChange();},afterPotentialTableChange:function(e){t.fireAfterPotentialTableChange();}}),visible:true},filter:{controller:new F({afterFilterModelDataChange:function(e){t._fireChangeEvent();},beforePotentialTableChange:function(e){t.fireBeforePotentialTableChange();},afterPotentialTableChange:function(e){t.fireAfterPotentialTableChange();}}),visible:true},group:{controller:new G({afterGroupModelDataChange:function(e){t._fireChangeEvent();},beforePotentialTableChange:function(e){t.fireBeforePotentialTableChange();},afterPotentialTableChange:function(e){t.fireAfterPotentialTableChange();}}),visible:true}};this._oSettingOriginalChart={dimeasure:{controller:new D({afterDimeasureModelDataChange:function(e){t._fireChangeEvent();},beforePotentialTableChange:function(e){t.fireBeforePotentialTableChange();},afterPotentialTableChange:function(e){t.fireAfterPotentialTableChange();}}),visible:true},sort:{controller:new S({afterSortModelDataChange:function(e){t._fireChangeEvent();},beforePotentialTableChange:function(e){t.fireBeforePotentialTableChange();},afterPotentialTableChange:function(e){t.fireAfterPotentialTableChange();}}),visible:true},filter:{controller:new F({afterFilterModelDataChange:function(e){t._fireChangeEvent();},beforePotentialTableChange:function(e){t.fireBeforePotentialTableChange();},afterPotentialTableChange:function(e){t.fireAfterPotentialTableChange();}}),visible:true}};};c.prototype.openDialog=function(s){this._masterSync(c.SyncReason.NewTableBinding,null);this._oDialog=new sap.m.P13nDialog({stretch:sap.ui.Device.system.phone,showReset:true,initialVisiblePanelType:this._oInitialVisiblePanelType,validationExecutor:q.proxy(this._handleDialogValidate,this)});this._oDialog.toggleStyleClass("sapUiSizeCompact",!!q(this.getTable().getDomRef()).closest(".sapUiSizeCompact").length);var o=this._mixSetting(this._oSettingCurrent,s);var p=this._callControllers(o,"getPanel");for(var t in o){if(p[t]){this._oDialog.addPanel(p[t]);}}this._oPersistentDataBeforeOpen=this._getPersistentDataCopy();this._oDialog.attachOk(this._handleDialogOk,this);this._oDialog.attachCancel(this._handleDialogCancel,this);this._oDialog.attachReset(this._handleDialogReset,this);this._oDialog.attachAfterClose(this._handleDialogAfterClose,this);this._oDialog.open();};sap.ui.comp.personalization.Controller.prototype._getSettingOfPanels=function(){if(!this._oDialog||!this._oDialog.getPanels()){return{};}var s={};this._oDialog.getPanels().forEach(function(p){var t=p.getType();s[t]={controller:this._oSettingCurrent[t].controller,visible:this._oSettingCurrent[t].visible};},this);return s;};c.prototype._getPersistentDataCopy=function(){var p={};if(this.getModel()&&this.getModel().getData().persistentData){p=U.copy(this.getModel().getData().persistentData);}return p;};c.prototype.setPersonalizationData=function(n){if(!this._sanityCheck(n)){return;}this._masterSync(c.SyncReason.NewModelDataVariant,n);if(this.getTable()&&this.getTable().setFixedColumnCount){this.getTable().setFixedColumnCount(0);}this._fireChangeEvent();};c.prototype.setChartType=function(s){};c.prototype.resetPersonalization=function(r){var R=this.getResetToInitialTableState();if(r===sap.ui.comp.personalization.ResetType.ResetFull||r===sap.ui.comp.personalization.ResetType.ResetPartial){R=(r===sap.ui.comp.personalization.ResetType.ResetFull);}if(R){this._masterSync(c.SyncReason.ResetModelData,null);this._fireChangeEvent(sap.ui.comp.personalization.ResetType.ResetFull);}else{this._masterSync(c.SyncReason.ResetModelDataVariant,null);this._fireChangeEvent(sap.ui.comp.personalization.ResetType.ResetPartial);}};c.prototype._handleDialogReset=function(e){if(this.getResetToInitialTableState()){this._masterSync(c.SyncReason.ResetModelData,null);}else{this._masterSync(c.SyncReason.ResetModelDataVariant,null);}var r=this._getSettingOfPanels();this._callControllers(r,"onAfterReset",e.getParameter("payload"));};c.prototype._handleDialogCancel=function(e){this._oDialog.detachCancel(this._handleDialogCancel,this);this._oDialog.close();};c.prototype._handleDialogOk=function(e){this._oDialog.detachOk(this._handleDialogOk,this);this._oPayload={trigger:"ok",payload:e.getParameter("payload")};this._oDialog.close();};c.prototype._handleDialogValidate=function(p){var s=this._getSettingOfPanels();var P=this._callControllers(s,"getUnionData",U.copy(this._oPersistentDataRestore),this._getPersistentDataCopy());return sap.ui.comp.personalization.Util.validate(s,p,this.getTable(),P);};c.prototype._getInitialVisiblePanelType=function(){for(var t in this._oSettingCurrent){return t;}};c.prototype._handleDialogAfterClose=function(){var t=this;var _=this._oPayload;this._oInitialVisiblePanelType=this._oDialog.getVisiblePanel()?this._oDialog.getVisiblePanel().getType():this._getInitialVisiblePanelType();if(_&&_.trigger==="ok"){setTimeout(function(){var s=t._getSettingOfPanels();if(t._oDialog){t._oDialog.destroy();t._oDialog=null;}t._callControllers(s,"onAfterSubmit",t._oPayload.payload);t._oPayload=null;t._fireChangeEvent();t._oPersistentDataBeforeOpen=null;},0);}else{setTimeout(function(){if(t._oDialog){t._oDialog.destroy();t._oDialog=null;}t._masterSync(c.SyncReason.NewModelData,t._oPersistentDataBeforeOpen);t._oPersistentDataBeforeOpen=null;},0);}};c.prototype._masterSync=function(u,n){var t=null,j=null;switch(u){case c.SyncReason.NewTableBinding:this._callControllers(this._oSettingCurrent,"syncTable2TransientModel");break;case c.SyncReason.NewTable:this.initializeModel();this._callControllers(this._oSettingCurrent,"setTable",this.getTable());this._setSizeLimit(this.getTable());this._callControllers(this._oSettingCurrent,"syncTable2TransientModel");this._callControllers(this._oSettingCurrent,"createTableRestoreJson");this._callControllers(this._oSettingCurrent,"syncTable2PersistentModel");j=this._callControllers(this._oSettingCurrent,"getTableRestoreJson");this._oPersistentDataRestore=U.copy(j);this._oPersistentDataCurrentVariant={};this._aColumnKeysOfDateType=[];this._aColumnKeysOfTimeType=[];this._aColumnKeysOfBooleanType=[];this._oPersistentDataAlreadyKnown=U.copy(this._oPersistentDataRestore);break;case c.SyncReason.NewSetting:this.initializeModel();if(this.getTable()){this._callControllers(this._oSettingCurrent,"setTable",this.getTable());this._setSizeLimit(this.getTable());}this._callControllers(this._oSettingCurrent,"setIgnoreColumnKeys");this._callControllers(this._oSettingCurrent,"setTriggerModelChangeOnColumnInvisible");this._callControllers(this._oSettingCurrent,"syncTable2TransientModel");this._callControllers(this._oSettingCurrent,"createTableRestoreJson");this._callControllers(this._oSettingCurrent,"syncTable2PersistentModel");j=this._callControllers(this._oSettingCurrent,"getTableRestoreJson");this._oPersistentDataRestore=U.copy(j);this._oPersistentDataAlreadyKnown=U.copy(this._oPersistentDataRestore);for(t in this._oPersistentDataRestore){if(!this._oSettingCurrent[t]){delete this._oPersistentDataRestore[t];}}for(t in this._oPersistentDataAlreadyKnown){if(!this._oSettingCurrent[t]){delete this._oPersistentDataAlreadyKnown[t];}}for(t in this._oPersistentDataCurrentVariant){if(!this._oSettingCurrent[t]){delete this._oPersistentDataCurrentVariant[t];}}break;case c.SyncReason.NewModelDataVariant:if(n===null){n={};}var p=this._callControllers(this._oSettingCurrent,"getUnionData",U.copy(this._oPersistentDataRestore),U.copy(n));this.initializeModel(p);this._callControllers(this._oSettingCurrent,"syncTable2TransientModel");this._callControllers(this._oSettingCurrent,"syncJsonModel2Table",p);this._callControllers(this._oSettingCurrent,"reducePersistentModel");this._oPersistentDataCurrentVariant=U.copy(n);break;case c.SyncReason.NewModelData:if(n===null){n={};}var p=this._callControllers(this._oSettingCurrent,"getUnionData",U.copy(this._oPersistentDataRestore),U.copy(n));this.initializeModel(p);this._callControllers(this._oSettingCurrent,"syncTable2TransientModel");this._callControllers(this._oSettingCurrent,"syncJsonModel2Table",p);this._callControllers(this._oSettingCurrent,"reducePersistentModel");break;case c.SyncReason.ResetModelData:var P=this._projectRestoreData2PersistentModel4Panels(this._oPersistentDataRestore);this.initializeModel(P);this._callControllers(this._oSettingCurrent,"syncTable2TransientModel");this._callControllers(this._oSettingCurrent,"syncJsonModel2Table",U.copy(P));this._callControllers(this._oSettingCurrent,"reducePersistentModel");break;case c.SyncReason.ResetModelDataVariant:var P=this._projectRestoreData2PersistentModel4Panels(this._oPersistentDataCurrentVariant);var o=this._callControllers(this._oSettingCurrent,"getUnionData",U.copy(this._oPersistentDataRestore),U.copy(P));this.initializeModel(o);this._callControllers(this._oSettingCurrent,"syncTable2TransientModel");this._callControllers(this._oSettingCurrent,"syncJsonModel2Table",o);this._callControllers(this._oSettingCurrent,"reducePersistentModel");break;default:}this.getModel().refresh();};c.prototype.initializeModel=function(n){if(!this.getModel()){this._oModel=new sap.ui.model.json.JSONModel();this._oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);}var N=null;if(n){N=U.copy(n);}var o=N||((this.getModel().getData()&&this.getModel().getData().persistentData)?this.getModel().getData().persistentData:{});for(var t in o){if(!this._oSettingCurrent[t]){delete o[t];}}this.getModel().setData({transientData:{},persistentData:o});this._callControllers(this._oSettingCurrent,"initializeModel",this.getModel());};c.prototype._fireChangeEvent=function(r){var o={};var p=this._callControllers(this._oSettingCurrent,"getUnionData",U.copy(this._oPersistentDataRestore),this._getPersistentDataCopy());var s=this._callControllers(this._oSettingCurrent,"getChangeType",p,U.copy(this._oPersistentDataAlreadyKnown));var P=this._callControllers(this._oSettingCurrent,"getUnionData",U.copy(this._oPersistentDataRestore),U.copy(this._oPersistentDataCurrentVariant));o.changeTypeVariant=this._callControllers(this._oSettingCurrent,"getChangeType",p,P);var d=U.copy(this._oPersistentDataAlreadyKnown);o.changeType=this._callControllers(this._oSettingCurrent,"getChangeType",p,d);if(!U.hasChangedType(s)&&!U.hasChangedType(o.changeTypeVariant)){return;}if(!this._aColumnKeysOfDateType.length&&(U.isNamespaceChanged(o.changeType,sap.m.P13nPanelType.filter)||U.isNamespaceChanged(o.changeTypeVariant,sap.m.P13nPanelType.filter))){this._aColumnKeysOfDateType=U.getColumnKeysOfDateType(this.getTable());}if(!this._aColumnKeysOfTimeType.length&&(U.isNamespaceChanged(o.changeType,sap.m.P13nPanelType.filter)||U.isNamespaceChanged(o.changeTypeVariant,sap.m.P13nPanelType.filter))){this._aColumnKeysOfTimeType=U.getColumnKeysOfTimeType(this.getTable());}if(!this._aColumnKeysOfBooleanType.length&&(U.isNamespaceChanged(o.changeType,sap.m.P13nPanelType.filter)||U.isNamespaceChanged(o.changeTypeVariant,sap.m.P13nPanelType.filter))){this._aColumnKeysOfBooleanType=U.getColumnKeysOfBooleanType(this.getTable());}if(r===sap.ui.comp.personalization.ResetType.ResetFull||r===sap.ui.comp.personalization.ResetType.ResetPartial){o.changeReason=r;}var e=this._callControllers(this._oSettingCurrent,"getChangeData",p,d);o.changeData=U.removeEmptyProperty(U.copy(e));U.recoverPersonalisationData(o.changeData,this.getTable(),this._aColumnKeysOfDateType);U.recoverPersonalisationTimeData(o.changeData,this.getTable(),this._aColumnKeysOfTimeType);U.recoverPersonalisationBooleanData(o.changeData,this.getTable(),this._aColumnKeysOfBooleanType);var f=U.copy(this._oPersistentDataRestore);var g=this._callControllers(this._oSettingCurrent,"getChangeData",p,f);o.persistentData=U.removeEmptyProperty(g);U.recoverPersonalisationData(o.persistentData,this.getTable(),this._aColumnKeysOfDateType);U.recoverPersonalisationTimeData(o.persistentData,this.getTable(),this._aColumnKeysOfTimeType);U.recoverPersonalisationBooleanData(o.persistentData,this.getTable(),this._aColumnKeysOfBooleanType);this.fireAfterP13nModelDataChange(o);this._oPersistentDataAlreadyKnown=this._callControllers(this._oSettingCurrent,"getUnionData",U.copy(this._oPersistentDataAlreadyKnown),e);};c.prototype._projectRestoreData2PersistentModel4Panels=function(p){if(!this._oDialog||q.isEmptyObject(p)){return p;}var P=this._getPersistentDataCopy();var d=this._oDialog.getPanels();d.forEach(function(o){if(p[o.getType()]){P[o.getType()]=U.copy(p[o.getType()]);}else{delete P[o.getType()];}});return P;};c.prototype._checkIgnoredColumnKeys=function(){var t=this.getTable();if(!t){return;}if(t instanceof b){return;}var i=U.getUnionOfAttribute(this._oSettingCurrent,"ignoreColumnKeys");var v=U.getVisibleColumnKeys(t);i.some(function(s){if(v.indexOf(s)>-1){throw"The provided 'ignoreColumnKeys' are inconsistent. No columns specified as ignored is allowed to be visible.";}});var d=this;t.getColumns().forEach(function(o){var s=q.proxy(o.setVisible,o);var f=function(V){if(V){var i=U.getUnionOfAttribute(d._oSettingCurrent,"ignoreColumnKeys");if(i.indexOf(U.getColumnKey(this))>-1){throw"The provided 'ignoreColumnKeys' are inconsistent. No column specified as ignored is allowed to be visible. "+this;}}s(V);};if(o.setVisible.toString()===f.toString()){return;}o.setVisible=f;});};c.prototype._removeUnsupportedNamespaces=function(){var t=this.getTable();if(t&&t instanceof sap.ui.table.Table&&!(t instanceof sap.ui.table.AnalyticalTable)){delete this._oSettingCurrent.group;}};c.prototype._getArgumentsByType=function(A,t){var r=[],o=null;if(A&&A.length&&t){A.forEach(function(d){if(d&&d[t]&&typeof d[t]!=="function"){o={};o[t]=d[t];r.push(o);}else{r.push(d);}});}return r;};c.prototype._callControllers=function(s,m){var t=null,o=null,d=null,A=null;var r={},e=Array.prototype.slice.call(arguments,2);for(t in s){o=d=A=null;o=s[t];d=o.controller;if(!d||!o.visible||!d[m]){continue;}A=this._getArgumentsByType(e,t);if(m==="getPanel"){A.push(o.payload);}else if(m==="setIgnoreColumnKeys"){A.push(o.ignoreColumnKeys);}else if(m==="setTriggerModelChangeOnColumnInvisible"){A.push(o.triggerModelChangeOnColumnInvisible);}var R=d[m].apply(d,A);if(R!==null&&R!==undefined&&R[t]!==undefined){r[t]=R[t];}else{r[t]=R;}}return r;};c.prototype._setSizeLimit=function(t){this.getModel().setSizeLimit(this.getTable().getColumns().length+1000);};c.prototype._sanityCheck=function(n){return true;};c.prototype.exit=function(){var t;if(this._oDialog){this._oDialog.destroy();this._oDialog=null;}this._callControllers(this._oSettingCurrent,"destroy");for(t in this._oSettingCurrent){this._oSettingCurrent[t]=null;}this._oSettingCurrent=null;for(t in this._oSettingOriginalTable){this._oSettingOriginalTable[t]=null;}this._oSettingOriginalTable=null;this._oSettingCurrent=null;for(t in this._oSettingOriginalChart){this._oSettingOriginalChart[t]=null;}this._oSettingOriginalChart=null;if(this.getModel()){this.getModel().destroy();this._oModel=null;}this._oPersistentDataRestore=null;this._oPersistentDataCurrentVariant=null;this._oPersistentDataAlreadyKnown=null;this._oPersistentDataBeforeOpen=null;this._oPayload=null;};c.SyncReason={NewTable:0,NewSetting:1,NewModelData:6,NewModelDataVariant:2,ResetModelData:3,ResetModelDataVariant:4,NewTableBinding:5};return c;},true);
