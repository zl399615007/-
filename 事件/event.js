
    function on(ele, type, fn) {
        if(/^self/.test(type)){
            if(!ele["aself"+type]) ele["aself"+type]=[];
            var a=ele["aself"+type];
            for(var i=0;i< a.length;i++){
                if(a[i]==fn)return;
            }
            a.push(fn);
            return;
        }

        if (ele.addEventListener) {
            ele.addEventListener(type, fn, false);
            return;
        }
        if (!ele["aEvent" + type]) {
            ele["aEvent" + type] = [];
            ele.attachEvent("on" + type, function () {
                run.call(ele)
            })
        }
        var a = ele["aEvent" + type];
        for (var i = 0; i < a.length; i++) {
            if (a[i] == fn)return;
        }
        a.push(fn);
    }

function run() {
    var e = window.event;
    var type = e.type;
    if(!e.target){
        e.target= e.srcElement;
        e.preventDefault=function(){e.returnValue=false;};
        e.stopPropagation=function(){e.cancelBubble=true;};
        e.pageX= (document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
    }
    var a = this["aEvent" + type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (typeof a[i] == "function") {
                a[i].call(this, e);//为了和标准浏览器的事件对象取得方式保持一致
            } else {
                a.splice(i, 1);
                i--;
            }
        }
    }
}

function off(ele, type, fn) {
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
        return;
    }
    var a = ele["aEvent" + type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == fn) {
                a[i] = null;
                return;
            }
        }
    }
};

    function processThis(fn,obj){//返回一个新的方法，使fn的功能不变，但fn运行时this指向obj
                    return function(e){fn.call(obj,e)}
                }
//selfType是自定义的事件类型，e是系统的事件对象
function selfRun(selfType,e){
    var a=this["aself"+selfType];
    if(a){
        for(var i=0;i< a.length;i++){
            a[i].call(this,e);
        }
    }
}
    var zIndex=1;
    function increaseIndex(){
        this.style.zIndex=++zIndex;
    }