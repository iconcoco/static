<template>
    <div class="fadeIn">
       <div class="error_page_container">
                <!-- <img src="../../../../images/carepay/404_01.png" alt="404"> -->
            <div class="error_text">
                <p>哟呵，似乎来到外星球</p>
                <h2>莫慌<span>NOT PANIC</span> </h2>
                <h3>系统维护升级中</h3>

                <p class="p_2">如有疑问，请咨询</p>
                <p> <a href="jascript:;"> 400-887-0201 </a></p>
            </div>
            <img class="error_img_1" src="../../../../images/carepay/404.png" alt="404">
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
    min-height: 600px;
    padding-top: 100px;
    text-align: center;

    .error_text{
        display: inline-block;
        width: 420px;
        vertical-align: middle;
        text-align: left;
        p{
            font-size: 18px;
            color: #333;
            font-weight: bold;
            a{
                display: inline-block;

                width: 200px;
                height: 48px;
                 font-size: 24px;
                font-weight: normal;
                line-height: 48px;
                text-align: center;
                color: #fff;
                background-color: $--color-primary-two;
                border-radius: 24px;

            }
        }
        .p_2{
            font-size: 22px;
            color: #999;
            font-weight: normal;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h2{
            font-size: 60px;
            color: #333;
            span{
                display: inline-block;
                line-height: 32px;
                font-size: 32px;
                color: #d0d0d0;
                width: 96px;
                margin-top: -10px;
                vertical-align: middle;
            }
        }
        h3{
            font-size: 48px;
            color: #333;
        }
    }


    .error_img_1{
        width: 529px;
        height: 422px;
        vertical-align: middle;
    }
}
</style>

