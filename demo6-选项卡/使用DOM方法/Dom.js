var Dom={};
  Dom.getElesByClass=function getElesByClass(str,context) {
      context=context||document;

      //if(document.getElementsByClassName){
      //    return context.getElementsByClassName(str);
      //}

        str = str.replace(/^ +| +$/g, "");
        var aClassName = str.split(/ +/);
        var eles = context.getElementsByTagName("*");
        for (var i = 0; i < aClassName.length; i++) {
            var a = [];
            var reg = new RegExp("(?:^| )" + aClassName[i] + "(?: |$)");
            for (var j = 0; j < eles.length; j++) {
                var ele=eles[j];
                if (reg.test(ele.className)) {
                    a.push(ele);
                }
            }
            eles = a;
        }
        return eles;
    };

Dom.addClass=function(ele,strClass){
    var reg=new RegExp("(^| )"+strClass+"( |$)");
    if(!reg.test(ele.className)){
        ele.className+=" "+strClass;
    }
};

Dom.removeClass=function(ele,strClass){
    var reg=new RegExp("(^| )"+strClass+"( |$)","g");
    //var tempStr=ele.className.replace(/ /g,"   ");
    ele.className=ele.className.replace(reg," ");

        //if(ele&&ele.nodeType&&ele.nodeType===1
        //    &&oldClassName&&typeof oldClassName=="string"){
        //    //var reg=/(?:^| )(b(?: |$))\1*/g;
        //    var reg=new RegExp("(?:^| )"+oldClassName+"(?: |$)");
        //    //正则用于判断想增加的类名在标签中是否存在，存在则用空格代替直到不存在
        //    while(reg.test(ele.className)){
        //        ele.className=ele.className.replace(reg," ");
        //    }
        //}
    };


Dom.getIndex=function getIndex(ele) {//计算ele元素的索引号
    var index = 0;
    var p = ele.previousSibling;
    while (p) {
        if (p.nodeType === 1) {
            index++;
        }
        p = p.previousSibling;
    }
    return index;

};

Dom.offset=function offset(ele) {//计算任意元素距离文档顶部的绝对偏移量
    var l = ele.offsetLeft;
    var t = ele.offsetTop;
    var p = ele.offsetParent;
    while (p) {
        if (window.navigator.userAgent.indexOf("MSIE 8") >= 0) {
            l += p.offsetLeft;
            t += p.offsetTop;
        } else {
            l += p.offsetLeft + p.clientLeft;
            t += p.offsetTop + p.clientTop;
        }
        p = p.offsetParent;
    }
    return {left: l, top: t}
};

Dom.listToArray=function listToArray(likeAry) {
    try {
        return [].slice.call(likeAry,0);
        // ary = Array.prototype.slice.call(likeAry);
    } catch (e) {
        var ary = [];
        for (var i = 0; i < likeAry.length; i++) {
            ary[ary.length] = likeAry[i];
        }
    }
    return ary;
};

Dom.siblings=function siblings(ele) {//获得ele的所有元素兄弟节点
    //第一种方法
    //var parent=ele.parentNode;
    //var children=parent.children;//所有元素节点，IE还会包括注释节点
    //var a=[];
    //for(var i=0;i<children.length;i++){
    //    if(children[i].nodeType==1&&children[i]!=ele){
    //        a.push(children[i]);
    //    }
    //}
    //return a;


    //第二种方法
    var a=[];
    var p=ele.previousSibling;
    while(p){
        if(p.nodeType===1){
            a.push(p);
        }
        p= p.previousSibling;
    }
    a.reverse();

    var nex=ele.nextSibling;
    while(nex){
        if(nex.nodeType===1){
            a.push(nex);
        }
        nex=nex.nextSibling;
    }
    return a;

};

Dom.next=function(ele){
    if(typeof ele.nextElementSibling=="object"){
        return ele.nextElementSibling;
    }
    var next=ele.nextSibling;
    while(next){
        if(next.nodeType==1){
            return next;
        }
        next=next.nextSibling;
    }
    return null;

};
Dom.prev=function(ele){
    if(typeof ele.previousElementSibling=="object"){
        return ele.previousElementSibling;
    }
    var prev=ele.previousSibling;
    while(prev){
        if(prev.nodeType==1){
            return prev;
        }
        prev=prev.previousSibling;
    }
    return null;

};


Dom.brother=function (ele){//获得ele相邻的哥哥弟弟节点
    //通用原则是一个属性或一个变量，如果是对象类型的，需要初始化的时候赋一个null值
    //如果不是对象类型
    var a=[];
    if(typeof ele.previousElementSibling=="object"){
        return ele.previousElementSibling;
    }
    var pre=ele.previousSibling;
    while(pre){
        if(pre.nodeType==1){
            a.push(pre);
        }
        pre=pre.previousSibling;
    }
    return null;//null,表示没有哥哥元素节点

    if(typeof ele.nextElementSibling=="object"){
        return ele.nextElementSibling;
    }
    var next=ele.nextSibling;
    while(next){
        if(next.nodeType==1){
            a.push(next);
            return a;
        }
        next=next.nextSibling;
    }
    return null;
};

Dom.insertAfter=function insertAfter(oldEle, newEle) {//表示吧newEle添加到oldEle的后边
    oldEle.parentNode.insertBefore(newEle,oldEle.nextSibling);//如果old没有弟弟,insertBefore相当于appendChild-->oldEle.nextSibling=null

};

Dom.prepend=function prepend(parent, child) {//把child元素添加成parent第一个子元素
    parent.insertBefore(child,parent.firstChild);
};

Dom.children=function(parent,str){
    var a=[];
    var childNodes=parent.childNodes;

    if(typeof str=="string"){
        str=str.toUpperCase();
        for(var i=0;i<childNodes.length;i++){
          var child=childNodes[i];
            if(child.nodeType==1&&child.tagName==str){
                a.push(child);
            }
        }
    }else if(str=="undefined"){
    var childNodes=parent.childNodes;

    for(var i=0;i<childNodes.length;i++){
        if(child.nodeType===1){
            a.push(child);
        }
    }
    }else{
        throw new Error("第二个参数错误")
    }
    return a;
};

Dom.getCss=function(ele,attr){
    var result,reg;
    if(window.getComputedStyle){
       result= parseFloat(window.getComputedStyle(ele,null)[attr]);
    }else{
        if(attr=="opacity"){
            var val=ele.currentStyle["filter"];
            reg=/alpha\(opacity *= *(\d+((\.\d+)?))\)/;
            reg.test(val)?parseFloat(RegExp.$1)/100:1;
        }else{
            return ele.currentStyle[attr];
        }

    }
    reg=/^[+-]?\d+(\.\d+)?(px|pt|em|rem)?$/;
    if(reg.test(result)){
        return parseFloat(result);
    }else{
        return result;
    }
};

Dom.setCss=function(ele,attr,value){

    if(attr=="opacity"){
        ele.style["opacity"]=value;
        ele.style["filter"]="alpha(opacity= "+value*100+")";
    }else{
        ele.style[attr]=value;
    }


}