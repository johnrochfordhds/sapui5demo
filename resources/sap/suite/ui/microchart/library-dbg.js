/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

/**
 * Initialization Code and shared classes of library sap.suite.ui.microchart.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library', 'sap/ui/core/Core', 'sap/m/library'],
	function(jQuery, coreLibrary, Core, mLibrary) {
	"use strict";

	/**
	 * UI5 library: sap.suite.ui.microchart.
	 *
	 * @namespace
	 * @name sap.suite.ui.microchart
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.suite.ui.microchart",
		version: "1.36.12",
		// library dependencies
		dependencies : ["sap.ui.core", "sap.m"],
		types: [
			"sap.suite.ui.microchart.AreaMicroChartViewType",
			"sap.suite.ui.microchart.BulletMicroChartModeType",
			"sap.suite.ui.microchart.CommonBackgroundType",
			"sap.suite.ui.microchart.ComparisonMicroChartViewType",
			"sap.suite.ui.microchart.LoadStateType"
		],
		interfaces: [],
		controls: [
			"sap.suite.ui.microchart.AreaMicroChart",
			"sap.suite.ui.microchart.BulletMicroChart",
			"sap.suite.ui.microchart.ColumnMicroChart",
			"sap.suite.ui.microchart.ComparisonMicroChart",
			"sap.suite.ui.microchart.DeltaMicroChart",
			"sap.suite.ui.microchart.HarveyBallMicroChart",
			"sap.suite.ui.microchart.RadialMicroChart"
		],
		elements: [
			"sap.suite.ui.microchart.AreaMicroChartPoint",
			"sap.suite.ui.microchart.AreaMicroChartItem",
			"sap.suite.ui.microchart.AreaMicroChartLabel",
			"sap.suite.ui.microchart.BulletMicroChartData",
			"sap.suite.ui.microchart.ColumnMicroChartData",
			"sap.suite.ui.microchart.ColumnMicroChartLabel",
			"sap.suite.ui.microchart.ComparisonMicroChartData",
			"sap.suite.ui.microchart.HarveyBallMicroChartItem"
		]
	});

	/**
	 * Enum of available views for the area micro chart concerning the position of the labels.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.suite.ui.microchart.AreaMicroChartViewType = {

		/**
		 * The view with labels on the top and bottom.
		 * @public
		 */
		Normal : "Normal",

		/**
		 * The view with labels on the left and right.
		 * @public
		 */
		Wide : "Wide"

	};

	/**
	 * Defines if the horizontal bar represents a current value only or if it represents the delta between a current value and a threshold value.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.suite.ui.microchart.BulletMicroChartModeType = {
		/**
		 * Displays the Actual value.
		 * @public
		 */
		Actual: "Actual",

		/**
		 * Displays delta between the Actual and Threshold values.
		 * @public
		 */
		Delta: "Delta"
	};

	/**
	 * Lists the available theme-specific background colors.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.suite.ui.microchart.CommonBackgroundType = {
		/**
		 * The lightest background color.
		 * @public
		 */
		Lightest: "Lightest",

		/**
		 * Extra light background color.
		 * @public
		 */
		ExtraLight: "ExtraLight",

		/**
		 * Light background color.
		 * @public
		 */
		Light: "Light",

		/**
		 * Medium light background color.
		 * @public
		 */
		MediumLight: "MediumLight",

		/**
		 * Medium background color.
		 * @public
		 */
		Medium: "Medium",

		/**
		 * Dark background color.
		 * @public
		 */
		Dark: "Dark",

		/**
		 * Extra dark background color.
		 * @public
		 */
		ExtraDark: "ExtraDark",

		/**
		 * The darkest background color.
		 * @public
		 */
		Darkest: "Darkest",

		/**
		 * The transparent background color.
		 * @public
		 */
		Transparent: "Transparent"
	};

	/**
	 * Lists the views of the comparison micro chart concerning the position of titles and labels.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.suite.ui.microchart.ComparisonMicroChartViewType = {
		/**
		 * Titles and values are displayed above the bars.
		 * @public
		 */
		Normal: "Normal",

		/**
		 * Titles and values are displayed in the same line with the bars.
		 * @public
		 */
		Wide: "Wide"
	};

	sap.suite.ui.microchart.LoadStateType = {

			/**
			 * LoadableView is loading the control.
			 * @public
			 */
			Loading: "Loading",

			/**
			 * LoadableView has loaded the control.
			 * @public
			 */
			Loaded: "Loaded",

			/**
			 * LoadableView failed to load the control.
			 * @public
			 */
			Failed: "Failed",

			/**
			 * LoadableView disabled to load the control.
			 * @public
			 */
			Disabled: "Disabled"
	};

	return sap.suite.ui.microchart;
});
