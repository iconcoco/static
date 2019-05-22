<template>
    <div class="fadeIn">
         <component 
        :is="componentsId"
        @toPage="chosePage"
        :Data="componentData"
        ></component>
    </div>
</template>

<script>
import PayTaxList from './__PayTaxList.vue';        //缴税列表
import PayTaxApply from './__PayTaxApply.vue';      //缴税申请
import PayTaxInfo from './__PayTaxInfo.vue';        //缴税详情
export default {
    data(){
        return {
            componentsId:'PayTaxList',
            componentData:undefined, 
            // {
            //     name,
            //     params
            // }
        }
    },
    components:{
        PayTaxList,
        PayTaxApply,
        PayTaxInfo,
    },
    created(){
        let name = this.$route.params.TO
        let id = this.$route.params.ID;
        let taxPayFile = this.$route.params.taxPayFile;
        //成功页跳转回来查看详情
        id && this.chosePage({name,params:{
            id:id 
        }});
        //申报跳转过来缴税
        taxPayFile && this.chosePage({name,params:{
            isNew:true,
            taxPayFile,
            declarationId:this.$route.params.declarationId,
        }});
    },
    methods:{
        chosePage({name,params}){
            this.componentsId = name;
            this.componentData = params;
        },
    }
}
</script>
