<template>
    <div :id="`Funnel_${TID}`" style="width:100%;height:100%"></div>
</template>

<script>
    import Echart from 'echarts';

    let E_init = function(params,TID){
            let homePie = Echart.init(document.getElementById(`Funnel_${TID}`));

            let option = {
                    // title: {
                    //     text: '漏斗图',
                    //     subtext: '纯属虚构'
                    // },
                     grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    toolbox: {
                        feature: {
                            dataView: {readOnly: false},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    legend: {
                        data:params.legend
                    },
                    calculable: true,
                    series: [
                        {
                            name:'漏斗图',
                            type:'funnel',
                            left: '10%',
                            top: 80,
                            //x2: 80,
                            bottom: 0,
                            width: '80%',
                            // height: {totalHeight} - y - y2,
                            min: 0,
                            max: 100,
                            minSize: '0%',
                            maxSize: '100%',
                            sort: 'none',
                            gap: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                },
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    lineStyle: {
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            data: params.series
                        }
                    ]
                };

            homePie.setOption(option,true);

    }

    export default{
        data(){
            return{

            }
        },
        props:["data","TID",],
        watch:{
            data(data){

                this.loadingMap(data);

                // if(Object.keys(data).length) ;
            }
        },
        mounted(){
                // this.loadingMap(this.data);
                if(Object.keys(this.data).length) this.loadingMap(this.data);
        },
        methods:{
            loadingMap(data){
                 let TT =  Object.prototype.toString.call(data).slice(8, -1)

                 let legend = [];
                 let series = [];

                 if(TT == 'Object'){
                    for (const key in data) {
                        legend.push(key);
                        series.push(data[key]);
                    };
                 };

                 if(TT == 'Array'){
                    data.map(item=>{
                        legend.push(item.name);
                        series.push(item);
                    });
                 }
                //  console.log(data)

                //画图
               E_init({
                   legend,
                   series
               },this.TID);
            }
        }

    }
</script>