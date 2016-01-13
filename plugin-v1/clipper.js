var appParams = {
	"threshold" : 0.9,
	"root" : document.getElementsByTagName('body')[0],
	"INIT" : ['SCRIPT','IFRAME','STYLE','NOSCRIPT','BUTTON','INPUT','LABEL','COMMENT','MAP','AREA','INS'],
	"IGNORETAGS":['SCRIPT','IFRAME','STYLE','NOSCRIPT','BR','BUTTON','INPUT','SELECT','OPTION','LABEL','FORM','COMMENT','MAP','AREA'],
	"SPECIALTAGS":['UL','OL'],
	"BLOCKTAGS":['DIV','UL','LI','H1','H2','H3','H4','H5','H6'],
	"BREAKTAGS":['BR'],
	"types" : ['text','anchor','image','ignore'],
	"runtimeStamp": {
		"start": new Date().getTime(),
		"end": null
	}
}, appResults = {
	"denseTextBlocks" : [],//elem
	"denseAnchorBlocks" : [],//elem
	"denseImageBlocks" :[], //elem
	"clipContent" : null,//array of text
	"rightClipContent" : null,
	"mainContent" : null,
	"displayHtml" :null,
	"recall" : null,
	"percision" : null,
	"f1" : null,
	"remark" : null,
	"title":null
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
		return !(this.css(elem, "visibility") == "hidden" || this.css(elem, "display") == "none" || this.css(elem, "position") == "fixed" || parseInt(this.css(elem, "width")) <= 0);
	},
	filterElems: function (elemSet,type) {
		if(elemSet.length <= 1)
			return elemSet[0];

		if(type === 'none') {
			return elemSet[1];
		}

		var omit = [],retain = [];
		elemSet.forEach(function(elem){
			elem.dataset.flag = 'hello';
			elem.dataset.passed = 'no';
		});

		if(type === 'childs') {
			for(var i = 0; i < elemSet.length; i++){
				var parent = elemSet[i].parentElement || elemSet[i].parentNode;
				while(parent.tagName){
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
	appendMarker: function (elems) {
		if (elems) {
			for (var i = 0; i < elems.length; i++) {
				elems[i].style.cssText = 'color : red !important';

				/*add border*/
				//if (!utils.checkTagName(elems[i], appParams.SPECIALTAGS)) {
				//    elems[i] = elems[i].parentElement || elems[i].parentNode;
				//}
				//switch (elems[i].dataset.nodetype) {
				//    case 'text' :
				//        elems[i].style.cssText = 'box-shadow: 0 0 5px 5px #FF69B4';
				//        //elems[i].style.cssText = 'opacity : 0';
				//        break;
				//    case 'anchor' :
				//        elems[i].style.cssText = 'border: dashed 2px #87CEEB';
				//        //elems[i].style.cssText = 'opacity : 0';
				//        break;
				//    case 'image' :
				//        elems[i].style.cssText = 'border: dashed 2px #FF7F00';
				//        //elems[i].style.cssText = 'opacity : 0';
				//        break;
				//}
			}
		}
	},
	extractImage: function (elem) {
		if(elem.tagName === 'IMG') {
			if(elem.width < 100) return;
			return '<p><img src = "'+ elem.src +'"></p>';
		}
		var images = elem.getElementsByTagName('img'),content = '';
		if(images.length > 0) {
			for(var i = 0, len = images.length; i < len ; i++){
				//check width
				if(images[i].width < 100) continue;
				//check src is unbroken
				if(images[i].src.search(/http(s)?|ftp/g) == -1) {
					console.log('broken image src: ',image[i].src);
					continue;
				}
				content += '<p><img src = "'+ images[i].src +'"></p>';
				///console.log('img:',images[i].src);
			}
		}
		return content;
	},
	extractContent: function (elem) {
		var content = '';
		if(elem) {
			if (elem.dataset.subdoc > appParams.threshold && elem.dataset.nodetype === 'text') {
				if(appParams.BLOCKTAGS.indexOf(elem.tagName) > -1) {
					content += '<div>' + elem.innerHTML + '</div>';
				}
				else {
					content += '<'+ elem.tagName +'>' + elem.innerHTML + '</' + elem.tagName + '>';
				}
			}
			else {
				for (var el = elem.firstElementChild; el; el = el.nextElementSibling) {
					if (el.tagName === 'A' && !el.firstElementChild) {
						var sibling = el.previousElementSibling;
						if(!sibling) {
							sibling = el.nextElementSibling;
						}
						if(sibling && sibling.dataset.nodetype === 'text') {
							var href = el.getAttribute('href');
							content += '<a href="'+ href +'">'+ el.innerText +'</a>';
						}
					}
					if (el.dataset.nodetype === 'text') {
						if (el.dataset.subdoc > appParams.threshold) {
							var pre = el.previousElementSibling;
							if(appParams.BLOCKTAGS.indexOf(el.tagName) > -1) {
								content += '<div>' + el.innerHTML + '</div>';
							}
							else if(pre && appParams.BREAKTAGS.indexOf(pre.tagName) > -1) {
								content += '<'+ el.tagName +'>' + el.innerHTML + '</' + el.tagName + '><br>';
							}
							else {
								content += '<'+ el.tagName +'>' + el.innerHTML + '</' + el.tagName + '>';
							}
						}
						else {
							content += '<div>' + this.extractContent(el) + '</div>';
						}
					}
					if (el.dataset.nodetype === 'image' || el.tagName === 'IMG') {
						content += this.extractImage(el);
					}
				}

			}
		}
		return content;
	},
	displayContent: function (html) {

        var iframe = document.createElement('iframe');
        var htmlsrc = chrome.extension.getURL('background.html');
		var message = {
			name: 'page',
			url: window.location.href,
			title:appResults.title,
			html:html,
			text: null
		};

		//console.log('html: ',html);
		// append iframe
        iframe.setAttribute('src',htmlsrc);
        iframe.setAttribute('id','page-content-iframe');

		document.body.className = 'clearVisible';
        document.body.appendChild(iframe);
        //通信
		iframe.onload = function () {
            iframe.contentWindow.postMessage(message,htmlsrc);
			//监听iframe中的消息
			window.onmessage = function (e) {
				//退出
				if(e.data == 'exit') {
					iframe.style.width = 0;
					document.body.className = ''
				}
				//下载
				if(e.data == 'download') {
					var port = chrome.runtime.connect({name:'download'});
					port.postMessage({message:html});
					port.onMessage.addListener(function(msg){
						iframe.contentWindow.postMessage({name:'pdf',content:msg.data},htmlsrc);
					});
				}
				if(e.data.type === 'keywords') {
					var text = e.data.text;
					var port2 = chrome.runtime.connect({name:'keywords'});
					port2.postMessage({text:text});
					port2.onMessage.addListener(function (msg) {
						console.log('keywords feedback:',msg.data);
						//iframe.contentWindow.postMessage({},htmlsrc);
					});
				}
			};
		};
	},
	clearPage: function (elem) {
		if(elem.parentNode) {
			var parent = elem.parentNode;
		}
		if(elem.nodeType === 3) {
			var span = document.createElement('span');
			var spanTxt = document.createTextNode(elem.textContent);
			span.dataset.subdoc = 1;
			span.appendChild(spanTxt);
			parent.insertBefore(span,elem);
			parent.removeChild(elem);
		}
		if(elem.nodeType === 1) {
			if(this.checkTagName(elem,appParams.INIT) && this.checkVisibility(elem)){
				if(!elem.firstElementChild) {
					return;
				}
				var children = [];
				for(var child = elem.firstChild;child;child = child.nextSibling) {
					if(child.nodeType === 3) {
						var l = child.textContent.replace(/\s+/g,'').length;
						if(l > 0) {
							children.push(child);
						}
					}
					if(child.nodeType === 1) {
						children.push(child);
					}
				}

				if(children.length > 0) {
					for(var i = 0; i < children.length;i++) {
						this.clearPage(children[i]);
					}
				}
			}
			else {
				parent.removeChild(elem);
			}
		}
	},
	convertArr: function(arr,seperator) {
		var resultArr = '';
		for(var i = 0; i < arr.length; i++) {
			if(typeof arr[i] === 'object') {
				resultArr += this.convertArr(arr[i],seperator) + seperator;
			}
			else {
				resultArr += arr[i] + seperator;
			}
		}
		return resultArr;
	},
	refineContent: function (contentStr) {
		//console.log('contentStr:',contentStr);
		// get a small part of string to handle
		try {
			var part = contentStr.substr(0,150);
			console.log('part:',part);
			//match the first closed tag
			//todo SOMETIMES IT DOES NOT WORK
			var pattern = /<(\w+)(\s[\w="_-]+)*>[^<].*?[^>]<\/\1>/;
			var titlepart = part.match(pattern);
			console.log('titlepart: ',titlepart);

			//get page title from title tag
			var title = document.getElementsByTagName('TITLE')[0].innerText;
			var title2 = title.split(/-|\||_/)[0];
			var realTitle = title2.replace(/\s+/g,'');
			appResults.title = title;
			console.log('real title:',realTitle,'title length:',realTitle.length);

			if(titlepart) {
				//get title from title part
				var resultTitle = titlepart[0].replace(/(<(\w+)(\s[\w="_-]+)*>)|\s+|(<\/\w+>)/g,'');
				console.log('resultTitle:',resultTitle,'result title length:',resultTitle.length);

				// check if title is ok
				if(resultTitle != realTitle) {
					contentStr = '<h2 class="content-title">' + title2 + '</h2>' + contentStr;
				}
				else {
					// title is exsit,but need to change to h2 tag
					var newtitle = '<h2 class="content-title">' + title2 + '</h2>';
					contentStr = contentStr.replace(titlepart[0],newtitle);
				}
			}
			else {
				contentStr = '<h2 class="content-title">' + title2 + '</h2>' + contentStr;
			}
			return contentStr;
		}
		catch (e) {
			return contentStr;
		}
	}
};

function ContentClipper(){
	this.page = this._getContent(appParams.root);
	this.blockPool = [];
	this.traverse(appParams.root);
	//this.calBlock(appParams.threshold);
}

ContentClipper.prototype = {
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
		if(elem && utils.checkTagName(elem,appParams.IGNORETAGS) && !! utils.checkVisibility(elem)){
			var data = {
					'type': null,
					'doc': 0,
					'subdoc': 0,
					'dos': null,
					'elem': elem,
					'children':[],
					"subtypes":[0,0,0,0],//text anchor image ignore
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
			for(var item = elem.firstElementChild;item;item = item.nextElementSibling) {
					if(item.tagName === 'A' && item.firstElementChild) {
						data.children.push('anchor');
						data.subtypes[1]++;
						data.content.image += item.getElementsByTagName('img').length / this.page.image;
						data.content.anchor.text += item.innerText.replace(/\s+/g,"").length / this.page.text;
						data.content.anchor.num += 1 / this.page.anchor.num;
					}
					else {
						temp = this.traverse(item);
						if (temp) {
							data.children.push(temp.type);
							data.subtypes[0] += temp.subtypes[0];
							data.subtypes[1] += temp.subtypes[1];
							data.subtypes[2] += temp.subtypes[2];
							data.subtypes[3] += temp.subtypes[3];
							data.content.text += temp.text;
							data.content.image += temp.image;
							data.content.anchor.text += temp.anchor.text;
							data.content.anchor.num  += temp.anchor.num;
						}
				}
			}
			if(plainText > 10){
				data.children.push('text');
				data.subtypes[0]++;
				data.content.text += plainText / this.page.text;
			}

			data.type = this.getNodeType(data);
			data.doc = this.calcuDOC(data);
			this.blockPool.push(data);

			elem.dataset.nodetype = data.type;
			elem.dataset.doc = data.doc;
			elem.dataset.text = data.content.text;

			elem.dataset.subdoc = data.subtypes[0] / (data.subtypes[0] + data.subtypes[1] + data.subtypes[2] + data.subtypes[3]);

			elem.dataset.child = data.children.length;
			elem.dataset.subtype = data.subtypes;
			//elem.dataset.r = data.content.text / data.subtypes[0];
			elem.dataset.anum = data.content.anchor.num / data.subtypes[1];

			if(data.content.text > appParams.threshold){
				appResults.denseTextBlocks.push(data.elem);
			}

			return {
				"type" :data.type,
				"subtypes" : data.subtypes,
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
				"type" : 'ignore',
				"subtypes" : [0,0,0,1],
				"text" : 0,
				"anchor" : {
					"text" : 0,
					"num" : 0
				},
				"image" : 0
			};
		}

	},
	calcuDOC: function (data) {
		var children = data.children,
			len = children.length,
			type = data.type,
			counter = [0,0,0,0],
			types = ['text','anchor','image','ignore'],
			idx = types.indexOf(type);
		if(len === 1){
			return 1;
		}
		if(type === 'ignore'){
			return 0;
		}
		if(len > 1) {
			for(var i = 0; i < len; i++) {
				switch (children[i]) {
					case 'text' :
						counter[0]++;
						break;
					case 'anchor' :
						counter[1]++;
						break;
					case 'image' :
						counter[2]++;
						break;
					case 'ignore' :
						counter[3]++;
						break;

				}
			}
			if(type === 'image') {
				return counter[2] / (len - counter[3]);
			}
			// (image + type) / (len - ignore)
			return (counter[idx] + counter[2]) / (len - counter[3]);
		}
	},
	getNodeType: function (data) {
		var children = data.children,
			len = children.length,
			text = data.content.text,
			aText = data.content.anchor.text,
			r = this.page.text / this.page.anchor.text,
			anchor = data.content.anchor.num,
			subtype = data.subtypes,
			counter = [0, 0, 0, 0];
		for (var i = 0; i < len; i++) {
			switch (children[i]) {
				case 'text' :
					counter[0]++;
					break;
				case 'anchor' :
					counter[1]++;
					break;
				case 'image' :
					counter[2]++;
					break;
				case 'ignore' :
					counter[3]++;
					break;

			}
		}
		if (counter[3] === len) {
			return 'ignore';
		}
		else {
			if (counter[0] === 0 && counter[1] === 0) {
				return 'image';
			}
			else {
				if(aText * r > text){
					if(text > 0.5) {
						return 'text';
					}
					else {
						return 'anchor';
					}
				}
				return text > anchor ? 'text' : 'anchor';
			}
		}
	},
	getContentType: function (elem) {
		var page = this.page,
			txt = elem.innerText.replace(/\s+/g,"").length;

		if(elem.tagName === 'IMG'){
			return {
				"type" :'image',
				"subtypes" :[0,0,1,0],
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
				"subtypes" :[0,1,0,0],
				"text" : 0,
				"anchor" : {
					"text" : txt / page.text,
					"num" : 1 / page.anchor.num
				},
				"image" :0
			}
		}
		if(txt > 0) {
			elem.dataset.nodetype = 'text';
			elem.dataset.subdoc = 1;
			return {
				"type" : "text",
				"subtypes" :[1,0,0,0],
				"text" : txt / page.text,
				"anchor" : {
					"text" : 0,
					"num" : 0
				},
				"image" : 0
			}
		}

		return {
			"type" : "ignore",
			"subtypes" :[0,0,0,1],
			"text" : 0,
			"anchor" : {
				"text" : 0,
				"num" : 0
			},
			"image" : 0
		}

	},
	calBlock: function () {
		for(var i = 0,len = this.blockPool.length; i < len; i++) {
			if(this.blockPool[i].doc > appParams.threshold) {
				switch(this.blockPool[i].type) {
					case 'text' :
						appResults.denseTextBlocks.push(this.blockPool[i].elem);
						break;
					case 'anchor':
						appResults.denseAnchorBlocks.push(this.blockPool[i].elem);
						break;
					case 'image' :
						appResults.denseImageBlocks.push(this.blockPool[i].elem);
						break;
				}
			}
		}
	}
};

var utils,app;

var calF1Value = function () {
	var resultContentLen = appResults.clipContent.join('').replace(/\s+/g,"").length,
		url = document.location.href;
	appResults.recall = appResults.rightClipContent / appResults.mainContent;
	appResults.percision = appResults.rightClipContent / resultContentLen;

	appResults.f1 = 2 * appResults.percision * appResults.recall / (appResults.percision + appResults.recall);
	console.log('url,recall,percision,f1,remarks,', url + ' , ' + appResults.recall + ' , ' + appResults.percision + ' , ' + appResults.f1 + ' , ' + appResults.remark);
};

var removeNoise = function () {
	var body = document.getElementsByTagName('body')[0];
	var child = body.firstElementChild;
	while (child) {
		switch (child.dataset.nodetype) {
			case 'text' :
				child = child.firstElementChild;
				break;
			case 'anchor' :
				child.style.cssText = 'opacity : 0';
				child = child.nextElementSibling;
				break;
			case 'image' :
				child = child.nextElementSibling;
				break;
			case 'ignore' :
				child.style.cssText = 'opacity : 0';
				child = child.nextElementSibling;
				break;
			default :
				child.style.cssText = 'opacity : 0';
				child = child.nextElementSibling;
		}
	}
};

var showMoreResults = function () {
	var runtime = appParams.runtimeStamp.end - appParams.runtimeStamp.start,
		content = appResults.clipContent,
		recall   = appResults.recall,
		percision = appResults.percision,
		f1 = appResults.f1;

	alert(
		'------------------ Details ------------------\n'
		+ 'Threshold : ' + appParams.threshold + '\n'
		+ 'Runtime : ' + runtime + ' ms\n'
		+ 'Recall : ' + recall + '\n'
		+ 'Percision : ' + percision + '\n'
		+ 'F1 : ' + f1 + '\n'
		+ 'Content : ' + content

	)
};

(function(){
	// init tools
	utils = new Utils();
	utils.clearPage(appParams.root,0);
	app = new ContentClipper();

	var textBlocks = appResults.denseTextBlocks,
		targetElem =  utils.filterElems(textBlocks,'none');
    var contentStr = utils.extractContent(targetElem);
	var content = utils.refineContent(contentStr);
	//console.log('targetElem: ',targetElem);
	//console.log('content:',content);

	appResults.displayHtml = content;
	utils.displayContent(content);
})(utils,app);

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
			showMoreResults();
			sendResponse({"result":true,"id":"reset"});
			break;
		case 'ClipContent' :
			utils.displayContent(appResults.clipContent);
			break;
		case 'AddRemarks' :
			appResults.remark = prompt('Add Remarks','');
			break;
		case 'RemoveNoise' :
			removeNoise();
			break;
		case 'ReplaceContent' :
			appResults.clipContent = [];
			appResults.clipContent.push(message.text.replace(/\s+/g,""));
			alert('The ClipContent has been replaced!')
			break;
	}
});

appParams.runtimeStamp.end = new Date().getTime();














