function EventEmitter(){

};

EventEmitter.prototype.on=function (type,fn){
    //type是自定义的事件类型，是字符串；e是浏览器的事件对象
    if(!this["emitter"+type])this["emitter"+type]=[];
    var a=this["emitter"+type];
    for(var i=0;i< a.length;i++){
        if(a[i]==fn)return;
    }
    a.push(fn);

    return this;
};
EventEmitter.prototype.run=function(type,e){
    var a=this["emitter"+type];
    if(a){
        for(var i=0;i< a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }

};
EventEmitter.prototype.off=function(type,fn){
    var a = this["emitter" + type];
    if (a) {
        for (var i = 0; i < a.length; i++) {
            if(a[i]==fn){
                a[i]=null;
                return;
            }
        }
    }
    return this;
};

function Drag(ele){//ele是被拖拽的DOM对象
    this.ele=ele;
    this.x=null;
    this.y=null;
    this.mx=null;
    this.my=null;
    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,"mousedown",this.DOWN);
};
Drag.prototype=new EventEmitter;//继承

Drag.prototype.down=function (e){
    this.x=this.ele.offsetLeft;
    this.y=this.ele.offsetTop;
    this.mx= e.pageX;
    this.my= e.pageY;
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,"mousemove",this.MOVE);
        on(this.ele,"mouseup",this.UP);
    }else{
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);
    }
    e.preventDefault();

    this.run("dragstart",e);

};

Drag.prototype.move=function (e){
    this.ele.style.left=this.x+ (e.pageX-this.mx)+"px";
    this.ele.style.top=this.y+(e.pageY-this.my)+"px";

    this.run("dragging",e);

};

Drag.prototype.up=function (e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,"mousemove",this.MOVE);
        off(this.ele,"mouseup",this.UP);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }

    this.run("dragend",e);

};
var zIndex=1;
function increaseIndex(){//让被拖拽的元素在最上面
    this.ele.style.zIndex=++zIndex;
};

function clearEffect(){
    clearTimeout(this.flytimer);
    clearTimeout(this.droptimer);
};

function getSpeed(e){
    if(this.prevPosi){
        this.flySpeed= e.pageX-this.prevPosi;
        this.prevPosi= e.pageX;
    }else{
        this.prevPosi= e.pageX;
    }

};

function fly(){
    this.flySpeed*=.96;
    var l=0;
    var r=(document.documentElement.clientWidth||document.body.clientWidth)-this.ele.offsetWidth;
    var current=this.ele.offsetLeft+this.flySpeed;
    if(current<=1){
        this.ele.style.left=0;
        this.flySpeed*=-1;
    }else if(current>=r){
        this.ele.style.left=r+"px";
        this.flySpeed*=-1;
    }else{
        this.ele.style.left=current+"px";
    }
    if(Math.abs(this.flySpeed)>0.5)

        this.flytimer=window.setTimeout(processThis(fly,this),20);

};

function drop(){
    if(this.dropspeed){
        this.dropspeed+=9.8;
    }else{
        this.dropspeed=9.8;
    }
    this.dropspeed*=0.97;
    var b=(document.documentElement.clientHeight||document.body.clientHeight)-this.ele.offsetHeight;//下边界
    var current=this.ele.offsetTop+this.dropspeed;
    if(current>=b){
        this.ele.style.top=b+"px";
        this.dropspeed*=-1;
        this.flag++;
    }else{
        this.ele.style.top=current+"px";
        this.flag=0;
    }
    if(this.flag<2){
        this.dropTimer=window.setTimeout(processThis(drop,this),20);
    }
}

Drag.prototype.range=function(obj){
    // obj={left:0,right:900,top:0,bottom:500}
    var obj=this.objRange;
    var current=this.ele.offsetLeft
    if(current<=obj.left){
        this.ele.style.left=obj.left+"px";
    }else if(current>=obj.right){
        this.ele.style.left=obj.right+"px";
    }
    if(this.ele.offsetTop>=obj.bottom){
        this.ele.style.top=obj.bottom+"px";
    }else if(this.ele.offsetTop<=obj.top){
        this.ele.style.top=obj.top+"px";
    }
}
Drag.prototype.addRange=function(obj){
    this.objRange=obj;
    this.on("drag",this.range);
}

Drag.prototype.addBorder=function(){
    this.ele.style.border="2px dashed blue";
}
Drag.prototype.removeBorder=function(){
    this.ele.style.border="none";
}
Drag.prototype.border=function(){
    this.on("dragstart",this.addBorder);
    this.on("dragend",this.removeBorder);
}
