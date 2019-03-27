<template>
    <div class="complate-name-pop">
        <el-popover v-model="showIdPop">
            <div class="content" :class="{fadeIn:showIdPop}">
                <i @click="bindCloseIdpop" class="el-icon-close pop-del"></i>
                <slot></slot>
            </div>
        </el-popover>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                showIdPop:false
            }
        },
        props:['value'],
        created(){
            this.showIdPop = this.value; 
        },
        watch:{
            "value"(val){
                this.showIdPop = val;
            }
        },
        methods:{
            bindCloseIdpop(){
                this.$emit("input",false);
            }
        }
    }
</script>


<style lang="scss" scoped>
.complate-name-pop .el-popover{
    .content{
        height: auto;
        padding: 20px 40px;
        max-height: 95%;
        overflow: auto;
    }
}

</style>

