var oTab=document.getElementById("tab");
var tHead=oTab.tHead;
var tBody=oTab.tBodies[0];
var tHs=tHead.rows[0].cells;
var oRows=tBody.rows;
var data=null;
var xhr=new XMLHttpRequest;
xhr.open("get","data.txt",false);
xhr.onreadystatechange=function(){
    if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
        var val=xhr.responseText;
        data=utils.JSONparse(val);
    }
};
xhr.send(null);
function bind(){
    var frg=document.createDocumentFragment();
    for(var i=0;i<data.length;i++){
        var cur=data[i];
        var tr=document.createElement("tr");
        for(var key in cur){
            var td=document.createElement("td");
            td.innerHTML=key==="sex"?(cur[key]==1?"男":"女"):cur[key];
            tr.appendChild(td);
        }
        frg.appendChild(tr);
    }
    tBody.appendChild(frg);
    frg=null;
}
bind();
function changeBg(){
    for(var i=0;i<oRows.length;i++){
        oRows[i].className=i%2===1?"bg":null;
    }
};
changeBg();
function sort(n,key){
    for(var i=0;i<tHs.length;i++){
        if(tHs[i]!==key){
            tHs[i].flag=-1;
        }
    }
    tHs[n].flag*=-1;
    var ary=utils.likeArray(oRows);
    ary.sort(function(a,b){
        var inn= a.cells[n].innerHTML,nex= b.cells[n].innerHTML;
        if(isNaN(inn)||isNaN(nex)){
            return key.flag*(inn.localeCompare(nex));
        }return key.flag*(inn-nex);
    })
    var frg=document.createDocumentFragment();
    for(var i=0;i<ary.length;i++){
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg=null;
    changeBg();
}

for(var i=0;i<tHs.length;i++){
    tHs[i].flag=-1;
    ~(function(i){
        tHs[i].onclick=function(){
            return sort(i,this);
        }
    }(i))
}






































