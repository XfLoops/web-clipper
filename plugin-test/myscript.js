function executeMailto(tab_id,subject,body,selection) {
    var default_handler = customMailtoUrl().length == 0;
    var action_url = 'mailto:?';
    if(subject.length > 0)
        action_url += 'subject=' + encodeURIComponent(subject) + '&';

    if(body.length > 0) {
        action_url += 'body' + encodeURIComponent(body);

        if (selection.length > 0) {
            action_url += encodeURIComponent('\n\n') + encodeURIComponent(selection);
        }
    }

    if(!default_handler) {
        var custom_url = customMailtoUrl();

    }
}

chrome.browserAction.onClicked.addListener(function (tab) {
    if(tab.url.indexOf('http:') != 0 && tab.url.indexOf('https:') != 0) {
        excuteMailto(tab.id,'',tab.url,'');
    }
    else {
        chrome.tabs.execteScript(null,{file:'content_script.js'});
    }
});