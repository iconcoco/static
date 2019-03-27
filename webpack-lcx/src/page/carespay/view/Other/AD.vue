<template>
    <div class="fadeIn">
        <component 
            :is="which_component_show"  
        ></component>
    </div>
</template>

<script>
import AD3000 from '../ActivePlan/3000.vue';

export default {
    data(){
        return{
            which_component_show:'AD3000',
        }
    },
    created(){
        // console.log(this.$route.params.type);
        
    },
    components:{
        AD3000
    }
}
</script>

