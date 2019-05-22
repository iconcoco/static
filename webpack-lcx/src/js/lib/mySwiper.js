import $ from 'jquery';
$.fn.mySwiper = function(params) {
    /**
     * {
     *      speed: 500 //切换的速度 
     *      looper: 3000 // 轮播的时间
     *      pagination:ture/false // 分页指示索引
     *      pageButton:ture/false //分页按钮
     * }
     */
    var obj = {
        speed: 500, //切换的速度 
        looper: 3000, // 轮播的时间
        pagination: true, // 分页指示
        pageButton: true //分页按钮
    };
    $.extend(obj, params);
    //this jquery对象
    var ul = this.find(".tbs-swiper");

    var lis = ul.children(".tbs-swiper-items"),
        sign = this.find(".tbs-sign"),
        next = this.find(".next"),
        pre = this.find(".pre"),
        length = lis.length;

    if (length < 2) return;
    //设置ul的宽度
    ul.css("width", (length + 2) * 100 + "%");
    lis.eq(0).clone(true).appendTo(ul);
    lis.eq(0).before(lis.eq(length - 1).clone(true));
    //li的宽度
    var width = lis.outerWidth(true);
    ul.css("left", -width + "px");
    var flag = 1,
        stop = 1,
        index = 0,
        str = '',
        timer = null;

    //当前元素鼠标移入的时候停止轮播;
    this.hover(function() {
        clearInterval(timer);
    }, function() {
        timer = setInterval(function() {
            swiperRight();
        }, obj.looper);
    });
    //添加索引
    if (!obj.pagination) { sign.remove(); }
    for (var i = 0; i < length; i++) {
        str += "<a href='javascript:;' data-flag=" + i + "></a>"
    }
    sign.html(str);
    sign.children("a:eq(0)").addClass("active");
    var label = sign.children();

    //点击下标可以滚动噢
    label.click(function() {
        $(this).addClass("active").siblings(label).removeClass("active");
        var val = +$(this).attr("data-flag");
        flag = val + 1, index = val;
        ul.animate({
            "left": -flag * width + "px"
        }, obj.speed);
    });

    if (!obj.pageButton) { next.remove(), pre.remove(); }
    //向后的按钮
    next.click(function() {
        swiperRight();
    });
    //向前的按钮
    pre.click(function() {
        if (!stop) return;
        stop = 0;
        index--
        if (index < 0) {
            index = length - 1;
        }
        label.eq(index).addClass("active").siblings(label).removeClass("active");
        flag--;
        ul.animate({
            "left": -width * flag + "px"
        }, obj.speed, function() {
            stop = 1;
            if (flag < 1) {
                flag = length;
                ul.css({
                    "left": -flag * width + "px"
                });
            }
        })
    });

    //自动轮播
    timer = setInterval(function() {
        swiperRight();
    }, obj.looper);
    //
    function swiperRight() {
        if (!stop) return;
        stop = 0;
        index++
        if (index > length - 1) {
            index = 0;
        };
        label.eq(index).addClass("active").siblings(label).removeClass("active");
        flag++;
        ul.animate({
            "left": -width * flag + "px"
        }, obj.speed, function() {
            //结束之后
            stop = 1;
            if (flag > length) {
                flag = 1;
                ul.css({
                    "left": -flag * width + "px"
                });
            }
        });
    }
}