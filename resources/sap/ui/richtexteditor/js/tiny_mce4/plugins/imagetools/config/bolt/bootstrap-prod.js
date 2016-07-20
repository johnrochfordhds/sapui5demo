(function(b){var e=b.ephox=b.ephox||{};var c=e.bolt=e.bolt||{};var g=function(d,f){return f.apply(null,d);};var h=c.kernel=c.kernel||{};h.api=h.api||{};h.async=h.api||{};h.fp=h.fp||{};h.modulator=h.modulator||{};h.module=h.module||{};h.fp.array=g([],function(){var d=function(a,f){if(a.length!==f.length)return false;for(var i=0;i<a.length;++i)if(a[i]!==f[i])return false;return true;};var j=function(a,f){var r=f||function(x){return x===true;};for(var i=0;i<a.length;++i)if(r(a[i])!==true)return false;return true;};var m=function(a,f){var r=[];for(var i=0;i<a.length;++i)r.push(f(a[i],i));return r;};var k=function(a){var r=[];for(var i=0;i<a.length;++i)r=r.concat(a[i]);return r;};var l=function(a,f){return k(m(a,f));};var n=function(a,f){var r=[];for(var i=0;i<a.length;++i)if(f(a[i]))r.push(a[i]);return r;};var o=m;var p=function(a,x){return!j(a,function(v){return v!==x;});};var q=function(a,x){for(var i=0;i<a.length;++i)if(a[i]===x)return i;return-1;};return{equals:d,forall:j,map:m,flatten:k,flatmap:l,filter:n,each:o,contains:p,indexof:q};});h.fp.object=g([],function(){var m=function(o,f){var r={};for(var i in o)if(o.hasOwnProperty(i))r[i]=f(i,o[i]);return r;};var a=m;var j=function(d,s){a(s,function(k,v){d[k]=v;});};var l=function(o){var r=[];a(o,function(k){r.push(k);});return r;};return{each:a,keys:l,map:m,merge:j};});h.fp.functions=g([],function(){var a=function(f){var s=Array.prototype.slice;var i=s.call(arguments,1);return function(){var j=i.concat(s.call(arguments,0));return f.apply(null,j);};};var n=function(z){return function(){var s=Array.prototype.slice;return!z.apply(null,s.call(arguments,0));};};var d=function(f){var s=Array.prototype.slice;return f.apply(null,s.call(arguments,0));};return{curry:a,not:n,apply:d};});h.async.map=g([h.fp.array],function(a){var d=function(j,f,o){var t=j.length;var k=0;var r=[];a.each(j,function(l,i){f(l,function(m){++k;r[i]=m;if(k===t)o(r);});});};return{amap:d};});h.async.piggybacker=g([h.fp.array,h.fp.functions],function(a,d){var i=function(){var q={};var p=function(k){var f=q[k];delete q[k];a.each(f,d.apply);};var j=function(k,f,l){if(q[k]===undefined){q[k]=[l];f(d.curry(p,k));}else{q[k].push(l);}};return{piggyback:j};};return{create:i};});h.modulator.globalator=g([],function(){var a=function(){var d=function(n,b){var p=n.split('.');var r=b;for(var i=0;i<p.length&&r!==undefined;++i)r=r[p[i]];return r;};var f=Function('return this')();var j=function(i){return i.indexOf('global!')===0;};var k=function(i,l,r){var n=i.substring('global!'.length);var m=function(o,p){var q=d(n,f);if(q!==undefined){l(i,[],function(){return q;});o();}else{p('Modulator error: could not resolve global ['+n+']');}};return{url:i,load:m,serial:true};};return{can:j,get:k}};return{create:a};});h.modulator.bolt=g([h.fp.functions],function(f){var a=function(l,p,n,d,i,o){var j=function(m){return m===n||m.indexOf(n+'.')===0||m.indexOf(n+'/')===0;};var k=function(m){var q=o!==undefined&&o.absolute===true?d:p(d);var r=o!==undefined&&o.fresh===true?'?cachebuster='+new Date().getTime():'';var u=q+"/"+i(m)+'.js'+r;var s=f.curry(l.load,u);return{url:u,load:s,serial:false};};return{can:j,get:k};};return{create:a};});h.module.stratifier=g([h.fp.array],function(a){var s=function(d){var p=a.filter(d,function(f){return!f.serial;});return p.length>0?p:d.slice(0,1);};return{stratify:s};});h.module.analyser=g([h.fp.array],function(a){var d=function(j,n){var i=a.indexof(j,n);var p=j.slice(i);return p.concat([n]);};var f=function(r,m){var i={};var p=[];var j=[];var k;var l=function(t){a.each(m[t],s);};var n=function(t){if(m[t])l(t);else j.push(t);};var o=function(t){p.push(t);n(t);p.pop();};var q=function(t){if(a.contains(p,t))k=d(p,t);else o(t);};var s=function(t){if(!i[t]){q(t);i[t]=true;}};a.each(r,s);return k?{cycle:k}:{load:j};};return{analyse:f};});h.module.fetcher=g([h.fp.array,h.fp.functions,h.async.map,h.async.piggybacker,h.module.stratifier],function(a,f,m,p,s){var d=function(r,v,o,i,j,k){var l=p.create();var n=function(w,x){var y=a.filter(x,f.not(v));if(y.length>0)o('Fetcher error: modules were not defined: '+y.join(', '));else w();};var q=function(w,x){var y=f.curry(x,w.id);var z=function(A){w.load(A,o);};l.piggyback(w.url,z,y);};var t=function(w,x){var y=f.curry(n,x);var z=s.stratify(w);m.amap(z,q,y);};var u=function(w,x){r.regulate(w,i,j,k,function(y){t(y,x);},o);};return{fetch:u};};return{create:d};});h.module.loader=g([h.module.analyser],function(a){var l=function(r,d,f,o,i,j){var k=a.analyse(r,d);if(k.cycle)j('Dependency error: a circular module dependency exists from '+k.cycle.join(' ~> '));else if(k.load.length===0)i();else f.fetch(k.load,o);};return{load:l};});h.module.manager=g([h.fp.array,h.fp.object,h.module.loader,h.module.fetcher],function(a,o,l,f){var d=function(r,i){var j={};var m={};var n=function(k,v,w){if(k===undefined)i("Define error: module id can not be undefined");else if(j[k]!==undefined)i("Define error: module '"+k+"' is already defined");else j[k]={id:k,dependencies:v,definition:w};};var p=function(w,x){var y=function(){var k=a.map(w,q);x.apply(null,k);};var z=function(){var A=o.map(j,function(k,v){return v.dependencies;});l.load(w,A,u,z,y,i);};z();};var q=function(k){if(m[k]!==undefined)return m[k];if(j[k]===undefined)throw"module '"+k+"' is not defined";var v=s(k);if(v===undefined)throw"module '"+k+"' returned undefined from definition function";m[k]=v;return v;};var s=function(k){var v=j[k];var w=a.map(v.dependencies,q);return v.definition.apply(null,w);};var t=function(k){return j[k]!==undefined;};var u=f.create(r,t,i,n,p,q);return{define:n,require:p,demand:q};};return{create:d};});h.api.sources=g([h.fp.array,h.fp.object,h.modulator.globalator],function(a,o,d){var f=function(j,k){var l={'global':{instance:d}};o.each(j,function(i,w){l[i]={instance:w};});a.each(k.types,function(i){l[i.type]={id:i.modulator};});var s=k.sources.slice(0);var m=[d.create()];var n=function(i){if(l[i]===undefined)throw'Unknown modulator type ['+i+'].';};var p=function(i){n(i);return l[i].instance!==undefined;};var q=function(i){n(i);return l[i].id;};var r=function(i){n(i);return l[i].instance;};var t=function(i,w){n(i);l[i].instance=w;};var u=function(w){for(var i=0;i<m.length;++i)if(m[i].can(w))return{found:m[i]};return{notfound:true};};var v=function(){var i=[];a.each(s,function(w){if(p(w.type)){var x=r(w.type);var y=x.create.apply(null,w.args);m.push(y);}else i.push(w);});s=i;};return{isResolved:p,idOf:q,instanceOf:r,register:t,find:u,crank:v};};return{create:f};});h.api.regulator=g([h.fp.array,h.fp.functions],function(a,f){var d=function(s){var j=function(i,o,r,p,q,t){s.crank();var u=a.map(i,n);var v=a.filter(u,f.not(s.isResolved));if(v.length===0)k(i,o,r,p,q,t);else m(v,i,o,r,p,q,t);};var k=function(o,p,q,t,u,v){var r=[];for(var i=0;i<o.length;++i){var w=o[i];var x=s.find(w);if(x.notfound){v('Could not find source for module ['+w+']');return;}var y=x.found.get(w,p,q,t);r[i]=l(w,y);}u(r);};var l=function(i,o){return{id:i,url:o.url,load:o.load,serial:o.serial};};var m=function(t,o,p,r,q,u,v){var w=a.map(t,s.idOf);r(w,function(){var x=arguments;a.each(t,function(y,i){s.register(y,x[i]);});j(o,p,r,q,u,v);});};var n=function(i){var o=i.indexOf('!');return o===-1?'bolt':i.substring(0,o);};return{regulate:j};};return{create:d};});h.api.config=g([h.module.manager,h.api.regulator,h.api.sources],function(m,a,d){var f=function(i,j,o){var s=d.create(j,i);var r=a.create(s);var k=m.create(r,o);return{define:k.define,require:k.require,demand:k.demand};};return{configure:f};});})(Function('return this')());(function(scope){var ephox=scope.ephox=scope.ephox||{};var bolt=ephox.bolt=ephox.bolt||{};var def=function(d,f){return f.apply(null,d);};var loader=bolt.loader=bolt.loader||{};loader.executor=loader.executor||{};loader.api=loader.api||{};loader.transporter=loader.transporter||{};loader.tag=loader.tag||{};loader.tag.script=def([],function(){var g=function(b){return function(e){if(e.srcElement.readyState==="loaded"||e.srcElement.readyState==="complete")b();};};var i=function(e){return e.attachEvent&&!window.opera;};var o=function(e,b){if(i(e))e.attachEvent("onreadystatechange",g(b));else e.addEventListener("load",b,false);};var c=function(b){var e=document.createElement("script");e.type="text/javascript";o(e,b);return e;};var a=function(d,b){var e=c(b);d(e);var h=document.getElementsByTagName("head")[0];h.appendChild(e);};return{insert:a};});loader.transporter.commonjs=def([],function(){var r=function(u,s,e){var f=require('fs');f.exists(u,function(a){if(a)f.readFile(u,'UTF-8',function(b,d){if(b)e('Error reading file ['+u+'], error ['+b+']');else s(d);});else e('File does not exist ['+u+']');});};return{read:r};});loader.transporter.xhr=def([],function(){var r=function(){var b=[function(){return new XMLHttpRequest()},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];return f(b);};var f=function(b){for(var i=0;i<b.length;++i){try{return b[i]();}catch(e){}}};var h=function(b,u,s,e){return function(){if(b.readyState===4)d(b,u,s,e);};};var d=function(b,u,s,e){if(b.status===200||b.status===304)s(b.responseText);else e('Transport error: '+b.status+' '+b.statusText+' for resource: "'+u+'"');};var g=function(b,u,s,e){b.open('GET',u,true);b.onreadystatechange=h(b,u,s,e);b.send();};var a=function(u,s,e){var b=r();if(b)g(b,u,s,e);else e('Transport error: browser does not support XMLHttpRequest.');};return{request:a};});loader.executor.evaller=def([],function(){var execute=function(data,onsuccess,onfailure){try{eval(data);}catch(e){onfailure(e);return;}onsuccess();};return{execute:execute};});loader.executor.injector=def([loader.tag.script],function(s){var e=function(d,o,a){var i=function(t){t.text=d;};var n=function(){};s.insert(i,n);o();};return{execute:e};});loader.api.commonjsevaller=def([loader.transporter.commonjs,loader.executor.evaller],function(c,e){var l=function(u,o,a){var i=function(d){e.execute(d,o,a);};c.read(u,i,a);};return{load:l};});loader.api.scripttag=def([loader.tag.script],function(s){var l=function(u,o,a){var b=function(t){t.src=u;};s.insert(b,o);};return{load:l};});loader.api.xhrevaller=def([loader.transporter.xhr,loader.executor.evaller],function(x,e){var l=function(u,o,a){var i=function(d){e.execute(d,o,a);};x.request(u,i,a);};return{load:l};});loader.api.xhrinjector=def([loader.transporter.xhr,loader.executor.injector],function(x,i){var l=function(u,o,a){var b=function(d){i.execute(d,o);};x.request(u,b,a);};return{load:l};});})(Function('return this')());(function(scope){var ephox=scope.ephox=scope.ephox||{};var bolt=ephox.bolt=ephox.bolt||{};var def=function(d,f){return f.apply(null,d);};var module=bolt.module=bolt.module||{};module.bootstrap=module.bootstrap||{};module.config=module.config||{};module.error=module.error||{};module.modulator=module.modulator||{};module.reader=module.reader||{};module.runtime=module.runtime||{};module.util=module.util||{};module.error.error=def([],function(){var d=function(m){throw m||new Error('unknown error');};return{die:d};});module.config.mapper=def([],function(){var f=function(i){return i;};var h=function(i){return i.replace(/\./g,'/');};var c=function(n){return function(){return n;};};return{flat:f,hierarchical:h,constant:c};});module.api=def([module.runtime],function(r){var d=function(m){return function(){return r[m].apply(null,arguments);};};return{define:d('define'),require:d('require'),demand:d('demand'),main:d('main'),load:d('load'),loadscript:d('loadscript')};});module.util.path=def([],function(){var d=function(f){var n=f.replace(/\\/g,'/');var e=n.lastIndexOf('/');return n.substring(0,e);};var b=function(f){var n=f.replace(/\\/g,'/');var e=n.lastIndexOf('/');return n.substring(e+1);};return{basename:b,dirname:d};});module.util.locator=def([],function(){var b=function(){var s=document.getElementsByTagName("script");return s[s.length-1].src;};var r=module.runtime.locate;var l=function(){var f=r||b;return f();};return{locate:l};});module.util.pather=def([module.util.path],function(p){var c=function(r){var b=p.dirname(r);return function(p){return b+'/'+p;};};return{create:c};});module.modulator.modulators=def([ephox.bolt.kernel.fp.functions,ephox.bolt.kernel.modulator.bolt,ephox.bolt.loader.api.commonjsevaller,ephox.bolt.loader.api.scripttag,ephox.bolt.loader.api.xhrevaller,ephox.bolt.loader.api.xhrinjector],function(f,b,c,s,x,a){var w=function(m,l){var d=f.curry(m.create,l);return{create:d}};return{boltcommonjs:w(b,c),boltscripttag:w(b,s),boltxhreval:w(b,x),boltxhrinjector:w(b,a)};});module.config.builtins=def([ephox.bolt.module.modulator.modulators.boltscripttag,ephox.bolt.module.modulator.modulators.boltcommonjs],function(b,a){return{browser:{bolt:b,amd:b},commonjs:{bolt:a,amd:a}};});module.config.specs=def([module.util.pather],function(p){var t=function(t,i){return{type:t,implementation:i,modulator:i+'.Modulator',compiler:i+'.Compiler'};};var s=function(r){return function(t){return{type:t,relativeto:r,args:[p.create(r)].concat(Array.prototype.slice.call(arguments,1))};}};return{type:t,source:s};});module.reader.bouncing=def([ephox.bolt.kernel.fp.array,module.error.error,module.config.specs],function(ar,error,specs){var bounce=function(d,r,a){var n=a.configs.shift();r(n.relativeto,n.config,d,a);};var tick=function(f,c,d,r,a){var m=ar.map(c.configs||[],function(e){return{relativeto:f,config:e};});var b={sources:a.sources.concat(c.sources||[]),types:a.types.concat(c.types||[]),configs:m.concat(a.configs)};if(b.configs.length>0)bounce(d,r,b);else d({sources:b.sources,types:b.types});};var evaluate=function(file,payload,done,read,acc){var result={};var mapper=module.config.mapper;var type=specs.type;var source=specs.source(file);var configure=function(c){result=c;};try{eval(payload);}catch(e){throw'Could not load configuration ['+file+'], with: '+e;}tick(file,result,done,read,acc);};return{evaluate:evaluate};});module.reader.browser=def([module.error.error,module.reader.bouncing,module.util.path,ephox.bolt.loader.transporter.xhr],function(e,b,p,x){var r=function(a,f,d,c){var g=c||{sources:[],types:[],configs:[]};var h=p.dirname(a);var i=h+'/'+f;x.request(i,function(j){b.evaluate(i,j,d,r,g);},e.die);};return{read:r};});module.reader.node=def([module.reader.bouncing],function(b,p,f){var r=function(a,c,d,e){var f=require('fs');var p=require('path');var g=e||{sources:[],types:[],configs:[]};var h=p.dirname(a);var i=p.resolve(h,c);var j=f.readFileSync(i,'UTF-8');b.evaluate(i,j,d,r,g);};return{read:r};});module.reader.direct=def([],function(){var c=function(a){return function(d){d({sources:a.sources||[],types:a.types||[],configs:a.configs||[]});};};return{create:c};});module.bootstrap.configloader=def([module.util.locator,module.reader.browser],function(l,b){var c=function(f){var s=l.locate();return function(d){b.read(s,f,d);};};return{create:c};});module.bootstrap.deferred=def([ephox.bolt.kernel.fp.array],function(a){var d=[];var b=function(i,f){var r=function(e){e(i,f);};d.push(r);};var c=function(b){a.each(d,function(e){e(b);});d=[];};return{require:b,configured:c};});module.bootstrap.main=def([ephox.bolt.kernel.api.config,module.bootstrap.deferred,module.runtime],function(c,d,r){var m=function(i,a,b,e){r.require(b||[],function(){e&&e.apply(null,arguments);r.require([i],function(f){f.apply(null,a||[]);});});};return{main:m};});module.bootstrap.install=def([ephox.bolt.kernel.api.config,module.bootstrap.deferred,module.bootstrap.main,module.runtime,module.error.error],function(c,d,m,r,e){var n=function(){throw'bolt not initialised, can not call define or demand, did you mean to use require or main?';};var i=function(a,b,l,f){r.define=n;r.demand=n;r.require=d.require;r.main=m.main;r.load=l;r.loadscript=f;a(function(g){var h=c.configure(g,b,e.die);r.define=h.define;r.require=h.require;r.demand=h.demand;d.configured(r.require);});};return{install:i};});})(Function('return this')());(function(g){var o=ephox.bolt.kernel.fp.object;var a=ephox.bolt.module.api;var b=ephox.bolt.module.config.builtins.browser;var i=ephox.bolt.module.bootstrap.install;var r=ephox.bolt.module.bootstrap.configloader.create("prod.js");var t=ephox.bolt.loader.transporter.xhr.request;var s=ephox.bolt.loader.api.scripttag.load;i.install(r,b,t,s);o.merge(g,a);})(Function("return this;")());
