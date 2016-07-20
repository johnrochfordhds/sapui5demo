/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/changeHandler/HideControl","sap/ui/fl/changeHandler/UnhideControl","sap/ui/fl/changeHandler/MoveElements","sap/ui/fl/changeHandler/PropertyChange"],function(q,H,U,M,P){"use strict";var S={hideControl:{changeType:"hideControl",changeHandler:H},unhideControl:{changeType:"unhideControl",changeHandler:U},moveElements:{changeType:"moveElements",changeHandler:M},propertyChange:{changeType:"propertyChange",changeHandler:P}};return S;},true);
