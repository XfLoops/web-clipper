function onClickHandler(info, tab) {
    var message = {
        "id": info.menuItemId,
        "text": info.selectionText
    };
    chrome.tabs.sendMessage(tab.id, message, function (response) {
        if (response.result) {
            switch (response.id) {
            case 'MainContent':
                chrome.contextMenus.update(response.id, {
                    "title": 'Step 1. ' + response.id + ' is Ready !'
                });
                alert('Step 1. ' + response.id + ' is Ready ! ' + response.content + ' words.');
                break;
            case 'CorrectContent':
                chrome.contextMenus.update(response.id, {
                    "title": 'Step 2. ' + response.id + ' is Ready !'
                });
                alert('Step 2. ' + response.id + ' is Ready ! ' + response.content + ' words.');
                break;
            case 'reset':
                chrome.contextMenus.update('MainContent', {
                    "title": 'Step 1. Select MainContent'
                });
                chrome.contextMenus.update('CorrectContent', {
                    "title": 'Step 2. Select CorrectContent'
                });
                break;
            }
        } else {
            alert('Failed...Please Try Again.');
        }
    });
}

//// Create a parent item and two children.
var parent = chrome.contextMenus.create({
    "title": "Content Evaluation",
    "contexts": ["page", "selection"]
});
chrome.contextMenus.create({
    "title": "Step 1. Select MainContent",
    "id": "MainContent",
    "parentId": parent,
    "contexts": ["page", "selection"],
    "onclick": onClickHandler
});
chrome.contextMenus.create({
    "type": "separator",
    "parentId": parent,
    "contexts": ["page", "selection"]
});
chrome.contextMenus.create({
    "title": "Step 2. Select CorrectContent",
    "id": "CorrectContent",
    "parentId": parent,
    "contexts": ["page", "selection"],
    "onclick": onClickHandler
});
chrome.contextMenus.create({
    "type": "separator",
    "parentId": parent,
    "contexts": ["page", "selection"]
});
chrome.contextMenus.create({
    "title": "Step 3. Calculate F1",
    "id": "CalculateF1",
    "parentId": parent,
    "contexts": ["page", "selection"],
    "onclick": onClickHandler
});
chrome.contextMenus.create({
    "type": "separator",
    "parentId": parent,
    "contexts": ["page", "selection"]
});
chrome.contextMenus.create({
    "title": "Show ClipContent",
    "id": "ClipContent",
    "parentId": parent,
    "contexts": ["page", "selection"],
    "onclick": onClickHandler
});
chrome.contextMenus.create({
    "type": "separator",
    "parentId": parent,
    "contexts": ["page", "selection"]
});
chrome.contextMenus.create({
    "title": "Add Remark",
    "id": "AddRemarks",
    "parentId": parent,
    "contexts": ["page", "selection"],
    "onclick": onClickHandler
});
chrome.contextMenus.create({
    "type": "separator",
    "parentId": parent,
    "contexts": ["page", "selection"]
});
chrome.contextMenus.create({
    "title": "Remove Noise",
    "id": "RemoveNoise",
    "parentId": parent,
    "contexts": ["page", "selection"],
    "onclick": onClickHandler
});
chrome.contextMenus.create({
    "type": "separator",
    "parentId": parent,
    "contexts": ["page", "selection"]
});
chrome.contextMenus.create({
    "title": "Replace ClipContent",
    "id": "ReplaceContent",
    "parentId": parent,
    "contexts": ["page", "selection"],
    "onclick": onClickHandler
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript({
        file: "clipper.js"
    });
});
