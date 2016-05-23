(function(){
    //图片资源
    var dataAry = ["img/M.jpg","img/A.jpg","img/D.jpg","img/E.jpg"];
    //获取元素
    var outer = document.getElementById("outer");
    var inner = document.getElementById("inner");
    var imgList = inner.getElementsByTagName("div");//图片放在div中，没有使用img标签
    var tips = document.getElementById("tips");
    var tipList = tips.getElementsByTagName("li");
    var bannerLeft = document.getElementById("bannerLeft");
    var bannerRight = document.getElementById("bannerRight");
    var outerW = utils.getCss(outer,"width");//outer即图片宽度
    var count = dataAry.length+2;//记录一共有几张图片
    //绑定数据，图片、tip
    var bindData = function(){
        var str = "";
        str+="<div trueImg = '"+dataAry[dataAry.length-1]+"'></div>";//在最前面添加最后一张图片
        for(var i=0;i<dataAry.length;i++){
            str+="<div trueImg = '"+dataAry[i]+"'></div>";
        }
        str+="<div trueImg = '"+dataAry[0]+"'></div>";//在最后面添加第一张图片
        inner.innerHTML=str;

        //重新计算inner的宽度：
        utils.setCss(inner,"width",(dataAry.length+2)*outerW);

        //绑定tip
        var str = "";
        for(var i=0;i<dataAry.length;i++){
            i===0?str+="<li class='select'></li>":str+="<li></li>";
        }
        tips.innerHTML=str;
    }
    bindData();

    //图片延迟加载
    var delayImg = function(){
        for(var i=0;i<imgList.length;i++){
            ~function(i){
                var curImg = imgList[i];
                if(curImg.isLoad)return;
                var trueImg =curImg.getAttribute("trueImg");
                var newImg = new Image;//新增一个img标签，和document.createElement("")一样的功能
                newImg.src=trueImg;
                newImg.onload=function(){//异步，和点击事件类似，curImg = imgList[i],i是最后一次循环的数，一开始存的是字符串
                    curImg.appendChild(newImg);
                    curImg.isLoad=true;
                }
            }(i);

        }
    }
    window.setTimeout(delayImg,500);
    //图片切换
    var step = 1;//记录图片，1代表第一张图片
    var move = function(event){
        if(typeof event==="undefined" || event==="right"){//不传参数，自动切换
            step++;
            if(step>dataAry.length+1){
                utils.setCss(inner,"left",-outerW);
                step=2;
            }
        }
        if(event==="left"){
            step--;
            if(step<0){
                utils.setCss(inner,"left",-dataAry.length*outerW);
                step=3;
            }
        }
        if(event==="tip"){
            if(step>dataAry.length){
               this.i===1||this.i===0? utils.setCss(inner,"left",-outerW):null;
                step=this.i+1;
                /*if(this.i===1){
                    utils.setCss(inner,"left",-outerW);
                    step=2;
                }else if(this.i===0){
                    utils.setCss(inner,"left",-outerW);
                    step=1;
                }else{
                    step=this.i+1;
                }*/
            }else if(step<=0){
                this.i===dataAry.length-1||this.i===dataAry.length-2?utils.setCss(inner,"left",-dataAry.length*outerW):null;
                step=this.i+1;
                /*if(this.i===dataAry.length-1){
                    utils.setCss(inner,"left",-dataAry.length*outerW);
                    step=4;
                }else if(this.i===dataAry.length-2){
                    utils.setCss(inner,"left",-dataAry.length*outerW);
                    step=3;
                }else{
                    step=this.i+1;
                }*/

            }else{
                step=this.i+1;
            }
        }
        animate(inner,{left:-step*outerW},500);
        changeTip(step-1);
    }
    inner.autoTimer= window.setInterval(move,3000);//inner.timer不可以，因为它在inner内置的属性上有，会冲突

    //焦点切换
    var changeTip = function(step){
        step = step<0?3:step;
        step = step>=dataAry.length?0:step;
        for(var i=0;i<tipList.length;i++){
            tipList[i].className= step===i?"select":null;
        }
    }
    //焦点点击事件
    for(var i=0;i<tipList.length;i++){
        tipList[i].i=i;
        tipList[i].onclick=function(){
            move.call(this,"tip");
        }
    }
    //左右切换
    outer.onmouseenter=function(){
        window.clearInterval(inner.autoTimer);
        bannerLeft.style.display=bannerRight.style.display="block";
    }
    outer.onmouseleave=function(){
        bannerLeft.style.display=bannerRight.style.display="none";
        inner.autoTimer= window.setInterval(move,3000);
    }
    //左右切换点击事件
    bannerLeft.onclick=function(){
        move("left");
    }
    bannerRight.onclick=function(){
        move("right");
    }
})();
