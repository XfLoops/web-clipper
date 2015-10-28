
function clip() {

    var WebClipperConfiguration = {
        doc: {
            mainContent: null
        }
    };
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
                var mainArticle = null;
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
                //console.log(elems);
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
        YNote = {};
        YNote.App = function () {
        };
        YNote.App.prototype = {
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
                    var cssText = "position:absolute;border:5px solid #FE2763;border:5px solid #FE2763;-webkit-border-radius:5px;-moz-border-radius:5px;-khtml-border-radius:5px;z-index:9999;";
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
                    WebClipperConfiguration.doc.mainContent = temp.elem;
                }
                return temp
            }()
        };

        if ((document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") && document.body) {
            window.yApp = new YNote.App;
            yApp.createClipDiv();
        }
    })();

}