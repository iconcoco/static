  /**
   * 呼吸灯轮播图插件
   * lichengxiang 2017-12-7
   */
  import $ from 'jquery';
  $.fn.fadeSwiper = function(params) {
      /*
      obj = {
          speed:
          looper:
          pagination: true, // 分页指示
         pageButton: true //分页按钮
         success:fn //轮播之后的回调
         before:fn //轮播之前的回调
      }
      */

      var obj = {
          speed: 500, //切换的速度 
          looper: 3000, // 轮播的时间
          pagination: true, // 分页指示
          pageButton: true, //分页按钮
          event: 'click',
          success: function() {},
          before: function() {},
      };
      $.extend(obj, params);

      var $this = this,
          box = $this.find(".tbs-swiper"),
          items = box.children(".tbs-swiper-items"),
          next = $this.find(".next"),
          pre = $this.find(".pre"),
          sign = $this.find(".tbs-sign"),
          timer = null,
          flag = 1,
          index = 0,
          str = "";
      //只有一张图的时候不让他渐变
      if (items.length < 2) return;
      //下标索引指示
      if (obj.pagination) { //是否显示指示器
          //添加索引指示
          for (var i = 0; i < items.length; i++) {
              str += "<a href='javascript:;' data-flag=" + i + "></a>"
          }
          sign.html(str);
          sign.children("a:eq(0)").addClass("active");
          var label = sign.find("a");

          //点击下标
          label.on(obj.event, function() {
              if (!flag) return;
              flag = 0;
              index = +$(this).attr("data-flag");
              move(index)
          });
      }

      //自动轮播
      if (obj.looper) { //是否开启定时器
          //鼠标移入移除定时器
          $this.hover(function() {
              clearInterval(timer);
          }, function() {
              clearInterval(timer);
              timer = setInterval(function() {
                  right();
              }, obj.looper);
          })

          //定时器
          timer = setInterval(function() {
              right();
          }, obj.looper);
      }

      //分页按钮
      if (obj.pageButton) {
          //向右
          next.click(function() {
              right();
          });
          //向左
          pre.click(function() {
              if (!flag) return;
              flag = 0;
              index--;
              if (index < 0) {
                  index = items.length - 1
              };
              move(index)
          })
      } else {
          next.remove(), pre.remove();
      }

      //向右的函数
      function right() {
          if (!flag) return;
          flag = 0;
          index++;
          if (index >= items.length) {
              index = 0
          };
          move(index)
      }

      function move(index) {
          obj.before(index);
          items.eq(index).fadeIn(obj.speed, function() {
              flag = 1;
              obj.success(index); //回调函数
          }).siblings(".tbs-swiper-items").fadeOut(obj.speed);
          //下标指示
          if (obj.pagination) {
              label.eq(index).addClass("active").siblings(label).removeClass("active");
          };
      }
  };