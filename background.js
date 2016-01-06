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
        pageInfo.url = e.data.url, pageInfo.origin = e.origin, pageInfo.html = e.data.html,
        pageInfo.title = e.data.title, pageInfo.text = e.data.text;
        $('#page-origin').html('来源： <a href="'+ pageInfo.url +'">'+ pageInfo.origin.replace(/http(s)?:\/\//,'') +'</a>');


        $('#page-content').html(pageInfo.html);
    };

    // 退出
    $('#exit').click(function () {
        win.postMessage('exit',pageInfo.origin);
    });
    //默认
    $('#default-view').click(function () {
       $('#page-content').removeAttr('contenteditable').removeClass('editable');
       $('#sub-body').css({'background-color':'#f4f4f6'});
       $('#sub-body').animate({scrollTop:'0px'},'500ms');

    });
    //字体
    $('#font-tool').click(function () {
        $('#font-dropdown-arrow').toggleClass('visable');
        $('#font-tooltip').toggleClass('visable');
    });
    // 字体类型
    $('.font-type').click(function () {
    });
    // 字体大小
    $('.font-color').click(function () {
        $('.font-color').each(function () {
            if($(this).hasClass('selected')){
                $(this).removeClass('selected');
            }
        });
        $(this).addClass('selected');
    });
    //编辑
    $('#edit').click(function () {
        $('#page-content').attr('contenteditable',true).addClass('editable');
        $('#sub-body').css({'background-color':'#808080'});
    });
    //顶部
    $('#back-to-top').click(function () {
        $('#sub-body').animate({scrollTop:'0px'},'500ms');
    });
});
