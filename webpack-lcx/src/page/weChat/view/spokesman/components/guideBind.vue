<template>
    <div class="guideToBind">
        <img src="../../../../../images/weChat/queshengye.png" alt="">
        <p>未绑定收款账号，暂无法查看</p>
        <button @click="toBindAccount">绑定收款账号</button>
    </div>
</template>

<script>
    export default{
        data(){
            return{}
        },
        created() {
            // spokesAccount
        },
        methods:{
            toBindAccount(){
                this.$router.push({name:"spokesAccount"});//添加账户的页面
            }
        }
    }
</script>
