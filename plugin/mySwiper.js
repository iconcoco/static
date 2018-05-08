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
        pageButton: true, //分页按钮
        event: 'click',
        success: function() {},
    };
    $.extend(obj, params);
    //this jquery对象
    var ul = this.find(".tbs-swiper"),
        that = this;

    var lis = ul.children(".tbs-swiper-items"),
        sign = this.find(".tbs-sign"),
        next = this.parent().find(".next"),
        pre = this.parent().find(".pre"),
        length = lis.length;


    if (length < 2) return;
    //1.设置ul的宽度
    ul.css("width", ((length + 2) * 100) + "%");
    lis.eq(0).clone(true).appendTo(ul);
    lis.eq(0).before(lis.eq(length - 1).clone(true));
    //2.li的宽度
    var width = lis.outerWidth(true);
    ul.css("left", -width + "px");
    var flag = 1,
        stop = 1,
        index = 0,
        str = '',
        timer = null,
        label = null;


    //3.是否设置索引轮播
    var pagination = {
        init: function() {
            this._event();
        },
        _event: function() {

            for (var i = 0; i < length; i++) {
                str += "<a href='javascript:;' data-flag=" + i + "></a>"
            }
            sign.html(str);
            sign.children("a:eq(0)").addClass("active");
            label = sign.children();

            //3.1点击下标可以滚动噢
            label.on(obj.event, function() {
                $(this).addClass("active").siblings(label).removeClass("active");
                var val = +$(this).attr("data-flag");
                flag = val + 1, index = val;
                ul.animate({
                    "left": -flag * width + "px"
                }, obj.speed, function() {
                    obj.success(index);
                });
            });

            return this;
        }
    };

    if (!obj.pagination) { sign.remove(); } else {
        pagination.init();
    };

    //4.左右箭头
    var pageButton = {
        init: function() {

            this._event();
        },
        _event: function() {
            // 4.1向后的按钮
            next.click(function() {
                swiperRight();
            });
            //4.2向前的按钮
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
                    };
                    // 执行回调函数
                    obj.success(index);
                })
            });

            return this;
        }
    }

    if (!obj.pageButton) {
        next.remove(), pre.remove();
    } else {
        pageButton.init();
    }


    //5.自动轮播
    var looper = {
        init: function() {
            this._event();
        },
        _event: function() {
            clearInterval(timer);
            timer = setInterval(function() {
                swiperRight();
            }, obj.looper);
            return this;
        }
    }

    if (!obj.looper) {
        clearInterval(timer);
    } else {
        looper.init();
        //当前元素鼠标移入的时候停止轮播;
        this.hover(function() {
            clearInterval(timer);
        }, function() {
            timer = setInterval(function() {
                swiperRight();
            }, obj.looper);
        });
    }

    function swiperRight() {
        if (!stop) return;
        stop = 0;
        index++
        if (index > length - 1) {
            index = 0;
        };
        obj.pagination && label.eq(index).addClass("active").siblings(label).removeClass("active");
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
            // 执行回调函数
            obj.success(index);
        });
    }
}