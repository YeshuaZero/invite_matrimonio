!function(w){"object"==typeof exports&&typeof module<"u"?module.exports=w():"function"==typeof define&&define.amd?define([],w):(typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:this).Parallax=w()}(function(){return function w(d,g,m){function f(n,u){if(!g[n]){if(!d[n]){var a="function"==typeof require&&require;if(!u&&a)return a(n,!0);if(h)return h(n,!0);var o=new Error("Cannot find module '"+n+"'");throw o.code="MODULE_NOT_FOUND",o}var t=g[n]={exports:{}};d[n][0].call(t.exports,function(e){return f(d[n][1][e]||e)},t,t.exports,w,d,g,m)}return g[n].exports}for(var h="function"==typeof require&&require,p=0;p<m.length;p++)f(m[p]);return f}({1:[function(w,d,g){"use strict";var f=Object.getOwnPropertySymbols,h=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable;d.exports=function(){try{if(!Object.assign)return!1;var n=new String("abc");if(n[5]="de","5"===Object.getOwnPropertyNames(n)[0])return!1;for(var u={},a=0;a<10;a++)u["_"+String.fromCharCode(a)]=a;if("0123456789"!==Object.getOwnPropertyNames(u).map(function(t){return u[t]}).join(""))return!1;var o={};return"abcdefghijklmnopqrst".split("").forEach(function(t){o[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},o)).join("")}catch{return!1}}()?Object.assign:function(n,u){for(var a,o,t=function m(n){if(null==n)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(n)}(n),e=1;e<arguments.length;e++){for(var i in a=Object(arguments[e]))h.call(a,i)&&(t[i]=a[i]);if(f){o=f(a);for(var s=0;s<o.length;s++)p.call(a,o[s])&&(t[o[s]]=a[o[s]])}}return t}},{}],2:[function(w,d,g){(function(m){(function(){var f,h,p,n,u,a;typeof performance<"u"&&null!==performance&&performance.now?d.exports=function(){return performance.now()}:null!=m&&m.hrtime?(d.exports=function(){return(f()-u)/1e6},h=m.hrtime,n=(f=function(){var o;return 1e9*(o=h())[0]+o[1]})(),a=1e9*m.uptime(),u=n-a):Date.now?(d.exports=function(){return Date.now()-p},p=Date.now()):(d.exports=function(){return(new Date).getTime()-p},p=(new Date).getTime())}).call(this)}).call(this,w("_process"))},{_process:3}],3:[function(w,d,g){function m(){throw new Error("setTimeout has not been defined")}function f(){throw new Error("clearTimeout has not been defined")}function h(r){if(t===setTimeout)return setTimeout(r,0);if((t===m||!t)&&setTimeout)return t=setTimeout,setTimeout(r,0);try{return t(r,0)}catch{try{return t.call(null,r,0)}catch{return t.call(this,r,0)}}}function n(){v&&s&&(v=!1,s.length?l=s.concat(l):y=-1,l.length&&u())}function u(){if(!v){var r=h(n);v=!0;for(var c=l.length;c;){for(s=l,l=[];++y<c;)s&&s[y].run();y=-1,c=l.length}s=null,v=!1,function p(r){if(e===clearTimeout)return clearTimeout(r);if((e===f||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(r);try{return e(r)}catch{try{return e.call(null,r)}catch{return e.call(this,r)}}}(r)}}function a(r,c){this.fun=r,this.array=c}function o(){}var t,e,i=d.exports={};!function(){try{t="function"==typeof setTimeout?setTimeout:m}catch{t=m}try{e="function"==typeof clearTimeout?clearTimeout:f}catch{e=f}}();var s,l=[],v=!1,y=-1;i.nextTick=function(r){var c=new Array(arguments.length-1);if(arguments.length>1)for(var b=1;b<arguments.length;b++)c[b-1]=arguments[b];l.push(new a(r,c)),1!==l.length||v||h(u)},a.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=o,i.addListener=o,i.once=o,i.off=o,i.removeListener=o,i.removeAllListeners=o,i.emit=o,i.prependListener=o,i.prependOnceListener=o,i.listeners=function(r){return[]},i.binding=function(r){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(r){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],4:[function(w,d,g){(function(m){for(var f=w("performance-now"),h=typeof window>"u"?m:window,p=["moz","webkit"],n="AnimationFrame",u=h["request"+n],a=h["cancel"+n]||h["cancelRequest"+n],o=0;!u&&o<p.length;o++)u=h[p[o]+"Request"+n],a=h[p[o]+"Cancel"+n]||h[p[o]+"CancelRequest"+n];if(!u||!a){var t=0,e=0,i=[];u=function(s){if(0===i.length){var l=f(),v=Math.max(0,1e3/60-(l-t));t=v+l,setTimeout(function(){var y=i.slice(0);i.length=0;for(var r=0;r<y.length;r++)if(!y[r].cancelled)try{y[r].callback(t)}catch(c){setTimeout(function(){throw c},0)}},Math.round(v))}return i.push({handle:++e,callback:s,cancelled:!1}),e},a=function(s){for(var l=0;l<i.length;l++)i[l].handle===s&&(i[l].cancelled=!0)}}d.exports=function(s){return u.call(h,s)},d.exports.cancel=function(){a.apply(h,arguments)},d.exports.polyfill=function(){h.requestAnimationFrame=u,h.cancelAnimationFrame=a}}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{"performance-now":2}],5:[function(w,d,g){"use strict";var f=function(){function o(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(t,e,i){return e&&o(t.prototype,e),i&&o(t,i),t}}(),h=w("raf"),p=w("object-assign"),n={propertyCache:{},vendors:[null,["-webkit-","webkit"],["-moz-","Moz"],["-o-","O"],["-ms-","ms"]],clamp:function(o,t,e){return t<e?o<t?t:o>e?e:o:o<e?e:o>t?t:o},data:function(o,t){return n.deserialize(o.getAttribute("data-"+t))},deserialize:function(o){return"true"===o||"false"!==o&&("null"===o?null:!isNaN(parseFloat(o))&&isFinite(o)?parseFloat(o):o)},camelCase:function(o){return o.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},accelerate:function(o){n.css(o,"transform","translate3d(0,0,0) rotate(0.0001deg)"),n.css(o,"transform-style","preserve-3d"),n.css(o,"backface-visibility","hidden")},transformSupport:function(o){for(var t=document.createElement("div"),e=!1,i=null,s=!1,l=null,v=null,y=0,r=n.vendors.length;y<r;y++)if(null!==n.vendors[y]?(l=n.vendors[y][0]+"transform",v=n.vendors[y][1]+"Transform"):(l="transform",v="transform"),void 0!==t.style[v]){e=!0;break}switch(o){case"2D":s=e;break;case"3D":if(e){var c=document.body||document.createElement("body"),b=document.documentElement,X=b.style.overflow,Y=!1;document.body||(Y=!0,b.style.overflow="hidden",b.appendChild(c),c.style.overflow="hidden",c.style.background=""),c.appendChild(t),t.style[v]="translate3d(1px,1px,1px)",s=void 0!==(i=window.getComputedStyle(t).getPropertyValue(l))&&i.length>0&&"none"!==i,b.style.overflow=X,c.removeChild(t),Y&&(c.removeAttribute("style"),c.parentNode.removeChild(c))}}return s},css:function(o,t,e){var i=n.propertyCache[t];if(!i)for(var s=0,l=n.vendors.length;s<l;s++)if(i=null!==n.vendors[s]?n.camelCase(n.vendors[s][1]+"-"+t):t,void 0!==o.style[i]){n.propertyCache[t]=i;break}o.style[i]=e}},u={relativeInput:!1,clipRelativeInput:!1,inputElement:null,hoverOnly:!1,calibrationThreshold:100,calibrationDelay:500,supportDelay:500,calibrateX:!1,calibrateY:!0,invertX:!0,invertY:!0,limitX:!1,limitY:!1,scalarX:10,scalarY:10,frictionX:.1,frictionY:.1,originX:.5,originY:.5,pointerEvents:!1,precision:1,onReady:null,selector:null},a=function(){function o(t,e){(function m(o,t){if(!(o instanceof t))throw new TypeError("Cannot call a class as a function")})(this,o),this.element=t;var i={calibrateX:n.data(this.element,"calibrate-x"),calibrateY:n.data(this.element,"calibrate-y"),invertX:n.data(this.element,"invert-x"),invertY:n.data(this.element,"invert-y"),limitX:n.data(this.element,"limit-x"),limitY:n.data(this.element,"limit-y"),scalarX:n.data(this.element,"scalar-x"),scalarY:n.data(this.element,"scalar-y"),frictionX:n.data(this.element,"friction-x"),frictionY:n.data(this.element,"friction-y"),originX:n.data(this.element,"origin-x"),originY:n.data(this.element,"origin-y"),pointerEvents:n.data(this.element,"pointer-events"),precision:n.data(this.element,"precision"),relativeInput:n.data(this.element,"relative-input"),clipRelativeInput:n.data(this.element,"clip-relative-input"),hoverOnly:n.data(this.element,"hover-only"),inputElement:document.querySelector(n.data(this.element,"input-element")),selector:n.data(this.element,"selector")};for(var s in i)null===i[s]&&delete i[s];p(this,u,i,e),this.inputElement||(this.inputElement=this.element),this.calibrationTimer=null,this.calibrationFlag=!0,this.enabled=!1,this.depthsX=[],this.depthsY=[],this.raf=null,this.bounds=null,this.elementPositionX=0,this.elementPositionY=0,this.elementWidth=0,this.elementHeight=0,this.elementCenterX=0,this.elementCenterY=0,this.elementRangeX=0,this.elementRangeY=0,this.calibrationX=0,this.calibrationY=0,this.inputX=0,this.inputY=0,this.motionX=0,this.motionY=0,this.velocityX=0,this.velocityY=0,this.onMouseMove=this.onMouseMove.bind(this),this.onDeviceOrientation=this.onDeviceOrientation.bind(this),this.onDeviceMotion=this.onDeviceMotion.bind(this),this.onOrientationTimer=this.onOrientationTimer.bind(this),this.onMotionTimer=this.onMotionTimer.bind(this),this.onCalibrationTimer=this.onCalibrationTimer.bind(this),this.onAnimationFrame=this.onAnimationFrame.bind(this),this.onWindowResize=this.onWindowResize.bind(this),this.windowWidth=null,this.windowHeight=null,this.windowCenterX=null,this.windowCenterY=null,this.windowRadiusX=null,this.windowRadiusY=null,this.portrait=!1,this.desktop=!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i),this.motionSupport=!!window.DeviceMotionEvent&&!this.desktop,this.orientationSupport=!!window.DeviceOrientationEvent&&!this.desktop,this.orientationStatus=0,this.motionStatus=0,this.initialise()}return f(o,[{key:"initialise",value:function(){void 0===this.transform2DSupport&&(this.transform2DSupport=n.transformSupport("2D"),this.transform3DSupport=n.transformSupport("3D")),this.transform3DSupport&&n.accelerate(this.element),"static"===window.getComputedStyle(this.element).getPropertyValue("position")&&(this.element.style.position="relative"),this.pointerEvents||(this.element.style.pointerEvents="none"),this.updateLayers(),this.updateDimensions(),this.enable(),this.queueCalibration(this.calibrationDelay)}},{key:"doReadyCallback",value:function(){this.onReady&&this.onReady()}},{key:"updateLayers",value:function(){this.layers=this.selector?this.element.querySelectorAll(this.selector):this.element.children,this.layers.length||console.warn("ParallaxJS: Your scene does not have any layers."),this.depthsX=[],this.depthsY=[];for(var t=0;t<this.layers.length;t++){var e=this.layers[t];this.transform3DSupport&&n.accelerate(e),e.style.position=t?"absolute":"relative",e.style.display="block",e.style.left=0,e.style.top=0;var i=n.data(e,"depth")||0;this.depthsX.push(n.data(e,"depth-x")||i),this.depthsY.push(n.data(e,"depth-y")||i)}}},{key:"updateDimensions",value:function(){this.windowWidth=window.innerWidth,this.windowHeight=window.innerHeight,this.windowCenterX=this.windowWidth*this.originX,this.windowCenterY=this.windowHeight*this.originY,this.windowRadiusX=Math.max(this.windowCenterX,this.windowWidth-this.windowCenterX),this.windowRadiusY=Math.max(this.windowCenterY,this.windowHeight-this.windowCenterY)}},{key:"updateBounds",value:function(){this.bounds=this.inputElement.getBoundingClientRect(),this.elementPositionX=this.bounds.left,this.elementPositionY=this.bounds.top,this.elementWidth=this.bounds.width,this.elementHeight=this.bounds.height,this.elementCenterX=this.elementWidth*this.originX,this.elementCenterY=this.elementHeight*this.originY,this.elementRangeX=Math.max(this.elementCenterX,this.elementWidth-this.elementCenterX),this.elementRangeY=Math.max(this.elementCenterY,this.elementHeight-this.elementCenterY)}},{key:"queueCalibration",value:function(t){clearTimeout(this.calibrationTimer),this.calibrationTimer=setTimeout(this.onCalibrationTimer,t)}},{key:"enable",value:function(){this.enabled||(this.enabled=!0,this.orientationSupport?(this.portrait=!1,window.addEventListener("deviceorientation",this.onDeviceOrientation),this.detectionTimer=setTimeout(this.onOrientationTimer,this.supportDelay)):this.motionSupport?(this.portrait=!1,window.addEventListener("devicemotion",this.onDeviceMotion),this.detectionTimer=setTimeout(this.onMotionTimer,this.supportDelay)):(this.calibrationX=0,this.calibrationY=0,this.portrait=!1,window.addEventListener("mousemove",this.onMouseMove),this.doReadyCallback()),window.addEventListener("resize",this.onWindowResize),this.raf=h(this.onAnimationFrame))}},{key:"disable",value:function(){this.enabled&&(this.enabled=!1,this.orientationSupport?window.removeEventListener("deviceorientation",this.onDeviceOrientation):this.motionSupport?window.removeEventListener("devicemotion",this.onDeviceMotion):window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("resize",this.onWindowResize),h.cancel(this.raf))}},{key:"calibrate",value:function(t,e){this.calibrateX=void 0===t?this.calibrateX:t,this.calibrateY=void 0===e?this.calibrateY:e}},{key:"invert",value:function(t,e){this.invertX=void 0===t?this.invertX:t,this.invertY=void 0===e?this.invertY:e}},{key:"friction",value:function(t,e){this.frictionX=void 0===t?this.frictionX:t,this.frictionY=void 0===e?this.frictionY:e}},{key:"scalar",value:function(t,e){this.scalarX=void 0===t?this.scalarX:t,this.scalarY=void 0===e?this.scalarY:e}},{key:"limit",value:function(t,e){this.limitX=void 0===t?this.limitX:t,this.limitY=void 0===e?this.limitY:e}},{key:"origin",value:function(t,e){this.originX=void 0===t?this.originX:t,this.originY=void 0===e?this.originY:e}},{key:"setInputElement",value:function(t){this.inputElement=t,this.updateDimensions()}},{key:"setPosition",value:function(t,e,i){e=e.toFixed(this.precision)+"px",i=i.toFixed(this.precision)+"px",this.transform3DSupport?n.css(t,"transform","translate3d("+e+","+i+",0)"):this.transform2DSupport?n.css(t,"transform","translate("+e+","+i+")"):(t.style.left=e,t.style.top=i)}},{key:"onOrientationTimer",value:function(){this.orientationSupport&&0===this.orientationStatus?(this.disable(),this.orientationSupport=!1,this.enable()):this.doReadyCallback()}},{key:"onMotionTimer",value:function(){this.motionSupport&&0===this.motionStatus?(this.disable(),this.motionSupport=!1,this.enable()):this.doReadyCallback()}},{key:"onCalibrationTimer",value:function(){this.calibrationFlag=!0}},{key:"onWindowResize",value:function(){this.updateDimensions()}},{key:"onAnimationFrame",value:function(){this.updateBounds();var t=this.inputX-this.calibrationX,e=this.inputY-this.calibrationY;(Math.abs(t)>this.calibrationThreshold||Math.abs(e)>this.calibrationThreshold)&&this.queueCalibration(0),this.portrait?(this.motionX=this.calibrateX?e:this.inputY,this.motionY=this.calibrateY?t:this.inputX):(this.motionX=this.calibrateX?t:this.inputX,this.motionY=this.calibrateY?e:this.inputY),this.motionX*=this.elementWidth*(this.scalarX/100),this.motionY*=this.elementHeight*(this.scalarY/100),isNaN(parseFloat(this.limitX))||(this.motionX=n.clamp(this.motionX,-this.limitX,this.limitX)),isNaN(parseFloat(this.limitY))||(this.motionY=n.clamp(this.motionY,-this.limitY,this.limitY)),this.velocityX+=(this.motionX-this.velocityX)*this.frictionX,this.velocityY+=(this.motionY-this.velocityY)*this.frictionY;for(var i=0;i<this.layers.length;i++)this.setPosition(this.layers[i],this.velocityX*(this.depthsX[i]*(this.invertX?-1:1)),this.velocityY*(this.depthsY[i]*(this.invertY?-1:1)));this.raf=h(this.onAnimationFrame)}},{key:"rotate",value:function(t,e){var i=(t||0)/30,s=(e||0)/30,l=this.windowHeight>this.windowWidth;this.portrait!==l&&(this.portrait=l,this.calibrationFlag=!0),this.calibrationFlag&&(this.calibrationFlag=!1,this.calibrationX=i,this.calibrationY=s),this.inputX=i,this.inputY=s}},{key:"onDeviceOrientation",value:function(t){var e=t.beta,i=t.gamma;null!==e&&null!==i&&(this.orientationStatus=1,this.rotate(e,i))}},{key:"onDeviceMotion",value:function(t){var e=t.rotationRate.beta,i=t.rotationRate.gamma;null!==e&&null!==i&&(this.motionStatus=1,this.rotate(e,i))}},{key:"onMouseMove",value:function(t){var e=t.clientX,i=t.clientY;if(this.hoverOnly&&(e<this.elementPositionX||e>this.elementPositionX+this.elementWidth||i<this.elementPositionY||i>this.elementPositionY+this.elementHeight))return this.inputX=0,void(this.inputY=0);this.relativeInput?(this.clipRelativeInput&&(e=Math.max(e,this.elementPositionX),e=Math.min(e,this.elementPositionX+this.elementWidth),i=Math.max(i,this.elementPositionY),i=Math.min(i,this.elementPositionY+this.elementHeight)),this.elementRangeX&&this.elementRangeY&&(this.inputX=(e-this.elementPositionX-this.elementCenterX)/this.elementRangeX,this.inputY=(i-this.elementPositionY-this.elementCenterY)/this.elementRangeY)):this.windowRadiusX&&this.windowRadiusY&&(this.inputX=(e-this.windowCenterX)/this.windowRadiusX,this.inputY=(i-this.windowCenterY)/this.windowRadiusY)}},{key:"destroy",value:function(){this.disable(),clearTimeout(this.calibrationTimer),clearTimeout(this.detectionTimer),this.element.removeAttribute("style");for(var t=0;t<this.layers.length;t++)this.layers[t].removeAttribute("style");delete this.element,delete this.layers}},{key:"version",value:function(){return"3.1.0"}}]),o}();d.exports=a},{"object-assign":1,raf:4}]},{},[5])(5)});