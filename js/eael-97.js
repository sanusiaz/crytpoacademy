!function(){"use strict";function e(t){if(!t)throw new Error("No options passed to Waypoint constructor");if(!t.element)throw new Error("No element option passed to Waypoint constructor");if(!t.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+i,this.options=e.Adapter.extend({},e.defaults,t),this.element=this.options.element,this.adapter=new e.Adapter(this.element),this.callback=t.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=e.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=e.Context.findOrCreateByElement(this.options.context),e.offsetAliases[this.options.offset]&&(this.options.offset=e.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),r[this.key]=this,i+=1}var i=0,r={};e.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},e.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},e.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete r[this.key]},e.prototype.disable=function(){return this.enabled=!1,this},e.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},e.prototype.next=function(){return this.group.next(this)},e.prototype.previous=function(){return this.group.previous(this)},e.invokeAll=function(t){var e=[];for(var i in r)e.push(r[i]);for(var o=0,n=e.length;o<n;o++)e[o][t]()},e.destroyAll=function(){e.invokeAll("destroy")},e.disableAll=function(){e.invokeAll("disable")},e.enableAll=function(){for(var t in e.Context.refreshAll(),r)r[t].enabled=!0;return this},e.refreshAll=function(){e.Context.refreshAll()},e.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},e.viewportWidth=function(){return document.documentElement.clientWidth},e.adapters=[],e.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},e.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=e}(),function(){"use strict";function e(t){window.setTimeout(t,1e3/60)}function i(t){this.element=t,this.Adapter=y.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+o,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,n[t.waypointContextKey]=this,o+=1,y.windowContext||(y.windowContext=!0,y.windowContext=new i(window)),this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var o=0,n={},y=window.Waypoint,t=window.onload;i.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},i.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical),i=this.element==this.element.window;t&&e&&!i&&(this.adapter.off(".waypoints"),delete n[this.key])},i.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,y.requestAnimationFrame(t))})},i.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){e.didScroll&&!y.isTouch||(e.didScroll=!0,y.requestAnimationFrame(t))})},i.prototype.handleResize=function(){y.Context.refreshAll()},i.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll?o.forward:o.backward;for(var r in this.waypoints[i]){var s=this.waypoints[i][r];if(null!==s.triggerPoint){var a=o.oldScroll<s.triggerPoint,l=o.newScroll>=s.triggerPoint;(a&&l||!a&&!l)&&(s.queueTrigger(n),t[s.group.id]=s.group)}}}for(var h in t)t[h].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},i.prototype.innerHeight=function(){return this.element==this.element.window?y.viewportHeight():this.adapter.innerHeight()},i.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},i.prototype.innerWidth=function(){return this.element==this.element.window?y.viewportWidth():this.adapter.innerWidth()},i.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;o<n;o++)t[o].destroy()},i.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),o={};for(var n in this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}}){var r=t[n];for(var s in this.waypoints[n]){var a,l,h,p,c=this.waypoints[n][s],u=c.options.offset,d=c.triggerPoint,f=0,w=null==d;c.element!==c.element.window&&(f=c.adapter.offset()[r.offsetProp]),"function"==typeof u?u=u.apply(c):"string"==typeof u&&(u=parseFloat(u),-1<c.options.offset.indexOf("%")&&(u=Math.ceil(r.contextDimension*u/100))),a=r.contextScroll-r.contextOffset,c.triggerPoint=Math.floor(f+a-u),l=d<r.oldScroll,h=c.triggerPoint>=r.oldScroll,p=!l&&!h,!w&&(l&&h)?(c.queueTrigger(r.backward),o[c.group.id]=c.group):(!w&&p||w&&r.oldScroll>=c.triggerPoint)&&(c.queueTrigger(r.forward),o[c.group.id]=c.group)}}return y.requestAnimationFrame(function(){for(var t in o)o[t].flushTriggers()}),this},i.findOrCreateByElement=function(t){return i.findByElement(t)||new i(t)},i.refreshAll=function(){for(var t in n)n[t].refresh()},i.findByElement=function(t){return n[t.waypointContextKey]},window.onload=function(){t&&t(),i.refreshAll()},y.requestAnimationFrame=function(t){(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||e).call(window,t)},y.Context=i}(),function(){"use strict";function s(t,e){return t.triggerPoint-e.triggerPoint}function a(t,e){return e.triggerPoint-t.triggerPoint}function e(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),i[this.axis][this.name]=this}var i={vertical:{},horizontal:{}},o=window.Waypoint;e.prototype.add=function(t){this.waypoints.push(t)},e.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},e.prototype.flushTriggers=function(){for(var t in this.triggerQueues){var e=this.triggerQueues[t],i="up"===t||"left"===t;e.sort(i?a:s);for(var o=0,n=e.length;o<n;o+=1){var r=e[o];!r.options.continuous&&o!==e.length-1||r.trigger([t])}}this.clearTriggerQueues()},e.prototype.next=function(t){this.waypoints.sort(s);var e=o.Adapter.inArray(t,this.waypoints);return e===this.waypoints.length-1?null:this.waypoints[e+1]},e.prototype.previous=function(t){this.waypoints.sort(s);var e=o.Adapter.inArray(t,this.waypoints);return e?this.waypoints[e-1]:null},e.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},e.prototype.remove=function(t){var e=o.Adapter.inArray(t,this.waypoints);-1<e&&this.waypoints.splice(e,1)},e.prototype.first=function(){return this.waypoints[0]},e.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},e.findOrCreate=function(t){return i[t.axis][t.name]||new e(t)},o.Group=e}(),function(){"use strict";function i(t){this.$element=o(t)}var o=window.jQuery,t=window.Waypoint;o.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(t,e){i.prototype[e]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[e].apply(this.$element,t)}}),o.each(["extend","inArray","isEmptyObject"],function(t,e){i[e]=o[e]}),t.adapters.push({name:"jquery",Adapter:i}),t.Adapter=i}(),function(){"use strict";function t(o){return function(){var e=[],i=arguments[0];return o.isFunction(arguments[0])&&((i=o.extend({},arguments[1])).handler=arguments[0]),this.each(function(){var t=o.extend({},i,{element:this});"string"==typeof t.context&&(t.context=o(this).closest(t.context)[0]),e.push(new n(t))}),e}}var n=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();(function(){var u,t,s,d,F,o,l,h,i,p,n,e,c,A,r,a,m,f,g,v=[].slice;function w(t){var e,n,i,o,r,s,a,u,d,l=this;if(this.options=t,this.el=this.options.el,null!=this.el.odometer)return this.el.odometer;for(e in this.el.odometer=this,a=w.options)i=a[e],null==this.options[e]&&(this.options[e]=i);null==(o=this.options).duration&&(o.duration=2e3),this.MAX_VALUES=this.options.duration/(1e3/30)/2|0,this.resetFormat(),this.value=this.cleanValue(null!=(u=this.options.value)?u:""),this.renderInside(),this.render();try{for(r=0,s=(d=["innerHTML","innerText","textContent"]).length;r<s;r++)n=d[r],null!=this.el[n]&&function(e){Object.defineProperty(l.el,e,{get:function(){var t;return"innerHTML"===e?l.inside.outerHTML:null!=(t=l.inside.innerText)?t:l.inside.textContent},set:function(t){return l.update(t)}})}(n)}catch(t){this.watchForMutations()}}u=/^\(?([^)]*)\)?(?:(.)(d+))?$/,e=document.createElement("div").style,d=null!=e.transition||null!=e.webkitTransition||null!=e.mozTransition||null!=e.oTransition,p=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,t=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,o=function(t){var e;return(e=document.createElement("div")).innerHTML=t,e.children[0]},i=function(t,e){return t.className=t.className.replace(new RegExp("(^| )"+e.split(" ").join("|")+"( |$)","gi")," ")},F=function(t,e){return i(t,e),t.className+=" "+e},c=function(t,e){var n;return null!=document.createEvent?((n=document.createEvent("HTMLEvents")).initEvent(e,!0,!0),t.dispatchEvent(n)):void 0},h=function(){var t,e;return null!=(t=null!=(e=window.performance)&&"function"==typeof e.now?e.now():void 0)?t:+new Date},n=function(t,e){return null==e&&(e=0),e?(t*=Math.pow(10,e),t+=.5,t=Math.floor(t),t/=Math.pow(10,e)):Math.round(t)},A=function(t){return t<0?Math.ceil(t):Math.floor(t)},a=!(l=function(t){return t-n(t)}),(r=function(){var t,e,n,i,o;if(!a&&null!=window.jQuery){for(a=!0,o=[],e=0,n=(i=["html","text"]).length;e<n;e++)t=i[e],o.push(function(){var n;return n=window.jQuery.fn[t],window.jQuery.fn[t]=function(t){var e;return null==t||null==(null!=(e=this[0])?e.odometer:void 0)?n.apply(this,arguments):this[0].odometer.update(t)}}());return o}})(),setTimeout(r,0),w.prototype.renderInside=function(){return this.inside=document.createElement("div"),this.inside.className="odometer-inside",this.el.innerHTML="",this.el.appendChild(this.inside)},w.prototype.watchForMutations=function(){var n=this;if(null!=t)try{return null==this.observer&&(this.observer=new t(function(t){var e;return e=n.el.innerText,n.renderInside(),n.render(n.value),n.update(e)})),this.watchMutations=!0,this.startWatchingMutations()}catch(t){}},w.prototype.startWatchingMutations=function(){return this.watchMutations?this.observer.observe(this.el,{childList:!0}):void 0},w.prototype.stopWatchingMutations=function(){var t;return null!=(t=this.observer)?t.disconnect():void 0},w.prototype.cleanValue=function(t){var e;return"string"==typeof t&&(t=(t=(t=t.replace(null!=(e=this.format.radix)?e:".","<radix>")).replace(/[.,]/g,"")).replace("<radix>","."),t=parseFloat(t,10)||0),n(t,this.format.precision)},w.prototype.bindTransitionEnd=function(){var t,e,n,i,o,r,s=this;if(!this.transitionEndBound){for(this.transitionEndBound=!0,e=!1,r=[],n=0,i=(o="transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd".split(" ")).length;n<i;n++)t=o[n],r.push(this.el.addEventListener(t,function(){return e||(e=!0,setTimeout(function(){return s.render(),e=!1,c(s.el,"odometerdone")},0)),!0},!1));return r}},w.prototype.resetFormat=function(){var t,e,n,i,o,r,s,a;if(t=(t=null!=(s=this.options.format)?s:"(,ddd).dd")||"d",!(n=u.exec(t)))throw new Error("Odometer: Unparsable digit format");return r=(a=n.slice(1,4))[0],o=a[1],i=(null!=(e=a[2])?e.length:void 0)||0,this.format={repeating:r,radix:o,precision:i}},w.prototype.render=function(t){var e,n,i,o,r,s,a;for(null==t&&(t=this.value),this.stopWatchingMutations(),this.resetFormat(),this.inside.innerHTML="",r=this.options.theme,o=[],s=0,a=(e=this.el.className.split(" ")).length;s<a;s++)(n=e[s]).length&&((i=/^odometer-theme-(.+)$/.exec(n))?r=i[1]:/^odometer(-|$)/.test(n)||o.push(n));return o.push("odometer"),d||o.push("odometer-no-transitions"),r?o.push("odometer-theme-"+r):o.push("odometer-auto-theme"),this.el.className=o.join(" "),this.ribbons={},this.formatDigits(t),this.startWatchingMutations()},w.prototype.formatDigits=function(t){var e,n,i,o,r,s,a,u,d;if(this.digits=[],this.options.formatFunction)for(o=0,s=(u=this.options.formatFunction(t).split("").reverse()).length;o<s;o++)(n=u[o]).match(/0-9/)?((e=this.renderDigit()).querySelector(".odometer-value").innerHTML=n,this.digits.push(e),this.insertDigit(e)):this.addSpacer(n);else for(i=!this.format.precision||!l(t)||!1,r=0,a=(d=t.toString().split("").reverse()).length;r<a;r++)"."===(e=d[r])&&(i=!0),this.addDigit(e,i)},w.prototype.update=function(t){var e,n=this;return(e=(t=this.cleanValue(t))-this.value)?(i(this.el,"odometer-animating-up odometer-animating-down odometer-animating"),F(this.el,0<e?"odometer-animating-up":"odometer-animating-down"),this.stopWatchingMutations(),this.animate(t),this.startWatchingMutations(),setTimeout(function(){return n.el.offsetHeight,F(n.el,"odometer-animating")},0),this.value=t):void 0},w.prototype.renderDigit=function(){return o('<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner"><span class="odometer-ribbon"><span class="odometer-ribbon-inner"><span class="odometer-value"></span></span></span></span></span>')},w.prototype.insertDigit=function(t,e){return null!=e?this.inside.insertBefore(t,e):this.inside.children.length?this.inside.insertBefore(t,this.inside.children[0]):this.inside.appendChild(t)},w.prototype.addSpacer=function(t,e,n){var i;return(i=o('<span class="odometer-formatting-mark"></span>')).innerHTML=t,n&&F(i,n),this.insertDigit(i,e)},w.prototype.addDigit=function(t,e){var n,i,o,r;if(null==e&&(e=!0),"-"===t)return this.addSpacer(t,null,"odometer-negation-mark");if("."===t)return this.addSpacer(null!=(r=this.format.radix)?r:".",null,"odometer-radix-mark");if(e)for(o=!1;;){if(!this.format.repeating.length){if(o)throw new Error("Bad odometer format without digits");this.resetFormat(),o=!0}if(n=this.format.repeating[this.format.repeating.length-1],this.format.repeating=this.format.repeating.substring(0,this.format.repeating.length-1),"d"===n)break;this.addSpacer(n)}return(i=this.renderDigit()).querySelector(".odometer-value").innerHTML=t,this.digits.push(i),this.insertDigit(i)},w.prototype.animate=function(t){return d&&"count"!==this.options.animation?this.animateSlide(t):this.animateCount(t)},w.prototype.animateCount=function(n){var i,o,r,s,a,u=this;if(o=n-this.value)return s=r=h(),i=this.value,(a=function(){var t,e;return h()-s>u.options.duration?(u.value=n,u.render(),void c(u.el,"odometerdone")):(50<(t=h()-r)&&(r=h(),e=t/u.options.duration,i+=o*e,u.render(Math.round(i))),null!=p?p(a):setTimeout(a,50))})()},w.prototype.getDigitCount=function(){var t,e,n,i,o,r;for(t=o=0,r=(i=1<=arguments.length?v.call(arguments,0):[]).length;o<r;t=++o)n=i[t],i[t]=Math.abs(n);return e=Math.max.apply(Math,i),Math.ceil(Math.log(e+1)/Math.log(10))},w.prototype.getFractionalDigitCount=function(){var t,e,n,i,o,r,s;for(e=/^\-?\d*\.(\d*?)0*$/,t=r=0,s=(o=1<=arguments.length?v.call(arguments,0):[]).length;r<s;t=++r)i=o[t],o[t]=i.toString(),n=e.exec(o[t]),o[t]=null==n?0:n[1].length;return Math.max.apply(Math,o)},w.prototype.resetDigits=function(){return this.digits=[],this.ribbons=[],this.inside.innerHTML="",this.resetFormat()},w.prototype.animateSlide=function(t){var e,n,i,o,r,s,a,u,d,l,h,p,c,m,f,g,v,w,M,y,b,T,E,x,S,D,L;if(g=this.value,(u=this.getFractionalDigitCount(g,t))&&(t*=Math.pow(10,u),g*=Math.pow(10,u)),i=t-g){for(this.bindTransitionEnd(),o=this.getDigitCount(g,t),r=[],h=M=e=0;0<=o?M<o:o<M;h=0<=o?++M:--M){if(v=A(g/Math.pow(10,o-h-1)),s=(a=A(t/Math.pow(10,o-h-1)))-v,Math.abs(s)>this.MAX_VALUES){for(l=[],p=s/(this.MAX_VALUES+this.MAX_VALUES*e*.5),n=v;0<s&&n<a||s<0&&a<n;)l.push(Math.round(n)),n+=p;l[l.length-1]!==a&&l.push(a),e++}else l=function(){L=[];for(var t=v;v<=a?t<=a:a<=t;v<=a?t++:t--)L.push(t);return L}.apply(this);for(h=y=0,T=l.length;y<T;h=++y)d=l[h],l[h]=Math.abs(d%10);r.push(l)}for(this.resetDigits(),h=b=0,E=(D=r.reverse()).length;b<E;h=++b)for(l=D[h],this.digits[h]||this.addDigit(" ",u<=h),null==(w=this.ribbons)[h]&&(w[h]=this.digits[h].querySelector(".odometer-ribbon-inner")),this.ribbons[h].innerHTML="",i<0&&(l=l.reverse()),c=S=0,x=l.length;S<x;c=++S)d=l[c],(f=document.createElement("div")).className="odometer-value",f.innerHTML=d,this.ribbons[h].appendChild(f),c===l.length-1&&F(f,"odometer-last-value"),0===c&&F(f,"odometer-first-value");return v<0&&this.addDigit("-"),null!=(m=this.inside.querySelector(".odometer-radix-mark"))&&m.parent.removeChild(m),u?this.addSpacer(this.format.radix,this.digits[u-1],"odometer-radix-mark"):void 0}},(s=w).options=null!=(f=window.odometerOptions)?f:{},setTimeout(function(){var t,e,n,i,o;if(window.odometerOptions){for(t in o=[],i=window.odometerOptions)e=i[t],o.push(null!=(n=s.options)[t]?(n=s.options)[t]:n[t]=e);return o}},0),s.init=function(){var t,e,n,i,o,r;if(null!=document.querySelectorAll){for(r=[],n=0,i=(e=document.querySelectorAll(s.options.selector||".odometer")).length;n<i;n++)t=e[n],r.push(t.odometer=new s({el:t,value:null!=(o=t.innerText)?o:t.textContent}));return r}},null!=(null!=(g=document.documentElement)?g.doScroll:void 0)&&null!=document.createEventObject?(m=document.onreadystatechange,document.onreadystatechange=function(){return"complete"===document.readyState&&!1!==s.options.auto&&s.init(),null!=m?m.apply(this,arguments):void 0}):document.addEventListener("DOMContentLoaded",function(){return!1!==s.options.auto?s.init():void 0},!1),"function"==typeof define&&define.amd?define([],function(){return s}):"undefined"!=typeof exports&&null!==exports?module.exports=s:window.Odometer=s}).call(this),jQuery(document).ready(function(t){jQuery(".pa-counter-container").waypoint(function(){jQuery(".pa-counter-value").each(function(){var t=jQuery(this).data("to"),e=jQuery(this).data("speed"),n=new Odometer({el:this,value:0,duration:e});n.render(),setInterval(function(){n.update(t)})})},{offset:"80%",triggerOnce:!0})});!function(e){var n={};function a(l){if(n[l])return n[l].exports;var i=n[l]={i:l,l:!1,exports:{}};return e[l].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=n,a.d=function(e,n,l){a.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:l})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,n){if(1&n&&(e=a(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var l=Object.create(null);if(a.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)a.d(l,i,function(n){return e[n]}.bind(null,i));return l},a.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(n,"a",n),n},a.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},a.p="",a(a.s=25)}({25:function(e,n){var a=function(e,n){var a=n(".eael-simple-menu-container",e).data("hamburger-icon"),l=n(".eael-simple-menu-container",e).data("indicator-icon"),i=n(".eael-simple-menu-container",e).data("dropdown-indicator-icon"),t=n(".eael-simple-menu",e).hasClass("eael-simple-menu-horizontal"),s=n(".eael-simple-menu-container",e).data("hamburger-breakpoints"),r=n(".eael-simple-menu-container",e).data("hamburger-device");void 0!==r&&""!==r&&null!==r||(r="tablet");var o=t?".eael-simple-menu-horizontal":".eael-simple-menu-vertical",m=function(e,n){var a=0;if("none"===n||void 0===n||""===n||null===n)return a;for(var l in e)l==n&&(a=e[l]);return a=a.replace(/[^0-9]/g,"")}(s,r),p=(n(".eael-simple-menu--stretch"),[]);function u(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;if(window.matchMedia("(max-width: "+a+"px)").matches)if(n(".eael-simple-menu-container",e).addClass("eael-simple-menu-hamburger"),n(o,e).addClass("eael-simple-menu-responsive"),n(".eael-simple-menu-toggle-text",e).text(n(".eael-simple-menu-horizontal .current-menu-item a",e).eq(0).text()),n(".eael-simple-menu-container",e).closest(".elementor-widget-eael-simple-menu").removeClass("eael-hamburger--not-responsive").addClass("eael-hamburger--responsive"),n(".eael-simple-menu-container",e).hasClass("eael-simple-menu--stretch")){var l={};n(o,e).parent().hasClass("eael-nav-menu-wrapper")||n(o,e).wrap('<nav class="eael-nav-menu-wrapper"></nav>');var i=n(".eael-simple-menu-container nav",e);c(i),l.width=parseFloat(n(".elementor").width())+"px",l.left=-parseFloat(i.offset().left)+"px",l.position="absolute",i.css(l)}else{var t={};n(o,e).parent().hasClass("eael-nav-menu-wrapper")||n(o,e).wrap('<nav class="eael-nav-menu-wrapper"></nav>');var s=n(".eael-simple-menu-container nav",e);c(s),t.width="",t.left="",t.position="inherit",s.css(t)}else n(".eael-simple-menu-container",e).removeClass("eael-simple-menu-hamburger"),n(o,e).removeClass("eael-simple-menu-responsive"),n(o+", "+o+" ul",e).css("display",""),n(".eael-simple-menu-container nav",e).removeAttr("style"),n(".eael-simple-menu-container",e).closest(".elementor-widget-eael-simple-menu").removeClass("eael-hamburger--responsive").addClass("eael-hamburger--not-responsive")}function c(e){var n={width:"",left:"",position:"inherit"};e.css(n)}n(".eael-simple-menu li a",e).each((function(){var e,a=n(this),l=a.attr("href"),i=l,t=void 0!==i?i.split("#"):[];e=(l=void 0===l?"":l).startsWith("#"),"#"!==l&&t.length>1&&localize.page_permalink===t[0]&&t[1]&&p.push(t[1]),e||localize.page_permalink!==i||a.addClass("eael-item-active")})),n(window).on("load resize scroll",(function(){p.length>0&&n.each(p,(function(a,l){n("#"+l).isInViewport()?n('a[href="'+localize.page_permalink+"#"+l+'"]',e).addClass("eael-menu-"+l+" eael-item-active"):n(".eael-menu-"+l).removeClass("eael-menu-"+l+" eael-item-active")}))})),t&&(n(".eael-simple-menu > li.menu-item-has-children",e).each((function(){n("> a",n(this)).append('<span class="eael-simple-menu-indicator">'+l+"</span>")})),n(".eael-simple-menu > li ul li.menu-item-has-children",e).each((function(){n("> a",n(this)).append('<span class="eael-simple-menu-indicator">'+i+"</span>")}))),n(o,e).before('<span class="eael-simple-menu-toggle-text"></span>').after('<button class="eael-simple-menu-toggle">'+a+'<span class="eael-simple-menu-toggle-text"></span></button>'),u(m),n(".eael-simple-menu-container",e).on("click",".eael-simple-menu-toggle",(function(e){e.preventDefault();var a=n(this).siblings("nav").children(o);"none"==a.css("display")?a.slideDown(300):a.slideUp(300)})),n(window).on("resize load",(function(){u(m)})),n(".eael-simple-menu > li.menu-item-has-children",e).each((function(){n(this).append('<span class="eael-simple-menu-indicator"> '+l+"</span>")})),n(".eael-simple-menu > li ul li.menu-item-has-children",e).each((function(e){n(this).append('<span class="eael-simple-menu-indicator"> '+i+"</span>")})),n(".eael-simple-menu-dropdown-align-left .eael-simple-menu-vertical li.menu-item-has-children").each((function(){var e=parseInt(n("a",n(this)).css("padding-left"));n("ul li a",this).css({"padding-left":e+20+"px"})})),n(".eael-simple-menu-dropdown-align-right .eael-simple-menu-vertical li.menu-item-has-children").each((function(){var e=parseInt(n("a",n(this)).css("padding-right"));n("ul li a",this).css({"padding-right":e+20+"px"})})),n(".eael-simple-menu-container",e).on("click",'.eael-simple-menu-responsive li a:not([href="#"])',(function(e){n(this).parents(o).slideUp(300)})),n(".eael-simple-menu",e).on("click",'a[href="#"]',(function(e){e.preventDefault(),n(this).siblings(".eael-simple-menu-indicator").click()})),n(".eael-simple-menu",e).on("click",".eael-simple-menu-indicator",(function(e){e.preventDefault(),n(this).toggleClass("eael-simple-menu-indicator-open"),n(this).hasClass("eael-simple-menu-indicator-open")?n(this).siblings("ul").slideDown(300):n(this).siblings("ul").slideUp(300),n(".eael-simple-menu-indicator-open").not(n(this).parents(".menu-item-has-children").children("span")).removeClass("eael-simple-menu-indicator-open").siblings("ul").slideUp(300)})),elementorFrontend.isEditMode()&&elementor.channels.editor.on("change",(function(e){e.elementSettingsModel.changed.eael_simple_menu_dropdown&&elementor.saver.update.apply().then((function(){elementor.reloadPreview()}))}))};jQuery(window).on("elementor/frontend/init",(function(){if(ea.elementStatusCheck("eaelSimpleMenu"))return!1;elementorFrontend.hooks.addAction("frontend/element_ready/eael-simple-menu.default",a)}))}});!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=6)}({6:function(e,t){var n=function(e,t){var n=e.find(".eael-counter").eq(0),r=n.data("target");t(n).waypoint((function(){t(r).each((function(){var e=t(this).data("to"),n=t(this).data("speed"),r=new Odometer({el:this,value:0,duration:n});r.render(),setInterval((function(){r.update(e)}))}))}),{offset:"80%",triggerOnce:!0})};jQuery(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/eael-counter.default",n)}))}});