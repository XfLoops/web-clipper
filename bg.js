window.onmessage = function (e) {
    var page = document.getElementById('page-content');
    page.innerHTML = e.data;
};