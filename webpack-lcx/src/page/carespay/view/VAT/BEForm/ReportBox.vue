<template>
    <div>
        <component :ID="componentId" :is="witchComponent"
            @jumpPage="chosePage"
        ></component>
    </div>
</template>

<script>
import ReportList from './__ReportList.vue';
import ReportDetails from './__ReportDetails.vue';
export default {
    data(){
        return {
            witchComponent:'ReportList',
            componentId:null
        }
    },
    created(){
        this.componentId = this.$route.params.ID || null;

        this.witchComponent = this.$route.params.TO || 'ReportList';
    },
    components:{
        ReportDetails,
        ReportList,
    },
    methods:{
        chosePage(params){
            this.witchComponent = params.toPage;
            this.componentId = params.data;
        }
    }
}
</script>
