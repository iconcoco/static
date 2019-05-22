<template>
    <div class="step clearfix">
        <div 
            class="item"
            v-for="(item,index) in stepData" :key="index" 
            :class="{active:active == stepData.length-index}"
            :style="`order:${stepData.length-index}`"
            >
            
            <label>
                <span>{{stepData.length-index}}</span>{{item}}
            </label>

            <label v-if="index">
                <i class="el-icon-arrow-right"></i> 
            </label>

        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            stepData:[]
        }
    },
    props:['Data','active'],
    created(){
         this.Data.forEach((item,index)=>{
             this.stepData[this.Data.length - index-1] = item;
        });
    },
    watch:{
        Data(){
            this.stepData=[];
             this.Data.forEach((item,index)=>{
                this.stepData[this.Data.length - index-1] = item;
            });
        }
    }

}
</script>


<style lang="scss" scoped>
 @import "./../css/common/theme.scss";

.step{
    border-bottom: 1px solid #f1f1f1;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    padding: 20px 0;
    .item{
        text-align: center;
        // margin: 0 20px;
        >label{
           margin: 0 20px; 
        }
        span{
            display: inline-block;
            font-size: 12px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            line-height: 20px;
            text-align: center;
            color: #fff;
            background-color: #CCCCCC;
            margin-right: 15px;
            vertical-align: bottom;
        }
    }

    .active,
    .active ~ .item{
        color: $--color-primary-one;
        span{
            background-color: $--color-primary-one;
        }
    }
}

</style>
