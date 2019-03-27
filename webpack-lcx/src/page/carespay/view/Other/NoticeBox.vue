<template>
    <div class="fadeIn">
       <div>
            <h2 class="banner-module-title">待处理消息</h2>
            <ul v-if="$store.state.notifyData.length" class="notice-box-list">
                <li v-for="(item,index) in $store.state.notifyData" :key="index">
                    <p> <span class="cares-icon"></span> CaresPAY小管家：亲爱的客户</p>
                    <p class="content" >
                        <span @click="bindNewsClick(item.type)"  v-html="item.boxcontent"></span>
                    </p>
                    <p>爱你CaresPAY小管家</p>
                    <p class="time">2018-11-30 15:30</p>
                </li>
            </ul>
            <div v-else class="empty">
                <img class="error_img_1" src="../../../../images/carepay/404.png" alt="404">
                <p>暂无新消息</p>
            </div>
             
       </div>
    </div>
</template>

<script>
import {
         updateMessageInfo,                 
         dealtInfo,                 //获取代办信息的请求
    } from './../../../../js/api.js';
// import { Pricemoney } from '../../../../js/common.js'

export default {
    created(){
        this.loadingQuery();
    },
    methods:{
        loadingQuery(){
            dealtInfo().then(res=>{
                if(res.code==0){
                    //2018-12-14 消息盒子优化
                    this.$emit("transToApp",{
                        data:res.data,
                        type:"NT"
                    });


                }else{
                    this.$Message.error(res.msg);
                }
            })
        },
        bindNewsClick(index){
            this.$emit("transToApp",{
                data:index,
                type:"NT-DE"
            });
            // updateMessageInfo({messageNo:type}).then(res=>{
            //     if(res.code==0){
            //         this.loadingQuery();
            //     }
            // });
        }
    }
}
</script>

<style lang="scss" scoped>
.notice-box-list{
    // margin-top: 20px;
    padding-bottom: 20px;
    li{
        border-bottom: 1px solid #F1F1F1;
        position: relative;
        padding: 15px 0 10px;
        // margin-bottom: 20px;
        p{
            font-size: 14px;
            line-height: 26px;
            color: #333;
            vertical-align: middle;
            padding-left: 60px;
            &.content{
                text-indent: 2em;
            }
            &.time{
                color: #aaa;
            }
        }
        .cares-icon{
            position: absolute;
            width: 40px;
            height: 26px;
            vertical-align: top;
            // margin-right: 20px;
            left: 0;
        }
    }
}

.empty{
    text-align: center;
    padding-bottom: 20px;
    padding-top: 20px;
    color: #666;
    p{
        margin-top: 20px;
    }
}
</style>

