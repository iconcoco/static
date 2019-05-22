<template>
    <div class="fadeIn">
        <component 
        :is="componentsId"
        @jumpPage="chosePage"
        :DATA="applyData"

        ></component>
    </div>
</template>


<script>
import applyList from './__ApplyList.vue';
import applyDetails from './__ApplyDetails.vue';
import PayVatService from './__PayVatService.vue';


export default {
    data(){
        return {
            componentsId:'PayVatService',
            applyData:{ 
                isApply:true,      //申请还是详情
                status:0            //0:审核中 1:申请成功 2:申请异常 3:待支付 4:支付中 5:支付失败 6:申请中 7:申请异常
            },
        }
    },
    created(){
        this.componentsId = this.$route.params.TO || 'applyList';
    },
    methods:{
        chosePage(params){
            this.applyData = params;
            this.componentsId = params.page
        }
    },
    components:{
        applyList,
        PayVatService,
        applyDetails
    }
}
</script>
