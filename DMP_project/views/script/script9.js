var _tsq = _tsq || [];


var Tapstream = (function() {
    var IPHONE_RE = /^(http|https|itms-apps)?:?(\/\/)?itunes.apple.com\/(.*\/)?app\/(.*\/)?(id[0-9]+).*$/i;
    var ANDROID_RE = /^(https?:)?(\/\/)?play.google.com\/store\/apps\/details.*$/i;
    var MARKET_RE = /^market:\/\/.*/i;
    var IOS_USERAGENT_RE = /iPad|iPhone|iPod/;

    var isIosUseragent = function(){
        return !!navigator.userAgent.match(IOS_USERAGENT_RE);
    };

    var isAppStoreLink = function(linkEl){
        var href = linkEl.getAttribute('href');
        if (!href)
            return false;
        return href.match(IPHONE_RE) || href.match(ANDROID_RE) || href.match(MARKET_RE);
    };

    var rewriteAppStoreLink = function(apiObj, linkEl){
        if (isIosUseragent()){
            linkEl.removeAttribute('target');
        }

        var href = linkEl.getAttribute('href');
        var url = apiObj.pageUrl;
        var protocol = href.match(/^https/i) ? 'https' : 'http';
        var qs = {
            '__tsproxy': href,
            '__url': url,
            '__tsid': apiObj.sessionId,
            '__tsid_override': '1'
        };
        var newHref = protocol + '://' + apiObj.apiDomain +'/' + apiObj.accountName + '/pageclick?' + serializeObject(qs);
        linkEl.setAttribute('href', newHref);
    };

    var replaceLinkNode = function(apiObj, linkEl){
        if(isAppStoreLink(linkEl)){
            rewriteAppStoreLink(apiObj, linkEl);
        }
    };


    var replaceLinks = function(apiObj, node){
        try{
            node = node || document;
            var ii, links = node.getElementsByTagName('a');

            for(ii=0;ii<links.length; ii++){
                replaceLinkNode(apiObj, links[ii]);
            }

        }catch(e){} // Never break the page.
    };

    var uuid = (function(){
        var _rndBytes = new Array(16);
        var _rng = function() {
            var r, b = _rndBytes, d = (new Date().getTime());

            for (var ii = 0; ii < 16; ii++) {
                if ((ii & 0x03) === 0){
                    r = Math.random() * 0x100000000 + d;
                }
                b[ii] = r >>> ((ii & 0x03) << 3) & 0xff;
            }

            return b;
        };

        var _toHex = function(x){
            var result = x.toString(16);
            while(result.length < 2) result = "0" + result;
            return result;
        };

        var unparse = function(buf) {
            var i = 0, bth = _toHex;
            return  bth(buf[i++]) + bth(buf[i++]) +
                    bth(buf[i++]) + bth(buf[i++]) + '-' +
                    bth(buf[i++]) + bth(buf[i++]) + '-' +
                    bth(buf[i++]) + bth(buf[i++]) + '-' +
                    bth(buf[i++]) + bth(buf[i++]) + '-' +
                    bth(buf[i++]) + bth(buf[i++]) +
                    bth(buf[i++]) + bth(buf[i++]) +
                    bth(buf[i++]) + bth(buf[i++]);
        };


        var v4 = function() {
            var i = 0;
            var rnds = _rng();
            rnds[6] = (rnds[6] & 0x0f) | 0x40;
            rnds[8] = (rnds[8] & 0x3f) | 0x80;

            return unparse(rnds);
        };

        return {'v4': v4};
    })();

    var GA_COOKIE_NAMES = ['__utma', '__utmb', '__utmc', '__utmz'];
    var SESSION_COOKIE_NAME = '__tsid';

    var create_uuid = function(a){
        return uuid.v4();
    };

    var trim = function(str){
        return str.replace(/^\s+/, '').replace(/\s+/, '');
    };

    var isString = function(obj){
        return typeof obj == 'string' || obj instanceof String;
    };

    var isNumber = function(obj){
        return typeof obj == 'number' || obj instanceof Number;
    };

    var getCookieDomainFromHostname = function(hostname){
        if (!hostname)
            return '';
        var parts = hostname.split('.');
        var tld = [];
        for (var x = parts.length - 1; x >= 0; x--) {
            var part = parts[x];
            tld.push(part);
            if (part.length > 3)
                break;
        }
        return '.' + tld.reverse().join('.');
    };

    var writeCookie = function(name, value, days) {
        var expires = '';
        var domain = getCookieDomainFromHostname(window.location.hostname);
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; domain=" + domain + "; path=/";
    };

    var readCookies = function() {
        var cookies = document.cookie.split(';');
        var result = {};
        for (var x = 0; x < cookies.length; x++){
            var line = cookies[x];
            var sepIndex = line.indexOf('=');
            var name = trim(line.substr(0, sepIndex));
            var value = trim(line.substr(sepIndex + 1, line.length));
            result[name] = decodeURIComponent(value);
        }
        return result;
    };

    var serializeObject = function(obj) {
      var str = [];
      for(var p in obj){
        var key = p;
        var value = obj[p];
        if (isString(value) || isNumber(value))
            str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }

      return str.join("&");
    };

    var updateObject = function(src, dest, names){
        for (var x = 0; x < names.length; x++){
            var name = names[x];
            if (src[name] !== undefined)
                dest[name] = src[name];
        }
    };

    var injectScript = function(path, loadCallback){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = path;

        if (!!loadCallback){
            if(script.addEventListener) {
                script.addEventListener("load",loadCallback,false);
            }
            else if(script.readyState) {
                script.onreadystatechange = loadCallback;
            }
        }

        var head = document.getElementsByTagName('head');
        if (!!head[0]){
            head[0].appendChild(script);
        }

        return script;
    };

    var buildImage = function(path, loadCallback){
        var img = new Image();
        img.src = path;
        img.onload = loadCallback;
        return img;
    };

    var randomCallbackName = function(){
        var parts = ['__ts_cb_'];
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var x = 0; x < 10; x++){
            parts.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        }
        return parts.join('');
    };

    var renderTemplate = function(template, ctx){
        return template.replace(/{([^{}]+)}/g, function(match, key){
            var value = ctx[key];
            if (!value){
                return '';
            }
            return value;
        });
    };


    var API = function() {
        this.accountName = null;
        this.protocol = window.location.protocol;
        this.apiDomain = 'api.taps.io';
        this.apiPath = 'hit';
        this.impressionTemplate = '{protocol}//{domain}/{account}/{path}/{tracker}.gif';
        this.customDomain = null;
        this.attachGACookies = false;
        this.callbacks = {};
        this.sessionId = this.getOrCreateSessionId();
        this.customParameterKeys = [];
        this.customParameterValues= [];
        this.sessionFormFieldId = null;
        this.enableJSONP = false;
        this.pageUrl = document.location.href;
        this.enableStoreLinkRewriting = true;
    };

    API.prototype.getOrCreateSessionId = function(){
        var cookies = readCookies();
        var sessionId = cookies[SESSION_COOKIE_NAME];
        if (sessionId === undefined){
            sessionId = create_uuid();
            writeCookie(SESSION_COOKIE_NAME, sessionId, 365);
        }
        return sessionId;
    };

    API.prototype.setCustomDomain = function(domain){
        this.customDomain = domain;
        this.enableStoreLinkRewriting = false;
        this.impressionTemplate = 'http://{domain}/{tracker}.gif';
        this.apiDomain = domain;
        this.apiPath = '';
        return this;
    };

    API.prototype.setImpressionTemplate = function(template){
        this.impressionTemplate = template;
        return this;
    };

    API.prototype.setAccountName = function(accountName){
        this.accountName = accountName;
        return this;
    };

    API.prototype.setApiDomain = function(domain){
        this.apiDomain = domain;
        return this;
    };

    API.prototype.setProtocol = function(protocol){
        this.protocol = protocol;
        return this;
    };

    API.prototype.setPageUrl = function(pageUrl){
        this.pageUrl = pageUrl;
        return this;
    };

    API.prototype.setApiPath = function(path){
        this.apiPath = path;
        return this;
    };

    API.prototype.enableGoogleAnalyticsIntegration = function(value){
        this.attachGACookies = value;
        return this;
    };

    API.prototype.setEnableJSONP = function(value){
        this.enableJSONP = value;
        return this;
    };

    API.prototype.setSessionFormFieldId = function(id){
        this.sessionFormFieldId = id;
        this.enableJSONP = true;
        return this;
    };

    API.prototype.addCustomParameter = function(key, value){
        this.customParameterKeys.push(key);
        this.customParameterValues.push(value);
        return this;
    };

    API.prototype.setStoreLinkRewriting = function(val){
        this.enableStoreLinkRewriting = !!val;
    };

    API.prototype.rewriteStoreLinks = function(){
        replaceLinks(this);
    };

    API.prototype.rewriteDynamicStoreLinks = function(){
        if(!window.MutationObserver){
            return;
        }
        var self = this;
        var target = window.document.body;
        var observer = new MutationObserver(function(mutations){
            for(var ii = 0; ii<mutations.length; ii++){
                var addedNodes = mutations[ii].addedNodes;
                for(var jj = 0; jj < addedNodes.length; jj++){
                    var node = addedNodes[jj];
                    if(node.tagName && node.tagName.toLowerCase() === 'a'){
                        replaceLinkNode(self, node);
                    }
                    replaceLinks(self, node);
                }
            }
        });

        observer.observe(target, {childList: true, subtree: true});

    };

    API.prototype.initComplete = function(){
        if(this.enableStoreLinkRewriting){
            this.rewriteStoreLinks();
            this.rewriteDynamicStoreLinks();
        }
    };

    API.prototype.buildQueryString = function(trackerName, tags){
        if (!tags || (tags && !tags.join)) tags = [];

        var qs = {};

        if (this.attachGACookies){
            var cookies = readCookies();
            updateObject(cookies, qs, GA_COOKIE_NAMES);
        }
        for(var ii=0; ii < this.customParameterKeys.length; ii++){
            var key = this.customParameterKeys[ii];
            var value = this.customParameterValues[ii];
            qs[key] = value;
        }

        qs.__tsid = this.sessionId;
        qs.__ts = tags.join(',');
        qs.__ref = document.referrer;
        qs.__url = this.pageUrl;
        qs.__title = document.title;
        qs.__width = window.screen.width;
        qs.__height = window.screen.height;
        qs.__sdk = 'js';
        qs.__nocache = new Date().getTime();

        return qs;
    };

    API.prototype.fireHit = function(trackerName, tags){
        var path = renderTemplate(this.impressionTemplate, {
            'protocol': this.protocol,
            'domain': this.apiDomain,
            'account': this.accountName,
            'path': this.apiPath,
            'tracker': trackerName
        });

        var qs = this.buildQueryString(trackerName, tags);

        var this_api = this;

        var onloadCallback = function(){
            this_api.fireCallbacks('hit', this_api.sessionId, trackerName, tags);
        };

        if (this.enableJSONP){
            var cbName = randomCallbackName();

            var jsonpCallback = function(data){
                window[cbName] = undefined;
                this_api.JSONPHandler(data);
            };

            window[cbName] = jsonpCallback;
            qs.__tsjsonp_callback = cbName;
            injectScript(path + '?' + serializeObject(qs), onloadCallback);
        } else {
            buildImage(path + '?' + serializeObject(qs), onloadCallback);
        }

        return this;
    };

    API.prototype.trackPage = function(tags){
        this.fireHit('', tags);
        return this;
    };

    API.prototype.attachCallback = function(key, callback){
        if(typeof key == 'function'){
            callback = key;
            key = 'hit';
        }else{
            key = key || 'hit';
        }

        this.callbacks[key] = this.callbacks[key] || [];
        this.callbacks[key].push(callback);
        return this;
    };

    API.prototype.fireCallbacks = function(callbackKey){
        if(!this.callbacks[callbackKey]) return this;

        for (var x=0; x < this.callbacks[callbackKey].length;  x++){
            this.callbacks[callbackKey][x].apply(this, arguments);
        }
        return this;
    };

    API.prototype.JSONPHandler = function(data){
        if (!this.sessionFormFieldId){
            return this;
        }

        var target = document.getElementById(this.sessionFormFieldId);
        target.value = data.session_id;
        return this;

    };

    var CommandBuffer = function(initial){
        this._api = new API();
        for (var x=0, len=initial.length; x<len; x++){
            this.executeItem(initial[x]);
        }
        this._api.fireCallbacks('init', this._api.sessionId);
        this._api.initComplete();
    };

    CommandBuffer.prototype.executeItem = function(item){
        var meth = this._api[item[0]];
        if (meth !== undefined){
            var args = item.slice(1);
            return meth.apply(this._api, args);
        }
    };

    CommandBuffer.prototype.push = function(item){
        this.executeItem(item);
        return item;
    };

    _tsq = new CommandBuffer(_tsq);


    return {
        'API': API,
        'CommandBuffer': CommandBuffer
    };

})();
