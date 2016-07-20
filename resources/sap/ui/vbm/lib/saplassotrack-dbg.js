// ...........................................................................//
// this module does the label handling.......................................//

// Author: Martina Gozlinski, extraction by Jürgen

// ...........................................................................//
/* global VBI */// declare unusual global vars for JSLint/SAPUI5 validation
VBI.addSceneLassoTrackingFunctions = function(scene) {
	"use strict";

	// ........................................................................//
	// Lasso Tracking .........................................................//
	// ........................................................................//

	scene.LassoTracking = function() {
		this.m_PosMoves = [];
		this.m_bTrack = false;
		this.m_keycode = 0;
	};

	scene.LassoTracking.prototype.onsapkeydown = function(e) {
		if (e.keyCode == this.m_keycode) {
			// exit mode selection mode ................//
			this.ExitMode();
			e.preventDefault();
			return true;
		}

	};
	scene.LassoTracking.prototype.onsapdown = function(e) {
		// determine the sap down position.....................................//
		var rect = scene.m_Canvas[scene.m_nOverlayIndex].getBoundingClientRect();
		var zf = scene.GetStretchFactor4Mode();
		this.m_PosMoves.push([
			(e.clientX - rect.left) / zf[0], (e.clientY - rect.top) / zf[1]
		]);
		this.m_bTrack = true;
		e.preventDefault();
		scene.m_Canvas[scene.m_nLabelIndex].focus();
		return true;
	};
	scene.LassoTracking.prototype.onsapmove = function(e) {
		if (this.m_bTrack) {
			var zf = scene.GetStretchFactor4Mode();
			var rect = scene.m_Canvas[scene.m_nOverlayIndex].getBoundingClientRect();
			this.m_PosMoves.push([
				(e.clientX - rect.left) / zf[0], (e.clientY - rect.top) / zf[1]
			]);
		}
		scene.SetCursor('crosshair');
		scene.RenderAsync(true); // trigger async rendering...................//
		e.preventDefault();
		return true;
	};

	scene.LassoTracking.prototype.onsapout = function(e) {

	};
	scene.LassoTracking.prototype.execute = function(e) {
		// The prototype impl is empty
	};

	scene.LassoTracking.prototype.onsapup = function(e) {
		if (!this.m_bTrack) {
			return false;
		}

		if (this.m_PosMoves.length > 2) {
			this.execute(e);
		}
		this.m_PosMoves = [];
		this.m_bTrack = false;

		// trigger async rendering..........................................//
		scene.RenderAsync(true);
		e.preventDefault();
		return true;

	};

	scene.LassoTracking.prototype.Hook = function() {
		scene.SetInputMode(VBI.InputModeLassoSelect);
		scene.m_DesignVO = this;
		scene.SetCursor('crosshair');
		scene.RenderAsync(true);
	};

	scene.LassoTracking.prototype.UnHook = function() {
		if (scene.m_nInputMode == VBI.InputModeLassoSelect) {
			scene.m_Ctx.onChangeTrackingMode(scene.m_nInputMode, false);
			scene.SetInputMode(VBI.InputModeDefault);
		} else {
			jQuery.sap.log.error("Wrong InputMode in UnHook: " + scene.m_nInputMode);
		}

		this.m_PosMoves = [];
		this.m_bTrack = false;

		scene.m_DesignVO = null;
		scene.RenderAsync(true); // trigger async rendering...................//
	};

	scene.LassoTracking.prototype.ExitMode = function() {
		// exit mode selection mode ................//
		this.UnHook();
		scene.SetCursor('default');
		scene.RenderAsync(true); // trigger async rendering...................//

	};


	// ........................................................................//
	// lasso selection ........................................................//
	// ........................................................................//
	scene.LassoSelection = function() {
		scene.LassoTracking.call(this);
		this.m_keycode = 65;
		this.Hook();
	};

	scene.LassoSelection.prototype = Object.create(scene.LassoTracking.prototype);

	scene.LassoSelection.prototype.constructor = scene.LassoSelection;

	scene.LassoSelection.prototype.execute = function(e) {
		scene.PerFormMultiSelect(e, this);
	};

	scene.LassoSelection.prototype.Render = function(canvas, dc) {
		if (!this.m_bTrack) {
			return false;
		}

		// check positions to prevent from failures.........................//
		if (this.m_PosMoves.length) {
			VBI.Utilities.DrawTrackingLasso(dc, this.m_PosMoves);
		}
	};

};
