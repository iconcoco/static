<template>
    <div class="fadeIn">
        <div>
            <h2 class="banner-module-title">自动提现</h2>
            <component v-show="ING" :is="componentId" @transToEvent="eventDuFn" :status="status"></component>
        </div>
    </div>
</template>

<script>
import  AutoPayIntro  from './__AutoIntro.vue';
import AutoPayContent from './__AutoContent.vue'

import {queryAutoWithdrawStore} from './../../../../js/api.js';
export default {
    data(){
        return{
            componentId:"AutoPayIntro",
            status:"1",
            ING:false,
        }
    },
    created(){
        queryAutoWithdrawStore({isAutoWithdraw:1}).then(res=>{
            this.ING = true;
            if(res.code==0){
                this.componentId = res.data.length? ('AutoPayContent'):('AutoPayIntro');
            }else{
                this.$Message.error(res.msg);
            }
        });
    },
    methods:{
        eventDuFn(params){
            this.status = params.status;
            if(params.type=='info'){ this.componentId='AutoPayContent' };
        }
    },
    components:{
        AutoPayIntro,
        AutoPayContent
    }
}
</script>