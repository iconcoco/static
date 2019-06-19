<template>
    <div :id="`bar_db_${TID}`" style="width:100%;height:100%"></div>
</template>

<script>
    import Echart from 'echarts';

    //  let D = new Date().getTime();
        
    // let id = `bar_db_${D.toString().slice(Math.floor(Math.random()*10),D.lenght)}`;

    let E_init = function(params,TID){
            let homePie = Echart.init(document.getElementById(`bar_db_${TID}`));

            let option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:params.legend
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : params.xAxis,
                       
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                         minInterval: 1
                    }
                ],
                series : params.series
            };


             homePie.setOption(option,true);
    }

    export default{
        data(){
            return{

            }
        },
        props:["data","TID"],
        watch:{
            data(data){
                this.loadingMap(data);
                //  if(Object.keys(data).length) 
            }
        },
        mounted(){
            if(Object.keys(this.data).length) this.loadingMap(this.data);
        },
        methods:{
            loadingMap(data){
                 /**
                 * {
                 *  2018-10:[ {OY:188 },{USD:200} ],
                 *  2018-11:[ {OY:181 },{USD:120} ],
                 * }
                 * 
                */
                let xAxis = []; //2018-10 ,  2018-11
                let legend = [];//欧元 , 美元
                let series = [];
                //1. 循环获取 种类以及 横坐标
               for (const k in data) {
                   xAxis.push(k);

                   data[k].map(i=>{
                       for (const j in i) {
                           legend.indexOf(j)<0 && legend.push(j);
                        }
                   });
               };
                //2. 循环 series
               legend.map(k=>{
                   let o = {
                        name:k,
                        type:'bar',
                        data:[]
                   };

                   for (const j in data) {
                       data[j].map(item=>{
                           for (const key in item) {
                               if (key == k) {
                                   o.data.push(item[key]);
                               }
                           }
                       });
                   }

                    series.push(o);
               });

                //画图
               E_init({
                   legend,
                   xAxis,
                   series
               },this.TID);
            }
        }

    }
</script>