(function(){
var AvNs = {SIGNATURE:"7D8B79A2-8974-4D7B-A76A-F4F29624C06BkSjeNpWWFKgT8PdvUoDw0e2UDMPlcoG7yD1YGbZla4N1ea1S_WaeRHKcJLtD_nHNWHeoJWs-WFZkwGGQmz1iwQ",PREFIX:"https://me.kis.v2.scr.kaspersky-labs.com/",INJECT_ID:"FD126C42-EBFA-4E12-B309-BB3FDD723AC1",RESOURCE_ID:"E3E8934C-235A-4B0E-825A-35A08381A191",IsWebExtension: function(){return false;}}; var AvNs = (function IeJsonMain(context) 
{
    function GetClass(obj) {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
    }
    var exports = {}, undef;
    function ObjectToJson(object) {
        if (object === null || object === Infinity || object === -Infinity || object === undef)
            return "null";
        var className = GetClass(object);
        if (className === "Boolean") {
            return "" + object;
        } else if (className === "Number") {
            return window.isNaN(object) ? "null" : "" + object;
        } else if (className === "String") {
            var escapedStr = "" + object;
            return "\"" + escapedStr.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
        }
        if (typeof object === "object") {
            if (!ObjectToJson.check) ObjectToJson.check = [];
            for (var i=0, chkLen=ObjectToJson.check.length ; i<chkLen ; ++i) {
                if (ObjectToJson.check[i] === object) {
                    throw new TypeError();
                }
            }
            ObjectToJson.check.push(object);
            var str = '';
            if (className === "Array" || className === "Array Iterator") {
                for (var index = 0, length = object.length; index < length; ++index) {
                    str += ObjectToJson(object[index]) + ',';
                }
                ObjectToJson.check.pop();
                return "["+str.slice(0,-1)+"]";
            } else {
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        str += '"' + property + '":' + ObjectToJson(object[property]) + ',';
                    }
                }
                ObjectToJson.check.pop();
                return "{"+str.slice(0,-1)+"}";
            }
        }
        return undef;
    }
    exports.stringify = function stringify(source) {
        return ObjectToJson(source);
    };
    var parser = {
        source : null,
        grammar : /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/,
        ThrowError : function ThrowError() {
            throw new SyntaxError('JSON syntax error');
        },
        NextToken : function NextToken(token) {
            this.source = token.input.slice(token[0].length);
            return this.grammar.exec(this.source);
        },
        ParseArray : function ParseArray(){
            var token = this.grammar.exec(this.source),
                parseItem = token && token[1] !== ']',
                result = [];
            for(;;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseItem) {
                    result.push(this.ParseValue(token));
                    token = this.grammar.exec(this.source);
                } else {
                    if (token[1]) {
                        if (token[1] === ']') {
                            break;
                        } else if (token[1] !== ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                }
                parseItem = !parseItem;
            }
            return result;
        },
        ParseObject : function ParseObject(){
            var propertyName, parseProperty = true, result = {};
            for(var token = this.grammar.exec(this.source);;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseProperty) {
                    if (token[1] && token[1] === '}') {
                        break;
                    } else if (token[1] || token[2] || !token[3]) {
                        this.ThrowError();
                    }
                    propertyName = token[3];
                    token = this.NextToken(token);
                    if (!token || !token[1] || token[1] !== ':')
                        this.ThrowError();
                    parseProperty = false;
                } else {
                    if (!propertyName)
                        this.ThrowError();
                    result[ propertyName ] = this.ParseValue(token);
                    token = this.NextToken(this.grammar.exec(this.source));
                    if (token[1]) {
                        if (token[1] === '}') {
                            break;
                        } else if (token[1] !== ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                    propertyName = undef;
                    parseProperty = true;
                }
            }
            return result;
        },
        ParseValue : function ParseValue(token){
            if (token[1]) {
                switch (token[1]){
                    case '[' :
                        this.source = this.source.slice(token[0].length);
                        return this.ParseArray();
                    case '{' :
                        this.source = this.source.slice(token[0].length);
                        return this.ParseObject();
                    case 'true' :
                        return true;
                    case 'false' :
                        return false;
                    case 'null' :
                        return null;
                    default:
                        this.ThrowError();
                }
            } else if (token[2]) {
                return  +token[2];
            }
            return token[3].replace(/\\(?:u(.{4})|(["\\\/'bfnrt]))/g, function replaceCallback(substr, utfCode, esc){
                if(utfCode)
                {
                    return AvNs.StringFromCharCode(parseInt(utfCode, 16));
                }
                else
                {
                    switch(esc) {
                        case 'b': return '\b';
                        case 'f': return '\f';
                        case 'n': return '\n';
                        case 'r': return '\r';
                        case 't': return '\t';
                        default:
                            return esc;
                    }
                }
            });
        },
        Parse : function Parse(str) {
            if ('String' !== GetClass(str))
                throw new TypeError();
            this.source = str;
            var token = this.grammar.exec(this.source);
            if (!token)
                this.ThrowError();
            return this.ParseValue(token);
        }
    };
    exports.parse = function parse(source) {
        return parser.Parse(source);
    };
    if (window.JSON)
    {
        var originStringify = JSON.stringify;
        function StringifyWrapper(source)
        {
            if (Array.prototype.toJSON || String.prototype.toJSON)
                return exports.stringify(source);
            return originStringify(source);
        }
        context["JSONStringify"] = JSON.stringify ? StringifyWrapper : exports.stringify;
        context["JSONParse"] = JSON.parse || exports.parse;
    }
    else
    {
        context["JSONStringify"] = exports.stringify;
        context["JSONParse"] = exports.parse;
    }
    return context;
})(AvNs || {});
(function CommonMain(ns)
{
    ns.XMLHttpRequest = window.XMLHttpRequest;
    ns.XDomainRequest = window.XDomainRequest;
    ns.XMLHttpRequestOpen = window.XMLHttpRequest && window.XMLHttpRequest.prototype.open;
    ns.XMLHttpRequestSend = window.XMLHttpRequest && window.XMLHttpRequest.prototype.send;
    ns.XMLHttpRequestAbort = window.XMLHttpRequest && window.XMLHttpRequest.prototype.abort;
    ns.XMLHttpRequestSetRequestHeader = window.XMLHttpRequest && window.XMLHttpRequest.prototype.setRequestHeader;
    var originalCreateTreeWalker = document.createTreeWalker;
    ns.CreateTreeWalker = function CreateTreeWalker(root, whatToShow, filter, entityReferenceExpansion)
    {   
        if (typeof (originalCreateTreeWalker) !== "function")
            throw new Error("document.createTreeWalker not implemented");
        return originalCreateTreeWalker.call(document, root, whatToShow, filter, entityReferenceExpansion);
    };
    ns.ObjectHasOwnProperty = Object.prototype.hasOwnProperty;
    ns.ElementSetAttribute = Element.prototype.setAttribute;
    ns.ElementAttachShadow = Element.prototype.attachShadow;
    ns.documentCreateTextNode = document.createTextNode;
    ns.documentStyleSheets = document.styleSheets;
    ns.StringSplit = String.prototype.split;
    ns.StringFromCharCode = String.fromCharCode;
    ns.EmptyFunc = function EmptyFunc()
    {
    };
    ns.IsStringEqualIgnoreCase = function IsStringEqualIgnoreCase(left, right)
    {
        if (typeof left !== "string" || typeof right !== "string")
            return false;
        return left.toLowerCase() === right.toLowerCase();
    };
    ns.MaxRequestDelay = 2000;
    ns.Log = ns.EmptyFunc;
    ns.SessionLog = ns.Log;
    ns.SessionError = ns.Log;
    function GetHostAndPort(url)
    {
        if (!url)
            return "";
        var urlString = typeof url !== "string" ? url.toString() : url;
        var hostBeginPos = urlString.indexOf("//");
        if (hostBeginPos === -1)
        {
            urlString = document.baseURI || "";
            hostBeginPos = urlString.indexOf("//");
            if (hostBeginPos === -1)
                return "";
        }
        hostBeginPos += 2;
        var hostEndPos = urlString.indexOf("/", hostBeginPos);
        if (hostEndPos === -1)
            hostEndPos = urlString.length;
        var originParts = ns.StringSplit.call(urlString.substring(0, hostEndPos), "@");
        var origin = originParts.length > 1 ? originParts[1] : originParts[0];
        return origin[0] === "/" ? document.location.protocol + origin : origin;
    }
    ns.IsCorsRequest = function IsCorsRequest(url, initiator)
    {
        try
        {
            var urlOrigin = GetHostAndPort(url);
            var initiatorOrigin = GetHostAndPort(initiator);
            return Boolean(urlOrigin) && Boolean(initiatorOrigin) && urlOrigin !== initiatorOrigin;
        }
        catch (e)
        {
            ns.SessionLog("Error check CORS request, url: " + url + " , initiator: " + initiator + ", error: " + e.message);
            return false;
        }
    };
    ns.TryCreateUrl = function TryCreateUrl(url)
    {
        try
        {
            var replacedUrl = url.replace(/(https?:\/\/)\.(?=[0-9xa-fA-F])/i, "$1"); 
            return new URL(replacedUrl);
        }
        catch (e)
        {
            ns.SessionLog("Can't create URL from " + url);
            return null;
        }
    };
    ns.TrySendMessage = function TrySendMessage(port, message)
    {
        try
        {
            port.postMessage(message);
        }
        catch (e)
        {
            if (e.message && e.message.startsWith("Attempt to postMessage on disconnected port"))
                ns.SessionLog("Attempt to postMessage on disconnected port: " + JSON.stringify(message));
            else
                ns.SessionError(e, "nms_back");
        }
    };
    ns.HasValue = function HasValue(value)
    {
        return value && value.length !== 0;
    };
    ns.GetResourceSrc = function GetResourceSrc(resourceName)
    {
        return ns.GetBaseUrl() + ns.RESOURCE_ID + resourceName;
    };
    ns.IsRelativeTransport = function IsRelativeTransport()
    {
        return ns.PREFIX === "/";
    };
    ns.GetBaseUrl = function GetBaseUrl()
    {
        if (!ns.IsRelativeTransport())
            return ns.PREFIX;
        return document.location.protocol + "//" + document.location.host + "/";
    };
    var originalAddEventListener = document.addEventListener;
    var originalWindowAddEventListener = window.addEventListener;
    ns.AddEventListener = function AddEventListener(element, name, func, pluginId)
    {
        if (typeof originalAddEventListener === "function")
        {
            var callingFunction = element === window ? originalWindowAddEventListener : originalAddEventListener;
            callingFunction.call(element,
                name,
                function EventListenerCallback(e)
                {
                    try
                    {
                        func(e || window.event);
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                }, 
                true);
        }
        else
        {
            element.attachEvent("on" + name, 
                function EventListenerCallback(e)
                {
                    try
                    {
                        func.call(element, e || window.event);
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                });
        }
    };
    ns.AddRemovableEventListener = function AddRemovableEventListener(element, name, func)
    {
        if (originalAddEventListener)
        {
            var callingFunction = element === window ? originalWindowAddEventListener : originalAddEventListener;
            callingFunction.call(element, name, func, true);
        }
        else
        {
            element.attachEvent("on" + name, func);
        }
    };
    ns.RemoveElement = function RemoveElement(element)
    {
        element && element.parentNode && element.parentNode.removeChild(element);
    };
    var originalDocumentCreateElement = document.createElement;
    ns.DocumentCreateElement = function DocumentCreateElement(elementType)
    {
        return originalDocumentCreateElement.call(document, elementType);
    };
    var originalDocumentQuerySelectorAll = document.querySelectorAll;
    ns.HasDocumentQuerySelectorAll = function HasDocumentQuerySelectorAll()
    {
        return Boolean(originalDocumentQuerySelectorAll);
    };
    ns.DocumentQuerySelectorAll = function DocumentQuerySelectorAll(selector)
    {
        return originalDocumentQuerySelectorAll.call(document, selector);
    };
    var originalElementQuerySelectorAll = Element.prototype.querySelectorAll;
    ns.HasElementQuerySelectorAll = function HasElementQuerySelectorAll()
    {
        return Boolean(originalElementQuerySelectorAll);
    };
    ns.ElementQuerySelectorAll = function ElementQuerySelectorAll(element, selector)
    {
        return originalElementQuerySelectorAll.call(element, selector);
    };
    ns.RunModule = function RunModule(func, timeout)
    {
        if (document.readyState === "loading")
        {
            if (timeout)
                ns.SetTimeout(func, timeout);
            var delayFunc = function DelayFunc() { ns.SetTimeout(func, 0); };
            if (document.addEventListener)
                ns.AddEventListener(document, "DOMContentLoaded", delayFunc);
            ns.AddEventListener(window, "load", delayFunc);
        }
        else
        {
            ns.SetTimeout(func, 0); 
        }
    };
    ns.RemoveEventListener = function RemoveEventListener(element,  name, func)
    {
        if (element.removeEventListener)
            element.removeEventListener(name, func, true);
        else
            element.detachEvent("on" + name, func);
    };
    var oldSetTimeout = setTimeout;
    var oldClearTimeout = clearTimeout;
    ns.SetTimeout = function SetTimeout(func, timeout, pluginId)
    {
        return oldSetTimeout(function TimerCallback()
            {
                try
                {
                    func();
                }
                catch (e)
                {
                    ns.SessionError(e, pluginId);
                }
            },
            timeout);
    };
    ns.ClearTimeout = function ClearTimeout(id)
    {
        oldClearTimeout(id);
    };
    var oldSetInterval = setInterval;
    var oldClearInterval = clearInterval;
    ns.SetInterval = function SetInterval(func, interval, pluginId)
    {
        return oldSetInterval(function IntervalCallback()
            {
                try
                {
                    func();
                }
                catch (e)
                {
                    ns.SessionError(e, pluginId);
                }
            },
            interval);
    };
    ns.ClearInterval = function ClearInterval(id)
    {
        return oldClearInterval(id);
    };
    ns.GetOwnerNode = function GetOwnerNode(element)
    {
        return element.ownerNode || element.owningElement;
    };
    function InsertStyleRule(style, rule)
    {
        try
        {
            if (style.styleSheet)
            {
                style.styleSheet.cssText += rule + "\n";
            }
            else
            {
                style.appendChild(ns.documentCreateTextNode.call(document, rule));
                ns.SetTimeout(function TimerCallback()
                    {
                        if (!style.sheet)
                            return;
                        var rules = style.sheet.cssRules || style.sheet.rules;
                        if (rules && rules.length === 0)
                            style.sheet.insertRule(rule);
                    }, 500);
            }
        }
        catch (e)
        {
            if (e.message === "can't access dead object")
                ns.SessionLog("Trying to set css for dead object");
            else
                throw e;
        }
    }
    function FindStyle(document, style)
    {
        for (var i = 0; i < ns.documentStyleSheets.length; ++i)
        {
            var ownerNode = ns.GetOwnerNode(ns.documentStyleSheets[i]);
            if (ownerNode && ownerNode.className === "abn_style" && ownerNode.textContent === style.textContent)
                return ownerNode;
        }
        return null;
    }
    function GetHead()
    {
        var headElements = document.getElementsByTagName("head");
        return headElements.length !== 0 ? headElements[0] : null;
    }
    function AddDocumentStyles(document, rules)
    {
        if (typeof rules !== "object" || rules.constructor !== Array)
            return [];
        var styles = [];
        for (var i = 0, len = rules.length; i < len;)
        {
            var style = ns.DocumentCreateElement("style");
            style.type = "text/css";
            style.className = "abn_style";
            style.setAttribute("nonce", ns.ContentSecurityPolicyNonceAttribute);
            for (var n = 0; n < 4 && i < len; ++n, ++i)
            {
                var rule = rules[i];
                if (originalDocumentQuerySelectorAll)
                {
                    InsertStyleRule(style, rule);
                }
                else
                {
                    var styleBegin = rule.lastIndexOf("{");
                    if (styleBegin === -1)
                        continue;
                    var styleText = rule.substr(styleBegin);
                    var selectors = ns.StringSplit.call(rule.substr(0, styleBegin), ",");
                    if (style.styleSheet)
                    {
                        var cssText = "";
                        for (var j = 0; j !== selectors.length; ++j)
                            cssText += selectors[j] + styleText + "\n";
                        style.styleSheet.cssText += cssText;
                    }
                    else
                    {
                        for (var k = 0; k !== selectors.length; ++k)
                            style.appendChild(ns.documentCreateTextNode.call(document, selectors[k] + styleText));
                    }
                }
            }
            var inserted = FindStyle(document, style);
            if (inserted && inserted.parentNode)
                inserted.parentNode.removeChild(inserted);
            if (document.head && typeof document.head.appendChild === "function")
            {
                document.head.appendChild(style);
            }
            else
            {
                var head = GetHead();
                if (head)
                {
                    head.appendChild(style);
                }
                else
                {
                    ns.AddEventListener(document, "load", function AddStyle()
                    {
                        var element = document.head || GetHead();
                        if (!element)
                            return;
                        for (var l = 0; l !== styles.length; ++l)
                            element.appendChild(styles[l]); 
                    });
                }
            }
            styles.push(style);
        }
        return styles;
    }
    ns.AddStyles = function AddStyles(rules)
    {
        return AddDocumentStyles(document, rules);
    };
    var originalDate = Date;
    var originalGetTime = Date.prototype.getTime;
    var originalToIsoString = Date.prototype.toISOString;
    ns.GetCurrentIsoDate = function GetCurrentIsoDate()
    {
        return originalToIsoString.call(new originalDate());
    };
    ns.GetCurrentTime = function GetCurrentTime()
    {
        try
        {
            var date = new originalDate();
            if (date && originalGetTime)
                return originalGetTime.call(date);
            throw new Error("Cannot call getTime for date: " + date);
        }
        catch (e)
        {
            ns.SessionError(e);
            return 0;
        }
    };
    ns.GetPageScroll = function GetPageScroll()
    {
        var documentScrollLeft = 0;
        var documentScrollTop = 0;
        if (document.documentElement)
        {
            documentScrollLeft = document.documentElement.scrollLeft;
            documentScrollTop = document.documentElement.scrollTop;
        }
        var bodyScrollLeft = 0;
        var bodyScrollTop = 0;
        if (document.body)
        {
            bodyScrollLeft = document.body.scrollLeft;
            bodyScrollTop = document.body.scrollTop;
        }
        return { left: documentScrollLeft || bodyScrollLeft || 0, top: documentScrollTop || bodyScrollTop || 0 };
    };
    ns.GetPageHeight = function GetPageHeight()
    {
        return document.documentElement.clientHeight || document.body.clientHeight;
    };
    ns.GetPageWidth = function GetPageWidth()
    {
        return document.documentElement.clientWidth || document.body.clientWidth;
    };
    ns.IsDefined = function IsDefined(variable)
    {
        return typeof variable !== "undefined";
    };
    ns.StopProcessingEvent = function StopProcessingEvent(evt)
    {
        if (evt.preventDefault)
            evt.preventDefault();
        else
            evt.returnValue = false;
        if (evt.stopPropagation)
            evt.stopPropagation();
        if (ns.IsDefined(evt.cancelBubble))
            evt.cancelBubble = true;
    };
    function Base64EncodeUnicode(str)
    {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1)
            {
                return ns.StringFromCharCode("0x" + p1);
            }));
    }
    ns.ToBase64 = function ToBase64(value)
    {
        try
        {
            if (ns.IsDefined(window.btoa))
                return Base64EncodeUnicode(value);
            var Base64Alphabit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var plain = value;
            var padLength = 0;
            if (plain.length % 3)
            {
                padLength = 3 - (plain.length % 3);
                for (var j = 0; j < padLength; ++j)
                    plain += "\0";
            }
            var result = "";
            for (var i = 0; i < plain.length; i += 3)
            {
                var byte1 = plain.charCodeAt(i);
                var byte2 = plain.charCodeAt(i + 1);
                var byte3 = plain.charCodeAt(i + 2);
                var temp = (byte1 << 16) | (byte2 << 8) | byte3;
                var sixBit1 = (temp >> 18) & 0x3f;
                var sixBit2 = (temp >> 12) & 0x3f;
                var sixBit3 = (temp >> 6) & 0x3f;
                var sixBit4 = temp & 0x3f;
                result += Base64Alphabit.charAt(sixBit1) + Base64Alphabit.charAt(sixBit2) + Base64Alphabit.charAt(sixBit3) + Base64Alphabit.charAt(sixBit4);
            }
            if (padLength > 0)
            {
                result = result.slice(0, result.length - padLength);
                for (var k = 0; k < padLength; ++k)
                    result += "=";
            }
            return result;
        }
        catch (e)
        {
            ns.SessionError("Cannot convert to Base64: " + e.message, "common");
        }
        return "";
    };
    ns.StartLocationHref = document.location.href;
    ns.IsTopLevel = window && window === window.top;
    ns.IsElementVisibleCheckApplicable = function IsElementVisibleCheckApplicable()
    {
        return window && window.getComputedStyle;
    };
    ns.IsElementVisible = function IsElementVisible(element)
    {
        return window.getComputedStyle(element).visibility === "visible";
    };
    ns.IsElementDisplayed = function IsElementDisplayed(element)
    {
        var style = (ns.IsElementVisibleCheckApplicable() && element instanceof Element) ? window.getComputedStyle(element) : element.currentStyle;
        return style.display !== "none";
    };
    ns.DisableElementById = function DisableElementById(id)
    {
        const el = document.getElementById(id);
        if (el)
            el.classList.add("disabled");
    };
    ns.GetPageStartTime = function GetPageStartTime()
    {
        return window && window.performance && window.performance.timing && window.performance.timing.domContentLoadedEventStart
            ? window.performance.timing.domContentLoadedEventStart
            : 0;
    };
    ns.GetPageStartNavigationTime = function GetPageStartNavigationTime()
    {
        return window && window.performance && window.performance.timing && window.performance.timing.navigationStart
            ? window.performance.timing.navigationStart
            : 0;
    };
    ns.TryGetTagName = function TryGetTagName(element)
    {
        try
        {
            return element.tagName;
        }
        catch (e)
        {
            return "";
        }
    };
    var historyChangeSubscribers = [];
    function NotifyHistoryChanged()
    {
        try
        {
            for (var i = 0; i < historyChangeSubscribers.length; ++i)
            {
                try
                {
                    historyChangeSubscribers[i].notify();
                }
                catch (e)
                {
                    ns.SessionError(e, historyChangeSubscribers[i].injector);
                }
            }
        }
        catch (e)
        {
            ns.SessionError(e, "common");
        }
    }
    ns.SubscribeHistoryChanged = function SubscribeHistoryChanged(injector, callback)
    {
        historyChangeSubscribers.push({ injector: injector, notify: callback });
    };
    ns.UnsubscribeHistoryChanged = function UnsubscribeHistoryChanged(injector)
    {
        for (var i = 0; i < historyChangeSubscribers.length; ++i)
        {
            if (historyChangeSubscribers[i].injector === injector)
            {
                historyChangeSubscribers.splice(i, 1);
                return;
            }
        }
    };
    if (window.history)
    {
        var oldWindowHistory = window.history;
        var oldBack = window.history.back;
        var oldForward = window.history.forward;
        var oldGo = window.history.go;
        var oldPushState = window.history.pushState;
        var oldReplaceState = window.history.replaceState;
        window.history.back = function WrapperBack()
        {
            oldBack.apply(oldWindowHistory);
            NotifyHistoryChanged();
        };
        window.history.forward = function WrapperForward()
        {
            oldForward.apply(oldWindowHistory);
            NotifyHistoryChanged();
        };
        window.history.go = function WrapperGo()
        {
            oldGo.apply(oldWindowHistory, arguments);
            NotifyHistoryChanged();
        };
        window.history.pushState = function WrapperPushState()
        {
            oldPushState.apply(oldWindowHistory, arguments);
            NotifyHistoryChanged();
        };
        window.history.replaceState = function WrapperReplaceState()
        {
            oldReplaceState.apply(oldWindowHistory, arguments);
            NotifyHistoryChanged();
        };
        ns.WindowHistoryPushState = function PushStateExecutor()
        {
            oldPushState.apply(oldWindowHistory, arguments);
        };
    }
    else
    {
        ns.WindowHistoryPushState = ns.EmptyFunc;
    }
    return ns;
})(AvNs);
(function CommonMutation(ns)
{
    function IsElementNode(node)
    {
        return node.nodeType === 1; 
    }
    function IsNodeContainsElementWithTag(node, observeTag)
    {
        try
        {
            return observeTag === "*" || (IsElementNode(node) && (ns.IsStringEqualIgnoreCase(node.tagName, observeTag) || node.getElementsByTagName(observeTag).length > 0));
        }
        catch (e)
        {
            return false;
        }
    }
    function MutationChangeObserver(observeTag, pluginId)
    {
        var m_observer = null;
        var m_callback = null;
        var m_functionCheckInteresting = observeTag ? function functionCheckInteresting(node) { return IsNodeContainsElementWithTag(node, observeTag); } : IsElementNode;
        function ProcessNodeList(nodeList)
        {
            for (var i = 0; i < nodeList.length; ++i)
            {
                if (m_functionCheckInteresting(nodeList[i]))
                    return true;
            }
            return false;
        }
        function ProcessDomChange(records)
        {
            try
            {
                if (!m_callback)
                    return;
                for (var i = 0; i < records.length; ++i)
                {
                    var record = records[i];
                    if ((record.addedNodes.length && ProcessNodeList(record.addedNodes))
                        || (record.removedNodes.length && ProcessNodeList(record.removedNodes)))
                    {
                        m_callback();
                        return;
                    }
                }
            }
            catch (e)
            {
                ns.SessionError(e, pluginId);
            }
        }
        this.Start = function Start(callback)
        {
            m_callback = callback;
            m_observer = new MutationObserver(ProcessDomChange);
            m_observer.observe(document, { childList: true, subtree: true });
        };
        this.Stop = function Stop()
        {
            if (m_observer)
                m_observer.disconnect();
            m_observer = null;
            m_callback = null;
        };
    }
    function DomEventsChangeObserver(observeTag, pluginId)
    {
        var m_callback = null;
        var m_functionCheckInteresting = observeTag ? function functionCheckInteresting(node) { return IsNodeContainsElementWithTag(node, observeTag); } : IsElementNode;
        function ProcessEvent(event)
        {
            try
            {
                if (!m_callback)
                    return;
                if (m_functionCheckInteresting(event.target))
                    m_callback();
            }
            catch (e)
            {
                ns.SessionError(e, pluginId);
            }
        }
        this.Start = function Start(callback)
        {
            ns.AddRemovableEventListener(window, "DOMNodeInserted", ProcessEvent);
            ns.AddRemovableEventListener(window, "DOMNodeRemoved", ProcessEvent);
            m_callback = callback;
        };
        this.Stop = function Stop()
        {
            ns.RemoveEventListener(window, "DOMNodeInserted", ProcessEvent);
            ns.RemoveEventListener(window, "DOMNodeRemoved", ProcessEvent);
            m_callback = null;
        };
    }
    function TimeoutChangeObserver(observeTag)
    {
        var m_interval = null;
        var m_callback = null;
        var m_tagCount = 0;
        var m_attribute = "klot_" + ns.GetCurrentTime();
        function IsChangesOccure(nodeList)
        {
            for (var i = 0; i < nodeList.length; ++i)
            {
                if (!nodeList[i][m_attribute])
                    return true;
            }
            return false;
        }
        function FillTagInfo(nodeList)
        {
            m_tagCount = nodeList.length;
            for (var i = 0; i < m_tagCount; ++i)
                nodeList[i][m_attribute] = true;
        }
        function TimeoutProcess()
        {
            if (!m_callback)
                return;
            var nodeList = observeTag ? document.getElementsByTagName(observeTag) : document.getElementsByTagName("*");
            if (nodeList.length !== m_tagCount || IsChangesOccure(nodeList))
            {
                FillTagInfo(nodeList);
                m_callback();
            }
        }
        this.Start = function Start(callback)
        {
            m_callback = callback;
            FillTagInfo(document.getElementsByTagName(observeTag));
            m_interval = ns.SetInterval(TimeoutProcess, 10 * 1000);
            if (document.readyState !== "complete")
                ns.AddEventListener(window, "load", TimeoutProcess);
        };
        this.Stop = function Stop()
        {
            ns.ClearInterval(m_interval);
            m_callback = null;
        };
    }
    ns.GetDomChangeObserver = function GetDomChangeObserver(observeTag, pluginId)
    {
        var observeTagLowerCase = observeTag ? observeTag.toLowerCase() : observeTag;
        if (window.MutationObserver && document.documentMode !== 11)    
            return new MutationChangeObserver(observeTagLowerCase, pluginId);
        if (window.addEventListener)
            return new DomEventsChangeObserver(observeTagLowerCase, pluginId);
        return new TimeoutChangeObserver(observeTagLowerCase);
    };
    return ns;
})(AvNs);
(function Md5Main(ns)
{
    function repeatElem(e, t)
    {
        var r = [];
        for (var i = 0; i < t; i++)
            r = r.concat(e);
        return r;
    }
    var S = repeatElem([7, 12, 17, 22], 4);
    S = S.concat(repeatElem([5, 9, 14, 20], 4));
    S = S.concat(repeatElem([4, 11, 16, 23], 4));
    S = S.concat(repeatElem([6, 10, 15, 21], 4));
    var K = [
              0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
              0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
              0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
              0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
              0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
              0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
              0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
              0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
              0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
              0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
              0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
              0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
              0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
              0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
              0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
              0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
        ];
    var A0 = 0x67452301;
    var B0 = 0xefcdab89;
    var C0 = 0x98badcfe;
    var D0 = 0x10325476;
    function RotateLeft(i, s)
    {
        return ((i << s) | (i >>> (32 - s)));
    }
    function UnsignedSum(x, y)
    {
        return (x + y) & 0xFFFFFFFF;
    }
    function toHexString(v)
    {
        var s = "";
        for (var i = 0; i < 4; i++)
            s += ((v >>> ((i * 8) + 4)) & 0x0f).toString(16) + ((v >>> (i * 8)) & 0x0f).toString(16);
        return s;
    }
    function dataPrepare(inData)
    {
        var d = inData;
        var l = d.length;
        var res = [];
        d += ns.StringFromCharCode(0x80);
        while (d.length % 4) d += ns.StringFromCharCode(0x0);
        for (var i = 0; i < d.length; i += 4)
            res.push((d.charCodeAt(i)) | (d.charCodeAt(i + 1) << 8) | (d.charCodeAt(i + 2) << 16) | (d.charCodeAt(i + 3) << 24));
        while (res.length % 16 !== 14) res.push(0x0);
        res.push(l << 3);
        res.push(l >>> 29);
        return res;
    }
    ns.md5 = function md5(data)
    {
        var words = dataPrepare(data);
        var A = A0;
        var B = B0;
        var C = C0;
        var D = D0;
        for (var i = 0; i < words.length; i += 16)
        {
            var a = A;
            var b = B;
            var c = C;
            var d = D;
            var block = words.slice(i, i + 16);
            for (var j = 0; j < 64; j++)
            {
                var f = 0;
                var g = 0;
                switch (Math.floor(j / 16))
                {
                    case 0:
                        f = (b & c) | ((~b) & d);
                        g = j;
                        break;
                    case 1:
                        f = (d & b) | ((~d) & c);
                        g = (5 * j) + 1;
                        break;
                    case 2:
                        f = b ^ c ^ d;
                        g = (3 * j) + 5;
                        break;
                    case 3:
                        f = c ^ (b | (~d));
                        g = 7 * j;
                        break;
                    default:
                }
                g -= 16 * Math.floor(g / 16);
                f = UnsignedSum(UnsignedSum(f, a), UnsignedSum(K[j], block[g]));
                a = d;
                d = c;
                c = b;
                b = UnsignedSum(b, RotateLeft(f, S[j]));
            }
            A = UnsignedSum(A, a);
            B = UnsignedSum(B, b);
            C = UnsignedSum(C, c);
            D = UnsignedSum(D, d);
        }
        var digest = toHexString(A) + toHexString(B) + toHexString(C) + toHexString(D);
        return digest;
    };
})(AvNs);
(function AjaxTransportMain(ns)
{
var ajaxRequestProvider = (function ajaxRequestProvider()
    {
        return {
            GetAsyncRequest: function GetAsyncRequest()
                {
                    var xmlhttp = ns.XDomainRequest ? new ns.XDomainRequest() : new ns.XMLHttpRequest();
                    if (!ns.XDomainRequest)
                    {
                        xmlhttp.open = ns.XMLHttpRequestOpen;
                        xmlhttp.send = ns.XMLHttpRequestSend;
                        xmlhttp.abort = ns.XMLHttpRequestAbort;
                        xmlhttp.setRequestHeader = ns.XMLHttpRequestSetRequestHeader;
                    }
                    xmlhttp.onprogress = ns.EmptyFunc;
                    return xmlhttp;
                }
        };
    })();
var restoreSessionCallback = ns.EmptyFunc;
var PingPongCallReceiver = function PingPongCallReceiver(caller)
{
    var m_caller = caller;
    var m_isProductConnected = false;
    var m_pingWaitResponse = false;
    var m_requestDelay = ns.MaxRequestDelay;
    var m_requestTimer = null;
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    var m_updateCallback = ns.EmptyFunc;
    var m_pluginId = "ajax";
    var m_waitRequestsCount = 0;
    var m_stopped = false;
    function SendRequest()
    {
        try 
        {
            m_waitRequestsCount++;
            m_caller.Call(
                "from",
                null,
                null,
                function CallCallback(result, parameters, method)
                {
                    m_pingWaitResponse = false;
                    m_isProductConnected = true;
                    if (parameters === "undefined" || method === "undefined") 
                    {
                        m_errorCallback("AJAX pong is not received. Product is deactivated");
                        m_waitRequestsCount--;
                        return;
                    }
                    if (method)
                    {
                        ns.SetTimeout(function TimerCallback() { SendRequest(); }, 0, m_pluginId);
                        m_callCallback(method, parameters);
                    }
                    m_waitRequestsCount--;
                },
                function ErrorCallback(error)
                {
                    m_pingWaitResponse = false;
                    m_isProductConnected = false;
                    restoreSessionCallback();
                    m_errorCallback(error);
                    m_waitRequestsCount--;
                }
                );
            m_pingWaitResponse = true;
        }
        catch (e)
        {
            m_errorCallback("Ajax send ping exception: " + (e.message || e));
        }
    }
    function Ping()
    {
        try
        {
            if (m_stopped)
                return;
            if (m_pingWaitResponse)
            {
                m_requestTimer = ns.SetTimeout(Ping, 100, m_pluginId);
                return;
            }
            m_requestDelay = m_updateCallback();
            if (typeof (m_requestDelay) === "undefined")
                return;
            SendRequest();
            m_requestTimer = ns.SetTimeout(Ping, m_requestDelay, m_pluginId);
        }
        catch (e)
        {
            m_errorCallback("Send ping request: " + (e.message || e));
        }
    }
    this.StartReceive = function StartReceive(callCallback, errorCallback, updateCallback)
    {
        m_isProductConnected = true;
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        m_updateCallback = updateCallback;
        m_requestDelay = m_updateCallback();
        m_requestTimer = ns.SetTimeout(Ping, m_requestDelay, m_pluginId);
        m_stopped = false;
    };
    this.ForceReceive = function ForceReceive()
    {
        ns.ClearTimeout(m_requestTimer);
        m_requestTimer = ns.SetTimeout(Ping, 0, m_pluginId);
    };
    this.StopReceive = function StopReceive()
    {
        m_stopped = true;
        if (m_requestTimer)
        {
            ns.ClearTimeout(m_requestTimer);
            m_requestTimer = null;
        }
        m_callCallback = ns.EmptyFunc;
        m_errorCallback = ns.EmptyFunc;
        m_updateCallback = ns.EmptyFunc;
    };
    this.IsStarted = function IsStarted()
    {
        return m_requestTimer !== null;
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_isProductConnected;
    };
    this.GetWaitRequests = function GetWaitRequests()
    {
        if (m_requestTimer)
        {
            ns.ClearTimeout(m_requestTimer);
            m_requestTimer = null;
        }
        return m_waitRequestsCount;
    };
};
var LongPoolingReceiver = function LongPoolingReceiver(caller)
{
    var m_caller = caller;
    var m_isProductConnected = false;
    var m_isStarted = false;
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    var m_pluginId = "long_pooling";
    function SendRequest(onResponseCallback)
    {
        try 
        {
            m_isProductConnected = true;
            m_caller.Call(
                "longpooling",
                null,
                null,
                onResponseCallback,
                function ErrorCallback(error)
                {
                    m_isProductConnected = false;
                    restoreSessionCallback();
                    m_errorCallback(error);
                },
                true
                );
        }
        catch (e)
        {
            ns.SessionError(e, "ajax_longpooling");
            m_errorCallback("Ajax send ping exception: " + (e.message || e));
        }
    }
    function OnResponse(result, parameters, method)
    {
        if (!ns.IsDefined(parameters) || !ns.IsDefined(method))
        {
            m_errorCallback("AJAX pong is not received. Product is deactivated");
            return;
        }
        ns.SetTimeout(function TimerCallback() { SendRequest(OnResponse); }, 0, m_pluginId);
        if (method)
            m_callCallback(method, parameters);
    }
    this.StartReceive = function StartReceive(callCallback, errorCallback)
    {
        m_isStarted = true;
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        SendRequest(OnResponse);
    };
    this.ForceReceive = ns.EmptyFunc;
    this.StopReceive = function StopReceive()
    {
        m_isStarted = false;
        m_callCallback = ns.EmptyFunc;
        m_errorCallback = ns.EmptyFunc;
    };
    this.IsStarted = function IsStarted()
    {
        return m_isStarted;
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_isProductConnected;
    };
    this.GetWaitRequests = function GetWaitRequests()
    {
        return 0;
    };
};
var AjaxCallerImpl = function AjaxCallerImpl(onLongPoolingEnable)
{
    var m_path = ns.GetBaseUrl() + ns.SIGNATURE;
    var m_longPoolingRequest = null;
    var m_pluginId = "ajax_caller";
    function NoCacheParameter() 
    {
        return "&nocache=" + Math.floor((1 + Math.random()) * 0x10000).toString(16);
    }
    function PrepareRequestObject(command, commandAttribute, isPost, isSecondCall)
    {
        var request = ajaxRequestProvider.GetAsyncRequest();
        if (request)
        {
            var urlPath = m_path + "/" + command;
            if (commandAttribute)
                urlPath += "/" + commandAttribute;
            var timestampArgument = "tm=" + encodeURIComponent(ns.GetCurrentIsoDate());
            if (isPost)
            {
                urlPath += ((urlPath.indexOf("?") === -1) ? "?" : "&");
                urlPath += timestampArgument;
                if (isSecondCall)
                    urlPath += "&second=true";
                request.open("POST", urlPath);
            }
            else
            {
                if (urlPath.indexOf("?") === -1)
                    urlPath += "?get";
                urlPath += NoCacheParameter();
                urlPath += "&" + timestampArgument;
                request.open("GET", urlPath, true);
            }
            if (request.setRequestHeader && ns.IsRelativeTransport())
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        return request;
    }
    function ClearRequest(request)
    {
        request.onerror = ns.EmptyFunc;
        request.onload = ns.EmptyFunc;
    }
    function GetResponseText(request)
    {
        try
        {
            if (!ns.IsDefined(request.status) || request.status === 200)
                return request.responseText.toString();
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
        return "";
    }
    function AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, isSecondCall)
    {
        try
        {
            var request = PrepareRequestObject(command, commandAttribute, Boolean(data), isSecondCall);
            if (!request) 
            {
                callbackError && callbackError("Cannot create AJAX request!");
                return;
            }
            request.onerror = function onerror()
                {
                    ClearRequest(request);
                    if (!ns.IsDefined(isSecondCall))
                        AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, true);
                    else
                        callbackError && callbackError("AJAX request error for calling " + command + "/" + commandAttribute);
                };
            request.onload = function onload()
                {
                    try
                    {
                        ClearRequest(request);
                        if (ns.IsDefined(request.status) && request.status === 403)
                        {
                            callbackError && callbackError("Forbidden", { forbidden: true });
                            return;
                        }
                        if (callbackResult)
                        {
                            var responseText = GetResponseText(request);
                            if (responseText)
                            {
                                callbackResult(responseText);
                                return;
                            }
                            if (!ns.IsDefined(isSecondCall))
                            {
                                AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, true);
                                return;
                            }
                            if (callbackError)
                                callbackError("AJAX request with unsupported url type!"); 
                        }
                    }
                    catch (e)
                    {
                        ns.SessionError(e, m_pluginId);
                    }
                };
            if (isLongPoolingCall)
                m_longPoolingRequest = request;
            request.send(data);
        }
        catch (e)
        {
            if (callbackError)
                callbackError("AJAX request " + command  + "/" + commandAttribute + " exception: " + (e.message || e));
        }
    }
    this.Start = function Start(callbackSuccess)
    {
        callbackSuccess();
    };
    this.SendLog = function SendLog(message)
    {
        AsyncCall("log?" + encodeURIComponent(message));
    };
    this.SendResult = function SendResult(methodName, data)
    {
        AsyncCall("callResult", methodName, data);
    };
    function TryJsonParse(str)
    {
        try
        {
            return ns.JSONParse(str);
        }
        catch (e)
        {
            return null;
        }
    }
    this.Call = function Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall) 
    {
        AsyncCall(
            command,
            commandAttribute,
            data,
            function CallCallback(responseText)
            {
                var commandResponse = TryJsonParse(responseText);
                if (!commandResponse)
                {
                    callbackError && callbackError("Wrong body of call command. Body is: '" + responseText +
                        "', command is " + command + " command attribute is " + commandAttribute);
                    return;
                }
                if (commandResponse.result === -1610612735)
                {
                    AsyncCall(
                        command,
                        commandAttribute,
                        data,
                        function callCallback(response)
                        {
                            if (!callbackResult)
                                return;
                            commandResponse = ns.JSONParse(response);
                            callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
                        },
                        callbackError,
                        isLongPoolingCall
                        );
                }
                else if (callbackResult)
                {
                    callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
                }
            },
            callbackError,
            isLongPoolingCall
            );
    };
    this.SessionErrorCall = function SessionErrorCall(message)
    {
        AsyncCall("logerr", null, message);
    };
    this.UnhandledExceptionCall = function UnhandledExceptionCall(message)
    {
        AsyncCall("except", null, message);
    };
    this.Shutdown = function Shutdown()
    {
        if (m_longPoolingRequest)
        {
            if (m_longPoolingRequest.abort)
                m_longPoolingRequest.abort();
            ClearRequest(m_longPoolingRequest);
            m_longPoolingRequest = null;
        }
    };
    this.InitCall = function InitCall(initData, callbackResult, callbackError)
    {
        restoreSessionCallback = callbackError;
        if (ns.StartLocationHref === "data:text/html,chromewebdata")
            return callbackError();
        AsyncCall(
            "init?data=" + encodeURIComponent(ns.ToBase64(ns.JSONStringify(initData))),
            null,
            null,
            function AsyncCallCallback(responseText)
            {
                try
                {
                    var initSettings = ns.JSONParse(responseText);
                    m_path = ns.GetBaseUrl() + initSettings.ajaxId + "/" + initSettings.sessionId;
                    if (initSettings.longPooling)
                        onLongPoolingEnable();
                    callbackResult(initSettings);
                } 
                catch (e)
                {
                    restoreSessionCallback && restoreSessionCallback("Error " + e.name + ": " + e.message);
                }
            },
            callbackError
            );
    };
};
ns.Caller = function AjaxCaller()
{
    var m_switchToLongPooling = false;
    var m_caller = new AjaxCallerImpl(OnLongPoolingEnable);
    var m_receiver = new PingPongCallReceiver(m_caller);
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    function StartLongPooling(needRestartReceive)
    {
        m_receiver = new LongPoolingReceiver(m_caller);
        if (needRestartReceive)
            m_receiver.StartReceive(m_callCallback, m_errorCallback);
        ns.SessionLog("Switch to longpooling, receiver restarted: " + needRestartReceive);
    }
    function RestartReceiver()
    {
        var requestsCount = m_receiver.GetWaitRequests();
        if (requestsCount !== 0)
        {
            ns.SessionLog("Wait requests count: " + requestsCount);
            ns.SetTimeout(RestartReceiver, 100, "ajax_caller");
        }
        else
        {
            m_receiver.StopReceive();
            StartLongPooling(true);
        }
    }
    function SwitchToLongPooling()
    {
        var needRestartReceive = m_receiver.IsStarted();
        if (needRestartReceive)
            RestartReceiver();
        else
            StartLongPooling(false);
    }
    function OnLongPoolingEnable()
    {
        if (document.readyState === "complete")
            SwitchToLongPooling();
        else
            m_switchToLongPooling = true;
    }
    this.Start = function Start(callbackSuccess)
    {
        m_caller.Start(callbackSuccess);
    };
    this.SendLog = function SendLog(message)
    {
        m_caller.SendLog(message);
    };
    this.SendResult = function SendResult(methodName, data)
    {
        m_caller.SendResult(methodName, data);
    };
    this.Call = function Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall)
    {
        m_caller.Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall);
    };
    this.SessionErrorCall = function SessionErrorCall(message)
    {
        m_caller.SessionErrorCall(message);
    };
    this.UnhandledExceptionCall = function UnhandledExceptionCall(message)
    {
        m_caller.UnhandledExceptionCall(message);
    };
    this.Shutdown = function Shutdown()
    {
        m_caller.Shutdown();
    };
    this.InitCall = function InitCall(initData, callbackResult, callbackError)
    {
        return m_caller.InitCall(initData, callbackResult, callbackError);
    };
    this.GetReceiver = function GetReceiver()
    {
        return this;
    };
    this.StartReceive = function StartReceive(callCallback, errorCallback, updateCallback)
    {
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        m_receiver.StartReceive(callCallback, errorCallback, updateCallback);
    };
    this.ForceReceive = function ForceReceive()
    {
        m_receiver.ForceReceive();
    };
    this.StopReceive = function StopReceive()
    {
        m_receiver.StopReceive();
    };
    this.IsStarted = function IsStarted()
    {
        return m_receiver.IsStarted();
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_receiver.IsProductConnected();
    };
    ns.AddEventListener(window, "load", function onLoad()
    {
        if (m_switchToLongPooling)
            SwitchToLongPooling();
    }, "ajax_caller");
};
return ns;
})(AvNs);
var avSessionInstance = null;
(function SessionMain(ns)
{
    var runners = {};
    var lastPostponedInitTime = ns.GetCurrentTime();
    var postponedInitTimeout = null;
    var enableTracing = false;
    var initPending = false;
    var restartInterval = 0;
    var sessionMarkedForbidden = false;
    var ajaxId = "";
    var sessionId = "";
    if (ns.WORK_IDENTIFIERS)
    {
        var workIdentifiers = ns.StringSplit.call(ns.WORK_IDENTIFIERS, ",");
        for (var id = 0; id < workIdentifiers.length; ++id)
        {
            if (window[workIdentifiers[id]])
            {
                ns.AddRunner = ns.EmptyFunc;
                ns.AddRunner2 = ns.EmptyFunc;
                return;
            }
            window[workIdentifiers[id]] = true;
        }
    }
    var currentScriptPath = "";
    function removeThisScriptElement(injectId)
    {
        var pattern = injectId.toLowerCase();
        for (var i = 0, scriptsCount = document.scripts.length; i < scriptsCount; ++i) 
        {
            var tag = document.scripts[i];
            if (typeof tag.src === "string" && tag.src.length > 45 
                && tag.src.toLowerCase().indexOf(pattern) > 0 
                && (/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/main.js/).test(tag.src))
            {
                currentScriptPath = tag.src;
                tag.parentElement.removeChild(tag);
                break; 
            }
        }
    }
    if (ns.INJECT_ID)
        removeThisScriptElement(ns.INJECT_ID);
    var CallReceiver = function CallReceiver(caller)
    {
        var m_plugins = {};
        var m_receiver = caller.GetReceiver();
        var m_caller = caller;
        var m_selfMethods = {};
        function GetPluginIdFromMethodName(methodName)
        {
            if (methodName)
            {
                var names = ns.StringSplit.call(methodName, ".", 2);
                if (names.length === 2)
                    return names[0];
            }
            return null;
        }
        function GetPluginMethods(pluginId)
        {
            var plugin = m_plugins[pluginId];
            return plugin ? plugin.methods : null;
        }
        function CheckCommonMethodName(methodName)
        {
            if (methodName)
            {
                var names = ns.StringSplit.call(methodName, ".", 2);
                if (names.length === 1 && names[0] === methodName)
                    return true;
            }
            return false;
        }
        this.RegisterMethod = function RegisterMethod(methodName, callback)
        {
            var pluginId = GetPluginIdFromMethodName(methodName);
            if (pluginId)
            {
                var methods = GetPluginMethods(pluginId);
                if (methods)
                {
                    if (methods[methodName])
                        return;
                    methods[methodName] = callback;
                }
                else
                {
                    throw new Error("Cannot registered " + methodName);
                }
            }
            else if (CheckCommonMethodName(methodName))
            {
                if (m_selfMethods[methodName])
                    throw new Error("Already registered method " + methodName);
                m_selfMethods[methodName] = callback;
            }
        };
        function CallPluginMethod(pluginId, methodName, args)
        {
            var callback = null;
            if (pluginId)
            {
                var methods = GetPluginMethods(pluginId);
                if (methods) 
                    callback = methods[methodName];
            } 
            else
            {
                callback = m_selfMethods[methodName];
            }
            if (callback)
            {
                var result = {};
                try 
                {
                    if (args)
                        callback(ns.JSONParse(args));
                    else
                        callback();
                    result.success = true;
                    m_caller.SendResult(methodName, ns.JSONStringify(result));
                    return true;
                }
                catch (e)
                {
                    result.success = false;
                    m_caller.SendResult(methodName, ns.JSONStringify(result));
                    ns.SessionError(e, (pluginId ? pluginId : "common"));
                    return false;
                }
            }
            ns.SessionLog("Cannot call " + methodName + " for plugin " + (pluginId ? pluginId : "common"));
            return false;
        }
        function CallMethod(methodName, args)
        {
            var pluginId = GetPluginIdFromMethodName(methodName);
            if (pluginId || CheckCommonMethodName(methodName))
                CallPluginMethod(pluginId, methodName, args);
        }
        function ReportPluginError(pluginId, status)
        {
            var onError = m_plugins[pluginId].onError;
            if (onError)
                onError(status);
        }
        function ReportError(status)
        {
            for (var pluginId in m_plugins)
            {
                if (ns.ObjectHasOwnProperty.call(m_plugins, pluginId))
                    ReportPluginError(pluginId, status);
            }
        }
        function UpdateDelay()
        {
            var newDelay = ns.MaxRequestDelay;
            var currentTime = ns.GetCurrentTime();
            for (var pluginId in m_plugins)
            {
                if (!ns.ObjectHasOwnProperty.call(m_plugins, pluginId))
                    continue;
                try 
                {   
                    var onPing = m_plugins[pluginId].onPing;
                    if (onPing)
                    {
                        var delay = onPing(currentTime);
                        if (delay < newDelay && delay > 0 && delay < ns.MaxRequestDelay)
                            newDelay = delay;
                    }
                }
                catch (e)
                {
                    ReportPluginError(pluginId, "UpdateDelay: " + (e.message || e));
                }
            }
            return newDelay;
        }
        this.RegisterPlugin = function RegisterPlugin(pluginId, callbackPing, callbackError, callbackShutdown)
        {
            if (m_plugins[pluginId])
                return;
            var plugin = {
                onError: callbackError,
                onPing: callbackPing,
                onShutdown: callbackShutdown,
                methods: {}
            };
            m_plugins[pluginId] = plugin;
            if (!m_receiver.IsStarted())
                m_receiver.StartReceive(CallMethod, ReportError, UpdateDelay);
        };
        function IsPluginListEmpty()
        {
            for (var key in m_plugins)
            {
                if (ns.ObjectHasOwnProperty.call(m_plugins, key))
                    return false;
            }
            return true;
        }
        this.UnregisterPlugin = function UnregisterPlugin(pluginId)
        {
            delete m_plugins[pluginId];
            if (IsPluginListEmpty())
                m_receiver.StopReceive();
        };
        this.ForceReceive = function ForceReceive()
        {
            m_receiver.ForceReceive();
        };
        this.StopReceive = function StopReceive()
        {
            m_receiver.StopReceive();
        };
        this.UnregisterAll = function UnregisterAll()
        {
            if (IsPluginListEmpty())
                return;
            for (var key in m_plugins)
            {
                if (ns.ObjectHasOwnProperty.call(m_plugins, key)) 
                    m_plugins[key].onShutdown();
            }
            m_plugins = {};
        };
        this.IsEmpty = IsPluginListEmpty;
        this.IsProductConnected = function IsProductConnected()
        {
            return m_receiver.IsProductConnected();
        };
    };
    function LocalizationObjectFromDictionary(dictionary)
    {
        var object = {};
        if (dictionary)
        {
            for (var i = 0; i < dictionary.length; i++)
                object[dictionary[i].name] = dictionary[i].value;
        }
        return object;
    }
    function SettingsObjectFromSettingsJson(settingsJson)
    {
        var object = {};
        if (settingsJson)
            object = ns.JSONParse(settingsJson);
        return object;
    }
    var AvSessionClass = function AvSessionClass(caller)
    {
        var self = this;
        var m_caller = caller;
        var m_callReceiver = new CallReceiver(caller);
        function BeaconSend(command, commandAttribute, data)
        {
            try
            {
                var maxBeaconPackageSize = 64 * 1024;
                var size = maxBeaconPackageSize;
                if (typeof window.TextEncoder === "function")
                    size = data ? (new TextEncoder("utf-8").encode(data)).length : 0;
                if (navigator && navigator.sendBeacon && size < maxBeaconPackageSize)
                {
                    var urlPath = ns.GetBaseUrl() + ajaxId + "/" + sessionId + "/" + command + "/" + commandAttribute + "?tm=" + encodeURIComponent(ns.GetCurrentIsoDate());
                    return navigator.sendBeacon(urlPath, data);
                }
            }
            catch (e)
            {
                ns.Log("Error on beacon send " + e);
            }
            return false;
        }
        function Call(methodName, argsObj, callbackResult, callbackError)
        {
            if (!m_callReceiver.IsProductConnected())
                return;
            var callback = function callback(result, args, method)
                {
                    if (callbackResult)
                        callbackResult(result, args ? ns.JSONParse(args) : null, method);
                };
            var data = (argsObj)
                ? ns.JSONStringify(
                    {
                        result: 0,
                        method: methodName,
                        parameters: ns.JSONStringify(argsObj)
                    }
                    )
                : null;
            m_caller.Call("to", methodName, data, callback, callbackError);
        }
        function OnUnloadCall(methodName, arrayOfArgs)
        {
            var data = (arrayOfArgs)
                ? ns.JSONStringify(
                    {
                        result: 0,
                        method: methodName,
                        parameters: ns.JSONStringify(arrayOfArgs)
                    }
                    )
                : null;
            return BeaconSend("to", methodName, data);
        }
        function StopImpl(reason)
        {
            try
            {
                m_callReceiver.UnregisterAll();
                if (m_callReceiver.IsProductConnected())
                {
                    if (!BeaconSend("shutdown", reason))
                        m_caller.Call("shutdown", reason);
                }
                m_callReceiver.StopReceive();
                if (m_caller.Shutdown)
                    m_caller.Shutdown();
            }
            catch (e)
            {
            }
        }
        function DeactivatePlugin(pluginId)
        {
            m_callReceiver.UnregisterPlugin(pluginId);
            if (m_callReceiver.IsEmpty())
                StopImpl();
        }
        function ActivatePlugin(pluginId, callbackPing, callbackError, callbackShutdown)
        {
            m_callReceiver.RegisterPlugin(
                pluginId,
                callbackPing,
                function RegisterPluginOnError(e)
                {
                    callbackError && callbackError(e);
                    m_callReceiver.UnregisterPlugin(pluginId);
                    if (m_callReceiver.IsEmpty())
                        StopImpl();
                },
                function RegisterPluginOnShutdown()
                {
                    try
                    {
                        callbackShutdown && callbackShutdown();
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                }
            );
        }
        function RegisterMethod(methodName, callback)
        {
            m_callReceiver.RegisterMethod(methodName, callback);
        }
        function ReloadImpl()
        {
            if (ns.StartLocationHref !== document.location.href)
                ns.WindowHistoryPushState(0, document.title, ns.StartLocationHref);
            window.location.reload(true);
        }
        function ServiceWorkerAllowed()
        {
            try
            {
                return navigator && navigator.serviceWorker && navigator.serviceWorker.controller && navigator.serviceWorker.controller.state === "activated";
            }
            catch (e)
            {
                ns.SessionLog("Service worker not allowed. Error: " + e.message);
                return false;
            }
        }
        function Redirect(param)
        {
            document.location.href = param.targetUrl;
        }
        function ReloadPage()
        {
            if (ServiceWorkerAllowed())
            {
                ns.SetTimeout(ReloadImpl, 1000);
                navigator.serviceWorker.getRegistrations()
                    .then(function getRegistrationsThen(regs)
                        {
                            var countUnregistered = 0;
                            var rest = function rest()
                                {
                                    ++countUnregistered;
                                    if (countUnregistered === regs.length)
                                        ReloadImpl();
                                }; 
                            for (var i = 0; i < regs.length; ++i)
                            {
                                regs[i].unregister()
                                    .then(rest, rest);
                            }
                        }, ReloadImpl);
            }
            else
            {
                ns.SetTimeout(ReloadImpl, 300);
            }
        }
        function OnStartError(injectorName)
        {
            try 
            {
                var connectionErrorCallback = runners[injectorName].onConnectionError;
                if (connectionErrorCallback)
                    connectionErrorCallback();
            }
            catch (e)
            {
                ns.Log(e);
            }
        }
        function StartInjector(param)
        {
            var pluginStartData = {};
            var runner = runners[param.injectorName];
            if (runner && runner.getParameters)
                pluginStartData = { plugin: runner, parameters: ns.JSONStringify(runner.getParameters()) };
            var startData =
                {
                    url: ns.StartLocationHref,
                    plugins: param.injectorName,
                    data: { data: pluginStartData },
                    isTopLevel: ns.IsTopLevel,
                    pageStartTime: ns.GetPageStartTime(),
                    navigationStartTime: ns.GetPageStartNavigationTime()
                };
            m_caller.StartCall(
                startData,
                function StartCallCallback(plugin)
                {
                    if (runner && plugin)
                    {
                        var settings = ns.IsDefined(plugin.settingsJson) ? SettingsObjectFromSettingsJson(plugin.settingsJson) : plugin.settings;
                        var localization = ns.IsDefined(plugin.localizationDictionary) ? LocalizationObjectFromDictionary(plugin.localizationDictionary) : {};
                        runner.runner(AvNs, avSessionInstance, settings, localization);
                    }
                },
                function StartCallOnError()
                { 
                    OnStartError(param.injectorName);
                }
                );
        }
        function OnStopError(injectorName)
        {
            ns.Log("Stop " + injectorName + "injector failed");
        }
        function StopInjector(param)
        {
            var runner = runners[param.injectorName];
            m_caller.StopCall(
                param.injectorName,
                function StopCallCallback(plugin)
                {
                    try
                    {
                        if (runner && plugin && runner.stop)
                            runner.stop(AvNs, avSessionInstance);
                    }
                    catch (e)
                    {
                        ns.SessionError(e, plugin);
                    }
                },
                function StopCallOnError() { OnStopError(param.injectorName); }
                );
        }
        function GetErrorMessage(error)
        {
            var msg = "";
            if (error instanceof Error)
            {
                msg = error.message;
                if (error.stack)
                    msg += "\r\n" + error.stack;
            }
            else if (error instanceof Object)
            {
                msg = ns.JSONStringify(error);
            }
            else
            {
                msg = String(error);
            }
            return msg.length <= 2048 ? msg : (msg.substring(0, 2048) + "<...>");
        }
        function ExtractStackWithRegexp(stack, regexp)
        {
            var match = regexp.exec(stack);
            var result = [];
            while (match !== null)
            {
                result.push(match[1]);
                match = regexp.exec(stack);
            }
            return result;
        }
        function ExtractChromeStack(stack)
        {
            var chromeStackRegexp = /at ([\w\s.]*) \([\w-]*:\/\/[\w.-]*((?:\/[\w.\-\d]*)*)/g;
            return ExtractStackWithRegexp(stack, chromeStackRegexp);
        }
        function ExtractMozillaStack(stack)
        {
            var firefoxStackRegexp = /([\w.]*)@[\w-]*:\/\/[\w.-]*((?:\/[\w.-]*)*)/g;
            return ExtractStackWithRegexp(stack, firefoxStackRegexp);
        }
        function ExtractStack(error)
        {
            if (!error.stack)
                return "";
            var extractedChromeStack = ExtractChromeStack(error.stack);
            if (extractedChromeStack)
                return extractedChromeStack.join("\n");
            var extractedFirefoxStack = ExtractMozillaStack(error.stack);
            if (extractedFirefoxStack)
                return extractedFirefoxStack.join("\n");
            return error.stack;
        }
        RegisterMethod("redirect", Redirect);
        RegisterMethod("reload", ReloadPage);
        RegisterMethod("start", StartInjector);
        RegisterMethod("stop", StopInjector);
        this.Reload = function Reload()
        {
            ReloadPage();
        };
        this.Log = function Log(error)
        {
            try
            {
                if (!(this.IsProductConnected() && enableTracing))
                    return;
                m_caller.SendLog(GetErrorMessage(error));
            }
            catch (e)
            {
                ns.Log(e.message || e);
            }
        };
        this.LogError = function LogError(error, injector)
        {
            try
            {
                if (!m_callReceiver.IsProductConnected())
                    return;
                if (!injector)
                    injector = "common"; 
                var result = { injector: injector };
                var details = { topLevel: ns.IsTopLevel };
                if (typeof error === "object")
                {
                    result.error2 = error.message ? error.message : "unknown";
                    result.stack = ExtractStack(error);
                    details.errorDetails = error.details;
                    result.error = result.error2;
                    if (details.errorDetails)
                    {
                        result.error += "\n" + (typeof details.errorDetails === "object")
                            ? ns.JSONStringify(details.errorDetails)
                            : details.errorDetails;
                    }
                    if (result.stack)
                        result.error += "\n" + result.stack;
                }
                else
                {
                    result.error  = error;
                    var m = ns.StringSplit.call(error, "\n");
                    result.error2 = m[0];
                    details.errorDetails = m.slice(1).join("\n");
                }
                result.details = ns.JSONStringify(details);
                m_caller.SessionErrorCall(ns.JSONStringify(result));
            }
            catch (e)
            {
                ns.Log(e.message || e);
            }
        };
        function IsScriptletsException(message)
        {
            var match = message.match(/^([\w]*\s)?ReferenceError:\s([a-z\d]{7,9})$/);
            return match && match[2] && (match[2].length === 7 || match[2].length === 9);
        }
        function IsKnownError(message)
        {
            var knownErrors = [/^NetworkError[\s\W]/];
            return knownErrors.some(
                function MatchPattern(pattern)
                {
                    return message.match(pattern);
                }
            );
        }
        function IsNeedSkipError(e)
        {
            if (!m_callReceiver.IsProductConnected())
                return true;
            if (!e.filename || !currentScriptPath)
                return true;
            if (e.filename.indexOf(currentScriptPath) === -1)
                return true;
            if (!e.message || typeof e.message !== "string")
                return false;
            return IsScriptletsException(e.message) || IsKnownError(e.message);
        }
        this.UnhandledException = function UnhandledException(e)
        {
            try
            {
                if (IsNeedSkipError(e))
                    return;
                var errInfo = {};
                errInfo.error = e.message && e.message.length > 1024 ? (e.message.substring(0, 1019) + "<...>") : e.message;
                errInfo.script = e.filename && e.filename.length > 1024 ? (e.filename.substring(0, 1019) + "<...>") : e.filename;
                errInfo.line = e.lineno;
                errInfo.column = e.colno;
                if (e.error)
                    errInfo.stack = e.error.stack && e.error.stack.length > 2048 ? (e.error.stack.substring(0, 2043) + "<...>") : e.error.stack;
                m_caller.UnhandledExceptionCall(ns.JSONStringify(errInfo));
                return;
            }
            catch (ex)
            {
                ns.Log(ex.message || ex);
            }
        };
        this.ForceReceive = function ForceReceive()
        {
            m_callReceiver.ForceReceive();
        };
        this.IsProductConnected = function IsProductConnected()
        {
            return m_callReceiver.IsProductConnected();
        };
        this.InitializePlugin = function InitializePlugin(init)
        {
            init(
                function OnInitActivatePlugin()
                {
                    ActivatePlugin.apply(self, arguments);
                },
                function OnInitRegisterMethod()
                {
                    RegisterMethod.apply(self, arguments);
                },
                function OnInitCall()
                {
                    Call.apply(self, arguments);
                },
                function OnInitDeactivatePlugin()
                {
                    DeactivatePlugin.apply(self, arguments);
                },
                function OnInitOnUnloadCall()
                {
                    return OnUnloadCall.apply(self, arguments);
                }
            );
        };
        this.GetResource = function GetResource(resourcePostfix, callbackSuccess, callbackError)
        {
            if (!m_caller.ResourceCall)
                throw new Error("Not implemented on transport GetResource");
            m_caller.ResourceCall(resourcePostfix, callbackSuccess, callbackError);
        };
        this.Stop = function Stop(reason)
        {
            StopImpl(reason);
        };
    };
    ns.AddRunner = function AddRunner(pluginName, runnerFunc, initParameters, onConnectionError)
    {
        var options = {
            name: pluginName,
            runner: runnerFunc
        };
        if (initParameters)
            options.getParameters = function getParameters() { return initParameters; };
        if (onConnectionError)
            options.onConnectionError = onConnectionError;
        ns.AddRunner2(options);
    };
    ns.AddRunner2 = function AddRunner2(options)
    {
        var runnerItem = {
            runner: options.runner
        };
        if (options.stop)
            runnerItem.stop = options.stop;
        if (options.onConnectionError)
            runnerItem.onConnectionError = options.onConnectionError;
        if (options.getParameters)
            runnerItem.getParameters = options.getParameters;
        if (options.reject)
            runnerItem.reject = options.reject;
        runners[options.name] = runnerItem;
    };
    ns.SessionLog = function SessionLog(e)
    {
        if (avSessionInstance)
        {
            avSessionInstance.Log(e);
            return;
        }
        ns.Log(e);
    };
    ns.SessionError = function SessionError(e, injector)
    {
        if (avSessionInstance && avSessionInstance.IsProductConnected())
            avSessionInstance.LogError(e, injector);
        else
            ns.Log(e);
    };
    ns.AddEventListener(window, "error", function onError(e)
    {
        if (avSessionInstance)
            avSessionInstance.UnhandledException(e);
        else
            ns.Log(e);
    });
    ns.ContentSecurityPolicyNonceAttribute = ns.CSP_NONCE;
    function Init()
    {
        if (initPending || sessionMarkedForbidden)
            return;
        if (avSessionInstance && avSessionInstance.IsProductConnected())
            return;
        initPending = true;
        var caller = new ns.Caller();
        caller.Start(
            function StartCallback() 
            {
                var injectors = "";
                var pluginsInitData = [];
                var injectorNames = [];
                for (var runner in runners)
                {
                    if (!ns.ObjectHasOwnProperty.call(runners, runner))
                        continue;
                    if (injectors)
                        injectors += "&";
                    injectors += runner;
                    injectorNames.push(runner);
                    if (runners[runner].getParameters)
                        pluginsInitData.push({ plugin: runner, parameters: ns.JSONStringify(runners[runner].getParameters()) });
                }
                var initData = 
                    {
                        url: ns.StartLocationHref,
                        plugins: injectors,
                        data: { data: pluginsInitData },
                        isTopLevel: ns.IsTopLevel,
                        pageStartTime: ns.GetPageStartTime(),
                        navigationStartTime: ns.GetPageStartNavigationTime()
                    };
                caller.InitCall(
                    initData,
                    function InitCallCallback(initSettings)
                    {
                        ns.IsRtl = initSettings.rtl;
                        enableTracing = ns.IsDefined(initSettings.enableTracing) ? initSettings.enableTracing : true;
                        ajaxId = initSettings.ajaxId;
                        sessionId = initSettings.sessionId;
                        ns.GetCommandSrc = function GetCommandSrc()
                        {
                            return ns.GetBaseUrl() + initSettings.ajaxId + "/" + initSettings.sessionId;
                        };
                        avSessionInstance = new AvSessionClass(caller);
                        var plugins = initSettings.plugins || [];
                        for (var i = 0, pluginsCount = plugins.length; i < pluginsCount; ++i)
                        {
                            try
                            {
                                var plugin = plugins[i];
                                var runnerItem = runners[plugin.name];
                                if (runnerItem)
                                {
                                    var settings = ns.IsDefined(plugin.settingsJson) ? SettingsObjectFromSettingsJson(plugin.settingsJson) : plugin.settings;
                                    var localization = ns.IsDefined(plugin.localizationDictionary) 
                                        ? LocalizationObjectFromDictionary(plugin.localizationDictionary) 
                                        : plugin.localization;
                                    runnerItem.runner(AvNs, avSessionInstance, settings, localization);
                                }
                            }
                            catch (e)
                            {
                                e.message = "Init error: " + e.message;
                                ns.SessionError(e, plugins[i].name);
                            }
                        }
                        for (var j = 0; j < injectorNames.length; ++j)
                        {
                            try
                            {
                                var injectorName = injectorNames[j];
                                var runnerItemHolder = runners[injectorName];
                                if (!IsInjectorInActiveList(plugins, injectorName) && runnerItemHolder.reject)
                                    runnerItemHolder.reject();
                            }
                            catch (e)
                            {
                                ns.SessionError(e);
                            }
                        }
                        initPending = false;
                        ns.SessionLog("Session: " + initSettings.sessionId + " initialization complete time: " + ns.GetCurrentIsoDate() +
                            " document.readyState is " + document.readyState);
                    },
                    OnInitError
                    );
            },
            OnInitError
            );
    }
    function IsInjectorInActiveList(plugins, injectorName)
    {
        for (var i = 0; i < plugins.length; ++i)
        {
            if (plugins[i].name === injectorName)
                return true;
        }
        return false;
    }
    function PostponeInit()
    {
        var nowPostponeTime = ns.GetCurrentTime();
        var postponeDelay = (nowPostponeTime - lastPostponedInitTime) > 5000 ? 200 : 60 * 1000;
        lastPostponedInitTime = nowPostponeTime;
        ns.ClearTimeout(postponedInitTimeout);
        postponedInitTimeout = ns.SetTimeout(Init, postponeDelay);
    }
    function OnInitError(message, details)
    {
        if (details && details.forbidden)
        {
            ns.ClearInterval(restartInterval);
            restartInterval = 0;
            sessionMarkedForbidden = true;
        }
        else
        {
            PostponeInit();
        }
        for (var runner in runners)
        {
            if (!ns.ObjectHasOwnProperty.call(runners, runner))
                continue;
            try
            {
                var connectionErrorCallback = runners[runner].onConnectionError;
                if (connectionErrorCallback)
                    connectionErrorCallback();
            }
            catch (e)
            {
                ns.Log(e);
            }
        }
        initPending = false;
    }
    ns.StartSession = function StartSession()
    {
        ns.ClearInterval(restartInterval);
        restartInterval = ns.SetInterval(PostponeInit, 30000);        
        ns.AddEventListener(document, "DOMContentLoaded", PostponeInit);
        ns.AddEventListener(window, "load", PostponeInit);
        Init();
    };
    ns.StopSession = function StopSession(reason)
    {
        if (avSessionInstance)
            avSessionInstance.Stop(reason);
    };
    if ("onpageshow" in window)
    {
        ns.AddEventListener(
            window,
            "pageshow",
            function onPageShow(event)
            {
                if (event.persisted)
                    ns.StartSession();
            }
        );
    }
    ns.AddEventListener(
        window,
        ("onpagehide" in window) ? "pagehide" : "unload",
        function onShutdownEvent(evt)
        {
            ns.StopSession(evt.type);
        }
    );
})(AvNs);
AvNs.AddRunner("wsm", function AddRunnerWsm(ns, session)
{
    if (!ns.IsTopLevel)
        return;
    var m_callFunction = null;
    var m_activatedState = 0;
    var m_activatedStateChangeTimeout = null;
    var m_documentTitleIsAvailable = false;
    var m_stateChangeDelayTimeout = null;
    var m_processActivate = null;
    var m_pluginId = "wsm";
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function GetTitle()
    {
        if (typeof document.title !== "string")
            return "";
        return document.title;
    }
    function FireDeactivateEventImpl()
    {
        if (m_callFunction)
        {
            m_callFunction("wsm.sessionDeactivated", { title: GetTitle() }, function SessionDeactivatedCallback()
            {
                if (m_activatedState === 1)
                    m_processActivate();
                m_activatedState = 0;
            });
        }
        m_activatedState = 3;
    }
    function FireDeactivateEvent()
    {
        if (m_documentTitleIsAvailable)
            FireDeactivateEventImpl();
        else
            ns.ClearTimeout(m_stateChangeDelayTimeout);
    }
    function ProcessDeactivate()
    {
        ns.ClearTimeout(m_activatedStateChangeTimeout);
        m_activatedStateChangeTimeout = ns.SetTimeout(function TimerCallback()
            {
                if (m_activatedState === 2)
                    FireDeactivateEvent();
                else if (m_activatedState === 1)
                    m_activatedState = 3;
            }, 0, m_pluginId);
    }
    function FireActivateEventImpl()
    {
        if (m_callFunction)
        {
            m_callFunction("wsm.sessionActivated", { title: GetTitle() }, function SessionActivatedCallback()
            {
                if (m_activatedState === 3)
                    ProcessDeactivate();
                m_activatedState = 2;
            });
        }
        m_activatedState = 1;
    }
    function FireActivateEvent()
    {
        ns.ClearTimeout(m_stateChangeDelayTimeout);
        if (m_documentTitleIsAvailable || GetTitle())
        {
            m_documentTitleIsAvailable = true;
            FireActivateEventImpl();
        }
        else
        {
            m_stateChangeDelayTimeout = ns.SetTimeout(function TimerCallback()
                {
                    m_documentTitleIsAvailable = true;
                    m_processActivate();
                }, 500, m_pluginId);
        }
    }
    function ProcessActivate()
    {
        ns.ClearTimeout(m_activatedStateChangeTimeout);
        m_activatedStateChangeTimeout = ns.SetTimeout(function TimerCallback()
            {
                if (m_activatedState === 0)
                    FireActivateEvent();
                else if (m_activatedState === 3)
                    m_activatedState = 1;
            }, 0, m_pluginId);
    }
    function IsFocusedDocument()
    {
        return document.hasFocus && document.hasFocus();
    }
    function OnFocus()
    {
        if (m_callFunction)
            ProcessActivate();
    }
    function OnBlur()
    {
        if (m_callFunction && !IsFocusedDocument())
            ProcessDeactivate();
    }
    function OnHashChange()
    {
        var args = { newLocationUrl: ns.ToBase64(document.location.href), urlEncrypted: true };
        if (m_callFunction)
            m_callFunction("wsm.onHashChange", args);
    }
    function DelayHashChange()
    {
        ns.SetTimeout(OnHashChange, 100, m_pluginId);
    }
    function OnSessionShutdown()
    {
        ns.ClearTimeout(m_activatedStateChangeTimeout);
        m_activatedStateChangeTimeout = null;
        m_callFunction = null;
        ns.UnsubscribeHistoryChanged(m_pluginId);
    }
    function Initialize()
    {
        m_processActivate = ProcessActivate;
        session.InitializePlugin(function InitializePluginWsm(activatePlugin, registerMethod, callFunction)
        {
            m_callFunction = callFunction;
            activatePlugin(m_pluginId, OnPing, null, OnSessionShutdown);
        });
        if (IsFocusedDocument())
        {
            FireActivateEvent();
            ns.AddEventListener(window, "load", function OnLoad()
                {
                    if (!IsFocusedDocument())
                        ProcessDeactivate();
                }, m_pluginId);
        }
        if (window.addEventListener)
        {
            ns.AddEventListener(window, "focus", OnFocus, m_pluginId);
            ns.AddEventListener(window, "blur", OnBlur, m_pluginId);
        }
        else
        {
            ns.AddEventListener(document, "focusin", OnFocus, m_pluginId);
            ns.AddEventListener(document, "focusout", OnBlur, m_pluginId);
        }
        if ("onhashchange" in window)
            ns.AddEventListener(window, "hashchange", OnHashChange, m_pluginId);
        ns.SubscribeHistoryChanged(m_pluginId, DelayHashChange);
    }
    Initialize();
}, {
    referrer: document.referrer,
    stubId: (function stubId()
    {
        var scripts = [];
        if (AvNs.HasDocumentQuerySelectorAll())
        {
            scripts = AvNs.DocumentQuerySelectorAll("[stubid]");
        }
        else
        {
            var allElements = document.getElementsByTagName("*");
            for (var i = 0; i < allElements.length; i++)
            {
                if (allElements[i].getAttribute("stubid") !== null)
                    scripts.push(allElements[i]);
            }
        }
        if (scripts && scripts.length > 0)
            return scripts[0].getAttribute("stubid");
        return "";
    })()
});
var compromisedAccountHandler = AvNs.EmptyFunc;
var eventHandler = function eventHandler(arg) { compromisedAccountHandler(arg); };
AvNs.AddEventListener(document, "click", eventHandler, "ca");
AvNs.AddEventListener(document, "keydown", eventHandler, "ca");
AvNs.AddEventListener(document, "submit", eventHandler, "ca");
AvNs.AddRunner("ca", function AddRunnerCA(ns, session, settings)
{
    var m_callFunction = ns.EmptyFunc;
    var m_onUnloadCallFunction = ns.EmptyFunc;
    var m_bodySended = false;
    var m_lastSendedTime = 0;
    var m_domParser = ns.GetDomParser(session);
    var m_logins = [];
    var m_passwords = [];
    var m_forms = [];
    var m_buttons = [];
    var m_settings = settings;
    var m_submitCall = false;
    var m_pluginId = "ca";
    function CallService(commandName, argObject)
    {
        m_callFunction("ca." + commandName, argObject, null, null);
    }
    function TryOnUnloadCallService(commandName, argObject, resultCallback)
    {
        return m_onUnloadCallFunction("ca." + commandName, argObject, resultCallback);
    }
    function ProcessBeforeUnload()
    {
        try
        {
            if (!m_submitCall)
                return;
            var domWithWfd = m_domParser.SetWfdIds();
            if (!TryOnUnloadCallService("onHtml", { dom: domWithWfd }))
                CallService("onHtml", { dom: domWithWfd });
        }
        catch (e)
        {
            if (e.message === "out of memory")
            {
                ns.SessionLog("CA: Out of memory occured. Failed send dom before unload");
                return;
            }
            throw e;
        }
    }
    function OnSubmitWithAutofill(arg)
    {
        ns.SessionLog("=> OnSubmit with autofill eventType: " + arg.type);
        if (m_submitCall)
            return;
        m_submitCall = true;
        ns.AddEventListener(window, "beforeunload", ProcessBeforeUnload, m_pluginId);
    }
    function IsInList(element, elementList)
    {
        for (var i = 0; i < elementList.length; ++i)
        {
            if (element === elementList[i])
                return true;
        }
        return false;
    }
    function AddButtonsToList(submitButtons)
    {
        for (var i = 0; i < submitButtons.length; ++i)
        {
            var button = submitButtons[i];
            if (!IsInList(button, m_buttons))
                m_buttons.push(button);
        }
    }
    function GetElements(root, tag, type)
    {
        var selector = tag + "[type='" + type + "']";
        if (root === document)
        {
            if (ns.HasDocumentQuerySelectorAll())
                return ns.DocumentQuerySelectorAll(selector);
        }
        else if (ns.HasElementQuerySelectorAll())
        {
            return ns.ElementQuerySelectorAll(root, selector);
        }
        var result = [];
        var childrens = root.getElementsByTagName(tag);
        for (var i = 0; i < childrens.length; i++) 
        {
            if (ns.IsStringEqualIgnoreCase(childrens[i].type, type)) 
                result.push(childrens[i]);
        }
        return result;
    }
    function GetSingleButton()
    {
        var buttons = GetElements(document, "button", "submit"); 
        if (buttons && buttons.length > 0) 
            return buttons;
        buttons = document.getElementsByTagName("button");
        if (buttons && buttons.length === 1) 
            return buttons[0];
        var result = [];
        for (var i = 0; i < buttons.length; i++) 
        {
            if (ns.IsElementDisplayed(buttons[i])) 
                result.push(buttons[i]);
        }
        return result.length === 1 ? result[0] : [];
    }
    function OnGetPasswordSelectors(form)
    {
        return function Callback(result, selectors)
        {
            if (result !== 0 || selectors.length === 0)
            {
                ns.SessionLog("Couldn't get password selectors. Result: " + result + " selectors size: " + selectors.length);
                return;
            }
            for (var i = 0; i < selectors.length; ++i)
            {
                var passwordElement = document.querySelector(selectors[i]);
                if (!passwordElement)
                {
                    ns.SessionLog("Couldn't find element for password selector " + selectors[i]);
                    continue;
                }
                if (form.contains(passwordElement))
                {
                    ns.SessionLog("Form contains element for password selector " + selectors[i]);
                    m_passwords.push(passwordElement);
                }
            }
        };
    }
    function AddLoginInputToList(accountElement)
    {
        if (IsInList(accountElement, m_logins))
            return;
        ns.SessionLog("setting Enter Key event handlers for " + accountElement.id);
        m_logins.push(accountElement);
        if (accountElement.form)
        {
            var parentForm = accountElement.form;
            if (!IsInList(parentForm, m_forms))
            {
                ns.SessionLog("setting form submit event handlers for " + accountElement.id);
                m_forms.push(parentForm);
                m_domParser.GetPasswordSelectors(OnGetPasswordSelectors(parentForm));
            }
            ns.SessionLog("setting button click event handlers for " + accountElement.id);
            AddButtonsToList(GetElements(parentForm, "input", "submit"));
            AddButtonsToList(GetElements(parentForm, "button", "submit"));
            AddButtonsToList(GetElements(parentForm, "button", "button"));
        }
        else
        {
            ns.SessionLog("setting button click event handlers for " + accountElement.id);
            AddButtonsToList(GetSingleButton());
        }
    }
    function OnSubmit(arg)
    {
        var target = arg.target || arg.srcElement;
        ns.SessionLog("=> OnSubmit eventType: " + arg.type + " , target: " + target.id);
        if (arg.type === "keydown")
        {
            if (arg.keyCode !== 13)
                return;
            if (!IsInList(target, m_buttons) && !IsInList(target, m_logins) && !IsInList(target, m_passwords) && !IsInList(target, m_forms))
                return;
        }
        else if (arg.type === "click")
        {
            if (!IsInList(target, m_buttons) && !(target.parentElement && IsInList(target.parentElement, m_buttons)))
                return;
        }
        else if (arg.type === "submit")
        {
            if (!IsInList(target, m_forms))
                return;
        }
        var currentTime = ns.GetCurrentTime();
        if (currentTime - 500 < m_lastSendedTime)
        {
            ns.SessionLog("skipping OnSubmit due to timing");
            return; 
        }
        var accounts = [];
        for (var i = 0; i < m_logins.length; ++i)
        {
            var accountElement = m_logins[i];
            if (accountElement.value)
                accounts.push(ns.ToBase64(accountElement.value));
        }
        if (accounts.length > 0)
        {
            if (!TryOnUnloadCallService("onAccount", { accounts: accounts }))
                CallService("onAccount", { accounts: accounts });
            m_lastSendedTime = currentTime;
        }
        else
        {
            ns.SessionLog("CA: OnSubmit with no data occure");
        }
        ns.SessionLog("<= OnSubmit eventType: " + arg.type + " , target: " + target.id);
    }
    function OnGetLoginSelectors(result, onInputData)
    {
        m_submitCall = false;
        if (result !== 0 || onInputData.length === 0)
        {
            ns.SessionLog("Couldn't get login selectors. Result: " + result + " selectors size: " + onInputData.length);
            m_bodySended = false;
            return;
        }
        compromisedAccountHandler = OnSubmit;
        for (var i = 0; i < onInputData.length; ++i)
        {
            var accountElement = document.querySelector(onInputData[i]);
            if (!accountElement)
            {
                ns.SessionLog("Couldn't find element for login selector " + onInputData[i]);
                continue;
            }
            AddLoginInputToList(accountElement);
        }
    }
    function OnKeyDown(arg)
    {
        if (m_bodySended || arg.key === "F5")
            return;
        ns.SessionLog("Find login selectors.");
        m_bodySended = true;
        if (m_settings.submitHandlerEnabled)
            compromisedAccountHandler = OnSubmitWithAutofill;
        m_domParser.GetLoginSelectors(OnGetLoginSelectors);
    }
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function OnInitializeCallback(activatePlugin, registerMethod, callFunction, deactivate, onUnloadCall)
    {
        m_callFunction = callFunction;
        m_onUnloadCallFunction = onUnloadCall;
        activatePlugin(m_pluginId, OnPing);
        ns.AddEventListener(document, "keydown", OnKeyDown, m_pluginId);
    }
    function InitializePlugin()
    {
        session.InitializePlugin(OnInitializeCallback);
        ns.SessionLog("Compromised account ready.");
    }
    InitializePlugin();
});
var PasswordStrengthChecker = (function () {
    var checker = null;
    var SCORES_EXCELLENT = 100;
    var SCORES_GOOD = 75;
    var SCORES_BAD = 64;
    var UGLY_LEN = 7;
    var LEVEL_EXCELLENT = 0;
    var LEVEL_GOOD = 1;
    var LEVEL_BAD = 2;
    var LEVEL_UGLY = 3;
    var REASON_KEYBOARD = 0;
    var REASON_SEQUENCE = 1;
    var REASON_LENGTH = 2;
    var REASON_REPEATED_CHARS = 3;
    var REASON_REPEATED_SEQUENCE = 4;
    var REASON_LAST_VALUE = 5;
    var PATTERN_NO_PATTERN = 0;
    var PATTERN_REPEAT = 1;
    var PATTERN_SEQUENCE = 2;
    var PATTERN_KEYBOARD = 3;
    var PATTERN_REPEAT_SEQUENCE = 4;
    var PATTERN_LAST_VALUE = 5;
    var ALPHABET_ID_NONE = 0
    var ALPHABET_ID_DIGIT = 1
    var ALPHABET_ID_LATIN = 2
    var ALPHABET_ID_OTHER_BEGIN = 3
    var CARDINALITY_DIGIT = (0x00000100 | 10)
    var CARDINALITY_LATIN_UPPER = (0x00000200 | 26)
    var CARDINALITY_LATIN_LOWER = (0x00000300 | 26)
    var CARDINALITY_SPEC = (0x00000400 | 33)
    var CARDINALITY_NONPRINTABLE_ASCII = (0x00000500 | 33)
    function KasPassCheck() {
        var DBL_MAX = 1.7976931348623158e+308;
        var g_min_around_count = 3;
        var g_max_sequence_diff = 5;
        var g_min_sequence_count = 3;
        var g_min_repeat_count = 3;
        var g_middle_additional = 2;
        var cyrillic =
            "{\
                \"name\": \"cyrillic\",\
                \"alphabet_lower\" : \"абвгдеёжзийклмнопрстуфхцчшщъыьэюя\",\
                \"alphabet_upper\" : \"АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ\",\
                \"mapping_latin_qwerty_lower\" : \"f,dult\`;pbqrkvyjghcnea[wxio]sm'.z\",\
                \"mapping_latin_qwerty_upper\" : \"F<DULT~:PBQRKVYJGHCNEA{WXIO}SM\\\">Z\"\
            }";
        var german =
            "{\
                \"name\": \"german\",\
                \"alphabet_lower\": \"äöüß\",\
                \"alphabet_upper\" : \"ÄÖÜẞ\",\
                \"mapping_latin_qwerty_lower\" : \"';[-\",\
                \"mapping_latin_qwerty_upper\" : \"\\\":{_\"\
            }";
        if (typeof Object.assign != 'function') {
            Object.assign = function (target, varArgs) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                var to = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];
                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            };
        }
        function assert(value, message) {
            if (value != true) {
                message = "assert: " + message;
                throw message;
            }
        }
        function log2(number) {
            return Math.log(number) / Math.log(2);
        }
        function utf8_decode_char_size(data) {
            var ret = 0;
            var code = data.charCodeAt(0);
            var size = data.length;
            var ch = data[0];
            if ((ch >> 7) == 0 && size > 0) {
                ret = 1;
            }
            else if ((ch >> 5) == 0x6 && size > 1) {
                ret = 2;
            }
            else if ((ch >> 4) == 0xE && size > 2) {
                ret = 3;
            }
            else if ((ch >> 3) == 0x1E && size > 3) {
                ret = 4;
            }
            else {
                return 0;
            }
            assert(ret > 0);
            for (var k = 1; k < ret; k++) {
                if ((data[k] >> 6) != 2) {
                    return 0;
                }
            }
            return ret;
        }
        function utf8_to_vector32(utf8) {
            var ret = [];
            for (var i = 0; i < utf8.length; i++) {
                var chars = encodeURIComponent(utf8[i]);
                chars = unescape(chars);
                var a8 = [0, 0, 0, 0];
                var y = 0;
                for (var k = chars.length - 1; k >= 0; k--) {
                    a8[y] = chars.charCodeAt(k);
                    y++;
                }
                var val32 = 0xFFFFFFFF;
                val32 = (a8[3] & 0xFF) << 24;
                val32 = val32 | ((a8[2] & 0xFF) << 16);
                val32 = val32 | ((a8[1] & 0xFF) << 8);
                val32 = val32 | (a8[0] & 0xFF);
                ret.push({ ch: val32, ch_size: chars.length });
            }
            return ret;
        }
        function deserialize_built_in_alphabets() {
            var ret = [];
            ret.push(JSON.parse(cyrillic));
            ret.push(JSON.parse(german));
            for (var i = 0; i < ret.length; i++) {
                ret[i].vec32_lower = utf8_to_vector32(ret[i].alphabet_lower);
                ret[i].vec32_upper = utf8_to_vector32(ret[i].alphabet_upper);
            }
            return ret;
        }
        var built_in_alphabets = deserialize_built_in_alphabets();
        function mycopy(val) {
            return Object.assign({}, val);
        }
        function CharInfo() {
            this.cardinality = 0;
            this.alphabet_id = ALPHABET_ID_NONE;
            this.ch = 0;
            this.ch_size = 1;
            this.mapped_latin_key = -1;
            this.shift = false;
            this.islowercase = false;
            this.isuppercase = false;
            this.alphabet_index = 0; 
            this.around_keys = "";
        };
        function get_1byte_char_class(info) {
            var shift_spec = "~!@#$%^&*()_+{}:\"|<>?";
            var ch = String.fromCharCode(info.ch);
            info.mapped_latin_key = ch;
            info.around_keys = get_around_keys(ch);
            if (ch >= '0' && ch <= '9') {
                info.alphabet_index = ch.charCodeAt(0) - '0'.charCodeAt(0);
                info.cardinality = CARDINALITY_DIGIT;
                info.alphabet_id = ALPHABET_ID_DIGIT;
            }
            else if (ch >= 'a' && ch <= 'z') {
                info.alphabet_index = ch.charCodeAt(0) - 'a'.charCodeAt(0);
                info.alphabet_id = ALPHABET_ID_LATIN;
                info.cardinality = CARDINALITY_LATIN_LOWER;
                info.islowercase = true;
            }
            else if (ch >= 'A' && ch <= 'Z') {
                info.alphabet_index = info.alphabet_index = ch.charCodeAt(0) - 'A'.charCodeAt(0);
                info.alphabet_id = ALPHABET_ID_LATIN;
                info.cardinality = CARDINALITY_LATIN_UPPER;
                info.isuppercase = true;
                info.shift = true;
            }
            else if (info.ch < 0x7F && info.ch >= 0x20) 
            {
                info.cardinality = CARDINALITY_SPEC;
                info.shift = shift_spec.indexOf(ch) != -1;
            }
            else {
                info.cardinality = CARDINALITY_NONPRINTABLE_ASCII;
            }
        }
        function Compare(vec, count, off) {
            assert(count != 0, "Compare()");
            assert(vec.length > count, "Compare()");
            assert(vec.length - count >= off, "Compare()");
            for (var i = 0; i < count; i++) {
                if (vec[i].ch != vec[i + off].ch) {
                    return false;
                }
            }
            return true;
        }
        var g_map_keys = init_around_keys();
        function init_around_keys() {
            var ret = [];
            var keys_arr =
                [
                    "`~1!", "1!`q2~Q@", "2@1qw3!QW#", "3#2we4@WE$", "4$3er5#ER%", "5%4rt6$RT^", "6^5ty7%TY&", "7&6yu8^YU*",
                    "8*7ui9&UI(", "9(8io0*IO)", "0)9op-(OP_", "-_0p[=)P{+", "=+-[]_{}",
                    "qQ1asw2!ASW@", "wW2qasde3@QASDE#", "eE3wsdfr4#WSDFR$", "rR4edfgt5$EDFGT%", "tT5rfghy6%RFGHY^", "yY6tghju7^TGHJU&",
                    "uU7yhjki8&YHJKI*", "iI8ujklo9*UJKLO(", "oO9ikl;p0(IKL:P)", "pP0ol;'[-)OL:\"{_", "[{-p;'\\]=_P:\"|}+", "]}=['\\+{\"|",
                    "aAqzxswQZXSW", "sSwazxdeWAZXDE", "dDesxcfrESXCFR", "fFrdcvgtRDCVGT", "gGtfvbhyTFVBHY", "hHygbnjuYGBNJU", "jJuhnmkiUHNMKI",
                    "kKijm,loIJM<LO", "lLok,.;pOK<>:P", ";:pl./'[PL>?\"{", "'\"[;/\\]{:?|}", "\\|]'}\"",
                    "zZaxsAXS", "xXsz cdSZ CD", "cCdx vfDX VF", "vVfc bgFCBG ", "bBgvnh GVNH ", "nNhbmj HBMJ ", "mMjn,k JN<K ", ",<km.l KM>L ",
                    ".>l,/;L<?:", "/?';.\":>", "  xcvbnm,.XCVBNM<>"
                ];
            for (var i = 0; i < keys_arr.length; i++) {
                var str = keys_arr[i];
                ret.push({ key: str[0], value: str.substring(2) });
                ret.push({ key: str[1], value: str.substring(2) });
            }
            ret.pop(); 
            ret.sort();
            for (var i = 0; i < ret.length - 1; i++) {
                assert(ret[i].key != ret[i + 1].key, "logic error: map.key is not unique");
            }
            return ret;
        }
        function get_around_keys(ch) {
            for (var i in g_map_keys) {
                if (g_map_keys[i].key == ch) {
                    return g_map_keys[i].value;
                }
            }
            return "";
        }
        function DIFF(a, b) {
            if (a > b) {
                return a - b;
            }
            return b - a;
        }
        function is_diff_equal(val1, val2, needed) {
            if ((val1.alphabet_id == ALPHABET_ID_NONE) || (val1.alphabet_id != val2.alphabet_id)) {
                return false;
            }
            var diff = DIFF(val1.alphabet_index, val2.alphabet_index);
            return diff == needed;
        }
        function Scores() {
            this.begin = 0;
            this.count = 0;
            this.entropy = 0.0;
            this.multipart_entropy = 0.0;
            this.type = PATTERN_NO_PATTERN;
            this.repeat = 1;
        };
        function Context() {
            this.path = [];
            this.char_info = []
            this.begin = -1;
            this.char_entropy = 0.0;
        };
        function add_scores(path_arr, scores, payload_count) {
            if (scores.begin && scores.count != payload_count && scores.type != PATTERN_NO_PATTERN) {
                scores.multipart_entropy = scores.entropy + g_middle_additional;
            }
            else {
                scores.multipart_entropy = scores.entropy;
            }
            var idx = 0;
            for (; idx < path_arr.length; ++idx) {
                var el = path_arr[idx];
                if (el.count < scores.count) {
                    continue;
                }
                if (el.count > scores.count) {
                    break;
                }
                if (el.multipart_entropy > scores.multipart_entropy) {
                    path_arr.splice(idx, 0, mycopy(scores));
                }
                return;
            }
            path_arr.splice(idx, 0, mycopy(scores));
        }
        function add_multiple_pattern_scores(path_arr, char_info, scores) {
            var repeat = 2;
            var multi = mycopy(scores);
            var off = scores.count;
            while (off + scores.count <= char_info.length) {
                if (!Compare(char_info, scores.count, off)) {
                    break;
                }
                off += scores.count;
                multi.count = off;
                multi.entropy = scores.entropy + log2(repeat);
                multi.repeat = repeat;
                add_scores(path_arr, multi, char_info.length);
                repeat++;
            }
        }
        function get_keys_count(char_info_arr, size) {
            assert(char_info_arr.length >= size, "get_keys_count()");
            var count = 1;
            for (var i = 1; i < size; i++) {
                var left = char_info_arr[i - 1];
                var right = char_info_arr[i];
                if (-1 == left.around_keys.indexOf(right.mapped_latin_key)) {
                    break;
                }
                count++;
            }
            return count;
        }
        function add_around_key_scores(ctx) {
            var count = ctx.char_info.length;
            while (count >= g_min_around_count) {
                count = get_keys_count(ctx.char_info, count);
                if (count < g_min_around_count) {
                    break;
                }
                var shift = 0;
                for (var i = 0; i < count; i++) {
                    if (ctx.char_info[i].shift) {
                        shift++;
                    }
                }
                var ent = ctx.char_entropy;
                var K = shift != 0 && shift != count ? 1 : 0.5;
                for (var i = 0; i < count - 1; i++) {
                    var d = ctx.char_info[i].around_keys.length * K;
                    ent += log2(d);
                }
                var scores = new Scores;
                scores.count = count;
                scores.entropy = ent;
                scores.begin = ctx.begin;
                scores.type = PATTERN_KEYBOARD;
                add_multiple_pattern_scores(ctx.path, ctx.char_info, scores);
                add_scores(ctx.path, scores, ctx.char_info.length);
                count--;
            }
        }
        function add_repeated_sequence_scores(ctx) {
            for (var count = Math.floor(ctx.char_info.length / 2); count > 1; count--) {
                var repeat = 2;
                var off = count;
                while (off + count <= ctx.char_info.length) {
                    if (false == Compare(ctx.char_info, count, off)) {
                        break;
                    }
                    var cardinality = get_cardinality(ctx.char_info, count);
                    var scores = new Scores;
                    scores.type = PATTERN_REPEAT_SEQUENCE;
                    scores.repeat = repeat;
                    scores.entropy = log2(cardinality) * count + log2(repeat);
                    scores.begin = ctx.begin;
                    off += count;
                    scores.count = off;
                    add_scores(ctx.path, scores, ctx.char_info.length);
                    repeat++;
                }
            }
        }
        function add_repeated_chars_scores(ctx) {
            var repeat = 1;
            for (; repeat < ctx.char_info.length; repeat++) {
                if (ctx.char_info[0].ch != ctx.char_info[repeat].ch) {
                    break;
                }
            }
            if (repeat >= g_min_repeat_count) {
                var cardinality = get_cardinality(ctx.char_info, 1);
                var scores = new Scores;
                scores.type = PATTERN_REPEAT;
                scores.begin = ctx.begin;
                for (var i = repeat; i >= g_min_repeat_count; --i) {
                    scores.count = i;
                    scores.entropy = log2(cardinality * i);
                    add_scores(ctx.path, scores, ctx.char_info.length);
                }
            }
        }
        function get_ascii_sequence_addition_entrophy(char_info, count) {
            var first = char_info[0];
            var second = char_info[1];
            var ent = 0;
            var tmp = "aAzZ019";
            var idx = tmp.indexOf(first.mapped_latin_key);
            if (idx != -1) {
                ent = 1;
            }
            else {
                ent = log2(get_cardinality(char_info, count));
            }
            if (first.alphabet_index > second.alphabet_index) {
                ent += 1;
            }
            return ent;
        }
        function get_utf8_sequence_addition_entrophy(char_info, count) {
            var first = char_info[0];
            var second = char_info[1];
            var ent = 0;
            if (first.alphabet_index == 0 || first.alphabet_index == (0x000000FF & first.cardinality) - 1) {
                ent = 1;
            }
            else {
                ent = log2(get_cardinality(char_info, count));
            }
            if (first.alphabet_index > second.alphabet_index) {
                ent += 1;
            }
            return ent;
        }
        function get_sequence_addition_entrophy(char_info, count) {
            if (char_info[0].ch_size == 1) {
                return get_ascii_sequence_addition_entrophy(char_info, count);
            }
            return get_utf8_sequence_addition_entrophy(char_info, count);
        }
        function add_sequences_scores(ctx) {
            if (ctx.char_info.length < g_min_sequence_count) {
                return;
            }
            var needed_diff = DIFF(ctx.char_info[0].alphabet_index, ctx.char_info[1].alphabet_index);
            if (needed_diff == 0 || needed_diff > g_max_sequence_diff) {
                return;
            }
            var count = 2;
            for (; count < ctx.char_info.length; count++) {
                if (!is_diff_equal(ctx.char_info[0], ctx.char_info[count], needed_diff * count)) {
                    break;
                }
            }
            if (count < g_min_sequence_count) {
                return;
            }
            var scores = new Scores;
            scores.type = PATTERN_SEQUENCE;
            scores.begin = ctx.begin;
            for (; count >= g_min_sequence_count; count--) {
                var ent = get_sequence_addition_entrophy(ctx.char_info, count);
                scores.count = count;
                scores.entropy = ent + log2(count);
                add_multiple_pattern_scores(ctx.path, ctx.char_info, scores);
                add_scores(ctx.path, scores, ctx.char_info.length);
            }
        }
        function get_cardinality(char_info_arr, count) {
            var cardinality = []
            var ret = 0;
            for (var i = 0; i < count; i++) {
                cardinality.push(char_info_arr[i].cardinality);
            }
            cardinality.sort();
            for (var i = 0; i < cardinality.length - 1; i++) {
                while (cardinality.length > 1 && cardinality[i] == cardinality[i + 1]) {
                    cardinality.splice(i, 1);
                }
            }
            for (var i in cardinality) {
                ret += cardinality[i] & 0x000000FF;
            }
            return ret;
        }
        function prepare_for_calculate(str, alphabets) {
            var ret = [];
            var vec = utf8_to_vector32(str);
            for (var i = 0; i < vec.length; i++) {
                var val = new CharInfo;
                val.ch = vec[i].ch;
                val.ch_size = vec[i].ch_size;
                if (val.ch_size == 1) {
                    get_1byte_char_class(val);
                }
                ret.push(val);
            }
            var current_alphabet_id = ALPHABET_ID_OTHER_BEGIN;
            var cardinality_id_inc = 0x00010000;
            var cardinality_id_mask = cardinality_id_inc;
            for (var k = 0; k < alphabets.length; k++) {
                var mapping = alphabets[k].mapping_latin_qwerty_lower;
                var alphabet = alphabets[k].vec32_lower;
                var n = false;
                for (; ;) {
                    for (var i = 0; i < ret.length; i++) {
                        var char_info = ret[i];
                        for (var idx = 0; idx < alphabet.length; idx++) {
                            if (alphabet[idx].ch == char_info.ch) {
                                char_info.islowercase = !n;
                                char_info.isuppercase = n;
                                char_info.shift = n;
                                char_info.alphabet_id = current_alphabet_id;
                                char_info.cardinality = cardinality_id_mask + alphabet.length;
                                char_info.alphabet_index = idx;
                                char_info.mapped_latin_key = mapping[idx];
                                char_info.around_keys = get_around_keys(char_info.mapped_latin_key);
                                break;
                            }
                        }
                    }
                    if (n) {
                        break;
                    }
                    n = true;
                    mapping = alphabets[k].mapping_latin_qwerty_upper;
                    alphabet = alphabets[k].vec32_upper;
                    cardinality_id_mask += cardinality_id_inc;
                }
                current_alphabet_id++;
            }
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].cardinality == 0) {
                    ret[i].cardinality = (cardinality_id_mask + (ret[i].ch_size << 16)) | 66;
                }
            }
            return ret;
        }
        this.get_scores = function (str, path) {
            var char_info_arr = prepare_for_calculate(str, built_in_alphabets);
            var char_entropy = log2(get_cardinality(char_info_arr, char_info_arr.length));
            function Node() {
                this.path = [];
                this.path.length = 0;
                this.from = new Scores;
                this.checked = false;
                this.entropy = DBL_MAX;
            };
            var graph = new Array(str.length + 1);
            for (var i = 0; i < graph.length; i++) {
                graph[i] = new Node;
            }
            graph[0].entropy = 0.0;
            var ctx = new Context;
            ctx.char_entropy = char_entropy;
            for (var i = 0; i < str.length; i++) {
                ctx.char_info = char_info_arr;
                ctx.begin = i;
                ctx.path = graph[i].path;
                add_around_key_scores(ctx);
                add_sequences_scores(ctx);
                add_repeated_chars_scores(ctx);
                add_repeated_sequence_scores(ctx);
                char_info_arr.shift();
            }
            var buf = [];
            for (var i = 0; i <= str.length; i++) {
                buf.push(0);
            }
            buf[0] = 1;
            buf[str.length] = 1;
            for (var i = 0; i < str.length; ++i) {
                for (var j = 0; j < graph[i].path.length; j++) {
                    var scores = graph[i].path[j];
                    buf[scores.begin] = 1;
                    buf[scores.begin + scores.count] = 1;
                }
            }
            for (var i = 0; i < str.length; i++) {
                if (buf[i] == 0) {
                    continue;
                }
                var payload_count = str.length - i;
                var scores = new Scores;
                scores.begin = i;
                for (var j = i + 1; j <= str.length; j++) {
                    if (buf[j] != 0) {
                        scores.count = j - i;
                        scores.entropy = char_entropy * scores.count;
                        add_scores(graph[i].path, scores, payload_count);
                    }
                }
            }
            for (var unused = 0; unused < str.length; unused++) {
                var min_idx = graph.length - 1;
                for (var i = 0; i < graph.length; i++) {
                    var node = graph[i];
                    if (!node.checked && (node.entropy < graph[min_idx].entropy)) {
                        min_idx = i;
                    }
                }
                var min_node = graph[min_idx];
                min_node.checked = true;
                for (var i = 0; i < min_node.path.length; i++) {
                    scores = min_node.path[i];
                    var end_idx = min_idx + scores.count;
                    var end_node = graph[end_idx];
                    var ent = min_node.entropy + scores.multipart_entropy;
                    if (!end_node.checked && (ent < end_node.entropy)) {
                        end_node.entropy = ent;
                        end_node.from = mycopy(scores);
                    }
                }
            }
            path.length = 0;
            var score = graph[graph.length - 1].from;
            for (; ;) {
                path.unshift(score);
                if (score.begin == 0) {
                    break;
                }
                assert(path.length != graph.length);
                score = graph[score.begin].from;
            }
            return graph[graph.length - 1].entropy;
        }
    } 
    this.get_type_string = function (scores) {
        var type_strings = ["NO_PATTERN", "REPEAT_CHAR", "SEQUENCE", "KEYBOARD", "REPEAT_SEQUENCE"];
        if (scores.type >= 0 && scores.type < PATTERN_LAST_VALUE) {
            return type_strings[scores.type];
        }
        return "";
    }
    function get_reason_string(reason) {
        switch (reason) {
            case REASON_KEYBOARD:
                return "KEYBOARD";
            case REASON_SEQUENCE:
                return "SEQUENCE";
            case REASON_LENGTH:
                return "LENGTH";
            case REASON_REPEATED_CHARS:
                return "REPEATED_CHARS";
            case REASON_REPEATED_SEQUENCE:
                return "REPEATED_SEQUENCE";
        }
        return "UNKNOWN REASON";
    }
    function get_level(scores) {
        if (scores >= SCORES_EXCELLENT) {
            return LEVEL_EXCELLENT;
        }
        if (scores >= SCORES_GOOD) {
            return LEVEL_GOOD;
        }
        if (scores >= SCORES_BAD) {
            return LEVEL_BAD;
        }
        return LEVEL_UGLY;
    }
    function get_weights(path) {
        var arr = [];
        for (var i = 0; i < REASON_LAST_VALUE; i++) {
            arr.push({ weight: 0, reason: i });
        }
        for (var i = 0; i < path.length; i++) {
            var val = path[i];
            if (val.type == PATTERN_REPEAT) {
                arr[REASON_REPEATED_CHARS].weight += val.count;
            }
            else if (val.type == PATTERN_KEYBOARD) {
                arr[REASON_KEYBOARD].weight += val.count;
            }
            else if (val.type == PATTERN_SEQUENCE) {
                arr[REASON_SEQUENCE].weight += val.count;
            }
        }
        var path_back = path[path.length - 1];
        var pass_len = path_back.begin + path_back.count;
        if (pass_len <= UGLY_LEN) {
            arr[REASON_LENGTH].weight = 1 + UGLY_LEN - pass_len;
        }
        arr.sort(function (a, b) {
            if (a == b) return 0;
            if (a.weight < b.weight) return 1;
            return -1;
        });
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].weight == 0) {
                arr.splice(i);
                break;
            }
        }
        return arr;
    }
    function get_password_strength(value) {
        if (!checker) {
            checker = new KasPassCheck();
        }
        var shortest_path = [];
        var scores = checker.get_scores(value, shortest_path);
        var rs = [];
        var level = get_level(scores);
        if (level != checker.Level_EXCELLENT) {
            rs = get_weights(shortest_path);
        }
        return { quality: level, reasons: rs, entropy: scores, shortest_path: shortest_path };
    }
    return {
        getPasswordStrength: get_password_strength,
        getReasonString: get_reason_string
    };
})();
function NeedToShowBalloon(elem){
	if(!elem)return false;
	if(!elem.tagName||elem.tagName.toLowerCase()!="input")return false;
	if(!elem.type||elem.type.toLowerCase()!='password')return false;
	var inputs=document.getElementsByTagName('input');
	var p=-1,pp=-1,f=false;
	function p_near(i,j){
		function r(x){return Math.round(x);}
		function bnd(e){return e.getBoundingClientRect();}
		function hid(p){if (p&&(((p.right-p.left)==0)||((p.top-p.bottom)==0)))return true;return false;}
		function abs(a){return Math.abs(a);}
		var r1=bnd(inputs[i]);
		var r2=bnd(inputs[j]);
		if (hid(r1))return false;
		if (hid(r2))return false;
		var dx=abs(r(r2.left-r1.left));
		var dy=abs(r(r2.top-r1.top));
		var dxw=abs(r(r2.left-r1.right));
		var dyh=abs(r(r2.top-r1.bottom));
		var n=10,m=130;
		if(dy<=n&&dxw<=m)return true;
		if(dy<=m&&dxw<=n)return true;
		if(dx<=n&&dyh<=m)return true;
		if(dx<=m&&dyh<=n)return true;
		return false;
	};
	function in_double_set(i,j)
	{
		if(elem==inputs[i]||elem==inputs[j])return true;
		return false;
	}
	function check_double()
	{
		if(f)
		{
			if(p>=0&&pp>=0&&in_double_set(p,pp))return true;
			f=false;
		}
		p=-1;pp=-1;
		return false;
	}
	for(var i=0;i<inputs.length;++i){
		if(inputs[i].type.toLowerCase()=="password"){
			if (p>=0){
				if(p_near(p,i)){
					if(pp>=0){
						if(in_double_set(i,p))return true;
						p=-1;pp=-1;
					}else{
						if((i==inputs.length-1)&&(in_double_set(i,p)))return true;
						f=true;
					}
				}else{
					if(check_double())return true;
				}
				pp=p;
			}
			p=i;
		}else{
			if(check_double())return true;
		}
	}
	return false;
}
AvNs.CheckPasswordStrength = PasswordStrengthChecker.getPasswordStrength;
AvNs.NeedToShowBalloon = NeedToShowBalloon;
AvNs.AddRunner("pc", function AddRunnerPc(ns, session, settings, locales)
{
    var PasswordControl = function PasswordControl()
    {
        var m_callFunction = ns.EmptyFunc;
        var m_balloon = null;
        function OnPing()
        {
            return ns.MaxRequestDelay;
        }
        session.InitializePlugin(function InitializePluginPc(activatePlugin, registerMethod, callFunction)
            {
                m_callFunction = callFunction;
                activatePlugin("pc", OnPing);
                registerMethod("pc.disable", function PcDisable()
                    {
                        if (m_balloon)
                            m_balloon.Disable();
                    });
                registerMethod("pc.showBalloon", function PcShowBalloon(obj)
                    {
                        if (m_balloon && ns.IsTopLevel)
                            m_balloon.ShowBalloon(obj);
                    });
                registerMethod("pc.hideBalloon", function PcHideBalloon()
                    {
                        if (m_balloon && ns.IsTopLevel)
                            m_balloon.HideBalloon();
                    });
            });
        m_balloon =  new ns.PasswordControlBalloon(settings, locales, m_callFunction, session);
    };
    var instance = null;
    ns.RunModule(function RunModulePasswordControl()
    {
        if (!instance)
            instance = new PasswordControl();
    });
});
(function PasswordControlBalloonMain(ns)
{
ns.PasswordControlBalloon = function PasswordControlBalloon(settings, locales, callFunction, session)
{
    var m_pluginId = "pc";
    var m_balloon = null;
    var m_focusedElement = null;
    var m_lastChange = null;
    var m_hideTimer = null;
    var m_displayBalloon = false;
    var m_currentVerdictClassName = "";
    var m_currentPasswordStrength = null;
    var m_currentArrowClassName = "left";
    var m_restoreFocusTimeout = null;
    var m_frameInfo = { fromFrame: false };
    var m_focusEventName = "";
    var m_blurEventName = "";
    var m_focusTimeOut = null;
    var m_domParser = ns.GetDomParser(session);
    var m_passwordInputObserver = ns.GetDomChangeObserver("input", m_pluginId);
    var m_delaySkipFocusEvent = false;
    var m_delayTimeout = 1000;
    if (window.addEventListener)
    {
        m_focusEventName = "focus";
        m_blurEventName = "blur";
    }
    else
    {
        m_focusEventName = "focusin";
        m_blurEventName = "focusout";
    }
    function OnGetDataCallback(data)
    {
        if (data.isNeedRestoreFocus && m_focusedElement)
        {
            ns.SessionLog("Restore focus on password");
            ns.ClearTimeout(m_hideTimer);
            m_focusedElement.focus();
        }
    }
    function Unsubscribe(element, onInput, onBlur)
    {
        ns.SessionLog("Unsubscribe on input and blur events");
        ns.RemoveEventListener(element, "input", onInput);
        ns.RemoveEventListener(element, "keyup", onInput);
        ns.RemoveEventListener(element, "keydown", onInput);
        ns.RemoveEventListener(element, m_blurEventName, onBlur);
    }
    function GeneratePopupAttributes(password)
    {
        if (!password)
        {
            m_currentVerdictClassName = "popup_empty";
            m_currentPasswordStrength = null;
        }
        else
        {
            m_currentVerdictClassName = "";
            m_currentPasswordStrength = ns.CheckPasswordStrength(password);
        }
    }
    function GetBalloonData()
    {
        return { strength: m_currentPasswordStrength, arrow: m_currentArrowClassName };
    }
    function UpdateBalloon()
    {
        if (!m_balloon)
            return;
        m_balloon.Update(m_currentVerdictClassName, GetBalloonData());
    }
    function GetTopForLeftOrRightPosition(elementRect)
    {
        return elementRect.top - 80 + ((elementRect.bottom - elementRect.top) / 2);
    }
    function GetLeftForTopOrBottomPosition(elementRect)
    {
        return elementRect.left - 13;
    }
    function GetCoord(balloonSize)
    {
        var coord = { x: 0, y: 0 };
        var elementRect = {};
        if (m_frameInfo.fromFrame)
        {
            elementRect = m_frameInfo.coord;
        }
        else
        {
            if (!m_focusedElement)
                return coord;
            elementRect = m_focusedElement.getBoundingClientRect();
        }
        var clientHeight = ns.GetPageHeight();
        var clientWidth = ns.GetPageWidth();
        var newArrowClassName = "";
        if ((elementRect.right + balloonSize.width <= clientWidth) && GetTopForLeftOrRightPosition(elementRect) >= 0)
        {
            newArrowClassName = "left";
            coord.x = elementRect.right;
            coord.y = GetTopForLeftOrRightPosition(elementRect);
        }
        else if ((elementRect.left - balloonSize.width >= 0) && GetTopForLeftOrRightPosition(elementRect) >= 0)
        {
            newArrowClassName = "right";
            coord.x = elementRect.left - balloonSize.width;
            coord.y = GetTopForLeftOrRightPosition(elementRect);
        }
        else if (elementRect.bottom + balloonSize.height < clientHeight)
        {
            newArrowClassName = "top";
            coord.x = GetLeftForTopOrBottomPosition(elementRect);
            coord.y = elementRect.bottom;
        }
        else if (elementRect.top - balloonSize.height > 0)
        {
            newArrowClassName = "bottom";
            coord.x = GetLeftForTopOrBottomPosition(elementRect);
            coord.y = elementRect.top - balloonSize.height;
        }
        else
        {
            newArrowClassName = "top";
            coord.x = elementRect.left - 13;
            coord.y = elementRect.bottom;
        }
        if (newArrowClassName !== m_currentArrowClassName)
        {
            m_currentArrowClassName = newArrowClassName;
            ns.SetTimeout(UpdateBalloon, 0, m_pluginId);
        }
        var scroll = ns.GetPageScroll();
        coord.x += scroll.left;
        coord.y += scroll.top;
        return coord;
    }
    function ShowBalloonImpl(password)
    {
        if (!m_balloon)
        {
            ns.SessionLog("Balloon is undefined, not possible to show it.");
            return;
        }
        GeneratePopupAttributes(password);
        if (!m_displayBalloon)
        {
            callFunction("pc.Tooltip");
            m_displayBalloon = true;
            m_balloon.Show(m_currentVerdictClassName, GetBalloonData());
        }
        else
        {
            UpdateBalloon();
        }
    }
    function OnPasswordFocused(password)
    {
        ns.SessionLog("Clear restore focus timeout");
        ns.ClearTimeout(m_restoreFocusTimeout);
        ns.ClearTimeout(m_hideTimer);
        ShowBalloonImpl(password);
        if (m_balloon)
            m_balloon.UpdatePosition();
    }
    this.ShowBalloon = function ShowBalloon(obj)
    {
        if (!ns.IsTopLevel)
            return;
        m_frameInfo.fromFrame = true;
        m_frameInfo.coord = {};
        m_frameInfo.coord.top = obj.top;
        m_frameInfo.coord.bottom = obj.bottom;
        m_frameInfo.coord.left = obj.left;
        m_frameInfo.coord.right = obj.right;
        if (m_frameInfo.frameElement)
        {
            var r = m_frameInfo.frameElement.getBoundingClientRect();
            m_frameInfo.coord.top += r.top;
            m_frameInfo.coord.bottom += r.top;
            m_frameInfo.coord.left += r.left;
            m_frameInfo.coord.right += r.left;
        }
        OnPasswordFocused(obj.password);
    };
    function HideBalloonImpl()
    {
        if (m_balloon)
            m_balloon.Hide();
        m_displayBalloon = false;
    }
    function OnHideBalloon()
    {
        if (ns.IsTopLevel)
            HideBalloonImpl();
        else
            callFunction("pc.NeedToHideBalloon");
    }
    this.HideBalloon = function HideBalloon()
    {
        if (!ns.IsTopLevel)
            return;
        m_frameInfo.fromFrame = true;
        HideBalloonImpl();
    };
    function OnInput()
    {
        try
        {
            if (!m_focusedElement)
                return;
            if (m_lastChange === m_focusedElement.value)
                return;
            if (ns.IsTopLevel)
            {
                ShowBalloonImpl(m_focusedElement.value);
            }
            else
            {
                var r = m_focusedElement.getBoundingClientRect();
                callFunction("pc.NeedToShowBalloon",
                { top: Math.round(r.top), bottom: Math.round(r.bottom), right: Math.round(r.right), left: Math.round(r.left), password: m_focusedElement.value });
            }
            m_lastChange = m_focusedElement.value;
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
    }
    function OnBlur()
    {
        try
        {
            ns.ClearTimeout(m_focusTimeOut);
            if (m_focusedElement)
            {
                ns.ClearTimeout(m_hideTimer);
                m_hideTimer = ns.SetTimeout(function TimerCallback() { OnHideBalloon(); }, 700, m_pluginId);
                Unsubscribe(m_focusedElement, OnInput, OnBlur);
                m_lastChange = null;
            }
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
    }
    function AddRemovableEventListener(element)
    {
        m_focusedElement = element;
        ns.AddRemovableEventListener(element, m_blurEventName, OnBlur);
        ns.AddRemovableEventListener(element, "input", OnInput);
        ns.AddRemovableEventListener(element, "keyup", OnInput);
        ns.AddRemovableEventListener(element, "keydown", OnInput);
    }
    function IsPasswordInputCallback(result, passwords, element)
    {
        if (result === 0 && element && passwords)
        {
            for (var i = 0; i < passwords.length; i++)
            {
                if (element === document.querySelector(passwords[i]))
                {
                    if (ns.IsTopLevel)
                    {
                        m_frameInfo.fromFrame = false;
                        return true;
                    }
                    var r = element.getBoundingClientRect();
                    AddRemovableEventListener(element);
                    callFunction("pc.NeedToShowBalloon",
                    { top: Math.round(r.top), bottom: Math.round(r.bottom), right: Math.round(r.right), left: Math.round(r.left), password: m_focusedElement.value });
                    return false;
                }
            }
        }
        else
        {
            ns.SessionLog("password input callback get result: " + result + " with passwords size: " + passwords.length);
        }
        return false;
    }
    function CheckSelectorCallback(element)
    {
        return function CheckSelector(result, passwords) 
        {
            if (IsPasswordInputCallback(result, passwords, element))
            {
                ns.SessionLog("Focused on password field");
                AddRemovableEventListener(element);
                OnPasswordFocused(m_focusedElement.value);
            }
            else
            {
                ns.SessionLog("Focused on not password field with type: " + element.type);
            }
        };
    }
    function ShowBalloonOnPasswordInput(element)
    {
        m_domParser.GetNewPasswordSelectors(CheckSelectorCallback(element));
    }
    function OnFocus(evt)
    {
        if (m_delaySkipFocusEvent)
        {
            ns.SessionLog("Skip focus event after click button in balloon");
            return;
        }
        var element = evt.target || evt.srcElement;
        m_focusTimeOut = ns.SetTimeout(function TimerCallback()
        {
            if (!element)
                ns.SessionLog("Skip focus event for null element");
            else if (element.type === "password")   
                ShowBalloonOnPasswordInput(element);
            else
                ns.SessionLog("Skip focus event for element with type: " + element.type);
        }, 0, m_pluginId);
    }
    function OnCloseButton()
    {
        var element = m_focusedElement;
        m_focusedElement = null;
        m_lastChange = null;
        if (element)
        {
            Unsubscribe(element, OnInput, OnBlur);
            m_restoreFocusTimeout = ns.SetTimeout(function TimerCallback()
                {
                    element.focus();
                    ns.SessionLog("Restore focus for element with type: " + element.type);
                }, 1000, m_pluginId);
            element.focus();
            ns.SessionLog("Restore focus before click close button");
        }
        ns.SessionLog("Click close button");
    }
    function OnInstallButton()
    {
        OnCloseButton();
        ns.RemoveEventListener(document, m_focusEventName, OnFocus);
        callFunction("pc.Download");
    }
    function DisableImpl()
    {
        var focusedElement = m_focusedElement;
        if (m_balloon)
        {
            m_balloon.Hide();
            m_balloon = null;
        }
        if (focusedElement)
            Unsubscribe(focusedElement, OnInput, OnBlur);
        ns.RemoveEventListener(document, m_focusEventName, OnFocus);
        ns.SessionLog("Disabling password control");
    }
    function OnSkipNotification()
    {
        DisableImpl();
        callFunction("pc.SkipNotification");
    }
    this.Disable = function Disable()
    {
        DisableImpl();
    };
    function OnCloseHandler(closeAction)
    {
        m_displayBalloon = false;
        m_delaySkipFocusEvent = true;
        switch (closeAction)
        {
        case 1:
            OnCloseButton();
            break;
        case 2:
            OnSkipNotification();
            break;
        case 3:
            OnInstallButton();
            break;
        default:
            ns.SessionError({ message: "Unknown close action", details: "action: " + closeAction }, m_pluginId);
            break;
        }
        ns.ClearTimeout(m_focusTimeOut);
        ns.SetTimeout(function TimerCallback() { m_delaySkipFocusEvent = false; }, m_delayTimeout, m_pluginId);
    }
    function OnMouseOver(evt)
    {
        var element = evt.target || evt.srcElement;
        if (!ns.IsStringEqualIgnoreCase(element.nodeName, "iframe"))
            return;
        m_frameInfo.frameElement = element;
    }
    function ResetDomParser()
    {
        m_domParser.Reset();
    }
    ns.AddEventListener(document, m_focusEventName, OnFocus, m_pluginId);
    m_passwordInputObserver.Start(ResetDomParser);
    if (ns.IsTopLevel)
    {
        m_balloon = new ns.Balloon2(m_pluginId, "/pc/password_control_balloon.html", "/pc/tooltip.css", session, GetCoord, OnCloseHandler, locales, OnGetDataCallback);
        ns.AddEventListener(document, "mouseover", OnMouseOver, m_pluginId);
    }
};
})(AvNs || {});
AvNs.AddRunner("wsc", function AddRunnerWsc(ns, session)
{
    var WebsiteCredentials = function WebsiteCredentials()
    {
        var m_callFunction = ns.EmptyFunc;
        var m_syncCallFunction = ns.EmptyFunc;
        var m_lastPasswordSended = null;
        var m_subscribedAttributeName = "kl_wsc_" + ns.GetCurrentTime();
        var m_pluginId = "wsc";
        var m_passwordInputObserver = ns.GetDomChangeObserver("input", m_pluginId);
        function OnPing()
        {
            return ns.MaxRequestDelay;
        }
        function IsSubscribedElement(element)
        {
            return element[m_subscribedAttributeName];
        }
        function MarkSubscribedElement(element)
        {
            element[m_subscribedAttributeName] = true;
        }
        function GetElements(element, tag, type)
        {
            var selector = tag + "[type='" + type + "']";
            if (element === document)
            {
                if (ns.HasDocumentQuerySelectorAll())
                    return ns.DocumentQuerySelectorAll(selector);
            }
            else if (ns.HasElementQuerySelectorAll())
            {
                return ns.ElementQuerySelectorAll(element, selector);
            }
            var result = [];
            var childrens = element.getElementsByTagName(tag);
            for (var i = 0; i < childrens.length; i++)
            {
                if (ns.IsStringEqualIgnoreCase(childrens[i].type, type))
                    result.push(childrens[i]);
            }
            return result;
        }
        function GetFormAction(parentForm)
        {
            var formAction = parentForm.action;
            if (typeof parentForm.action !== "string" && parentForm.getAttribute)
            {
                var tmp = ns.DocumentCreateElement("form");
                ns.ElementSetAttribute.call(tmp, "action", parentForm.getAttribute("action"));
                formAction = tmp.action;
            }
            if (formAction && (formAction.toLowerCase().indexOf("http://") === 0 || formAction.toLowerCase().indexOf("https://") === 0))
                return formAction;
            return "";
        }
        function OnSubmitEventListener(element, parentForm)
        {
            var isElementVisible = ns.IsElementDisplayed(element);
            if (isElementVisible && Boolean(element.value) && element.value !== m_lastPasswordSended)
            {
                m_lastPasswordSended = element.value;
                var hash = ns.md5(element.value) || "";
                var url = GetFormAction(parentForm) || document.location.toString() || "";
                var args = { url: ns.ToBase64(url), urlEncrypted: true, passwordHash: hash };
                if (!m_syncCallFunction("wsc.WebsiteCredentialSendPasswordHash", args))
                    m_callFunction("wsc.WebsiteCredentialSendPasswordHash", args);
            }
            else
            {
                ns.SessionLog("Submit click, but password not send. Is element visible: " + isElementVisible +
                    ". Has element value: " + Boolean(element.value));
            }
        }
        function GetCallback(element, parentForm)
        {
            return function callback()
            {
                OnSubmitEventListener(element, parentForm);
            };
        }
        function GetSubmitButtons(parentForm)
        {
            return GetElements(parentForm, "input", "submit");
        }
        function GetSingleButton(parentForm)
        {
            var buttons = GetElements(parentForm, "button", "submit"); 
            if (buttons.length > 0) 
                return buttons;
            buttons = parentForm.getElementsByTagName("button");
            var result = [];
            for (var i = 0; i < buttons.length; i++)
            {
                if (ns.IsElementDisplayed(buttons[i])) 
                    result.push(buttons[i]);
            }
            return result;
        }
        function SetEnterKeyEventListener(element, callback)
        {
            ns.AddEventListener(element, "keydown", function OnKeydown(e) { if (e.keyCode === 13) callback(); }, m_pluginId);
        }
        function SetButtonClickEventListener(element, callback)
        {
            ns.AddEventListener(element, "click", callback, m_pluginId);
        }
        function SetFormEventListeners(parentForm, elements, callback)
        {
            for (var i = 0; i < elements.length; ++i) 
            {
                SetButtonClickEventListener(elements[i], callback);
                SetEnterKeyEventListener(elements[i], callback);
            }
            SetEnterKeyEventListener(parentForm, callback);
            ns.AddEventListener(parentForm, "submit", callback, m_pluginId);
        }
        function SetEventListeners()
        {
            var passwordEditors = GetElements(document, "input", "password");
            ns.SessionLog("Founded password inputs count " + passwordEditors.length);
            for (var i = 0, length = passwordEditors.length; i < length; ++i)
            {
                if (IsSubscribedElement(passwordEditors[i]))
                    continue;
                var passwordForm = passwordEditors[i].form || document;
                if (passwordForm)
                {
                    var buttons = GetSubmitButtons(passwordForm);
                    if (buttons.length === 0)
                        buttons = GetSingleButton(passwordForm);
                    ns.SessionLog("Buttons count " + buttons.length);
                    var callback = GetCallback(passwordEditors[i], passwordForm);
                    SetFormEventListeners(passwordForm, buttons, callback);
                    SetEnterKeyEventListener(passwordEditors[i], callback);
                }
                MarkSubscribedElement(passwordEditors[i]);
            }
        }
        function OnSessionShutdown()
        {
            ns.SessionLog("Stop observe input for WSC");
            if (m_passwordInputObserver)
                m_passwordInputObserver.Stop();
        }
        function Initialize()
        {
            session.InitializePlugin(function InitializePluginWsc(activatePlugin, registerMethod, callFunction, deactivate, syncCall)
            {
                m_callFunction = callFunction;
                m_syncCallFunction = syncCall;
                activatePlugin(m_pluginId, OnPing, null, OnSessionShutdown);
            });
            SetEventListeners();
            m_passwordInputObserver.Start(SetEventListeners);
            ns.AddEventListener(window, "load", SetEventListeners, m_pluginId);
            ns.SessionLog("WSC finish initialize");
        }
        Initialize();
    };
    var instance = null;
    ns.RunModule(function RunModuleWebsiteCredentials()
    {
        if (!instance)
            instance = new WebsiteCredentials();
    }, 2000);
});
AvNs.AddRunner("wnt", function AddRunnerWnt(ns, session)
{
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function Initialize()
    {
        session.InitializePlugin(function InitializePluginWnt(activatePlugin)
            {
                activatePlugin("wnt", OnPing);
            });
    }
    Initialize();
}, { referrer: document.referrer });
(function UrlAdvisorBalloonMain(ns)
{
ns.UrlAdvisorBalloon = function UrlAdvisorBalloon(session, locales)
{
    var m_balloon = null;
    var m_currentVerdict = null;
    var m_mouseX = 0;
    var m_mouseY = 0;
    var ratingIds = [
        { className: "green", headerNode: locales["UrlAdvisorBalloonHeaderGood"], textNode: locales["UrlAdvisorSetLocalContentOnlineGood"] },
        { className: "grey", headerNode: locales["UrlAdvisorBalloonHeaderSuspicious"], textNode: locales["UrlAdvisorSetLocalContentOnlineSuspicious"] },
        { className: "red", headerNode: locales["UrlAdvisorBalloonHeaderDanger"], textNode: locales["UrlAdvisorSetLocalContentOnlineDanger"] },
        { className: "yellow", headerNode: locales["UrlAdvisorBalloonHeaderWmuf"], textNode: locales["UrlAdvisorSetLocalContentOnlineWmuf"] },
        { className: "orange", headerNode: locales["UrlAdvisorBalloonHeaderCompromised"], textNode: locales["UrlAdvisorSetLocalContentOnlineCompromised"] },
        { className: "yellow_shops", headerNode: locales["UrlAdvisorBalloonHeaderShop"], textNode: locales["UrlAdvisorSetLocalContentOnlineShop"] }
    ];
    function OnCloseHandler(arg)
    {
        if (arg === 0)
            m_balloon.Hide();
    }
    function OnDataReceiveHandler()
    {
    }
    function GetCoord(balloonSize, clientX, clientY)
    {
        var coord = { x: 0, y: 0 };
        var clientWidth = ns.GetPageWidth();
        var halfWidth = balloonSize.width / 2;
        if (halfWidth > clientX)
            coord.x = 0;
        else if (halfWidth + clientX > clientWidth)
            coord.x = clientWidth - balloonSize.width;
        else
            coord.x = clientX - halfWidth;
        var clientHeight = ns.GetPageHeight();
        coord.y = (clientY + balloonSize.height > clientHeight) ? clientY - balloonSize.height : clientY;
        if (coord.y < 0)
            coord.y = 0;
        var scroll = ns.GetPageScroll();
        coord.y += scroll.top;
        coord.x += scroll.left;
        return coord;
    }
    function GetCoordsCallback(balloonSize)
    {
        return GetCoord(balloonSize, m_mouseX, m_mouseY);
    }
    this.HideBalloon = function HideBalloon()
    {
        m_balloon.Hide();
    };
    this.ShowBalloon = function ShowBalloon(clientX, clientY, verdict)
    {
        m_mouseX = clientX;
        m_mouseY = clientY;
        m_currentVerdict = verdict;
        m_balloon.Show(ratingIds[m_currentVerdict.rating - 1].className + " " + ns.md5(verdict.url), { verdict: m_currentVerdict, locales: locales });
    };
    m_balloon = new ns.Balloon2("ua", "/ua/url_advisor_balloon.html", "/ua/balloon.css", session, GetCoordsCallback, OnCloseHandler, locales, OnDataReceiveHandler);
};
})(AvNs || {});
var PostponeCheckAtributeName = "kl_" + AvNs.GetCurrentTime();
var IconName = "kl_" + AvNs.GetCurrentTime();
var InsertType = { INSERT_AFTER: 0, INSERT_BEFORE: 1, INSERT_INTO: 2 };
AvNs.AddRunner("ua", function AddRunnerUa(ns, session, settings, locales)
{
var UrlAdvisor = function UrlAdvisor()
{
    var m_urlAdvisorBalloon = new ns.UrlAdvisorBalloon(session, locales);
    var m_enabled = settings.enable;
    var m_checkOnlySearchResults = settings.mode;
    var m_linkSelector = settings.linkSelector;
    var m_elementAfterSelector = settings.elementAfterSelector;
    var m_emptySearchResultSent = false;
    var m_insertType = settings.insertType || InsertType.INSERT_AFTER;
    var m_isVerdictSuitableForContinueFunc = function AlwaysSuitable() { return true; };
    var m_postponeCategorizeStarted = false;
    var m_urlCategorizeRequestTime = 0;
    var m_observer = null;
    var m_callFunction = ns.EmptyFunc;
    var m_categorizingObjects = {};
    var m_clearCategorizingObjectsTimerId = null;
    var m_pluginId = "ua";
    function AddToCategorizeList(url, linkElement)
    {
        if (url in m_categorizingObjects)
            m_categorizingObjects[url].push(linkElement);
        else
            m_categorizingObjects[url] = [linkElement];
    }
    function OnPing(currentTime)
    {
        var timeFormRequest = (currentTime >= m_urlCategorizeRequestTime) ? currentTime - m_urlCategorizeRequestTime : 0;
        return timeFormRequest <= 10000 ? 500 : ns.MaxRequestDelay;
    }
    function GetHref(link)
    {
        try { return link.href; } 
        catch (e) {}
        try { return link.getAttribute("href"); } 
        catch (e) {}
        return "";
    }
    function CreateIcon()
    {
        var icon = ns.DocumentCreateElement("img");
        icon.name = IconName;
        icon.width = 16;
        icon.height = 16;
        icon.style.cssText = "width: 16px!important; height: 16px!important;display: inline !important;";
        if (settings.iconStyle)
            icon.style.cssText += settings.iconStyle;
        icon.onclick = function onclick(evt) { ns.StopProcessingEvent(evt); };
        return icon;
    }
    function GetLinkIcon(linkElement)
    {
        var iconElement = linkElement.nextSibling;
        if (m_elementAfterSelector)
        {
            var insertElement = linkElement.querySelector(m_elementAfterSelector);
            if (insertElement)
            {
                if (m_insertType === InsertType.INSERT_BEFORE)
                    iconElement = insertElement.previousSibling;
                else if (m_insertType === InsertType.INSERT_INTO)
                    iconElement = insertElement.lastChild;
                else
                    iconElement = insertElement.nextSibling;
            }
        }
        return (iconElement !== null && iconElement.name === IconName) ? iconElement : null;
    }
    function CreateIconBeforeElement(targetElement)
    {
        if (targetElement.parentNode)
        {
            targetElement.parentNode.insertBefore(CreateIcon(), targetElement);
        }
        else
        {
            ns.SessionLog("Can not find parent node for: " + targetElement.nodeType);
            return null;
        }
        return targetElement.previousSibling;
    }
    function CreateIconInElement(targetElement)
    {
        targetElement.appendChild(CreateIcon());
        return targetElement.lastChild;
    }
    function CreateIconAfterElement(targetElement)
    {
        if (targetElement.parentNode)
        {
            targetElement.parentNode.insertBefore(CreateIcon(), targetElement.nextSibling);
        }
        else
        {
            ns.SessionLog("Can not find parent node for: " + targetElement.nodeType);
            return null;
        }
        return targetElement.nextSibling;
    }
    function GetOrCreateLinkIcon(linkElement)
    {
        var icon = GetLinkIcon(linkElement);
        if (icon)
            return icon;
        var targetElement = linkElement;
        if (m_elementAfterSelector)
        {
            targetElement = linkElement.querySelector(m_elementAfterSelector);
            if (!targetElement)
                targetElement = linkElement;
        }
        targetElement.style.display = "inline-block";
        if (m_insertType === InsertType.INSERT_INTO)
            return CreateIconInElement(targetElement);
        else if (m_insertType === InsertType.INSERT_BEFORE)
            return CreateIconBeforeElement(targetElement);
        return CreateIconAfterElement(targetElement);
    }
    function CheckIconInElement(elem, icon)
    {
        return (m_insertType === InsertType.INSERT_AFTER && elem.nextSibling === icon)
            || (m_insertType === InsertType.INSERT_BEFORE && elem.previousSibling === icon)
            || (m_insertType === InsertType.INSERT_INTO && elem.firstChild === icon);
    }
    function GetLinkElementByIcon(icon)
    {
        if (!m_elementAfterSelector)
        {
            if (m_insertType === InsertType.INSERT_BEFORE)
                return icon.nextSibling;
            else if (m_insertType === InsertType.INSERT_INTO)
                return icon.parentNode;
            return icon.previousSibling;
        }
        var searchLinks = [];
        if (ns.GetSearchLinks)
            searchLinks = ns.GetSearchLinks();
        else
            searchLinks = ns.DocumentQuerySelectorAll(m_linkSelector);
        for (var i = 0; i < searchLinks.length; i++)
        {
            var link = searchLinks[i].element || searchLinks[i];
            var elem = link.querySelector(m_elementAfterSelector);
            if (link.nextSibling === icon || (elem && CheckIconInElement(elem, icon)))
                return link;
        }
        return icon.previousSibling;
    }
    function UpdateIconImage(icon, verdict)
    {
        if (verdict.rating === 1)
        {
            icon.src = locales["UrlAdvisorGoodImage.png"];
            icon["kis_status"] = 16;
        }
        else if (verdict.rating === 2)
        {
            icon.src = locales["UrlAdvisorSuspiciousImage.png"];
            icon["kis_status"] = 8;
        } 
        else if (verdict.rating === 3)
        {
            icon.src = locales["UrlAdvisorDangerImage.png"];
            icon["kis_status"] = 4;
        }
        else if (verdict.rating === 4)
        {
            icon.src = locales["UrlAdvisorwmufImage.png"];
        }
        else if (verdict.rating === 5)
        {
            icon.src = locales["UrlAdvisorCompromisedImage.png"];
        }
        else if (verdict.rating === 6)
        {
            icon.src = locales["UrlAdvisorwmufImage.png"]; 
        }
    }
    function SubscribeIconOnMouseEvents(icon, verdict)
    {
        var balloonTimerId = 0;
        ns.AddEventListener(icon, "mouseout", function OnMouseout()
            {
                if (balloonTimerId)
                {
                    ns.ClearTimeout(balloonTimerId);
                    balloonTimerId = 0;
                }
            }, m_pluginId);
        ns.AddEventListener(icon, "mouseover", function OnMouseover(args)
            {
                if (!balloonTimerId)
                {
                    var clientX = args.clientX;
                    var clientY = args.clientY;
                    balloonTimerId = ns.SetTimeout(function TimerCallback()
                        {
                            m_urlAdvisorBalloon.ShowBalloon(clientX, clientY, verdict);
                            balloonTimerId = 0;
                        }, 300, m_pluginId);
                }
            }, m_pluginId);
    }
    function IsElementEmpty(linkElement)
    {
        return !linkElement.offsetHeight && !linkElement.offsetWidth
            && !linkElement.outerText && !linkElement.text;
    }
    function SetVerdictForUrl(verdict)
    {
        try
        {
            if (!(verdict.url in m_categorizingObjects))
                return;
            var linkElements = m_categorizingObjects[verdict.url];
            for (var linkIndex = 0; linkIndex < linkElements.length; ++linkIndex)
            {
                if (IsElementEmpty(linkElements[linkIndex]))
                    continue;
                linkElements[linkIndex][PostponeCheckAtributeName] = false;
                if (!m_isVerdictSuitableForContinueFunc(verdict))
                    continue;
                var icon = GetOrCreateLinkIcon(linkElements[linkIndex]);
                if (!icon)
                    continue;
                UpdateIconImage(icon, verdict);
                SubscribeIconOnMouseEvents(icon, verdict);
            }
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
        delete m_categorizingObjects[verdict.url];
    }
    function SetVerdict(argument)
    {
        for (var currentVerdict = 0; currentVerdict < argument.verdicts.length; currentVerdict++)
            SetVerdictForUrl(argument.verdicts[currentVerdict]);
    }
    function SetVerdictDelayed(argument)
    {
        ns.SetTimeout(function TimerCallback() { SetVerdict(argument); }, 1000, m_pluginId);
    }
    function SetSettingsImpl(argument)
    {
        m_enabled = argument.enable;
        if (!m_enabled)
            return;
        m_checkOnlySearchResults = argument.mode;
    }
    function ClearImages()
    {
        var images = document.getElementsByName(IconName);
        while (images.length > 0)
            images[0].parentNode.removeChild(images[0]);
    }
    function ClearAttributes()
    {
        for (var i = 0; i < document.links.length; ++i)
        {
            if (document.links[i][PostponeCheckAtributeName])
                document.links[i][PostponeCheckAtributeName] = false;
        }
    }
    function IsNeedCategorizeLink(linkElement)
    {
        try
        {
            return !linkElement.isContentEditable && Boolean(linkElement.parentNode)
                && !GetLinkIcon(linkElement) && !linkElement[PostponeCheckAtributeName]
                && !IsElementEmpty(linkElement);
        }
        catch (e)
        {
            ns.SessionLog("check link exception: " + (e.message || e));
            return false;
        }
    }
    function UrlToBase64(url)
    {
        try
        {
            return ns.ToBase64(url);
        }
        catch (e)
        {
            return "";
        }
    }
    function CategorizeUrl()
    {
        try
        {
            if (!m_enabled)
            {
                ns.SessionLog("skip categorize links because UA disabled");
                return;
            }
            ns.SessionLog("UA: collect links for categorize");
            m_postponeCategorizeStarted = false;
            var linksForCategorize = [];
            var linksForCheck = [];
            if (!m_checkOnlySearchResults)
                linksForCheck = document.links;
            else if (ns.GetSearchLinks)
                linksForCheck = ns.GetSearchLinks();
            else if (m_linkSelector && m_checkOnlySearchResults)
                linksForCheck = ns.DocumentQuerySelectorAll(m_linkSelector);
            ns.SessionLog("UA: links for categorize size: " + linksForCheck.length);
            for (var i = 0; i < linksForCheck.length; i++)
            {
                var link = linksForCheck[i].element || linksForCheck[i];
                if (IsNeedCategorizeLink(link))
                {
                    link[PostponeCheckAtributeName] = true; 
                    var href = GetHref(linksForCheck[i]) || GetHref(link);
                    var linkToCategorize = href;
                    if (href)
                    {
                        if (typeof window.URL === "function" && ns.TryCreateUrl(href) === null)
                        {
                            if (m_checkOnlySearchResults)
                            {
                                var details = { link: href };
                                ns.SessionError({ message: "UA: unsupported link url format", details: details }, m_pluginId);
                            }
                            else
                            {
                                ns.SessionLog("UA: unsupported link url format '" + href + "' skip link");
                            }
                            continue;
                        }
                        var base64Url = UrlToBase64(href);
                        if (!base64Url)
                        {
                            href = encodeURI(href);
                            base64Url = UrlToBase64(href);
                            if (!base64Url)
                                continue;
                        }
                        linkToCategorize = base64Url;
                        linksForCategorize.push(linkToCategorize);
                        AddToCategorizeList(href, link);
                    } 
                    else 
                    {
                        ns.Log("access to href blocked by browser"); 
                    }
                }
            }
            var isEmptySearchResult = m_linkSelector && m_checkOnlySearchResults && linksForCheck.length === 0;
            if (isEmptySearchResult || linksForCategorize.length)
            {
                if (isEmptySearchResult)
                {
                    if (document.readyState !== "complete" || m_emptySearchResultSent)
                        return;
                    m_emptySearchResultSent = true;
                }
                ns.SessionLog("UA send links for categorization");
                var args = { links: linksForCategorize };
                args.urlEncrypted = true;
                m_callFunction("ua.categorize", args);
                m_urlCategorizeRequestTime = ns.GetCurrentTime();
                ns.ClearTimeout(m_clearCategorizingObjectsTimerId);
                m_clearCategorizingObjectsTimerId = ns.SetTimeout(function TimerCallback()
                {
                    m_categorizingObjects = {};
                }, 1000 * 60 * 5, m_pluginId);
            }
            else
            {
                ns.SessionLog("UA not found links for categorization");
            }
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
    }
    function ProcessDomChange()
    {
        try
        {
            ns.SessionLog("UA: Process dom change");
            if (!m_postponeCategorizeStarted)
            {
                ns.SetTimeout(CategorizeUrl, 500, m_pluginId);
                m_postponeCategorizeStarted = true;
            }
            var images = document.getElementsByName(IconName);
            for (var i = 0; i < images.length; ++i)
            {
                var linkNode = GetLinkElementByIcon(images[i]);
                if (!linkNode || !linkNode.nodeName || !ns.IsStringEqualIgnoreCase(linkNode.nodeName, "a"))
                {
                    var imageNode = images[i];
                    imageNode.parentNode.removeChild(imageNode);
                }
            }
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
    }
    function SetSettings(argument)
    {
        ClearImages();
        ClearAttributes();
        SetSettingsImpl(argument);
        CategorizeUrl();
    }
    function Run()
    {
        CategorizeUrl();
        m_observer = ns.GetDomChangeObserver("a", m_pluginId);
        m_observer.Start(ProcessDomChange);
        ns.AddEventListener(window, "load", CategorizeUrl, m_pluginId);
    }
    session.InitializePlugin(function InitializePluginUa(activatePlugin, registerMethod, callFunction) 
        {
            m_callFunction = callFunction;
            if (settings.needCheckVerdicts)
            {
                m_isVerdictSuitableForContinueFunc = function CheckVerdict(verdict) 
                    {
                        return verdict.rating === 3 || verdict.rating === 4 || verdict.rating === 5 || verdict.rating === 6;
                    };
            }
            activatePlugin(m_pluginId, OnPing);
            registerMethod("ua.verdict", SetVerdictDelayed);
            registerMethod("ua.settings", SetSettings);
        });
    Run();
};
var instance = null;
ns.RunModule(function RunModuleUrlAdvisor()
{
    if (!instance)
        instance = new UrlAdvisor();
}, 2500);
});
AvNs.AddRunner("cb", function AddRunnerCB(ns, session)
{
    function ContentBlocker()
    {
        var m_idleStartTime = ns.GetCurrentTime();
        var m_callFunction = ns.EmptyFunc;
        function OnPing(currentTime)
        {
            var idleTime = (currentTime >= m_idleStartTime) ? currentTime - m_idleStartTime : 0;
            return idleTime <= 10000 ? 500 : ns.MaxRequestDelay;
        }
        function ReloadUrl()
        {
            m_idleStartTime = ns.GetCurrentTime();
            session.Reload();
        }
        function blockImageByPath(url, blockImageResponse)
        {
            var endsWithUrl = function endsWithUrl(pattern)
                {
                    var d = pattern.length - url.length;
                    return d >= 0 && pattern.lastIndexOf(url) === d;
                };
            var images = document.getElementsByTagName("img");
            for (var i = 0; i !== images.length; ++i)
            {
                if (endsWithUrl(images[i].src) && images[i].style.display !== "none")
                {
                    images[i].style.display = "none";
                    ++blockImageResponse.blockedImagesCount;
                }
            }
        }
        function BlockImage(blockImageRequest)
        {
            var blockImageResponse = { blockedImagesCount: 0, requestId: "" };
            var SendResponse = function SendResponseImpl() 
            {
                m_callFunction("cb.BlockResults", blockImageResponse);
                SendResponse = ns.EmptyFunc;
            };
            try
            {
                blockImageResponse.requestId = blockImageRequest.requestId;
                for (var i = 0; i !== blockImageRequest.urls.length; ++i)
                    blockImageByPath(blockImageRequest.urls[i], blockImageResponse);
                SendResponse();
            }
            catch (e)
            {
                SendResponse();
                throw e;
            }
        }
        session.InitializePlugin(function InitializePluginContentBlocker(activatePlugin, registerMethod, callFunction, deactivatePlugin)
        {
            m_callFunction = callFunction;
            activatePlugin("cb", OnPing);
            registerMethod("cb.reloadUrl", ReloadUrl);
            registerMethod("cb.blockImage", BlockImage);
            registerMethod("cb.shutdown",
                function ShutdownCB()
                {
                    deactivatePlugin("cb");
                });
        });
    }
    var m_contentBlocker = new ContentBlocker(); 
});
(function DomParserMain(ns)
{
function DomParser(session)
{
    var m_callFunction = ns.EmptyFunc;
    var m_logins = [];
    var m_passwords = [];
    var m_newPasswords = [];
    var m_address = [];
    var m_card = [];
    var m_cachedFlag = false;
    var m_pathName = GetCurrentPathname();
    var m_selectorsRequested = false;
    var m_callbacksQueue = [];
    var m_idCounter = 0;
    var m_wfdIdCounter = 1;
    var m_pluginId = "dp";
    function GetCurrentPathname()
    {
        if (document.location)
            return document.location.pathname;
        var currentUrl = ns.TryCreateUrl(document.URL);
        if (currentUrl)
            return currentUrl.pathname;
        ns.SessionError("Location is empty. Can't create URL from " + document.URL + ". Pathname not accessible", m_pluginId);
        return "";
    }
    function OnGetFieldsCallback(result, selectors)
    {
        if (result === 0 && selectors)
        {
            if (selectors.loginSelectors)
                Array.prototype.push.apply(m_logins, selectors.loginSelectors);
            if (selectors.passwordSelectors)
                Array.prototype.push.apply(m_passwords, selectors.passwordSelectors);
            if (selectors.newPasswordSelectors)
                Array.prototype.push.apply(m_newPasswords, selectors.newPasswordSelectors);
            if (selectors.addressSelectors)
                Array.prototype.push.apply(m_address, selectors.addressSelectors);
            if (selectors.cardSelectors)
                Array.prototype.push.apply(m_card, selectors.cardSelectors);
            m_cachedFlag = true;
        }
        else
        {
            ns.SessionLog("Get fields result: " + result);
        }
        m_selectorsRequested = false;
        ns.SessionLog("Dom parser call get field callbacks: " + m_callbacksQueue.length);
        for (var i = 0; i < m_callbacksQueue.length; ++i)
            m_callbacksQueue[i](result);
    }
    function CleanupElements()
    {
        if (!ns.HasDocumentQuerySelectorAll())
            return;
        var elements = ns.DocumentQuerySelectorAll("[wfd-value],[wfd-invisible]");
        for (var i = 0; i < elements.length; ++i)
        {
            var element = elements[i];
            if (element.hasAttribute("wfd-value"))
                element.removeAttribute("wfd-value");
            if (element.hasAttribute("wfd-invisible"))
                element.removeAttribute("wfd-invisible");
        }
    }
    function CallService(argObject)
    {
        m_callFunction("dp.onGetFields", argObject, OnGetFieldsCallback);
        CleanupElements();
    }
    function ProcessChilds(childNodes)
    {
        for (var i = 0; i < childNodes.length; ++i)
        {
            var element = childNodes[i];
            if (element.nodeType !== Node.ELEMENT_NODE)
                continue;
            if (!ns.IsElementDisplayed(element))
            {
                ns.ElementSetAttribute.call(element, "wfd-invisible", true);
            }
            else
            {
                ns.ElementSetAttribute.call(element, "wfd-id", "id" + m_idCounter);
                ++m_idCounter;
                ProcessChilds(element.childNodes);
            }
        }
    }
    function ProcessNextGroupElement(tree, finishCallback)
    {
        var counter = 0;
        while (tree.nextNode())
        {
            ++counter;
            ns.ElementSetAttribute.call(tree.currentNode, "wfd-invisible", true);
            if (counter === 50)
            {
                ns.SetTimeout(function TimerCallback() { ProcessNextGroupElement(tree, finishCallback); }, 100, m_pluginId);
                return;
            }
        }
        finishCallback();
    }
    function GetSelectorsWithTreeWalker()
    {
        if (!document.body || !document.body.nodeType)
        {
            ns.AddEventListener(window, "load", GetSelectorsWithTreeWalker, m_pluginId);
            return;
        }
        ns.SessionLog("Get selectors with tree walker");
        var filter = {
            acceptNode: function acceptNode(node)
            {
                if (!node)
                    return NodeFilter.FILTER_SKIP;
                if (ns.TryGetTagName(node) === "INPUT")
                {
                    ns.ElementSetAttribute.call(node, "wfd-id", "id" + m_idCounter);
                    ++m_idCounter;
                }
                if (node.parentNode && typeof node.parentNode.getAttribute === "function" && node.parentNode.getAttribute("wfd-invisible") === true)
                    return NodeFilter.FILTER_REJECT;
                if (!ns.IsElementDisplayed(node))
                    return NodeFilter.FILTER_ACCEPT;
                return NodeFilter.FILTER_SKIP;
            }
        };
        var tree = ns.CreateTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, filter.acceptNode, false);
        function finishCallback()
        {
            ns.SessionLog("Get selectors with tree walker: call service");
            CallService({ dom: "<body>" + (document.body ? document.body.innerHTML : "") + "</body>" });
        }
        ProcessNextGroupElement(tree, finishCallback);
    }
    function GetSelectorsFromService()
    {
        try
        {
            ns.SessionLog("Get selectors from service");
            ProcessChilds(document.body.childNodes);
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
        ns.SessionLog("Get selectors from service: call service");
        CallService({ dom: document.documentElement.innerHTML });
    }
    function GetSelectorsInternal(callback, selectors)
    {
        if (m_cachedFlag)
        {
            if (selectors.length > 0)
            {
                ns.SessionLog("Get selectors from cache");
                callback(0, selectors);
            }
            return;
        }
        function clientCallback(result) { callback(result, selectors); }
        m_callbacksQueue.push(clientCallback);
        if (!m_selectorsRequested)
        {
            m_selectorsRequested = true;
            if (document.createTreeWalker)
                GetSelectorsWithTreeWalker();
            else
                GetSelectorsFromService();
        }
    }
    function AddWfdAttribute(input, settings)
    {
        try
        {
            if (!input || !input.value)
                return;
            if (settings && settings.avoidTypes && input.type && settings.avoidTypes.includes(input.type))
                return;
            if (input.type === "password")
                return;
            ns.ElementSetAttribute.call(input, "wfd-value", ns.ToBase64(input.value));
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
    }
    this.GetLoginSelectors = function GetLoginSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get Login selectors");
        GetSelectorsInternal(clientCallback, m_logins);
    };
    this.GetPasswordSelectors = function GetPasswordSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get password selectors");
        GetSelectorsInternal(clientCallback, m_passwords);
    };
    this.GetNewPasswordSelectors = function GetNewPasswordSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get new password selectors");
        GetSelectorsInternal(clientCallback, m_newPasswords);
    };
    this.GetAddressSelectors = function GetAddressSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get address selectors");
        GetSelectorsInternal(clientCallback, m_address);
    };
    this.GetCardSelectors = function GetCardSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get card selectors");
        GetSelectorsInternal(clientCallback, m_card);
    };
    function onGetCookiesFieldsCallback(clientCallback, result, selectorObject)
    {
        ns.SessionLog("Get cookie selector callback called");
        clientCallback(result, selectorObject);
    }
    this.GetCookieSelector = function GetCookieSelector(clientCallback)
    {
        ns.SessionLog("Get cookie selector called");
        var elements = [];
        elements = Array.prototype.concat.apply(elements, document.getElementsByTagName("div"));
        elements = Array.prototype.concat.apply(elements, document.getElementsByTagName("a"));
        elements = Array.prototype.concat.apply(elements, document.getElementsByTagName("button"));
        elements = Array.prototype.concat.apply(elements, document.getElementsByTagName("input"));
        ns.SessionLog("Elements for cookie selector size: " + elements.length);
        var callback = function CallToService()
        {
            m_callFunction("dp.onGetCookiesFields",
                { dom: "<body>" + (document.body ? document.body.innerHTML : "") + "</body>" },
                function CallCallback(res, args) { onGetCookiesFieldsCallback(clientCallback, res, args); });
        };
        SetWfdIdAttribute(elements, callback);
    };
    function GetTimerCallback(elements, i, finishCallback)
    {
        return function TimerCallback() { SetWfdIdAttribute(elements.slice(i), finishCallback); };
    }
    function SetWfdIdAttribute(elements, finishCallback)
    {
        if (elements)
        {
            for (var i = 0; i < elements.length; i++)
            {
                if (i === 50)
                {
                    ns.SetTimeout(GetTimerCallback(elements, i, finishCallback), 100, m_pluginId);
                    return;
                }
                if (!ns.IsElementDisplayed(elements[i]))
                {
                    ns.ElementSetAttribute.call(elements[i], "wfd-invisible", true);
                }
                else
                {
                    ns.ElementSetAttribute.call(elements[i], "wfd-id", m_wfdIdCounter);
                    m_wfdIdCounter++;
                }
            }
        }
        if (finishCallback)
            finishCallback();
    }
    this.SetWfdIds = function SetWfdIds(settings)
    {
        var inputs = document.getElementsByTagName("input");
        if (inputs)
        {
            for (var i = 0; i < inputs.length; i++)
                AddWfdAttribute(inputs[i], settings);
        }
        if (settings && settings.wfdIdSelector)
        {
            var elements = ns.DocumentQuerySelectorAll(settings.wfdIdSelector);
            if (elements)
            {
                for (var j = 0; j < elements.length; j++)
                {
                    if (!ns.IsElementDisplayed(elements[j]))
                    {
                        ns.ElementSetAttribute.call(elements[j], "wfd-invisible", true);
                    }
                    else
                    {
                        ns.ElementSetAttribute.call(elements[j], "wfd-id", m_wfdIdCounter);
                        m_wfdIdCounter++;
                    }
                }
            }
        }
        return document.documentElement.innerHTML;
    };
    this.Reset = function ResetDomParser()
    {
        ResetCacheFlag();
    };
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function OnInitializeCallback(activatePlugin, registerMethod, callFunction)
    {
        m_callFunction = callFunction;
        activatePlugin(m_pluginId, OnPing);
    }
    function ResetCacheFlag()
    {
        ns.SessionLog("Reset cache flag");
        m_cachedFlag = false;
    }
    function UpdateLocationPathName()
    {
        var currentPathName = GetCurrentPathname();
        if (m_pathName !== currentPathName)
        {
            m_pathName = currentPathName;
            ResetCacheFlag();
        }
    }
    function InitializePlugin()
    {
        session.InitializePlugin(OnInitializeCallback);
        ns.AddEventListener(window, "popstate", ResetCacheFlag, m_pluginId);
        ns.AddEventListener(document, "load", UpdateLocationPathName, m_pluginId);
        ns.SubscribeHistoryChanged(m_pluginId, ResetCacheFlag);
    }
    InitializePlugin();
}
var gDomParser = null;
ns.GetDomParser = function GetDomParser(session)
{
    if (!gDomParser)
        gDomParser = new DomParser(session);
    return gDomParser;
};
return ns;
})(AvNs);
var oldFetch = window.fetch;
var xhrProxyEnabled = true;
var processPostAjaxInSession = AvNs.EmptyFunc;
var functionBind = Function.prototype.bind;
var objectToString = Object.prototype.toString;
var objectKeys = Object.keys;
var arrayMap = Array.prototype.map;
function NormalizeUrl(url)
{
    var e = AvNs.DocumentCreateElement("a");
    e.href = url;
    return e.href;
}
function IsInternalUrl(url)
{
    return AvNs.IsRelativeTransport() ? false : url.indexOf(AvNs.PREFIX) === 0;
}
var oldRequest = void 0;
function GetEntries(obj)
{
    var arr = objectKeys(obj);
    return arrayMap.call(arr, function ObjectToArray(key) { return [key, obj[key]]; });
}
function CopyHeadersValue(initObject, value)
{
    if (objectToString.call(value) === "[object Headers]")
    {
        var headersObject = new Headers(value);
        headersObject.set(AvNs.RequestCustomHeader, "Ajax_Request");
        initObject.headers = headersObject;
    }
    else if (objectToString.call(value) === "[object Array]")
    {
        var headersCopy = JSON.parse(JSON.stringify(value));
        headersCopy.push([AvNs.RequestCustomHeader, "Ajax_Request"]);
        initObject.headers = headersCopy;
    }
    else if (value !== null && typeof value === "object")
    {
        var headers = GetEntries(value);
        for (var j in headers)
        {
            if (!AvNs.ObjectHasOwnProperty.call(headers, j))
                continue;
            var headerKey = headers[j][0];
            var headerValue = headers[j][1];
            initObject.headers[headerKey] = headerValue;
        }
    }
    else
    {
        initObject.headers = value; 
    }
}
function GetLocationHref()
{
    if (document.location)
        return document.location.href;
    return null;
}
function fetchCallImpl()
{
    var args = [].slice.call(arguments);
    try
    {
        if (typeof args[0] === "string") 
        {
            var fetchArguments = [];
            fetchArguments.push(args[0]);
            if (xhrProxyEnabled && AvNs.IsDefined(args[0]) && !AvNs.IsCorsRequest(args[0], GetLocationHref()))
            {
                var initObject = {};
                initObject.headers = {};
                initObject.headers[AvNs.RequestCustomHeader] = "Ajax_Request";
                if (args.length > 1 && args[1] !== null && typeof args[1] === "object")
                {
                    var entries = GetEntries(args[1]);
                    for (var i in entries)
                    {
                        if (!AvNs.ObjectHasOwnProperty.call(entries, i))
                            continue;
                        var key = entries[i][0];
                        var value = entries[i][1];
                        if (AvNs.IsStringEqualIgnoreCase(key, "headers"))
                            CopyHeadersValue(initObject, value);
                        else
                            initObject[key] = value;
                    }
                }
                fetchArguments.push(initObject);
            }
            else if (args.length > 1)
            {
                fetchArguments.push(args[1]);
            }
            args = [].slice.call(fetchArguments);
        }
        else if (args.length !== 0)
        {
            var clsNew = function clsNewFunc(Cls)
            {
                return new (functionBind.apply(Cls, arguments))();
            };
            var clone = [].slice.call(arguments);
            clone.unshift(oldRequest);
            var request = clsNew.apply(this, clone);
            if (xhrProxyEnabled && AvNs.IsDefined(request.url) && !AvNs.IsCorsRequest(request.url, GetLocationHref()))
                request.headers.append(AvNs.RequestCustomHeader, "Ajax_Request");
            args = [request];
        }
    }
    catch (e)
    {
        AvNs.SessionError(e, "xhr");
    }
    return oldFetch.apply(this, args);
}
if (oldFetch)
{
    oldRequest = Request;
    var oldFunctionToString = Function.prototype.toString;
    window.fetch = function fetch() { return fetchCallImpl.apply(this, [].slice.call(arguments)); };
    window.fetch.toString = function toString() { return oldFunctionToString.apply(oldFetch, [].slice.call(arguments)); };
}
var m_requests = {};
var m_idCounter = 0;
function addDescriptor(requestDescriptor)
{
    var id = ++m_idCounter;
    AvNs.SetTimeout(function TimerCallback()
    {
        delete m_requests[id];
    }, 60 * 1000, "xhr");
    m_requests[id] = requestDescriptor;
}
function findRequestDescriptor(request)
{
    for (var index in m_requests)
    {
        if (!AvNs.ObjectHasOwnProperty.call(m_requests, index))
            continue;
        if (m_requests[index].request === request)
            return m_requests[index];
    }
    return null;
}
function deleteDescriptor(request)
{
    for (var index in m_requests)
    {
        if (!AvNs.ObjectHasOwnProperty.call(m_requests, index))
            continue;
        if (m_requests[index].request === request)
            delete m_requests[index];
    }
}
function xhrAbortProcessor()
{
    this.m_isAborted = true;
    AvNs.XMLHttpRequestAbort.apply(this, [].slice.call(arguments));
}
function xhrOpenProcessor()
{
    try
    {
        this.m_isAborted = false;
        if (xhrProxyEnabled && arguments.length > 1 && typeof (arguments[0]) === "string" && AvNs.IsDefined(arguments[1]))
        {
            var requestDescriptor = { request: this, isCORS: AvNs.IsCorsRequest(arguments[1], GetLocationHref()) };
            if (requestDescriptor.isCORS && AvNs.IsStringEqualIgnoreCase(arguments[0], "post") && !IsInternalUrl(NormalizeUrl(arguments[1])))
            {
                var sendCallback = processPostAjaxInSession.apply(this, [].slice.call(arguments));
                if (sendCallback)
                    requestDescriptor.RequestSend = sendCallback;
            }
            addDescriptor(requestDescriptor);
        }
    }
    catch (e)
    {
        AvNs.SessionError(e, "xhr");
    }
    AvNs.XMLHttpRequestOpen.apply(this, [].slice.call(arguments));
}
function xhrSetRequestHeaderProcessor()
{
    try
    {
        if (arguments.length && typeof arguments[0] === "string" && arguments[0].toLowerCase().indexOf(AvNs.RequestCustomHeader.toLowerCase()) === 0)
        {
            var requestDescriptor = findRequestDescriptor(this);
            if (requestDescriptor)
            {
                requestDescriptor.headerSet = true;
                delete requestDescriptor.RequestSend;
            }
            else
            {
                requestDescriptor = { request: this, headerSet: true };
                addDescriptor(requestDescriptor);
            }
        }
    }
    catch (e)
    {
        AvNs.SessionError(e, "xhr");
    }
    return AvNs.XMLHttpRequestSetRequestHeader.apply(this, [].slice.call(arguments));
}
function xhrSendProcessor()
{
    try
    {
        var requestDescriptor = findRequestDescriptor(this);
        if (xhrProxyEnabled && requestDescriptor)
        {
            deleteDescriptor(this);
            if (!requestDescriptor.isCORS && !requestDescriptor.headerSet)
                AvNs.XMLHttpRequestSetRequestHeader.apply(this, [AvNs.RequestCustomHeader, "Ajax_Request"]);
            if (requestDescriptor.RequestSend)
            {
                requestDescriptor.RequestSend.apply(this, [].slice.call(arguments));
                return;
            }
        }
    }
    catch (e)
    {
        AvNs.SessionError(e, "xhr");
    }
    AvNs.XMLHttpRequestSend.apply(this, [].slice.call(arguments));
}
if (AvNs.XMLHttpRequestSend)
{
    window.XMLHttpRequest.prototype.open = function open()
    {
        return xhrOpenProcessor.apply(this, [].slice.call(arguments));
    };
    window.XMLHttpRequest.prototype.send = function send()
    {
        xhrSendProcessor.apply(this, [].slice.call(arguments));
    };
    window.XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader()
    {
        return xhrSetRequestHeaderProcessor.apply(this, [].slice.call(arguments));
    };
    window.XMLHttpRequest.prototype.abort = function abort()
    {
        return xhrAbortProcessor.apply(this, [].slice.call(arguments));
    };
}
AvNs.AddRunner("xhr_content", function AddRunnerXhrContent(ns, session)
{
    var m_callFunction = null;
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function OnError()
    {
        xhrProxyEnabled = false;
    }
    function Initialize()
    {
        xhrProxyEnabled = true;
        session.InitializePlugin(function InitializePluginXhrContent(activatePlugin, registerMethod, callFunction)
        {
            m_callFunction = callFunction;
            activatePlugin("xhr_content", OnPing, OnError);
            processPostAjaxInSession = function processPostAjaxInSession() 
            {
                var sendArguments = "";
                var request = null;
                var notifyComplete = false;
                var async = arguments.length < 3 || typeof arguments[2] !== "boolean" || arguments[2];
                var callback = function callback()
                {
                    if (request)
                    {
                        try
                        {
                            if (request.m_isAborted)
                                return;
                            AvNs.XMLHttpRequestSend.apply(request, sendArguments);
                        }
                        catch (e)
                        {
                            ns.SessionLog("Failed origin send + " + e.toString());
                        }
                    }
                    else
                    {
                        notifyComplete = true;
                    }
                };
                var remoteFunctionName = "xhr.ajaxRequestNotify";
                var targetUrl = NormalizeUrl(arguments[1]);
                var remoteFunctionArguments = { url: ns.ToBase64(targetUrl), urlEncrypted: true };
                var result = m_callFunction(remoteFunctionName, remoteFunctionArguments, callback, callback, async);
                if (!result && !async)
                {
                    m_callFunction(remoteFunctionName, remoteFunctionArguments, callback, callback);
                    notifyComplete = true;
                }
                return function processPostAjax()
                {
                    if (notifyComplete)
                    {
                        AvNs.XMLHttpRequestSend.apply(this, [].slice.call(arguments));
                    }
                    else
                    {
                        sendArguments = arguments.length > 0
                            ? [arguments[0] && arguments[0].slice ? arguments[0].slice() : arguments[0]]
                            : [];
                        request = this; 
                    }
                };
            };
        });
    }
    Initialize();
}, { referrer: document.referrer });
(function XhrTrackerConstants(ns)
{
ns.RequestCustomHeader = "X-KL-saas-Ajax-Request";
})(AvNs || {});
(function BallonMain(ns)
{
ns.Balloon2 = function Balloon2(pluginName, balloonSrc, balloonCssPostfix, session, getCoordCallback, onCloseHandler, locales, onDataReceiveHandler)
{
    var m_balloon = ns.DocumentCreateElement("iframe");
    var m_shadowRoot = null;
    var m_balloonId = pluginName + "_b";
    var m_balloonClassName = "b_KlBalloonClass"; 
    var m_balloonSize = null;
    var m_sizeCache = {};
    var m_initStyleDataPair = {};
    var m_isInitSent = false;
    var m_updateTimeout = null;
    var m_balloonElementInDom = false;
    var m_isBalloonLoaded = false;
    var m_callQueue = [];
    function ChangeSchemeIfNeed(url)
    {
        if (document.location.protocol === "https:")
            return url.replace("http:", "https:");
        return url;
    }
    function GetResourceUrl()
    {
        return balloonCssPostfix
            ? ns.GetResourceSrc(balloonSrc) + "?cssSrc=" + encodeURIComponent(ChangeSchemeIfNeed(ns["GetResourceSrc"](balloonCssPostfix)))
            : ns.GetResourceSrc(balloonSrc);
    }
    function HideBalloon()
    {
        m_balloon.style.display = "none";
    }
    function InitializeBalloon()
    {
        if (!document.body)
        {
            ns.AddEventListener(window, "load", InitializeBalloon, m_balloonId);
            return;
        }
        m_balloon.scrolling = "no";
        m_balloon.frameBorder = "0";
        m_balloon.style.border = "0";
        m_balloon.style.height = "1px";
        m_balloon.style.width = "1px";
        m_balloon.style.left = "1px";
        m_balloon.style.top = "1px";
        m_balloon.allowTransparency = "true"; 
        m_balloon.style.zIndex = "2147483647";
        m_balloon.style.position = "absolute";
        m_balloon.id = "KlIFrameId";
        if (ns.ElementAttachShadow)
        {
            m_shadowRoot = ns.DocumentCreateElement("div");
            ns.ElementSetAttribute.call(m_shadowRoot, "class", m_balloonClassName);
            var shadowRoot = ns.ElementAttachShadow.call(m_shadowRoot, { mode: "open" });
            shadowRoot.appendChild(m_balloon);
            document.body.appendChild(m_shadowRoot);
        }
        else
        {
            document.body.appendChild(m_balloon);
        }
        m_balloonElementInDom = true;
        HideBalloon();
    }
    function IsDisplayed()
    {
        return m_balloonElementInDom && m_balloon.style.display === "";
    }
    function OnPing()
    {
        return IsDisplayed() ? 100 : ns.MaxRequestDelay;
    }
    function SendToFrame(args)
    {
        if (!m_balloon.contentWindow)
        {
            ns.SessionLog("No content window for balloon. Possible iframe detached");
            return;
        }
        if (m_isBalloonLoaded)
            m_balloon.contentWindow.postMessage(ns.JSONStringify(args), GetResourceUrl());
        else
            m_callQueue.push(function DeferSend() { m_balloon.contentWindow.postMessage(ns.JSONStringify(args), GetResourceUrl()); });
    }
    function SendInit(dataToFrame)
    {
        dataToFrame.style = m_initStyleDataPair.style;
        dataToFrame.data = m_initStyleDataPair.data;
        m_isInitSent = true;
        SendToFrame(dataToFrame);
        session.ForceReceive();
    }
    function PutSizeInCache(style, size)
    {
        m_sizeCache[style ? style.toString() : ""] = size;
    }
    function PositionBalloon()
    {
        if (!m_balloonSize)
            return;
        var coords = getCoordCallback(m_balloonSize);
        var newHeight = m_balloonSize.height + "px";
        var newWidth = m_balloonSize.width + "px";
        if (newHeight !== m_balloon.style.height 
            || newWidth !== m_balloon.style.width)
        {
            m_balloon.style.height = newHeight;
            m_balloon.style.width = newWidth;
            ns.SessionLog("Change balloon size " + m_balloonId + " height: " + newHeight + " width: " + newWidth);
        }
        if (!coords)
        {
            ns.SessionLog("Change balloon position skiped");
            return;
        }
        var newX = Math.round(coords.x).toString() + "px";
        var newY = Math.round(coords.y).toString() + "px";
        if (newX !== m_balloon.style.left 
            || newY !== m_balloon.style.top)
        {
            m_balloon.style.left = newX;
            m_balloon.style.top = newY;
            ns.SessionLog("Change balloon position " + m_balloonId + " x: " + newX + " y: " + newY);
        }
    }
    function SetupBalloon(balloonSize)
    {
        m_balloonSize = balloonSize;
        PositionBalloon();
    }
    function OnSizeMessage(sizeMessage)
    {
        var size = {
            height: sizeMessage.height,
            width: sizeMessage.width
        };
        if (size.height > 1 && size.width > 1)
            PutSizeInCache(sizeMessage.style, size);
        SetupBalloon(size);
    }
    function OnCloseMessage(closeData)
    {
        HideBalloon();
        if (onCloseHandler && closeData.closeAction)
            onCloseHandler(closeData.closeAction);
    }
    function OnDataMessage(data)
    {
        if (onDataReceiveHandler)
            onDataReceiveHandler(data);
    }
    function GetSizeFromCache(style)
    {
        return m_sizeCache[style ? style.toString() : ""];
    }
    function DisplayBalloon()
    {
        m_balloon.style.display = "";
        session.ForceReceive();
    }
    function UpdateBalloon(style, data)
    {
        if (!m_isInitSent)
            m_initStyleDataPair = { style: style, data: data };
        var sizeFromCache = GetSizeFromCache(style);
        ns.ClearTimeout(m_updateTimeout);
        if (sizeFromCache)
        {
            m_updateTimeout = ns.SetTimeout(function UpdateTimerCallback() { SetupBalloon(sizeFromCache); }, 0, "balloon_" + pluginName);
        }
        else
        {
            m_balloon.style.height = "1px";
            m_balloon.style.width = "1px";
            m_balloonSize = { height: 1, width: 1 };
        }
        var dataToFrame = {
            command: "update",
            style: style,
            data: data,
            needSize: !sizeFromCache
        };
        SendToFrame(dataToFrame);
    }
    function CreateBalloon(style, data, size)
    {
        if (!m_balloonElementInDom)
            InitializeBalloon();
        DisplayBalloon();
        if (m_balloon.src)
        {
            UpdateBalloon(style, data);
            return;
        }
        m_initStyleDataPair = { style: style, data: data };
        m_balloon.src = GetResourceUrl();
        var balloonSize = size ? size : GetSizeFromCache(style);
        var dataToFrame = {
            command: "init",
            pluginName: m_balloonId,
            isRtl: ns.IsRtl,
            needSize: !balloonSize,
            style: style
        };
        if (data)
            dataToFrame.data = data;
        if (size)
            dataToFrame.explicitSize = size;
        if (locales)
            dataToFrame.locales = locales;
        dataToFrame.commandUrl = ChangeSchemeIfNeed(ns.GetCommandSrc());
        ns.AddEventListener(m_balloon, "load", function onLoad()
        { 
            m_isBalloonLoaded = true;
            SendInit(dataToFrame);
            while (m_callQueue.length)
                m_callQueue.shift()();
        }, "balloon");
        if (balloonSize)
        {
            ns.ClearTimeout(m_updateTimeout);
            m_updateTimeout = ns.SetTimeout(function UpdateTimerCallback() { SetupBalloon(balloonSize); }, 0);
        }
    }
    function DestroyBalloon()
    {
        if (!m_balloonElementInDom)
            return;
        m_balloon.blur(); 
        if (m_shadowRoot)
            ns.RemoveElement(m_shadowRoot);
        else
            ns.RemoveElement(m_balloon);
        m_balloonElementInDom = false;
        m_balloonSize = null;
    }
    this.Show = function Show(style, data)
    {
        CreateBalloon(style, data);
    };
    this.ShowWithSize = function ShowWithSize(style, data, size)
    {
        CreateBalloon(style, data, size);
    };
    this.Resize = function Resize(size)
    {
        SetupBalloon(size);
    };
    this.Hide = function Hide()
    {
        HideBalloon();
    };
    this.Update = function Update(style, data)
    {
        UpdateBalloon(style, data);
    };
    this.UpdatePosition = function UpdatePosition()
    {
        PositionBalloon();
    };
    this.LightUpdatePosition = function LightUpdatePosition(x, y)
    {
        var newX = Math.round(x).toString() + "px";
        var newY = Math.round(y).toString() + "px";
        if (newX !== m_balloon.style.left 
            || newY !== m_balloon.style.top)
        {
            m_balloon.style.left = newX;
            m_balloon.style.top = newY;
        }
        var dataToFrame = {
            command: "update",
            data: {}
        };
        SendToFrame(dataToFrame);
    };
    this.Destroy = function Destroy()
    {
        DestroyBalloon();
    };
    this.IsFocused = function IsFocused()
    {
        if (!m_balloon)
            return false;
        return document.activeElement === m_balloon;
    };
    function OnFrameDataMessage(argument)
    {
        if (!argument)
        {
            ns.SessionLog(m_balloonId + " empty argument");
            return;
        }
        if (!argument.message)
        {
            ns.SessionLog(m_balloonId + " empty message.");
            return;
        }
        var message = ns.JSONParse(argument.message);
        if (message.type === "size")
            OnSizeMessage(message.data);
        else if (message.type === "close")
            OnCloseMessage(message.data);
        else if (message.type === "data")
            OnDataMessage(message.data);
        else if (message.type === "trace")
            ns.SessionLog(message.data);
        else
            ns.SessionError({ message: "Unknown message type", details: "type: " + message.type }, m_balloonId);
    }
    function Init()
    {
        session.InitializePlugin(function InitializePluginBalloon(activatePlugin, registerMethod)
            {
                activatePlugin(m_balloonId, OnPing);
                registerMethod(m_balloonId + ".message", OnFrameDataMessage);
            });
    }
    Init();
};
return ns;
})(AvNs);
AvNs.StartSession();
 })();
