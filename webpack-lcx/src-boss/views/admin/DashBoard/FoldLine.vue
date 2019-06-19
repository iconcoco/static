<template>
    <div :id="id" style="width:100%;height:100%"></div>
</template>

<script>
    import Echart from 'echarts';

        let D = new Date().getTime();
        
        let id = `Line_${D.toString().slice(Math.floor(Math.random()*10),D.lenght)}`;

        let E_init = function(params){
            let homePie = Echart.init(document.getElementById(id));
            let option = {
                // color:["#FFFF6333","#63E8B8","#FF3194F7","#FF6048FF","#FF2DE09F","#FFFFCC33"],
                // color:["#FFCC33","#FFA133","#FFFF6333","#FFFF334E","#FFD13EEC","#FFA248FF","#FF6048FF","#FF3194F7","#FF31BDF7","#FF2DD6F5"],
                title: {
                    // text: '折线图堆叠'
                },
                tooltip: {
                    trigger: 'axis'
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
                toolbox: {
                    // feature: {
                    //     saveAsImage: {}
                    // }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: params.xAxis
                },
                yAxis: {
                    type: 'value',
                      minInterval: 1
                },
                series: params.series
            };

             homePie.setOption(option,true);
        }

    export default{
        data(){
            return{
                id:id 
            }
        },
        props:['data'],
        mounted(){
            if(Object.keys(this.data).length) this.loadingMap(this.data);
        },
        watch:{
            data(data){
                this.loadingMap(data);
                // if(Object.keys(data).length) 
            }
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
                        type:'line',
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
               });
           }
        }

    }
</script>