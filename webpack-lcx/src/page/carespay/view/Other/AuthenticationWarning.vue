<template>
    <div>
        <AdminModel v-model="modelFlag"
            class="AuthenticationWarning"
        >
            <div class="center"><span class="infor-icon"></span></div>
            <p>{{txt}}</p>
            <!-- <p>您的实名认证资料待完善，为了不影响您的提现和CaresPAY其他服务，请您继续完善信息！</p> -->
            <div class="center">
                <span :class="{pain:paint=='left'}" @click="bindToCloseModel()" class="cares-button-primary">{{btnOneTxt || '继续完善'}}</span>
                <span :class="{pain:paint=='right'}" @click="bindToCloseModel('later')" class="cares-button-primary">{{btnTwoTxt || '稍后完善'}}</span>
            </div>
        </AdminModel>
    </div>
</template>

<script>
import AdminModel from './../../../../components/adminModel.vue';
export default {
    data(){
        return{
            modelFlag:false
        }
    },
    props:['value','txt','btnOneTxt','btnTwoTxt','paint'],
    //paint  空心的位置
    created(){
        this.modelFlag = this.value;
    },
    watch:{
        "modelFlag"(n){
            this.$emit("input",n);
        },
        "value"(n){
            this.modelFlag = n; 
        },
    },
    methods:{
        bindToCloseModel(parmas){
            this.modelFlag = false;

            parmas && this.$emit('exit',true);
        }
    },
    components:{
        AdminModel
    }
}
</script>

<style lang="scss" scoped>
    .center{
        text-align: center;
    }
    .infor-icon{
        width: 60px;
        height: 60px;
    }
    p{
        font-size: 14px;
        text-indent: 2em;
        margin: 20px 0;
    }
    span{
        margin: 0 10px;
    }
</style>

<style lang="scss">
.AuthenticationWarning{
    .modal-container{
        width:360px;
        left:50%;
        margin-left:-180px;
        padding-top:20px;
        padding-bottom:20px;
        background-color:#fff;
    }
}
</style>

