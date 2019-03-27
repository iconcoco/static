<template>
    <div class="ActiveEmail-container banner"> 
        <h2>{{isActive?'即将进入首页...':'正在激活请耐心等候...'}}</h2>

        <h3 v-if="!isReist" class="no">恭喜！邮箱激活成功</h3>

        <template v-else>
            <p>CaresPAY第三安全小组提醒您：</p>
            <p>收款千万笔，安全第一条。</p>
            <p>邮箱要激活，密码好找回。</p>
        </template>

        <div v-if="isActive" class="cares-button-primary pain" @click="jump">{{num}}秒进入首页</div>
    </div>
</template>

<script>

    import { 
        activeEmail,
        } from './../../../js/api.js';

    import domain from '../../../js/domain.js'

    export default {
        data(){
            return{
                num:10,
                isActive:false,
                isReist:false
            }
        },
        created() {

            let _this = this;

            if(this.$route.query.source=='regist'){
                this.isActive = true;
                this.isReist = true;

               let timeId = setInterval(()=>{
                   this.num--;
                   if(this.num<=0){
                       _this.jump();
                       clearInterval(timeId);
                   }
               },1000);
               
            }else{

                activeEmail({
                    info:unescape(location.href.split('=')[1])
                }).then(res=>{

                    if(res.code==0){
                        //2018-12-6  流程优化
                        //  location.href = domain.carespay;
                        this.isActive = true;

                        let timeId = setInterval(()=>{
                            this.num--;
                            if(this.num<=0){
                                _this.jump();
                                clearInterval(timeId);
                            }
                        },1000);

                    }else{
                    this.$Message.error(res.msg);
                    }
                })
                
            }
         
        },
        methods:{
            jump(){
                location.href = domain.carespay;
            }
        }
    }
</script>


<style lang="scss" scoped>
    .ActiveEmail-container{
        margin: 10px auto;
        background-color: #fff;
        padding: 40px 20px;
        text-align: center;
        color: #333;
        h2{
            font-weight: normal;
            margin-bottom: 30px;
        }
        p{
            line-height: 30px;
            font-size: 14px;
            color: #666;
        }
        .cares-button-primary{
            margin-top: 30px;
        }
    }
</style>
