/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/m/TextArea","sap/m/Link","sap/m/CheckBox","sap/m/ComboBox","sap/m/DatePicker","sap/m/FlexItemData","sap/m/FlexJustifyContent","sap/m/HBox","sap/m/Input","sap/m/InputType","sap/m/Select","sap/m/Text","sap/ui/core/Renderer","sap/ui/core/TextAlign","sap/ui/comp/navpopover/SmartLink","./ControlFactoryBase","./FieldControl","./ODataControlSelector","./ODataHelper","./ODataTypes","sap/m/ObjectNumber","sap/m/ObjectIdentifier","sap/m/ObjectStatus","sap/ui/core/ValueState","sap/m/TimePicker"],function(q,T,L,C,a,D,F,b,H,I,c,S,d,R,e,f,g,h,O,i,j,k,l,m,V,o){"use strict";var p=g.extend("sap.ui.comp.smartfield.ODataControlFactory",{constructor:function(M,P,n){g.apply(this,[M,P]);this.sName="ODataControlFactory";this._oMetaData={annotations:{}};this._oMeta=n;this._oHelper=new i(M,this._oBinding);this._oFieldControl=new h(P,this._oHelper);this._oTypes=new j(P);this._oSelector=new O(this._oMetaData,P,this._oTypes);this._bInitialized=false;this.bPending=false;}});p.prototype._init=function(M){this._oMetaData.model=M.model;this._oMetaData.path=M.path;this._oMetaData.entitySet=M.entitySetObject||this._oHelper.oMeta.getODataEntitySet(M.entitySet);this._oMetaData.entityType=M.entityType||this._oHelper.oMeta.getODataEntityType(this._oMetaData.entitySet.entityType);this._oMetaData.navigationPath=M.navigationPath||null;if(this._oModel){this._oHelper.checkNavigationProperty(this._oMetaData,this._oParent);this._oHelper.getProperty(this._oMetaData);if(this._oMetaData.property&&this._oMetaData.property.property){this._oMetaData.annotations.text=this._oHelper.getTextProperty2(this._oMetaData);this._oMetaData.annotations.uom=this._oHelper.getUnitOfMeasure2(this._oMetaData);this._oHelper.getValueListData(this._oMetaData);this._oMetaData.annotations.lineitem=this._oHelper.getAnalyzer().getLineItemAnnotation(this._oMetaData.entitySet.entityType);this._oHelper.getUOMValueListAnnotationPath(this._oMetaData);this._oMetaData.annotations.semantic=this._oHelper.getAnalyzer().getSemanticObjectAnnotationFromProperty(this._oMetaData.property.property);if(this._oMetaData.annotations.uom){this._oMetaData.annotations.uom.annotations={};this._oHelper.getValueListData(this._oMetaData.annotations.uom);}this._oHelper.getUOMTextAnnotation(this._oMetaData);}else{q.sap.log.warning("SmartField: Property "+M.path+" does not exist","SmartField: Property "+M.path+" does not exist","sap.ui.comp.smartfield.ODataControlFactory");}}else{this._oMetaData.modelObject=M.modelObject;this._oMetaData.property=M.property;this._oMetaData.annotations.text=M.annotations.text;this._oMetaData.annotations.uom=M.annotations.uom;if(this._oMetaData.annotations.uom&&!this._oMetaData.annotations.uom.annotations){this._oMetaData.annotations.uom.annotations={};}this._oMetaData.annotations.valuelist=M.annotations.valuelist;this._oMetaData.annotations.valuelistType=M.annotations.valuelistType;this._oMetaData.annotations.lineitem=M.annotations.lineitem;this._oMetaData.annotations.semantic=M.annotations.semantic;this._oMetaData.annotations.valuelistuom=M.annotations.valuelistuom;}};p.prototype._createEdmDisplay=function(){var n,r,A,s,M,t,u,v,w=this,N={width:true,textAlign:true};n=this._oParent.data("configdata");var x=((n&&(n.isInnerControl!==true))||(this._oParent.getControlContext()==="table")||(this._oParent.getControlContext()==="responsiveTable"));var y=this._oSelector.checkComboBox(x);if(y&&y.combobox){return this._createComboBox({annotation:y.annotation,noDialog:true,noTypeAhead:true},true);}if(this._checkLink()&&!this._oSelector.useObjectIdentifier()){return this._createLink();}A=this.createAttributes(null,this._oMetaData.property,N);t=this._oSelector.checkDatePicker();if(t){s=this.getFormatSettings("dateFormatSettings");A.text={model:this._oMetaData.model,path:this._oMetaData.path,type:this._oTypes.getType(this._oMetaData.property,s,{displayFormat:"Date"})};}else{A.text={model:this._oMetaData.model,path:this._oHelper.getEdmDisplayPath(this._oMetaData),type:this._oTypes.getType(this._oMetaData.property)};}if(this._oMetaData.property&&this._oMetaData.property.property){M=this._oHelper.oAnnotation.isMasked(this._oMetaData.property.property);if(M){A.text.formatter=function(z){if(z){return z.replace(new RegExp(".","igm"),"*");}return z;};}v=this._oHelper.oAnnotation.getText(this._oMetaData.property.property);if(v){u=this._oSelector.useObjectIdentifier(t,M);if(u){delete A.width;delete A.textAlign;A.text={path:this._oMetaData.path};A.title={path:this._oHelper.getEdmDisplayPath(this._oMetaData)};if(this._oParent.hasListeners("press")){A.titleActive=true;A.titlePress=function(E){w._oParent.firePress(E);};}}else{if(!(n&&(n.isInnerControl===true))){A.text={};A.text.parts=[];A.text.parts.push(this._oMetaData.path);A.text.parts.push(this._oHelper.getEdmDisplayPath(this._oMetaData));A.text.formatter=function(z,B){return w._formatDisplayBehaviour("defaultInputFieldDisplayBehaviour",z,B);};}}}else if(this._oSelector.checkCheckBox()){A.text.formatter=function(z){return w._formatDisplayBehaviour("defaultCheckBoxDisplayBehaviour",z);};}}if(u){r=new l(A);}else{if(A.text.type&&(A.text.type instanceof sap.ui.comp.smartfield.type.DateTime)&&A.text.type.oConstraints&&A.text.type.oConstraints.isDateOnly){A.wrapping=false;}if(this._oParent.isContextTable()&&sap.ui.getCore().getConfiguration().getRTL()){A.textDirection="LTR";}r=new d(A);}if(!u&&n&&n.configdata&&n.configdata.onText){n.configdata.onText(r);}return{control:r,onCreate:"_onCreate",params:{noValidations:true}};};p.prototype._createEdmTime=function(){var A,n,N={placeholder:true,valueState:true,valueStateText:true};A=this.createAttributes("value",this._oMetaData.property,N,{event:"change"});A.valueFormat="HH:mm:ss";n=new o(A);return{control:n,onCreate:"_onCreate",params:{getValue:"getValue",type:{type:A.value.type,property:this._oMetaData.property}}};};p.prototype._createObjectStatus=function(){var A,t,n;A=this.createAttributes(null,this._oMetaData.property,null);t=this._oHelper.oAnnotation.getText(this._oMetaData.property.property);if(t){A.text={parts:[]};A.text.parts.push(this._oHelper.getEdmDisplayPath(this._oMetaData));}else{A.text={model:this._oMetaData.model,path:this._oMetaData.path,type:this._oTypes.getType(this._oMetaData.property)};}this._addObjectStatusAttributes(A);n=new m(A);return{control:n,onCreate:"_onCreate",params:{getValue:"getText",noValidation:true}};};p.prototype._addObjectStatusAttributes=function(A){var n,P,r,s,t;P=this._oParent.getControlProposal();t=P.getObjectStatus();if(t){n=t.getBindingInfo("criticality");}r=function(u){var v,w;w={0:V.None,1:V.Error,2:V.Warning,3:V.Success};v={"com.sap.vocabularies.UI.v1.CriticalityType/Neutral":V.Neutral,"com.sap.vocabularies.UI.v1.CriticalityType/Negative":V.Warning,"com.sap.vocabularies.UI.v1.CriticalityType/Critical":V.Error,"com.sap.vocabularies.UI.v1.CriticalityType/Positive":V.Success};if(u){return v[u]||w[u]||V.None;}return V.None;};s=function(){var u,v={"Error":"sap-icon://status-negative","Warning":"sap-icon://status-critical","Success":"sap-icon://status-positive","None":"sap-icon://status-inactive"};if(n){if(n.formatter){u=n.formatter.apply(null,arguments);}else{u=arguments[0];}}else{u=t.getCriticality();}if(u){return v[r(u)];}return null;};if(n){A.state={formatter:function(){var u;if(n.formatter){u=n.formatter.apply(null,arguments);}else{u=arguments[0];}return r(u);},parts:n.parts};A.icon={formatter:s,parts:n.parts};}else{if(t){A.state=r(t.getCriticality());}A.icon=s();}};p.prototype._createEdmString=function(){var M,n,r,A,s,t,N={width:true,textAlign:true,placeholder:true,name:true,valueState:true,valueStateText:true};if(this._oSelector.checkCheckBox()){return this._createCheckBox();}s=this._oSelector.checkSelection();if(s.selection){return this._createSelect({annotation:s.annotation,noDialog:true,noTypeAhead:true});}s=this._oSelector.checkComboBox();if(s.combobox){return this._createComboBox({annotation:s.annotation,noDialog:true,noTypeAhead:true});}if(this._oMetaData.property&&this._oMetaData.property.property){n=this._oHelper.oAnnotation.isMultiLineText(this._oMetaData.property.property);if(n){delete N["width"];return this._createMultiLineText(N);}}A=this.createAttributes("value",this._oMetaData.property,N);this._addMaxLength(A,s.annotation);t=new I(A);if(this._oMetaData.property&&this._oMetaData.property.property){M=this._oHelper.oAnnotation.isMasked(this._oMetaData.property.property);if(M){t.setType(c.Password);}this._handleEventingForEdmString(t,this._oMetaData.property);}r=this._oParent.data("configdata");if(r&&r.configdata){if(r.configdata.onInput){r.configdata.onInput(t);}}return{control:t,onCreate:"_onCreate",params:{valuehelp:{annotation:s.annotation,noDialog:!this._oParent.getShowValueHelp(),noTypeAhead:!this._oParent.getShowSuggestion(),aggregation:"suggestionRows"},getValue:"getValue",type:{type:A.value.type,property:this._oMetaData.property}}};};p.prototype._addMaxLength=function(A,n){var B,M;B=this._oParent.getBindingInfo("value");M=this._oTypes.getMaxLength(this._oMetaData.property,B);if(M>0){if(!n||!this._oParent.getShowSuggestion()){A.maxLength=M;}}};p.prototype._addAriaLabelledBy=function(n){var r,t;if((this._oParent.getControlContext()===sap.ui.comp.smartfield.ControlContextType.None)||(this._oParent.getControlContext()===sap.ui.comp.smartfield.ControlContextType.Form)||(this._oParent.getControlContext()===sap.ui.comp.smartfield.ControlContextType.SmartFormGrid)){g.prototype._addAriaLabelledBy.apply(this,arguments);if(n){t=n.control;if(t instanceof H){if(t.getItems().length>0){t=t.getItems()[0];}}}if(t.getAriaLabelledBy&&t.getAriaLabelledBy().length===0){if(this._oHelper.oAnnotation.getLabel(this._oMetaData.property.property)){q.sap.require("sap.ui.core.InvisibleText");r=new sap.ui.core.InvisibleText({text:this._oHelper.oAnnotation.getLabel(this._oMetaData.property.property)});t.addAriaLabelledBy(r);this._oParent.addAggregation("_ariaLabelInvisibleText",r);}}}};p.prototype._handleEventingForEdmString=function(n,P){var u,t=this;if(n){u=this._oHelper.oAnnotation.isUpperCase(P.property);n.attachChange(function(E){var N={};if(E&&E.mParameters){var v=E.mParameters.value;if(u&&v){v=v.toUpperCase();n.setValue(v);}N.value=v;N.newValue=v;if(E.mParameters.validated){N.validated=E.mParameters.validated;}if(n._oSuggestionPopup&&n._oSuggestionPopup.isOpen()){if(!E.mParameters.validated){if(n._iPopupListSelectedIndex>=0){return;}}}try{t._oParent.fireChange(N);}catch(r){q.sap.log.warning(r);}}});}};p.prototype._createComboBox=function(v,n){var r=null,s;var A,N={width:true,textAlign:true,placeholder:true,name:true};s=this._oParent.data("configdata");A=this.createAttributes("selectedKey",this._oMetaData.property,N);A.selectionChange=this._oHelper.getSelectionChangeHandler(this._oParent);if(A.width===""){A.width="100%";}if(n){r=this._createDisplayedComboBox(A);}else{r=new a(A);}if(s&&s.configdata&&s.configdata.onText){s.configdata.onText(r);}return{control:r,onCreate:"_onCreate",params:{valuehelp:{annotation:v.annotation,aggregation:"items",noDialog:v.noDialog,noTypeAhead:v.noTypeAhead},getValue:"getSelectedKey",type:{type:A.selectedKey.type,property:this._oMetaData.property}}};};p.prototype._createDisplayedComboBox=function(A){var n=a.extend("sap.ui.comp.smartfield.DisplayComboBox",{metadata:{library:"sap.ui.comp"},renderer:function(r,s){var w=s.getWidth(),t=s.getValue(),u=s.getTextDirection(),v=s.getTextAlign();t.replace(/\r\n/g,"\n");r.write("<span");r.writeControlData(s);r.addClass("sapMText");r.addClass("sapUiSelectable");if(w){r.addStyle("width",w);}else{r.addClass("sapMTextMaxWidth");}if(u!==sap.ui.core.TextDirection.Inherit){r.writeAttribute("dir",u.toLowerCase());}if(v){v=R.getTextAlign(v,u);if(v){r.addStyle("text-align",v);}}r.writeClasses();r.writeStyles();r.write(">");r.writeEscaped(t);r.write("</span>");},updateDomValue:function(v){if(!this.isActive()){return this;}v=this._getInputValue(v);if(this.$().text()!==v){this.$().text(v);this._bCheckDomValue=true;}return this;}});return new n(A);};p.prototype._createSelect=function(v){var A,n={width:true,name:true};A=this.createAttributes("selectedKey",this._oMetaData.property,n);A.change=this._oHelper.getSelectionChangeHandler(this._oParent);A.forceSelection=false;if(A.width===""){A.width="100%";}return{control:new S(A),onCreate:"_onCreate",params:{valuehelp:{annotation:v.annotation,aggregation:"items",noDialog:v.noDialog,noTypeAhead:v.noTypeAhead},getValue:"getSelectedKey",type:{type:A.selectedKey.type,property:this._oMetaData.property}}};};p.prototype._createCheckBox=function(){var A=this.createAttributes("selected",null,{},{event:"select",parameter:"selected"});A.editable=(this._oParent.getEditable()&&this._oParent.getEnabled()&&this._oParent.getContextEditable());A.selected.type=this._oTypes.getAbapBoolean();return{control:new C(A),onCreate:"_onCreate",params:{getValue:"getSelected"}};};p.prototype._createEdmDateTime=function(){var A,n,N={width:true,textAlign:true,placeholder:true,name:true};A=this.createAttributes(null,this._oMetaData.property,N,{event:"change",parameter:"value"});n=this.getFormatSettings("dateFormatSettings");if(this._oSelector.checkDatePicker()){A.value={path:this._oMetaData.path,type:this._oTypes.getType(this._oMetaData.property,n,{displayFormat:"Date"}),model:this._oMetaData.model};if(n&&n.style){A.displayFormat=n.style;}return{control:new D(A),onCreate:"_onCreate",params:{getValue:"getValue",type:{type:A.value.type,property:this._oMetaData.property}}};}A.value={path:this._oMetaData.path,model:this._oMetaData.model,type:this._oTypes.getType(this._oMetaData.property,n)};return{control:new I(A),onCreate:"_onCreate",params:{getValue:"getValue",type:{type:A.value.type,property:this._oMetaData.property}}};};p.prototype._createEdmDateTimeOffset=function(){var n,A,N={width:true,textAlign:true,placeholder:true,name:true};n=this.getFormatSettings("dateFormatSettings");A=this.createAttributes(null,this._oMetaData.property,N,{event:"change",parameter:"value"});A.value={model:this._oMetaData.model,path:this._oMetaData.path,type:this._oTypes.getType(this._oMetaData.property,n)};return{control:new I(A),onCreate:"_onCreate",params:{getValue:"getValue",type:{type:A.value.type,property:this._oMetaData.property}}};};p.prototype._createEdmNumeric=function(){var A,n={width:true,textAlign:true,placeholder:true,name:true};A=this.createAttributes("value",this._oMetaData.property,n,{event:"change",parameter:"value"});if(this._oParent.isContextTable()&&sap.ui.getCore().getConfiguration().getRTL()){A.textDirection="LTR";}return{control:new I(A),onCreate:"_onCreate",params:{getValue:"getValue",type:{type:A.value.type,property:this._oMetaData.property}}};};p.prototype._createEdmUOM=function(){var P,n,t,A,r,s,B,u,v=this;A=this._createEdmUOMAttributes();r=this._oParent.getObjectBinding(this._oMetaData.model);this.addObjectBinding(A,r);var w=false;if(this._oParent.isContextTable()&&sap.ui.getCore().getConfiguration().getRTL()){w=true;}if(w){A.textDirection="LTR";}n=new I(A);if(this._oParent.data("suppressUnit")==="true"){s={getValue:"getValue"};if(!this._oHelper.oAnnotation.isCurrency(this._oMetaData.annotations.uom.property.property)){s.type={type:A.value.type,property:this._oMetaData.property};}return{control:n,onCreate:"_onCreate",params:s};}if(!this._oHelper.oAnnotation.isCurrency(this._oMetaData.annotations.uom.property.property)){u={type:A.value.type,property:this._oMetaData.property};}P=this._oHelper.getUOMPath(this._oMetaData);A={value:{model:this._oMetaData.model,path:P},change:this._oHelper.getUOMChangeHandler(this._oParent,true),textAlign:this._getEdmUOMTextAlignment()};this.addObjectBinding(A,r);this.mapBindings(A,{"uomEditable":"editable","uomEnabled":"enabled","uomVisible":"visible","mandatory":"mandatory","contextEditable":"contextEditable"});t=new sap.ui.comp.smartfield.SmartField(A);t.data("configdata",{"configdata":{isInnerControl:true,isUOM:!this._oParent.data("configdata"),model:this._oMetaData.model,navigationPath:this._oMetaData.annotations.uom.navigationPath||null,path:P,entitySetObject:this._oMetaData.annotations.uom.entitySet,entityType:this._oMetaData.annotations.uom.entityType,property:this._oMetaData.annotations.uom.property,annotations:{valuelist:this._oMetaData.annotations.valuelistuom,valuelistType:this._oMetaData.annotations.uom.annotations.valuelistType,text:this._oMetaData.annotations.textuom},modelObject:this._oMetaData.modelObject||this._oModel,onText:function(x){n.setLayoutData(new F({growFactor:1}));t.setLayoutData(new F({shrinkFactor:0}));if(x){if(w&&x.setTextDirection){x.setTextDirection("LTR");}if(v._oParent&&(v._oParent.getControlContext()!=='table')&&(v._oParent.getControlContext()!=='responsiveTable')){x.addStyleClass("sapUiCompSmartFieldUnit");}}},onInput:function(x){n.setLayoutData(new F({growFactor:1}));t.setLayoutData(new F({growFactor:0}));if(x){if(w&&x.setTextDirection){x.setTextDirection("LTR");}if(v._oParent&&(v._oParent.getControlContext()!=='table')&&(v._oParent.getControlContext()!=='responsiveTable')){x.addStyleClass("sapUiCompSmartFieldUnit");}}}}});t.data("errorCheck","setComplexClientErrorSecondOperandNested");n.addStyleClass("smartFieldPaddingRight");n.addStyleClass("sapUiCompSmartFieldValue");B=new H({justifyContent:b.End,items:[n,t],fitContainer:true,width:this._oParent.getWidth()});B.addStyleClass("sapUiCompUOM");if(this._oParent.isContextTable()){if(w){B.addStyleClass("sapUiCompUOMInTableLTR");}B.addStyleClass("sapUiCompUOMInTable");}return{control:B,onCreate:"_onCreateUOM",params:{getValue:true,valuehelp:true,type:u}};};p.prototype._createEdmUOMAttributes=function(){var A={textAlign:this._getEdmUOMTextAlignment(),placeholder:this.getAttribute("placeholder"),name:this.getAttribute("name"),change:this._oHelper.getUOMChangeHandler(this._oParent)};if(this._oMetaData.annotations.uom&&this._oHelper.oAnnotation.isCurrency(this._oMetaData.annotations.uom.property.property)){A.value={parts:[{path:this._oMetaData.path},{path:this._oHelper.getUOMPath(this._oMetaData)}],model:this._oMetaData.model,type:this._oTypes.getCurrencyType(this._oMetaData.property)};}else{A.value={model:this._oMetaData.model,path:this._oMetaData.path,type:this._oTypes.getType(this._oMetaData.property)};}return A;};p.prototype._getEdmUOMTextAlignment=function(){var A=this.getAttribute("textAlign");if(!A){A=e.Initial;}if(A===e.Initial){if(this._oParent.isContextTable()){return e.End;}else{return e.Begin;}}return A;};p.prototype._createEdmUOMDisplay=function(){var v,P,n,A,s,B,t,r=this;if(this._checkSuppressUnit()){return this._createEdmDisplay();}s=this._getEdmUOMTextAlignment();var u=false;if(this._oParent.isContextTable()&&sap.ui.getCore().getConfiguration().getRTL()){u=true;}P=this._oHelper.getUOMPath(this._oMetaData);A={text:{parts:[{path:this._oMetaData.path,type:this._oTypes.getType(this._oMetaData.property)},{path:P}],model:this._oMetaData.model,formatter:this._oTypes.getDisplayFormatter(this._oMetaData.property.property,this._oHelper.oAnnotation.isCurrency(this._oMetaData.property.property)),useRawValues:true},textAlign:s};if(u){A.textDirection="LTR";}n=this._oParent.getObjectBinding(this._oMetaData.model);this.addObjectBinding(A,n);v=new d(A);P=this._oHelper.getUOMPath(this._oMetaData);A={value:{model:this._oMetaData.model,path:P},change:this._oHelper.getUOMChangeHandler(this._oParent,true),textAlign:this._getEdmUOMTextAlignment()};this.addObjectBinding(A,n);this.mapBindings(A,{"uomEditable":"editable","uomEnabled":"enabled","uomVisible":"visible","mandatory":"mandatory","contextEditable":"contextEditable"});t=new sap.ui.comp.smartfield.SmartField(A);t.data("configdata",{"configdata":{isInnerControl:true,isUOM:!this._oParent.data("configdata"),model:this._oMetaData.model,navigationPath:this._oMetaData.annotations.uom.navigationPath||null,path:P,entitySetObject:this._oMetaData.annotations.uom.entitySet,entityType:this._oMetaData.annotations.uom.entityType,property:this._oMetaData.annotations.uom.property,annotations:{valuelist:this._oMetaData.annotations.valuelistuom,text:this._oMetaData.annotations.textuom},modelObject:this._oMetaData.modelObject||this._oModel,onText:function(w){if(w){if(w.setWrapping){w.setWrapping(false);}if(u&&w.setTextDirection){w.setTextDirection("LTR");}if(r._oParent&&(r._oParent.getControlContext()!=='table')&&(r._oParent.getControlContext()!=='responsiveTable')){w.addStyleClass("sapUiCompSmartFieldUnit");}}},onInput:function(w){v.setLayoutData(new F({growFactor:0}));t.setLayoutData(new F({growFactor:0}));if(w){if(u&&w.setTextDirection){w.setTextDirection("LTR");}if(r._oParent&&(r._oParent.getControlContext()!=='table')&&(r._oParent.getControlContext()!=='responsiveTable')){w.addStyleClass("sapUiCompSmartFieldUnit");}}},getContextEditable:function(){return r._oParent.getContextEditable();}}});t.data("errorCheck","setComplexClientErrorSecondOperandNested");v.addStyleClass("smartFieldPaddingRight");v.addStyleClass("sapUiCompSmartFieldValue");B=new H({items:[v,t],fitContainer:true,width:this._oParent.getWidth()});if(this._oParent.isContextTable()){B.setJustifyContent("End");this._oParent.addStyleClass("sapUiCompUOMInTable");if(u){B.addStyleClass("sapUiCompUOMInTableLTR");}B.addStyleClass("sapUiCompUOMInTable");}return{control:B};};p.prototype._checkSuppressUnit=function(){var n;if(this._oParent.data("suppressUnit")==="true"){return true;}n=this._oParent.getBindingInfo("uomVisible");if(!n&&!this._oParent.getUomVisible()){return true;}return false;};p.prototype._createEdmUOMObjectStatus=function(){var A,n,r,P,s;s=this._oTypes.getDisplayFormatter(this._oMetaData.property.property,this._oHelper.oAnnotation.isCurrency(this._oMetaData.property.property));P=this._oHelper.getUOMPath(this._oMetaData);A={text:{parts:[{path:this._oMetaData.path,type:this._oTypes.getType(this._oMetaData.property)},{path:P}],formatter:function(){var t=s.apply(this,arguments);return t+arguments[1];},useRawValues:true}};this._addObjectStatusAttributes(A);n=this._oParent.getObjectBinding(this._oMetaData.model);this.addObjectBinding(A,n);r=new m(A);r.addStyleClass("sapUiCompUOM");return{control:r};};p.prototype._createEdmUOMObjectNumber=function(){var A,n,r,s;s=this._getEdmUOMTextAlignment();if(this._oMetaData.annotations.uom&&this._oHelper.oAnnotation.isCurrency(this._oMetaData.annotations.uom.property.property)){A={number:{parts:[{path:this._oMetaData.path},{path:this._oHelper.getUOMPath(this._oMetaData)}],type:this._oTypes.getCurrencyType(this._oMetaData.property)},unit:{path:this._oHelper.getUOMPath(this._oMetaData)},model:this._oMetaData.model,textAlign:s};}else{A={model:this._oMetaData.model,number:{path:this._oMetaData.path,type:this._oTypes.getType(this._oMetaData.property)},unit:{path:this._oHelper.getUOMPath(this._oMetaData)},textAlign:s};}n=this._oParent.getObjectBinding(this._oMetaData.model);this.addObjectBinding(A,n);r=new k(A);r.addStyleClass("sapUiCompUOM");return{control:r};};p.prototype._createEdmSemantic=function(){var P,A,t,n=this,r=this._oParent.getBindingInfo("value");P=r.parts[0].path;var s=this._oMetaData.property.property["sap:label"];if(this._oMetaData.annotations.lineitem&&this._oMetaData.annotations.lineitem.labels&&this._oMetaData.annotations.lineitem.labels[P]){s=this._oMetaData.annotations.lineitem.labels[P];}A={semanticObject:this._oMetaData.annotations.semantic.semanticObject,semanticObjectLabel:s,fieldName:P,width:this.getAttribute("width"),createControlCallback:q.proxy(function(){var u=this.createControl(true);if(u){return u.control;}return null;},this)};t=this._oHelper.oAnnotation.getText(this._oMetaData.property.property);if(t){A.text={parts:[this._oMetaData.path,this._oHelper.getEdmDisplayPath(this._oMetaData)],model:this._oMetaData.model,formatter:function(u,v){if(u&&v){return n._formatDisplayBehaviour("defaultInputFieldDisplayBehaviour",u,v);}return u?u:"";}};}else{A.text={path:P,model:this._oMetaData.model};}return{control:new f(A),onCreate:"_onCreate",params:{getValue:"getInnerControlValue"}};};p.prototype._createMultiLineText=function(n){var A=this.createAttributes("value",this._oMetaData.property,n);var r=this.getFormatSettings("multiLineSettings");A=q.extend(true,r,A);var s=new T(A);this._handleEventingForEdmString(s,this._oMetaData.property);return{control:s,onCreate:"_onCreate",getValue:"getValue",params:{type:{type:A.value.type,property:this._oMetaData.property}}};};p.prototype._checkLink=function(){var n=this._oParent.getBindingInfo("url");if(n){return true;}if(this._oParent.getUrl()){return true;}if(this._oParent.hasListeners("press")){return true;}return false;};p.prototype._createLink=function(){var t=this;var A={text:"",href:""};var n=this._oParent.getBindingInfo("url");if(this._oParent.hasListeners("press")){A["press"]=function(E){t._oParent.firePress(E);};}else if(n){A["href"]=this._oBinding.toBinding(n);}else{A["href"]=this._oParent.getUrl();}n=this._oParent.getBindingInfo("value");if(n){if(this._oMetaData.annotations.text&&this._oMetaData.property.property.type==="Edm.String"){A.text={parts:[this._oMetaData.path,this._oHelper.getEdmDisplayPath(this._oMetaData)],formatter:function(s,r){if(s&&r){return t._formatDisplayBehaviour("defaultInputFieldDisplayBehaviour",s,r);}return s?s:"";}};}else{A["text"]=this._oBinding.toBinding(n);}}else{A["text"]=this._oParent.getValue();}return{control:new L(A),onCreate:"_onCreate",params:{noValidation:true}};};p.prototype._createEdmBoolean=function(){var A,n,r,t=this,s=null,E=false;E=this._oParent.getEditable()&&this._oParent.getEnabled()&&this._oParent.getContextEditable();n=this._oSelector.checkComboBox();if(n.combobox){return this._createComboBox({annotation:n.annotation,noDialog:true,noTypeAhead:true},!E);}if(E){A=this.createAttributes("selected",this._oMetaData.property,{},{event:"select",parameter:"selected"});r=new C(A);s={getValue:"getSelected"};}else{A=this.createAttributes("text",this._oMetaData.property,{width:true,textAlign:true});A.text={model:this._oMetaData.model,path:this._oMetaData.path};A.text.formatter=function(v){return t._formatDisplayBehaviour("defaultCheckBoxDisplayBehaviour",v);};r=new d(A);}return{control:r,onCreate:"_onCreate",params:s};};p.prototype._getCreator=function(B){return this._oSelector.getCreator(B);};p.prototype._onCreate=function(n,P){var G,r,v=true,t=this;if(P){if(P.noValidation){v=false;}if(P.valuehelp){this._getValueHelpDialogTitle(P.valuehelp);P.valuehelp["analyser"]=this._oHelper.getAnalyzer(this._oModel||this._oMetaData.modelObject);this.addValueHelp(n,this._oMetaData.property.property,P.valuehelp,this._oModel||this._oMetaData.modelObject,function(E){t._oParent.fireValueListChanged({"changes":E.mParameters.changes});});}if(P.getValue){G=P.getValue;P.getValue=function(){return n[G]();};}if(P.type){r=this._oFieldControl.getMandatoryCheck(P.type.property);if(r){P.type.type.oFieldControl=r;}}}if(v){this.addValidations(n,this._oParent.data("errorCheck")||"setSimpleClientError");}if(!this._checkUOM()){n.addStyleClass("sapUiCompSmartFieldValue");}};p.prototype._checkUOM=function(){var n=this._oParent.data("configdata");if(n&&n.configdata){if(n.configdata.onInput){return true;}if(n.configdata.onText){return true;}}return false;};p.prototype._getValueHelpDialogTitle=function(v){v.dialogtitle=this._oParent.getTextLabel();if(!v.dialogtitle){v.dialogtitle=this._oHelper.oAnnotation.getLabel(this._oMetaData.property.property)||this._oMetaData.property.property.name;}};p.prototype._onCreateUOM=function(n,P){var r,s;r=n.getItems();this.addValidations(r[0],"setComplexClientErrorFirstOperand");if(P&&P.getValue){P.getValue=function(){return r[0].getValue();};}P.uom=function(){var t=r[1].getAggregation("_content");return t.getValue();};P.uomset=function(v){var t=r[1].getAggregation("_content");t.setValue(v);};if(P.type){s=this._oFieldControl.getMandatoryCheck(P.type.property);if(s){P.type.type.oFieldControl=s;}}};p.prototype.bind=function(){var t=this,n,r,s=function(M,P){try{t._init(M);t._setUOMEditState();t._bind(P);}catch(u){q.sap.log.warning(u,null,"sap.ui.comp.smartfield.ODataControlFactory.bind.fInit");}};if(!this._bInitialized&&!this.bPending){this._bInitialized=true;n=this._oFieldControl.getBindableAttributes();r=this._oParent.data("configdata");if(r&&r.configdata){s(this._oMeta,n);}else if(this._oModel){this.bPending=true;this._oModel.getMetaModel().loaded().then(function(){t.bPending=false;s(t._oMeta,n);});}}};p.prototype._bind=function(B){var n,r,s;s=this._oFieldControl.getControlProperties(this._oMetaData,B);for(n in s){r=this._oBinding.fromFormatter(this._oMetaData.model,s[n]);this._oParent.bindProperty(n,r);}this._oParent.fireInitialise();};p.prototype.rebindOnCreated=function(){var n,B,r;r=this._oFieldControl.getControlProperties(this._oMetaData,["editable"]);for(n in r){B=this._oBinding.fromFormatter(this._oMetaData.model,r[n]);this._oParent.bindProperty(n,B);}};p.prototype._setUOMEditState=function(){var n,B;if(this._oFieldControl.hasUomEditState(this._oMetaData)){n=this._oFieldControl.getUOMEditState(this._oMetaData);if(n){B=this._oBinding.fromFormatter(this._oMetaData.model,n);this._oParent.bindProperty("uomEditState",B);}}};p.prototype.getDataProperty=function(){return this._oMetaData.property;};p.prototype.getMetaData=function(){return this._oMetaData;};p.prototype.destroy=function(){this._oFieldControl.destroy();this._oSelector.destroy();this._oTypes.destroy();this._oHelper.destroy();this._oHelper=null;this._oFieldControl=null;this._oTypes=null;this._oSelector=null;this._oMetaData=null;g.prototype.destroy.apply(this,[]);};return p;},true);