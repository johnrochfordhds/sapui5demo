/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/registry/ChangeRegistry','sap/ui/fl/registry/SimpleChanges','sap/ui/comp/smartform/flexibility/changes/RemoveField','sap/ui/comp/smartform/flexibility/changes/RemoveGroup','sap/ui/comp/smartform/flexibility/changes/RenameField','sap/ui/comp/smartform/flexibility/changes/RenameGroup','sap/ui/comp/smartform/flexibility/changes/AddField','sap/ui/comp/smartform/flexibility/changes/AddFields','sap/ui/comp/smartform/flexibility/changes/AddGroup','sap/ui/comp/smartform/flexibility/changes/MoveGroups','sap/ui/comp/smartform/flexibility/changes/MoveFields','sap/ui/comp/smartform/flexibility/changes/OrderGroups','sap/ui/comp/smartform/flexibility/changes/OrderFields'],function(q,C,S,R,a,b,c,A,d,e,M,f,O,g){"use strict";return{registerLibrary:function(){var h={orderFields:{changeType:"orderFields",changeHandler:g},orderGroups:{changeType:"orderGroups",changeHandler:O},removeField:{changeType:"removeField",changeHandler:R},removeGroup:{changeType:"removeGroup",changeHandler:a},renameField:{changeType:"renameField",changeHandler:b},renameGroup:{changeType:"renameGroup",changeHandler:c},addField:{changeType:"addField",changeHandler:A},addFields:{changeType:"addFields",changeHandler:d},addGroup:{changeType:"addGroup",changeHandler:e},moveGroups:{changeType:"moveGroups",changeHandler:M},moveFields:{changeType:"moveFields",changeHandler:f}};var o=C.getInstance();o.registerControlsForChanges({"sap.ui.comp.smartform.SmartForm":[h.removeGroup,h.addGroup,h.moveGroups,h.renameField,S.propertyChange],"sap.ui.comp.smartform.Group":[S.hideControl,S.unhideControl,h.renameGroup,h.addField,h.addFields,h.moveFields],"sap.ui.comp.smartform.GroupElement":[S.unhideControl,S.hideControl,h.renameField],"sap.ui.comp.smarttable.SmartTable":[S.propertyChange],"sap.ui.comp.smartfilterbar.SmartFilterBar":[S.propertyChange]});}};},true);