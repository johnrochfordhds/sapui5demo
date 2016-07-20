
VBI.ScenePointerEvents=function(s,e){"use strict";s.m_Gesture=null;this.m_Events=["msgesturehold","msgesturestart","msgestureend","msgesturechange","msgestureinertiastart","gesturehold","gesturestart","gestureend","gesturechange","gestureinertiastart","pointerdown","pointermove","pointerup","mspointerdown","mspointermove","mspointerup"];this.clear=function(){for(var n=0,a=this.m_Events.length;n<a;++n){e["on"+this.m_Events[n]]=null;}};this.subscribe=function(){var a=this.m_Events;for(var n=0,b=a.length;n<b;++n){var h;if(a[n].slice(0,2)=="ms"){h="process"+a[n].slice(2);}else{h="process"+a[n];}if(!s[h]){if(VBI.m_bTrace){VBI.Trace("Error: Handler "+h+" not defined");}}e["on"+a[n]]=s[h];}};s.processgesturehold=function(a){if(VBI.m_bTrace){VBI.Trace("processgesturehold");}s.DispatchEvent(a,"sapsecclick");a.preventDefault();};s.processgesturestart=function(a){if(VBI.m_bTrace){VBI.Trace("processgesturestart");}s.m_Gesture.started=true;};s.processgestureend=function(a){if(VBI.m_bTrace){VBI.Trace("processgestureend");}if(s.m_Gesture){s.m_Gesture.target=null;}s.m_Gesture=null;};s.processgesturechange=function(a){if(VBI.m_bTrace){VBI.Trace("processgesturechange mode: "+s.m_nInputMode);}if((s.m_nInputMode!=VBI.InputModeDefault)&&(s.m_nInputMode!=VBI.InputModeTrackMap)){s.DispatchEvent(a,"sapmove");return;}if(VBI.m_bTrace){VBI.Trace("processgesturechange");VBI.Trace("rotation:"+a.rotation);VBI.Trace("scale:"+a.scale);VBI.Trace("trans:"+a.translationX+","+a.translationY);}var g=a.gestureObject;var b=Math.round(g.tx)-g.txdone;var c=Math.round(g.ty)-g.tydone;var i=Math.round(a.translationX)+b;var d=Math.round(a.translationY)+c;g.tx+=a.translationX;g.ty+=a.translationY;g.txdone+=i;g.tydone+=d;if(VBI.m_bTrace){VBI.Trace("done:"+g.txdone+","+g.tydone);VBI.Trace("calc:"+g.tx+","+g.ty);}if(i||d){if(VBI.m_bTrace){VBI.Trace("scene.processgesturechange move");}s.MoveMap(i,d);}if(a.scale!=1.0){s.ZoomMap(a.scale,a.offsetX,a.offsetY);s.TriggerReRenderTimer(400);}a.stopPropagation();a.preventDefault();return true;};s.processgestureinertiastart=function(a){if(VBI.m_bTrace){VBI.Trace("processgestureinertiastart");}a.preventDefault();};s.processpointerdown=function(a){if(VBI.m_bTrace){VBI.Trace("scene.processpointerdown ");}s.onsapdown(a);var g=s.m_Gesture;if(g&&((a.pointerType!=g.pointerType)||!g.started)){if(VBI.m_bTrace){VBI.Trace("processpointerdown gesture pointer type mismatch or gesture hasn't been started");}s.m_Gesture.target=null;g=s.m_Gesture=null;}if(!g){if(VBI.m_bTrace){VBI.Trace("processpointerdown create gesture");}g=s.m_Gesture=new window.MSGesture();g.pointerCount=0;g.target=a.srcElement;g.pointerType=a.pointerType;g.tx=0;g.ty=0;g.txdone=0;g.tydone=0;}if(a.pointerType==g.pointerType){g.addPointer(a.pointerId);g.pointerCount++;}return;};s.processpointerup=function(a){if(VBI.m_bTrace){VBI.Trace("processpointerup");}if(s.m_Gesture){s.m_Gesture.pointerCount--;if(!s.m_Gesture.pointerCount){s.m_Gesture.target=null;s.m_Gesture=null;}}return s.onsapup(a);};s.processpointermove=function(a){if(VBI.m_bTrace){VBI.Trace("scene.processpointermove");}s.m_currentMouseX=a.clientX;s.m_currentMouseY=a.clientY;s.onsapmove(a);return;};this.subscribe();};
VBI.SceneTouchEvents=function(s,a){"use strict";this.m_Events=["touchstart","touchend","touchmove","touchcancel"];this.clear=function(){for(var n=0,b=this.m_Events.length;n<b;++n){a["on"+this.m_Events[n]]=null;}};this.subscribe=function(){var b=this.m_Events;for(var n=0,c=b.length;n<c;++n){var h;if(b[n].slice(0,2)=="ms"){h="process"+b[n].slice(2);}else{h="process"+b[n];}if(!s[h]){if(VBI.m_bTrace){VBI.Trace("Error: Handler "+h+" not defined");}}a["on"+b[n]]=s[h];}};s.processtouchstart=function(e){var h=true;var c=s.m_Ctx;if(c.m_strOpenMenu){c.m_strOpenMenu=undefined;var m=c.m_Menus.findMenuByID(c.m_strOpenMenu);m.close();}if(VBI.m_bTrace){VBI.Trace("processtouchstart");}if(s.m_TapTimer){window.clearInterval(s.m_TapTimer);}if(s.DispatchEvent(e,"sapdown")==true){return;}s.m_Touches.push(e);s.m_Touches.m_bMoveWasDone=false;if(e.touches.length==1&&!s.m_SuppressedNavigation.move){s.SetInputMode(VBI.InputModeDefault);var t=e.touches[0];s.m_currentMouseX=t.clientX;s.m_currentMouseY=t.clientY;if(VBI.m_bTrace){VBI.Trace("processtouchstart"+"X:"+s.m_currentMouseX+"Y:"+s.m_currentMouseY);}s.RestartContextMenuTimer(e,t,700);h=true;}else if(e.touches.length==2){s.SetInputMode(VBI.InputModeDefault);var b=e.touches[0];var d=e.touches[1];var f=(d.clientX+b.clientX)/2;var g=(d.clientY+b.clientY)/2;s.m_currentMouseX=f;s.m_currentMouseY=g;s.m_midPointX=f;s.m_midPointY=g;var i=Math.sqrt(Math.pow(b.clientX-d.clientX,2)+Math.pow(b.clientY-d.clientY,2));s.m_currentTouchDistance=i;if(VBI.m_bTrace){VBI.Trace("processtouchstart"+"X1:"+b.clientX+"Y1:"+b.clientY+"X2:"+d.clientX+"Y2:"+d.clientY);}h=true;}if(h){e.preventDefault();e.stopPropagation();return false;}};s.RestartContextMenuTimer=function(e,t,d){if(s.m_ContextMenuTimer){window.clearInterval(s.m_ContextMenuTimer);}s.m_ContextMenuTimer=window.setInterval(function(){window.clearInterval(s.m_ContextMenuTimer);s.m_ContextMenuTimer=null;s.onPseudoRightClick(e,t);},d);};s.onPseudoRightClick=function(e,t){s.SetInputMode(VBI.InputModeDefault);if(VBI.m_bTrace){VBI.Trace("Pseudo Right Click");}if(s.DispatchEvent(e,"sapsecclick")==true){s.m_Touches=[];return;}var b;if((b=s.m_Ctx.m_Actions.findAction("ContextMenu",s,"Map"))){s.m_Touches=[];var r=s.GetInternalDivClientRect();s.m_Ctx.FireAction(b,s,"Map",null,{x:t.clientX-r.left,y:t.clientY-r.top,scene:s.m_ID});}};s.IsDoubleTap=function(e){if(e.length<4){return null;}var i=e.length-4;var b=e.length-2;if(e[i].type=="touchstart"&&e[i].touches.length!=1){return null;}if(e[b].type=="touchstart"&&e[b].touches.length!=1){return null;}var d=e[i].touches[0].clientX-e[b].touches[0].clientX;var c=e[i].touches[0].clientY-e[b].touches[0].clientY;if((d*d+c*c)>1000){return null;}var f=e.length-3;var g=e.length-1;var h=e[g].timeStamp-e[f].timeStamp;if(h>300){return null;}return[e[b].touches[0].clientX,e[b].touches[0].clientY];};s.IsTwoFingerTap=function(e){if((e.length<2)||(e.m_bMoveWasDone)){return null;}var i=e.length-2;var b=e.length-1;if(e[i].type!="touchstart"||e[i].touches.length!=2){return null;}var d=e[b].timeStamp-e[i].timeStamp;if(d>300){return null;}var t=e[i].touches;return[(t[0].clientX+t[1].clientX)/2,(t[0].clientY+t[1].clientY)/2];};s.IsSingleTap=function(e){if(e.length!=2||(e.m_bMoveWasDone)){return null;}var i=e.length-2;var b=e.length-1;if(e[i].type!="touchstart"||e[i].touches.length!=1){return null;}if(e[b].type!="touchend"){return null;}var r=[e[i].touches[0].clientX,e[i].touches[0].clientY];r.timeTouchDown=e[b].timeStamp-e[i].timeStamp;return r;};s.processtouchend=function(e){if(s.m_DesignVO){if(s.DispatchEvent(e,"sapup")==true){return;}}if(!s.m_Touches.length){return;}if(e.m_delayedExamination){s.m_Touches.pop();}if(VBI.m_bTrace){VBI.Trace("touchend");}window.clearInterval(s.m_ContextMenuTimer);s.m_ContextMenuTimer=null;if(s.DispatchEvent(e,"sapup")==true){s.m_Touches=[];return;}var r=s.GetInternalDivClientRect();if((r.width!=s.m_nDivWidth)||(r.height!=s.m_nDivHeight)){s.resizeCanvas(0);}s.m_Touches.push(e);var x;if((x=s.IsDoubleTap(s.m_Touches))){if(s.DispatchEvent(e,"sapdblclick")==true){s.m_Touches=[];e.stopPropagation();return;}s.AnimateZoom(true,x[0],x[1],12);s.m_Touches=[];}else if((x=s.IsTwoFingerTap(s.m_Touches))){s.AnimateZoom(false,x[0],x[1],33);s.m_Touches=[];}else{if(!(s.m_nInputMode==VBI.InputModeTrackMap)){s.InternalRenderLayer(s.m_Canvas[s.m_nOverlayIndex],false,true,true,s.m_Canvas[0].m_nExactLOD);}}if(s.m_Touches.length>2){s.m_Touches.splice(0,s.m_Touches.length-2);}s.SetInputMode(VBI.InputModeDefault);if((x=s.IsSingleTap(s.m_Touches))){if(x.timeTouchDown<300&&!e.m_delayedExamination){s.m_TapTimer=window.setInterval(function(){e.m_delayedExamination=true;s.processtouchend(e);window.clearInterval(s.m_TapTimer);},300);}else{if(s.DispatchEvent(e,"sapclick")){s.m_Touches=[];e.stopPropagation();return;}var b,c=s.m_Ctx.m_Actions;if(c){if((b=c.findAction("Click",s,"Map"))){var d=s.GetInternalDivClientRect();s.m_Ctx.FireAction(b,s,"Map",null,{x:x[0]-d.left,y:x[1]-d.top});}}s.m_Touches=[];}}e.stopPropagation();e.preventDefault();};s.processtouchcancel=function(e){if(VBI.m_bTrace){VBI.Trace("touchcancel");}if(s.DispatchEvent(e,"sapup")==true){return;}s.SetInputMode(VBI.InputModeDefault);e.preventDefault();};s.processtouchmove=function(e){if(VBI.m_bTrace){VBI.Trace("touchmove");}if(s.m_DesignVO){if(s.DispatchEvent(e,"sapmove")==true){return;}}if(!s.m_Touches.length||!s.m_currentMouseX){return;}var d,b,t={},c;if(e.touches.length==1){t=e.touches[0];d=t.clientX-s.m_currentMouseX;b=t.clientY-s.m_currentMouseY;if((d==0)&&(b==0)){e.stopPropagation();return true;}}if(VBI.m_bIsAndroid&&(e.touches.length==2)){var f=e.touches[0];c=e.touches[1];d=f.clientX+c.clientX-2*s.m_currentMouseX;b=f.clientY+c.clientY-2*s.m_currentMouseY;if((d==0)&&(b==0)){e.stopPropagation();return true;}}s.m_Touches.m_bMoveWasDone=true;window.clearInterval(s.m_ContextMenuTimer);s.m_ContextMenuTimer=null;var h=false;s.m_nTapCount=0;s.SetInputMode(VBI.InputModeTrackMap);if(e.touches.length==1){s.RestartContextMenuTimer(e,t,1100);if(VBI.m_bTrace){VBI.Trace("ontouchmove "+"X1:"+t.pageX+"Y1:"+t.pageY);}s.m_currentMouseX=t.clientX;s.m_currentMouseY=t.clientY;s.MoveMap(d,b);h=true;}else if(e.touches.length==2&&!s.m_SuppressedNavigation.zoom){var r=s.GetInternalDivClientRect();if((r.width!=s.m_nDivWidth)||(r.height!=s.m_nDivHeight)){s.resizeCanvas(0);}c=e.touches[0];var g=e.touches[1];var i=c.clientX+(g.clientX-c.clientX)/2;var j=c.clientY+(g.clientY-c.clientY)/2;var k=s.m_Canvas[0].getBoundingClientRect();i-=k.left;j-=k.top;var l=Math.sqrt(Math.pow(c.clientX-g.clientX,2)+Math.pow(c.clientY-g.clientY,2));if(Math.abs(s.m_currentTouchDistance-l)>10){var z=(l>s.m_currentTouchDistance)?true:false;s.m_currentTouchDistance=l;if(VBI.m_bTrace){VBI.Trace("ontouchmove "+" X1:"+c.pageX+" Y1:"+c.pageY+" X2:"+g.pageX+" Y2:"+g.pageY);}s.ZoomMap(z?s.m_nLodFactorZoomIn:s.m_nLodFactorZoomOut,i,j,s.m_nTicksInALod);s.TriggerReRenderTimer(400);}h=true;}if(h){e.stopPropagation();return true;}};s.SetInputModeTrackMap=function(S){if(!S){s.m_currentMouseX=0;s.m_currentMouseY=0;}};this.subscribe();};
VBI.SceneEvent=function(s,a){"use strict";this.m_DeviceHandlers=[];this.m_Events=["mousedown","mouseup","mousemove","mousewheel","wheel","mouseout","click","dblclick","contextmenu","selectstart","dragstart","dragenter","dragover","dragleave","drop","dragend","keydown"];a.dropzone="true";if(sap.ui.Device.support.pointer&&navigator.msMaxTouchPoints){this.m_DeviceHandlers.push(new VBI.ScenePointerEvents(s,a));}this.clear=function(){var n;for(n=0;n<this.m_DeviceHandlers.length;++n){this.m_DeviceHandlers[n].clear();}this.m_DeviceHandlers=[];for(n=0;n<this.m_Events.length;++n){var b="on"+this.m_Events[n];if(a[b]){a[b]=null;}}};this.subscribe=function(){var b=this.m_Events;for(var n=0,c=b.length;n<c;++n){var h;if(b[n].slice(0,2)=="ms"){h="process"+b[n].slice(2);}else if(s.m_SuppressedNavigation.zoom&&(b[n]==="wheel"||b[n]==="mousewheel")){continue;}else{h="process"+b[n];}if(!s[h]){jQuery.sap.log.error("Handler "+h+" not defined");}a["on"+b[n]]=s[h];}};if(sap.ui.Device.support.touch&&!(sap.ui.Device.support.pointer&&navigator.msMaxTouchPoints)){this.m_DeviceHandlers.push(new VBI.SceneTouchEvents(s,a));if(!sap.ui.Device.system.desktop){return;}}s.SetInputModeTrackMap=function(S){if(S){document.addEventListener('mouseup',s.processmouseup,true);document.addEventListener('mousemove',s.processmousemove,true);}else{s.m_currentMouseX=0;s.m_currentMouseY=0;document.removeEventListener('mouseup',s.processmouseup,true);document.removeEventListener('mousemove',s.processmousemove,true);}};s.onsapdown=function(e){if(VBI.m_bTrace){VBI.Trace("scene.onsapdown");}s.m_currentMouseDownX=e.clientX;s.m_currentMouseDownY=e.clientY;s.m_currentMouseX=e.clientX;s.m_currentMouseY=e.clientY;if(s.DispatchEvent(e,"sapdown")==true){return true;}};s.onsapup=function(e){if(VBI.m_bTrace){VBI.Trace("scene.onsapup");}if(s.DispatchEvent(e,"sapup")==true){return;}if(s.vbiclass=="3DScene"){return;}s.SetInputMode(VBI.InputModeDefault);e.preventDefault();return false;};s.onsapclick=function(e){if(VBI.m_bTrace){VBI.Trace("scene.onsapclick");}var d=s.m_currentMouseDownX-e.clientX;var b=s.m_currentMouseDownY-e.clientY;if((d*d+b*b)<=5){if(VBI.m_bTrace){VBI.Trace("process click dispatch");}if(s.DispatchEvent(e,"sapclick")==true){if(VBI.m_bTrace){VBI.Trace("process click handled in dispatch");}return;}if(s.Click){var r=s.m_Canvas[s.m_nOverlayIndex].getBoundingClientRect();e.m_clientX=e.clientX-r.left;e.m_clientY=e.clientY-r.top;if(s.Click(e)){return;}}var c,f=s.m_Ctx.m_Actions;if(f){if((c=f.findAction("Click",s,"Map"))){s.m_Ctx.FireAction(c,s,"Map",null,s.GetEventVPCoordsObj(e));}e.preventDefault();}}};s.onsapmove=function(e){if(VBI.m_bTrace){VBI.Trace("scene.onsapmove");}if(s.DispatchEvent(e,"sapmove")==true){return true;}if(s.vbiclass=="3DScene"){return true;}var t;if((t=s.IsTransparent(e.clientX,e.clientY))){s.SetToolTip("");s.SetCursor('default');s.InternalSetHotItem(null,null);}s.SetCursor(t?'default':'pointer');return false;};s.processmousedown=function(e){if(VBI.m_bTrace){VBI.Trace("scene.processmousedown");}if(s.m_Gesture){return;}if(s.onsapdown(e)){return;}if(s.vbiclass=="3DScene"){return;}if(!s.m_SuppressedNavigation.move&&(e.type.indexOf("pointer")<0)&&(!sap.ui.Device.os.macintosh||e.which==1)){if(VBI.m_bTrace){VBI.Trace("set input mode track map");}s.SetInputMode(VBI.InputModeTrackMap);s.m_Canvas[s.m_nLabelIndex].focus();}};s.processkeydown=function(e){if(VBI.m_bTrace){VBI.Trace("scene.processkeydown");}var h=false,k=e.keyCode;if(s.DispatchEvent(e,"sapkeydown")==true){return;}var r=s.GetInternalDivClientRect();if((r.width!=s.m_nDivWidth)||(r.height!=s.m_nDivHeight)){s.resizeCanvas(0);}if(k==72){s.GoToInitialStart();h=true;}else if(k==90){s.endTrackingMode();new s.RectangularZoom();s.m_Ctx.onChangeTrackingMode(VBI.InputModeRectZoom,true);h=true;}else if(k==82){s.endTrackingMode();new s.RectSelection();s.m_Ctx.onChangeTrackingMode(VBI.InputModeRectSelect,true);h=true;}else if(k==65){s.endTrackingMode();new s.LassoSelection();s.m_Ctx.onChangeTrackingMode(VBI.InputModeLassoSelect,true);h=true;}else{if(!s.m_SuppressedNavigation.zoom){var z=0;var c=s.GetCenterPos();var n=s.getCanvas().m_nExactLOD;if(k==187||k==107||k==171){z=1;}else if(k==189||k==109||k==173){z=-1;}if(z){var m=s.GetMinLOD();if((z>0)&&(n==m)&&(n!=Math.ceil(n))){n=Math.ceil(n);}else{n+=z;}s.AnimateZoomToGeo(c,Math.round(n),20);h=true;}}if(!s.m_SuppressedNavigation.move){var d=20;switch(k){case 37:s.MoveMap(d,0);h=true;break;case 39:s.MoveMap(-d,0);h=true;break;case 38:s.MoveMap(0,d);h=true;break;case 40:s.MoveMap(0,-d);h=true;break;default:break;}}}if(h){e.preventDefault();}return;};s.processcontextmenu=function(e){if(e.target!=s.m_Canvas[s.m_nLabelIndex]){return;}if(VBI.m_bTrace){VBI.Trace("scene.processcontextmenu");}if(s.DispatchEvent(e,"sapsecclick")==true){return;}var b,c=s.m_Ctx.m_Actions;if(c){if((b=c.findAction("ContextMenu",s,"Map"))){s.m_Ctx.FireAction(b,s,"Map",null,s.GetEventVPCoordsObjWithScene(e));}e.preventDefault();}};s.processmouseout=function(e){if(VBI.m_bTrace){VBI.Trace("scene.processmouseout");}if(s.DispatchEvent(e,"sapout")==true){return;}s.InternalSetHotItem(null,null);return false;};s.processdblclick=function(e){if(VBI.m_bTrace){VBI.Trace("scene.processdblclick");}if(s.DispatchEvent(e,"sapdblclick")==true){return;}return;};s.processclick=function(e){if(e.target!=s.m_Canvas[s.m_nLabelIndex]){return;}if(VBI.m_bTrace){VBI.Trace("scene.processclick");}if(s.m_Gesture){return;}return s.onsapclick(e);};s.processmouseup=function(e){if(VBI.m_bTrace){VBI.Trace("scene.processmouseup");}s.dragclear();return s.onsapup(e);};s.processmousemove=function(e){if(VBI.m_bTrace){VBI.Trace("scene.processmousemove");}if(s.m_DragInfo){if(s.m_DragInfo.bDragStart){return false;}return;}var d=e.clientX-s.m_currentMouseX;var b=e.clientY-s.m_currentMouseY;s.m_currentMouseX=e.clientX;s.m_currentMouseY=e.clientY;if(s.m_Gesture){return;}if(s.onsapmove(e)){return;}if(s.m_nInputMode==VBI.InputModeTrackMap){if(!(e.buttons==1||e.which==1)){s.SetInputMode(VBI.InputModeDefault);return false;}if(d||b){s.MoveMap(d,b);}return false;}e.preventDefault();};s.processmousewheel=function(e){s.processcommonwheel(e,e.wheelDelta);return false;};s.processwheel=function(e){s.processcommonwheel(e,-e.deltaY);return false;};s.processcommonwheel=function(e,d){var r=s.m_Canvas[s.m_nLabelIndex].getBoundingClientRect();e.m_OffsetX=e.clientX-r.left;e.m_OffsetY=e.clientY-r.top;e.m_Delta=d;if(sap.ui.Device.os.macintosh){var t=Date.now();var m=((s.m_LastCWEvent!=undefined)&&(t-s.m_LastCWEvent<100));s.m_LastCWEvent=t;if(m){return;}}if(VBI.m_bTrace){VBI.Trace("processcommonwheel");}if(s.DispatchEvent(e)==true){return;}if(s.vbiclass=="3DScene"){e.preventDefault();}else if(!s.m_SuppressedNavigation.zoom&&e.m_Delta){var r=s.GetInternalDivClientRect();if((r.width!=s.m_nDivWidth)||(r.height!=s.m_nDivHeight)){s.resizeCanvas(0);}if(s.m_nZoomMode){var b=s.m_Canvas[0].getBoundingClientRect();s.AnimateZoom(e.m_Delta>0,e.m_OffsetX+b.left,e.m_OffsetY+b.top,40,e);}else{s.ZoomMap(e.m_Delta>0?s.m_nLodFactorZoomIn:s.m_nLodFactorZoomOut,e.m_OffsetX,e.m_OffsetY,s.m_nTicksInALod);}e.preventDefault();}return;};s.dragclear=function(e){var i=document.getElementById(s.m_Target.id+"-transparentImg");if(i){s.m_Div.removeChild(i);}s.m_DragInfo=null;VBI.m_DndTarget=null;};s.processdragleave=function(e){return;};s.processdragend=function(e){e.preventDefault();e.stopPropagation();s.dragclear();return true;};s.processselectstart=function(e){if(e.target.dragDrop&&s.m_DragInfo){e.target.dragDrop();}e.preventDefault();return true;};s.processdragstart=function(e){if(s.m_DragInfo){if(s.m_DragInfo.strExtData){e.dataTransfer.setData('text',s.m_DragInfo.strExtData);}else{e.dataTransfer.setData('text',"");}e.dataTransfer.effectAllowed='copy';s.m_DragInfo.bDragStart=true;VBI.m_DndTarget=e.target;if(e.dataTransfer.setDragImage){var i=VBI.Utilities.GetTransparentImage();i.id=s.m_Target.id+"-transparentImg";s.m_Div.appendChild(i);e.dataTransfer.setDragImage(i,0,0);}if(s.m_Gesture){s.m_Gesture.target=null;s.m_Gesture=null;}return true;}return false;};s.processdragenter=function(e){if(!e.dataTransfer){return false;}if(e.dataTransfer){try{e.dataTransfer.dropEffect='copy';}catch(b){jQuery.sap.log.warning("scene.processdragenter exception occured: "+b.message);}}e.preventDefault();return true;};s.processdragover=function(e){if(!e.dataTransfer){return false;}if(s.m_Gesture){return;}if(s.m_DragInfo&&s.m_DragInfo.bDragStart){s.DispatchEvent(e,"sapdrag");}else{e.preventDefault();}return;};s.DesignCreateObject=function(d,p,f){var b=null;if(typeof d=='string'){b=d;}else{b=JSON.stringify(d);}if(b.indexOf("{POS}")>=0){if(p){var c=""+p[0]+";"+p[1]+";"+"0.0";var t=b.replace(/{POS}/g,c);f(t);}else{new s.DesignPositionArray(null,b,f,"{POS}",1);}}else if(b.indexOf("{POSARRAY}")>=0){new s.DesignPositionArray(p?[p[0],p[1],0.0]:null,b,f,"{POSARRAY}",null);}else{f(d);}return;};s.processdrop=function(e){if(!e.dataTransfer){s.dragclear();return false;}if(s.m_DragInfo&&s.m_DragInfo.bDragStart){s.DispatchEvent(e,"sapdrop");e.preventDefault();e.stopPropagation();s.dragclear();return true;}var d=e.dataTransfer.getData('text');var r=s.m_Canvas[0].getBoundingClientRect();var p=s.GetPosFromPoint([e.clientX-r.left,e.clientY-r.top,0.0]);var b=null,c=s.m_Ctx.m_Actions;if(c){b=s.m_Ctx.m_Actions.findAction("Drop",s,"Map");}var f=null;if(b){f=function(g){var h=s.GetEventVPCoordsObj(e);h.content=g;s.m_Ctx.FireAction(b,s,"Map",null,h);};}else{f=s.m_Ctx.m_Control.load.bind(s.m_Ctx.m_Control);}s.DesignCreateObject(d,p,f);e.preventDefault();e.stopPropagation();s.dragclear();return true;};s.DesignTrack=function(o){this.m_Tcx=o;this.onsapkeydown=function(e){if(e.keyCode==27){this.UnHook(false);e.preventDefault();return true;}};this.onsapclick=function(e){if(VBI.m_bTrace){VBI.Trace("Track sapclick");}this.UnHook();return false;};this.onsapdown=function(e){if(VBI.m_bTrace){VBI.Trace("Track sapdown");}e.preventDefault();return true;};this.onsapmove=function(e){if(VBI.m_bTrace){VBI.Trace("Track sapmove");}var t=this.m_Tcx;t.m_ClientX=e.offsetX;t.m_ClientY=e.offsetY;if(t.m_CBDrag){if(VBI.m_bTrace){VBI.Trace("Track sapmove: orig type "+e.type);}t.m_CBDrag(t,e);}e.preventDefault();e.stopPropagation();return true;};this.onsapup=function(e){if(VBI.m_bTrace){VBI.Trace("Track sapup");}var t=this.m_Tcx;t.m_ClientX=e.offsetX;t.m_ClientY=e.offsetY;if(t.m_CBDrop){t.m_CBDrop(t,e);}if(t.m_CBEnd){t.m_CBEnd(t,e);}this.UnHook();e.preventDefault();e.stopPropagation();return true;};this.Hook=function(){s.SetInputMode(VBI.InputModeTrackObject);s.m_DesignVO=this;};this.UnHook=function(){if(s.m_DesignVO!=this){return;}if(s.m_nInputMode==VBI.InputModeTrackObject){s.SetInputMode(VBI.InputModeDefault);}else{jQuery.sap.log.error("Wrong InputMode in UnHook: "+s.m_nInputMode);}s.m_DesignVO=null;this.m_Tcx=null;s.RenderAsync(true);};this.Render=function(c,d){return;};this.Hook();};s.DesignPositionArray=function(p,l,f,b,m){this.m_PosArray=p?p:[];this.m_PosMove=null;this.m_Func=f;this.m_PlaceHolder=b;s.SetCursor('crosshair');this.onsapkeydown=function(e){if(e.keyCode==27){this.UnHook(false);e.preventDefault();return true;}};this.onsapclick=function(e){if(VBI.m_bTrace){VBI.Trace("this.onsapclick "+e.type);}var r=s.m_Canvas[s.m_nOverlayIndex].getBoundingClientRect();var p=s.GetPosFromPoint([e.clientX-r.left,e.clientY-r.top,0]);var t=[p[0],p[1],0.0];var c=this.m_PosArray.length;var n=c/3;if((n>=1)&&(this.m_PosArray[c-3]==t[0])&&(this.m_PosArray[c-2]==t[1])&&(this.m_PosArray[c-1]==t[2])){return true;}for(var d=0,g=t.length;d<g;++d){this.m_PosArray.push(t[d]);}n=this.m_PosArray.length/3;s.RenderAsync(true);e.preventDefault();if(m&&n>=m){this.UnHook(true);}return true;};this.onsapdown=function(e){e.preventDefault();return true;};this.onsapmove=function(e){jQuery.sap.log.debug("this.onsapmove");jQuery.sap.log.error("Wrong InputMode in onsapmove: "+s.m_nInputMode);var r=s.m_Canvas[0].getBoundingClientRect();this.m_PosMove=s.GetPosFromPoint([e.clientX-r.left,e.clientY-r.top,0]);s.RenderAsync(true);e.preventDefault();return true;};this.onsapdblclick=function(e){this.UnHook(true);return true;};this.Hook=function(){s.SetInputMode(VBI.InputModeTrackDesign);s.m_DesignVO=this;};this.UnHook=function(A){if(s.m_nInputMode==VBI.InputModeTrackDesign){s.SetInputMode(VBI.InputModeDefault);}else{jQuery.sap.log.error("Wrong InputMode in UnHook: "+s.m_nInputMode);}this.m_PosMove=null;var c=VBI.Types.vector2string(this.m_PosArray);var t=l.replace(new RegExp(this.m_PlaceHolder,'g'),c);s.m_DesignVO=null;s.RenderAsync(true);if(A&&this.m_Func){this.m_Func(t);}};this.Render=function(c,d){var x,e=1.0;if(!this.m_PosArray.length){return;}var S=false;var C=this.m_PosArray.concat(this.m_PosMove);var g=s.GetNearestPosArray(C);var h=s.GetPointArrayFromPosArray(g,false);d.strokeStyle="rgba( 255, 0, 20, 0.5 )";d.lineWidth=e;var i=e*e/2;d.beginPath();var t=[h[0],h[1]];d.moveTo(h[0],h[1]);for(var n=0,j,k;n<h.length/3;++n){x=[h[n*3],h[n*3+1],0.0];if(((j=(t[0]-x[0]))*j+(k=(t[1]-x[1]))*k)<i){continue;}S=true;d.lineTo(x[0],x[1]);t=x;}if(S){d.stroke();}};this.Hook();};this.subscribe();};
VBI.ThumbnailEvent=function(s,a){"use strict";this.m_DeviceHandlers=[];this.m_Events=["click","contextmenu"];if(sap.ui.Device.support.touch&&!(sap.ui.Device.support.pointer&&navigator.msMaxTouchPoints)){var t=["touchstart","touchend"];if(!sap.ui.Device.system.desktop){this.m_Events=t;}else{this.m_Events=this.m_Events.concat(t);}}this.clear=function(){var n;for(n=0;n<this.m_DeviceHandlers.length;++n){this.m_DeviceHandlers[n].clear();}this.m_DeviceHandlers=[];for(n=0;n<this.m_Events.length;++n){var b="on"+this.m_Events[n];if(a[b]){a[b]=null;}}};this.subscribe=function(){var b=this.m_Events;for(var n=0,c=b.length;n<c;++n){var h;if(b[n].slice(0,2)=="ms"){h="process"+b[n].slice(2);}else{h="process"+b[n];}if(!s[h]){jQuery.sap.log.error("Handler "+h+" not defined");}a["on"+b[n]]=s[h];}};s.processclick=function(e){if(VBI.m_bTrace){VBI.Trace("thumbnail.processclick");}var b,c=s.m_Ctx.m_Actions;if(c){if((b=c.findAction("Click",s,"Thumbnail"))){s.m_Ctx.FireAction(b,s,"Thumbnail",null,s.GetEventVPCoordsObj(e));}e.preventDefault();}};s.processcontextmenu=function(e){if(VBI.m_bTrace){VBI.Trace("thumbnail.processcontextMenu");}var b,c=s.m_Ctx.m_Actions;if(c){if((b=c.findAction("ContextMenu",s,"Thumbnail"))){s.m_Ctx.FireAction(b,s,"Thumbnail",null,s.GetEventVPCoordsObj(e));}e.preventDefault();}};s.onPseudoThumbRightClick=function(e,b){if(VBI.m_bTrace){VBI.Trace("Pseudo Right Click");}var c;if((c=s.m_Ctx.m_Actions.findAction("ContextMenu",s,"Thumbnail"))){s.m_Touches=[];var r=s.GetInternalDivClientRect();s.m_Ctx.FireAction(c,s,"Thumbnail",null,{x:b.clientX-r.left,y:b.clientY-r.top,scene:s.m_ID});}};s.RestartThumbnailCMTimer=function(e,b,d){if(s.m_ContextMenuTimer){window.clearInterval(s.m_ContextMenuTimer);}s.m_ContextMenuTimer=window.setInterval(function(){window.clearInterval(s.m_ContextMenuTimer);s.m_ContextMenuTimer=null;s.onPseudoThumbRightClick(e,b);},d);};s.processtouchstart=function(e){var h=true;if(VBI.m_bTrace){VBI.Trace("processtouchstart");}s.m_Touches.push(e);if(e.touches.length==1){var b=e.touches[0];s.m_currentMouseX=b.clientX;s.m_currentMouseY=b.clientY;s.RestartThumbnailCMTimer(e,b,700);h=true;}if(h){e.preventDefault();e.stopPropagation();return false;}};s.IsSingleTapOnThumb=function(e){if(e.length!=2){return null;}var i=e.length-2;var b=e.length-1;if(e[i].type!="touchstart"||e[i].touches.length!=1){return null;}if(e[b].type!="touchend"){return null;}var r=[e[i].touches[0].clientX,e[i].touches[0].clientY];r.timeTouchDown=e[b].timeStamp-e[i].timeStamp;return r;};s.processtouchend=function(e){if(!s.m_Touches.length){return;}if(VBI.m_bTrace){VBI.Trace("touchend");}window.clearInterval(s.m_ContextMenuTimer);s.m_ContextMenuTimer=null;s.m_Touches.push(e);var x,b,c=s.m_Ctx.m_Actions;if((x=s.IsSingleTapOnThumb(s.m_Touches))&&c){if((b=c.findAction("Click",s,"Thumbnail"))){var r=s.GetInternalDivClientRect();s.m_Ctx.FireAction(b,s,"Thumbnail",null,{x:x[0]-r.left,y:x[1]-r.top});}}s.m_Touches=[];e.stopPropagation();e.preventDefault();};this.subscribe();};
