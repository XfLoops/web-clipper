function BeginToClippe() {
/*
 * @todo change the method of geting selection content
 * @todo fixed the bug when no body exists
 */
/*--default configration start {{*/
var YWebClipperConfiguration = {
    logEnabled: true,
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
    clipperStyle: "visibility:hidden; position:fixed;right:10px;top:10px;padding-bottom:10px;font:12px/100% arial,sans-serif;color:#333; width: 420px;_right:expression(eval(document.documentElement.scrollLeft));_top:expression(eval(document.documentElement.scrollTop+10));_position:absolute;",
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
        "font-family": !0
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
(function() {
	//console.log("mark 0.FUNC1")
    var e = function(e) {   	    
    //console.log("mark 1.e");
    	//console.log("e="+ e);//[object HTMLDocument]
        this.contentDocument = e
        //console.log('this.contentDocument='+this.contentDocument);//[object HTMLDocument]
    };

    
    e.common = {
        trim: function(e) {
        	//console.log("mark 2.trim");
        	
            return e.replace(/^\s*/, "").replace(/\s*$/, "")
        },        
        isFunction: function(e) {
        	//console.log("mark 3.isFunction");
        	
            return Object.prototype.toString.call(e) === "[object Function]"
        },
        findPos: function(e) {
        	//console.log("mark 4.findPos");
        	
            var t = {
                x: 0,
                y: 0
            };
            if (!document.documentElement.getBoundingClientRect())
                while (e) t.x += e.offsetLeft, t.y += e.offsetTop, e = e.offsetParent;
            else t.x = e.getBoundingClientRect().left + this.scroll().left, t.y = e.getBoundingClientRect().top + this.scroll().top;
            //console.log("t.x="+t.x+",t.y="+t.y);
            return t
        },
        indexOf: function(t, n) {
        	//console.log("mark 5.indexOf");
        	
            if (t.indexOf) return t.indexOf(n);
            var r = -1;
            return this.each(t, function(e) {
                if (this[e] === n) return r = e, !1
            }), r
        },
        each: function(e, t, n) {
        	//console.log("mark 6.each");
        	
            if (e === undefined || e === null) return;
            if (e.length === undefined || this.isFunction(e)) {
                for (var r in e)
                    if (e.hasOwnProperty(r) && t.call(n || e[r], r, e[r]) === !1) break
            } else
                for (var i = 0; i < e.length; i++)
                    if (t.call(n || e, i, e[i]) === !1) break; return e
        },
        css: function() {
        	//console.log("mark 7.css");
        	
            var e = function(e, t) {
                var n = "";
                t == "float" && (document.defaultView ? t = "float" : t = "styleFloat");
                if (e.style[t]) n = e.style[t];
                else if (e.currentStyle) n = e.currentStyle[t];
                else if (document.defaultView && document.defaultView.getComputedStyle) {
                    t = t.replace(/([A-Z])/g, "-$1").toLowerCase();
                    var r = document.defaultView.getComputedStyle(e, "");
                    n = r && r.getPropertyValue(t)
                } else n = null;
                (n == "auto" || n.indexOf("%") !== -1) && ("width" === t.toLowerCase() || "height" === t.toLowerCase()) && e.style.display != "none" && n.indexOf("%") !== -1 && (n = e["offset" + t.charAt(0).toUpperCase() + t.substring(1).toLowerCase()] + "px");
                if (t == "opacity") try {
                    n = e.filters["DXImageTransform.Microsoft.Alpha"].opacity, n /= 100
                } catch (i) {
                    try {
                        n = e.filters("alpha").opacity
                    } catch (s) {}
                }
                return n
            };
            return function(t, n) {
                if (typeof n == "string") return e(t, n);
                this.each(n, function(e, n) {
                    t.style[e] = n
                })
            }
        }(),
        scroll: function() {
        	//console.log("mark 8.scroll");
        	
            return {
                left: document.documentElement.scrollLeft + document.body.scrollLeft,
                top: document.documentElement.scrollTop + document.body.scrollTop
            }
        }
    }, e.prototype = {
        IGNORE_TAGS: ["HTML", "HEAD", "META", "TITLE", "SCRIPT", "STYLE", "LINK", "IMG", "FORM", "INPUT", "BODY", "BUTTON", "TEXTAREA", "SELECT", "OPTION", "LABEL", "IFRAME", "UL", "OL", "LI", "DD", "DL", "DT", "A", "OBJECT", "PARAM", "EMBED", "NOSCRIPT", "EM", "B", "STRONG", "I", "INS", "BR", "HR", "PRE", "H1", "H2", "H3", "H4", "H5", "CITE"],
        getMainArticle: function() {
        	//console.log("mark 9.getMainArticle");
        	
            var e = null,
                t = "";
            !location || (t = location.hostname);
            if (/\b(google|facebook|twitter)\b/i.test(t)) return null;
            var n = this._getAllArticle();
            if (!n || !n.length) return null;
            n.sort(function(e, t) {
                return t.weight - e.weight
            });
            var r = null;
            for (var i = 0; i < 2; i++) {
                e = n[0], n.splice(0, 1), e && e.weight < 500 && (e = null);
                if (e) break
            }
            return e ? e : null
        },
        _sort: function(e) {
        	//console.log("mark 10._sort");
        	
            for (var t = 0, n = null, r = 0; r < e.length; r++) {
                var i = e[r],
                    s = i.weight;
                s >= t && (t = s, n = i)
            }
            return n
        },
        _getAllArticle: function() {
        	//console.log("mark 11._getAllArticle");
        	
            var e = this.contentDocument.getElementsByTagName("*"),
                n = [];
            for (var r = 0, i = e.length; r < i; r++) {
                var s = e[r];
                this._checkTagName(s) && this._checkSize(s) && this._checkVisibility(s) && (n[n.length] = new t(s))
            }
            return n
        },
        _checkTagName: function(t) {
        	//console.log("mark 12._checkTagName");
        	
            return e.common.indexOf(this.IGNORE_TAGS, t.tagName) == -1
        },
        _checkVisibility: function(t) {
        	//console.log("mark 13._checkVisibility");
        	
            return !(e.common.css(t, "visibility") == "hidden" || e.common.css(t, "display") == "none" || parseInt(e.common.css(t, "height")) <= 0 || parseInt(e.common.css(t, "width")) <= 0)
        },
        _checkSize: function(e) {
        	//console.log("mark 14._checkSize");
        	
            return e.offsetWidth > 300 && e.offsetHeight > 150
        }
    };
    var t = function(t) {
    	//console.log("mark 15.t");
    	
        this.elem = t, this.common = e.common, this.offset = this.common.findPos(t), this._texts = this._getAllTexts(t, 6), this.weight = this.calcWeight()
    };
    t.prototype = {
        IGNORE_TAGS: ["A", "DD", "DT", "OL", "OPTION", "DL", "DD", "SCRIPT", "STYLE", "UL", "LI", "IFRAME"],
        TITLE_TAGS: ["H1", "H2", "H3", "H4", "H5", "H6"],
        MINOR_REGEXP: /comment|combx|disqus|foot|header|menu|rss|shoutbox|sidebar|sponsor/i,
        MAJOR_REGEXP: /article|entry|post|body|column|main|content/i,
        TINY_REGEXP: /comment/i,
        BLANK_REGEXP: /\S/i,
        _getAllTexts: function(t, n) {
        	//console.log("mark 16._getAllTexts");
        	
            var r = [];
            if (n > 0) {
                var i = t.firstChild;
                while (i) {
                    if (i.nodeType == 3 && this._checkLength(i)) {
                        var s = i.parentNode || {},
                            o = s.parentNode || {};
                        !this._checkMinorContent(s) && !this._checkMinorContent(o) && e.common.trim(i.nodeValue) && r.push(i)
                    } else i.nodeType == 1 && this._checkTagName(i) && (r = r.concat(this._getAllTexts(i, n - 1)));
                    i = i.nextSibling
                }
            }
            return r
        },
        calcStructWeight: function() {
        	//console.log("mark 17.calcStructWeight");
        	console.log("StructWeight: " +this.elem.id);
            var t = 0;
            for (var n = 0, r = this._texts.length; n < r; n++) {
                var i = this._texts[n],
                    s = e.common.trim(i.nodeValue).length,
                    o = 1;
                if (s < 20) continue;
                for (var u = i.parentNode; u && u != this.elem; u = u.parentNode) o -= .1;
                t += Math.pow(o * s, 1.25)
            }
            return t
        },
        calcContentWeight: function() {
        	//console.log("mark 18.calcContentWeight");
        	console.log("contentWeight: " +this.elem.id);
            var e = 1;
            for (var t = this.elem; t; t = t.parentNode) t.id && (this.MAJOR_REGEXP.test(t.id) && (e += .4), this.MINOR_REGEXP.test(t.id) && (e -= .8)), t.className && (this.MAJOR_REGEXP.test(t.className) && (e += .4), this.MINOR_REGEXP.test(t.className) && (e -= .8));
            return e
        },
        calcWeight: function() {
        	//console.log("mark 19.calcWeight");
        	var weight = this.calcStructWeight() * this.calcContentWeight();
        	
        	console.log("weight: " +weight);       	
            return weight;
        },
        _checkTagName: function(t) {
        	////console.log("mark 20._checkTagName");
        	
            return e.common.indexOf(this.IGNORE_TAGS, t.tagName) == -1
        },
        _checkTitle: function() {
        	////console.log("mark 21._checkTitle");
        	
            var t = this.elem.getElementsByTagName("*"),
                n = [];
            for (var r = 0; t[r]; r++) e.common.indexOf(this.TITLE_TAGS, t[r].tagName) > -1 && n.push(t[r]);
            if (n.length > 2) {
                var i = this.elem.offsetHeight;
                for (var s = 0, o = e.common.findPos(this.elem), u = i * .05, a = 0; n[a]; a++) {
                    var f = e.common.findPos(n[a]);
                    f.y - o.y > u && f.y + n[a].offsetHeight - (o.y + i) && s++
                }
                if (i / s < 300) return !0
            }
            return !1
        },
        _checkLength: function(e) {
        	//console.log("mark 22._checkLength");
        	
            return Boolean(this.BLANK_REGEXP.test(e.nodeValue))
        },
        _checkMinorContent: function(e) {
        	//console.log("mark 23._checkMinorContent");
        	
            return Boolean(this.TINY_REGEXP.test(e.id + " " + e.className))
        },
        _checkVisibility: function(t) {
        	//console.log("mark 24._checkVisibility");
        	
            return !(e.common.css(t, "visibility") == "hidden" || e.common.css(t, "display") == "none" || parseInt(e.common.css(t, "height")) <= 0 || parseInt(e.common.css(t, "width")) <= 0)
        }
    }, window.Page = e
})(),
function() {
	
	//console.log("mark 25.FUNC2");
	
    typeof Function.prototype.inherit != "function" && (Function.prototype.inherit = function(e) {
        typeof e == "function" && (this.prototype = new e, this.prototype.parent = e(), this.prototype.constructor = this)
    });
    var e = function(e) {
    	    //console.log("mark 26.e");
    	    
            return e
        },
        t = null,
        n = window.document;
    typeof YNote != "undefined" && (t = YNote), YNote = {}, YNote.Common = {
        browser: function() {
        	//console.log("mark 27.browser");
        	
            return {
                isIE: navigator.appVersion.indexOf("MSIE", 0) != -1,
                isSafari: navigator.appVersion.indexOf("WebKit", 0) != -1,
                isFirefox: navigator.userAgent.indexOf("Firefox", 0) != -1,
                isIpad: navigator.userAgent.indexOf("WebKit") > 0 && navigator.userAgent.indexOf("iPad") > 0,
                isIphone: navigator.userAgent.indexOf("WebKit") > 0 && navigator.userAgent.indexOf("iPhone") > 0,
                isChrome: navigator.userAgent.indexOf("WebKit") > 0 && navigator.userAgent.indexOf("Chrome") > 0
            }
        }(),
        trim: function(e) {
        	//console.log("mark 28.trim");
        	
            return typeof e != "string" ? e : e.replace(/^\s+/, "").replace(/\s+$/, "")
        },
        getCssText: function(e) {//console.log("mark 29.getCssText.This function is empty.");
        },
        check163Auth: function(e) {//console.log("mark 30.check163Auth.This function is empty.");
        },
        configuration: function() {
        	//console.log("mark 31.configuration");
        	
            return {
                load: function() {},
                reload: function() {},
                addConfigurationChangeListener: function(e) {},
                removeConfigurationChangeListener: function(e) {}
            }
        },
        extend: function(e, t, n) {
        	//console.log("mark 32.extend");
        	
            if (typeof t != "object") return !1;
            for (var r in t) typeof e[r] != "undefined" ? n ? e[r] = [e[r], t[r]] : e[r] = t[r] : e[r] = t[r]
        },
        el: function(e) {
        	//console.log("mark 33.el");
        	
            return n.getElementById(e)
        },
        mkel: function(e, t) {
        	//console.log("mark 34.mkel");
        	
            try {
                var r = n.createElement(e);
                return t && t.appendChild(r), r
            } catch (i) {
                return !1
            }
        },
        addEvent: function(e, t, n) {
        	//console.log("mark 35.addEvent");
        	
            if (!e.nodeType || e.nodeType != 1) return !1;
            YNote.Common.browser.isIE ? e.attachEvent("on" + t, n) : e.addEventListener(t, n, !1)
        },
        deleteEvent: function(e, t, n) {
        	//console.log("mark 36.deleteEvent");
        	
            if (!e.nodeType || e.nodeType != 1) return !1;
            YNote.Common.browser.isIE ? e.detachEvent("on" + t, n) : e.removeEventListener(t, n, !1)
        },
        wrapperEvent: function(e) {
        	//console.log("mark 37.wrapperEvent");
        	
            var t = {
                target: YNote.Common.browser.isIE ? e.srcElement : e.target,
                offsetX: YNote.Common.browser.isIE ? e.offsetX : e.layerX,
                offsetY: YNote.Common.browser.isIE ? e.offsetY : e.layerY,
                x: YNote.Common.browser.isIE ? e.x : e.pageX,
                y: YNote.Common.browser.isIE ? e.y : e.pageY
            };
            return t
        },
        enableDrag: function(e) {
        	//console.log("mark 38.enableDrag");
        	
            var t = window;
            typeof e == "string" && (e = YNote.Common.el(e)), e.nodeType && e.nodeType == 1 && e.tagName.toLowercase() == "div" && (e.style.position = "absolute", YNote.Common.addEvent(e, "mousedown", function(e) {
                if (typeof t.YNoteDragObject != "undefined" && t.YNoteDragObject != null) return !1;
                var n = YNote.Common.wrapperEvent(e);
                t.YNoteDragObject = {
                    element: n.target,
                    startX: n.offsetX,
                    startY: n.offsetY
                }
            }), typeof t.YNoteDragObject == "undefined" && (YNote.Common.addEvent(t.document, "mouseup", function(e) {
                t.YNoteDragObject != null && (t.YNoteDragObject = null)
            }), YNote.Common.addEvent(t.document, "mousemove", function(e) {
                if (typeof t.YNoteDragObject == "undefined" || t.YNoteDragObject == null) return;
                var n = YNote.Common.wrapperEvent(e);
                t.YNoteDragObject.element.style.left = n.x - t.YNoteDragObject.startX + "px", t.YNoteDragObject.element.style.top = n.y - t.YNoteDragObject.startY + "px"
            })))
        },
        serverlog: function(e) {
        	//console.log("mark 39.serverlog");
        	
            var t = new Image,
                n = YWebClipperConfiguration,
                r = n.clipperBaseURL + n.logurl;
            t.src = r + "&s=" + e
        },
        log: function(e) {
        	//console.log("mark 40.log");
},
        Dom: {
            appendHTMLToIframe: function(e, t) {
            	//console.log("mark 41.DOM:appendHTMLToIframe");
                if (e.tagName && e.tagName.toLowerCase() == "iframe") {
                    var n = e.contentWindow.document;
                    try {
                        n.open(), n.write(t), n.close()
                    } catch (r) {
                        YNode.Common.log("append HTML to [iframe:" + e.name + "] ERROR!")
                    }
                }
            }
        },
        getCharSet: function() {
        	//console.log("mark 42.getCharSet");
        	
            return YNote.Common.browser.isIE ? document.charset.toLowerCase() : document.characterSet.toLowerCase()
        },
        HTMLEncode: function(e) {
        	//console.log("mark 43.HTMLEncode");
        	
            var t = "",
                n = e.length,
                r = navigator.userAgent.toLowerCase(),
                i = /msie/.test(r) ? parseFloat(r.match(/msie ([\d.]+)/)[1]) : !1;
            if (i >= 7)
                for (var s = 0; s < n; s++) t += e.charCodeAt(s) + " ";
            else
                for (var s = 0; s < e.length; s++) {
                    var o = e.charCodeAt(s),
                        u = e[s];
                    o > 127 ? t += "&#" + o + ";" : u == ">" ? t += "&gt;" : u == "<" ? t += "&lt;" : u == "&" ? t += "&amp;" : t += e.charAt(s)
                }
            return t
        },
        unicodeEncode: function(e) {
        	//console.log("mark 44.unicodeEncode");
        	
            var t = "";
            if (typeof e == "string")
                for (var n = 0; n < e.length; n++) {
                    var r = e.charCodeAt(n);
                    r > 127 ? t += "&#" + r + ";" : t += e.charAt(n)
                }
            return t
        }
    }, YNote.EventInterface = function() {}, YNote.Common.extend(YNote.EventInterface.prototype, {
        addEventListener: function(e, t) {//console.log("mark 45.addEventListener");
        },
        removeEventListener: function(e, t) {//console.log("mark 46.removeEventListener");
        },
        executeEvent: function(e) {//console.log("mark 47.executeEvent");
        },
        fireEvent: function(e) {//console.log("mark 48.fireEvent");
        },
        events: {}
    }), YNote.StyleUtil = function() {}, YNote.Common.extend(YNote.StyleUtil.prototype, {
        styleForNode: function(e, t) {
        	//console.log("mark 49.styleForNode");
        	
            this.cssNameMap = {};
            if (e && e.nodeType && e.nodeType == 1) {
                var n = null;
                YNote.Common.browser.isIE ? n = e.currentStyle : n = window.getComputedStyle(e, null);
                var r = YWebClipperConfiguration.clipperFilterStyles.keep,
                    i = null;
                typeof r[e.tagName.toLowerCase()] == "undefined" ? i = r["*"] : i = r[e.tagName.toLowerCase()];
                var s = "",
                    o = {},
                    u = YWebClipperConfiguration.styleMerge;
                for (var a = 0; a < i.length; a++)
                    if (YNote.Common.browser.isIE) {
                        var f = i[a];
                        u[f] ? o[f] = this.getCompoundCssString(f, n) : (f = this.cssName2ScriptName(i[a]), /#000000|none|auto|visible|arial/i.test("" + n[f]) || (o[f] = ("" + n[f]).replace(/"/g, "'")))
                    } else {
                        var f = i[a];
                        if (u[f]) o[f] = this.getCompoundCssString(f, n);
                        else {
                            var l = n.getPropertyCSSValue(f);
                            l != null && (/#000000|none|auto|visible|arial/i.test(l.cssText) || (o[f] = l.cssText.replace(/"/g, "'")))
                        }
                    }
                return this.cssArray = o, this.getStyleString(o)
            }
            return ""
        },
        getStyleString: function(e) {
        	//console.log("mark 50.getStyleString");
        	
            var t = "",
                n = "";
            for (var r in e) e[r].length != 0 && (YNote.Common.browser.isIE ? n = typeof this.cssNameMap[r] != "undefined" && this.cssNameMap[r].length > 0 ? this.cssNameMap[r] : r : n = r, t += n + ":" + e[r] + ";");
            return t
        },
        getCompoundCssString: function(e, t) {
        	//console.log("mark 51.getCompoundCssString");
        	
            var n = YWebClipperConfiguration.styleMerge,
                r = "";
            for (var i = 0; i < n[e].length; i++)
                if (YNote.Common.browser.isIE) {
                    var s = this.cssName2ScriptName(n[e][i]);
                    r += t[s] + " "
                } else r += t.getPropertyCSSValue(n[e][i]).cssText + " ";
            return r = r.substring(0, r.length - 1), /(0px ?){4}|(auto ?){4}/i.test(r) ? "" : r
        },
        cssName2ScriptName: function(e) {
        	//console.log("mark 52.cssName2ScriptName");
        	
            if (typeof e == "string" && e.indexOf("-") > 0) {
                var t = e.split("-"),
                    n = t[0];
                for (var r = 1; r < t.length; r++) n += t[r].substring(0, 1).toUpperCase() + t[r].substring(1);
                return this.cssNameMap[n] = e, n
            }
            return typeof e == "string" ? e == "float" ? "styleFloat" : e : ""
        },
        mergeDefaultCssValue: function() {//console.log("mark 53.mergeDefaultCssValue");
        }
    }), YNote.Clipper = function() {
    	//console.log("mark 54.YNote.Clipper");
		
        this.content = null, this.title = null;
        try {
            this.source = window.location.href
        } catch (e) {
            this.source = ""
        }
        this.type = null, this.selector = new YNote.Selection, this.init()
    }, YNote.Common.extend(YNote.Clipper, {
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
    }), YNote.Common.extend(YNote.Clipper.prototype, {
        close: function() {
        	//console.log("mark 55.close");
        	
            this.wrapper.style.display = "none", this.deleteFrame(), this.state = YNote.Clipper.DONE
        },
        clipContent: function() {
        	//console.log("mark 56.clipContent");
        	
            this.state = YNote.Clipper.CLIPPING;
            var e = (new Date).getTime();
            this.loadingView.style.display = "block";
            try {
                var t = YWebClipperConfiguration.doc.container;
                return this.hasSelection() ? (YNote.Common.log("has selection"), YWebClipperConfiguration.doc.contentType = "3", this.range = this.selector.getSelectionRange(), this.content = this.getSelectedContent(), this.state = YNote.Clipper.CLIPPED, this.content) : t.body ? (YNote.Common.log("no selection!"), this.content = this.getNodeText(t.body), this.state = YNote.Clipper.CLIPPED, this.content) : (YNote.Common.log("No Body!"), document.getElementById("_YNoteLoaddingTips").innerHTML = "抱歉，由于页面设置，无法获取所选内容", this.state = YNote.Clipper.ERROR_NO_BODY, YNote.Common.serverlog(2), "");
                var n
            } catch (r) {
                try {
                    document.getElementById("_YNoteLoaddingTips").innerHTML = "抱歉，由于页面设置，整页抓取失败，请选择部分内容后重试", YNote.Common.serverlog(3)
                } catch (i) {
                    YNote.Common.serverlog(4), alert("抱歉，由于页面设置，页面抓取失败!")
                }
            }
        },
        hasSelection: function() {
        	//console.log("mark 57.hasSelection");
        	
            this.getSelection();
            if (typeof this.selection == "undefined" || this.selection == null || typeof this.selection.getRangeAt != "function" && typeof this.selection.createRange != "object" && typeof this.selection.createRange != "function") return !1;
            if (typeof this.selection.rangeCount != "undefined" && this.selection.rangeCount < 1) return !1;
            if (typeof this.selection.createRange == "function" || typeof this.selection.createRange == "object") try {
                    if (this.selection.type.toLowerCase() != "text" || this.selection.createRange().htmlText == "") return !1
                } catch (e) {
                    return !1
                } else if (typeof this.selection.getRangeAt == "function") try {
                    var t = this.selection.getRangeAt(0);
                    if (t.startContainer == t.endContainer && t.startOffset == t.endOffset) return !1
                } catch (e) {
                    return !0
                }
                return !0
        },
        getSelection: function() {
        	//console.log("mark 58.getSelectioin");
        	
            this.selection = this.selector.getSelection()
        },
        submit: function() {
        	//console.log("mark 59.submit");
        	
            this.state = YNote.Clipper.UPLOADING_FILE, this.loadingView.style.display = "block", this.fillForm(), this.form.submit()
        },
        getClipID: function() {
        	//console.log("mark 60.getClipID");
        	
            return "/wcp" + (new Date).getTime() + Math.floor(Math.random() * 1e3)
        },
        getHiddenForm: function() {
        	//console.log("mark 61.getHiddenForm");
        	
            var e = YNote.Common.mkel("form");
            return e.innerHTML = "", e
        },
        rangeIntersectsNode: function(e) {
        	//console.log("mark 62.rangeIntersectsNode");
        	
            if (!YNote.Common.browser.isIE) {
                if (this.range) {
                    var t = e.ownerDocument.createRange();
                    try {
                        t.selectNode(e)
                    } catch (n) {
                        t.selectNodeContents(e)
                    }
                    return this.range.compareBoundaryPoints(Range.START_TO_END, t) == 1 && this.range.compareBoundaryPoints(Range.END_TO_START, t) == -1
                }
                return !1
            }
            if (this.range) {
                if (e.nodeType == 1) {
                    var r = e.ownerDocument.body.createTextRange();
                    return r.moveToElementText(e), r.compareEndPoints("StartToEnd", this.range) == -1 && r.compareEndPoints("EndToStart", this.range) == 1
                }
                return !0
            }
            return !1
        },
        changeNodeName: function(e) {
        	//console.log("mark 63.changeNodeName");
        	
            var t = YWebClipperConfiguration.translateTagName;
            return typeof t[e.tagName.toLowerCase()] != "undefined" ? t[e.tagName.toLowerCase()] : e.tagName.toLowerCase()
        },
        isListNode: function(e) {
        	//console.log("mark 64.isListNode");
        	
            var t = YWebClipperConfiguration.listNodes;
            return e && e.nodeType == 1 && typeof t[e.nodeName.toLowerCase()] != "undefined"
        },
        withAttribute: function(e) {
        	//console.log("mark 65.withAttribute");
        	
            var t = YWebClipperConfiguration.clipperFilterAttributes.remove;
            return typeof e == "string" && typeof t[e.toLowerCase()] == "undefined"
        },
        getNodeAttributesString: function(e) {
        	//console.log("mark 66.getNodeAttributesString");
        	
            var t = "",
                n = e.attributes;
            if (n != null)
                for (var r = 0; r < n.length; r++) {
                    var i = n[r].nodeName.toLowerCase(),
                        s = n[r].nodeValue;
                    if (i == "href" || i == "src") s.toLowerCase().indexOf("javascript:") == 0 || s.indexOf("#") == 0 ? s = "" : s = this.replaceURL(s);
                    else if (i == "target" && s == "_blank") continue;
                    this.withAttribute(i) && typeof s == "string" && s.length > 0 && (t += n[r].nodeName + "=" + '"' + s.toString() + '" ')
                }
            return t.replace(/\s+$/, "")
        },
        isCloseTag: function(e) {
        	//console.log("mark 67.isCloseTag");
        	
            return e && typeof YWebClipperConfiguration.selfCloseTag[e.nodeName.toLowerCase()] != "undefined"
        },
        isNodeVisible: function(e) {
        	//console.log("mark 68.isNodeVisible");
        	
            if (e.nodeType) {
                var t = "";
                if (YNote.Common.browser.isIE) {
                    if (e.currentStyle != null && e.currentStyle["display"] == "none") return !1
                } else try {
                    if (window.getComputedStyle(e, null).getPropertyCSSValue("display").cssText == "none") return !1
                } catch (n) {
                    return !1
                }
                var r = YWebClipperConfiguration;
                if (e.nodeType == 3)
                    if (e.nodeValue || e.nodeValue.length == 0) return !1;
                return e.nodeType == 1 && typeof r.formatTag[e.tagName.toLowerCase()] == "undefined" && YNote.Common.trim(e.innerHTML).length == 0 ? !1 : !0
            }
            return !1
        },
        keepNode: function(e) {
        	//console.log("mark 69.keepNode");
        	
            if (e) {
                if (e.nodeType == 3) return !0;
                if (e.nodeType == 1) {
                    if (e.nodeName.indexOf("#") == 0 || !this.isNodeVisible(e)) return !1;
                    var t = YWebClipperConfiguration.filterElements.remove;
                    return typeof t[e.nodeName.toLowerCase()] == "undefined"
                }
            }
            return !1
        },
        replaceURL: function(e) {
        	//console.log("mark 70.replaceURL");
        	
            if (!window.location) return e;
            var t = null;
            e = YNote.Common.trim(e);
            var n = window.location.host,
                r = window.location.protocol,
                i = window.location.href.split("?")[0].split("#")[0];
            return i = i.substr(0, i.lastIndexOf("/")) + "/", rbase = r + "//" + n, (t = e.match(/^(https?):/i)) != null ? e : e.indexOf("/") == 0 ? rbase + e : i + e
        },
        getNodeText: function(e, t) {
        	//console.log("mark 71.getNodeText");
        	
            var n = "",
                r = e,
                i = YWebClipperConfiguration;
            while (r != document.body) {
                if (r == this.wrapper) return n;
                if (r == null) return n;
                r = r.parentNode
            }
            if (this.range && !this.rangeIntersectsNode(e)) return n;
            if (!this.keepNode(e)) return n;
            if (e.nodeType == 3) this.range ? this.range.startContainer == e && this.range.startContainer == this.range.endContainer ? n += e.nodeValue.substring(this.range.startOffset, this.range.endOffset) : this.range.startContainer == e ? n += e.nodeValue.substring(this.range.startOffset) : this.range.endContainer == e ? n += e.nodeValue.substring(0, this.range.endOffset) : this.range.commonAncestorContainer != e && (n += e.nodeValue) : n += e.nodeValue;
            else if (e.nodeType == 1) {
                if (e === i.doc.mainContent && i.doc.contentType !== "3") {
                    var s = (new Date).getTime() / 1e5 + "";
                    n += s, i.doc.mainContentTag = s
                }
                if (!this.range || this.range.commonAncestorContainer != e || this.range.startContainer == this.range.commonAncestorContainer || !!this.isListNode(e)) {
                    var o = this.changeNodeName(e);
                    n += "<" + o;
                    var u = this.getNodeAttributesString(e);
                    u.length > 0 && (n += " " + u);
                    if (this.styleUtil) {
                        var a = this.styleUtil.styleForNode(e, t);
                        a != null && a.length != 0 && (n += " style='" + a + "'")
                    }!e.hasChildNodes() && this.isCloseTag(e) ? n += "/>" : n += ">"
                }
                if (e.tagName.toLowerCase() != "iframe" && e.hasChildNodes()) {
                    var f = e.childNodes;
                    for (var l = 0, c = f.length; l < c; l++) {
                        var h = f[l];
                        if (h != null && YNote.Common.trim(h.nodeValue) != "" && h.nodeType > 0 && h.nodeName && h.nodeName.toLowerCase() != "script" && h.nodeName.toLowerCase() != "iframe") {
                            var p = "";
                            if (h.nodeName.toLowerCase() == "font") var p = h.outerHTML;
                            else p = this.getNodeText(h, e);
                            p && p.length > 0 && (n += p)
                        }
                    }
                }
                if (!this.range || this.range.commonAncestorContainer != e || !!this.isListNode(e))
                    if (e.hasChildNodes() || !this.isCloseTag(e)) n += "</" + o + ">", e === i.doc.mainContent && i.doc.contentType !== "3" && (n += i.doc.mainContentTag)
            }
            return n
        },
        getSelectedContent: function() {
        	//console.log("mark 72.getSelectedContent");
        	
            if (this.hasSelection()) {
                if (YNote.Common.browser.isIE) return YNote.Common.log(this.selection.htmlText), this.selection.htmlText ? (this.content = this.selection.htmlText, this.selection.htmlText) : (this.content = this.getNodeText(this.getRangeContainer(this.range)), this.content);
                var e = this.selector.getSelectionRange(),
                    t = "";
                return t = this.getNodeText(e.commonAncestorContainer), t == "" && YNote.Common.log("Get Selected ERROR!"), t
            }
        },
        getRangeContainer: function(e) {
        	//console.log("mark 73.getRangeContainer");
        	
            if (!e) return document.body;
            var t = e.parentElement(),
                n = t.getBoundingClientRect(),
                r = e.getBoundingClientRect();
            while (n.top > r.top || n.bottom < r.bottom) t = t.parentNode, n = t.getBoundingClientRect();
            return t
        },
        initFrame: function() {
        	//console.log("mark 74.initFrame");
        	
            var e = YWebClipperConfiguration;
            this.view.innerHTML = '<iframe width="100%" height="100%" border="0" frameborder="0" src="javascript:document.write(\'\');" style="width:100%;height:100%;border:0px"  id="' + e.clipperDomPrefix + "ContentFrame" + '" name="' + e.doc.contentType + "ContentFrame" + '" onload="yApp.frameHandler(event);" style="border:0px" scrolling ="no"></iframe>'
        },
        deleteFrame: function() {
        	//console.log("mark 75.deleteFrame");
        	
            this.view.innerHTML = ""
        },
        filterResults: function(e, t, n) {
        	//console.log("mark 76.filterResults");
        	
            var r = e ? e : 0;
            return t && (!r || r > t) && (r = t), n && (!r || r > n) ? n : r
        },
        init: function() {
        	//console.log("mark 77.init");
        	
            YNote.Common.log("Init Clipper Class"), this.styleUtil = new YNote.StyleUtil, this.path = this.getClipID(), this.requestCount = 0, this.state = YNote.Clipper.CLASS_INIT;
            var e = YWebClipperConfiguration,
                t = "ydNoteWebClipper",
                r = n.getElementById(t);
            r != null && r.parentNode != null && r.parentNode.removeChild(r);
            var i = YNote.Common.mkel("div");
            i.id = t, i.name = t, YNote.Common.browser.isIE && (document.getElementsByTagName("html")[0].cssText = "background-image:url(about:blank);background-attachment:fixed", document.getElementsByTagName("body")[0].cssText = "background-image:url(about:blank);background-attachment:fixed"), i.style.cssText = e.clipperStyle, i.style.zIndex = 999999, this.wrapper = i;
            var s = YNote.Common.mkel("div", i);
            s.style.cssText = "width:400px;padding:5px;background-color:rgba(92,184,229,.5)!important;background:#5cb8e5;border-radius:5px;box-shadow:0 0 2px #5cb8e5;    -khtml-border-radius:5px;-webkit-border-radius:5px;-webkit-box-shadow:0 0 2px #5cb8e5;-moz-border-radius:5px;-moz-box-shadow:0 0 2px #5cb8e5;", s.id = "ydNoteWebClipper-New", s.className = "ydnwc-dialog";
            var o = YNote.Common.mkel("div", s);
            o.id = "ydNoteWebClipper_view", o.name = "ydNoteWebClipper_view", YNote.Common.browser.isIE ? o.style.cssText = "height:278px;width:398px;border:1px solid #5cb8e5;background:#fff;" : o.style.cssText = "height:264px;width:398px;border:1px solid #5cb8e5;background:#fff;", this.view = o, this.initFrame();
            var u = YNote.Common.mkel("div", i),
                a = YNote.Common.mkel("form", u);
            YNote.Common.extend(a, {
                id: e.clipperDomPrefix + "ContentForm",
                name: e.clipperDomPrefix + "ContentForm",
                action: e.clipperBaseURL + e.clipperUploadApp,
                target: e.doc.contentType + "ContentFrame",
                enctype: "multipart/form-data",
                encoding: "multipart/form-data",
                method: "POST"
            }), YNote.Common.extend(u.style, {
                display: "none"
            });
            var f = "",
                l = e.clipperFormFields;
            for (var c = 0; c < l.length; c++) l[c][1] == "text" && (f += '<input type="text" name="' + l[c][2] + '" id="' + e.clipperDomPrefix + "ContentForm" + l[c][0] + '" value=""/>'), l[c][1] == "area" && (f += '<textarea name="' + l[c][2] + '" id="' + e.clipperDomPrefix + "ContentForm" + l[c][0] + '"></textarea>');
            a.innerHTML = f, this.form = a, div = YNote.Common.mkel("div", s), YNote.Common.browser.isIE ? div.style.cssText = "position:absolute;height:270px;398px;background:#fff;top:0;left:200px;" : div.style.cssText = "position:absolute;height:258px;398px;background:#fff;top:0;left:200px;", div.innerHTML = e.loadingHTML, div.style.display = "none", div.name = "ydNoteWebClipper_loadview", div.id = "ydNoteWebClipper_loadview", this.loadingView = div, window.document.body.appendChild(i)
        },
        clearFlash: function() {
        	//console.log("mark 78.clearFlash");
        	
            var e = YNote.Common.browser.isIE,
                t = [];
            if (e) {
                var n = document.getElementsByTagName("object"),
                    r = document.getElementsByTagName("embed");
                t = n.length && n || r
            } else t = document.getElementsByTagName("embed");
            for (var i = 0, s = t.length; i < s; i++)(e && t[i] && t[i]["classid"] == "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" || t[i] && t[i]["type"] == "application/x-shockwave-flash" || t[i] && t[i].parentNode.innerHTML.indexOf("application/x-shockwave-flash") > 0) && t[i].parentNode && t[i].parentNode.removeChild(t[i])
        },
        reset: function() {
        	//console.log("mark 79.reset");
        	
            YNote.Common.log("Call Reset!"), this.selection = null, this.range = null, this.title = null, this.content = null, this.state = 0, this.requestCount = 0, this.path = this.getClipID(), this.wrapper.style.display = "", this.view.innerHTML.length > 10 && this.deleteFrame(), this.initFrame()
        },
        getNavigatorSign: function() {
        	//console.log("mark 80.getNavigatorSign");
        	
            var e = navigator.userAgent.toLowerCase(),
                t = /msie/.test(e) ? parseFloat(e.match(/msie ([\d.]+)/)[1]) : !1;
            return parseInt(t) >= 7 ? "true" : "false"
        },
        fillForm: function() {
        	//console.log("mark 81.fillForm");
        	
            YNote.Common.log("Enter fillForm");
            var e = this.getNavigatorSign(),
                t = document,
                n = YWebClipperConfiguration,
                r = "FullPage MainBody Selected";
            this.title = t.title, this.content = this.content.replace(/[\r\n]/g, ""), n.doc.mainContentTag && (this.content += "$" + n.doc.mainContentTag), this.content = e == "true" ? YNote.Common.HTMLEncode(this.content) : YNote.Common.unicodeEncode(this.content), t.getElementById(n.clipperDomPrefix + "ContentForm" + "path").value = this.path, t.getElementById(n.clipperDomPrefix + "ContentForm" + "content").value = this.content, t.getElementById(n.clipperDomPrefix + "ContentForm" + "source").value = YNote.Common.HTMLEncode(this.source), t.getElementById(n.clipperDomPrefix + "ContentForm" + "title").value = YNote.Common.HTMLEncode(this.title), t.getElementById(n.clipperDomPrefix + "ContentForm" + "len").value = this.content.length, t.getElementById(n.clipperDomPrefix + "ContentForm" + "type").value = r.split(" ")[n.doc.contentType - 1], t.getElementById(n.clipperDomPrefix + "ContentForm" + "sign").value = this.getNavigatorSign()
        }
    }), YNote.Selection = function() {}, YNote.Common.extend(YNote.Selection.prototype, {
        getSelection: function() {
        	//console.log("mark 82.getSelection");
        	
            var e = window,
                t = e.document;
            return YNote.Common.browser.isIE ? this.selection = document.selection : this.selection = e.getSelection(), this.hasSelection() ? this.selectionParentWindow = e : this.getNestedRange(e), this.selection
        },
        hasSelection: function() {
        	//console.log("mark 83.hasSelection");
        	
            return YNote.Common.log("Enter hasSelection"), typeof this.selection.createRange == "function" ? this.selection.createRange().htmlText == "" ? !1 : !0 : this.selection.rangeCount == 0 ? !1 : !0
        },
        getNestedRange: function(e) {
        	//console.log("mark 84.getNestedRange");
        	
            YNote.Common.log("Enter getNestedRange");
            var t = e.document,
                n = null;
            n = t.getElementsByTagName("iframe");
            if (!n || n.length == 0) return !1;
            for (var r = 0, i = n.length; r < i; r++) {
                var s = n[r].contentWindow;
                try {
                    s.document;
                    if (n[r].clientWidth <= 10 || n[r].clientHeight <= 10) continue
                } catch (o) {
                    continue
                }
                try {
                    var u = typeof s.getSelection == "function" ? s.getSelection() : s.document.selection;
                    if (typeof u.createRange == "function" || typeof u.getRangeAt == "function") {
                        var a = this.selection;
                        this.selection = u, this.selectionparentWindow = s;
                        if (!!this.hasSelection()) return this.selection = a, !1;
                        var f = 0,
                            e = s;
                        while (e !== window) {
                            f++;
                            if (f > 3) break;
                            e = e.parent
                        }
                        e === window && this.getNestedRange(s)
                    }
                } catch (o) {
                    continue
                }
            }
            YNote.Common.log("getNestedRange over")
        },
        getSelectionRange: function() {
        	//console.log("mark 85.getSelectionRange");
        	
            YNote.Common.log("Enter get getSelectionRange"), this.getSelection();
            if (!this.selection) return !1;
            YNote.Common.browser.isIE ? this.range = this.selection.createRange() : this.range = this.selection.getRangeAt(0);
            if (YNote.Common.browser.isIE && this.range) {
                this.range.commonAncestorContainer = this.range.parentElement(), YNote.Common.log("Enter get range block");
                var e = this.range.duplicate();
                e.collapse(!0);
                var t = this.getContainerForIE(e);
                this.range.startContainer = t.el, this.range.startOffset = t.offset;
                var n = this.range.duplicate();
                n.collapse(!1), t = this.getContainerForIE(n), this.range.endContainer = t.el, this.range.endOffset = t.offset
            }
            return this.range
        },
        getAncestor: function(e, t) {//console.log("mark 86.getAncestor");
        },
        getContainerForIE: function(e) {
        	//console.log("mark 87.getContainerForIE");
        	
            var t = e.parentElement(),
                n = t.ownerDocument.body.createTextRange();
            n.moveToElementText(t), n.setEndPoint("EndToStart", e);
            var r = n.text.length;
            if (r < t.innerText.length / 2) var i = 1,
                s = t.firstChild;
            else i = -1, s = t.lastChild, n.moveToElementText(t), n.setEndPoint("StartToStart", e), r = n.text.length;
            while (s) {
                switch (s.nodeType) {
                    case 3:
                        nodeLength = s.data.length;
                        if (!(nodeLength < r)) return i == 1 ? {
                            node: s,
                            offset: r
                        } : {
                            el: s,
                            offset: nodeLength - r
                        };
                        var o = r - nodeLength;
                        i == 1 ? n.moveStart("character", o) : n.moveEnd("character", -o), r = o;
                        break;
                    case 1:
                        nodeLength = s.innerText.length, i == 1 ? n.moveStart("character", nodeLength) : n.moveEnd("character", -nodeLength), r -= nodeLength
                }
                i == 1 ? s = s.nextSibling : s = s.previousSibling
            }
            return {
                el: t,
                offset: 0
            }
        },
        getSelectionHTMLText: function() {
        	//console.log("mark 88.getSelectionHTMLText");
        	
            return this.getSelectionRange(), this.range ? YNote.Common.browser.isIE ? this.range.htmlText : "" : !1
        }
    }), YNote.ClipperManager = function() {
    	//console.log("mark 89.YNote.ClipperManager");
        this.init()
    }, YNote.Common.extend(YNote.ClipperManager.prototype, {
        run: function() {
        	//console.log("mark 90.run");
        	
            YNote.Common.log("start run.."), YNote.Common.serverlog(0);
            if (!this.checkEnv()) return YNote.Common.log("check Env false"), YNote.Common.serverlog(1), !1;
            YNote.Common.log("manager run"), this.clipper.reset(), this.clipper.wrapper.display = "", this.clipper.clearFlash(), this.clipper.clipContent();
            if (this.clipper.state != YNote.Clipper.CLIPPED) return;
            YNote.Common.log("manager clip end"), this.clipper.submit()
        },
        submit: function() {
        	//console.log("mark 91.submit");
        	
            this.clipper.state == YNote.Clipper.CLIPPED ? (YNote.Common.log("Do clipper.submit"), this.clipper.submit()) : YNote.Common.log("ERROR! clipper state error")
        },
        init: function() {
        	//console.log("mark 92.init");
        	
            this.clipper = new YNote.Clipper
        },
        checkEnv: function() {
        	//console.log("mark 93.checkEnv");
        	
            var e = window.document;
            return e ? e.body ? (YNote.Common.log(this.clipper.state), this.clipper.state > 0 && this.clipper.state < 100 && this.clipper.state != YNote.Clipper.DONE ? !1 : !0) : !1 : !1
        }
    }), YNote.App = function() {}, YNote.App.prototype = {
        crossDomain: function() {
        	//console.log("mark 94.crossDomain");
        	
            var e = {},
                t, n, r = 1,
                i, s = this,
                o = !1,
                u = "postMessage",
                a = "addEventListener",
                f, l = s[u];
            return 
            e.isFunction = function(e) {
                return Object.prototype.toString.call(e) === "[object Function]"
            }, 
            e.browser = function() {
                var e = {},
                    t = navigator.userAgent.toLowerCase(),
                    n;
                return (n = t.match(/msie ([\d.]+)/)) ? e.msie = n[1] : (n = t.match(/firefox\/([\d.]+)/)) ? e.firefox = n[1] : (n = t.match(/chrome\/([\d.]+)/)) ? e.chrome = n[1] : (n = t.match(/opera.([\d.]+)/)) ? e.opera = n[1] : (n = t.match(/version\/([\d.]+).*safari/)) ? e.safari = n[1] : 0, e
            }(), 
            e.each = function(t, n, r) {
                if (t === undefined || t === null) return;
                if (t.length === undefined || e.isFunction(t)) {
                    for (var i in t)
                        if (t.hasOwnProperty(i) && n.call(r || t[i], i, t[i]) === !1) break
                } else
                    for (var s = 0; s < t.length; s++)
                        if (n.call(r || t, s, t[s]) === !1) break; return t
            }, 
            e.param = function(t) {
                if (typeof t == "string") return t;
                var n = [];
                return e.each(t, function(t, r) {
                    r && (r = encodeURIComponent(r), e.browser.firefox && (r = encodeURIComponent(unescape(r))), n.push(encodeURIComponent(t) + "=" + r))
                }), n.join("&").replace(r20, "+")
            }, 
            e.postMessage = function(t, n, i) {
                if (!n) return;
                t = typeof t == "string" ? t : e.param(t), i = i || parent, l ? i[u](t, n.replace(/([^:]+:\/\/[^\/]+).*/, "$1")) : n && (i.location = n.replace(/#.*$/, "") + "#" + +(new Date) + r++ +"&" + t)
            }, 
            e.receiveMessage = f = function(r, u, c) {
                l ? (r && (i && f(), i = function(t) {
                    if (typeof u == "string" && t.origin !== u || e.isFunction(u) && u(t.origin) === o) return o;
                    r(t)
                }), s[a] ? s[r ? a : "removeEventListener"]("message", i, o) : s[r ? "attachEvent" : "detachEvent"]("onmessage", i)) : (t && clearInterval(t), t = null, r && (c = typeof u == "number" ? u : typeof c == "number" ? c : 100, t = setInterval(function() {
                    var e = document.location.hash,
                        t = /^#?\d+&/;
                    e !== n && t.test(e) && (n = e, r({
                        data: e.replace(t, "")
                    }))
                }, c)))
            }, 
            e
        }(),
        creatDiv: function(e, t, n, r, i, s) {
        	//console.log("mark 95.creatDiv");
        	
            var o = document.createElement("div");
            o.id = e;
            if (!s) var s = "position:absolute;filter:alpha(opacity=80);background-color:#666;opacity:0.8;z-index:9999;";
            return s += "height:" + n + "px;", s += "width:" + t + "px;", s += "left:" + r + "px;", s += "top:" + i + "px;", o.style.cssText = s, o
        },
        removeDiv: function(e) {
        	//console.log("mark 96.removeDiv");
        	
            var t = document.getElementById(e);
            t && document.body.removeChild(t)
        },
        removeClipDiv: function() {
        	//console.log("mark 97.removeClipDiv");
        	
            for (var e = 0; e < 5; e++) this.removeDiv("yShade" + e);
            this.shadeStatu = !1
        },
        createClipDiv: function() {
        	//console.log("mark 98.createClipDiv");
        	
            if (this.mainElem) {
                var e = this.mainElem,
                    t = Math.abs(e.common.findPos(e.elem).y),
                    n = Math.abs(e.common.findPos(e.elem).x),
                    r = e.elem.scrollWidth,
                    i = e.elem.scrollHeight,
                    s = document.documentElement.scrollWidth,
                    o = document.documentElement.scrollHeight;
                this.removeClipDiv();
                var u = [],
                    a = document.body.scrollWidth == document.body.offsetWidth,
                    f = "position:absolute;border:5px solid rgb(0, 154, 226);border:5px solid rgba(0, 154, 226,0.6);-webkit-border-radius:5px;-moz-border-radius:5px;-khtml-border-radius:5px;z-index:9999;",
                    l = (document.body.offsetWidth - document.documentElement.scrollWidth) / 2;
                u[0] = this.creatDiv("yShade0", s, t, l, 0), u[1] = this.creatDiv("yShade1", s, o - t - i, l, t + i), u[2] = this.creatDiv("yShade2", n, i, l, t), u[3] = this.creatDiv("yShade3", s - r - n, i, r + n + l, t), u[4] = this.creatDiv("yShade4", r, i, n - 5 + l, t - 5, f);
                for (var c = 0, h = u.length; c < h; c++) document.body.appendChild(u[c])
            }
            this.shadeStatu = !0
        },
        mainElem: function() {
        	//console.log("mark 99.mainElem");
        	
            var e = new Page(window.document),
                t = e.getMainArticle();
            return t && (YWebClipperConfiguration.doc.mainContent = t.elem, YWebClipperConfiguration.doc.contentType = "2"), t
        }(),
        run: function() {
        	//console.log("mark 100.run");
        	
            YNote.Common.log("YNote Run...");
            if (typeof this.clipperManager == "undefined") try {
                this.clipperManager = new YNote.ClipperManager
            } catch (e) {
                YNote.Common.log("Exception:" + e)
            }
            this.clipperManager.run()
        },
        frameHandler: function(e) {
        	//console.log("mark 101.frameHandler");
        	
            YNote.Common.log("Enter framehandler ");
            var t = YNote.Common.wrapperEvent(e);
            if (!this.clipperManager || typeof this.clipperManager == "undefined") return;
            var n = this.clipperManager.clipper,
                r = t.target,
                i = YWebClipperConfiguration;
            YNote.Common.log("CALL FRAMEHANDLER :The State is " + n.state);
            switch (this.clipperManager.clipper.state) {
                case YNote.Clipper.UPLOADING_FILE:
                    n.loadingView.style.display = "none", n.state = YNote.Clipper.DONE
            }
        }
    }, YNote.Common.log("------------------");
    var r = null,
        i = null,
        s = null,
        o = function() {
        	//console.log("mark 102.o");
            YNote.Common.log("enter loopFunc:"), document.readyState != "complete" && document.readyState != "loaded" && document.readyState != "interactive" || !document.body ? r = setTimeout(o, 300) : (window._ynote_app_load = !0, window.yApp = new YNote.App, yApp.run(), YWebClipperConfiguration.doc.contentType === "2" && yApp.createClipDiv(), yApp.crossDomain.receiveMessage(function(e) {
                if (e.data === "close") yApp.clipperManager.clipper.close(), yApp.removeClipDiv(), window.postMessage || (window.location = yApp.clipperManager.clipper.source);
                else if (e.data === "success") {
                    yApp.clipperManager.clipper.close();
                    var t = document.createElement("div");
                    t.style.cssText = "position:fixed;_position:absolute;right:20px; top:20px;padding:10px;color:#d98736;border:1px solid #ffebb4;background:#fffff6;border-radius:5px;z-index:999999;", t.innerHTML = "保存成功", document.body.appendChild(t), setTimeout(function() {
                        document.body.removeChild(t), window.postMessage || (window.location = yApp.clipperManager.clipper.source)
                    }, 3e3)
                } else if (e.data === "resize_fullpage" || e.data === "resize_login" || e.data === "openid") {
                    var n = 248,
                        r = 530;
                    e.data === "openid" ? (n = 248, r = 400) : e.data === "resize_fullpage" && (n = 285, r = 400), document.getElementById("ydNoteWebClipper_view").style.height = n + "px", YNote.Common.browser.isIE && (document.getElementById("ydNoteWebClipper_view").style.height = n + 10 + "px", document.getElementById("_YNoteContentFrame").style.height = n + 10 + "px"), document.getElementById("ydNoteWebClipper_view").style.width = r + "px", document.getElementById("ydNoteWebClipper-New").style.width = r + 2 + "px", document.getElementById("ydNoteWebClipper").style.width = r + 10 + "px"
                } else e.data === "remove" ? yApp.removeClipDiv() : e.data === "creat" && yApp.createClipDiv()
            }, "http://note.youdao.com"), window.addEventListener ? window.addEventListener("resize", s) : window.attachEvent("onresize", s), s = function() {}, clearTimeout(r))
        };
    r = setTimeout(o, 300), s = function() {
    	//console.log("mark 103.s");
        !window.yApp || (i && (clearTimeout(i), i = null), i = setTimeout(function() {
            yApp.shadeStatu && yApp.createClipDiv()
        }, 200))
    }
}();

}