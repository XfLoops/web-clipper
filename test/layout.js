var body = document.getElementsByTagName('body')[0];
var children = [],child = body.firstElementChild;
var IGNORETAGS = ['SCRIPT','IFRAME','STYLE','NOSCRIPT'];

//console.log('body content',body.innerText);


while(child){
    children.push(child);
    child = child.nextElementSibling;
}
/* check tag name */
var elems = children.filter(function(elem){
    return IGNORETAGS.indexOf(elem.nodeName) === -1;
});

/* get height, width */
var getOffset = function(elem){
    var offset = {
        x: 0,
        y: 0
    };
    offset.x = elem.scrollWidth;
    offset.y = elem.scrollHeight;
    return offset
}

var analyzeLinks = function(elem){
    var text = elem.innerText.replace(/\s/g,"");
    var links = elem.getElementsByTagName('a'),anchor = "";
    console.log(links);

    for(var i = 0; i < links.length; i++){
        anchor += links[i].innerText;
    }
    if(text.length === 0){
        return 1;
    }
    else{
        return anchor.length / text.length;
    }
};

var calTextDensity = function(elem){
    var text = elem.innerText.replace(/\s/g,"");
    var allElem = elem.getElementsByTagName("*");

    if(allElem.length === 0){
        return 1;
    }
    else{
        return text.length / allElem.length;
    }
};

/* add border */
elems.forEach(function(elem,index){
    //var linkRate = analyzeLinks(elem);
    var linkRate = calTextDensity(elem);
    var pos = getOffset(elem);
    var span = document.createElement('span');
    var text = document.createTextNode(index + ':' + elem.nodeName + ' ' + pos.x + ' x ' + pos.y + ' Rate: ' + linkRate);
    span.appendChild(text);
    span.style.cssText = 'position:absolute;right:0;top:0;color:#FE2763;z-index:9999999;font-weight:bold;';
    elem.style.cssText = 'box-shadow:0 0 0 2px #FE2763; position:relative';
    elem.appendChild(span);
});

/* select text */

//document.onmouseup = function (event) {
//    var num = event.button;
//    var text = window.getSelection();
//    if(num === 2){
//        event.preventDefault();
//        alert(text);
//    }
//}



