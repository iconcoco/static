<template>
    <div class="fadeIn">
        <div class="complate-name ">

            <div class="complate-name-item clearfix">
                <label class="fl">证件信息</label>
                <div class="fl">
                     <div class="inner-box clearfix" style="margin-bottom:0px;">
                         <label class="title">证件类型：</label>
                         <div class="step" style="line-height:42px;">
                             <el-select v-model="form.hkDirectorIdcardType" placeholder="请选择证件类型">
                                <el-option :value="1" label="第二代居民身份证"></el-option>
                                <el-option :value="2" label="护照"></el-option>
                                <el-option :value="3" label="香港永久性居民身份证"></el-option>
                             </el-select>
                         </div>
                     </div>
                     <div class="inner-box clearfix">
                         <label class="title">证件照片：</label>
                         <div class="step">
                            <p>请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p>
                            <ul class="clearfix" v-if="form.hkDirectorIdcardType">
                                <li>
                                    <p>
                                        <template v-if="form.hkDirectorIdcardType==2">护照信息页</template>
                                        <template v-else>身份证正面</template>
                                    </p>
                                    <label  class="l-1">
                                        <img alt=""/>
                                    </label>
                                    <p>
                                        <a class="cares-color" href="javascript:;">点击上传</a>
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <template v-if="form.hkDirectorIdcardType==2">手持护照照片</template>
                                        <template v-else>手持身份证</template>
                                    </p>
                                    <label  class="l-1">
                                        <img alt=""/>
                                    </label>
                                    <p>
                                        <a class="cares-color" href="javascript:;">点击上传</a>
                                    </p>
                                </li>
                                <li>
                                   <div class="uploading-icon"> 
                                       <span class="el-icon-loading cares-color"></span>
                                    </div>
                                    <a href="javascript:;" class="cares-color" @click="bindToShowModal"> <i class="el-icon-search"></i> 查看示例</a>
                                </li>
                            </ul>
                         </div>
                     </div>
                </div>
            </div>

            <div class="complate-name-item clearfix">
                 <label class="fl">常住地址</label>
                 <div class="fl">
                     <el-form>
                        <p> 
                            <el-form-item>
                                <el-radio label="1" value="1">中国香港</el-radio>
                                <!--  <el-input type="text" class="nation-input" disabled value="中国大陆"></el-input> -->
                            </el-form-item>
                        </p>
                        <p> 
                            <el-form-item name="residentialAddress">
                                <el-input 
                                type="text" 
                                name="residentialAddress" class="add-input" placeholder="填写至街道门牌详细地址"></el-input>
                            </el-form-item>
                        </p>
                     </el-form>
                 </div>
            </div>

            <p class="btn">
                <span  class="cares-button-primary" @click="bindConfirmNext">确认提交</span>
            </p>
        </div>

              <!-- 手持身份证示例弹窗 -->
        <FadeModel v-model="showIdPop">
            <h3>图片示例</h3>
            <p class="warning-notice">请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp</p>
            <div class="clearfix idCard">
                <template v-if="form.hkDirectorIdcardType != 2">
                    <p class="fl">
                        <span>身份证正面</span>
                        <img src="../../../../images/carepay/hkid-f.jpg" alt="身份证证明">
                    </p>
                    <p class="fr">
                        <span>身份证反面</span>
                        <img src="../../../../images/carepay/hkid-n.jpg" alt="身份证反面">
                    </p>
                </template>

                <template v-else>
                    <p style="line-height:30px;">护照信息页</p>
                    <img src="../../../../images/carepay/hkhz.png" alt="护照信息页">
                </template>
            </div>
            <p style="color:#333;line-height:30px;">手持证件照</p>
            <img src="../../../../images/carepay/hkhold.jpg" alt="手持身证份拍照">
            <div class="guide">
                <div class="item">
                    <p class="t">正确示例说明：</p>
                    <p>手持{{form.hkDirectorIdcardType==2?"护照信息页":"身份证"}}照片需要同时露出{{form.hkDirectorIdcardType==2?"护照信息页":"身份证"}}信息与本人头像，请手持最新办理的护照。保证照片中本人头像与{{form.hkDirectorIdcardType==2?"护照信息页":"身份证"}}文字清晰可识别并真实有效。</p>
                </div>
                <div class="item error">
                    <p class="t">常见错误：</p>
                    <p>1. 脸部被手或护照信息页遮挡</p>
                    <p>2. 图片模糊，无法识别护照信息页上信息</p>
                    <p>3. {{form.hkDirectorIdcardType==2?"护照信息页":"身份证"}}上信息被遮住无法识别</p>
                </div>
            </div>
        </FadeModel>
    </div>
</template>


<script>
import FadeModel from './../../../../components/fadeModel.vue';
export default {
    data(){
        return{
            form:{
                businessLocation :'HKG', 
                nationality:'HKG', 
                phoneNo:'',                 //当前注册的手机号
                hkDirectorIdcardType:'',

                cardFrontId:'',             //身份证正面id
                cardAnotherId:'',           //身份证反面id
                handHeldId:'',              //手持照id

                residentialAddress:'',                 //详细地址
                type:'1',
                status:'0',                    //审核总状态  1. 待审核 2. 审核通过  3. 审核失败
            },

            showIdPop:false
        }
    },
    methods:{
        bindToShowModal(){
            this.showIdPop = true;
        },
        bindConfirmNext(){
             /**
             * 请求成功之后跳转（判断）
             * 1. 成功页
             * 2. 添加银行卡账号页面
             * 3. 添加店铺页
             */
            this.$router.push({
                name:"AuthenticationDone",
                params:{
                    source:'Authentication',
                }
            });
        }
    },
    watch:{
        "form.hkDirectorIdcardType"(){ 
            console.log(`香港证件类型发生变化了`);
         }
    },
    components:{
        FadeModel
    }
}
</script>


<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
.complate-name-pop 
.el-popover 
.content{
    .idCard{
         margin-top: 0px;
        img{
            width:270px;
        }
    }
    img{
            width:270px;
            margin-bottom: 20px;
        }
    .guide{
        margin-top: 0px;
        .item{
            width: 45%;
            vertical-align: top;
            .t{
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: bold;
            }
        }
        .error{
            color: $--color-primary-danger;
            margin-left: 20px;
        }
    }
}
</style>
