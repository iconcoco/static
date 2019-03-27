<template>
 <transition name="fade">
    <div>
        <div class="complate-account">
            <h2 class="banner-module-title">完善资料</h2>
            <div class="complate-account-item clearfix">
                <label class="fl">选择账号类型</label>
                <div class="fl">
                    <!-- <span>请您选择之后将要提现的银行卡类型</span> -->
                    <label for="per_bank" :class="{active:type=='1'}">个人账号</label>
                    <label for="com_bank" :class="{active:type=='2'}">企业账号</label>

                    <input id="per_bank" value="1" v-model="type" type="radio"/>
                    <input id="com_bank" value="2" v-model="type" type="radio"/>

                    <p class="notice">注：账号类型提交后将无法修改，请仔细阅读下方账号差异说明再选择。</p>
                    <p>问：注册CaresPAY企业账户和CaresPAY个人账户有什么不同？</p>
                    <p class="answer">答：个人账号仅支持提现到个人银行卡，企业账号仅支持提现到企业公司账户。</p>
                </div>
            </div>

            <span @click="bindNextButton" class="cares-button-primary pain next">下一步</span>
        </div>

         <AuthenticationWarning 
        v-model="authentyWarning"
         txt="您的实名认证资料待完善，为了不影响您的提现和CaresPAY其他服务，请您继续完善信息！"
        @exit="canIleaveNow"
        paint="right"
        >
        </AuthenticationWarning>
    </div>
 </transition>
</template>

<script>

import AuthenticationWarning from './../Other/AuthenticationWarning.vue';

    export default {
        data(){
            return{
                type:'1',       //1.个人  2.企业

                authentyWarning:false,
                SDONE:false,
                NextTo:null,
            }
        },
        components:{
            AuthenticationWarning
        },
        methods:{
            bindNextButton(){
                //完成
                this.ISDONE=true;

                let name = null;

                this.type==1 ? name='AuthenticationPersonal':name='AuthenticationCompany';

                this.$router.push({
                    name,
                })
            },
            canIleaveNow(bol){
                bol && (
                    this.ISDONE=true,
                    this.$router.push({
                        name:this.NextTo.name
                    })
                );
            },
        },
         beforeRouteLeave(to,from,next){
            if(this.ISDONE){
                next();
            }else{
                this.authentyWarning = true;
                this.NextTo = to;
                next(false);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .next{
        margin:33px 0 33px 152px;
        width: 80px;
    }

</style>

<style lang="scss">
@import './../../../../css/common/theme.scss';
    .complate-account{
        padding: 0 38px;
   
        .complate-account-item{
            padding: 20px 0 25px;
            border-bottom: 1px solid #f1f1f1;
            label{
                display: inline-block;
                width: 152px;
                line-height: 42px;
                color: #666;
                font-size: 14px;
            }
            >div{
                 input{
                    display: none;
                }

                label{
                    display: inline-block;
                    height: 36px;
                    line-height: 36px;
                    width: 207px;
                    border: 1px solid #eee;
                    box-sizing: border-box;
                    text-align: center;
                    cursor: pointer;
                    margin-right: 10px;
                    border-radius:18px;
                    transition:all .2s;
                }
               
                label.active{
                     background-color: $--color-primary-two;
                     border-color:$--color-primary-two;
                    color:#fff;
                    &:hover{
                         box-shadow: 0 4px 4px $--color-primary-two-hover;
                    }
                }
            }

            p{
                font-size:12px;
                color:#333;
                margin:10px 0;
                &.notice{
                    color:$--color-primary-danger;
                    font-weight:bold;
                    margin-top:20px;
                }
                &.answer{
                    color:#aaa;
                }
            }

        }

     }
</style>


