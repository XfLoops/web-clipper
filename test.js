(function () {
    var win = window.parent;
    console.log('win: ',win);
    var page = document.getElementById('page-content');
    page.innerHTML = win.text;
})();