<template>
    <div :id="`bar_single_${TID}`" style="width:100%;height:100%"></div>
</template>

<script>
    import Echart from 'echarts';

    //  let D = new Date().getTime();
        
    // let id = `bar_single_${D.toString().slice(Math.floor(Math.random()*10),D.lenght)}`;

    let chart_init = function(params,id,matter,data){

            if(!id) return console.warn(`缺少TID`);

            let homePie = Echart.init(document.getElementById(`bar_single_${id}`));

            let option = {
                tooltip : {
                    // show:false,
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                  grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type : 'category',
                    splitLine: {show:false},
                    data :params.xAxis
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1
                },
                series: params.series,
            };

            //tooltip显示的内容自定义
            if(matter){
                option.tooltip["formatter"] = function(chartParams){

                    // chartParams.marker  //前边标记的点
                    let k = chartParams[0].axisValue;  //X轴的key
                    let point = chartParams[0].marker;  //

                    let inf = `<p>${k}</p>`
                    for (const key in data[k]) {
                        inf += `<p>${point} ${key} : ${data[k][key]}</p>`;
                    };
                    
                    return inf;
                };
            }

             homePie.setOption(option,true);
    };

    export default{
        data(){
            return{

            }
        },
        props:['data','TID','matter'],
        mounted(){
                 if(Object.keys(this.data).length) this.loadingMap(this.data);
        },
        watch:{
            data(data){
                this.loadingMap(data);
                //  if(Object.keys(data).length) 
            }
        },
        methods:{
            loadingMap(n){
                      /**
                 * {
                 *  USD:{value:112,currency:USD,hb:11,tb:22},
                 *  JPY:{value:112,currency:USD,hb:11,tb:22},
                 * }
                 * 
                */
                let xAxis = []; //USD JPY
                let series = [{
                    type: 'bar',
                    barWidth: '30%',
                    data:[],
                }];//[value]

                for (const key in n) {
                    xAxis.push(key);

                    series[0].data.push(n[key]['value']);
                }

                
                //画图
                chart_init({
                    xAxis,
                    series,
                },this.TID,this.matter,n);
            }
        }

    }
</script>