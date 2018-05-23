(function(win, doc, $) {

    var fullImage = function(className) {
        this.boxs = doc.querySelectorAll(className) || [];

        this.init();

    }

    fullImage.prototype = {
        constructor: fullImage,
        init: function() {
            var i = 0,
                container = this.boxs;

            if (!this.boxs.length) return;

            for (i; i < container.length; i++) {
                this.set(container[i]);
            }
        },
        set: function(container) {
            var img = $(container).find('img')[0],
                cSize = this.judgeSize(container),
                iSize = this.judgeSize(img);

            var w = $(container).width(),
                h = $(container).height();

            if (cSize == iSize) {
                $(img).css({
                    'width': '100%',
                    'height': '100%'
                });
            }
            if (cSize > iSize) {
                var ih = w / iSize;
                $(img).css({
                    'width': '100%',
                    'marginTop': -(ih - h) / 2 + 'px'
                });
            }
            if (cSize < iSize) {
                var iw = h * iSize;
                $(img).css({
                    'height': '100%',
                    'marginLeft': -(iw - w) / 2 + 'px'
                });
            }
        },
        //判断容器的宽度和高度 0 正方形  1 横向  -1 竖向
        judgeSize: function(box) {

            if (box.nodeName.toUpperCase() == 'IMG') {
                var src = box.getAttribute('src'),
                    img = new Image();
                img.src = src;
                return img.onload = (function() {
                    return img.width / img.height
                })()

            } else {
                var w = $(box).width(),
                    h = $(box).height();
                return w / h;
            }

        }
    }

    //模块定义
    if (typeof module != 'undefined' && module.exports) {
        module.exports = fullImage;
    } else if (typeof define == 'function' && define.amd) {
        define(function() { return fullImage; });
    } else {
        win.fullImage = fullImage;
    }

})(window, document, $);