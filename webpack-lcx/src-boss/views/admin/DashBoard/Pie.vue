<template>
    <div :id="`Pie_${TID}`" style="width:100%;height:100%"></div>
</template>

<script>
    import Echart from 'echarts';

    let E_init = function(params,TID,title){
            let homePie = Echart.init(document.getElementById(`Pie_${TID}`));

            let option = {
                    title : {
                        text: title,
                        x:'center'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: params.legend
                    },
                    series :params.series
                };


             homePie.setOption(option,true);
    }

    export default{
        data(){
            return{

            }
        },
        props:["data","TID","text"],
        watch:{
            data(data){

                this.loadingMap(data);
                
            }
        },
        mounted(){
                if(Object.keys(this.data).length) this.loadingMap(this.data);
        },
        methods:{
            loadingMap(data){
                 let legend = [];

                let series = [
                         {
                            name: this.text.tip,
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            // label: {
                            //     normal: {
                            //         show: true,
                            //         formatter: '{b}: {c}({d}%)'
                            //     }
                            // },
                            data:[ ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                ]

                for (const key in data) {
                    legend.push(key);
                    series[0].data.push(data[key]);
                }

                //画图
               E_init({
                   legend,
                   series
               },this.TID,this.text.title);
            }
        }

    }
</script>