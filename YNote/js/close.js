 function closeFrame(){
    var parent_url = document.getElementById('src').value;
    croDomain.postMessage('close',parent_url);
    return false;
 }
document.getElementById('close').onclick = closeFrame;
var cancelbtn = document.getElementById('cancelbtn');
if (cancelbtn) {
    cancelbtn.onclick = closeFrame;
}