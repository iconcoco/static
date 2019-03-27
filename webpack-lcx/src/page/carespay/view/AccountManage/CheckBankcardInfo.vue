<template>
 <transition name="fade">
    <div class="c-bank-container">
        <form>
            <h2 class="banner-module-title">
                银行卡信息
               <template v-if="this.status">
                    <span> <i class="el-icon-warning"></i> {{this.form.remark ? this.form.remark:'此提现账户资料有误，请重新填写'}}</span>
                    <a href="javascript:;" class="fr editButton cares-button-primary"  @click="bindJumpToEdit" >编辑提现账户</a> 
               </template>
               <a href="javascript:;" v-if="form.status!=1" @click="bindDeleteAccout" class="cares-button-danger fr editButton">删除提现账户</a>
            </h2>

            <div class="form-item line">
                <span>提现账户类型</span>
                <div class="item">
                     {{form.holderType==2?'企业账户':'个人账户'}}
                </div>
            </div>
            
            <div class="form-item line">
                <span>开户地区</span>
                <div class="item">
                     {{form.currency=='USD'?'香港地区':'大陆地区'}}
                </div>
            </div>

            <div class="form-item line">
                <span>提现人姓名</span>
                <div class="item">
                     {{form.accountName}}
                </div>
            </div>

             <div class="form-item line">
                <span>银行卡号</span>
                <div class="item">
                     {{numberCodeFormat(form.bankNumber)}}
                </div>
            </div>

            <div class="form-item line">
                <span>银行名称</span>
                <div class="item">
                     {{form.bankName}}
                </div>
            </div>

            <div v-if="form.holderType==2 && form.currency=='CNY'" class="form-item line">
                <span>支行名称</span>
                <div class="item">
                     {{form.branchName}}
                </div>
            </div>
            <!-- <div class="form-item line">
                <span>币种</span>
                <div class="item">
                     {{form.currency}}
                </div>
            </div> -->
            <!-- v-if="form.currency=='CNY'"  -->

            <div class="form-item line">
                <span>预留手机号</span>
                <div class="item">
                     {{numberCodeFormat(form.reservedPhoneNo)}}
                </div>
            </div>

        </form>
    </div>
 </transition>
</template>

<script>

    import { 
        queryAccountDetail,             //获取提现账户详情
        
    } from '../../../../js/api.js';

     import {
        hideNumberCode
     } from '../../../../js/common.js';

    import { 
        queryBankInfoDetail,            //获取对应银行卡详情
    } from '../../utils/localbase.js'


    export default {
        data(){
            return{
                form:{
                    accountName:'',
                    bankName:'',
                    bankNumber:'',
                    branchName:'',
                    currency:'',
                    holderType:'',
                    reservedPhoneNo:'',
                    status:'1',
                    remark:'',
                }
            }
        },
        props:['status','id'],
        created(){
            this.loadingQuery(this.id);
        },
        methods:{
            numberCodeFormat(n){
                return hideNumberCode(n);
            },
            //页面数据的请求加载
            loadingQuery(ID){

                queryBankInfoDetail(ID).then(res=>{
                    Object.assign(this.form,res);
                });

            },
            //如有编辑账号按钮，跳转到编辑的账号
            bindJumpToEdit(){
                this.$emit("switchConponet",{
                    holderType:2,//1个人  2 企业
                    switch:'edit'
                })
            },
            //删除银行卡
            bindDeleteAccout(){
                this.$emit("switchConponet",{switch:'delete'});
            }
        },
        watch:{
            id(n){//监视银行ID是否发生变化
                this.form = {
                     accountName:'',
                    bankName:'',
                    bankNumber:'',
                    branchName:'',
                    currency:'',
                    holderType:'',
                    reservedPhoneNo:'',
                };
                this.loadingQuery(n);
            }
        }
    }
</script>

<style lang="scss" scoped>
.c-bank-container{
    min-height: 600px;
}
    .form-item{
        padding: 20px 0;
    }
    .banner-module-title{
        span{
            font-size: 12px;
            color: red;
            margin-left: 20px;
        }
    }
    .editButton{
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
        border-radius: 14px;
        margin-top: 25px;
        margin-left: 10px;
        font-size: 12px;
    }
</style>

