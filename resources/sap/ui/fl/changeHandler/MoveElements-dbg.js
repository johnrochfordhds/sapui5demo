/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define(['jquery.sap.global', './Base'], function(jQuery, Base) {
	"use strict";

	/**
	 * Change handler for moving of a elements.
	 * 
	 * @constructor
	 * @alias sap.ui.fl.changeHandler.MoveElements
	 * @author SAP SE
	 * @version 1.36.12
	 * @experimental Since 1.34.0
	 */
	var MoveElements = function() {
	};
	MoveElements.prototype = jQuery.sap.newObject(Base.prototype);

	MoveElements.CHANGE_TYPE = "moveElements";

	/**
	 * Moves an element from one aggregation to another.
	 * 
	 * @param {sap.ui.fl.Change}
	 *          oChange change object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control}
	 *          oSourceParent control that matches the change selector for applying the change, which is the source of the
	 *          move
	 * @public
	 */
	MoveElements.prototype.applyChange = function(oChange, oSourceParent) {
		var that = this;
		var mContent = oChange.getContent();

		if (oSourceParent.getId() !== oChange.getSelector().id) {
			throw new Error("Source parent id (selector) doesn't match the control on which to apply the change");
		}
		var sSourceAggregation = oChange.getSelector().aggregation;
		if (!sSourceAggregation) {
			throw new Error("No source aggregation supplied via selector for move");
		}

		if (!mContent.target || !mContent.target.selector) {
			throw new Error("No target supplied for move");
		}
		var oTargetParent = this._byId(mContent.target.selector.id);
		if (!oTargetParent) {
			throw new Error("Move target parent not found");
		}
		var sTargetAggregation = mContent.target.selector.aggregation;
		if (!sTargetAggregation) {
			throw new Error("No target aggregation supplied for move");
		}
		if (!mContent.movedElements) {
			throw new Error("No moveElements supplied");
		}

		mContent.movedElements.forEach(function(mMovedElement) {
			var oMovedElement = that._byId(mMovedElement.selector.id);
			if (!oMovedElement) {
				throw new Error("Unkown element with id '" + mMovedElement.selector.id + "' in moveElements supplied");
			}
			if ( typeof mMovedElement.targetIndex !== "number") {
				throw new Error("Missing targetIndex for element with id '" + mMovedElement.selector.id
						+ "' in moveElements supplied");
			}
			that.removeAggregation(oSourceParent, sSourceAggregation, oMovedElement);
			that.addAggregation(oTargetParent, sTargetAggregation, oMovedElement, mMovedElement.targetIndex);
		});

	};

	/**
	 * Completes the change by adding change handler specific content
	 * 
	 * @param {sap.ui.fl.Change}
	 *          oChange change object to be completed
	 * @param {object}
	 *          mSpecificChangeInfo as an empty object since no additional attributes are required for this operation
	 * @public
	 */
	MoveElements.prototype.completeChangeContent = function(oChange, mSpecificChangeInfo) {
		var that = this;

		var mSpecificInfo = this.getSpecificChangeInfo(mSpecificChangeInfo);

		var mChangeData = oChange.getDefinition();

		mChangeData.changeType = MoveElements.CHANGE_TYPE;

		mChangeData.selector = mSpecificInfo.source;

		mChangeData.content = {
			movedElements : [],
			target : {
				selector : mSpecificInfo.target
			}
		};
		mSpecificInfo.movedElements.forEach(function(mElement) {
			var oElement = mElement.element || that._byId(mElement.id);

			mChangeData.content.movedElements.push({
				selector : {
					id : oElement.getId(),
					type : that._getType(oElement)
				},
				sourceIndex : mElement.sourceIndex,
				targetIndex : mElement.targetIndex
			});
		});
	};

	/**
	 * Enrich the incoming change info with the change info from the setter, to get the complete data in one format
	 */
	MoveElements.prototype.getSpecificChangeInfo = function(mSpecificChangeInfo) {
		var oSourceParent = this._getParentElement(this._mSource || mSpecificChangeInfo.source);
		var oTargetParent = this._getParentElement(this._mTarget || mSpecificChangeInfo.target);

		var sSourceAggregation = this._mSource && this._mSource.aggregation || mSpecificChangeInfo.source.aggregation;
		var sTargetAggregation = this._mTarget && this._mTarget.aggregation || mSpecificChangeInfo.target.aggregation;

		var mSpecificInfo = {
			source : {
				id : oSourceParent.getId(),
				aggregation : sSourceAggregation,
				type : this._getType(oSourceParent)
			},
			target : {
				id : oTargetParent.getId(),
				aggregation : sTargetAggregation,
				type : this._getType(oTargetParent)
			},
			movedElements : this._aMovedElements || mSpecificChangeInfo.movedElements
		};

		return mSpecificInfo;
	};

	/**
	 * @param {array}
	 *          aElements
	 * @param {string}
	 *          aElements.elementId id of the moved element, can be omitted if element is passed
	 * @param {sap.ui.core.Element}
	 *          aElements.element moved element, optional fallback for elementId
	 * @param {number}
	 *          aElements.sourceIndex index of the moved elements in the source aggregation
	 * @param {number}
	 *          aElements.targetIndex index of the moved elements in the target aggregation
	 */
	MoveElements.prototype.setMovedElements = function(aElements) {
		this._aMovedElements = aElements;
	};

	/**
	 * @param {object}
	 *          mSource
	 * @param {string}
	 *          mSource.id id of the source parent, can be omitted if element is passed
	 * @param {sap.ui.core.Element}
	 *          mSource.parent optional fallback for id
	 * @param {string}
	 *          mSource.aggregation original aggregation of the moved elements
	 */
	MoveElements.prototype.setSource = function(mSource) {
		this._mSource = mSource;
	};

	/**
	 * @param {object}
	 *          mTarget
	 * @param {string}
	 *          mTarget.id id of the target parent
	 * @param {sap.ui.core.Element}
	 *          mTarget.parent optional fallback for id, can be omitted if parent is passed
	 * @param {string}
	 *          mTarget.aggregation target aggregation of the moved elements in the target element
	 */
	MoveElements.prototype.setTarget = function(mTarget) {
		this._mTarget = mTarget;
	};

	MoveElements.prototype._byId = function(sId) {
		return sap.ui.getCore().byId(sId);
	};

	MoveElements.prototype._getType = function(oElement) {
		return oElement.getMetadata().getName();
	};

	MoveElements.prototype._getParentElement = function(mData) {
		var oElement = mData.parent;
		if (!oElement) {
			oElement = this._byId(mData.id);
		}
		return oElement;
	};

	return MoveElements;
},
/* bExport= */true);
