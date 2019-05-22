<template>
    <div class="appFnContainer" :class="{throughBanner:componentId=='FastInfo',fadeIn:ING}">
        <component 
            @transToContent="(value)=>{ return changeComponentId(value,0)}" 
            :is='componentId'
            :tabIndex="activeTab"    
        ></component>
    </div>
</template>

<script>
import FastInfo from './__FastIntro.vue';
import FastContent from './__FastContent.vue';

import { getFlashWithdrawStore,getflashWithdrawNotice } from  './../../../../js/api.js';

export default {
    data(){
        return{
            componentId:'',
            activeTab:null,
            ING:false
        }
    },
    created(){
        // return
        //判断是否已经开通了闪提宝，没有调到介绍页面
         getflashWithdrawNotice({type:1}).then(res=>{
            if(res.code==0){
                if(res.data && res.data.isShow){
                   this.changeComponentId(false,0); 
                }else{
                    //看是否已经有开通了店铺
                    return getFlashWithdrawStore({type:1})
                }
            }else{
                this.$Message.error(res.msg);
            }
         }).then(res=>{
             if(!res) return;
            
             this.ING = true;
            if(res.code==0){
                this.changeComponentId(res.data.length>0,1);
            }else{
                this.$Message.error(res.msg);
            }

         });
    }, 
    methods:{
        changeComponentId(val,tabindex){
            this.componentId = val ? "FastContent" :"FastInfo";
            this.activeTab = tabindex;
            
        }
    },
    components:{
        FastInfo,
        FastContent,
    }
}
</script>

<style lang="scss" scoped>
    .appFnContainer{
        transition: all 0s;
    }
    .throughBanner{
        max-width: 100%;
        margin-top: -10px;
        >div{
            padding: 0;
        }
    }
</style>
