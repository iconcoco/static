<template>
 <transition name="fade">
   <div class="weixin-container">
        <h2 class="personal-module-title">绑定微信</h2>
        <form>
            <div class="weChatcode">
                <!--二维码图片-->
                <div class="ercodeImg">
                    <span></span>
                </div>

                <!--文本提示1-->
                <p class="descript_one">
                    使用微信扫描二维码
                </p>
                <!--文本提示2-->
                <p class="descript_two">
                    绑定微信后可随时随地查看账户到账以及账户余额状况
                </p>

            </div>
        </form>
    </div>
 </transition>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss">
     .weixin-container{
        padding:0px 20px;
        margin-left: 10px;
        h2.personal-module-title{
            padding:0px 10px;
            height: 92px;
            line-height: 92px;
        }
        form{
            padding:0px 10px;
            min-height: 785px;
            padding-top:90px;
            //微信二维码
            .weChatcode{
               width:369px;
               height: 435px;
               margin:0 auto;
               border:1px solid #eee;
               border-radius: 3px;
               .ercodeImg{
                   padding-top:88px;
                   margin-bottom: 62px;
                   >span{
                       display: block;
                       width:176px;
                       height: 171px;
                       margin:0 auto;
                       background-color: oldlace;
                   }
               }
            }
            //文本描述1
            .descript_one{
                text-align: center;
                font-size: 16px;
                color:#666;
                font-family: 'MicrosoftYaHei';
                font-weight: 700;
                letter-spacing: 1px;
                padding-bottom: 18px;
            }
            //文本描述2
            .descript_two{
                text-align: center;
                font-size: 14px;
                color:#666;
                font-family: 'MicrosoftYaHei';
                padding:0px 61px;
            }
        }
    }
</style>
