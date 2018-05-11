/**
 * m站tab切换移动居中显示 -- 可继续优化
 * Author:Lcx
 * 2018-5-10
 * 641616451@qq
 * 
 */

$.fn.tabSlider = function(obj) {
    //参数默认值
    var params = {
        // 触发的事件
        event: 'click',
        //滑动完成之后的回调
        tansitionEnd: null
    }
    $.extend(params, obj);

    var ul = this,
        lis = ul.find('li'),
        scr = window.screen.width,
        center = Math.floor(scr / 2), //视图的中心
        aw = 0;

    lis.each(function(i, items) {
        var w = $(items).outerWidth(true);
        aw += w;
    });
    //1.设置样式
    ul.css({
        "white-space": "nowrap",
        "font-size": 0
    });
    lis.css({
        "display": "inline-block"
    })

    // ul.width(ulW);
    //2. li的注册事件
    lis.on(params.event, function() {
        var li = $(this),
            liw = li.outerWidth(),
            dis = li.offset().left + Math.floor(liw / 2);
        pullCenter(dis);
    });

    /**
     * 当前元素视图居中的函数
     * @param {*} dis 
     * 参数说明: 当前元素中心线相对视图中心线的距离
     */
    function pullCenter(dis) {
        var d = (dis - center),
            k = 0;

        if (d < 0) {
            //在左边方向 向右移动
            //1.判断向右边移动的距离 d 和 可移动距离的  大小比较
            var o = ul.scrollLeft() - Math.abs(d);
            k = o < 0 ? 0 : o;

        } else {
            //在右边  向左移动
            //1.判断向左边移动的距离 d 和 可移动距离的  大小比较
            var o = ul.scrollLeft() + Math.abs(d);
            k = o > (aw - scr) ? (aw - scr) : o;
        }

        ul.animate({
            "scrollLeft": k
        }, 300, function() {
            params.tansitionEnd && typeof params.tansitionEnd == 'function' && params.tansitionEnd();
        });

    }
}