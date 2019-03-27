<template>
<transition name="fade">
    <div>
        <el-form v-if="!consummateSuccess" class="consummate-form">
            <h2>绑定邮箱</h2>

            <div class="current-Accout">
                <span>当前账号</span>
                <span class="cares-color"> +86 {{form.phoneNo}}</span>
            </div>

            <el-form-item label="设置邮箱"  name="email">
                <input type="text" class="cares-input" name="email" @keyup.enter="bindSendEmail"  @blur="bindIptBlur('email')" v-model="form.email" placeholder="邮箱地址">
            </el-form-item>

            <p class="notice">作为您的登录邮箱</p>
            <p class="notice">找回密码以及其他验证操作也将通过邮件发送到此邮箱</p>

            <!-- <div class="form-item">
                <span>安全问题</span>
                <div class="item">
                    <i class="el-icon-info"></i>
                    <i class="el-icon-info bottom"></i>
                    <el-select name="safe" v-model="safety" placeholder="请选择安全问题">
                      <el-option 
                      v-for="(item,index) in safetyArr" :key="index"
                      :label="item.name"
                      :value="item.value"
                      ></el-option>
                    </el-select>
                    <el-input placeholder="请输入安全问题答案"></el-input>
                </div>
            </div> -->
            <div  @click="bindSendEmail" class="cares-button-primary">发送验证邮件</div>

        </el-form >

        <!-- 邮件发送成功的提示 -->
        <div v-if="consummateSuccess" class="consummate-success">
            <h2>邮件发送成功</h2>
           <!-- <span class="el-icon-circle-check regist-success "></span> -->
            <span class="success-email-icon success-fadeIn regist-success"></span>
            <p>激活邮件已发送至邮箱：</p>
            <p><span class="cares-color">{{emialArrd}}</span></p>
            <p>请进入邮箱查看邮件，并点击邮件中的链接绑定邮箱。</p>
             <h3>没收到邮件？</h3>
            <ul>
                <li>1. 请检查邮件地址是否正确，或<span @click="bindRewrite" class="cares-color">重新填写</span> </li>
                <li>2. 检查邮箱中的垃圾邮件</li>
                <li>3. 若仍未收到，请尝试<span @click="bindReSendEmail" class="cares-color">重新发送</span></li>
            </ul>
            <span @click="bindToAdmin" class="cares-button-primary pain">进入首页</span>
        </div>
    </div>
</transition>
</template>

<script>

 import VERICATION from './../../../js/verification.js';
 import { sendActiveEmail,saveUrlDataLog } from './../../../js/api.js';
 import DOMAIN from '../../../js/domain.js';

    export default {
        data(){
            return{
                consummateSuccess:false,
                safety:'',
                emialArrd:'',
                safetyArr:[
                    {name:'我的生日是什么',value:1},
                    {name:'我的名字',value:2},
                    {name:'我的家乡',value:3},
                    {name:'我的母校',value:4},
                ],
                form:{
                    phoneNo:'',
                    email:''
                },
                AjaxIng:false,
            }
        },
        created() {
            //获取之前注册的手机号码
           this.form.phoneNo = this.$route.params.phoneNo;
           if(!this.form.phoneNo) location.hash = "/regist";
        },
        mounted(){
          this.urlDataLog()
        },
        methods:{
            urlDataLog(){
              //埋点:绑定邮箱页面访问量
              saveUrlDataLog({
                /** 1.活动H5页点击量 
                 * 2."点击分享"按钮的点击量
                 * 3.通过H5进入注册页面的点击量
                 * 4.注册成功回到H5活动页的点击量
                 * 5.通过H5预注册用户数量
                 * 6.注册页的访问量
                 * 7.绑定邮箱页面访问量
                 * 8.绑定店铺页访问量 
                 * 9.实名认证页访问量 */
                type:'7'
              }).then(res=>{
              });
            },
            //发送邮件按钮
            bindSendEmail(){

                if(!VERICATION('email',this.form['email'])) return;

                if(this.AjaxIng) return;
                this.AjaxIng = true;

                sendActiveEmail(this.form).then(res=>{
                    this.AjaxIng = false;
                    if(res.code==0){
                        //发送激活邮箱成功
                        this.consummateSuccess = true;
                        this.emialArrd = res.data.email;
                    }else{
                        this.$Message.error(res.msg);
                    }

                });
              
            },
            //重新填写
            bindRewrite(){
                 this.consummateSuccess = false;
            },
            //重新发送邮件
            bindReSendEmail(){
                 sendActiveEmail(this.form).then(res=>{
                     this.$Message.success(res.msg);
                 });
            },
            //失去焦点的时候验证
            bindIptBlur(name){
                VERICATION(name,this.form[name]);
            },
             bindToAdmin(){
                // location.href = DOMAIN.carespay;
                location.hash="/activeEmail?source=regist"
            },
        }
    }
</script>

<style lang="scss" scoped>

    .success-email-icon{
        width: 80px;
        height: 80px;
    }

    .el-select{
        margin-bottom: 10px;
    }

    .consummate-form{
        padding-bottom: 60px;
        .account-no{
            line-height: 30px;
            height: 30px;
        }
        .cares-button-primary{
            width: 100%;
            margin-top: 60px;
        }
        .notice{
            padding: 0;
            text-align: left;
            font-size: 14px;
            color: #aaa;
        }
        .form-item{
            .item{
                i.bottom{
                    top:auto;
                    bottom: 0;
                }
            }
        }

        .current-Accout{
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }
    }

    .consummate-success{
        text-align: center;
        padding-bottom: 40px;
        p{
            padding: 0;
            font-size: 14px;
            line-height: 27px;
            text-align: left;
            margin-bottom: 8px;
        }
        h3{
            line-height: 30px;
            height: 30px;
            font-size: 16px;
            color: #999;
            text-align: left;
            font-weight: normal;
            margin-top: 30px;
        }
        .regist-success{
            margin-bottom: 40px;
        }
        ul{
            text-align: left;
             color: #999;
             margin-bottom: 20px;
            li{
                font-size: 14px;
                height: 30px;
                line-height: 30px;
                span{
                    cursor: pointer;
                }
            }
        }
    }

</style>


