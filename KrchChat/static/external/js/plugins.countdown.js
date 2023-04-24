!function(){var a=!1;window.JQClass=function(){},JQClass.classes={},JQClass.extend=function t(e){var i,n=this.prototype,s=(a=!0,new this);for(i in a=!1,e)s[i]="function"==typeof e[i]&&"function"==typeof n[i]?function(i,s){return function(){var t=this._super,e=(this._super=function(t){return n[i].apply(this,t)},s.apply(this,arguments));return this._super=t,e}}(i,e[i]):e[i];function o(){!a&&this._init&&this._init.apply(this,arguments)}return((o.prototype=s).constructor=o).extend=t,o}}(),!function($){function camelCase(t){return t.replace(/-([a-z])/g,function(t,e){return e.toUpperCase()})}JQClass.classes.JQPlugin=JQClass.extend({name:"plugin",defaultOptions:{},regionalOptions:{},_getters:[],_getMarker:function(){return"is-"+this.name},_init:function(){$.extend(this.defaultOptions,this.regionalOptions&&this.regionalOptions[""]||{});var i=camelCase(this.name);$[i]=this,$.fn[i]=function(t){var e=Array.prototype.slice.call(arguments,1);return $[i]._isNotChained(t,e)?$[i][t].apply($[i],[this[0]].concat(e)):this.each(function(){if("string"==typeof t){if("_"===t[0]||!$[i][t])throw"Unknown method: "+t;$[i][t].apply($[i],[this].concat(e))}else $[i]._attach(this,t)})}},setDefaults:function(t){$.extend(this.defaultOptions,t||{})},_isNotChained:function(t,e){return"option"===t&&(0===e.length||1===e.length&&"string"==typeof e[0])||-1<$.inArray(t,this._getters)},_attach:function(t,e){var i;(t=$(t)).hasClass(this._getMarker())||(t.addClass(this._getMarker()),e=$.extend({},this.defaultOptions,this._getMetadata(t),e||{}),i=$.extend({name:this.name,elem:t,options:e},this._instSettings(t,e)),t.data(this.name,i),this._postAttach(t,i),this.option(t,e))},_instSettings:function(t,e){return{}},_postAttach:function(t,e){},_getMetadata:function(d){try{var f=d.data(this.name.toLowerCase())||"",g,f=f.replace(/'/g,'"');for(g in f=f.replace(/([a-zA-Z0-9]+):/g,function(t,e,i){i=f.substring(0,i).match(/"/g);return i&&i.length%2!=0?e+":":'"'+e+'":'}),f=$.parseJSON("{"+f+"}"),f){var h=f[g];"string"==typeof h&&h.match(/^new Date\((.*)\)$/)&&(f[g]=eval(h))}return f}catch(e){return{}}},_getInst:function(t){return $(t).data(this.name)||{}},option:function(t,e,i){var s,n=(t=$(t)).data(this.name);if(!e||"string"==typeof e&&null==i)return(s=(n||{}).options)&&e?s[e]:s;t.hasClass(this._getMarker())&&(s=e||{},"string"==typeof e&&((s={})[e]=i),this._optionsChanged(t,n,s),$.extend(n.options,s))},_optionsChanged:function(t,e,i){},destroy:function(t){(t=$(t)).hasClass(this._getMarker())&&(this._preDestroy(t,this._getInst(t)),t.removeData(this.name).removeClass(this._getMarker()))},_preDestroy:function(t,e){}}),$.JQPlugin={createPlugin:function(t,e){"object"==typeof t&&(e=t,t="JQPlugin"),t=camelCase(t);var i=camelCase(e.name);JQClass.classes[i]=JQClass.classes[t].extend(e),new JQClass.classes[i]}}}(jQuery),!function(h){"use strict";var t="countdown";h.JQPlugin.createPlugin({name:t,defaultOptions:{until:null,since:null,timezone:null,serverSync:null,format:"dHMS",layout:"",compact:!1,padZeroes:!1,significant:0,description:"",expiryUrl:"",expiryText:"",alwaysExpire:!1,onExpiry:null,onTick:null,tickInterval:1},regionalOptions:{"":{labels:["Years","Months","Weeks","Days","Hours","Minutes","Seconds"],labels1:["Year","Month","Week","Day","Hour","Minute","Second"],compactLabels:["y","m","w","d"],whichLabels:null,digits:["0","1","2","3","4","5","6","7","8","9"],timeSeparator:":",isRTL:!1}},_rtlClass:t+"-rtl",_sectionClass:t+"-section",_amountClass:t+"-amount",_periodClass:t+"-period",_rowClass:t+"-row",_holdingClass:t+"-holding",_showClass:t+"-show",_descrClass:t+"-descr",_timerElems:[],_init:function(){var i=this,s=(this._super(),this._serverSyncs=[],"function"==typeof Date.now?Date.now:function(){return(new Date).getTime()}),n=window.performance&&"function"==typeof window.performance.now,o=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||null,a=0;!o||h.noRequestAnimationFrame?(h.noRequestAnimationFrame=null,h.countdown._timer=setInterval(function(){i._updateElems()},1e3)):(a=window.animationStartTime||window.webkitAnimationStartTime||window.mozAnimationStartTime||window.oAnimationStartTime||window.msAnimationStartTime||s(),o(function t(e){e=e<1e12?n?window.performance.now()+window.performance.timing.navigationStart:s():e||s();1e3<=e-a&&(i._updateElems(),a=e),o(t)}))},UTCDate:function(t,e,i,s,n,o,a,r){"object"==typeof e&&e instanceof Date&&(r=e.getMilliseconds(),a=e.getSeconds(),o=e.getMinutes(),n=e.getHours(),s=e.getDate(),i=e.getMonth(),e=e.getFullYear());var l=new Date;return l.setUTCFullYear(e),l.setUTCDate(1),l.setUTCMonth(i||0),l.setUTCDate(s||1),l.setUTCHours(n||0),l.setUTCMinutes((o||0)-(Math.abs(t)<30?60*t:t)),l.setUTCSeconds(a||0),l.setUTCMilliseconds(r||0),l},periodsToSeconds:function(t){return 31557600*t[0]+2629800*t[1]+604800*t[2]+86400*t[3]+3600*t[4]+60*t[5]+t[6]},resync:function(){var n=this;h("."+this._getMarker()).each(function(){var t=h.data(this,n.name);if(t.options.serverSync){for(var e,i=null,s=0;s<n._serverSyncs.length;s++)if(n._serverSyncs[s][0]===t.options.serverSync){i=n._serverSyncs[s];break}n._eqNull(i[2])&&(e=h.isFunction(t.options.serverSync)?t.options.serverSync.apply(this,[]):null,i[2]=(e?(new Date).getTime()-e.getTime():0)-i[1]),t._since&&t._since.setMilliseconds(t._since.getMilliseconds()+i[2]),t._until.setMilliseconds(t._until.getMilliseconds()+i[2])}});for(var t=0;t<n._serverSyncs.length;t++)n._eqNull(n._serverSyncs[t][2])||(n._serverSyncs[t][1]+=n._serverSyncs[t][2],delete n._serverSyncs[t][2])},_instSettings:function(t,e){return{_periods:[0,0,0,0,0,0,0]}},_addElem:function(t){this._hasElem(t)||this._timerElems.push(t)},_hasElem:function(t){return-1<h.inArray(t,this._timerElems)},_removeElem:function(e){this._timerElems=h.map(this._timerElems,function(t){return t===e?null:t})},_updateElems:function(){for(var t=this._timerElems.length-1;0<=t;t--)this._updateCountdown(this._timerElems[t])},_optionsChanged:function(t,e,i){i.layout&&(i.layout=i.layout.replace(/&lt;/g,"<").replace(/&gt;/g,">")),this._resetExtraLabels(e.options,i);var s=e.options.timezone!==i.timezone,i=(h.extend(e.options,i),this._adjustSettings(t,e,!this._eqNull(i.until)||!this._eqNull(i.since)||s),new Date);(e._since&&e._since<i||e._until&&e._until>i)&&this._addElem(t[0]),this._updateCountdown(t,e)},_updateCountdown:function(t,e){var i;t=t.jquery?t:h(t),(e=e||this._getInst(t))&&(t.html(this._generateHTML(e)).toggleClass(this._rtlClass,e.options.isRTL),"pause"!==e._hold&&h.isFunction(e.options.onTick)&&(i="lap"!==e._hold?e._periods:this._calculatePeriods(e,e._show,e.options.significant,new Date),1!==e.options.tickInterval&&this.periodsToSeconds(i)%e.options.tickInterval!=0||e.options.onTick.apply(t[0],[i])),"pause"!==e._hold&&(e._since?e._now.getTime()<e._since.getTime():e._now.getTime()>=e._until.getTime())&&!e._expiring?(e._expiring=!0,(this._hasElem(t[0])||e.options.alwaysExpire)&&(this._removeElem(t[0]),h.isFunction(e.options.onExpiry)&&e.options.onExpiry.apply(t[0],[]),e.options.expiryText&&(i=e.options.layout,e.options.layout=e.options.expiryText,this._updateCountdown(t[0],e),e.options.layout=i),e.options.expiryUrl)&&(window.location=e.options.expiryUrl),e._expiring=!1):"pause"===e._hold&&this._removeElem(t[0]))},_resetExtraLabels:function(t,e){var i=null;for(i in e)i.match(/[Ll]abels[02-9]|compactLabels1/)&&(t[i]=e[i]);for(i in t)i.match(/[Ll]abels[02-9]|compactLabels1/)&&void 0===e[i]&&(t[i]=null)},_eqNull:function(t){return null==t},_adjustSettings:function(t,e,i){for(var s=null,n=0;n<this._serverSyncs.length;n++)if(this._serverSyncs[n][0]===e.options.serverSync){s=this._serverSyncs[n][1];break}var o=null,a=null,t=(this._eqNull(s)?(t=h.isFunction(e.options.serverSync)?e.options.serverSync.apply(t[0],[]):null,o=new Date,a=t?o.getTime()-t.getTime():0,this._serverSyncs.push([e.options.serverSync,a])):(o=new Date,a=e.options.serverSync?s:0),e.options.timezone),t=this._eqNull(t)?-o.getTimezoneOffset():t;(i||!i&&this._eqNull(e._until)&&this._eqNull(e._since))&&(e._since=e.options.since,this._eqNull(e._since)||(e._since=this.UTCDate(t,this._determineTime(e._since,null)),e._since&&a&&e._since.setMilliseconds(e._since.getMilliseconds()+a)),e._until=this.UTCDate(t,this._determineTime(e.options.until,o)),a)&&e._until.setMilliseconds(e._until.getMilliseconds()+a),e._show=this._determineShow(e)},_preDestroy:function(t,e){this._removeElem(t[0]),t.empty()},pause:function(t){this._hold(t,"pause")},lap:function(t){this._hold(t,"lap")},resume:function(t){this._hold(t,null)},toggle:function(t){this[(h.data(t,this.name)||{})._hold?"resume":"pause"](t)},toggleLap:function(t){this[(h.data(t,this.name)||{})._hold?"resume":"lap"](t)},_hold:function(t,e){var i,s=h.data(t,this.name);s&&("pause"!==s._hold||e||(s._periods=s._savePeriods,i=s._since?"-":"+",s[s._since?"_since":"_until"]=this._determineTime(i+s._periods[0]+"y"+i+s._periods[1]+"o"+i+s._periods[2]+"w"+i+s._periods[3]+"d"+i+s._periods[4]+"h"+i+s._periods[5]+"m"+i+s._periods[6]+"s"),this._addElem(t)),s._hold=e,s._savePeriods="pause"===e?s._periods:null,h.data(t,this.name,s),this._updateCountdown(t,s))},getTimes:function(t){t=h.data(t,this.name);return t?"pause"===t._hold?t._savePeriods:t._hold?this._calculatePeriods(t,t._show,t.options.significant,new Date):t._periods:null},_determineTime:function(t,e){var i,p=this,e=this._eqNull(t)?e:"string"==typeof t?function(t){t=t.toLowerCase();for(var e=new Date,i=e.getFullYear(),s=e.getMonth(),n=e.getDate(),o=e.getHours(),a=e.getMinutes(),r=e.getSeconds(),l=/([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g,_=l.exec(t);_;){switch(_[2]||"s"){case"s":r+=parseInt(_[1],10);break;case"m":a+=parseInt(_[1],10);break;case"h":o+=parseInt(_[1],10);break;case"d":n+=parseInt(_[1],10);break;case"w":n+=7*parseInt(_[1],10);break;case"o":s+=parseInt(_[1],10),n=Math.min(n,p._getDaysInMonth(i,s));break;case"y":i+=parseInt(_[1],10),n=Math.min(n,p._getDaysInMonth(i,s))}_=l.exec(t)}return new Date(i,s,n,o,a,r,0)}(t):"number"==typeof t?(e=t,(i=new Date).setTime(i.getTime()+1e3*e),i):t;return e&&e.setMilliseconds(0),e},_getDaysInMonth:function(t,e){return 32-new Date(t,e,32).getDate()},_normalLabels:function(t){return t},_generateHTML:function(i){for(var s=this,t=(i._periods=i._hold?i._periods:this._calculatePeriods(i,i._show,i.options.significant,new Date),!1),e=0,n=i.options.significant,o=h.extend({},i._show),a=null,a=0;a<=6;a++)t=t||"?"===i._show[a]&&0<i._periods[a],o[a]="?"!==i._show[a]||t?i._show[a]:null,e+=o[a]?1:0,n-=0<i._periods[a]?1:0;var r=[!1,!1,!1,!1,!1,!1,!1];for(a=6;0<=a;a--)i._show[a]&&(i._periods[a]?r[a]=!0:(r[a]=0<n,n--));function l(t){var e=i.options["compactLabels"+c(i._periods[t])];return o[t]?s._translateDigits(i,i._periods[t])+(e||p)[t]+" ":""}function _(t){var e=i.options["labels"+c(i._periods[t])];return!i.options.significant&&o[t]||i.options.significant&&r[t]?'<span class="'+s._sectionClass+'"><span class="'+s._amountClass+'">'+s._minDigits(i,i._periods[t],u)+'</span><span class="'+s._periodClass+'">'+(e||p)[t]+"</span></span>":""}var p=i.options.compact?i.options.compactLabels:i.options.labels,c=i.options.whichLabels||this._normalLabels,u=i.options.padZeroes?2:1;return i.options.layout?this._buildLayout(i,o,i.options.layout,i.options.compact,i.options.significant,r):(i.options.compact?'<span class="'+this._rowClass+" "+this._amountClass+(i._hold?" "+this._holdingClass:"")+'">'+l(0)+l(1)+l(2)+l(3)+(o[4]?this._minDigits(i,i._periods[4],2):"")+(o[5]?(o[4]?i.options.timeSeparator:"")+this._minDigits(i,i._periods[5],2):"")+(o[6]?(o[4]||o[5]?i.options.timeSeparator:"")+this._minDigits(i,i._periods[6],2):""):'<span class="'+this._rowClass+" "+this._showClass+(i.options.significant||e)+(i._hold?" "+this._holdingClass:"")+'">'+_(0)+_(1)+_(2)+_(3)+_(4)+_(5)+_(6))+"</span>"+(i.options.description?'<span class="'+this._rowClass+" "+this._descrClass+'">'+i.options.description+"</span>":"")},_buildLayout:function(i,t,e,s,n,o){for(var a=i.options[s?"compactLabels":"labels"],r=i.options.whichLabels||this._normalLabels,l=function(t){return(i.options[(s?"compactLabels":"labels")+r(i._periods[t])]||a)[t]},_=function(t,e){return i.options.digits[Math.floor(t/e)%10]},l={desc:i.options.description,sep:i.options.timeSeparator,yl:l(0),yn:this._minDigits(i,i._periods[0],1),ynn:this._minDigits(i,i._periods[0],2),ynnn:this._minDigits(i,i._periods[0],3),y1:_(i._periods[0],1),y10:_(i._periods[0],10),y100:_(i._periods[0],100),y1000:_(i._periods[0],1e3),ol:l(1),on:this._minDigits(i,i._periods[1],1),onn:this._minDigits(i,i._periods[1],2),onnn:this._minDigits(i,i._periods[1],3),o1:_(i._periods[1],1),o10:_(i._periods[1],10),o100:_(i._periods[1],100),o1000:_(i._periods[1],1e3),wl:l(2),wn:this._minDigits(i,i._periods[2],1),wnn:this._minDigits(i,i._periods[2],2),wnnn:this._minDigits(i,i._periods[2],3),w1:_(i._periods[2],1),w10:_(i._periods[2],10),w100:_(i._periods[2],100),w1000:_(i._periods[2],1e3),dl:l(3),dn:this._minDigits(i,i._periods[3],1),dnn:this._minDigits(i,i._periods[3],2),dnnn:this._minDigits(i,i._periods[3],3),d1:_(i._periods[3],1),d10:_(i._periods[3],10),d100:_(i._periods[3],100),d1000:_(i._periods[3],1e3),hl:l(4),hn:this._minDigits(i,i._periods[4],1),hnn:this._minDigits(i,i._periods[4],2),hnnn:this._minDigits(i,i._periods[4],3),h1:_(i._periods[4],1),h10:_(i._periods[4],10),h100:_(i._periods[4],100),h1000:_(i._periods[4],1e3),ml:l(5),mn:this._minDigits(i,i._periods[5],1),mnn:this._minDigits(i,i._periods[5],2),mnnn:this._minDigits(i,i._periods[5],3),m1:_(i._periods[5],1),m10:_(i._periods[5],10),m100:_(i._periods[5],100),m1000:_(i._periods[5],1e3),sl:l(6),sn:this._minDigits(i,i._periods[6],1),snn:this._minDigits(i,i._periods[6],2),snnn:this._minDigits(i,i._periods[6],3),s1:_(i._periods[6],1),s10:_(i._periods[6],10),s100:_(i._periods[6],100),s1000:_(i._periods[6],1e3)},p=e,c=0;c<=6;c++)var u="yowdhms".charAt(c),u=new RegExp("\\{"+u+"<\\}([\\s\\S]*)\\{"+u+">\\}","g"),p=p.replace(u,!n&&t[c]||n&&o[c]?"$1":"");return h.each(l,function(t,e){t=new RegExp("\\{"+t+"\\}","g");p=p.replace(t,e)}),p},_minDigits:function(t,e,i){return(e=""+e).length>=i?this._translateDigits(t,e):this._translateDigits(t,(e="0000000000"+e).substr(e.length-i))},_translateDigits:function(e,t){return(""+t).replace(/[0-9]/g,function(t){return e.options.digits[t]})},_determineShow:function(t){var t=t.options.format,e=[];return e[0]=t.match("y")?"?":t.match("Y")?"!":null,e[1]=t.match("o")?"?":t.match("O")?"!":null,e[2]=t.match("w")?"?":t.match("W")?"!":null,e[3]=t.match("d")?"?":t.match("D")?"!":null,e[4]=t.match("h")?"?":t.match("H")?"!":null,e[5]=t.match("m")?"?":t.match("M")?"!":null,e[6]=t.match("s")?"?":t.match("S")?"!":null,e},_calculatePeriods:function(t,i,e,s){t._now=s,t._now.setMilliseconds(0);function n(t,e){_[t]=i[t]?Math.floor(p/e):0,p-=_[t]*e}var o,a,r,l=new Date(t._now.getTime()),_=(t._since?s.getTime()<t._since.getTime()?t._now=s=l:s=t._since:(l.setTime(t._until.getTime()),s.getTime()>t._until.getTime()&&(t._now=s=l)),[0,0,0,0,0,0,0]),p=((i[0]||i[1])&&(o=this._getDaysInMonth(s.getFullYear(),s.getMonth()),r=this._getDaysInMonth(l.getFullYear(),l.getMonth()),r=l.getDate()===s.getDate()||l.getDate()>=Math.min(o,r)&&s.getDate()>=Math.min(o,r),a=function(t){return 60*(60*t.getHours()+t.getMinutes())+t.getSeconds()},r=Math.max(0,12*(l.getFullYear()-s.getFullYear())+l.getMonth()-s.getMonth()+(l.getDate()<s.getDate()&&!r||r&&a(l)<a(s)?-1:0)),_[0]=i[0]?Math.floor(r/12):0,_[1]=i[1]?r-12*_[0]:0,a=(s=new Date(s.getTime())).getDate()===o,r=this._getDaysInMonth(s.getFullYear()+_[0],s.getMonth()+_[1]),s.getDate()>r&&s.setDate(r),s.setFullYear(s.getFullYear()+_[0]),s.setMonth(s.getMonth()+_[1]),a)&&s.setDate(r),Math.floor((l.getTime()-s.getTime())/1e3)),c=null;if(n(2,604800),n(3,86400),n(4,3600),n(5,60),n(6,1),0<p&&!t._since)for(var u=[1,12,4.3482,7,24,60,60],h=6,d=1,c=6;0<=c;c--)i[c]&&(_[h]>=d&&(_[h]=0,p=1),0<p)&&(_[c]++,p=0,h=c,d=1),d*=u[c];if(e)for(c=0;c<=6;c++)e&&_[c]?e--:e||(_[c]=0);return _}})}(jQuery);