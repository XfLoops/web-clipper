var appParams = {
   "threshold" : 0.9,
    "root" : document.getElementsByTagName('body')[0],
    "IGNORETAGS":['SCRIPT','IFRAME','STYLE','NOSCRIPT','BR','BUTTON','INPUT','SELECT','OPTION','LABEL','FORM','COMMENT'],
    "SPECIALTAGS":['UL','OL'],
    "target" : 'text',//text, anchor, image
    "runtimeStamp": {
        "start": new Date().getTime(),
        "end": null
    }
}, appResults = {
    "denseTextBlocks" : [],//elem
    "denseAnchorBlocks" : [],//elem
    "denseImageBlocks" :[], //elem
    "clipContent" : null,//string
    "rightClipContent" : null,
    "mainContent" : null,
    "recall" : null,
    "percision" : null,
    "f1" : null
    };

function Utils(){}

Utils.prototype = {
    checkTagName : function (elem,array) {
        return array.indexOf(elem.tagName) === -1;
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
    checkVisibility : function (elem) {
        return !(this.css(elem, "visibility") == "hidden" || this.css(elem, "display") == "none" || parseInt(this.css(elem, "width")) <= 0);
    },
    filterElems: function (elemSet,type) {
        if(elemSet.length <= 1)
            return elemSet;
        var omit = [],retain = [];

        elemSet.forEach(function(elem){
            elem.dataset.flag = 'hello';
            elem.dataset.passed = 'no';
        });

        if(type === 'childs') {
            for(var i = 0; i < elemSet.length; i++){
                var parent = elemSet[i].parentElement || elemSet[i].parentNode;
                while(parent.tagName !== 'BODY'){
                    if(parent.dataset.flag === 'hello' && parent.dataset.passed === 'no'){
                        parent.dataset.passed = 'yes';
                        omit.push(parent);
                    }
                    else {
                        parent = parent.parentElement || parent.parentNode;
                    }
                }
            }
        }
        if(type === 'parents') {
            for(var j = 0; j < elemSet.length; j++){
                var parnt = elemSet[j].parentElement || elemSet[j].parentNode;
                while(parnt.tagName !== 'BODY'){
                    if(parnt.dataset.flag === 'hello'){
                        omit.push(elemSet[j]);
                        break;
                    }
                    else {
                        parnt = parnt.parentElement || parnt.parentNode;
                    }
                }
            }
        }

        retain = elemSet.filter(function (el) {
            return omit.indexOf(el) === -1;
        });

        return retain;
    },
    appendBorder: function (elems) {
        if (elems) {
            for (var i = 0; i < elems.length; i++) {
                if (!utils.checkTagName(elems[i], appParams.SPECIALTAGS)) {
                    elems[i] = elems[i].parentElement || elems[i].parentNode;
                }
                switch (elems[i].dataset.nodetype) {
                    case 'text' :
                        elems[i].style.cssText = 'box-shadow: 0 0 5px 5px #FF69B4';
                        //elems[i].style.cssText = 'opacity : 0';
                        break;
                    case 'anchor' :
                        elems[i].style.cssText = 'border: dashed 2px #87CEEB';
                        //elems[i].style.cssText = 'opacity : 0';
                        break;
                    case 'image' :
                        elems[i].style.cssText = 'border: dashed 2px #FF7F00';
                        //elems[i].style.cssText = 'opacity : 0';
                        break;
                }
            }
        }
    },
    extractContent: function (elems) {
        var text = '';
        for(var i = 0, len = elems.length; i < len; i++) {
            text += elems[i].innerText + '\n';
        }
        return text;
    }
}



function ContentClipper(){
    this.page = this._getContent(appParams.root);
    this.blockPool = [];
    this.validBlock = [];
    this.noiseBlock = [];
    this.statistic = {};
    this.traverse(appParams.root);
    this.calBlock(appParams.threshold);
}

ContentClipper.prototype = {
    _removeElem: function (elem) {
        var parent = elem.parentElement || elem.parentNode,
            children = document.getElementsByTagName(elem.tagName);
            for(var i = 0; i < children.length; i++){
                parent.removeChild(children[i]);
            }
    },
    _getContent: function(elem){
        var whole = elem.innerText.replace(/\s+/g,"");
        var anchors = elem.getElementsByTagName('a'),anchorsText = '';
        for(var i = 0, len = anchors.length; i < len; i++){
            anchorsText += anchors[i].innerText.replace(/\s+/g,"");
        }

        return {
            "text" : whole.length - anchorsText.length, //plain text
            "anchor" : {
                "num" : anchors.length,
                "text" : anchorsText.length
            },
            "image" : elem.getElementsByTagName('img').length
        };
    },
    traverse: function (elem) {
        if(elem && !!utils.checkTagName(elem,appParams.IGNORETAGS) && !! utils.checkVisibility(elem)){
            var data = {
                    'type': null,
                    'doc': 0,
                    'dos': null,
                    'elem': elem,
                    'children':[],
                    "content":{
                        "text" : 0,
                        "anchor" : {
                            "text" : 0,
                            "num" : 0
                        },
                        "image" : 0
                    }
                },
                plainText = 0,temp = {};

            if(!elem.firstElementChild ){
                return this.getContentType(elem);
            }
            for(var item = elem.firstChild;item;item = item.nextSibling) {
                if (item.nodeType === 3) {
                    plainText += item.textContent.replace(/\s+/g, "").length;
                }
                else if (item.nodeType === 1) {
                    if(item.tagName === 'A' && item.firstElementChild) {
                        data.children.push('anchor');
                        data.content.image += item.getElementsByTagName('img').length / this.page.image;
                        data.content.anchor.text += item.innerText.replace(/\s+/g,"").length / this.page.text;
                        data.content.anchor.num += 1 / this.page.anchor.num;
                    }
                    else {
                        temp = this.traverse(item);
                        if (temp) {
                            data.children.push(temp.type);
                            data.content.text += temp.text;
                            data.content.image += temp.image;
                            data.content.anchor.text += temp.anchor.text;
                            data.content.anchor.num  += temp.anchor.num;
                        }
                    }
                }
            }
            if(plainText > 0){
                data.children.push('text');
                data.content.text += plainText / this.page.text;
            }
            this.getNodeType(data);
            this.calcuDOC(data);

            this.blockPool.push(data);
            elem.dataset.nodetype = data.type;
            elem.dataset.text = data.content.text;
            elem.dataset.atxt = data.content.anchor.text;
            elem.dataset.anum = data.content.anchor.num;
            elem.dataset.img = data.content.image;
            elem.dataset.doc = data.doc;

            return {
                "type" :data.type,
                "text" :data.content.text,
                "anchor" : {
                    "text" : data.content.anchor.text,
                    "num" : data.content.anchor.num
                },
                "image" :data.content.image
            };
        }
        else {
            return {
                "type" : null,
                "text" : 0,
                "anchor" : {
                    "text" : 0,
                    "num" : 0
                },
                "image" : 0
            };
        }

    },
    calBlock: function () {
        this.statistic.page = {
            "totalBlocks":this.blockPool.length,
            "totalTextBlocks":0,
            "totalAnchorBlocks":0,
            "totalImageBlocks":0
        },
        this.statistic.stat = {
            "validBlocks":0,
            "validTextBlocks":0,
            "validAnchorBlocks":0,
            "validImageBlocks":0
        };
        for(var i = 0,len = this.blockPool.length; i < len; i++) {
            // text radio over threshold
            //var radio = this.blockPool[i].content.text;
            if(this.blockPool[i].doc > appParams.threshold){
                this.statistic.stat.validBlocks++;
                this.validBlock.push(this.blockPool[i]);

                switch(this.blockPool[i].type) {
                    case 'text' :
                        appResults.denseTextBlocks.push(this.blockPool[i].elem);
                        this.statistic.page.totalTextBlocks++;
                        this.statistic.stat.validTextBlocks++;
                        break;
                    case 'anchor':
                        appResults.denseAnchorBlocks.push(this.blockPool[i].elem);
                        this.statistic.page.totalAnchorBlocks++;
                        this.statistic.stat.validAnchorBlocks++;
                        break;
                    case 'image' :
                        appResults.denseImageBlocks.push(this.blockPool[i].elem);
                        this.statistic.page.totalImageBlocks++;
                        this.statistic.stat.validImageBlocks++;
                        break;
                }
            }
            else{
                switch(this.blockPool[i].type) {
                    case 'text' :
                        this.statistic.page.totalTextBlocks++;
                        break;
                    case 'anchor':
                        this.statistic.page.totalAnchorBlocks++;
                        break;
                    case 'image' :
                        this.statistic.page.totalImageBlocks++;
                        break;
                }
            }
        }
    },
    calcuDOC: function (data) {
        var children = data.children,
            type = data.type,
            count = 0,
            len = children.length;
        if(len > 0) {
            for(var i = 0; i < len; i++){
                if(children[i] === type){
                    count++;
                }
            }
            data.doc = count / len;
        }
        else {
            data.doc = 0;
        }
    },
    getNodeType: function (data) {
        var plain = data.content.text,
            aText = data.content.anchor.text,
            aNum = data.content.anchor.num,
            image = data.content.image,
            r = this.page.text / this.page.anchor.text, //text : anchortext
            s = this.page.anchor.num / this.page.image; //anchor : image;

        console.log('r',r);
        if(plain > aText * r && r > 1) {
            data.type = 'text';
        }
        else if(aText > plain || aNum > plain || aText > plain){
            data.type = 'anchor';
        }
        else {
            data.type =  'image';
        }
    },
    getContentType: function (elem) {
        var page = this.page,
            txt = elem.innerText.replace(/\s+/g,"").length;

        if(elem.tagName === 'IMG'){
            return {
                "type" :'image',
                "text" : 0,
                "anchor" : {
                    "text" : 0,
                    "num" : 0
                },
                "image": 1 / page.image
            }
        }
        if(elem.tagName === 'A'){
            return {
                "type" : "anchor",
                "text" : 0,
                "anchor" : {
                    "text" : txt / page.text,
                    "num" : 1 / page.anchor.num
                },
                "image" :0
            }
        }
            return {
                "type" : "text",
                "text" : txt / page.text,
                "anchor" : {
                    "text" : 0,
                    "num" : 0
                },
                "image" : 0
            }
    }

};


var utils = new Utils();
var app = new ContentClipper();

var result = {
    "elem":[],
    "resultContent": null,//string
    "mainContent": 0,//number
    "correctContent": 0,//number
    "recall":null,
    "percision":null,
    "f1":null
};

var getResultContent = function(){
    var goodElems = utils.filterElems(result.elem).retain,content = '';
    if(goodElems){
        goodElems.forEach(function (el) {
            el.style.cssText = 'box-shadow: 0 0 0 5px #FF1493';
            content += el.innerText + '\n';
        })
    }
    //console.log(goodElems);
    return content;
};

(function(){
    var childs,parents;
    parents = utils.filterElems(appResults.denseTextBlocks,'parents');
    childs = utils.filterElems(appResults.denseTextBlocks,'childs');

    // extract content
    console.log('parents',parents);
    appResults.clipContent = utils.extractContent(parents);
    console.log('clipContent : ',appResults.clipContent);


    utils.appendBorder(parents);
})(app);

var calF1Value = function () {
    if(result.mainContent && result.correctContent && result.resultContent){
        var resultContentLen = result.resultContent.replace(/\s+/g,"").length;
        result.recall = result.correctContent / result.mainContent;
        result.percision = result.correctContent / resultContentLen;
        result.f1 = 2 * result.percision * result.recall / (result.percision + result.recall);
        alert('Recall : ' + result.recall + '\n' + 'Percision : ' + result.percision + '\n' + 'F1 : ' + result.f1);
    }
    else if(resultContentLen === 0) {
        alert('Content Is Beyond Reach! Mission Failed.');
    }
    else if(!result.mainContent){
        alert('MainContent is Missing !');
    }
    else if(!result.correctContent){
        alert('CorrectContent is Missing !');
    }
};

var removeNoise = function () {
    var badElems = app.noiseBlock;
    badElems.forEach(function (elem) {
        elem.style.cssText = 'opacity : 0';
    })
};

var showMoreResults = function () {
    var runtime = appParams.runtimeStamp.end - appParams.runtimeStamp.start,
        /*pageContent Info*/
        allText = app.page.text + app.page.anchor.text,
        allImg = app.page.image,
        allAchr = app.page.anchor.num,
        /*Results*/
        content = result.resultContent === null ? getResultContent() : result.resultContent,
        recall   = result.recall,
        percision = result.percision,
        f1 = result.f1,
        /*Statistic*/
        totalBls = app.statistic.page.totalBlocks,
        totalTxtBls = app.statistic.page.totalTextBlocks,
        totalImgBls = app.statistic.page.totalImageBlocks,
        totalAchrBls = app.statistic.page.totalAnchorBlocks,
        validBls = app.statistic.stat.validBlocks,
        validTxtBls = app.statistic.stat.validTextBlocks,
        validImgBls = app.statistic.stat.validImageBlocks,
        validAchrBls = app.statistic.stat.validAnchorBlocks;
    alert(
        '------------------ Details ------------------\n'
        + 'Threshold : ' + appParams.threshold + '\n'
        + 'Runtime : ' + runtime + ' ms\n'
        + '---------------- Page Content -----------------\n'
        + 'AllTexts : ' + allText + '\n'
        + 'AllImages : ' + allImg + '\n'
        + 'AllAnchors : ' + allAchr + '\n'
        + '---------------- Block Statistics -----------------\n'
        + 'ValidBlocks / TotalBlocks : ' + validBls + ' / ' + totalBls + '  (r = ' + validBls / totalBls + ')\n'
        + 'ValidTextBlks / TotalTextBlks : ' + validTxtBls + ' / ' + totalTxtBls + '  (r = ' + validTxtBls / totalTxtBls + ')\n'
        + 'ValidImageBlks / TotalImgaeBlks : ' + validImgBls + ' / ' + totalImgBls + '  (r = ' + validImgBls / totalImgBls + ')\n'
        + 'ValidAnchorBlks / TotalAnchorBlks : ' + validAchrBls + ' / ' + totalAchrBls + '  (r = ' + validAchrBls / totalAchrBls + ')\n'
        + '---------------- Results -----------------\n'
        + 'Recall : ' + recall + '\n'
        + 'Percision : ' + percision + '\n'
        + 'F1 : ' + f1 + '\n'
        + 'Content : ' + content

    )

};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch (message.id) {
        case 'MainContent' :
            appResults.mainContent += message.text.replace(/\s+/g,"").length;
            if(appResults.mainContent > 0){
                sendResponse({"result":true,"id":"MainContent","content" : appResults.mainContent});
            }
            else {
                sendResponse({"result":false});
            }
            break;
        case 'CorrectContent' :
            appResults.rightClipContent += message.text.replace(/\s+/g,"").length;
            if(appResults.rightClipContent > 0) {
                sendResponse({"result":true,"id":"CorrectContent","content":appResults.rightClipContent});
            }
            else {
                sendResponse({"result":false});
            }
            break;
        case 'CalculateF1' :
            calF1Value();
            sendResponse({"result":true,"id":"reset"});
            break;
        case 'ResultContent' :
            alert('---------------- Result Content -----------------\n'
            + getResultContent());
            break;
        case 'RemoveNoise' :
            removeNoise();
            break;
        case 'MoreResults' :
            showMoreResults();
    }
});

appParams.runtimeStamp.end = new Date().getTime();



















