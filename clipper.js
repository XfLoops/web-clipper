 var YWebClipperConfiguration = {
        logEnabled: false,
        clipperBaseURL: "http://note.youdao.com/yws",
        clipperUploadApp: "/mapi/wcp?method=putfile&keyfrom=wcp",
        logurl: "/mapi/ilogrpt?method=putwcplog",
        clipperClipType: "OnlyHTML",
        clipperDomPrefix: "_YNote",
        loadingHTML: '<div id="_YNoteLoaddingTips" name="_YNoteLoaddingTips" style="position:absolute;z-index:999999;top:50%;left:50%;width:180px;margin:-12px 0 0 -91px;font-weight:bold;text-align:center;line-height:22px;border:1px solid #fff999;background-color:rgba(255,249,153,.9)!important;background:#fff999;border-radius:5px;-khtml-border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;">正在加载中，请稍候…</div>',
        clipperFormFields: [
            ["title", "text", "tl"],
            ["path", "text", "p"],
            ["content", "area", "bs"],
            ["source", "text", "src"],
            ["type", "text", "type"],
            ["userid", "text", "userid"],
            ["len", "text", "len"],
            ["charset", "text", "cs"],
            ["sign", "text", "e"]
        ],
        clipperStyle: "position:fixed;right:10px;top:10px;padding-bottom:10px;font:12px/100% arial,sans-serif;color:#333; width: 420px;_right:expression(eval(document.documentElement.scrollLeft));_top:expression(eval(document.documentElement.scrollTop+10));_position:absolute;",
        styleMerge: {
            margin: ["margin-top", "margin-right", "margin-bottom", "margin-left"],
            padding: ["padding-top", "padding-right", "padding-bottom", "padding-left"],
            "list-style": ["list-style-type", "list-style-position", "list-style-image"],
            border: ["border-bottom"]
        },
        formatTag: {
            br: null,
            p: null,
            img: null
        },
        styleQuote: {
            "font-family": true
        },
        clipperFilterStyles: {
            keep: {
                "*": ["font-size", "font-style", "font-weight", "font-family", "color"],
                li: ["list-style"],
                ul: ["list-style"]
            },
            remove: {},
            "default": {}
        },
        clipperFilterAttributes: {
            keep: {},
            remove: {
                style: null,
                "class": null,
                classname: null,
                id: null,
                onclick: null,
                onsubmit: null,
                onmouseover: null,
                onmouseout: null,
                onmousedown: null,
                onpaste: null,
                contenteditable: null,
                designmode: null,
                onload: null,
                "for": null,
                method: null,
                tabindex: null
            }
        },
        filterElements: {
            keep: {},
            remove: {
                style: null,
                script: null,
                input: null,
                select: null,
                option: null,
                textarea: null,
                button: null,
                object: null,
                applet: null,
                embed: null
            }
        },
        listNodes: {
            ul: null,
            ol: null
        },
        selfCloseTag: {
            base: null,
            basefont: null,
            frame: null,
            link: null,
            meta: null,
            area: null,
            br: null,
            col: null,
            hr: null,
            img: null,
            input: null,
            param: null
        },
        translateTagName: {
            body: "div",
            form: "div",
            strong: "span",
            h1: "span"
        },
        names: {
            FrameName: "YNoteForm" + Math.floor(Math.random(1e4)),
            FormName: "YNoteForm" + Math.floor(Math.random(1e4))
        },
        doc: {
            mainContent: null,
            mainContentTag: null,
            container: window.document,
            contentType: "1"
        }
    };
    (function () {
        if (CSSStyleDeclaration.prototype.getPropertyCSSValue == undefined) {
            function CSSValue(self, ruleName) {
                this.cssText = CSSStyleDeclaration.prototype.getPropertyValue.call(self, ruleName)
            }

            CSSValue.constructor = CSSValue;
            CSSValue.prototype.toString = function () {
                return this.cssText
            };
            CSSStyleDeclaration.prototype.getPropertyCSSValue = function (ruleName) {
                return new CSSValue(this, ruleName)
            }
        }
    })();
    (function () {
        var Page = function (document) {
            this.contentDocument = document
        };
        Page.common = {
            trim: function (str) {
                return str.replace(/^\s*/, "").replace(/\s*$/, "")
            },
            isFunction: function (obj) {
                return Object.prototype.toString.call(obj) === "[object Function]"
            },
            findPos: function (elem) {
                var offset = {
                    x: 0,
                    y: 0
                };
                if (!!document.documentElement.getBoundingClientRect()) {
                    offset.x = elem.getBoundingClientRect().left + this.scroll().left;
                    offset.y = elem.getBoundingClientRect().top + this.scroll().top
                } else {
                    while (elem) {
                        offset.x += elem.offsetLeft;
                        offset.y += elem.offsetTop;
                        elem = elem.offsetParent
                    }
                }
                return offset
            },
            indexOf: function indexOf(obj, val) {
                if (obj.indexOf) {
                    return obj.indexOf(val)
                } else {
                    var result = -1;
                    this.each(obj, function (idx) {
                        if (this[idx] === val) {
                            result = idx;
                            return false
                        }
                    });
                    return result
                }
            },
            each: function (object, callback, context) {
                if (object === undefined || object === null) {
                    return
                }
                if (object.length === undefined || this.isFunction(object)) {
                    for (var name in object) {
                        if (object.hasOwnProperty(name)) {
                            if (callback.call(context || object[name], name, object[name]) === false) {
                                break
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < object.length; i++) {
                        if (callback.call(context || object, i, object[i]) === false) {
                            break
                        }
                    }
                }
                return object
            },
            css: function () {
                var getStyle = function (elem, styleName) {
                    var value = "";
                    if (styleName == "float") {
                        document.defaultView ? styleName = "float" : styleName = "styleFloat"
                    }
                    if (elem.style[styleName]) {
                        value = elem.style[styleName]
                    } else if (elem.currentStyle) {
                        value = elem.currentStyle[styleName]
                    } else if (document.defaultView && document.defaultView.getComputedStyle) {
                        styleName = styleName.replace(/([A-Z])/g, "-$1").toLowerCase();
                        var s = document.defaultView.getComputedStyle(elem, "");
                        value = s && s.getPropertyValue(styleName)
                    } else {
                        value = null
                    }
                    if ((value == "auto" || value.indexOf("%") !== -1) && ("width" === styleName.toLowerCase() || "height" === styleName.toLowerCase()) && elem.style.display != "none" && value.indexOf("%") !== -1) {
                        value = elem["offset" + styleName.charAt(0).toUpperCase() + styleName.substring(1).toLowerCase()] + "px"
                    }
                    if (styleName == "opacity") {
                        try {
                            value = elem.filters["DXImageTransform.Microsoft.Alpha"].opacity;
                            value = value / 100
                        } catch (e) {
                            try {
                                value = elem.filters("alpha").opacity
                            } catch (err) {
                            }
                        }
                    }
                    return value
                };
                return function (elem, styles) {
                    if (typeof styles === "string") {
                        return getStyle(elem, styles)
                    } else {
                        this.each(styles, function (key, value) {
                            elem.style[key] = value
                        })
                    }
                }
            }(),
            scroll: function () {
                return {
                    left: document.documentElement.scrollLeft + document.body.scrollLeft,
                    top: document.documentElement.scrollTop + document.body.scrollTop
                }
            }
        };
        Page.prototype = {
            IGNORE_TAGS: ["HTML", "HEAD", "META", "TITLE", "SCRIPT", "STYLE", "LINK", "IMG", "FORM", "INPUT", "BODY", "BUTTON", "TEXTAREA", "SELECT", "OPTION", "LABEL", "IFRAME", "UL", "OL", "LI", "DD", "DL", "DT", "A", "OBJECT", "PARAM", "EMBED", "NOSCRIPT", "EM", "B", "STRONG", "I", "INS", "BR", "HR", "PRE", "H1", "H2", "H3", "H4", "H5", "CITE"],
            getMainArticle: function () {
                var mainArticle = null,
                    hostname = "";
                if (!!location) {
                    hostname = location.hostname
                }
                if (/\b(google|facebook|twitter)\b/i.test(hostname)) {
                    return null
                }
                var elems = this._getAllArticle();
                if (!(elems && elems.length)) {
                    return null
                }
                elems.sort(function (a, b) {
                    return b.weight - a.weight
                });
                var temp = null;
                for (var i = 0; i < 2; i++) {
                    mainArticle = elems[0];
                    elems.splice(0, 1);
                    if (mainArticle && mainArticle.weight < 500) {
                        mainArticle = null
                    }
                    if (mainArticle) {
                        break
                    }
                }
                if (!mainArticle) {
                    return null
                }
                return mainArticle
            },
            _sort: function (elems) {
                for (var w = 0, elem = null, i = 0; i < elems.length; i++) {
                    var temp = elems[i];
                    var weight = temp.weight;
                    if (weight >= w) {
                        w = weight;
                        elem = temp
                    }
                }
                return elem
            },
            _getAllArticle: function () {
                var allElems = this.contentDocument.getElementsByTagName("*"),
                    elems = [];
                for (var elemIndex = 0, length = allElems.length; elemIndex < length; elemIndex++) {
                    var elem = allElems[elemIndex];
                    if (this._checkTagName(elem) && this._checkSize(elem) && this._checkVisibility(elem)) {
                        elems[elems.length] = new Article(elem)
                    }
                }
                return elems
            },
            _checkTagName: function (elem) {
                return Page.common.indexOf(this.IGNORE_TAGS, elem.tagName) == -1
            },
            _checkVisibility: function (elem) {
                return !(Page.common.css(elem, "visibility") == "hidden" || Page.common.css(elem, "display") == "none" || parseInt(Page.common.css(elem, "height")) <= 0 || parseInt(Page.common.css(elem, "width")) <= 0)
            },
            _checkSize: function (elem) {
                return elem.offsetWidth > 300 && elem.offsetHeight > 150
            }
        };
        var Article = function (elem) {
            this.elem = elem;
            this.common = Page.common;
            this.offset = this.common.findPos(elem);
            this._texts = this._getAllTexts(elem, 6);
            this.weight = this.calcWeight()
        };
        Article.prototype = {
            IGNORE_TAGS: ["A", "DD", "DT", "OL", "OPTION", "DL", "DD", "SCRIPT", "STYLE", "UL", "LI", "IFRAME"],
            TITLE_TAGS: ["H1", "H2", "H3", "H4", "H5", "H6"],
            MINOR_REGEXP: /comment|combx|disqus|foot|header|menu|rss|shoutbox|sidebar|sponsor/i,
            MAJOR_REGEXP: /article|entry|post|body|column|main|content/i,
            TINY_REGEXP: /comment/i,
            BLANK_REGEXP: /\S/i,
            _getAllTexts: function (node, num) {
                var result = [];
                if (num > 0) {
                    var subNode = node.firstChild;
                    while (subNode) {
                        if (subNode.nodeType == 3 && this._checkLength(subNode)) {
                            var parent = subNode.parentNode || {},
                                grandParent = parent.parentNode || {};
                            if (!(this._checkMinorContent(parent) || this._checkMinorContent(grandParent)) && Page.common.trim(subNode.nodeValue)) {
                                result.push(subNode)
                            }
                        } else {
                            if (subNode.nodeType == 1 && this._checkTagName(subNode)) {
                                result = result.concat(this._getAllTexts(subNode, num - 1))
                            }
                        }
                        subNode = subNode.nextSibling
                    }
                }
                return result
            },
            calcStructWeight: function () {
                var structWeight = 0;
                for (var textIndex = 0, textLength = this._texts.length; textIndex < textLength; textIndex++) {
                    var text = this._texts[textIndex],
                        length = Page.common.trim(text.nodeValue).length,
                        weight = 1;
                    if (length < 20) {
                        continue
                    }
                    for (var elem = text.parentNode; elem && elem != this.elem; elem = elem.parentNode) {
                        weight -= .1
                    }
                    structWeight += Math.pow(weight * length, 1.25)
                }
                return structWeight
            },
            calcContentWeight: function () {
                var contentWeight = 1;
                for (var elem = this.elem; elem; elem = elem.parentNode) {
                    if (elem.id) {
                        if (this.MAJOR_REGEXP.test(elem.id)) {
                            contentWeight += .4
                        }
                        if (this.MINOR_REGEXP.test(elem.id)) {
                            contentWeight -= .8
                        }
                    }
                    if (elem.className) {
                        if (this.MAJOR_REGEXP.test(elem.className)) {
                            contentWeight += .4
                        }
                        if (this.MINOR_REGEXP.test(elem.className)) {
                            contentWeight -= .8
                        }
                    }
                }
                return contentWeight
            },
            calcWeight: function () {
                return this.calcStructWeight() * this.calcContentWeight()
            },
            _checkTagName: function (elem) {
                return Page.common.indexOf(this.IGNORE_TAGS, elem.tagName) == -1
            },
            _checkTitle: function () {
                var arrTemp = this.elem.getElementsByTagName("*");
                var arr = [];
                for (var i = 0; arrTemp[i]; i++) {
                    if (Page.common.indexOf(this.TITLE_TAGS, arrTemp[i].tagName) > -1) {
                        arr.push(arrTemp[i])
                    }
                }
                if (arr.length > 2) {
                    var eheight = this.elem.offsetHeight;
                    for (var count = 0, epos = Page.common.findPos(this.elem), cheight = eheight * .05, j = 0; arr[j]; j++) {
                        var tpos = Page.common.findPos(arr[j]);
                        tpos.y - epos.y > cheight && tpos.y + arr[j].offsetHeight - (epos.y + eheight) && count++
                    }
                    if (eheight / count < 300) return true
                }
                return false
            },
            _checkLength: function (elem) {
                return Boolean(this.BLANK_REGEXP.test(elem.nodeValue))
            },
            _checkMinorContent: function (elem) {
                return Boolean(this.TINY_REGEXP.test(elem.id + " " + elem.className))
            },
            _checkVisibility: function (elem) {
                return !(Page.common.css(elem, "visibility") == "hidden" || Page.common.css(elem, "display") == "none" || parseInt(Page.common.css(elem, "height")) <= 0 || parseInt(Page.common.css(elem, "width")) <= 0)
            }
        };
        window.Page = Page
    })();
    (function () {
        if (typeof Function.prototype.inherit != "function") {
            Function.prototype.inherit = function (baseClass) {
                if (typeof baseClass == "function") {
                    this.prototype = new baseClass;
                    this.prototype.parent = baseClass();
                    this.prototype.constructor = this
                }
            }
        }
        var _t = function (text) {
            return text
        };
        var OldYNote = null;
        var doc = window.document;
        if (typeof YNote != "undefined") {
            OldYNote = YNote
        }
        YNote = {};
        YNote.Common = {
            browser: function () {
                return {
                    isIE: navigator.appVersion.indexOf("MSIE", 0) != -1,
                    isSafari: navigator.appVersion.indexOf("WebKit", 0) != -1,
                    isFirefox: navigator.userAgent.indexOf("Firefox", 0) != -1,
                    isIpad: navigator.userAgent.indexOf("WebKit") > 0 && navigator.userAgent.indexOf("iPad") > 0,
                    isIphone: navigator.userAgent.indexOf("WebKit") > 0 && navigator.userAgent.indexOf("iPhone") > 0,
                    isChrome: navigator.userAgent.indexOf("WebKit") > 0 && navigator.userAgent.indexOf("Chrome") > 0
                }
            }(),
            trim: function (str) {
                if (typeof str != "string") {
                    return str
                } else {
                    return str.replace(/^\s+/, "").replace(/\s+$/, "")
                }
            },
            getCssText: function (style) {
            },
            check163Auth: function (content) {
            },
            configuration: function () {
                return {
                    load: function () {
                    },
                    reload: function () {
                    },
                    addConfigurationChangeListener: function (fn) {
                    },
                    removeConfigurationChangeListener: function (fn) {
                    }
                }
            },
            extend: function (obj, ex, rep) {
                if (typeof ex != "object") {
                    return false
                }
                for (var key in ex) {
                    if (typeof obj[key] != "undefined") {
                        if (!rep) {
                            obj[key] = ex[key]
                        } else {
                            obj[key] = [obj[key], ex[key]]
                        }
                    } else {
                        obj[key] = ex[key]
                    }
                }
            },
            el: function (id) {
                return doc.getElementById(id)
            },
            mkel: function (html, parent) {
                try {
                    var o = doc.createElement(html);
                    if (parent) parent.appendChild(o);
                    return o
                } catch (e) {
                    return false
                }
            },
            addEvent: function (el, evt, fn) {
                if (!el.nodeType || el.nodeType != 1) {
                    return false
                }
                if (YNote.Common.browser.isIE) {
                    el.attachEvent("on" + evt, fn)
                } else {
                    el.addEventListener(evt, fn, false)
                }
            },
            deleteEvent: function (el, evt, fn) {
                if (!el.nodeType || el.nodeType != 1) {
                    return false
                }
                if (YNote.Common.browser.isIE) {
                    el.detachEvent("on" + evt, fn)
                } else {
                    el.removeEventListener(evt, fn, false)
                }
            },
            wrapperEvent: function (e) {
                var ev = {
                    target: YNote.Common.browser.isIE ? e.srcElement : e.target,
                    offsetX: YNote.Common.browser.isIE ? e.offsetX : e.layerX,
                    offsetY: YNote.Common.browser.isIE ? e.offsetY : e.layerY,
                    x: YNote.Common.browser.isIE ? e.x : e.pageX,
                    y: YNote.Common.browser.isIE ? e.y : e.pageY
                };
                return ev
            },
            enableDrag: function (el) {
                var win = window;
                if (typeof el == "string") {
                    el = YNote.Common.el(el)
                }
                if (el.nodeType && el.nodeType == 1 && el.tagName.toLowercase() == "div") {
                    el.style.position = "absolute";
                    YNote.Common.addEvent(el, "mousedown", function (event) {
                        if (typeof win.YNoteDragObject == "undefined" || win.YNoteDragObject == null) {
                            var evt = YNote.Common.wrapperEvent(event);
                            win.YNoteDragObject = {
                                element: evt.target,
                                startX: evt.offsetX,
                                startY: evt.offsetY
                            }
                        } else {
                            return false
                        }
                    });
                    if (typeof win.YNoteDragObject == "undefined") {
                        YNote.Common.addEvent(win.document, "mouseup", function (event) {
                            if (win.YNoteDragObject != null) {
                                win.YNoteDragObject = null
                            }
                        });
                        YNote.Common.addEvent(win.document, "mousemove", function (event) {
                            if (typeof win.YNoteDragObject == "undefined" || win.YNoteDragObject == null) {
                                return
                            }
                            var evt = YNote.Common.wrapperEvent(event);
                            win.YNoteDragObject.element.style.left = evt.x - win.YNoteDragObject.startX + "px";
                            win.YNoteDragObject.element.style.top = evt.y - win.YNoteDragObject.startY + "px"
                        })
                    }
                }
            },
            serverlog: function (mess) {
                var img = new Image;
                var config = YWebClipperConfiguration;
                var url = config.clipperBaseURL + config.logurl;
                img.src = url + "&s=" + mess
            },
            log: function (mess) {
                if (!YWebClipperConfiguration.logEnabled) {
                    return false
                }
                if (typeof console == "undefined") {
                    console = function () {
                        var logPanel = doc.createElement("div");
                        logPanel.style.cssText = "width:100%;height:500px;border:1pt solid " + "black;position:absolute;left:0px;top:800px";
                        logPanel.innerHTML = '<textarea style="width:100%;' + 'height:450px" id="console_log"></textarea>';
                        doc.body.appendChild(logPanel);
                        return {
                            log: function (str) {
                                doc.getElementById("console_log").value += str + "\n"
                            }
                        }
                    }()
                }
                if (typeof console.log == "undefined") {
                    return
                }
                console.log(mess)
            },
            Dom: {
                appendHTMLToIframe: function (iframe, html) {
                    if (iframe.tagName && iframe.tagName.toLowerCase() == "iframe") {
                        var doc = iframe.contentWindow.document;
                        try {
                            doc.open();
                            doc.write(html);
                            doc.close()
                        } catch (e) {
                            YNode.Common.log("append HTML to [iframe:" + iframe.name + "] ERROR!")
                        }
                    }
                }
            },
            getCharSet: function () {
                if (YNote.Common.browser.isIE) {
                    return document.charset.toLowerCase()
                } else {
                    return document.characterSet.toLowerCase()
                }
            },
            HTMLEncode: function (str) {
                var result = "";
                var len = str.length;
                var ua = navigator.userAgent.toLowerCase();
                var IEVer = /msie/.test(ua) ? parseFloat(ua.match(/msie ([\d.]+)/)[1]) : false;
                if (IEVer >= 7) {
                    for (var i = 0; i < len; i++) {
                        result += str.charCodeAt(i) + " "
                    }
                } else {
                    for (var i = 0; i < str.length; i++) {
                        var charcode = str.charCodeAt(i);
                        var aChar = str[i];
                        if (charcode > 127) {
                            result += "&#" + charcode + ";"
                        } else if (aChar == ">") {
                            result += "&gt;"
                        } else if (aChar == "<") {
                            result += "&lt;"
                        } else if (aChar == "&") {
                            result += "&amp;"
                        } else {
                            result += str.charAt(i)
                        }
                    }
                }
                return result
            },
            unicodeEncode: function (str) {
                var result = "";
                if (typeof str == "string") {
                    for (var i = 0; i < str.length; i++) {
                        var c = str.charCodeAt(i);
                        if (c > 127) {
                            result += "&#" + c + ";"
                        } else {
                            result += str.charAt(i)
                        }
                    }
                }
                return result
            }
        };
        YNote.EventInterface = function () {
        };
        YNote.Common.extend(YNote.EventInterface.prototype, {
            addEventListener: function (eventType, fn) {
            },
            removeEventListener: function (eventType, fn) {
            },
            executeEvent: function (eventType) {
            },
            fireEvent: function (eventType) {
            },
            events: {}
        });
        YNote.StyleUtil = function () {
        };
        YNote.Common.extend(YNote.StyleUtil.prototype, {
            styleForNode: function (node, parentNode) {
                this.cssNameMap = {};
                if (node && node.nodeType && node.nodeType == 1) {
                    var styles = null;
                    if (YNote.Common.browser.isIE) {
                        styles = node.currentStyle
                    } else {
                        styles = window.getComputedStyle(node, null)
                    }
                    var keepStyles = YWebClipperConfiguration.clipperFilterStyles.keep;
                    var nodeStyles = null;
                    if (typeof keepStyles[node.tagName.toLowerCase()] == "undefined") {
                        nodeStyles = keepStyles["*"]
                    } else {
                        nodeStyles = keepStyles[node.tagName.toLowerCase()]
                    }
                    var str = "";
                    var cssArray = {};
                    var mergedStyle = YWebClipperConfiguration.styleMerge;
                    for (var i = 0; i < nodeStyles.length; i++) {
                        if (YNote.Common.browser.isIE) {
                            var cssName = nodeStyles[i];
                            if (mergedStyle[cssName]) {
                                cssArray[cssName] = this.getCompoundCssString(cssName, styles)
                            } else {
                                cssName = this.cssName2ScriptName(nodeStyles[i]);
                                if (!/#000000|none|auto|visible|arial/i.test("" + styles[cssName])) cssArray[cssName] = ("" + styles[cssName]).replace(/"/g, "'")
                            }
                        } else {
                            var cssName = nodeStyles[i];
                            if (mergedStyle[cssName]) {
                                cssArray[cssName] = this.getCompoundCssString(cssName, styles)
                            } else {
                                var t = styles.getPropertyCSSValue(cssName);
                                if (t != null) {
                                    if (!/#000000|none|auto|visible|arial/i.test(t.cssText)) cssArray[cssName] = t.cssText.replace(/"/g, "'")
                                }
                            }
                        }
                    }
                    this.cssArray = cssArray;
                    return this.getStyleString(cssArray)
                } else {
                    return ""
                }
            },
            getStyleString: function (cssArray) {
                var str = "";
                var ckey = "";
                for (var key in cssArray) {
                    if (cssArray[key].length != 0) {
                        if (YNote.Common.browser.isIE) {
                            ckey = typeof this.cssNameMap[key] != "undefined" && this.cssNameMap[key].length > 0 ? this.cssNameMap[key] : key
                        } else {
                            ckey = key
                        }
                        str += ckey + ":" + cssArray[key] + ";"
                    }
                }
                return str
            },
            getCompoundCssString: function (cssName, styles) {
                var mergedStyle = YWebClipperConfiguration.styleMerge;
                var str = "";
                for (var i = 0; i < mergedStyle[cssName].length; i++) {
                    if (YNote.Common.browser.isIE) {
                        var name = this.cssName2ScriptName(mergedStyle[cssName][i]);
                        str += styles[name] + " "
                    } else {
                        str += styles.getPropertyCSSValue(mergedStyle[cssName][i]).cssText + " "
                    }
                }
                str = str.substring(0, str.length - 1);
                if (/(0px ?){4}|(auto ?){4}/i.test(str)) return "";
                else return str
            },
            cssName2ScriptName: function (cssName) {
                if (typeof cssName == "string" && cssName.indexOf("-") > 0) {
                    var names = cssName.split("-");
                    var scriptName = names[0];
                    for (var i = 1; i < names.length; i++) {
                        scriptName += names[i].substring(0, 1).toUpperCase() + names[i].substring(1)
                    }
                    this.cssNameMap[scriptName] = cssName;
                    return scriptName
                } else if (typeof cssName == "string") {
                    if (cssName == "float") {
                        return "styleFloat"
                    } else {
                        return cssName
                    }
                } else {
                    return ""
                }
            },
            mergeDefaultCssValue: function () {
            }
        });
        YNote.Clipper = function () {
            this.content = null;
            this.title = null;
            try {
                this.source = window.location.href
            } catch (e) {
                this.source = ""
            }
            this.type = null;
            this.selector = new YNote.Selection;
            this.init()
        };
        YNote.Common.extend(YNote.Clipper, {
            CLASS_INIT: 0,
            CLIPPING: 1,
            CLIPPED: 2,
            UPLOADING_FILE: 3,
            UPLOADED_FILE: 4,
            UPLOADING_INFO: 5,
            UPLOADING_INFO: 6,
            START_LOGIN: 7,
            DONE: 8,
            ERROR_CLIP: 10001,
            ERROR_UPLOAD_FILE: 10002,
            ERROR_UPLOAD_INFO: 10003,
            ERROR_UPLOAD_LOGIN: 10004,
            ERROR_NO_BODY: 10005,
            CEIL_OF_REQUEST: {
                COUNT: 10
            }
        });
        YNote.Common.extend(YNote.Clipper.prototype, {
            close: function () {
                this.wrapper.style.display = "none";
                this.deleteFrame();
                this.state = YNote.Clipper.DONE
            },
            clipContent: function () {
                this.state = YNote.Clipper.CLIPPING;
                var starttime = (new Date).getTime();
                this.loadingView.style.display = "block";
                try {
                    var doc = YWebClipperConfiguration.doc.container;
                    if (this.hasSelection()) {
                        YNote.Common.log("has selection");
                        YWebClipperConfiguration.doc.contentType = "3";
                        this.range = this.selector.getSelectionRange();
                        this.content = this.getSelectedContent();
                        this.state = YNote.Clipper.CLIPPED;
                        return this.content
                    } else if (doc.body) {
                        YNote.Common.log("no selection!");
                        this.content = this.getNodeText(doc.body);
                        this.state = YNote.Clipper.CLIPPED;
                        return this.content
                    } else {
                        YNote.Common.log("No Body!");
                        document.getElementById("_YNoteLoaddingTips").innerHTML = "抱歉，由于页面设置，无法获取所选内容";
                        this.state = YNote.Clipper.ERROR_NO_BODY;
                        YNote.Common.serverlog(2);
                        return ""
                    }
                    this.state = YNote.Clipper.CLIPPED;
                    var endtime = (new Date).getTime();
                    YNote.Common.log("Got Content, time: " + (endtime - starttime))
                } catch (e) {
                    try {
                        document.getElementById("_YNoteLoaddingTips").innerHTML = "抱歉，由于页面设置，整页抓取失败，请选择部分内容后重试";
                        YNote.Common.serverlog(3)
                    } catch (e2) {
                        YNote.Common.serverlog(4);
                        alert("抱歉，由于页面设置，页面抓取失败!")
                    }
                }
            },
            hasSelection: function () {
                this.getSelection();
                if (typeof this.selection != "undefined" && this.selection != null && (typeof this.selection.getRangeAt == "function" || typeof this.selection.createRange == "object" || typeof this.selection.createRange == "function")) {
                    if (typeof this.selection.rangeCount != "undefined" && this.selection.rangeCount < 1) {
                        return false
                    } else if (typeof this.selection.createRange == "function" || typeof this.selection.createRange == "object") {
                        try {
                            if (this.selection.type.toLowerCase() != "text" || this.selection.createRange().htmlText == "") {
                                return false
                            }
                        } catch (e) {
                            return false
                        }
                    } else if (typeof this.selection.getRangeAt == "function") {
                        try {
                            var range = this.selection.getRangeAt(0);
                            if (range.startContainer == range.endContainer && range.startOffset == range.endOffset) {
                                return false
                            }
                        } catch (e) {
                            return true
                        }
                    }
                    return true
                }
                return false
            },
            getSelection: function () {
                this.selection = this.selector.getSelection()
            },
            submit: function () {
                this.state = YNote.Clipper.UPLOADING_FILE;
                this.loadingView.style.display = "block";
                this.fillForm();
                this.form.submit()
            },
            getClipID: function () {
                return "/wcp" + (new Date).getTime() + Math.floor(Math.random() * 1e3)
            },
            getHiddenForm: function () {
                var o = YNote.Common.mkel("form");
                o.innerHTML = "";
                return o
            },
            rangeIntersectsNode: function (node) {
                if (!YNote.Common.browser.isIE) {
                    if (this.range) {
                        var nodeRange = node.ownerDocument.createRange();
                        try {
                            nodeRange.selectNode(node)
                        } catch (e) {
                            nodeRange.selectNodeContents(node)
                        }
                        return this.range.compareBoundaryPoints(Range.START_TO_END, nodeRange) == 1 && this.range.compareBoundaryPoints(Range.END_TO_START, nodeRange) == -1
                    }
                    return false
                } else {
                    if (this.range) {
                        if (node.nodeType == 1) {
                            var oRange = node.ownerDocument.body.createTextRange();
                            oRange.moveToElementText(node);
                            return oRange.compareEndPoints("StartToEnd", this.range) == -1 && oRange.compareEndPoints("EndToStart", this.range) == 1
                        } else {
                            return true
                        }
                    }
                    return false
                }
            },
            changeNodeName: function (node) {
                var trans = YWebClipperConfiguration.translateTagName;
                if (typeof trans[node.tagName.toLowerCase()] != "undefined") {
                    return trans[node.tagName.toLowerCase()]
                }
                return node.tagName.toLowerCase()
            },
            isListNode: function (node) {
                var listnodes = YWebClipperConfiguration.listNodes;
                return node && node.nodeType == 1 && typeof listnodes[node.nodeName.toLowerCase()] != "undefined"
            },
            withAttribute: function (attr) {
                var removeAttributes = YWebClipperConfiguration.clipperFilterAttributes.remove;
                return typeof attr == "string" && typeof removeAttributes[attr.toLowerCase()] == "undefined"
            },
            getNodeAttributesString: function (node) {
                var str = "";
                var attrs = node.attributes;
                if (attrs != null) {
                    for (var i = 0; i < attrs.length; i++) {
                        var a = attrs[i].nodeName.toLowerCase();
                        var v = attrs[i].nodeValue;
                        if (a == "href" || a == "src") {
                            if (v.toLowerCase().indexOf("javascript:") == 0 || v.indexOf("#") == 0) {
                                v = ""
                            } else {
                                v = this.replaceURL(v)
                            }
                        } else if (a == "target" && v == "_blank") {
                            continue
                        }
                        if (this.withAttribute(a) && typeof v == "string" && v.length > 0) {
                            str += attrs[i].nodeName + "=" + '"' + v.toString() + '" '
                        }
                    }
                }
                return str.replace(/\s+$/, "")
            },
            isCloseTag: function (node) {
                return node && typeof YWebClipperConfiguration.selfCloseTag[node.nodeName.toLowerCase()] != "undefined"
            },
            isNodeVisible: function (node) {
                if (node.nodeType) {
                    var display = "";
                    if (YNote.Common.browser.isIE) {
                        if (node.currentStyle != null && node.currentStyle["display"] == "none") {
                            return false
                        }
                    } else {
                        try {
                            if (window.getComputedStyle(node, null).getPropertyCSSValue("display").cssText == "none") {
                                return false
                            }
                        } catch (e) {
                            return false
                        }
                    }
                    var config = YWebClipperConfiguration;
                    if (node.nodeType == 3) {
                        if (node.nodeValue || node.nodeValue.length == 0) {
                            return false
                        }
                    }
                    if (node.nodeType == 1 && typeof config.formatTag[node.tagName.toLowerCase()] == "undefined") {
                        if (YNote.Common.trim(node.innerHTML).length == 0) {
                            return false
                        }
                    }
                    return true
                } else {
                    return false
                }
            },
            keepNode: function (node) {
                if (node) {
                    if (node.nodeType == 3) {
                        return true
                    } else if (node.nodeType == 1) {
                        if (node.nodeName.indexOf("#") == 0 || !this.isNodeVisible(node)) {
                            return false
                        }
                        var removeElements = YWebClipperConfiguration.filterElements.remove;
                        return typeof removeElements[node.nodeName.toLowerCase()] == "undefined"
                    }
                }
                return false
            },
            replaceURL: function (url) {
                if (!window.location) {
                    return url
                }
                var match = null;
                url = YNote.Common.trim(url);
                var host = window.location.host;
                var proto = window.location.protocol;
                var base = window.location.href.split("?")[0].split("#")[0];
                base = base.substr(0, base.lastIndexOf("/")) + "/";
                rbase = proto + "//" + host;
                if ((match = url.match(/^(https?):/i)) != null) {
                    return url
                } else {
                    if (url.indexOf("/") == 0) {
                        return rbase + url
                    } else {
                        return base + url
                    }
                }
            },
            getNodeText: function (node, parentNode) {
                var str = "";
                var s = node;
                var config = YWebClipperConfiguration;
                while (s != document.body) {
                    if (s == this.wrapper) {
                        return str
                    }
                    if (s == null) return str;
                    s = s.parentNode
                }
                if (this.range && !this.rangeIntersectsNode(node)) {
                    return str
                }
                if (!this.keepNode(node)) {
                    return str
                }
                if (node.nodeType == 3) {
                    if (this.range) {
                        if (this.range.startContainer == node && this.range.startContainer == this.range.endContainer) {
                            str += node.nodeValue.substring(this.range.startOffset, this.range.endOffset)
                        } else if (this.range.startContainer == node) {
                            str += node.nodeValue.substring(this.range.startOffset)
                        } else if (this.range.endContainer == node) {
                            str += node.nodeValue.substring(0, this.range.endOffset)
                        } else if (this.range.commonAncestorContainer != node) {
                            str += node.nodeValue
                        }
                    } else {
                        str += node.nodeValue
                    }
                } else if (node.nodeType == 1) {
                    if (node === config.doc.mainContent && config.doc.contentType !== "3") {
                        var temp = (new Date).getTime() / 1e5 + "";
                        str += temp;
                        config.doc.mainContentTag = temp
                    }
                    if (this.range && this.range.commonAncestorContainer == node && this.range.startContainer != this.range.commonAncestorContainer && !this.isListNode(node)) {
                    } else {
                        var changedNodeName = this.changeNodeName(node);
                        str += "<" + changedNodeName;
                        var attrStr = this.getNodeAttributesString(node);
                        if (attrStr.length > 0) str += " " + attrStr;
                        if (this.styleUtil) {
                            var nodeStyleString = this.styleUtil.styleForNode(node, parentNode);
                            if (nodeStyleString != null && nodeStyleString.length != 0) {
                                str += " style='" + nodeStyleString + "'"
                            }
                        }
                        if (!node.hasChildNodes() && this.isCloseTag(node)) {
                            str += "/>"
                        } else {
                            str += ">"
                        }
                    }
                    if (node.tagName.toLowerCase() != "iframe" && node.hasChildNodes()) {
                        var children = node.childNodes;
                        for (var j = 0, count = children.length; j < count; j++) {
                            var child = children[j];
                            if (child != null && YNote.Common.trim(child.nodeValue) != "" && child.nodeType > 0 && child.nodeName && child.nodeName.toLowerCase() != "script" && child.nodeName.toLowerCase() != "iframe") {
                                var childStr = "";
                                if (child.nodeName.toLowerCase() == "font") {
                                    var childStr = child.outerHTML
                                } else {
                                    childStr = this.getNodeText(child, node)
                                }
                                if (childStr && childStr.length > 0) str += childStr
                            }
                        }
                    }
                    if (this.range && this.range.commonAncestorContainer == node && !this.isListNode(node)) {
                    } else if (node.hasChildNodes() || !this.isCloseTag(node)) {
                        str += "</" + changedNodeName + ">";
                        if (node === config.doc.mainContent && config.doc.contentType !== "3") {
                            str += config.doc.mainContentTag
                        }
                    }
                }
                return str
            },
            getSelectedContent: function () {
                if (this.hasSelection()) {
                    if (YNote.Common.browser.isIE) {
                        YNote.Common.log(this.selection.htmlText);
                        if (this.selection.htmlText) {
                            this.content = this.selection.htmlText;
                            return this.selection.htmlText
                        } else {
                            this.content = this.getNodeText(this.getRangeContainer(this.range));
                            return this.content
                        }
                    } else {
                        var range = this.selector.getSelectionRange();
                        var content = "";
                        content = this.getNodeText(range.commonAncestorContainer);
                        if (content == "") {
                            YNote.Common.log("Get Selected ERROR!")
                        }
                        return content
                    }
                }
            },
            getRangeContainer: function (textRange) {
                if (!textRange) {
                    return document.body
                }
                var node = textRange.parentElement();
                var nodeRect = node.getBoundingClientRect();
                var rangeRect = textRange.getBoundingClientRect();
                while (nodeRect.top > rangeRect.top || nodeRect.bottom < rangeRect.bottom) {
                    node = node.parentNode;
                    nodeRect = node.getBoundingClientRect()
                }
                return node
            },
            initFrame: function () {
                var config = YWebClipperConfiguration;
                this.view.innerHTML = '<iframe width="100%" height="100%" border="0" frameborder="0" src="javascript:document.write(\'\');" style="width:100%;height:100%;border:0px"  id="' + config.clipperDomPrefix + "ContentFrame" + '" name="' + config.doc.contentType + "ContentFrame" + '" onload="yApp.frameHandler(event);" style="border:0px" scrolling ="no"></iframe>'
            },
            deleteFrame: function () {
                this.view.innerHTML = ""
            },
            filterResults: function (n_win, n_docel, n_body) {
                var n_result = n_win ? n_win : 0;
                if (n_docel && (!n_result || n_result > n_docel)) n_result = n_docel;
                return n_body && (!n_result || n_result > n_body) ? n_body : n_result
            },
            init: function () {
                YNote.Common.log("Init Clipper Class");
                this.styleUtil = new YNote.StyleUtil;
                this.path = this.getClipID();
                this.requestCount = 0;
                this.state = YNote.Clipper.CLASS_INIT;
                var config = YWebClipperConfiguration;
                var divname = "ydNoteWebClipper";
                var c = doc.getElementById(divname);
                if (c != null && c.parentNode != null) {
                    c.parentNode.removeChild(c)
                }
                var wrapper = YNote.Common.mkel("div");
                wrapper.id = divname;
                wrapper.name = divname;
                if (YNote.Common.browser.isIE) {
                    document.getElementsByTagName("html")[0].cssText = "background-image:url(about:blank);background-attachment:fixed";
                    document.getElementsByTagName("body")[0].cssText = "background-image:url(about:blank);background-attachment:fixed"
                }
                wrapper.style.cssText = config.clipperStyle;
                wrapper.style.zIndex = 999999;
                this.wrapper = wrapper;
                var dialogDiv = YNote.Common.mkel("div", wrapper);
                dialogDiv.style.cssText = "width:400px;padding:5px;background-color:rgba(92,184,229,.5)!important;background:#5cb8e5;border-radius:5px;box-shadow:0 0 2px #5cb8e5;    -khtml-border-radius:5px;-webkit-border-radius:5px;-webkit-box-shadow:0 0 2px #5cb8e5;-moz-border-radius:5px;-moz-box-shadow:0 0 2px #5cb8e5;";
                dialogDiv.id = "ydNoteWebClipper-New";
                dialogDiv.className = "ydnwc-dialog";
                var viewDiv = YNote.Common.mkel("div", dialogDiv);
                viewDiv.id = "ydNoteWebClipper_view";
                viewDiv.name = "ydNoteWebClipper_view";
                if (YNote.Common.browser.isIE) {
                    viewDiv.style.cssText = "height:278px;width:398px;border:1px solid #5cb8e5;background:#fff;"
                } else {
                    viewDiv.style.cssText = "height:264px;width:398px;border:1px solid #5cb8e5;background:#fff;"
                }
                this.view = viewDiv;
                this.initFrame();
                var formContainer = YNote.Common.mkel("div", wrapper);
                var form = YNote.Common.mkel("form", formContainer);
                YNote.Common.extend(form, {
                    id: config.clipperDomPrefix + "ContentForm",
                    name: config.clipperDomPrefix + "ContentForm",
                    action: config.clipperBaseURL + config.clipperUploadApp,
                    target: config.doc.contentType + "ContentFrame",
                    enctype: "multipart/form-data",
                    encoding: "multipart/form-data",
                    method: "POST"
                });
                YNote.Common.extend(formContainer.style, {
                    display: "none"
                });
                var formInnerHTML = "";
                var fields = config.clipperFormFields;
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i][1] == "text") {
                        formInnerHTML += '<input type="text" name="' + fields[i][2] + '" id="' + config.clipperDomPrefix + "ContentForm" + fields[i][0] + '" value=""/>'
                    }
                    if (fields[i][1] == "area") {
                        formInnerHTML += '<textarea name="' + fields[i][2] + '" id="' + config.clipperDomPrefix + "ContentForm" + fields[i][0] + '"></textarea>'
                    }
                }
                form.innerHTML = formInnerHTML;
                this.form = form;
                div = YNote.Common.mkel("div", dialogDiv);
                if (YNote.Common.browser.isIE) {
                    div.style.cssText = "position:absolute;height:270px;398px;background:#fff;top:0;left:200px;"
                } else {
                    div.style.cssText = "position:absolute;height:258px;398px;background:#fff;top:0;left:200px;"
                }
                div.innerHTML = config.loadingHTML;
                div.style.display = "none";
                div.name = "ydNoteWebClipper_loadview";
                div.id = "ydNoteWebClipper_loadview";
                this.loadingView = div;
                window.document.body.appendChild(wrapper)
            },
            clearFlash: function () {
                var isIE = YNote.Common.browser.isIE;
                var flashs = [];
                if (isIE) {
                    var flashs1 = document.getElementsByTagName("object");
                    var flashs2 = document.getElementsByTagName("embed");
                    flashs = flashs1.length && flashs1 || flashs2
                } else {
                    flashs = document.getElementsByTagName("embed")
                }
                for (var i = 0, count = flashs.length; i < count; i++) {
                    if (isIE && flashs[i] && flashs[i]["classid"] == "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" || flashs[i] && flashs[i]["type"] == "application/x-shockwave-flash" || flashs[i] && flashs[i].parentNode.innerHTML.indexOf("application/x-shockwave-flash") > 0) {
                        if (flashs[i].parentNode) {
                            flashs[i].parentNode.removeChild(flashs[i])
                        }
                    }
                }
            },
            reset: function () {
                YNote.Common.log("Call Reset!");
                this.selection = null;
                this.range = null;
                this.title = null;
                this.content = null;
                this.state = 0;
                this.requestCount = 0;
                this.path = this.getClipID();
                this.wrapper.style.display = "";
                if (this.view.innerHTML.length > 10) {
                    this.deleteFrame()
                }
                this.initFrame()
            },
            getNavigatorSign: function () {
                var ua = navigator.userAgent.toLowerCase();
                var IEVer = /msie/.test(ua) ? parseFloat(ua.match(/msie ([\d.]+)/)[1]) : false;
                if (parseInt(IEVer) >= 7) {
                    return "true"
                } else {
                    return "false"
                }
            },
            fillForm: function () {
                YNote.Common.log("Enter fillForm");
                var isIE8 = this.getNavigatorSign();
                var doc = document;
                var config = YWebClipperConfiguration;
                var docType = "FullPage MainBody Selected";
                this.title = doc.title;
                this.content = this.content.replace(/[\r\n]/g, "");
                if (config.doc.mainContentTag) {
                    this.content += "$" + config.doc.mainContentTag
                }
                this.content = isIE8 == "true" ? YNote.Common.HTMLEncode(this.content) : YNote.Common.unicodeEncode(this.content);
                doc.getElementById(config.clipperDomPrefix + "ContentForm" + "path").value = this.path;
                doc.getElementById(config.clipperDomPrefix + "ContentForm" + "content").value = this.content;
                doc.getElementById(config.clipperDomPrefix + "ContentForm" + "source").value = YNote.Common.HTMLEncode(this.source);
                doc.getElementById(config.clipperDomPrefix + "ContentForm" + "title").value = YNote.Common.HTMLEncode(this.title);
                doc.getElementById(config.clipperDomPrefix + "ContentForm" + "len").value = this.content.length;
                doc.getElementById(config.clipperDomPrefix + "ContentForm" + "type").value = docType.split(" ")[config.doc.contentType - 1];
                doc.getElementById(config.clipperDomPrefix + "ContentForm" + "sign").value = this.getNavigatorSign()
            }
        });
        YNote.Selection = function () {
        };
        YNote.Common.extend(YNote.Selection.prototype, {
            getSelection: function () {
                var win = window;
                var doc = win.document;
                if (YNote.Common.browser.isIE) {
                    this.selection = document.selection
                } else {
                    this.selection = win.getSelection()
                }
                if (!this.hasSelection()) {
                    this.getNestedRange(win)
                } else {
                    this.selectionParentWindow = win
                }
                return this.selection
            },
            hasSelection: function () {
                YNote.Common.log("Enter hasSelection");
                if (typeof this.selection.createRange == "function") {
                    if (this.selection.createRange().htmlText == "") {
                        return false
                    } else {
                        return true
                    }
                } else {
                    if (this.selection.rangeCount == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            },
            getNestedRange: function (win) {
                YNote.Common.log("Enter getNestedRange");
                var doc = win.document;
                var frames = null;
                frames = doc.getElementsByTagName("iframe");
                if (!frames || frames.length == 0) {
                    return false
                }
                for (var i = 0, count = frames.length; i < count; i++) {
                    var w = frames[i].contentWindow;
                    try {
                        w.document;
                        if (frames[i].clientWidth <= 10 || frames[i].clientHeight <= 10) {
                            continue
                        }
                    } catch (e) {
                        continue
                    }
                    try {
                        var sel = typeof w.getSelection == "function" ? w.getSelection() : w.document.selection;
                        if (typeof sel.createRange == "function" || typeof sel.getRangeAt == "function") {
                            var temp = this.selection;
                            this.selection = sel;
                            this.selectionparentWindow = w;
                            if (!this.hasSelection()) {
                                var layer = 0;
                                var win = w;
                                while (win !== window) {
                                    layer++;
                                    if (layer > 3) {
                                        break
                                    }
                                    win = win.parent
                                }
                                if (win === window) {
                                    this.getNestedRange(w)
                                }
                            } else {
                                this.selection = temp;
                                return false
                            }
                        }
                    } catch (e) {
                        continue
                    }
                }
                YNote.Common.log("getNestedRange over")
            },
            getSelectionRange: function () {
                YNote.Common.log("Enter get getSelectionRange");
                this.getSelection();
                if (!this.selection) {
                    return false
                }
                if (YNote.Common.browser.isIE) {
                    this.range = this.selection.createRange()
                } else {
                    this.range = this.selection.getRangeAt(0)
                }
                if (YNote.Common.browser.isIE) {
                    if (this.range) {
                        this.range.commonAncestorContainer = this.range.parentElement();
                        YNote.Common.log("Enter get range block");
                        var _range = this.range.duplicate();
                        _range.collapse(true);
                        var rangeInfo = this.getContainerForIE(_range);
                        this.range.startContainer = rangeInfo["el"];
                        this.range.startOffset = rangeInfo["offset"];
                        var _range2 = this.range.duplicate();
                        _range2.collapse(false);
                        rangeInfo = this.getContainerForIE(_range2);
                        this.range.endContainer = rangeInfo["el"];
                        this.range.endOffset = rangeInfo["offset"]
                    }
                }
                return this.range
            },
            getAncestor: function (nodeA, nodeB) {
            },
            getContainerForIE: function (textRange) {
                var element = textRange.parentElement();
                var range = element.ownerDocument.body.createTextRange();
                range.moveToElementText(element);
                range.setEndPoint("EndToStart", textRange);
                var rangeLength = range.text.length;
                if (rangeLength < element.innerText.length / 2) {
                    var direction = 1;
                    var node = element.firstChild
                } else {
                    direction = -1;
                    node = element.lastChild;
                    range.moveToElementText(element);
                    range.setEndPoint("StartToStart", textRange);
                    rangeLength = range.text.length
                }
                while (node) {
                    switch (node.nodeType) {
                        case 3:
                            nodeLength = node.data.length;
                            if (nodeLength < rangeLength) {
                                var difference = rangeLength - nodeLength;
                                if (direction == 1) range.moveStart("character", difference);
                                else range.moveEnd("character", -difference);
                                rangeLength = difference
                            } else {
                                if (direction == 1) return {
                                    node: node,
                                    offset: rangeLength
                                };
                                else return {
                                    el: node,
                                    offset: nodeLength - rangeLength
                                }
                            }
                            break;
                        case 1:
                            nodeLength = node.innerText.length;
                            if (direction == 1) range.moveStart("character", nodeLength);
                            else range.moveEnd("character", -nodeLength);
                            rangeLength = rangeLength - nodeLength;
                            break
                    }
                    if (direction == 1) node = node.nextSibling;
                    else node = node.previousSibling
                }
                return {
                    el: element,
                    offset: 0
                }
            },
            getSelectionHTMLText: function () {
                this.getSelectionRange();
                if (!this.range) {
                    return false
                } else {
                    if (YNote.Common.browser.isIE) {
                        return this.range.htmlText
                    } else {
                        return ""
                    }
                }
            }
        });
        YNote.ClipperManager = function () {
            this.init()
        };
        YNote.Common.extend(YNote.ClipperManager.prototype, {
            run: function () {
                YNote.Common.log("start run..");
                YNote.Common.serverlog(0);
                if (!this.checkEnv()) {
                    YNote.Common.log("check Env false");
                    YNote.Common.serverlog(1);
                    return false
                }
                YNote.Common.log("manager run");
                this.clipper.reset();
                this.clipper.wrapper.display = "";
                this.clipper.clearFlash();
                this.clipper.clipContent();
                if (this.clipper.state != YNote.Clipper.CLIPPED) {
                    return
                }
                YNote.Common.log("manager clip end");
                this.clipper.submit()
            },
            submit: function () {
                if (this.clipper.state == YNote.Clipper.CLIPPED) {
                    YNote.Common.log("Do clipper.submit");
                    this.clipper.submit()
                } else {
                    YNote.Common.log("ERROR! clipper state error")
                }
            },
            init: function () {
                this.clipper = new YNote.Clipper
            },
            checkEnv: function () {
                var doc = window.document;
                if (!doc) {
                    return false
                }
                if (!doc.body) {
                    return false
                }
                YNote.Common.log(this.clipper.state);
                if (this.clipper.state > 0 && this.clipper.state < 100) {
                    if (this.clipper.state != YNote.Clipper.DONE) {
                        return false
                    }
                }
                return true
            }
        });
        YNote.App = function () {
        };
        YNote.App.prototype = {
            crossDomain: function () {
                var croDomain = {};
                var interval_id, last_hash, cache_bust = 1,
                    rm_callback, window = this,
                    FALSE = !1,
                    postMessage = "postMessage",
                    addEventListener = "addEventListener",
                    p_receiveMessage, has_postMessage = window[postMessage];
                croDomain.isFunction = function (obj) {
                    return Object.prototype.toString.call(obj) === "[object Function]"
                };
                croDomain.browser = function () {
                    var bro = {};
                    var ua = navigator.userAgent.toLowerCase();
                    var s;
                    (s = ua.match(/msie ([\d.]+)/)) ? bro.msie = s[1] : (s = ua.match(/firefox\/([\d.]+)/)) ? bro.firefox = s[1] : (s = ua.match(/chrome\/([\d.]+)/)) ? bro.chrome = s[1] : (s = ua.match(/opera.([\d.]+)/)) ? bro.opera = s[1] : (s = ua.match(/version\/([\d.]+).*safari/)) ? bro.safari = s[1] : 0;
                    return bro
                }();
                croDomain.each = function (object, callback, context) {
                    if (object === undefined || object === null) {
                        return
                    }
                    if (object.length === undefined || croDomain.isFunction(object)) {
                        for (var name in object) {
                            if (object.hasOwnProperty(name)) {
                                if (callback.call(context || object[name], name, object[name]) === false) {
                                    break
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < object.length; i++) {
                            if (callback.call(context || object, i, object[i]) === false) {
                                break
                            }
                        }
                    }
                    return object
                };
                croDomain.param = function (data) {
                    if (typeof data === "string") {
                        return data
                    }
                    var param = [];
                    croDomain.each(data, function (index, value) {
                        if (value) {
                            value = encodeURIComponent(value);
                            if (croDomain.browser.firefox) {
                                value = encodeURIComponent(unescape(value))
                            }
                            param.push(encodeURIComponent(index) + "=" + value)
                        }
                    });
                    return param.join("&").replace(r20, "+")
                };
                croDomain.postMessage = function (message, target_url, target) {
                    if (!target_url) {
                        return
                    }
                    message = typeof message === "string" ? message : croDomain.param(message);
                    target = target || parent;
                    if (has_postMessage) {
                        target[postMessage](message, target_url.replace(/([^:]+:\/\/[^\/]+).*/, "$1"))
                    } else if (target_url) {
                        target.location = target_url.replace(/#.*$/, "") + "#" + +new Date + cache_bust++ + "&" + message
                    }
                };
                croDomain.receiveMessage = p_receiveMessage = function (callback, source_origin, delay) {
                    if (has_postMessage) {
                        if (callback) {
                            rm_callback && p_receiveMessage();
                            rm_callback = function (e) {
                                if (typeof source_origin === "string" && e.origin !== source_origin || croDomain.isFunction(source_origin) && source_origin(e.origin) === FALSE) {
                                    return FALSE
                                }
                                callback(e)
                            }
                        }
                        if (window[addEventListener]) {
                            window[callback ? addEventListener : "removeEventListener"]("message", rm_callback, FALSE)
                        } else {
                            window[callback ? "attachEvent" : "detachEvent"]("onmessage", rm_callback)
                        }
                    } else {
                        interval_id && clearInterval(interval_id);
                        interval_id = null;
                        if (callback) {
                            delay = typeof source_origin === "number" ? source_origin : typeof delay === "number" ? delay : 100;
                            interval_id = setInterval(function () {
                                var hash = document.location.hash,
                                    re = /^#?\d+&/;
                                if (hash !== last_hash && re.test(hash)) {
                                    last_hash = hash;
                                    callback({
                                        data: hash.replace(re, "")
                                    })
                                }
                            }, delay)
                        }
                    }
                };
                return croDomain
            }(),
            creatDiv: function (id, width, height, left, top, cssText) {
                var div = document.createElement("div");
                div.id = id;
                if (!cssText) {
                    var cssText = "position:absolute;filter:alpha(opacity=80);background-color:#666;opacity:0.8;z-index:9999;"
                }
                cssText += "height:" + height + "px;";
                cssText += "width:" + width + "px;";
                cssText += "left:" + left + "px;";
                cssText += "top:" + top + "px;";
                div.style.cssText = cssText;
                return div
            },
            removeDiv: function (id) {
                var div = document.getElementById(id);
                if (div) {
                    document.body.removeChild(div)
                }
            },
            removeClipDiv: function () {
                for (var i = 0; i < 5; i++) {
                    this.removeDiv("yShade" + i)
                }
                this.shadeStatu = false
            },
            createClipDiv: function () {
                if (this.mainElem) {
                    var main = this.mainElem;
                    var y = Math.abs(main.common.findPos(main.elem).y);
                    var x = Math.abs(main.common.findPos(main.elem).x);
                    var mwidth = main.elem.scrollWidth;
                    var mheight = main.elem.scrollHeight;
                    var dwidth = document.documentElement.scrollWidth;
                    var dheight = document.documentElement.scrollHeight;
                    this.removeClipDiv();
                    var shadeArr = [];
                    var isFullWidth = document.body.scrollWidth == document.body.offsetWidth;
                    var cssText = "position:absolute;border:5px solid rgb(0, 154, 226);border:5px solid rgba(0, 154, 226,0.6);-webkit-border-radius:5px;-moz-border-radius:5px;-khtml-border-radius:5px;z-index:9999;";
                    var _leftTemp = (document.body.offsetWidth - document.documentElement.scrollWidth) / 2;
                    shadeArr[0] = this.creatDiv("yShade0", dwidth, y, _leftTemp, 0);
                    shadeArr[1] = this.creatDiv("yShade1", dwidth, dheight - y - mheight, _leftTemp, y + mheight);
                    shadeArr[2] = this.creatDiv("yShade2", x, mheight, _leftTemp, y);
                    shadeArr[3] = this.creatDiv("yShade3", dwidth - mwidth - x, mheight, mwidth + x + _leftTemp, y);
                    shadeArr[4] = this.creatDiv("yShade4", mwidth, mheight, x - 5 + _leftTemp, y - 5, cssText);
                    for (var i = 0, count = shadeArr.length; i < count; i++) {
                        document.body.appendChild(shadeArr[i])
                    }
                }
                this.shadeStatu = true
            },
            mainElem: function () {
                var page = new Page(window.document);
                var temp = page.getMainArticle();
                if (temp) {
                    YWebClipperConfiguration.doc.mainContent = temp.elem;
                    YWebClipperConfiguration.doc.contentType = "2"
                }
                return temp
            }(),
            run: function () {
                YNote.Common.log("YNote Run...");
                if (typeof this.clipperManager == "undefined") {
                    try {
                        this.clipperManager = new YNote.ClipperManager
                    } catch (e) {
                        YNote.Common.log("Exception:" + e)
                    }
                }
                this.clipperManager.run()
            },
            frameHandler: function (event) {
                YNote.Common.log("Enter framehandler ");
                var ev = YNote.Common.wrapperEvent(event);
                if (!this.clipperManager || typeof this.clipperManager == "undefined") {
                    return
                }
                var clipper = this.clipperManager.clipper;
                var frame = ev.target;
                var config = YWebClipperConfiguration;
                YNote.Common.log("CALL FRAMEHANDLER :The State is " + clipper.state);
                switch (this.clipperManager.clipper.state) {
                    case YNote.Clipper.UPLOADING_FILE:
                        clipper.loadingView.style.display = "none";
                        clipper.state = YNote.Clipper.DONE;
                        break
                }
            }
        };
        if (true) {
            YNote.Common.log("------------------");
            var hLoop = null;
            var timer = null;
            var resize = null;
            var loopFunc = function () {
                YNote.Common.log("enter loopFunc:");
                if ((document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") && document.body) {
                    window._ynote_app_load = true;
                    window.yApp = new YNote.App;
                    //yApp.run();
                    if (YWebClipperConfiguration.doc.contentType === "2") {
                        yApp.createClipDiv()
                    }
                    yApp.crossDomain.receiveMessage(function (e) {
                        if (e.data === "close") {
                            yApp.clipperManager.clipper.close();
                            yApp.removeClipDiv();
                            if (!window["postMessage"]) {
                                window.location = yApp.clipperManager.clipper.source
                            }
                        } else if (e.data === "success") {
                            yApp.clipperManager.clipper.close();
                            var tempDiv = document.createElement("div");
                            tempDiv.style.cssText = "position:fixed;_position:absolute;right:20px; top:20px;padding:10px;color:#d98736;border:1px solid #ffebb4;background:#fffff6;border-radius:5px;z-index:999999;";
                            tempDiv.innerHTML = "保存成功";
                            document.body.appendChild(tempDiv);
                            setTimeout(function () {
                                document.body.removeChild(tempDiv);
                                if (!window["postMessage"]) {
                                    window.location = yApp.clipperManager.clipper.source
                                }
                            }, 3e3)
                        } else if (e.data === "resize_fullpage" || e.data === "resize_login" || e.data === "openid") {
                            var height = 248,
                                width = 530;
                            if (e.data === "openid") {
                                height = 248;
                                width = 400
                            } else if (e.data === "resize_fullpage") {
                                height = 285;
                                width = 400
                            }
                            document.getElementById("ydNoteWebClipper_view").style.height = height + "px";
                            if (YNote.Common.browser.isIE) {
                                document.getElementById("ydNoteWebClipper_view").style.height = height + 10 + "px";
                                document.getElementById("_YNoteContentFrame").style.height = height + 10 + "px"
                            }
                            document.getElementById("ydNoteWebClipper_view").style.width = width + "px";
                            document.getElementById("ydNoteWebClipper-New").style.width = width + 2 + "px";
                            document.getElementById("ydNoteWebClipper").style.width = width + 10 + "px"
                        } else if (e.data === "remove") {
                            yApp.removeClipDiv()
                        } else if (e.data === "creat") {
                            yApp.createClipDiv()
                        }
                    }, "http://note.youdao.com");
                    if (window.addEventListener) {
                        window.addEventListener("resize", resize)
                    } else {
                        window.attachEvent("onresize", resize)
                    }
                    resize = function () {
                    };
                    clearTimeout(hLoop)
                } else {
                    hLoop = setTimeout(loopFunc, 300)
                }
            };
            hLoop = setTimeout(loopFunc, 300);
            resize = function () {
                if (!!window.yApp) {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null
                    }
                    timer = setTimeout(function () {
                        if (yApp.shadeStatu) {
                            yApp.createClipDiv()
                        }
                    }, 200)
                }
            }
        }
    })();