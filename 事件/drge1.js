function down(e){//准备拖拽
    this.x=this.offsetLeft;
    this.y=this.offsetTop;
    this.mx=e.pageX;
    this.my=e.pageY;
    if(this.setCapture) {
        this.setCapture();//专门解决mousemove事件会丢失鼠标的问题
        on(this, "mousemove", move);
        on(this, "mouseup", up);
    }else{

        this.MOVE=move.bind(this);
        this.UP=up.bind(this);
        on(document, "mousemove",this.MOVE);
        on(document, "mouseup",this.UP);
    }
    e.preventDefault();
    selfRun.call(this,"selfdragstart",e);

}

function move(e){//进行拖拽
    this.style.left=this.x+(e.pageX-this.mx)+"px";
    this.style.top=this.y+(e.pageY-this.my)+"px";
    //单位事件内产生的距离=上一次的位置-当前的位置
    if(this.prevX){
        this.speed=this.offsetLeft-this.prevX;
        this.prevX=this.offsetLeft;
    }else{
        this.prevX=this.offsetLeft;
    }

    selfRun.call(this,"selfdragging",e)

}

function up(e){//结束拖拽
    if(this.releaseCapture){
        this.releaseCapture();
        off(this,"mousemove",move);
        off(this,"mouseup",up)
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);

    }

    selfRun.call(this,"selfdragend",e)

}


function clearEffct(){
    clearTimeout(this.flytimer);
    clearInterval(this.droptimer);
}

function getSpeed(e){
    if(this.prevPosi){
        this.speed=e.pageX-this.prevPosi;
        this.prevPosi=e.pageX;
    }else{
        this.prevPosi=this.offsetLeft;
    }
}

function fly(){
    if(this.speed){
        this.speed*=0.98;
        var maxR=(document.documentElement.clientWidth||document.body.clientWidth)-this.offsetWidth;
        var current=this.speed+this.offsetLeft;
        if(current>=maxR){
            this.style.left=maxR+"px";
            this.speed*=-1;//让盒子往相反的方向运动
        }else if(current<=0){
            this.style.left=0;
            this.speed*=-1;
        }else{
            this.style.left=current+"px";
        }
        if(Math.abs(this.speed)>=0.5)
        this.flytimer=window.setTimeout(processThis(fly,this),30);

    }
}

function drop(){
    if(this.dropspeed){
        this.dropspeed+=9.8;
    }else{
        this.dropspeed=9.8;
    }
    this.dropspeed*=0.95;
    var maxB=(document.documentElement.clientHeight||document.body.clientHeight)-this.offsetHeight;
    var current=this.offsetTop+this.dropspeed;
    if(current>=maxB){
        this.style.top=maxB+"px";
        this.dropspeed*=-1;
        this.flag++;//撞到边界累加
    }else{
        this.style.top=current+"px";
        this.flag=0;//正常运动则归0
    }
    if(this.flag<2)
    this.droptimer=window.setTimeout(processThis(drop,this),30)
}