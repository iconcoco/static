<template>
 <transition name="fade">
    <div>
        <div class="complate-name ">

            <div class="complate-name-item clearfix">
                <label class="fl">证件信息</label>
                <div class="fl">
                     <div class="inner-box clearfix" style="margin-bottom:0px;">
                         <label class="title">证件类型：</label>
                         <div class="step">
                             <p class="nation">第二代居民身份证</p> 
                         </div>
                     </div>
                     <div class="inner-box clearfix">
                         <label class="title">证件照片：</label>
                         <div class="step">
                            <p v-if="[0,3].indexOf(form.status)>-1">请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p>
                            <ul class="clearfix">
                                <li>
                                        <p>身份证正面</p>
                                        <el-upload
                                        :disabled="!(auditStatus['cardFrontId']==0 || auditStatus['cardFrontId']==3)"
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardFrontId') }"
                                        :on-error="bindUploadError"
                                        :before-upload="bindBeforeUpload"
                                        >
                                            <label  class="l-1">
                                                <img v-if="form.cardFrontId" :src="`/general/download?fileId=`+form.cardFrontId" alt=""/>
                                            </label>
                                            <p>
                                                <a v-if="auditStatus.cardFrontId==0"  class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="auditStatus.cardFrontId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="auditStatus.cardFrontId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="auditStatus.cardFrontId==3" class="no" href="javascript:;">审核失败</a>
                                            </p>
                                        </el-upload>
                                </li>
                                <li>
                                        <p>身份证反面</p>
                                        <el-upload
                                        :disabled="!(auditStatus['cardAnotherId']==0 || auditStatus['cardAnotherId']==3)"
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardAnotherId') }"
                                        :on-error="bindUploadError"
                                        :before-upload="bindBeforeUpload"
                                        >
                                            <label   class="l-2">
                                                <img v-if="form.cardAnotherId" :src="`/general/download?fileId=`+form.cardAnotherId" alt="">
                                            </label>
                                            <p>
                                                <a v-if="auditStatus.cardAnotherId==0"  class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="auditStatus.cardAnotherId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="auditStatus.cardAnotherId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="auditStatus.cardAnotherId==3" class="no" href="javascript:;">审核失败</a>
                                            </p>
                                        </el-upload>
                                </li>
                                <li>
                                        <p>手持身份证</p>
                                        <el-upload
                                        :disabled="!(auditStatus['handHeldId']==0 || auditStatus['handHeldId']==3)"
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'handHeldId') }"
                                        :on-error="bindUploadError"
                                        :before-upload="bindBeforeUpload"
                                        >
                                            <label class="l-3">
                                                <img v-if="form.handHeldId" :src="`/general/download?fileId=`+form.handHeldId" alt="">
                                                <img v-if="!isReView"  class="example" src="../../../../images/carepay/example.png" alt="示例">
                                            </label>
                                            <p>
                                                <a v-if="auditStatus.handHeldId==0"  class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="auditStatus.handHeldId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="auditStatus.handHeldId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="auditStatus.handHeldId==3" class="no" href="javascript:;">审核失败</a>
                                            </p>
                                        </el-upload>
                                </li>
                                <li>
                                   <div class="uploading-icon"> 
                                       <span v-show="IMG_UPLOAD_ING" class="el-icon-loading cares-color"></span>
                                    </div>
                                    <a href="javascript:;" v-if="[0,3].indexOf(form.status)>-1" @click="bindShowIdPop" class="cares-color"> <i class="el-icon-search"></i> 查看示例</a>
                                </li>
                            </ul>
                         </div>
                     </div>
                </div>
            </div>

            <div class="complate-name-item clearfix">
                <label class="fl">常住地址</label>
                <div class="fl">
                    <el-form :model="form">
                        <p style="line-height:42px;margin-bottom:10px;" class="text"> 
                            <el-radio 
                            v-if="(auditStatus['residentialAddress']==0 || auditStatus['residentialAddress']==3)"
                            label="1" value="1">中国大陆</el-radio>
                            <span v-else>中国大陆</span>
                            <!--  <el-input type="text" class="nation-input" disabled value="中国大陆"></el-input> -->
                        </p>
                        <template v-if="auditStatus['residentialAddress']==0 || auditStatus['residentialAddress']==3">
                            <p>
                                <el-form-item class="select-container" name="provinceCode">
                                    <el-select 
                                    :disabled="!(auditStatus['residentialAddress']==0 || auditStatus['residentialAddress']==3)"
                                    v-model="form.provinceCode" name="provinceCode"  placeholder="请选择省份">
                                        <el-option 
                                            v-for="(item,index) in provinceArr" 
                                            :key="index"
                                            :label="item.provinceName"
                                            :value="item.provinceCode"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item class="fr select-container city-select" name="cityCode">
                                    <el-select 
                                    :disabled="!(auditStatus['residentialAddress']==0 || auditStatus['residentialAddress']==3)"
                                    v-model="form.cityCode" name="cityCode"   placeholder="请选择城市">
                                        <el-option 
                                            v-for="(item,index) in cityArr" 
                                            :key="index"
                                            :label="item.cityName"
                                            :value="item.cityCode"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </p>
                            <p> 
                                <el-form-item name="residentialAddress">
                                    <el-input type="text" 
                                    :disabled="!(auditStatus['residentialAddress']==0 || auditStatus['residentialAddress']==3)"
                                    @blur="bidnAddIptBlur" v-model="form.residentialAddress" name="residentialAddress" class="add-input" placeholder="填写至街道门牌详细地址"></el-input>
                                </el-form-item>
                            </p>
                        </template>
                        <p v-else> <span class="text">{{data.province}}{{data.city}}{{data.residentialAddress}}</span> </p>
                    </el-form>
                </div>
            </div>

            <p class="btn">
                <template v-if="!isReView">
                    <!-- <span  @click="bindPreButton"  class="cares-button-primary pain">上一步</span> -->
                    <span  @click="bindConfirmNext" class="cares-button-primary">确认提交</span>
                </template>
                <template>
                    <span v-if="form.status==3"  @click="bindConfirmNext" class="cares-button-primary">重新提交</span>
                </template>
                
            </p>
        </div>

        <!-- 手持身份证示例弹窗 -->
        <div class="complate-name-pop">
            <el-popover v-model="showIdPop">
                <div class="content" :class="{fadeIn:showIdPop}">
                     <i @click="bindCloseIdpop" class="el-icon-close pop-del"></i>
                    <h3>图片示例</h3>
                    <div class="clearfix idCard">
                        <p class="fl">
                           <span>身份证正面</span>
                           <label class="img">
                               <img src="../../../../images/carepay/id-n.png" alt="身份证证明">
                           </label>
                        </p>
                        <p class="fr">
                           <span>身份证反面</span>
                           <label class="img">
                               <img src="../../../../images/carepay/id-s.png" alt="身份证反面">
                           </label>
                        </p>
                    </div>
                    <div class="guide">
                        <label>
                            <img src="../../../../images/carepay/hold_img.png" alt="手持身证份拍照">
                        </label>
                        <div class="item">
                            <p>手持身份证示例</p>
                            <p class="info">
                                手持身份证照片需要同时露出身份证信息与本人头像,请手持<span>最新办理</span>的身份证。保证照片中<span>本人头像与身份证信息面文字清晰可识别并真实有效。</span>
                            </p>
                            <p>图片格式为jpg/jpeg/png/bmp。单张小于10M</p>
                        </div>
                    </div>
                </div>
            </el-popover>
        </div>
    </div>
 </transition>
</template>

<script>
    import '../../../../css/carespay/complete.scss';
    import VERICATION from './../../../../js/verification.js';

    import {
        uploadefile,    //文件上传的接口
        personInfoAdd,  //添加实名认证
        updatePersonInfo //修改实名认证的接口
    } from './../../../../js/api.js';

     import {
        queryCustomerInfo,                              //客户信息
        queryProvinceList,                              //省份列表
        queryCityData,                                  //城市数据
        queryPersonInfo,                                //实名认证的信息
    } from '../../utils/localbase.js';

    export default {
        data(){
            return{
                fileActive:uploadefile,
                showIdPop:false,
                provinceArr:[],                 //省份数组
                cityArr:[],                     //城市数组
                form:{
                    businessLocation :'CHN', 
                    nationality:'CHN', 
                    phoneNo:'',                 //当前注册的手机号
                    cardFrontId:'',             //身份证正面id
                    cardAnotherId:'',           //身份证反面id
                    handHeldId:'',              //手持照id
                    provinceCode:'',            //省
                    cityCode:'',                //市
                    residentialAddress:'',                 //详细地址
                    type:'1',
                    status: 0                    //审核总状态  1. 待审核 2. 审核通过  3. 审核失败
                },
                AjaxIng:false,

                //2019-1-11
                isReView:false,
                auditStatus:{ //实名认证的各种状态
                    cardFrontId:0  ,        // 证件正面照
                    cardAnotherId:0  ,      // 证件反面照
                    handHeldId:0  ,         // 手持照id
                    residentialAddress:0  , // 省份以及地址
                },


                //正在上传图片的Loding
                IMG_UPLOAD_ING:false,
                
            }
        },
        props:["INCOM","data","AfterJumpFn"],
        created() {
            this.form.type = this.$route.query.type || 1;                            //个人还是公司

            Promise.all([
                queryCustomerInfo(),
                queryProvinceList()
            ]).then(res=>{
                let [customerInfo,province] = res;

                this.form.phoneNo = customerInfo.phoneNo         //当前手机号
                this.provinceArr = province          //省份
            });

            if(this.INCOM=='R_NAME'){
                if(Object.keys(this.data).length>0){
                    this.isReView = true, //回显
                    this.enterpriseInfo(this.data);
                }
            }
        },
        mounted(){
            
        },
        methods:{
            //弹出身份证上传示例
            bindShowIdPop(){
                this.showIdPop = true;
            },
            //关闭身份证上传示例
            bindCloseIdpop(){
               this.showIdPop = false; 
            },
            //下一步按钮验证
            bindConfirmNext(){

                var must = ['cardFrontId','cardAnotherId','handHeldId','provinceCode','cityCode','residentialAddress'];

                for(let i =0; i<must.length;i++){
                    if(!VERICATION(must[i],this.form[must[i]])) return;
                }

                
                if(this.AjaxIng) return;
                this.AjaxIng = true;
                /**
                 * 请求成功之后跳转（判断）
                 * 1. 成功页
                 * 2. 添加银行卡账号页面
                 * 3. 添加店铺页
                 */

                this.$emit('watchIsFillDone',true); //是否已经完成实名认证
                //请求上传
                if(this.INCOM){ 
                    // 个人实名认证的编辑重新提交
                    updatePersonInfo(this.form).then(res=>{
                        this.AjaxIng = false;
                        if(res.code==0){
                            this.$store.commit('setBaseDate',{
                                key:`personInfo`,
                                data:null
                            });
                            this.AfterJumpFn();
                        }else{
                            this.$Message.error(res.msg);
                        }
                    });
                }else{
                     // 个人实名认证的首次提交

                     personInfoAdd(this.form).then(res=>{
                        this.AjaxIng = false;
                        res.code==0 ? 
                        // (this.$Message.success(res.msg),location.hash = '/Complete_bankAccount?completeType=1'):
                        (this.AfterJumpFn()):
                        this.$Message.error(res.msg);
                    });
                }
                
            },
            //上一步按钮
            bindPreButton(){
                location.hash = '/Complete_Account';
            },
            //详细地址失去焦点的时候触发的事件
            bidnAddIptBlur(){
                VERICATION('residentialAddress',this.form['residentialAddress']);
            },
            bindBeforeUpload(){
                this.IMG_UPLOAD_ING = !this.IMG_UPLOAD_ING;
            },
            //文件上传成功
            bindUploadSuccess(res,file,name){
                this.IMG_UPLOAD_ING = !this.IMG_UPLOAD_ING;
               if(res.code==0){
                   this.form[name] = res.data.uuid
               }else{
                    this.$Message.error(res.msg);
               }
            },
            //文件上传失败
            bindUploadError(err, file,){
                this.$Message.error(`上传失败，请重新上传！`);
            },

            //2019-1-11  身份证信息回显
            enterpriseInfo(res){
                for (const key in this.form) {
                     if(['type','businessLocation'].indexOf(key)<0){
                         this.form[key] = res[key] || '';
                     }
                }

                 //2.法人审核状态
                res.auditInfoVoList && res.auditInfoVoList.forEach(item=>{
                    //审核的key是否在法人审核状态的列表中
                    if( (item.auditField) in this.auditStatus){
                        this.auditStatus[item.auditField] = item.auditStatus;
                    }
                });
            }
        },
        watch:{
            //监听省份的选择发生变化
            watchProvince(n,o){
                //请求城市接口
                queryCityData(n).then(res=>{
                    this.cityArr = res;
                });
                 if(!o) return;
                this.form.cityCode='';//城市回到没选择的状态
            }
        },
        computed:{
            watchProvince(){
                return this.form.provinceCode;
            }
        } 
    }
</script>

<style lang="scss" scoped>
    .check-ing{
        color: #999;
    }
</style>


<style  lang="scss">
    .complate-name-pop{
        .el-popover{
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 10;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,.5);
            border: 0;
            box-shadow: 0;
            .content{
                position: absolute;
                width:669px;   
                height: 510px;
                border-radius: 8px;
                background-color: #fff;
                left: 50%;
                margin-left: -334px;
                padding: 0 65px;
                padding-top: 18px;
                h3{
                    line-height: 54px;
                    text-align: left;
                    font-size: 20px;
                    color: #333;
                    font-weight:normal;
                }
                .idCard{
                    margin-top: 15px;
                    p{
                        width: 246px;
                        text-align: left;
                        span{
                            line-height: 50px;
                            color: #333;
                            font-size: 14px;
                            text-align: left;
                        }
                        .img{
                            display: inline-block;
                            width: 247px;
                            height: 156px;
                            img{
                                width: 100%;
                                height: 100%;
                                vertical-align: top;
                            }
                        }
                    }
                }
                .guide{
                    margin-top: 45px;
                    label{
                        display: inline-block;
                        width: 150px;
                        vertical-align: middle;
                        margin-right: 20px;
                        img{
                            width: 150px;
                            height: 150px;
                        }
                    }
                    .item{
                        width: 274px;
                        display:inline-block;
                        vertical-align: middle;
                        p{
                            line-height: 20px;
                            font-size: 12px;
                        }
                        .info{
                            margin:15px 0;
                            span{
                                cursor: pointer;
                                color: red;
                            }
                        }
                    }
                }
            }
            .pop-del{
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
            }
        }
    }
</style>



