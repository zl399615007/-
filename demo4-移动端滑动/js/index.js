/**
 * Created by zhanglei on 16/4/19.
 */
$(function(){
    //获取所有li
    var $li=$('#list').find('>li');
    //var $li=$('#list').children('li');
    //var $li=$('#list>li');
    //设备高度
    var viewHeight=$(window).height();
    //设置main适应设备的高度
    $('#main').css('height',viewHeight);
    //页面场景切换函数的调用 pagelist()
    slidePage();
    function slidePage(){
        var nowIndex=0;
        var nextprevIndex=0;
        var step=1/4;
        var bBtn=true;//开关思想
        //手按下的时候,ev 按时触发的事件集合
        $li.on('touchstart',function(ev){
            if(!bBtn) return;
            bBtn=false;
            //获取touch下一些列数据
            var touch=ev.originalEvent.changedTouches[0];
            //保存距离页面顶部的位置
            var downY=touch.pageY;
            //获取当前索引
            nowIndex=$(this).index();
            //1-Math.abs((touch.pageY-downY))/viewHeight*step 0~1  0~0.25; 1~0.75
            //touch 移动事件
            $li.on('touchmove.move',function(ev){
                var touch=ev.originalEvent.changedTouches[0];
                $(this).siblings().hide();
                //1.往上划,往下划
                if(touch.pageY<downY){//up
                    //下一个元素的索引
                    nextprevIndex=nowIndex==$li.length-1?0:nowIndex+1;
                    //下一个元素往上走
                    $li.eq(nextprevIndex).css('transform','translate(0,'+(viewHeight+touch.pageY-downY)+'px)');
                }else if(touch.pageY>downY){//down
                    //获取上一个元素的索引
                    nextprevIndex=nowIndex==0?$li.length-1:nowIndex-1;
                    //上一个元素往下走
                    $li.eq(nextprevIndex).css('transform','translate(0,'+(-viewHeight+touch.pageY-downY)+'px)');
                }else{
                    bBtn=true;
                }
                //当前元素位移和缩放
                $(this).css('transform','translate(0,'+(touch.pageY-downY)*step+'px) scale('+(1-Math.abs((touch.pageY-downY))/viewHeight*step)+')');
                //当前元素的下一个元素显示并且层级提高;
                $li.eq(nextprevIndex).show().addClass('zIndex');
                //阻止默认事件
                ev.preventDefault();
                //return false;
            });
            //touch 结束事件
            $li.on('touchend.move',function(ev){
                var touch=ev.originalEvent.changedTouches[0];
                //往上划,往下划
                if(touch.pageY<downY) {//up
                    //当前元素到达她的位移终点,比例终点
                    $(this).css('transform','translate(0,'+(-viewHeight*step)+'px) scale('+(1-step)+')');
                }else if(touch.pageY>downY) {//down
                    //当元素到达她的位移终点,比例终点
                    $(this).css('transform','translate(0,'+(viewHeight*step)+'px)  scale('+(1-step)+')');
                }
                //控制transform,给他加运动
                $(this).css('transition','0.3s');
                //上一个or下一个元素到达00点;
                $li.eq(nextprevIndex).css('transform','translate(0,0)');
                $li.eq(nextprevIndex).css('transition','.3s');
                //用class的思想,解除事件绑定
                $li.off('.move');
            })
        });
        //给on里添加两个兼容事件,中间一定要用空格隔开
        //当运动结束的时候,要重置哪些样式;
        $li.on('transitionEnd webkitTransitionEnd',function(ev){
            //事件源处理方式
            if(!$li.is(ev.target)) return;
            resetFn();
        });
        function resetFn(){
            //却掉下一个元素的层级,并且让所有兄弟元素隐藏
            $li.eq(nextprevIndex).removeClass('zIndex').siblings().hide();
            //去掉所有的运动
            $li.css('transition','');
            $li.css('transform','');
            //开关思想
            bBtn=true;
        }
    }
})