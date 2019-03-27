<template>
    <div class="fadeIn">
        <div class="AdminPlate">
            <div class="success success-fadeIn">
                <span class="success-icon"></span> 提交成功
            </div>
            <template v-if="source=='Authentication'">
                <p>您提交的实名认证信息将于2个工作日内审核完毕，待审核通过发放收款子账号，您可在<router-link class="cares-color" to="/Pesonal/realname?isactive=1">实名认证</router-link>页面查看审核状态</p>
                <p><span class="cares-color">{{text}}</span>秒后自动跳转至首页</p>
            </template>

            <template v-if="source=='AddCashAccount'">
                <p>提现账户将于2个工作日内审核完毕，您可在<a class="cares-color" href="javascript:;"  @click="jumpRouter('CashAccountContainer')">我的提现账户</a>页面查看提现账户审核状态</p>
                <p class="btn">
                    <a class="cares-button-primary" @click="jumpRouter('CashAccountContainer')">继续添加提现账户</a>
                    <a class="cares-button-primary pain" @click="jumpRouter('AdminIndex')">返回首页</a>
                </p>
            </template>

            <template v-if="source=='AddStore'">
                <p>收款账户将于2个工作日内审核完毕后发放，您可在<a class="cares-color" href="javascript:;"  @click="jumpRouter('StoreManage')">店铺管理</a>页面点击店铺名称进行查看</p>
                <p class="btn">
                    <a class="cares-button-primary" @click="jumpRouter('AddShop')">继续添加店铺</a>
                    <a class="cares-button-primary pain" @click="jumpRouter('StoreManage')">返回店铺管理</a>
                </p>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            source:'Authentication',
            text: 5,
            timeId:null
        }
    },
    created(){

        let source = this.$route.params.source || "";
        this.source = source;
        switch(source.toUpperCase()){
            case 'AUTHENTICATION':
            {   
                let t = 5;
                this.timeId = setInterval(()=>{
                    t--;
                    this.text=t;
                    if(t<=0){
                        this.jumpRouter('AdminIndex');
                        clearInterval(this.timeId);
                    }
                },1000);
            }
            break;
        }
    },
    methods:{
        jumpRouter(name){
            this.$router.push({
                name
            }); 
        },
    },
    destroyed(){
        clearInterval(this.timeId);
    }
}
</script>



<style lang="scss" scoped>
.AdminPlate{
    padding-top: 20px;
    padding-bottom: 20px;
    min-height: 300px;
    p{
        line-height: 30px;
        font-size: 14px;
        color: #333;
    }

    .success{
        font-size: 20px;
        margin-bottom: 20px;
        color: #57c22d;
        // opacity: 0;
        span{
            margin-right: 10px;
        }
    }

    .btn{
        margin-top: 20px;
        .cares-button-primary{
            margin-right: 20px;
        }
    }
}


</style>
