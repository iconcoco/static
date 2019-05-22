<template>
    <div class="fadeIn">
       <div class="error_page_container">
                <!-- <img src="../../../../images/carepay/404_01.png" alt="404"> -->
            <img class="error_img_1" src="../../../../images/carepay/404.png" alt="404">
            <p>抱歉，您访问的页面不存在</p>
            <p>如有紧急问题，请拨打客服电话：<span>400-887-0201</span> </p>
            <p> 
                <router-link to="/" class="cares-button-primary">返回首页</router-link>
            </p>
       </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{

            }
        },
        created(){
            // console.log(`刷新呗`);
            this.$router.push({
                name:this.$route.params.name,
                query:this.$route.query
            });
        }
    }
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
.error_page_container{
    min-height: 450px;
    padding-top: 100px;
    text-align: center;

    p{
        text-align: center;
        font-size: 20px;
        color: #333;
        line-height: 45px;
        span{
            color: $--color-primary-one;
            text-decoration: underline;
        }
    }

    a.cares-button-primary{
        font-size: 20px;
        height: 46px;
        line-height:  46px;
        border-radius: 23px;
        padding-left: 30px;
        padding-right: 30px;
        margin-top: 30px;
    }


    .error_img_1{
        width:220px;
        height: 116px;
        vertical-align: middle;
        margin-bottom: 30px;
    }
}
</style>

