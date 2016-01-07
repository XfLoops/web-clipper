$(document).ready(function() {
    // parent window
    var win = window.parent;
    // global data
    var pageInfo = {
        url:null,
        title:null,
        origin:null,
        html:null,
        text:null
    };
    //
    window.onmessage = function (e) {
        if(e.data.name === 'page') {
            pageInfo.url = e.data.url, pageInfo.origin = e.origin, pageInfo.html = e.data.html,
                pageInfo.title = e.data.title, pageInfo.text = e.data.text;
            $('#page-origin').html('来源： <a href="'+ pageInfo.url +'" target="_blank">'+ pageInfo.origin.replace(/http(s)?:\/\//,'') +'</a>');
            $('#page-content').html(pageInfo.html);
        }
        if(e.data.name === 'pdf') {
            var html = '<html><body><embed width="100%" height="100%" src="'+ e.data.content +'" type="application/pdf"></body></html>';
            var win = window.open('','_blank');
            win.document.open('text/html','replace');
            win.document.write(html);
            win.document.close();
        }
    };

    // 退出
    $('#exit').click(function () {
        $('#sub-body').animate({'opacity':0},'50ms');
        win.postMessage('exit',pageInfo.origin);
    });
    //默认
    $('#default-view').click(function () {
       $('#page-content').removeAttr('contenteditable').removeClass('editable');
        var body = $('#sub-body');
        body.removeClass().addClass('light-color-selected');
        body.animate({scrollTop:'0px'},'500ms');

    });
    //字体
    // @todo 当点击其他地方式弹出框自动隐藏
    $('#font-tool').click(function () {
        $('#font-dropdown-arrow').toggleClass('visable');
        $('#font-tooltip').toggleClass('visable');
    });
    // 字体类型
    $('.font-type').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var content = $('#page-content');
        if($(this).attr('id') === 'font-type-one'){
            if(content.hasClass('bold')){
                content.removeClass('bold');
            }
            content.addClass('light');
        }
        if($(this).attr('id') === 'font-type-two'){
            if(content.hasClass('light')){
                content.removeClass('light');
            }
            content.addClass('bold');
        }

    });
    //字体大小
    var fontSizeFlag = 3;
    $('.font-size').click(function(){
        var container = $('#container');
        if($(this).attr('id') === 'font-shrink') {
            if(fontSizeFlag === 1) {
                fontSizeFlag = 1;
            }
            else {
                --fontSizeFlag;
            }
        }
        if($(this).attr('id') === 'font-amplify') {
            if(fontSizeFlag === 5) {
                fontSizeFlag = 5
            }
            else {
                ++fontSizeFlag;
            }
        }
        container.removeClass().addClass('font-size' + fontSizeFlag);
    });
    // 字体颜色
    $('.font-color').click(function () {
        $('.font-color').each(function () {
            if($(this).hasClass('selected')){
                $(this).removeClass('selected');
            }
        });
        $(this).addClass('selected');
        var body = $('#sub-body');
        switch($(this).attr('id')) {
            case 'color-one' :
                body.removeClass().addClass('light-color-selected');
                break;
            case 'color-two' :
                body.removeClass().addClass('dark-color-selected');
                break;
            case 'color-three' :
                body.removeClass().addClass('sepia-color-selected');
                break;
        }


    });
    //编辑
    $('#edit').click(function () {
        $('#page-content').attr('contenteditable',true).addClass('editable');
        $('#sub-body').removeClass().addClass('dark-color-selected');
    });

    // 保存
    $('#save-to-locale').click(function () {
        $('.save-to-locale-box').css({"right":"1em"});
        $('#page-content').attr('contenteditable',true).addClass('editable');
    });
    // 下载
    $('#save-to-locale-btn').click(function () {
        win.postMessage('download',pageInfo.origin);
    });

    //顶部
    $('#back-to-top').click(function () {
        $('#sub-body').animate({scrollTop:'0px'},'500ms');
    });
});
