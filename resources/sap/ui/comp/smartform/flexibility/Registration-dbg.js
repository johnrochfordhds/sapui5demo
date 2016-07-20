/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

sap.ui.define([
		'jquery.sap.global',
		'sap/ui/fl/registry/ChangeRegistry',
		'sap/ui/fl/registry/SimpleChanges',
		'sap/ui/comp/smartform/flexibility/changes/RemoveField',
		'sap/ui/comp/smartform/flexibility/changes/RemoveGroup',
		'sap/ui/comp/smartform/flexibility/changes/RenameField',
		'sap/ui/comp/smartform/flexibility/changes/RenameGroup',
		'sap/ui/comp/smartform/flexibility/changes/AddField',
		'sap/ui/comp/smartform/flexibility/changes/AddFields',
		'sap/ui/comp/smartform/flexibility/changes/AddGroup',
		'sap/ui/comp/smartform/flexibility/changes/MoveGroups',
		'sap/ui/comp/smartform/flexibility/changes/MoveFields',
		'sap/ui/comp/smartform/flexibility/changes/OrderGroups',
		'sap/ui/comp/smartform/flexibility/changes/OrderFields'
	], function(jQuery, ChangeRegistry, SimpleChanges, RemoveField, RemoveGroup, RenameField, RenameGroup, AddField, AddFields, AddGroup, MoveGroups, MoveFields, OrderGroups, OrderFields) {
		"use strict";

		/**
		 * Change handler for adding a smart form group element (representing a field).
		 * @name sap.ui.comp.smartform.flexibility.Registration
		 * @namespace
		 * @author SAP SE
		 * @version 1.36.12
		 * @experimental Since 1.29.0
		 */
		return {
			registerLibrary: function(){
				var compChanges = {
					orderFields: {
						changeType: "orderFields",
						changeHandler: OrderFields
					},
					orderGroups: {
						changeType: "orderGroups",
						changeHandler: OrderGroups
					},
					removeField: {
						changeType: "removeField",
						changeHandler: RemoveField
					},
					removeGroup: {
						changeType: "removeGroup",
						changeHandler: RemoveGroup
					},
					renameField: {
						changeType: "renameField",
						changeHandler: RenameField
					},
					renameGroup: {
						changeType: "renameGroup",
						changeHandler: RenameGroup
					},
					addField: {
						changeType: "addField",
						changeHandler: AddField
					},
					addFields: {
						changeType: "addFields",
						changeHandler: AddFields
					},
					addGroup: {
						changeType: "addGroup",
						changeHandler: AddGroup
					},
					moveGroups: {
						changeType: "moveGroups",
						changeHandler: MoveGroups
					},
					moveFields: {
						changeType: "moveFields",
						changeHandler: MoveFields
					}
				};

				var oChangeRegistry = ChangeRegistry.getInstance();

				oChangeRegistry.registerControlsForChanges({
					"sap.ui.comp.smartform.SmartForm": [
						compChanges.removeGroup,
						compChanges.addGroup,
						compChanges.moveGroups,
						compChanges.renameField,
						SimpleChanges.propertyChange
					],
					"sap.ui.comp.smartform.Group": [
						SimpleChanges.hideControl,
						SimpleChanges.unhideControl,
						compChanges.renameGroup,
						compChanges.addField,
						compChanges.addFields,
						compChanges.moveFields
					],
					"sap.ui.comp.smartform.GroupElement": [
						SimpleChanges.unhideControl,
						SimpleChanges.hideControl,
						compChanges.renameField
					],
					"sap.ui.comp.smarttable.SmartTable": [
						SimpleChanges.propertyChange
					],
					"sap.ui.comp.smartfilterbar.SmartFilterBar": [
						SimpleChanges.propertyChange
					]
				});

			}
		};
	},
	/* bExport= */true);

