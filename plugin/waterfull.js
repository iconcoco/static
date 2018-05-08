 /**
  * 封装了一个瀑布流插件
  * 使用瀑布流要求子元素的类名为item;
  * lichengxiang 2017/12/7                                                                                                          使用瀑布流 要求其子元素的类名为item
  */
 $.fn.extend({
     waterfall: function() {
         var $this = this,
             items = $this.children('.item');

         if (!items.length) return;
         // 1.声明一个数组,用于存放高度/数量
         var arrHeigth = [],
             arrNum = Math.floor($this.width() / $('.item').width()); //定义数组的长度数量

         //给每个数组一个初始值
         for (var i = 0; i < arrNum; i++) {
             arrHeigth[i] = 0;
         }

         //2.将对象下面的子元素使用瀑布流布局
         items.each(function(index, element) {
             var minIndex = 0, //假设数组中值最小的索引是0
                 minValue = arrHeigth[minIndex]; //假设数组中最小的值是arrHeigth[minIndex]
             for (var i = 0; i < arrHeigth.length; i++) {
                 if (minValue > arrHeigth[i]) {
                     minValue = arrHeigth[i];
                     minIndex = i;
                 }
             };
             // 使用最小值和最小值对应的索引设置图片的位置  top left
             $(element).css({
                 top: minValue,
                 left: minIndex * $('.item').outerWidth(true)
             });

             //最后 将对应索引的高度改为当前 高度
             arrHeigth[minIndex] = minValue + $(element).outerHeight(true);
         });

         //同时将最高高度给当前父盒子 不然父盒子会塌陷
         var max = 0;
         for (var i = 0; i < arrHeigth.length; i++) {
             max = arrHeigth[i] > max ? arrHeigth[i] : max;
         };
         $this.css({
             "visibility": "visible",
             "height": max
         });
         //支持链式编程   将对象返回
         return this;
     }
 });