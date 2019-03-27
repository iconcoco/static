<template>
<transition name="fade">
    <div>
        <el-form :model="form" class="reset-psw">
            <h2>重置密码</h2>

            <el-form-item label="新密码" name="password" class="is-required">
                <input :type="InputType.password" @keyup="bindIptKeydown" maxlength="20" @blur="bindIptBlur('password')" v-model="form.password" name="password" placeholder="请输入您的新密码" class="cares-input" >
                <i :class="`${InputType.password=='password'?'i-c-eye':'i-o-eye'}`" @click="bindChangeIptType('password')"></i>
            </el-form-item>

            <template v-if="form.password.length">
                <p>密码规则：包含数字、大小写字母、特殊字符任意两种或以上6-20字符</p>
                <p class="progress-psw-bar" :class="step.clas">
                    <span class="one"></span>
                    <span class="two"></span>
                    <span class="three"></span>
                    <b>{{step.text}}</b>
                </p>
            </template>

            <el-form-item label="确认密码" name="confirmPsw" class="is-required">
                <el-input :type="InputType.confirmPsw"  name="confirmPsw"  @blur="bindIptBlur('confirmPsw')" v-model="form.confirmPsw"  placeholder="请输入您的新密码"></el-input>
                <i :class="`${InputType.confirmPsw=='password'?'i-c-eye':'i-o-eye'}`" @click="bindChangeIptType('confirmPsw')"></i>
            </el-form-item>

            <div class="cares-button-primary" @click="bindResetPwd">提交</div>
        </el-form>
    </div>
</transition>
</template>

<script>

 import VERICATION from './../../../js/verification.js';
 import { resetPassword } from './../../../js/api.js';
 import DOMAIN from '../../../js/domain.js'

    export default {
        data(){ 
            return{
                form:{
                    password:'',
                    confirmPsw:'',
                    strength:'',    //密码强度
                },
                activeClass:``,
                step:`低`,
                AjaxIng:false,

                step:{
                    clas:``,
                    text:`低`
                },

                 InputType:{
                    password:'password',
                    confirmPsw:'password',
                },
            }
        },
        created() {
        },
        component:{
            pswActive(){
                return this.activeClass
            }
        },
        methods:{
            bindIptKeydown(){
                //1. 判断长度
                 let p = this.form.password;
                if(p.length>=6){

                    let safety = 0;

                    if(/\d+/.test(p)) safety++;

                    if(/[a-z]+/.test(p)) safety++;

                    if(/[A-Z]+/.test(p)) safety++;

                    if(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/i.test(p)) safety++;

                    safety == 1 && ( this.step.clas = `low`, this.step.text = `低`);
                    safety == 2 && ( this.step.clas = `center`, this.step.text = `中`);
                    safety >= 3 && ( this.step.clas = `height`, this.step.text = `高`);

                    return safety >3 ? 3 : safety;

                }else{
                    this.step.clas = `low`;
                    this.step.text = `低`;

                    return 1;
                }
            },
            //输入框失去焦点
            bindIptBlur(name){
                VERICATION(name,this.form[name]);
            },
            //提交重置密码请求
            bindResetPwd(){
                let must = ["password","confirmPsw"];

                let flag = true;

                for(let i =0; i<must.length;i++){
                     if(!VERICATION(must[i],this.form[must[i]])) flag = false;
                }

                if(!flag) return;

                //  if(!(/\d+/.test(this.form.password) && /[a-z]+/i.test(this.form.password))) return this.$Message.error(`密码应该包含字母数字特殊字符`);

                if(this.AjaxIng) return;
                 this.AjaxIng = true;

                  //2019-3-4密码强度

                this.form.strength = this.bindIptKeydown();

                resetPassword({
                    info:unescape(location.href.split('=')[1]),
                    newPwd:this.form.password
                }).then(res=>{
                    this.AjaxIng = false;
                   if(res.code==0){
                       
                       this.$Message.success(res.msg);
                       for (const key in this.form) {
                           this.form[key]="";
                       };

                       setTimeout(()=>{
                           location.href = DOMAIN.login;
                       },2000);
                   }else{   
                       this.$Message.error(res.msg);
                   }
                });

            },
            bindChangeIptType(name){
                this.InputType[name] = this.InputType[name]=='password'? 'text':'password';
            }
        }
    }
</script>

<style lang="scss" scoped>
@import './../../../css/common/theme.scss';
    .reset-psw{
        padding-bottom: 60px;
        .cares-button-primary{
            width: 100%;
            margin-top: 40px;
        }
    }

     .el-form{
        p{
            padding: 0;
            text-align: left;
            font-size: 12px;
            color: #666;
            line-height: 18px;
            margin-top: 5px;
            span{
                display: inline-block;
                width: 32%;
                height: 4px;
                border-radius: 2px;
                background-color: #eee;
                box-sizing: border-box;
                vertical-align: middle;
            }
        }
        p.low{
           .one{
               background-color: $--color-primary-danger;
           } 
        }
        p.center{
           .one{
               background-color: $--color-primary-ing
           } 
           .two{
               background-color:$--color-primary-ing
           } 
        }
        p.height{
           span{
               background-color: $--color-primary-success;
           }
        }
        .progress-psw-bar{
            margin-bottom: 10px;
        }
        .bottom{
                padding: 20px 0;
                font-size: 12px;
                color: #666;
                text-align: center;
        }
    }
</style>

