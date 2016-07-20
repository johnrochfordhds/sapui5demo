/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/VBoxRenderer','sap/m/Column','sap/m/Label','sap/m/MessageBox','sap/m/Table','sap/m/Text','sap/m/Title','sap/m/OverflowToolbar','sap/m/OverflowToolbarButton','sap/m/ToolbarSeparator','sap/m/VBox','sap/ui/comp/library','sap/ui/comp/providers/TableProvider','sap/ui/comp/smartfilterbar/FilterProvider','sap/ui/comp/smartvariants/SmartVariantManagement','sap/ui/model/FilterOperator','sap/ui/model/json/JSONModel','sap/ui/table/AnalyticalColumn','sap/ui/table/AnalyticalTable','sap/ui/table/Column','sap/ui/table/Table','sap/ui/table/TreeTable','sap/ui/comp/personalization/Util','sap/ui/comp/util/FormatUtil','sap/ui/comp/odata/ODataModelUtil'],function(q,V,C,L,M,R,T,a,O,b,c,d,l,f,F,S,g,J,A,h,j,k,m,P,n,o){"use strict";var p=d.extend("sap.ui.comp.smarttable.SmartTable",{metadata:{library:"sap.ui.comp",designTime:true,properties:{entitySet:{type:"string",group:"Misc",defaultValue:null},smartFilterId:{type:"string",group:"Misc",defaultValue:null},ignoredFields:{type:"string",group:"Misc",defaultValue:null},initiallyVisibleFields:{type:"string",group:"Misc",defaultValue:null},requestAtLeastFields:{type:"string",group:"Misc",defaultValue:null},ignoreFromPersonalisation:{type:"string",group:"Misc",defaultValue:null},tableType:{type:"sap.ui.comp.smarttable.TableType",group:"Misc",defaultValue:null},useVariantManagement:{type:"boolean",group:"Misc",defaultValue:true},useExportToExcel:{type:"boolean",group:"Misc",defaultValue:true},useTablePersonalisation:{type:"boolean",group:"Misc",defaultValue:true},showRowCount:{type:"boolean",group:"Misc",defaultValue:true},header:{type:"string",group:"Misc",defaultValue:null},toolbarStyleClass:{type:"string",group:"Misc",defaultValue:null},enableCustomFilter:{type:"boolean",group:"Misc",defaultValue:true},persistencyKey:{type:"string",group:"Misc",defaultValue:null},useOnlyOneSolidToolbar:{type:"boolean",group:"Misc",defaultValue:false},currentVariantId:{type:"string",group:"Misc",defaultValue:null},editable:{type:"boolean",group:"Misc",defaultValue:false},enableAutoBinding:{type:"boolean",group:"Misc",defaultValue:false},tableBindingPath:{type:"string",group:"Misc",defaultValue:null},editTogglable:{type:"boolean",group:"Misc",defaultValue:false},demandPopin:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{customToolbar:{type:"sap.m.Toolbar",multiple:false},semanticObjectController:{type:"sap.ui.comp.navpopover.SemanticObjectController",multiple:false},noData:{type:"sap.ui.core.Control",altTypes:["string"],multiple:false}},events:{initialise:{},beforeRebindTable:{},editToggled:{},dataReceived:{},afterVariantInitialise:{},afterVariantSave:{},afterVariantApply:{},showOverlay:{},fieldChange:{}}},renderer:V.render});p.prototype.init=function(){sap.m.FlexBox.prototype.init.call(this);this.addStyleClass("sapUiCompSmartTable");this.setFitContainer(true);this.setHeight("100%");};p.prototype._createVariantManagementControl=function(){if(this._oVariantManagement||(!this.getUseVariantManagement()&&!this.getUseTablePersonalisation())||!this.getPersistencyKey()){return;}var e=new sap.ui.comp.smartvariants.PersonalizableInfo({type:"table",keyName:"persistencyKey",dataSource:"TODO"});e.setControl(this);this._oVariantManagement=new sap.ui.comp.smartvariants.SmartVariantManagement(this.getId()+"-variant",{personalizableControls:e,initialise:function(E){if(!this._oCurrentVariant){this._oCurrentVariant="STANDARD";}this.fireAfterVariantInitialise();}.bind(this),afterSave:function(){this.fireAfterVariantSave({currentVariantId:this.getCurrentVariantId()});}.bind(this),showShare:true});this._oVariantManagement.initialise();};p.prototype.setUseExportToExcel=function(u){if(u===this.getUseExportToExcel()){return;}this.setProperty("useExportToExcel",u,true);if(this._oToolbar){this._createToolbarContent();}};p.prototype.setUseTablePersonalisation=function(u){this.setProperty("useTablePersonalisation",u,true);};p.prototype.setUseVariantManagement=function(u){this.setProperty("useVariantManagement",u,true);if(this._oPersController){this._oPersController.setResetToInitialTableState(!u);}};p.prototype.setToolbarStyleClass=function(s){this.setProperty("toolbarStyleClass",s,true);};p.prototype.setCustomToolbar=function(e){if(this._oCustomToolbar){this.removeItem(this._oCustomToolbar);}this._oCustomToolbar=e;};p.prototype.getCustomToolbar=function(){return this._oCustomToolbar;};p.prototype.setHeader=function(t){this.setProperty("header",t,true);this._refreshHeaderText();};p.prototype.setShowRowCount=function(s){this.setProperty("showRowCount",s,true);this._refreshHeaderText();};p.prototype.setEditTogglable=function(t){this.setProperty("editTogglable",t,true);};p.prototype.setEditable=function(e){this.setProperty("editable",e,true);};p.prototype.setDemandPopin=function(D){var e=this.getDemandPopin();if(e===D){return;}this.setProperty("demandPopin",D,true);if(this.bIsInitialised){if(D){this._updateColumnsPopinFeature();}else{this._deactivateColumnsPopinFeature();}}};p.prototype._refreshHeaderText=function(){if(!this._headerText){return;}var t=this.getHeader();if(this.getShowRowCount()){var r=parseInt(this._getRowCount(),10);q.sap.require("sap.ui.core.format.NumberFormat");var v=sap.ui.core.format.NumberFormat.getFloatInstance().format(r);t+=" ("+v+")";}this._headerText.setText(t);};p.prototype._createToolbar=function(){var e=null;if(!this._oToolbar){e=this.getCustomToolbar();if(e){this._oToolbar=e;}else{this._oToolbar=new O({design:sap.m.ToolbarDesign.Transparent});this._oToolbar.addStyleClass("sapUiCompSmartTableToolbar");if(this.getToolbarStyleClass()){this._oToolbar.addStyleClass(this.getToolbarStyleClass());}}this._oToolbar.setLayoutData(new sap.m.FlexItemData({shrinkFactor:0}));this.insertItem(this._oToolbar,0);}};p.prototype._createToolbarContent=function(){if(!this._oToolbar){this._createToolbar();}this._addVariantManagementToToolbar();this._addSeparatorToToolbar();this._addHeaderToToolbar();this._addSpacerToToolbar();this._addEditTogglableToToolbar();this._addTablePersonalisationToToolbar();this._addExportToExcelToToolbar();if(this._oToolbar&&(this._oToolbar.getContent().length===0||(this._oToolbar.getContent().length===1&&this._oToolbar.getContent()[0]instanceof sap.m.ToolbarSpacer))){this.removeItem(this._oToolbar);this._oToolbar.destroy();this._oToolbar=null;}};p.prototype._addEditTogglableToToolbar=function(){var B;if(this.getEditTogglable()){if(!this._oEditButton){B=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("TABLE_EDITTOGGLE_TOOLTIP");this._oEditButton=new sap.m.OverflowToolbarButton(this.getId()+"-btnEditToggle",{icon:this.getEditable()?"sap-icon://display":"sap-icon://edit",text:B,tooltip:B,press:function(){var e=this.getEditable();e=!e;this.setEditable(e,true);this._oEditButton.setIcon(e?"sap-icon://display":"sap-icon://edit");this.fireEditToggled({editable:e});}.bind(this)});}this._oToolbar.addContent(this._oEditButton);}else if(this._oEditButton){this._oToolbar.removeContent(this._oEditButton);}};p.prototype._addHeaderToToolbar=function(){if(this.getHeader()){if(!this._headerText){this._headerText=new a(this.getId()+"-header");this._headerText.addStyleClass("sapMH4Style");this._headerText.addStyleClass("sapUiCompSmartTableHeader");}this._refreshHeaderText();this._oToolbar.insertContent(this._headerText,0);}else if(this._headerText){this._oToolbar.removeContent(this._headerText);}};p.prototype._addSeparatorToToolbar=function(){if(this.getHeader()&&this.getUseVariantManagement()){if(!this._oSeparator){this._oSeparator=new c(this.getId()+"-toolbarSeperator");}this._oToolbar.insertContent(this._oSeparator,0);if(!this._oToolbar.getHeight()){this._oToolbar.addStyleClass("sapUiCompSmartTableToolbarHeight");}}else if(this._oSeparator){this._oToolbar.removeContent(this._oSeparator);}};p.prototype._addVariantManagementToToolbar=function(){if(this.getUseVariantManagement()){this._oToolbar.insertContent(this._oVariantManagement,0);}else if(this._oVariantManagement){this._oToolbar.removeContent(this._oVariantManagement);}};p.prototype._addSpacerToToolbar=function(){var e=false,I=this._oToolbar.getContent(),i,r;if(I){r=I.length;i=0;for(i;i<r;i++){if(I[i]instanceof sap.m.ToolbarSpacer){e=true;break;}}}if(!e){this._oToolbar.addContent(new sap.m.ToolbarSpacer(this.getId()+"-toolbarSpacer"));}};p.prototype._addTablePersonalisationToToolbar=function(){var B;if(this.getUseTablePersonalisation()){if(!this._oTablePersonalisationButton){B=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("TABLE_PERSOBTN_TOOLTIP");this._oTablePersonalisationButton=new sap.m.OverflowToolbarButton(this.getId()+"-btnPersonalisation",{icon:"sap-icon://action-settings",text:B,tooltip:B,press:function(e){this._oPersController.openDialog();}.bind(this)});}this._oToolbar.addContent(this._oTablePersonalisationButton);}else if(this._oTablePersonalisationButton){this._oToolbar.removeContent(this._oTablePersonalisationButton);}};p.prototype._addExportToExcelToToolbar=function(){if(this.getUseExportToExcel()&&this._bTableSupportsExcelExport){var t=this,B;if(!this._oUseExportToExcel){B=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("TABLE_EXPORT_TEXT");this._oUseExportToExcel=new sap.m.OverflowToolbarButton(this.getId()+"-btnExcelExport",{icon:"sap-icon://excel-attachment",text:B,tooltip:B,press:function(e){var D=function(){var i=t._getRowBinding();var u=i.getDownloadUrl("xlsx");u=t._removeExpandParameter(u);window.open(u);};var r=t._getRowCount();if(r>10000){M.confirm(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("DOWNLOAD_CONFIRMATION_TEXT",r),{actions:[M.Action.YES,M.Action.NO],onClose:function(i){if(i===M.Action.YES){D();}}});}else{D();}}});this._setExcelExportEnableState();}this._oToolbar.addContent(this._oUseExportToExcel);}else if(this._oUseExportToExcel){this._oToolbar.removeContent(this._oUseExportToExcel);}};p.prototype._adjustUrlToVisibleColumns=function(u){var v=this._getVisibleColumnPaths();var s=u.replace(new RegExp("([\\?&]\\$select=)[^&]+"),function(r,e){if(v&&v.length){return e+q.sap.encodeURL(v.join(","));}else{return"";}});return s;};p.prototype._removeExpandParameter=function(u){var s=u.replace(new RegExp("([\\?&]\\$expand=[^&]+)(&?)"),function(r,e,i){return i?e.substring(0,1):"";});return s;};p.prototype._getRowCount=function(){var r=this._getRowBinding();if(!r){return 0;}var i=0;if(r.getTotalSize){i=r.getTotalSize();}else{i=r.getLength();}if(i<0||i==="0"){i=0;}return i;};p.prototype._setExcelExportEnableState=function(){if(this._oUseExportToExcel){var r=this._getRowCount();if(r>0){this._oUseExportToExcel.setEnabled(true);}else{var e;if(this._isMobileTable){e=this._oTable.getItems();}else{e=this._oTable.getRows();}var E=e!=null&&e.length>0&&e[0].getBindingContext()!=null;this._oUseExportToExcel.setEnabled(E);}}};p.prototype._createPersonalizationController=function(){if(this._oPersController||!this.getUseTablePersonalisation()){return;}var s=this.data("p13nDialogSettings");if(typeof s==="string"){try{s=JSON.parse(s);}catch(e){s=null;}}s=this._setIgnoreFromPersonalisationToSettings(s);q.sap.require("sap.ui.comp.personalization.Controller");this._oPersController=new sap.ui.comp.personalization.Controller({table:this._oTable,setting:s,resetToInitialTableState:!this.getUseVariantManagement(),beforePotentialTableChange:this._beforePersonalisationModelDataChange.bind(this),afterPotentialTableChange:this._afterPersonalisationModelDataChange.bind(this),afterP13nModelDataChange:this._personalisationModelDataChange.bind(this)});};p.prototype._setIgnoreFromPersonalisationToSettings=function(s){var i=P.createArrayFromString(this.getIgnoreFromPersonalisation());if(i.length){if(!s){s={};}var e=function(r){if(!s[r]){s[r]={};}s[r].ignoreColumnKeys=i;};e("filter");e("sort");e("group");e("columns");}return s;};p.prototype._getRowBinding=function(){if(this._oTable){return this._oTable.getBinding(this._sAggregation);}};p.prototype.setEntitySet=function(e){this.setProperty("entitySet",e);this._initialiseMetadata();};p.prototype.propagateProperties=function(){d.prototype.propagateProperties.apply(this,arguments);this._initialiseMetadata();};p.prototype._initialiseMetadata=function(){if(!this.bIsInitialised){o.handleModelInit(this,this._onMetadataInitialised);}};p.prototype._onMetadataInitialised=function(){this._bMetaModelLoadAttached=false;if(!this.bIsInitialised){this._createTableProvider();if(this._oTableProvider){this._aTableViewMetadata=this._oTableProvider.getTableViewMetadata();if(this._aTableViewMetadata){if(!this._isMobileTable&&this.getDemandPopin()){this.setDemandPopin(false);q.sap.log.error("use SmartTable property 'demandPopin' only  with responsive table, property has been set to false");}this.bIsInitialised=true;this._bTableSupportsExcelExport=this._oTableProvider.getSupportsExcelExport();this._listenToSmartFilter();this._createVariantManagementControl();this._createToolbarContent();this._createContent();this._createPersonalizationController();this._oEditModel=new J({editable:this.getEditable()});this.bindProperty("editable",{path:"sm4rtM0d3l>/editable"});this.setModel(this._oEditModel,"sm4rtM0d3l");this.fireInitialise();if(this.getEnableAutoBinding()){if(this._oSmartFilter&&this._oSmartFilter.isPending()){this._oSmartFilter.search();}else{this._reBindTable();}}}}}};p.prototype._createTableProvider=function(){var e,E,i;E=this.getEntitySet();i=this.getIgnoredFields();e=this.getModel();if(e&&!this._bTableCreated){this._aExistingColumns=[];this._aAlwaysSelect=[];this._oTemplate=null;this._createToolbar();this._createTable();this._bTableCreated=true;}if(e&&E){if(this._aExistingColumns.length){if(i){i+=","+this._aExistingColumns.toString();}else{i=this._aExistingColumns.toString();}}this._oTableProvider=new sap.ui.comp.providers.TableProvider({entitySet:E,ignoredFields:i,initiallyVisibleFields:this.getInitiallyVisibleFields(),isEditableTable:this.getEditable(),isAnalyticalTable:this._isAnalyticalTable,dateFormatSettings:this.data("dateFormatSettings"),currencyFormatSettings:this.data("currencyFormatSettings"),defaultDropDownDisplayBehaviour:this.data("defaultDropDownDisplayBehaviour"),useSmartField:this.data("useSmartField"),enableInResultForLineItem:this.data("enableInResultForLineItem"),model:e});}};p.prototype._listenToSmartFilter=function(){var s=null;s=this.getSmartFilterId();this._oSmartFilter=this._findControl(s);if(this._oSmartFilter){this._oSmartFilter.attachSearch(this._reBindTable,this);this._oSmartFilter.attachFilterChange(this._showOverlay,this,true);this._oSmartFilter.attachCancel(this._showOverlay,this,false);this._setNoDataText(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_DATA"));}};p.prototype._showOverlay=function(s){if(s){var e={show:true};this.fireShowOverlay({overlay:e});s=e.show;}this._oTable.setShowOverlay(s);};p.prototype._findControl=function(i){var r,v;if(i){r=sap.ui.getCore().byId(i);if(!r){v=this._getView();if(v){r=v.byId(i);}}}return r;};p.prototype._getView=function(){if(!this._oView){var e=this.getParent();while(e){if(e instanceof sap.ui.core.mvc.View){this._oView=e;break;}e=e.getParent();}}return this._oView;};p.prototype.rebindTable=function(e){this._reBindTable(null,e);};p.prototype._reBindTable=function(e,r){var t,s,u,i,v,w,x=[],y,E,z,B,D,G,H={},I={preventTableBind:false};u=this._getTablePersonalisationData()||{};y=u.filters;E=u.excludeFilters;G=u.sorters;if(this._oSmartFilter){w=this._oSmartFilter.getFilters();H=this._oSmartFilter.getParameters()||{};}if(w&&w.length){if(E){x=[new sap.ui.model.Filter([w[0],E],true)];}else{x=w;}}else if(E){x=[E];}if(y){y=x.concat(y);}else{y=x;}z=this.getRequestAtLeastFields();if(z){B=z.split(",");}else{B=[];}B=B.concat(this._aAlwaysSelect);D=this._getVisibleColumnPaths();if(!D||!D.length){D=B;}else{v=B.length;for(i=0;i<v;i++){if(D.indexOf(B[i])<0){D.push(B[i]);}}}if(this._sSelectForGroup&&D.indexOf(this._sSelectForGroup)<0){D.push(this._sSelectForGroup);}if(D.length){H["select"]=D.toString();}H["useBatchRequests"]=true;if(!G){G=[];}I.filters=y;I.sorter=G;I.parameters=H;I.length=undefined;I.startIndex=undefined;this.fireBeforeRebindTable({bindingParams:I});if(!I.preventTableBind){G=I.sorter;y=I.filters;H=I.parameters;D=I.parameters["select"];if(!D||!D.length){M.error(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_COLS"),{styleClass:(this.$()&&this.$().closest(".sapUiSizeCompact").length)?"sapUiSizeCompact":""});return;}s=this.getTableBindingPath()||("/"+this.getEntitySet());this._oTable.setEnableBusyIndicator(false);this._oTable.setBusy(true);if(this._oTable._setSuppressRefresh){this._oTable._setSuppressRefresh(false);}this._bDataLoadPending=true;t=this._oTable.getBinding(this._sAggregation);if(t&&t.mParameters&&!r){r=!(q.sap.equal(H,t.mParameters,true)&&q.sap.equal(H.custom,t.mParameters.custom)&&!I.length&&!I.startIndex&&s===t.getPath());}if(!t||!this._bIsTableBound||r){this._oTable.bindRows({path:s,filters:y,sorter:G,parameters:H,length:I.length,startIndex:I.startIndex,template:this._oTemplate,events:{dataRequested:function(){this._bIgnoreChange=true;}.bind(this),dataReceived:function(e){if(e&&e.getParameter&&!e.getParameter("data")){return;}this._bIgnoreChange=false;this._onDataLoadComplete(e,true);this.fireDataReceived(e);}.bind(this),change:function(e){if(this._bIgnoreChange){return;}var K,N=false;K=(e&&e.getParameter)?e.getParameter("reason"):undefined;if(!K||K==="filter"){N=true;}if(K==="change"||N){this._onDataLoadComplete(e,N);}}.bind(this)}});this._bIsTableBound=true;}else{if(Object.keys(y).length===0){y=[];}t.sort(G);t.filter(y,"Application");}this._showOverlay(false);}};p.prototype._onDataLoadComplete=function(e,i){if(this._bDataLoadPending||i){if(this._bDataLoadPending){this._oTable.setBusy(false);this._oTable.setEnableBusyIndicator(true);}this._bDataLoadPending=false;if(!this._bNoDataUpdated&&!this._getRowCount()){this._bNoDataUpdated=true;this._setNoDataText();}this.updateTableHeaderState();this._disableSumRows();}};p.prototype.setNoData=function(N){this._oNoData=N;};p.prototype.getNoData=function(){return this._oNoData;};p.prototype._setNoDataText=function(s){var e=this._oTable.setNoData;if(!e){e=this._oTable.setNoDataText;}if(!e){return;}var N=s;if(!N){N=this.getNoData();}if(!N){N=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_RESULTS");}e.call(this._oTable,N,true);};p.prototype.updateTableHeaderState=function(){this._refreshHeaderText();this._setExcelExportEnableState();};p.prototype._createContent=function(){var i,e=0,r,s,I,t;t=this._parseIndexedColumns();e=this._aTableViewMetadata.length;for(i=0;i<e;i++){r=this._aTableViewMetadata[i];if(r.inResult){this._aAlwaysSelect.push(r.name);}this._registerContentTemplateEvents(r.template);I=this.getId()+"-"+r.name.replace(/[^A-Za-z0-9_.:-]+/g,"_");s=this._createColumn(r,I);s.data("p13nData",{columnKey:r.name,leadingProperty:r.name,additionalProperty:r.additionalProperty,sortProperty:r.sortable?r.name:undefined,filterProperty:r.filterable?r.name:undefined,type:r.filterType,maxLength:r.maxLength,precision:r.precision,scale:r.scale,aggregationRole:r.aggregationRole});if(r.filterable&&s.setFilterProperty){s.setFilterProperty(r.name);}if(r.sortable&&s.setSortProperty){s.setSortProperty(r.name);}this._oTable.addColumn(s);}this._insertIndexedColumns(t);this._updateColumnsPopinFeature();this._storeInitialColumnSettings();};p.prototype._parseIndexedColumns=function(){var i,e,r,I,s,t,u,v;var w=this._oTable.getColumns();var x=null;if(this._oTemplate&&this._oTemplate.getCells){x=this._oTemplate.getCells();}if(!w){return null;}I=[];e=w.length;for(i=0;i<e;i++){r=w[i];s=r.data("p13nData");t=null;if(s){t=s.columnIndex;}u=-1;if(t!==null&&t!==undefined){u=parseInt(t,10);}if(!isNaN(u)&&u>-1){if(x){v=x[i];this._oTemplate.removeCell(v);}else{v=null;}I.push({index:u,column:r,template:v});this._oTable.removeColumn(r);}}I.sort(function(y,z){return y.index-z.index;});return I;};p.prototype._insertIndexedColumns=function(I){var i,e,r;if(!I){return;}e=I.length;for(i=0;i<e;i++){r=I[i];this._oTable.insertColumn(r.column,r.index);if(r.column.setInitialOrder){r.column.setInitialOrder(r.index);}if(r.template){this._oTemplate.insertCell(r.template,r.index);}}};p.prototype._updateColumnsPopinFeature=function(){if(!this._isMobileTable||!this.getDemandPopin()){return;}var e=this._oTable.getColumns();if(!e){return;}e=e.filter(function(t){return t.getVisible();});e.sort(function(t,u){return t.getOrder()-u.getOrder();});var r,s=e.length;for(var i=0;i<s;i++){r=e[i];if(i<2){r.setDemandPopin(false);r.setMinScreenWidth("1px");}else{r.setDemandPopin(true);r.setPopinDisplay(sap.m.PopinDisplay.Inline);r.setMinScreenWidth((i+1)*10+"rem");}}};p.prototype._storeInitialColumnSettings=function(){this._aInitialSorters=[];P.createSort2Json(this._oTable,this._aInitialSorters,P.createArrayFromString(this.getIgnoreFromPersonalisation()));};p.prototype._deactivateColumnsPopinFeature=function(){if(!this._isMobileTable){return;}var e=this._oTable.getColumns();if(!e){return;}var r,s=e.length;for(var i=0;i<s;i++){r=e[i];r.setDemandPopin(false);r.setMinScreenWidth("1px");}};p.prototype._registerContentTemplateEvents=function(t){if(t instanceof sap.ui.comp.navpopover.SmartLink){var s=this.getSemanticObjectController();t.setSemanticObjectController(s);}if(t&&t.attachChange){t.attachChange(function(e){this.fireFieldChange({changeEvent:e});}.bind(this));}};p.prototype._updateInitialColumns=function(){var i=this._oTable.getColumns(),r=i?i.length:0,s,t,u;while(r--){u=null;s=i[r];if(s){t=s.data("p13nData");if(typeof t==="string"){try{t=JSON.parse(t);}catch(e){}if(t){s.data("p13nData",t);}}if(t){u=t["columnKey"];}if(u){this._aExistingColumns.push(u);}}}};p.prototype._getVisibleColumnPaths=function(){var s=[],e=this._oTable.getColumns(),i,r=e?e.length:0,t,u,v,w;for(i=0;i<r;i++){t=e[i];v=null;if(t.getVisible()){if(t.getLeadingProperty){v=t.getLeadingProperty();}u=t.data("p13nData");if(u){if(!v){v=u["leadingProperty"];}w=u["additionalProperty"];}if(v&&s.indexOf(v)<0){s.push(v);}if(w&&s.indexOf(w)<0){s.push(w);}}}return s;};p.prototype._createTable=function(){var e=this.getItems(),i=e?e.length:0,t;this._sAggregation="rows";while(i--){t=e[i];if(t instanceof k||t instanceof R){break;}t=null;}if(t){this._oTable=t;if(t instanceof h){this._isAnalyticalTable=true;}else if(t instanceof R){this._isMobileTable=true;this._oTemplate=(t.getItems()&&t.getItems().length>0)?t.getItems()[0]:new sap.m.ColumnListItem();t.removeAllItems();}else if(t instanceof m){this._isTreeTable=true;}this._updateInitialColumns();}else{if(this.getTableType()==="AnalyticalTable"){this._isAnalyticalTable=true;this._oTable=new h({enableCustomFilter:true});}else if(this.getTableType()==="ResponsiveTable"){this._isMobileTable=true;this._oTable=new R({growing:true});this._oTemplate=new sap.m.ColumnListItem();}else if(this.getTableType()==="TreeTable"){this._isTreeTable=true;this._oTable=new m({selectionMode:sap.ui.table.SelectionMode.MultiToggle});}else{this._oTable=new k({selectionMode:sap.ui.table.SelectionMode.MultiToggle});}if(this._oTable.setVisibleRowCountMode){this._oTable.setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);}this.insertItem(this._oTable,2);}if(!this._oTable.getLayoutData()){if(this._oTable instanceof sap.m.Table||(this._oTable.getVisibleRowCountMode&&this._oTable.getVisibleRowCountMode()!==sap.ui.table.VisibleRowCountMode.Auto)){this._oTable.setLayoutData(new sap.m.FlexItemData({growFactor:1,baseSize:"auto"}));}else{this._oTable.setLayoutData(new sap.m.FlexItemData({growFactor:1,baseSize:"0%"}));}}if(this._oTable.addAriaLabelledBy){this._oTable.addAriaLabelledBy(this.getId()+"-header");}this._oTable.addStyleClass("sapUiCompSmartTableInnerTable");this._oTable.setEnableBusyIndicator(true);this._oTable.setBusyIndicatorDelay(100);if(this._oTable.setEnableCustomFilter){this._oTable.setEnableCustomFilter(this.getEnableCustomFilter());}if(this._oTable.setShowColumnVisibilityMenu){this._oTable.setShowColumnVisibilityMenu(false);}if(this._oTable.getEnableCustomFilter&&this._oTable.getEnableCustomFilter()){if(this._oTable.setEnableCellFilter){this._oTable.setEnableCellFilter(false);}if(this._oTable.attachCustomFilter){this._oTable.attachCustomFilter(this._showTableFilterDialog.bind(this));}}if(this._isAnalyticalTable){this._createColumn=this._createAnalyticalColumn;}else if(this._isMobileTable){this._sAggregation="items";this._createColumn=this._createMobileColumn;this._oTable.bindRows=this._oTable.bindItems;}if(!this._isMobileTable){this._oTable.attachEvent("_rowsUpdated",function(){this._setExcelExportEnableState();},this);}if(this._oTable._setLargeDataScrolling){this._oTable._setLargeDataScrolling(true);}};p.prototype.getTable=function(){return this._oTable;};p.prototype._showTableFilterDialog=function(e){if(this._oPersController){this._oPersController.openDialog({filter:{visible:true,payload:{column:e.getParameter("column")}}});}};p.prototype._disableSumRows=function(){if(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version<11){q.sap.delayedCall(60,this,function(){if(this.getEditable()){this._oTable.$().find(".sapUiAnalyticalTableSum input").prop("disabled",true);this._oTable.$().find(".sapUiTableGroupHeader input").prop("disabled",true);}});}};p.prototype._createColumn=function(e,i){var r;r=new j(i,{autoResizable:true,hAlign:e.align,width:e.width,visible:e.isInitiallyVisible,label:new L(i+"-header",{textAlign:e.align,text:e.label,textDirection:e.textDirection}),sorted:e.sorted,sortOrder:e.sortOrder,tooltip:e.quickInfo,showSortMenuEntry:e.sortable,showFilterMenuEntry:e.filterable,name:e.fieldName,template:e.template});return r;};p.prototype._createAnalyticalColumn=function(e,i){var r;if(e.isCurrencyField&&e.template.addStyleClass){e.template.addStyleClass("sapUiUfdCurrency");}r=new A(i,{autoResizable:true,hAlign:e.align,width:e.width,visible:e.isInitiallyVisible,inResult:e.inResult,label:new L(i+"-header",{textAlign:e.align,text:e.label,textDirection:e.textDirection}),tooltip:e.quickInfo,sorted:e.sorted,sortOrder:e.sortOrder,showSortMenuEntry:e.sortable,showFilterMenuEntry:e.filterable,summed:e.summed,leadingProperty:e.name,template:e.template});return r;};p.prototype._createMobileColumn=function(e,i){var r;r=(new C(i,{hAlign:e.align,visible:e.isInitiallyVisible,header:new T(i+"-header",{text:e.label}),tooltip:e.quickInfo}));if(e.template&&e.template.setWrapping){e.template.setWrapping(true);}if(this._oTemplate){this._oTemplate.addCell(e.template);}return r;};p.prototype.fetchVariant=function(){if(this._oCurrentVariant==="STANDARD"||this._oCurrentVariant===null){return{};}return this._oCurrentVariant;};p.prototype.applyVariant=function(v,s){this._oCurrentVariant=v;if(this._oCurrentVariant==="STANDARD"){this._oCurrentVariant=null;}P.recoverPersonalisationData(this._oCurrentVariant,this._oTable);if(s==="STANDARD"){this._oApplicationDefaultVariant=this._oCurrentVariant;}if(this._oApplicationDefaultVariant&&!s){this._oCurrentVariant=q.extend(true,{},this._oApplicationDefaultVariant,v);}this._bApplyingVariant=true;if(this._oTable._setSuppressRefresh){this._oTable._setSuppressRefresh(true);}if(this._oPersController){if(this._oCurrentVariant===null||q.isEmptyObject(this._oCurrentVariant)){this._oPersController.resetPersonalization(sap.ui.comp.personalization.ResetType.ResetFull);}else{this._oPersController.setPersonalizationData(this._oCurrentVariant);}}if(this._bIsTableBound||!this._oSmartFilter){this._reBindTable(null,true);}else{this._showOverlay(true);}this._bApplyingVariant=false;this.fireAfterVariantApply({currentVariantId:this.getCurrentVariantId()});};p.prototype._beforePersonalisationModelDataChange=function(e){this._oTable.setEnableBusyIndicator(false);this._oTable.setBusy(true);if(this._oTable._setSuppressRefresh){this._oTable._setSuppressRefresh(true);}};p.prototype._afterPersonalisationModelDataChange=function(e){this._updateColumnsPopinFeature();this._oTable.setBusy(false);this._oTable.setEnableBusyIndicator(true);};p.prototype._personalisationModelDataChange=function(e){this._oCurrentVariant=e.getParameter("persistentData");if(this._bApplyingVariant){return;}var i=e.getParameter("changeType");var r=this._getChangeStatus(i);if(r===sap.ui.comp.personalization.ChangeType.Unchanged){return;}if(!this.getUseVariantManagement()){this._persistPersonalisation();}else if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(true);}if(r===sap.ui.comp.personalization.ChangeType.ModelChanged){if(this._bIsTableBound||!this._oSmartFilter){this._reBindTable(null,i.columns===sap.ui.comp.personalization.ChangeType.ModelChanged);}else{this._showOverlay(true);}}};p.prototype._getChangeStatus=function(e){if(!e){return sap.ui.comp.personalization.ChangeType.ModelChanged;}if(e.sort===sap.ui.comp.personalization.ChangeType.ModelChanged||e.filter===sap.ui.comp.personalization.ChangeType.ModelChanged||e.columns===sap.ui.comp.personalization.ChangeType.ModelChanged||e.group===sap.ui.comp.personalization.ChangeType.ModelChanged){return sap.ui.comp.personalization.ChangeType.ModelChanged;}if(e.sort===sap.ui.comp.personalization.ChangeType.TableChanged||e.filter===sap.ui.comp.personalization.ChangeType.TableChanged||e.columns===sap.ui.comp.personalization.ChangeType.TableChanged||e.group===sap.ui.comp.personalization.ChangeType.TableChanged){return sap.ui.comp.personalization.ChangeType.TableChanged;}return sap.ui.comp.personalization.ChangeType.Unchanged;};p.prototype._getTablePersonalisationData=function(){if(!this._oCurrentVariant){return null;}var s=[],e=[],E=[],i,G,r,t,u,v,w,x,y="",I;this._sSelectForGroup=null;if(this._isMobileTable&&this._oCurrentVariant.group&&this._oCurrentVariant.group.groupItems){G=this._oCurrentVariant.group.groupItems[0];u=this._getColumnByKey(G.columnKey);if(u){y=u.getHeader().getText();}x=this._getPathFromColumnKeyAndProperty(G.columnKey,"sortProperty");w=x;r=new sap.ui.model.Sorter(w,G.operation==="GroupDescending",function(z){var K=z.getProperty(w);return{key:K,text:y?y+" : "+K:K};});this._sSelectForGroup=w;s.push(r);}if(this._oCurrentVariant.sort){t=this._oCurrentVariant.sort.sortItems;}else{t=this._aInitialSorters;}if(t){t.forEach(function(z){var D=z.operation==="Descending";x=this._getPathFromColumnKeyAndProperty(z.columnKey,"sortProperty");if(r&&r.sPath===x){r.bDescending=D;}else{s.push(new sap.ui.model.Sorter(x,D));}},this);}if(this._oCurrentVariant.filter){this._oCurrentVariant.filter.filterItems.forEach(function(z){var B=z.value1,D=z.value2;x=null;I=false;u=this._getColumnByKey(z.columnKey);if(u){if(u.getFilterProperty){x=u.getFilterProperty();}v=u.data("p13nData");if(v){I=v.type==="time";if(!x){x=v["filterProperty"];}}}if(I){if(B instanceof Date){B=n.getEdmTimeFromDate(B);}if(D instanceof Date){D=n.getEdmTimeFromDate(D);}}else if(B instanceof Date&&this._oTableProvider&&this._oTableProvider.getIsUTCDateHandlingEnabled()){B=F.getDateInUTCOffset(B);D=D?F.getDateInUTCOffset(D):D;}if(z.exclude){E.push(new sap.ui.model.Filter(x,g.NE,B));}else{e.push(new sap.ui.model.Filter(x,z.operation,B,D));}},this);if(E.length){i=new sap.ui.model.Filter(E,true);}}return{filters:e,excludeFilters:i,sorters:s};};p.prototype._getColumnByKey=function(s){var e,r,t,i,u;if(this._oTable){e=this._oTable.getColumns();t=e.length;for(i=0;i<t;i++){r=e[i];u=r.data("p13nData");if(u&&u.columnKey===s){return r;}}}return null;};p.prototype._getPathFromColumnKeyAndProperty=function(s,e){var i=null,r,t;r=this._getColumnByKey(s);if(r){if(e=="sortProperty"&&r.getSortProperty){i=r.getSortProperty();}else if(e=="filterProperty"&&r.getFilterProperty){i=r.getFilterProperty();}else if(e=="leadingProperty"&&r.getLeadingProperty){i=r.getLeadingProperty();}if(!i){t=r.data("p13nData");if(t){i=t[e];}}}return i;};p.prototype._persistPersonalisation=function(){var t=this;if(this._oVariantManagement){this._oVariantManagement.getVariantsInfo(function(v){var s=null;if(v&&v.length>0){s=v[0].key;}var e=s!==null;var i={name:"Personalisation",global:false,overwrite:e,key:s,def:true};t._oVariantManagement.fireSave(i);});}};p.prototype.getCurrentVariantId=function(){var K="";if(this._oVariantManagement){K=this._oVariantManagement.getCurrentVariantId();}return K;};p.prototype.setCurrentVariantId=function(v){if(this._oVariantManagement){this._oVariantManagement.setCurrentVariantId(v);}else{q.sap.log.error("sap.ui.comp.smarttable.SmartTable.prototype.setCurrentVariantId: VariantManagement does not exist");}};p.prototype.exit=function(){if(this._oSmartFilter){this._oSmartFilter.detachSearch(this._reBindTable,this);this._oSmartFilter.detachFilterChange(this._showOverlay,this);this._oSmartFilter.detachCancel(this._showOverlay,this);this._oSmartFilter=null;}if(this._oTableProvider&&this._oTableProvider.destroy){this._oTableProvider.destroy();}this._oTableProvider=null;if(this._oPersController&&this._oPersController.destroy){this._oPersController.destroy();}this._oPersController=null;if(this._oVariantManagement&&this._oVariantManagement.destroy){this._oVariantManagement.destroy();}if(this._oEditModel){this._oEditModel.destroy();}if(this._oNoData&&this._oNoData.destroy){this._oNoData.destroy();}this.oNoData=null;this._oEditModel=null;this._oVariantManagement=null;this._oCurrentVariant=null;this._oApplicationDefaultVariant=null;this._aTableViewMetadata=null;this._aExistingColumns=null;this._aAlwaysSelect=null;this._oCustomToolbar=null;this._oToolbar=null;if(this._oUseExportToExcel&&!this.getUseExportToExcel()){this._oUseExportToExcel.destroy();}this._oUseExportToExcel=null;this._oTablePersonalisationButton=null;if(!this._bIsTableBound&&this._oTemplate){this._oTemplate.destroy();}this._oTemplate=null;this._oView=null;this._oTable=null;};return p;},true);