var origin = null;

window.onmessage = function (e) {
    var page = document.getElementById('page-content');
    page.innerHTML = e.data;
    origin = e.origin;

};
document.getElementById('close-btn').addEventListener('click', function () {
    var win  = window.parent;
    win.postMessage('close-page',origin);
});